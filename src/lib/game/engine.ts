import { previewImage } from "./preview";
import { WEAPONS } from "../../data/weapons";
import {
  readChallenge,
  challengeLink,
  challengeResult,
  scoreValue,
} from "./challenge";
import { moveVelocity, throwVelocity } from "./controls";
import { followCamera, worldPointer } from "./camera";
import { Terrain } from "./terrain";
import {
  drawBackdrop,
  drawDemo,
  PAGE,
  WORLD_H,
  WORLD_W,
  type Surface,
} from "./scenes";
import { sfx } from "../sound";

type Debris = {
  sx: number;
  sy: number;
  w: number;
  h: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  spin: number;
  life: number;
};
type Shot = {
  x: number;
  y: number;
  tx: number;
  ty: number;
  vx: number;
  vy: number;
  age: number;
  duration: number;
  radius: number;
  kind: string;
  color: string;
};
type Flash = {
  x: number;
  y: number;
  age: number;
  radius: number;
  color: string;
};
const arsenal = WEAPONS.map(w => ({ ...w, radius: w.blastRadius }));
const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

export function startGame(root: HTMLElement) {
  const el = <T extends HTMLElement = HTMLElement>(id: string) =>
    root.querySelector<T>("#" + id)!;
  const canvas = el<HTMLCanvasElement>("game-canvas");
  const ctx = canvas.getContext("2d")!;
  const source = document.createElement("canvas");
  source.width = PAGE.w;
  source.height = PAGE.h;
  const sourceCtx = source.getContext("2d", { willReadFrequently: true })!;
  const page = document.createElement("canvas");
  page.width = PAGE.w;
  page.height = PAGE.h;
  const pageCtx = page.getContext("2d")!;
  const backdrop = document.createElement("canvas");
  backdrop.width = WORLD_W;
  backdrop.height = WORLD_H;
  drawBackdrop(backdrop.getContext("2d")!);
  let pageHeight = PAGE.h,
    worldHeight = PAGE.y + PAGE.h + 280,
    cameraY = 0;
  let browsing = false;
  let pointerScreen: { x: number; y: number } | null = null;
  let terrain = new Terrain(PAGE.w, pageHeight);
  let surfaces: Surface[] = [];
  let mode: "launcher" | "playing" | "paused" | "loading" | "certificate" =
    "launcher";
  let challenge = readChallenge(new URLSearchParams(location.search));
  let challengeOutcome = "";
  let invitationPending = Boolean(challenge);
  let challengeState: "playing" | "won" | "lost" = "playing";
  let selected = 0,
    domain = "Candyland",
    currentTarget = "demo:candy",
    loadId = 0;
  let activeImage: HTMLImageElement | null = null;
  let previewAbort: AbortController | null = null;
  let played = false,
    complete = false,
    clock = 0,
    shotTimer = 0,
    grenadeTimer = 0,
    shake = 0,
    muzzle = 0;
  let frame = 0,
    lastTime = 0,
    accumulator = 0,
    scale = 1,
    offsetX = 0,
    offsetY = 0,
    cssWidth = 0,
    cssHeight = 0,
    dpr = 1,
    portrait = false;
  let pointer = { x: WORLD_W * 0.64, y: PAGE.y + 180 },
    firing = false,
    pointerInside = false;
  let shots: Shot[] = [],
    debris: Debris[] = [],
    flashes: Flash[] = [],
    bursts: { x: number; y: number; delay: number }[] = [];
  let laser: {
    x: number;
    y: number;
    tx: number;
    ty: number;
    life: number;
  } | null = null;
  const keys = new Set<string>();
  const player = {
    x: WORLD_W * 0.35,
    y: PAGE.y,
    vx: 0,
    vy: 0,
    grounded: true,
    fly: false,
    facing: 1,
    walk: 0,
    drop: 0,
    jumpHeld: 0,
  };
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const abort = new AbortController();
  const on = (
    target: EventTarget,
    type: string,
    fn: EventListener,
    options: AddEventListenerOptions = {},
  ) => target.addEventListener(type, fn, { ...options, signal: abort.signal });
  const show = (id: string, visible: boolean) => (el(id).hidden = !visible);
  function clearInput() {
    keys.clear();
    firing = false;
    player.fly = false;
    player.jumpHeld = 0;
  }
  function setMode(next: typeof mode) {
    mode = next;
    clearInput();
    show("arcade-modal", next === "launcher");
    show("loading-modal", next === "loading");
    show("pause-modal", next === "paused");
    show("cert-modal", next === "certificate");
    show("game-hud", played && next !== "launcher" && next !== "loading");
    show("weapon-dock", played && next === "playing");
    show(
      "touch-controls",
      false,
    );
    show("btn-back-game", played);
    if (next === "playing") root.focus({ preventScroll: true });
  }
  function notify(message: string) {
    el("game-status").textContent = message;
    show("game-status", Boolean(message));
  }
  function resize() {
    const rect = canvas.getBoundingClientRect();
    cssWidth = rect.width;
    cssHeight = rect.height;
    dpr = Math.min(2, devicePixelRatio || 1);
    canvas.width = Math.round(cssWidth * dpr);
    canvas.height = Math.round(cssHeight * dpr);
    portrait = cssWidth < 700 && cssHeight > cssWidth;
    scale = portrait
      ? cssHeight / WORLD_H
      : Math.min(cssWidth / WORLD_W, cssHeight / WORLD_H);
    offsetX = (cssWidth - WORLD_W * scale) / 2;
    offsetY = (cssHeight - WORLD_H * scale) / 2;
  }
  const observer = new ResizeObserver(resize);
  observer.observe(root);
  function updateChallenge() {
    show("challenge-status", Boolean(challenge));
    if (!challenge) return;
    const remaining =
      challenge.seconds === null
        ? "No time limit"
        : `${Math.max(0, Math.ceil(challenge.seconds - clock))}s left`;
    el("challenge-status").textContent = challengeOutcome || `Friend challenge: reach ${challenge.score}% · ${remaining}`;
  }
  function updateHUD() {
    updateChallenge();
    const pct =
      terrain.remaining === 0
        ? 100
        : Math.min(99.9, Math.floor(terrain.progress * 10) / 10);
    el("hud-pct").textContent = pct + "%";
    el("hud-bar").style.width = pct + "%";
    el("hud-domain").textContent = domain;
    el("hud-pieces").textContent =
      (terrain.cells.length - terrain.remaining).toLocaleString() +
      " pieces scattered";
    el("session-time").textContent =
      Math.floor(clock / 60)
        .toString()
        .padStart(2, "0") +
      ":" +
      Math.floor(clock % 60)
        .toString()
        .padStart(2, "0");
  }
  function screenshotSurfaces() {
    const data = sourceCtx.getImageData(0, 0, PAGE.w, pageHeight).data;
    const result: Surface[] = [{ x: 0, y: 0, w: PAGE.w }];
    let last = -40;
    for (let y = 45; y < pageHeight - 20; y += 7) {
      let start = -1;
      for (let x = 0; x < PAGE.w; x += 8) {
        const i = (y * PAGE.w + x) * 4;
        const ink = data[i] + data[i + 1] + data[i + 2] < 620;
        if (ink && start < 0) start = x;
        if ((!ink || x >= PAGE.w - 8) && start >= 0) {
          if (x - start > 70 && y - last > 28) {
            result.push({ x: start, y, w: x - start });
            last = y;
          }
          start = -1;
        }
      }
    }
    return result;
  }
  function reset() {
    shots = [];
    debris = [];
    flashes = [];
    bursts = [];
    laser = null;
    clock = 0;
    shake = 0;
    shotTimer = 0;
    grenadeTimer = 0;
    complete = false;
    challengeState = "playing";
    challengeOutcome = "";
    // Preserve the complete screenshot; bound texture memory for unusually long sites.
    const imageScale = activeImage
      ? Math.min(
          PAGE.w / activeImage.naturalWidth,
          12000 / activeImage.naturalHeight,
        )
      : 1;
    pageHeight = activeImage
      ? Math.max(1, Math.ceil(activeImage.naturalHeight * imageScale))
      : PAGE.h;
    worldHeight = Math.max(WORLD_H, PAGE.y + pageHeight + 280);
    cameraY = 0;
    browsing = false;
    show("btn-follow-player", false);
    source.height = page.height = pageHeight;
    terrain = new Terrain(PAGE.w, pageHeight);
    if (activeImage) {
      sourceCtx.fillStyle = "#fff";
      sourceCtx.fillRect(0, 0, PAGE.w, pageHeight);
      // Fit the full page without discarding content below the first viewport.
      const fit = imageScale;
      const w = activeImage.naturalWidth * fit,
        h = activeImage.naturalHeight * fit;
      sourceCtx.drawImage(activeImage, (PAGE.w - w) / 2, 0, w, h);
      surfaces = screenshotSurfaces();
    } else
      surfaces = drawDemo(
        sourceCtx,
        currentTarget.startsWith("demo:") ? currentTarget.slice(5) : "web",
        domain,
      );
    surfaces.sort((a, b) => a.y - b.y);
    pageCtx.clearRect(0, 0, PAGE.w, pageHeight);
    pageCtx.drawImage(source, 0, 0);
    Object.assign(player, {
      x: WORLD_W * 0.35,
      y: PAGE.y,
      vx: 0,
      vy: 0,
      grounded: true,
      fly: false,
      drop: 0,
      jumpHeld: 0,
    });
    updateHUD();
  }
  function validTarget(value: string) {
    if (["demo:candy", "demo:cats", "demo:space"].includes(value)) return value;
    const url = new URL(
      /^https?:\/\//i.test(value) ? value : "https://" + value,
    );
    if (
      !["http:", "https:"].includes(url.protocol) ||
      !url.hostname.includes(".") ||
      url.username ||
      url.password
    )
      throw new Error(
        "Use a public website address, for example wikipedia.org.",
      );
    return url.href;
  }
  function beginRound() {
    played = true;
    if (challenge && invitationPending) {
      invitationPending = false;
      el("pause-title").textContent = "Friend challenge";
      el("pause-description").textContent =
        `Reach ${challenge.score}% destruction${challenge.seconds === null ? "" : ` within ${challenge.seconds} seconds`}. Your timer starts when you accept.`;
      el("btn-resume").textContent = "Accept challenge →";
      setMode("paused");
    } else setMode("playing");
    root.scrollIntoView({ block: "start", behavior: "instant" });
  }
  async function load(value: string) {
    let target: string;
    try {
      target = validTarget(value.trim());
    } catch {
      el("url-error").textContent =
        "Enter a valid website address, such as wikipedia.org.";
      show("url-error", true);
      return;
    }
    show("url-error", false);
    notify("");
    previewAbort?.abort();
    const id = ++loadId;
    el<HTMLInputElement>("modal-url-input").value = target.replace(/^https:\/\//, "");
    const commit = (image: HTMLImageElement | null) => {
      if (challenge) {
        try { if (validTarget(challenge.target) !== target) challenge = null; }
        catch { challenge = null; }
      }
      currentTarget = target;
      activeImage = image;
      domain = target.startsWith("demo:") ? ({candy: "Candyland", cats: "Cat Club", space: "Outer Space"} as Record<string,string>)[target.slice(5)] : new URL(target).hostname;
      reset();
      beginRound();
    };
    if (target.startsWith("demo:")) { commit(null); return; }
    setMode("loading");
    const hostname = new URL(target).hostname;
    el("loading-label").textContent = "Capturing " + hostname + " — this can take up to 45 seconds…";
    const request = new AbortController();
    previewAbort = request;
    const timeout = setTimeout(() => request.abort(), 45000);
    const img = new Image();
    img.crossOrigin = "anonymous";
    try {
      const url = new URL("https://api.microlink.io/");
      url.search = new URLSearchParams({url: target, screenshot: "true", "screenshot.fullPage": "true", "viewport.width": "1300", "viewport.height": "820"}).toString();
      const response = await fetch(url, {signal: request.signal});
      const body = await response.json();
      const imageUrl = previewImage(body, response.status);
      await new Promise<void>((resolve, reject) => {
        if (request.signal.aborted) { reject(new Error("timeout")); return; }
        request.signal.addEventListener("abort", () => { img.src = ""; reject(new Error("timeout")); }, {once:true});
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("The screenshot was generated but its image could not be loaded. Please retry."));
        img.src = imageUrl;
      });
      if (id !== loadId) return;
      commit(img);
    } catch (error) {
      if (id !== loadId) return;
      setMode("launcher");
      const message = request.signal.aborted ? "Capture timed out after 45 seconds. Retry or choose another public URL." : error instanceof TypeError ? "Cannot reach the screenshot service. Check your connection and try again." : error instanceof Error ? error.message : "Unable to load this website. Please retry.";
      el("url-error").textContent = hostname + ": " + message;
      show("url-error", true);
    } finally {
      clearTimeout(timeout);
      img.onload = null;
      img.onerror = null;
      if (previewAbort === request) previewAbort = null;
    }
  }
  function scatter(indices: number[], x: number, y: number, force: number) {
    // Each fragment keeps the actual pixels (letters, borders, photos) of its source cell.
    for (const index of indices) {
      const c = terrain.cell(index);
      pageCtx.clearRect(c.x, c.y, c.w, c.h);
      if (debris.length >= 700) debris.shift();
      const dx = PAGE.x + c.x + c.w / 2 - x,
        dy = PAGE.y + c.y + c.h / 2 - y,
        dist = Math.hypot(dx, dy) || 1;
      debris.push({
        sx: c.x,
        sy: c.y,
        w: c.w,
        h: c.h,
        x: PAGE.x + c.x,
        y: PAGE.y + c.y,
        vx: (dx / dist) * (70 + Math.random() * force),
        vy: (dy / dist) * (80 + Math.random() * force) - 100,
        angle: 0,
        spin: (Math.random() - 0.5) * 12,
        life: 1.1 + Math.random() * 1.1,
      });
    }
  }
  function impact(
    x: number,
    y: number,
    radius: number,
    color = "#ffc7a4",
    islands = true,
  ) {
    const removed = terrain.blast(x - PAGE.x, y - PAGE.y, radius);
    scatter(removed, x, y, radius * 3);
    if (islands && radius > 35) scatter(terrain.detachIslands(), x, y, 70);
    flashes.push({ x, y, age: 0, radius: Math.min(110, radius), color });
    if (removed.length) {
      shake = Math.min(6, radius / 20);
      updateHUD();
    }
    if (terrain.progress > 99.5 && !complete) {
      const rest: number[] = [];
      for (let i = 0; i < terrain.cells.length; i++)
        if (terrain.cells[i]) {
          terrain.cells[i] = 0;
          rest.push(i);
        }
      terrain.remaining = 0;
      scatter(rest, x, y, 160);
      complete = true;
      updateHUD();
      el("pause-title").textContent = "Beautifully destroyed.";
      el("pause-description").textContent =
        `${domain} · 100% demolished. Ready for another round?`;
      setMode("paused");
    }
  }
  function gun() {
    const aim = pointer.x >= player.x ? 1 : -1;
    return { x: player.x + aim * 16, y: player.y - 24 };
  }
  function fire() {
    if (mode !== "playing" || shotTimer > 0) return;
    if (arsenal[selected].id === "grenade") {
      grenade();
      return;
    }
    const w = arsenal[selected],
      g = gun();
    shotTimer = w.delay;
    muzzle = 0.055;
    if (w.id === "magic") {
      laser = { x: g.x, y: g.y, tx: pointer.x, ty: pointer.y, life: 0.095 };
      const distance = Math.hypot(pointer.x - g.x, pointer.y - g.y),
        steps = Math.ceil(distance / 12);
      for (let i = 0; i <= steps; i++) {
        const t = steps ? i / steps : 0;
        const x = g.x + (pointer.x - g.x) * t,
          y = g.y + (pointer.y - g.y) * t;
        scatter(terrain.blast(x - PAGE.x, y - PAGE.y, 9), x, y, 60);
      }
      impact(pointer.x, pointer.y, 19, w.color);
      sfx.playLaser();
      return;
    }
    if (w.id === "shotgun") sfx.playShotgun();
    else if (w.id === "rocket" || w.id === "nuke") sfx.playBounce();
    else sfx.playGunshot();
    const count = w.pellets;
    for (let i = 0; i < count; i++) {
      const spread = w.id === "shotgun" ? 56 : w.id === "gatling" ? 15 : 0;
      const tx = pointer.x + (Math.random() - 0.5) * spread,
        ty = pointer.y + (Math.random() - 0.5) * spread;
      const dist = Math.hypot(tx - g.x, ty - g.y) || 1;
      shots.push({
        x: g.x,
        y: g.y,
        tx,
        ty,
        vx: ((tx - g.x) / dist) * w.speed,
        vy: ((ty - g.y) / dist) * w.speed,
        age: 0,
        duration: dist / w.speed,
        radius: w.radius,
        kind: w.id,
        color: w.color,
      });
    }
    player.vx -=
      (pointer.x >= player.x ? 1 : -1) * (w.id === "shotgun" ? 35 : 8);
  }
  function grenade() {
    if (mode !== "playing" || grenadeTimer > 0) return;
    grenadeTimer = arsenal[7].delay;
    const g = gun(),
      duration = 0.85;
    shots.push({
      x: g.x,
      y: g.y,
      tx: pointer.x,
      ty: pointer.y,
      ...throwVelocity(g.x, g.y, pointer.x, pointer.y, duration),
      age: 0,
      duration,
      radius: arsenal[7].radius,
      kind: "grenade",
      color: "#efa9c2",
    });
    sfx.playBounce();
  }
  function choose(index: number) {
    selected = (index + arsenal.length) % arsenal.length;
    root
      .querySelectorAll<HTMLButtonElement>(".weapon-slot")
      .forEach((b) =>
        b.setAttribute(
          "aria-pressed",
          String(b.dataset.id === arsenal[selected].id),
        ),
      );
    el("weapon-name").textContent = arsenal[selected].name;
  }
  function update(dt: number) {
    clock += dt;
    if (
      challenge?.seconds !== null &&
      challenge?.seconds !== undefined &&
      challengeState === "playing"
    )
      clock = Math.min(clock, challenge.seconds);
    shotTimer = Math.max(0, shotTimer - dt);
    grenadeTimer = Math.max(0, grenadeTimer - dt);
    muzzle = Math.max(0, muzzle - dt);
    shake = Math.max(0, shake - dt * 22);
    player.drop = Math.max(0, player.drop - dt);
    const left = keys.has("KeyA") || keys.has("ArrowLeft"),
      right = keys.has("KeyD") || keys.has("ArrowRight");
    const jump = keys.has("Space") || keys.has("KeyW") || keys.has("ArrowUp");
    const direction = Number(right) - Number(left);
    player.vx = moveVelocity(player.vx, direction, dt);
    if (jump) {
      player.jumpHeld += dt;
      if (player.grounded) {
        player.vy = -400;
        player.grounded = false;
      }
      player.fly = player.jumpHeld > 0.16;
      if (player.fly) player.vy = Math.max(-290, player.vy - 1500 * dt);
    } else {
      player.jumpHeld = 0;
      player.fly = false;
    }
    if (keys.has("KeyS") || keys.has("ArrowDown")) player.drop = 0.18;
    player.vy = Math.min(600, player.vy + 950 * dt);
    const prevY = player.y;
    player.x = clamp(player.x + player.vx * dt, 22, WORLD_W - 22);
    player.y += player.vy * dt;
    player.grounded = false;
    if (player.vy >= 0 && player.drop <= 0) {
      // One-way platforms follow the webpage, and missing cells no longer support the character.
      for (const s of surfaces) {
        const y = PAGE.y + s.y;
        if (
          prevY <= y + 2 &&
          player.y >= y &&
          player.x >= PAGE.x + s.x &&
          player.x <= PAGE.x + s.x + s.w &&
          terrain.solid(player.x - PAGE.x, Math.min(pageHeight - 1, s.y + 3))
        ) {
          player.y = y;
          player.vy = 0;
          player.grounded = true;
          break;
        }
      }
    }
    if (player.y >= worldHeight - 220) {
      player.y = worldHeight - 220;
      player.vy = 0;
      player.grounded = true;
    }
    if (player.y < 58) {
      player.y = 58;
      player.vy = Math.max(0, player.vy);
    }
    if (left || right || jump || keys.has("KeyS") || keys.has("ArrowDown")) browsing = false;
    if (!browsing) cameraY = followCamera(cameraY, player.y, worldHeight, WORLD_H);
    show("btn-follow-player", browsing);
    if (portrait)
      offsetX = clamp(
        cssWidth / 2 - player.x * scale,
        cssWidth - WORLD_W * scale,
        0,
      );
    refreshPointer();
    const screens = Math.ceil(pageHeight / WORLD_H);
    const screen = Math.min(
      screens,
      Math.floor(Math.max(0, (browsing ? cameraY + WORLD_H / 2 : player.y) - PAGE.y) / WORLD_H) + 1,
    );
    el("hud-depth").textContent = `Screen ${screen} / ${screens}`;
    el("travel-hint").textContent =
      player.y >= worldHeight - 221
        ? "Page bottom · Hold Space to fly back up"
        : "Hold S ↓ to descend · Hold Space ↑ to fly";
    player.facing = direction || (pointer.x >= player.x ? 1 : -1);
    player.walk += Math.abs(player.vx) * dt * 0.06;
    if (firing) fire();
    for (let i = shots.length - 1; i >= 0; i--) {
      const p = shots[i];
      p.age += dt;
      if (p.kind === "grenade") p.vy += 650 * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (p.age >= p.duration) {
        const x = p.kind === "grenade" ? p.x : p.tx,
          y = p.kind === "grenade" ? p.y : p.ty;
        impact(x, y, p.radius, p.color);
        if (["rocket", "grenade", "nuke"].includes(p.kind)) sfx.playExplosion();
        if (p.kind === "nuke")
          for (let n = 0; n < arsenal.find(w => w.id === "nuke")!.clusters; n++)
            bursts.push({
              x: x + (Math.random() - 0.5) * 260,
              y: y + (Math.random() - 0.5) * 170,
              delay: 0.07 + n * 0.065,
            });
        shots.splice(i, 1);
      }
    }
    for (let i = bursts.length - 1; i >= 0; i--) {
      bursts[i].delay -= dt;
      if (bursts[i].delay <= 0) {
        impact(bursts[i].x, bursts[i].y, 64, "#fbc4df");
        bursts.splice(i, 1);
      }
    }
    for (let i = debris.length - 1; i >= 0; i--) {
      const d = debris[i];
      d.life -= dt;
      d.vy += 780 * dt;
      d.x += d.vx * dt;
      d.y += d.vy * dt;
      d.angle += d.spin * dt;
      if (d.life <= 0 || d.y > worldHeight + 30) debris.splice(i, 1);
    }
    for (let i = flashes.length - 1; i >= 0; i--) {
      flashes[i].age += dt;
      if (flashes[i].age > 0.32) flashes.splice(i, 1);
    }
    if (laser) {
      laser.life -= dt;
      if (laser.life <= 0) laser = null;
    }
  }
  function checkChallenge() {
    if (!challenge || challengeState !== "playing") return;
    challengeState = challengeResult(challenge, terrain.progress, clock);
    if (challengeState !== "playing") {
      challengeOutcome = challengeState === "won" ? `Challenge won! ${scoreValue(terrain.progress)}% in ${clock.toFixed(1)}s` : `Time up: ${scoreValue(terrain.progress)}% / ${challenge.score}% · Restart to retry`;
      updateChallenge();
      el("pause-title").textContent =
        challengeState === "won" ? "Challenge won!" : "Time is up.";
      el("pause-description").textContent =
        `${scoreValue(terrain.progress)}% destroyed · goal ${challenge.score}% · ${clock.toFixed(1)} seconds. Restart to retry or share your result.`;
      setMode("paused");
    }
  }
  function drawPlayer() {
    const moving = Math.abs(player.vx) > 15,
      step = moving ? Math.sin(player.walk) * 4 : 0;
    ctx.save();
    ctx.translate(Math.round(player.x), Math.round(player.y));
    ctx.scale(player.facing, 1);
    // A small outlined fox astronaut, with separate ears, face, boots and an aiming weapon.
    const pixel = (
      x: number,
      y: number,
      w: number,
      h: number,
      color: string,
    ) => {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, w, h);
    };
    if (player.fly) {
      pixel(-17, -7, 6, 14 + Math.random() * 8, "#f4a873");
      pixel(-15, -5, 3, 9 + Math.random() * 5, "#fff0bd");
    }
    pixel(-17, -28, 8, 23, "#1a1730");
    pixel(-16, -26, 5, 17, "#8882ab");
    pixel(-15, -24, 3, 5, "#b7e6dc");
    pixel(-10, -51, 7, 17, "#392637");
    pixel(5, -51, 7, 17, "#392637");
    pixel(-8, -49, 3, 15, "#f5a577");
    pixel(7, -49, 3, 15, "#f5a577");
    pixel(-13, -37, 27, 25, "#392637");
    pixel(-11, -36, 23, 22, "#e49766");
    pixel(-8, -32, 18, 18, "#ffe8ce");
    pixel(-5, -29, 3, 6, "#44304a");
    pixel(5, -29, 3, 6, "#44304a");
    pixel(-4, -29, 1, 2, "#fff");
    pixel(6, -29, 1, 2, "#fff");
    pixel(0, -20, 4, 2, "#d08a81");
    pixel(-11, -14, 23, 16, "#3a294a");
    pixel(-8, -14, 17, 13, "#aca8d7");
    pixel(-6, -13, 12, 5, "#e4d7f1");
    pixel(-1, -6, 5, 4, "#ecc091");
    pixel(-9 + step, -1, 8, 8, "#3a294a");
    pixel(3 - step, -1, 8, 8, "#3a294a");
    pixel(-11 + step, 4, 10, 4, "#f3c2c1");
    pixel(3 - step, 4, 10, 4, "#f3c2c1");
    ctx.restore();
    const g = gun(),
      angle = Math.atan2(pointer.y - g.y, pointer.x - g.x);
    ctx.save();
    ctx.translate(g.x, g.y);
    ctx.rotate(angle);
    ctx.fillStyle = "#261b35";
    ctx.fillRect(-6, -5, 30, 10);
    ctx.fillStyle = arsenal[selected].color;
    ctx.fillRect(-3, -4, 24, 6);
    ctx.fillStyle = "#faf0df";
    ctx.fillRect(1, -4, 12, 2);
    if (muzzle > 0) {
      ctx.fillStyle = "#ffe8b7";
      ctx.beginPath();
      ctx.moveTo(24, -7);
      ctx.lineTo(39, 0);
      ctx.lineTo(24, 7);
      ctx.fill();
    }
    ctx.restore();
  }
  function draw() {
    if (portrait)
      offsetX = clamp(
        cssWidth / 2 - player.x * scale,
        cssWidth - WORLD_W * scale,
        0,
      );
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = "#19152d";
    ctx.fillRect(0, 0, cssWidth, cssHeight);
    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);
    if (shake && !reduceMotion)
      ctx.translate(
        (Math.random() - 0.5) * shake,
        (Math.random() - 0.5) * shake,
      );
    ctx.drawImage(backdrop, 0, 0);
    ctx.beginPath();
    ctx.rect(0, 0, WORLD_W, WORLD_H);
    ctx.clip();
    ctx.translate(0, -cameraY);
    const pageTop = Math.max(0, cameraY - PAGE.y);
    const visibleHeight = Math.min(
      pageHeight - pageTop,
      cameraY + WORLD_H - PAGE.y - pageTop,
    );
    if (visibleHeight > 0)
      ctx.drawImage(
        page,
        0,
        pageTop,
        PAGE.w,
        visibleHeight,
        PAGE.x,
        PAGE.y + pageTop,
        PAGE.w,
        visibleHeight,
      );
    ctx.fillStyle = "#b7a1c1";
    ctx.fillRect(PAGE.x, worldHeight - 212, PAGE.w, 2);
    for (const d of debris) {
      ctx.save();
      ctx.translate(d.x + d.w / 2, d.y + d.h / 2);
      ctx.rotate(d.angle);
      ctx.globalAlpha = Math.min(1, d.life * 2);
      ctx.drawImage(source, d.sx, d.sy, d.w, d.h, -d.w / 2, -d.h / 2, d.w, d.h);
      ctx.restore();
    }
    if (laser) {
      ctx.strokeStyle = "#bd9df555";
      ctx.lineWidth = 12;
      ctx.beginPath();
      ctx.moveTo(laser.x, laser.y);
      ctx.lineTo(laser.tx, laser.ty);
      ctx.stroke();
      ctx.strokeStyle = "#fff2ff";
      ctx.lineWidth = 3;
      ctx.stroke();
    }
    for (const p of shots) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(Math.atan2(p.vy, p.vx));
      if (p.kind === "grenade") {
        ctx.fillStyle = "#e28ba8";
        ctx.fillRect(-7, -7, 14, 14);
        ctx.fillStyle = "#a6c7a4";
        ctx.fillRect(-3, -10, 6, 5);
      } else if (p.kind === "rocket" || p.kind === "nuke") {
        ctx.fillStyle = "#fde0a7";
        ctx.fillRect(-23, -3, 13, 6);
        ctx.fillStyle = p.color;
        ctx.fillRect(-10, -5, 22, 10);
        ctx.fillStyle = "#fff2dc";
        ctx.fillRect(8, -3, 7, 6);
      } else {
        ctx.fillStyle = p.color;
        ctx.fillRect(-17, -1, 20, 3);
        ctx.fillStyle = "#fff";
        ctx.fillRect(-3, -1, 5, 2);
      }
      ctx.restore();
    }
    for (const f of flashes) {
      const t = f.age / 0.32;
      ctx.save();
      ctx.globalAlpha = (1 - t) * 0.8;
      ctx.strokeStyle = f.color;
      ctx.lineWidth = 3 * (1 - t);
      ctx.beginPath();
      ctx.arc(
        f.x,
        f.y,
        Math.max(1, f.radius * (0.35 + t * 0.8)),
        0,
        Math.PI * 2,
      );
      ctx.stroke();
      if (t < 0.2) {
        ctx.fillStyle = "#fff6e4";
        ctx.beginPath();
        ctx.arc(f.x, f.y, Math.max(2, f.radius * 0.16), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
    drawPlayer();
    if (pointerInside && mode === "playing") {
      ctx.save();
      ctx.translate(pointer.x, pointer.y);
      ctx.strokeStyle = "#fff3e9";
      ctx.lineWidth = 1.5;
      ctx.shadowColor = "#211326";
      ctx.shadowBlur = 3;
      ctx.beginPath();
      ctx.arc(0, 0, 8, 0, Math.PI * 2);
      for (const [x, y] of [
        [-14, 0],
        [10, 0],
        [0, -14],
        [0, 10],
      ]) {
        ctx.moveTo(x, y);
        ctx.lineTo(x === 0 ? 0 : x + 4, y === 0 ? 0 : y + 4);
      }
      ctx.stroke();
      ctx.restore();
    }
    ctx.restore();
  }
  function loop(time: number) {
    frame = requestAnimationFrame(loop);
    const elapsed = Math.min(0.05, (time - lastTime) / 1000 || 0);
    lastTime = time;
    if (mode === "playing") {
      accumulator += elapsed;
      while (accumulator >= 1 / 120) {
        update(1 / 120);
        checkChallenge();
        accumulator -= 1 / 120;
        if (mode !== "playing") {
          accumulator = 0;
          break;
        }
      }
    } else accumulator = 0;
    draw();
    if (mode === "playing" && Math.floor(clock) !== Math.floor(clock - elapsed))
      updateHUD();
  }
  function refreshPointer() {
    if (!pointerScreen) return;
    const p = worldPointer(
      pointerScreen.x,
      pointerScreen.y,
      offsetX,
      offsetY,
      scale,
      cameraY,
    );
    pointer = { x: clamp(p.x, 0, WORLD_W), y: clamp(p.y, 0, worldHeight) };
  }
  function pointerPosition(event: PointerEvent) {
    const r = canvas.getBoundingClientRect();
    pointerScreen = { x: event.clientX - r.left, y: event.clientY - r.top };
    refreshPointer();
  }
  on(canvas, "pointermove", ((e: PointerEvent) => {
    pointerPosition(e);
    pointerInside = true;
  }) as EventListener);
  on(canvas, "pointerdown", ((e: PointerEvent) => {
    if (mode !== "playing") return;
    e.preventDefault();
    root.focus({ preventScroll: true });
    pointerPosition(e);
    canvas.setPointerCapture(e.pointerId);
    if (e.button === 2) grenade();
    else if (e.button === 0) {
      firing = true;
      fire();
    }
  }) as EventListener);
  on(canvas, "pointerup", () => {
    firing = false;
  });
  on(canvas, "pointercancel", () => {
    firing = false;
  });
  on(canvas, "lostpointercapture", () => {
    firing = false;
  });
  on(canvas, "pointerleave", () => {
    pointerInside = false;
  });
  on(canvas, "contextmenu", (e) => e.preventDefault());
  on(
    canvas,
    "wheel",
    ((e: WheelEvent) => {
      if (mode !== "playing") return;
      if (e.ctrlKey) return;
      e.preventDefault();
      const amount = e.deltaY * (e.deltaMode === 1 ? 20 : e.deltaMode === 2 ? WORLD_H : 1) / scale;
      cameraY = clamp(cameraY + amount, 0, Math.max(0, worldHeight - WORLD_H));
      browsing = true;
      show("btn-follow-player", true);
      refreshPointer();
    }) as EventListener,
    { passive: false },
  );
  on(window, "keydown", ((e: KeyboardEvent) => {
    if ((e.target as HTMLElement).closest("input,textarea,select")) return;
    if (
      !root.contains(document.activeElement) &&
      document.activeElement !== document.body
    )
      return;
    if (e.code === "Escape") {
      e.preventDefault();
      if (mode === "playing") setMode("paused");
      else if (mode === "paused" || mode === "certificate") setMode("playing");
      return;
    }
    if (mode !== "playing") return;
    if (
      ["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(
        e.code,
      )
    )
      e.preventDefault();
    keys.add(e.code);
    if (e.code === "KeyG" && !e.repeat) grenade();
    if (/^Digit[1-8]$/.test(e.code)) choose(Number(e.code.slice(-1)) - 1);
  }) as EventListener);
  on(window, "keyup", ((e: KeyboardEvent) => {
    keys.delete(e.code);
  }) as EventListener);
  on(window, "blur", () => {
    if (mode === "playing") setMode("paused");
    else clearInput();
  });
  on(document, "visibilitychange", () => {
    if (document.hidden && mode === "playing") setMode("paused");
  });
  on(el("target-form"), "submit", (e) => {
    e.preventDefault();
    void load(el<HTMLInputElement>("modal-url-input").value);
  });
  root.querySelectorAll<HTMLButtonElement>(".btn-quick-try").forEach((b) =>
    on(b, "click", () => {
      void load(b.dataset.target!);
    }),
  );
  root.querySelectorAll<HTMLButtonElement>(".weapon-slot").forEach((b, i) =>
    on(b, "click", () => {
      choose(i);
      root.focus({ preventScroll: true });
    }),
  );
  root.querySelectorAll<HTMLButtonElement>("[data-key]").forEach((b) => {
    on(b, "pointerdown", ((e: PointerEvent) => {
      e.preventDefault();
      root.focus({ preventScroll: true });
      b.setPointerCapture(e.pointerId);
      keys.add(b.dataset.key!);
    }) as EventListener);
    for (const event of ["pointerup", "pointercancel", "lostpointercapture"])
      on(b, event, () => keys.delete(b.dataset.key!));
  });
  on(el("btn-reopen-modal"), "click", () => setMode("launcher"));
  on(el("btn-new-target"), "click", () => setMode("launcher"));
  on(el("btn-back-game"), "click", () => setMode("playing"));
  on(el("btn-pause"), "click", () => {
    el("pause-title").textContent = "Chaos can wait.";
    el("pause-description").textContent =
      "Your playground is right where you left it.";
    setMode("paused");
  });
  on(el("btn-resume"), "click", () => {
    el("btn-resume").textContent = "Back to the chaos →";
    setMode("playing");
  });
  for (const id of ["btn-repair", "btn-restart"])
    on(el(id), "click", () => {
      reset();
      setMode("playing");
    });
  on(el("btn-cancel-load"), "click", () => {
    ++loadId; previewAbort?.abort(); setMode("launcher");
  });
  on(el("btn-sound"), "click", () => {
    const muted = sfx.toggleMute();
    el("btn-sound").textContent = muted ? "♪" : "♫";
    el("btn-sound").setAttribute(
      "aria-label",
      muted ? "Enable sound" : "Mute sound",
    );
    el("btn-sound").setAttribute("aria-pressed", String(muted));
  });
  on(el("btn-fullscreen"), "click", () => {
    void (async () => {
      try {
        if (document.fullscreenElement) await document.exitFullscreen();
        else await root.requestFullscreen();
      } catch {
        notify("Fullscreen is unavailable in this browser.");
      }
    })();
  });
  function openReport() {
    const cert = el<HTMLCanvasElement>("cert-canvas");
    cert.width = 1200;
    cert.height = 790;
    const c = cert.getContext("2d")!;
    c.fillStyle = "#21182e";
    c.fillRect(0, 0, 1200, 790);
    c.drawImage(canvas, 25, 85, 1150, 590);
    c.fillStyle = "#f7d5df";
    c.font = "bold 28px sans-serif";
    c.fillText("DEMOLITION REPORT", 32, 51);
    c.font = "20px monospace";
    c.fillText(domain, 32, 722);
    c.fillText(
      `${scoreValue(terrain.progress)}% destroyed · ${Math.ceil(clock)} seconds`,
      32,
      756,
    );
    c.fillStyle = "#cdaac6";
    c.font = "16px monospace";
    c.textAlign = "right";
    c.fillText("destroywebsite.com", 1168, 751);
    el("certificate-status").textContent =
      terrain.progress >= 0.1
        ? "Challenge a friend to match your score within your time."
        : "Destroy some of the page first to include a score challenge.";
    el<HTMLInputElement>("challenge-link").value = challengeLink(
      location.href,
      currentTarget,
      terrain.progress,
      clock,
    );
    setMode("certificate");
  }
  on(el("btn-snapshot"), "click", openReport);
  on(el("btn-friend-challenge"), "click", openReport);
  on(el("btn-follow-player"), "click", () => { browsing = false; cameraY = followCamera(cameraY, player.y, worldHeight, WORLD_H); root.focus({preventScroll:true}); });
  on(el("btn-close-cert"), "click", () => setMode("playing"));
  on(el("btn-download-cert"), "click", () => {
    const link = document.createElement("a");
    link.download =
      "demolition-" + domain.replace(/[^a-z0-9.-]/gi, "-") + ".png";
    link.href = el<HTMLCanvasElement>("cert-canvas").toDataURL("image/png");
    link.click();
  });
  on(el("btn-share-link"), "click", () => {
    const url = challengeLink(
      location.href,
      currentTarget,
      terrain.progress,
      clock,
    );
    void navigator.clipboard
      .writeText(url)
      .then(() => {
        el("certificate-status").textContent = "Challenge link copied.";
      })
      .catch(() => {
        el("certificate-status").textContent =
          "Select and copy the link below, or download your certificate.";
      });
  });
  on(el("btn-share-x"), "click", () => {
    const url = new URL("https://twitter.com/intent/tweet");
    url.searchParams.set(
      "text",
      `I destroyed ${scoreValue(terrain.progress)}% of ${domain} in ${Math.ceil(clock)}s. Can you match it?`,
    );
    url.searchParams.set(
      "url",
      challengeLink(location.href, currentTarget, terrain.progress, clock),
    );
    window.open(url.href, "_blank", "noopener,noreferrer");
  });
  reset();
  resize();
  const requestedWeapon = new URLSearchParams(location.search).get("weapon");
  choose(Math.max(0, arsenal.findIndex(w => w.id === requestedWeapon)));
  setMode("launcher");
  el<HTMLInputElement>("modal-url-input").value = (
    root.dataset.initialUrl || "wikipedia.org"
  ).replace(/^https?:\/\//, "");
  const target = new URLSearchParams(location.search).get("target");
  if (target) void load(target);
  frame = requestAnimationFrame(loop);
  const cleanup = () => {
    previewAbort?.abort();
    ++loadId;
    cancelAnimationFrame(frame);
    observer.disconnect();
    abort.abort();
  };
  document.addEventListener("astro:before-swap", cleanup, { once: true });
  if (import.meta.hot) import.meta.hot.dispose(cleanup);
}
