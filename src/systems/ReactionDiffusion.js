import { ISimulation } from "./ISimulation.js";

const DEFAULT_CONFIG = {
  width: 256,
  height: 256,
  feed: 0.055,
  kill: 0.062,
  dA: 1.0,
  dB: 0.5,
  dt: 1.0,
  stepsPerFrame: 8,
  patchCount: 24,
  patchSizeMin: 6,
  patchSizeMax: 20
};

/**
 * Gray-Scott reaction-diffusion simulation on a 2D toroidal grid.
 */
export class ReactionDiffusion extends ISimulation {
  /**
   * @param {Object} [config]
   */
  constructor(config = {}) {
    super();
    this.config = { ...DEFAULT_CONFIG };
    this.A = new Float32Array(0);
    this.B = new Float32Array(0);
    this.nextA = new Float32Array(0);
    this.nextB = new Float32Array(0);
    this.init(config);
  }

  /**
   * @param {Object} [config]
   */
  init(config = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };

    const { width, height } = this.config;
    const size = width * height;

    this.A = new Float32Array(size);
    this.B = new Float32Array(size);
    this.nextA = new Float32Array(size);
    this.nextB = new Float32Array(size);

    this.A.fill(1);
    this.B.fill(0);

    this.#seedRandomPatches();
  }

  /**
   * Advance the simulation by one rendered frame.
   */
  step() {
    const { stepsPerFrame } = this.config;
    for (let i = 0; i < stepsPerFrame; i += 1) {
      this.#singleStep();
    }
  }

  /**
   * @returns {{width:number,height:number,A:Float32Array,B:Float32Array}}
   */
  getState() {
    return {
      width: this.config.width,
      height: this.config.height,
      A: this.A,
      B: this.B
    };
  }

  destroy() {
    this.A = new Float32Array(0);
    this.B = new Float32Array(0);
    this.nextA = new Float32Array(0);
    this.nextB = new Float32Array(0);
  }

  #seedRandomPatches() {
    const { width, height, patchCount, patchSizeMin, patchSizeMax } = this.config;

    for (let i = 0; i < patchCount; i += 1) {
      const cx = Math.floor(Math.random() * width);
      const cy = Math.floor(Math.random() * height);
      const sizeRange = patchSizeMax - patchSizeMin;
      const radius = patchSizeMin + Math.floor(Math.random() * (sizeRange + 1));

      for (let y = -radius; y <= radius; y += 1) {
        for (let x = -radius; x <= radius; x += 1) {
          const nx = (cx + x + width) % width;
          const ny = (cy + y + height) % height;
          const idx = ny * width + nx;
          this.B[idx] = 1;
          this.A[idx] = 0;
        }
      }
    }
  }

  #singleStep() {
    const { width, height, feed, kill, dA, dB, dt } = this.config;

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const idx = y * width + x;
        const a = this.A[idx];
        const b = this.B[idx];

        const lapA = this.#laplacian(this.A, x, y);
        const lapB = this.#laplacian(this.B, x, y);
        const reaction = a * b * b;

        const nextA = a + (dA * lapA - reaction + feed * (1 - a)) * dt;
        const nextB = b + (dB * lapB + reaction - (kill + feed) * b) * dt;

        this.nextA[idx] = Math.max(0, Math.min(1, nextA));
        this.nextB[idx] = Math.max(0, Math.min(1, nextB));
      }
    }

    [this.A, this.nextA] = [this.nextA, this.A];
    [this.B, this.nextB] = [this.nextB, this.B];
  }

  /**
   * 8-neighbor weighted discrete Laplacian with toroidal wrapping.
   * @param {Float32Array} grid
   * @param {number} x
   * @param {number} y
   * @returns {number}
   */
  #laplacian(grid, x, y) {
    const { width, height } = this.config;
    const xm = (x - 1 + width) % width;
    const xp = (x + 1) % width;
    const ym = (y - 1 + height) % height;
    const yp = (y + 1) % height;

    const center = y * width + x;
    const left = y * width + xm;
    const right = y * width + xp;
    const up = ym * width + x;
    const down = yp * width + x;

    const upLeft = ym * width + xm;
    const upRight = ym * width + xp;
    const downLeft = yp * width + xm;
    const downRight = yp * width + xp;

    return (
      -grid[center] +
      0.2 * (grid[left] + grid[right] + grid[up] + grid[down]) +
      0.05 * (grid[upLeft] + grid[upRight] + grid[downLeft] + grid[downRight])
    );
  }
}
