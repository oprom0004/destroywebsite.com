import test from "node:test";
import assert from "node:assert/strict";
import {
  readChallenge,
  challengeLink,
  challengeResult,
} from "../src/lib/game/challenge.ts";
import { moveVelocity, throwVelocity } from "../src/lib/game/controls.ts";
test("challenge share round trip preserves target, score and playable time", () => {
  const url = new URL(
    challengeLink(
      "https://example.com/destroy/google/?old=1#foo",
      "https://site.example/a?b=1&c=2",
      23.456,
      42.2,
    ),
  );
  assert.deepEqual(readChallenge(url.searchParams), {
    target: "https://site.example/a?b=1&c=2",
    score: 23.4,
    seconds: 43,
  });
  assert.equal(url.pathname, "/");
  assert.equal(url.hash, "");
  assert.equal(
    readChallenge(
      new URL(challengeLink("https://example.com", "demo:candy", 0, 0))
        .searchParams,
    ),
    null,
  );
});
test("legacy links, malformed scores and challenge time boundaries", () => {
  assert.deepEqual(
    readChallenge(new URLSearchParams("target=demo:candy&challenge=50")),
    { target: "demo:candy", score: 50, seconds: null },
  );
  for (const raw of [
    "challenge=-1",
    "challenge=101",
    "challenge=NaN",
    "challenge=Infinity",
    "challenge=2&seconds=0",
    "challenge=2&seconds=NaN",
    "challenge=2&seconds=",
  ])
    assert.equal(
      readChallenge(new URLSearchParams("target=demo:candy&" + raw)),
      null,
    );
  const c = { target: "demo:candy", score: 2, seconds: 10 };
  assert.equal(challengeResult(c, 1.9, 9.9), "playing");
  assert.equal(challengeResult(c, 2, 10), "won");
  assert.equal(challengeResult(c, 1.9, 10), "lost");
  assert.equal(challengeResult(c, 2, 10.1), "lost");
});
test("left/right movement is symmetric and reverses independently from aim", () => {
  for (const direction of [-1, 1]) {
    let v = 0,
      x = 0;
    for (let i = 0; i < 120; i++) {
      v = moveVelocity(v, direction, 1 / 120);
      x += v / 120;
    }
    assert.ok(x * direction > 270);
    assert.equal(v, 300 * direction);
    for (let i = 0; i < 40; i++) v = moveVelocity(v, -direction, 1 / 120);
    assert.equal(v, -300 * direction);
    for (let i = 0; i < 20; i++) v = moveVelocity(v, 0, 1 / 120);
    assert.equal(v, 0);
  }
});
test("grenades can arc left or right without depending on player movement", () => {
  for (const tx of [100, 900]) {
    const v = throwVelocity(500, 400, tx, 500);
    assert.equal(Math.sign(v.vx), Math.sign(tx - 500));
    assert.ok(Math.abs(500 + v.vx * 0.85 - tx) < 1e-8);
    assert.ok(Math.abs(400 + v.vy * 0.85 + 0.5 * 650 * 0.85 ** 2 - 500) < 1e-8);
  }
});
