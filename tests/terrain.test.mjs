import test from "node:test";
import assert from "node:assert/strict";
import { Terrain } from "../src/lib/game/terrain.ts";

test("Repeated shots at an empty hole do not increase destruction", () => {
  const t = new Terrain(200, 100);
  const removed = t.blast(100, 50, 32);
  assert.ok(removed.length > 0);
  const progress = t.progress;
  assert.equal(t.solid(100, 50), false);
  assert.deepEqual(t.blast(100, 50, 32), []);
  assert.equal(t.progress, progress);
  assert.equal(t.remaining + removed.length, t.cells.length);
});

test("Shots outside the page cannot damage the page or access invalid cells", () => {
  const t = new Terrain(95, 57);
  assert.deepEqual(t.blast(-80, -80, 15), []);
  assert.equal(t.progress, 0);
  assert.equal(t.solid(-1, 20), false);
  assert.equal(t.solid(95, 20), false);
  const removed = t.blast(0, 0, 30);
  assert.ok(removed.every((i) => i >= 0 && i < t.cells.length));
  assert.deepEqual(t.cell(t.cells.length - 1), { x: 90, y: 50, w: 5, h: 7 });
});

test("A cut-out island falls, while page-edge pieces remain supported", () => {
  const t = new Terrain(70, 70);
  // Cut a moat around a single center cell.
  for (let y = 2; y <= 4; y++)
    for (let x = 2; x <= 4; x++) {
      if (x === 3 && y === 3) continue;
      t.blast(x * 10 + 5, y * 10 + 5, 1);
    }
  assert.equal(t.solid(35, 35), true);
  assert.deepEqual(t.detachIslands(), [24]);
  assert.equal(t.solid(35, 35), false);
  assert.equal(t.solid(5, 5), true);
  assert.deepEqual(t.detachIslands(), []);
});

test("Full destruction terminates at exactly 100 percent", () => {
  const t = new Terrain(1300, 480);
  t.blast(650, 240, 2000);
  assert.equal(t.progress, 100);
  assert.equal(t.remaining, 0);
  assert.deepEqual(t.detachIslands(), []);
  t.blast(650, 240, 2000);
  assert.equal(t.progress, 100);
});
