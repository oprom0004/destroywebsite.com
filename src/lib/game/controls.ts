export function moveVelocity(velocity: number, direction: number, dt: number) {
  const target = direction * 300;
  const step = (direction ? 2400 : 3000) * dt;
  return velocity < target
    ? Math.min(target, velocity + step)
    : Math.max(target, velocity - step);
}
export function throwVelocity(
  x: number,
  y: number,
  tx: number,
  ty: number,
  duration = 0.85,
) {
  return {
    vx: (tx - x) / duration,
    vy: (ty - y - 0.5 * 650 * duration * duration) / duration,
  };
}
