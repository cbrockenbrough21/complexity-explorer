/**
 * Canvas renderer for systems that expose a 2D grid state.
 */
export class CanvasRenderer {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {{ getState: Function }} system
   */
  constructor(canvas, system) {
    this.canvas = canvas;
    this.system = system;
    this.ctx = canvas.getContext("2d");
  }

  /**
   * Draw one frame from the system's current state.
   */
  render() {
    const state = this.system.getState();

    if (!Array.isArray(state) || state.length === 0 || !Array.isArray(state[0])) {
      return;
    }

    const rows = state.length;
    const cols = state[0].length;
    const cellWidth = this.canvas.width / cols;
    const cellHeight = this.canvas.height / rows;

    this.ctx.fillStyle = "#000000";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = "#22c55e";
    for (let y = 0; y < rows; y += 1) {
      for (let x = 0; x < cols; x += 1) {
        if (state[y][x] === 1) {
          this.ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
        }
      }
    }
  }

  /**
   * Clear canvas references.
   */
  destroy() {
    this.ctx = null;
    this.canvas = null;
    this.system = null;
  }
}
