import { ISimulation } from "./ISimulation.js";

const DEFAULT_CONFIG = {
  width: 80,
  height: 80,
  cellSize: 8,
  initialDensity: 0.3,
  stepsPerSecond: 10
};

/**
 * Conway's Game of Life on a toroidal grid.
 */
export class GameOfLife extends ISimulation {
  /**
   * @param {Object} [config]
   */
  constructor(config = {}) {
    super();
    this.config = { ...DEFAULT_CONFIG };
    this.grid = [];
    this.init(config);
  }

  /**
   * @param {Object} [config]
   * @param {number} [config.width]
   * @param {number} [config.height]
   * @param {number} [config.cellSize]
   * @param {number} [config.initialDensity]
   * @param {number} [config.stepsPerSecond]
   * @param {number[][]} [config.seedGrid]
   */
  init(config = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };

    if (Array.isArray(config.seedGrid) && config.seedGrid.length > 0) {
      this.grid = config.seedGrid.map((row) => row.map((cell) => (cell ? 1 : 0)));
      this.config.height = this.grid.length;
      this.config.width = this.grid[0].length;
      return;
    }

    const { width, height, initialDensity } = this.config;
    this.grid = Array.from({ length: height }, () =>
      Array.from({ length: width }, () => (Math.random() < initialDensity ? 1 : 0))
    );
  }

  /**
   * Advance one generation using Conway's rules.
   */
  step() {
    const { width, height } = this.config;
    const next = Array.from({ length: height }, () => Array.from({ length: width }, () => 0));

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const alive = this.grid[y][x] === 1;
        const neighbors = this.#countNeighbors(x, y);

        if (alive && (neighbors === 2 || neighbors === 3)) {
          next[y][x] = 1;
        } else if (!alive && neighbors === 3) {
          next[y][x] = 1;
        }
      }
    }

    this.grid = next;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.grid;
  }

  /**
   * No resources to release yet; method exists to satisfy interface contract.
   */
  destroy() {
    this.grid = [];
  }

  /**
   * Count live neighbors with toroidal wrapping at boundaries.
   * @param {number} x
   * @param {number} y
   * @returns {number}
   */
  #countNeighbors(x, y) {
    const { width, height } = this.config;
    let total = 0;

    for (let dy = -1; dy <= 1; dy += 1) {
      for (let dx = -1; dx <= 1; dx += 1) {
        if (dx === 0 && dy === 0) {
          continue;
        }

        const nx = (x + dx + width) % width;
        const ny = (y + dy + height) % height;
        total += this.grid[ny][nx];
      }
    }

    return total;
  }
}
