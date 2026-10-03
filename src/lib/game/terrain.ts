/** A deterministic damage grid. Removed cells never count twice. */
export class Terrain {
  readonly columns: number;
  readonly rows: number;
  readonly cells: Uint8Array;
  readonly width: number;
  readonly height: number;
  readonly size: number;
  remaining: number;
  constructor(width: number, height: number, size = 10) {
    this.width = width;
    this.height = height;
    this.size = size;
    this.columns = Math.ceil(width / size);
    this.rows = Math.ceil(height / size);
    this.cells = new Uint8Array(this.columns * this.rows).fill(1);
    this.remaining = this.cells.length;
  }
  get progress() {
    return (1 - this.remaining / this.cells.length) * 100;
  }
  solid(x: number, y: number) {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) return false;
    return (
      this.cells[
        Math.floor(y / this.size) * this.columns + Math.floor(x / this.size)
      ] === 1
    );
  }
  cell(index: number) {
    const x = (index % this.columns) * this.size;
    const y = Math.floor(index / this.columns) * this.size;
    return {
      x,
      y,
      w: Math.min(this.size, this.width - x),
      h: Math.min(this.size, this.height - y),
    };
  }
  blast(x: number, y: number, radius: number) {
    const removed: number[] = [];
    const x0 = Math.max(0, Math.floor((x - radius) / this.size));
    const x1 = Math.min(this.columns - 1, Math.floor((x + radius) / this.size));
    const y0 = Math.max(0, Math.floor((y - radius) / this.size));
    const y1 = Math.min(this.rows - 1, Math.floor((y + radius) / this.size));
    for (let row = y0; row <= y1; row++)
      for (let col = x0; col <= x1; col++) {
        const index = row * this.columns + col;
        const cx = col * this.size + this.size / 2;
        const cy = row * this.size + this.size / 2;
        if (this.cells[index] && Math.hypot(cx - x, cy - y) <= radius) {
          this.cells[index] = 0;
          this.remaining--;
          removed.push(index);
        }
      }
    return removed;
  }
  /** Release small islands after a cut; the outer edge holds the page in place. */
  detachIslands(limit = 80) {
    const seen = new Uint8Array(this.cells.length);
    const removed: number[] = [];
    for (let start = 0; start < this.cells.length; start++) {
      if (!this.cells[start] || seen[start]) continue;
      const island = [start];
      seen[start] = 1;
      let anchored = false;
      for (let q = 0; q < island.length; q++) {
        const n = island[q],
          col = n % this.columns,
          row = Math.floor(n / this.columns);
        if (
          col === 0 ||
          row === 0 ||
          col === this.columns - 1 ||
          row === this.rows - 1
        )
          anchored = true;
        const neighbors = [
          col > 0 ? n - 1 : -1,
          col < this.columns - 1 ? n + 1 : -1,
          row > 0 ? n - this.columns : -1,
          row < this.rows - 1 ? n + this.columns : -1,
        ];
        for (const next of neighbors)
          if (next >= 0 && this.cells[next] && !seen[next]) {
            seen[next] = 1;
            island.push(next);
          }
      }
      if (!anchored && island.length <= limit)
        for (const index of island) {
          this.cells[index] = 0;
          this.remaining--;
          removed.push(index);
        }
    }
    return removed;
  }
}
