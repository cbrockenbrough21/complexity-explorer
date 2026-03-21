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

    if (this.#isReactionDiffusionState(state)) {
      this.#drawReactionDiffusion(state);
      return;
    }

    if (this.#isLSystemState(state)) {
      this.#drawLSystem(state);
      return;
    }

    if (this.#isBoidsState(state)) {
      this.#drawBoids(state);
      return;
    }

    if (!this.#isGridState(state)) {
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

  #isGridState(state) {
    return Array.isArray(state) && state.length > 0 && Array.isArray(state[0]);
  }

  #isReactionDiffusionState(state) {
    return (
      !!state &&
      typeof state.width === "number" &&
      typeof state.height === "number" &&
      state.A instanceof Float32Array &&
      state.B instanceof Float32Array
    );
  }

  #isLSystemState(state) {
    return !!state && typeof state.string === "string" && typeof state.drawParams === "object";
  }

  #isBoidsState(state) {
    return (
      Array.isArray(state) &&
      (state.length === 0 ||
        (typeof state[0].x === "number" &&
          typeof state[0].y === "number" &&
          typeof state[0].vx === "number" &&
          typeof state[0].vy === "number"))
    );
  }

  #drawReactionDiffusion(state) {
    const { width, height, A, B } = state;
    const imageData = this.ctx.createImageData(width, height);

    for (let i = 0; i < width * height; i += 1) {
      const val = Math.max(0, Math.min(255, Math.floor((A[i] - B[i]) * 255)));
      const idx = i * 4;
      imageData.data[idx] = val;
      imageData.data[idx + 1] = Math.max(0, Math.min(255, val + 30));
      imageData.data[idx + 2] = 220;
      imageData.data[idx + 3] = 255;
    }

    this.ctx.putImageData(imageData, 0, 0);
  }

  #drawLSystem(state) {
    const { string, drawParams } = state;
    const {
      angle = 25,
      stepLength = 4,
      startX = 0.5,
      startY = 0.95,
      startAngleDeg = -90
    } = drawParams;
    const isAlgae = drawParams.preset === "Algae";

    this.ctx.fillStyle = "#0b1020";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.strokeStyle = "#9ae6b4";
    this.ctx.lineWidth = 1;

    let x = startX * this.canvas.width;
    let y = startY * this.canvas.height;
    let heading = (startAngleDeg * Math.PI) / 180;
    const turn = (angle * Math.PI) / 180;
    const stack = [];
    const MAX_SEGMENTS = 100000;
    let segments = 0;

    this.ctx.beginPath();
    this.ctx.moveTo(x, y);

    for (let i = 0; i < string.length; i += 1) {
      const c = string[i];

      if (c === "F" || c === "G" || c === "A" || c === "B") {
        const nx = x + Math.cos(heading) * stepLength;
        const ny = y + Math.sin(heading) * stepLength;
        this.ctx.lineTo(nx, ny);
        x = nx;
        y = ny;

        // The canonical Algae grammar has no +/- tokens, so add a turtle
        // interpretation to avoid collapsing into a vertical line.
        if (isAlgae && c === "A") {
          heading += turn;
          this.ctx.moveTo(x, y);
        } else if (isAlgae && c === "B") {
          heading -= turn;
          this.ctx.moveTo(x, y);
        }

        segments += 1;
        if (segments >= MAX_SEGMENTS) {
          break;
        }
      } else if (c === "+") {
        heading += turn;
        this.ctx.moveTo(x, y);
      } else if (c === "-") {
        heading -= turn;
        this.ctx.moveTo(x, y);
      } else if (c === "[") {
        stack.push({ x, y, heading });
      } else if (c === "]") {
        const saved = stack.pop();
        if (saved) {
          x = saved.x;
          y = saved.y;
          heading = saved.heading;
          this.ctx.moveTo(x, y);
        }
      }
    }

    this.ctx.stroke();
  }

  #drawBoids(state) {
    this.ctx.fillStyle = "#081018";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "#f8fafc";

    for (const boid of state) {
      const angle = Math.atan2(boid.vy, boid.vx);
      this.ctx.save();
      this.ctx.translate(boid.x, boid.y);
      this.ctx.rotate(angle);
      this.ctx.beginPath();
      this.ctx.moveTo(8, 0);
      this.ctx.lineTo(-6, -4);
      this.ctx.lineTo(-6, 4);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.restore();
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
