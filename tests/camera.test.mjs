import test from "node:test";
import assert from "node:assert/strict";
import { followCamera, worldPointer } from "../src/lib/game/camera.ts";
import { Terrain } from "../src/lib/game/terrain.ts";

test("camera follows across screens and returns upward without leaving level bounds", () => {
  let camera = 0;
  for (let feet = 230; feet <= 2990; feet += 5) {
    const next = followCamera(camera, feet, 3090, 820);
    assert.ok(next >= camera && next - camera <= 5);
    assert.ok(next <= 2270);
    camera = next;
  }
  assert.equal(camera, 2270);
  for (let feet = 2990; feet >= 58; feet -= 5)
    camera = followCamera(camera, feet, 3090, 820);
  assert.equal(camera, 0);
  assert.equal(followCamera(0, 500, 600, 820), 0);
});

test("stationary screen aim tracks camera and destroys the intended lower page cells", () => {
  const terrain = new Terrain(1300, 2700);
  const first = worldPointer(400, 300, 0, 0, 0.5, 0);
  const lower = worldPointer(400, 300, 0, 0, 0.5, 1640);
  assert.equal(lower.y - first.y, 1640);
  terrain.blast(first.x - 70, first.y - 230, 30);
  terrain.blast(lower.x - 70, lower.y - 230, 30);
  assert.equal(terrain.solid(730, 370), false);
  assert.equal(terrain.solid(730, 2010), false);
  assert.equal(terrain.solid(730, 1190), true);
  assert.ok(terrain.progress > 0 && terrain.progress < 1);
});
