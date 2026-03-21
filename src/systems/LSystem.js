import { ISimulation } from "./ISimulation.js";

const PRESETS = {
  Fern: {
    axiom: "X",
    rules: {
      X: "F+[[X]-X]-F[-FX]+X",
      F: "FF"
    },
    iterations: 5,
    angle: 25,
    stepLength: 4
  },
  Algae: {
    axiom: "A",
    rules: {
      A: "AB",
      B: "A"
    },
    iterations: 7,
    angle: 25,
    stepLength: 6
  },
  Bush: {
    axiom: "F",
    rules: {
      F: "FF-[-F+F+F]+[+F-F-F]"
    },
    iterations: 4,
    angle: 22.5,
    stepLength: 4
  },
  "Dragon curve": {
    axiom: "FX",
    rules: {
      X: "X+YF+",
      Y: "-FX-Y"
    },
    iterations: 10,
    angle: 90,
    stepLength: 6
  },
  "Sierpinski triangle": {
    axiom: "F-G-G",
    rules: {
      F: "F-G+F+G-F",
      G: "GG"
    },
    iterations: 6,
    angle: 120,
    stepLength: 6
  }
};

const DEFAULT_CONFIG = {
  preset: "Fern",
  iterations: 5,
  angle: 25
};

const MAX_OUTPUT_LENGTH = 120000;

const MAX_ITERATIONS_BY_PRESET = {
  Fern: 6,
  Algae: 16,
  Bush: 5,
  "Dragon curve": 15,
  "Sierpinski triangle": 8
};

/**
 * Deterministic string rewriting system (L-system).
 */
export class LSystem extends ISimulation {
  /**
   * @param {Object} [config]
   */
  constructor(config = {}) {
    super();
    this.config = { ...DEFAULT_CONFIG };
    this.currentString = "";
    this.drawParams = {
      angle: 25,
      stepLength: 4,
      startX: 0,
      startY: 0,
      startAngleDeg: -90
    };
    this.init(config);
  }

  /**
   * @param {Object} [config]
   * @param {string} [config.preset]
   * @param {number} [config.iterations]
   * @param {number} [config.angle]
   */
  init(config = {}) {
    const hasPresetOverride = Object.prototype.hasOwnProperty.call(config, "preset");
    const presetName = PRESETS[config.preset] ? config.preset : this.config.preset;
    const preset = PRESETS[presetName];

    const rawIterations = Object.prototype.hasOwnProperty.call(config, "iterations")
      ? config.iterations
      : hasPresetOverride
        ? preset.iterations
        : this.config.iterations;
    const iterations = clampInteger(
      rawIterations,
      1,
      MAX_ITERATIONS_BY_PRESET[presetName] ?? 8,
      preset.iterations
    );

    const rawAngle = Object.prototype.hasOwnProperty.call(config, "angle")
      ? config.angle
      : hasPresetOverride
        ? preset.angle
        : this.config.angle;
    const angle = clampNumber(rawAngle, 1, 180, preset.angle);

    this.config = {
      preset: presetName,
      iterations,
      angle
    };

    let out = preset.axiom;
    let truncated = false;
    for (let i = 0; i < this.config.iterations; i += 1) {
      const rewriteResult = this.#rewriteWithLimit(out, preset.rules, MAX_OUTPUT_LENGTH);
      out = rewriteResult.output;
      if (rewriteResult.truncated) {
        truncated = true;
        break;
      }
    }

    this.currentString = out;
    this.drawParams = {
      angle: this.config.angle,
      stepLength: preset.stepLength,
      startX: 0.5,
      startY: 0.95,
      startAngleDeg: -90,
      preset: presetName,
      truncated,
      symbolCount: out.length
    };
  }

  /**
   * L-systems are static once expanded for given config.
   */
  step() {}

  /**
   * @returns {{string:string,drawParams:Object}}
   */
  getState() {
    return {
      string: this.currentString,
      drawParams: this.drawParams
    };
  }

  destroy() {
    this.currentString = "";
  }

  /**
   * @returns {string[]}
   */
  static getPresetNames() {
    return Object.keys(PRESETS);
  }

  /**
   * @param {string} presetName
   * @returns {{defaultIterations:number,defaultAngle:number,maxIterations:number}}
   */
  static getPresetMeta(presetName) {
    const safeName = PRESETS[presetName] ? presetName : DEFAULT_CONFIG.preset;
    const preset = PRESETS[safeName];
    return {
      defaultIterations: preset.iterations,
      defaultAngle: preset.angle,
      maxIterations: MAX_ITERATIONS_BY_PRESET[safeName] ?? 8
    };
  }

  #rewriteWithLimit(input, rules, maxLength) {
    let next = "";
    for (let i = 0; i < input.length; i += 1) {
      const ch = input[i];
      next += rules[ch] ?? ch;

      if (next.length >= maxLength) {
        return {
          output: next.slice(0, maxLength),
          truncated: true
        };
      }
    }
    return {
      output: next,
      truncated: false
    };
  }
}

function clampInteger(value, min, max, fallback) {
  const n = Number(value);
  if (!Number.isFinite(n)) {
    return fallback;
  }
  return Math.max(min, Math.min(max, Math.floor(n)));
}

function clampNumber(value, min, max, fallback) {
  const n = Number(value);
  if (!Number.isFinite(n)) {
    return fallback;
  }
  return Math.max(min, Math.min(max, n));
}
