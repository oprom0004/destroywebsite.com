export const WORLD_W = 1440;
export const WORLD_H = 820;
export const PAGE = { x: 70, y: 115, w: 1300, h: 2700 };
export type Surface = { x: number; y: number; w: number };

export function drawBackdrop(ctx: CanvasRenderingContext2D) {
  const grad = ctx.createLinearGradient(0, 0, 0, WORLD_H);
  grad.addColorStop(0, "#15122e");
  grad.addColorStop(0.56, "#35204c");
  grad.addColorStop(1, "#a74762");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, WORLD_W, WORLD_H);
  for (let i = 0; i < 100; i++) {
    const x = (i * 373 + 31) % WORLD_W,
      y = (i * 149 + 27) % 450;
    ctx.fillStyle = i % 5 === 0 ? "#ffd8b5" : "#b5a2d8";
    ctx.globalAlpha = 0.25 + (i % 4) * 0.15;
    ctx.fillRect(x, y, i % 7 === 0 ? 3 : 2, 2);
  }
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#fcb5a1";
  ctx.beginPath();
  ctx.arc(1110, 185, 55, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#372149";
  ctx.beginPath();
  ctx.arc(1087, 168, 53, 0, Math.PI * 2);
  ctx.fill();
  for (let layer = 0; layer < 3; layer++) {
    ctx.fillStyle = ["#352749", "#27223e", "#151629"][layer];
    ctx.beginPath();
    ctx.moveTo(0, WORLD_H);
    for (let x = 0; x <= WORLD_W + 60; x += 60) {
      const y =
        545 +
        layer * 65 -
        Math.sin(x * 0.009 + layer * 3) * 68 -
        Math.cos(x * 0.019) * 28;
      ctx.lineTo(x, Math.round(y / 8) * 8);
      ctx.lineTo(x + 30, Math.round(y / 8) * 8);
    }
    ctx.lineTo(WORLD_W, WORLD_H);
    ctx.closePath();
    ctx.fill();
  }
  for (let i = 0; i < 24; i++) {
    const x = i * 67 - 10,
      h = 55 + ((i * 37) % 120),
      y = WORLD_H - h;
    ctx.fillStyle = i % 2 ? "#111322" : "#19182d";
    ctx.fillRect(x, y, 44, h);
    ctx.fillStyle = "#edab82";
    for (let r = 0; r < h / 14 - 1; r++)
      for (let c = 0; c < 3; c++) {
        if ((r * 7 + c * 3 + i) % 5 < 2)
          ctx.fillRect(x + 7 + c * 11, y + 10 + r * 14, 4, 6);
      }
  }
}

export function drawDemo(
  ctx: CanvasRenderingContext2D,
  theme: string,
  domain = "",
): Surface[] {
  const w = PAGE.w,
    h = PAGE.h;
  const space = theme === "space",
    cats = theme === "cats",
    web = theme === "web";
  const color = space
    ? "#6551b8"
    : cats
      ? "#b56748"
      : web
        ? "#305e92"
        : "#d6498d";
  ctx.fillStyle = space
    ? "#171932"
    : cats
      ? "#fff9ee"
      : web
        ? "#f7f9fc"
        : "#fff8fc";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, w, 47);
  ctx.fillStyle = "#fff";
  ctx.font = "bold 17px system-ui";
  ctx.fillText(
    space
      ? "✦  ORBIT JOURNAL"
      : cats
        ? "✦  THE CAT COLLECTIVE"
        : web
          ? domain.toUpperCase()
          : "✦  SUGAR RUSH",
    30,
    30,
  );
  ctx.font = "13px system-ui";
  ctx.fillText("Discover       Stories       Our world", 845, 29);
  ctx.fillStyle = "#ffffff33";
  ctx.fillRect(1160, 10, 112, 28);
  ctx.fillStyle = "#fff";
  ctx.fillText("Explore →", 1180, 29);
  ctx.fillStyle = space ? "#c2b4fa" : color;
  ctx.font = "bold 11px monospace";
  ctx.fillText(
    space
      ? "FIELD NOTES FROM A FARAWAY GALAXY"
      : cats
        ? "SMALL PAWS. BIG PERSONALITIES."
        : web
          ? "GENERATED PRACTICE PAGE"
          : "A LITTLE WORLD OF SWEET POSSIBILITIES",
    35,
    85,
  );
  ctx.font = "bold 47px system-ui";
  ctx.fillStyle = space ? "#f5f2ff" : "#39243d";
  ctx.fillText(
    space
      ? "Stay curious."
      : cats
        ? "Life is better"
        : web
          ? "Make a little chaos."
          : "Life is sweet.",
    33,
    144,
  );
  ctx.fillText(
    space
      ? "Go a little further."
      : cats
        ? "with a little chaos."
        : web
          ? "Leave no pixels behind."
          : "Make it a mess.",
    33,
    200,
  );
  ctx.font = "15px system-ui";
  ctx.fillStyle = space ? "#aaa8cc" : "#847383";
  ctx.fillText(
    space
      ? "Beautiful things are waiting beyond the ordinary."
      : cats
        ? "Meet the tiny troublemakers who run this place."
        : web
          ? "The live preview could not be loaded. This is a demo."
          : "Handmade happiness. Best enjoyed with a little chaos.",
    36,
    232,
  );
  ctx.fillStyle = color;
  ctx.fillRect(36, 258, 168, 38);
  ctx.fillStyle = "#fff";
  ctx.font = "bold 13px system-ui";
  ctx.fillText("Take a look around  →", 51, 282);
  // An illustrated feature card, drawn locally rather than loaded over the network.
  ctx.fillStyle = space ? "#302b59" : cats ? "#fae4cb" : "#f9d8ea";
  ctx.fillRect(795, 70, 470, 230);
  ctx.save();
  ctx.translate(1030, 181);
  if (space) {
    ctx.fillStyle = "#e9b393";
    ctx.beginPath();
    ctx.arc(0, 0, 66, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#c1adf4";
    ctx.lineWidth = 17;
    ctx.beginPath();
    ctx.ellipse(0, 0, 123, 26, -0.4, 0, Math.PI * 2);
    ctx.stroke();
  } else if (cats) {
    ctx.fillStyle = "#d8935b";
    ctx.beginPath();
    ctx.moveTo(-78, -61);
    ctx.lineTo(-28, -28);
    ctx.lineTo(28, -28);
    ctx.lineTo(78, -61);
    ctx.lineTo(73, 45);
    ctx.quadraticCurveTo(0, 100, -73, 45);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#442e38";
    ctx.fillRect(-41, 2, 9, 17);
    ctx.fillRect(33, 2, 9, 17);
    ctx.fillRect(-6, 24, 12, 8);
  } else {
    ctx.rotate(-0.3);
    ctx.fillStyle = "#fff";
    ctx.fillRect(-7, 0, 14, 101);
    ctx.fillStyle = "#e968a9";
    ctx.beginPath();
    ctx.arc(0, -23, 73, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#fff0af";
    ctx.lineWidth = 13;
    ctx.beginPath();
    for (let i = 0; i < 90; i++) {
      const a = i * 0.16,
        r = i * 0.7;
      const x = Math.cos(a) * r,
        y = -23 + Math.sin(a) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.restore();
  const titles = space
    ? ["The quiet of Saturn", "Postcards from Mars", "A sky full of stories"]
    : cats
      ? ["Meet Miso", "A professional napper", "The midnight zoomies"]
      : ["Lollipop afternoons", "The cupcake club", "A sprinkle of magic"];
  for (let i = 0; i < 3; i++) {
    const x = 35 + i * 422;
    ctx.fillStyle = space ? "#232541" : "#fff";
    ctx.fillRect(x, 330, 387, 121);
    ctx.strokeStyle = space ? "#424064" : "#eadde6";
    ctx.lineWidth = 1;
    ctx.strokeRect(x, 330, 387, 121);
    ctx.fillStyle = color;
    ctx.fillRect(x, 330, 5, 121);
    ctx.font = "bold 18px system-ui";
    ctx.fillStyle = space ? "#f2ecff" : "#492d42";
    ctx.fillText(titles[i], x + 22, 368);
    ctx.font = "13px system-ui";
    ctx.fillStyle = space ? "#a4a0bd" : "#9b8895";
    ctx.fillText("Something wonderful, just around the corner.", x + 22, 395);
    ctx.fillStyle = color;
    ctx.font = "bold 12px system-ui";
    ctx.fillText("READ THE STORY  ↗", x + 22, 427);
  }
  const lowerSurfaces: Surface[] = [];
  const foreground = space ? "#f2ecff" : "#492d42";
  const muted = space ? "#aaa8cc" : "#847383";
  for (let section = 0; section < 3; section++) {
    const y = 520 + section * 640;
    ctx.fillStyle = color;
    ctx.fillRect(35, y, 1230, 3);
    ctx.font = "bold 12px monospace";
    ctx.fillText(
      `0${section + 2} / ${["THE COLLECTION", "BEHIND THE SCENES", "MORE TO DISCOVER"][section]}`,
      35,
      y + 40,
    );
    ctx.fillStyle = foreground;
    ctx.font = "bold 40px system-ui";
    ctx.fillText(
      [
        "A whole world below the fold.",
        "Every little detail has a story.",
        "Keep exploring.",
      ][section],
      35,
      y + 100,
    );
    lowerSurfaces.push({ x: 35, y: y + 65, w: 900 });
    for (let card = 0; card < 3; card++) {
      const x = 35 + card * 422;
      ctx.fillStyle = space ? "#302b59" : cats ? "#fae4cb" : "#f9d8ea";
      ctx.fillRect(x, y + 145, 387, 260);
      ctx.fillStyle = color;
      ctx.beginPath();
      const cx = x + 193,
        cy = y + 275;
      const sides = 5 + section + card;
      for (let n = 0; n <= sides; n++) {
        const a = (n / sides) * Math.PI * 2 - Math.PI / 2;
        const px = cx + Math.cos(a) * (60 + card * 12),
          py = cy + Math.sin(a) * (60 + card * 12);
        if (n === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.fill();
      ctx.fillStyle = space ? "#232541" : "#ffffff";
      ctx.fillRect(x, y + 405, 387, 135);
      ctx.fillStyle = foreground;
      ctx.font = "bold 20px system-ui";
      ctx.fillText(titles[(card + section) % 3], x + 20, y + 441);
      ctx.fillStyle = muted;
      ctx.font = "14px system-ui";
      ctx.fillText(
        [
          "Made for curious minds.",
          "Good things take a little imagination.",
          "There is always more around the corner.",
        ][section],
        x + 20,
        y + 471,
      );
      ctx.fillStyle = color;
      ctx.font = "bold 12px monospace";
      ctx.fillText("EXPLORE THE DETAILS →", x + 20, y + 510);
      lowerSurfaces.push({ x, y: y + 145, w: 387 }, { x, y: y + 405, w: 387 });
    }
  }
  ctx.fillStyle = color;
  ctx.fillRect(0, 2490, w, 210);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 34px system-ui";
  ctx.fillText("You made it all the way down.", 40, 2555);
  ctx.font = "16px system-ui";
  ctx.fillText("A little more curiosity. A little more chaos.", 40, 2600);
  ctx.font = "12px monospace";
  ctx.fillText(
    "OUR WORLD     /     STORIES     /     BACK TO THE TOP ↑",
    40,
    2660,
  );
  lowerSurfaces.push({ x: 0, y: 2490, w });
  return [
    ...lowerSurfaces,
    { x: 0, y: 0, w },
    { x: 36, y: 258, w: 168 },
    { x: 795, y: 70, w: 470 },
    ...Array.from({ length: 3 }, (_, i) => ({
      x: 35 + i * 422,
      y: 330,
      w: 387,
    })),
  ];
}

