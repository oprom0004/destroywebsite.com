/** View coordinates stay separate from the persistent webpage terrain. */
export function followCamera(
  current: number,
  feet: number,
  height: number,
  viewport: number,
) {
  const top = viewport * 0.32;
  const bottom = viewport * 0.62;
  const target =
    feet < current + top
      ? feet - top
      : feet > current + bottom
        ? feet - bottom
        : current;
  return Math.max(0, Math.min(Math.max(0, height - viewport), target));
}

export function worldPointer(
  x: number,
  y: number,
  offsetX: number,
  offsetY: number,
  scale: number,
  cameraY: number,
) {
  return { x: (x - offsetX) / scale, y: (y - offsetY) / scale + cameraY };
}
