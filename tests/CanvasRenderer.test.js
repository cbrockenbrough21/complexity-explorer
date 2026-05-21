import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { createCanvas } from "canvas";
import { CanvasRenderer } from "../src/renderer/CanvasRenderer.js";

function makeCanvas(width = 100, height = 100) {
  return createCanvas(width, height);
}

// #drawReactionDiffusion calls document.createElement("canvas") internally.
// Stub it with the headless canvas implementation for the duration of these tests.
beforeEach(() => {
  vi.stubGlobal("document", {
    createElement: (tag) => {
      if (tag === "canvas") return createCanvas(1, 1);
      throw new Error(`Unexpected document.createElement("${tag}")`);
    }
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

function makeSystem(type) {
  const stateMap = {
    'game-of-life': {
      type: 'game-of-life',
      grid: [[0, 1], [1, 0]]
    },
    'reaction-diffusion': {
      type: 'reaction-diffusion',
      width: 2,
      height: 2,
      A: new Float32Array([1, 0.8, 0.9, 1]),
      B: new Float32Array([0, 0.2, 0.1, 0])
    },
    'l-system': {
      type: 'l-system',
      string: "F",
      drawParams: { angle: 25, stepLength: 4, startX: 0.5, startY: 0.95, startAngleDeg: -90 }
    },
    'boids': {
      type: 'boids',
      agents: [{ x: 50, y: 50, vx: 1, vy: 0 }]
    }
  };
  return { getState: () => stateMap[type], config: { width: 100, height: 100 } };
}

describe("CanvasRenderer type routing", () => {
  it("routes 'game-of-life' to the grid drawing path", () => {
    const canvas = makeCanvas();
    const system = makeSystem('game-of-life');
    const renderer = new CanvasRenderer(canvas, system);
    const spy = vi.spyOn(renderer.ctx, 'fillRect');

    expect(() => renderer.render()).not.toThrow();
    expect(spy).toHaveBeenCalled();
  });

  it("routes 'reaction-diffusion' to the image drawing path", () => {
    const canvas = makeCanvas();
    const system = makeSystem('reaction-diffusion');
    const renderer = new CanvasRenderer(canvas, system);
    const spy = vi.spyOn(renderer.ctx, 'createImageData');

    expect(() => renderer.render()).not.toThrow();
    expect(spy).toHaveBeenCalled();
  });

  it("routes 'l-system' to the turtle drawing path", () => {
    const canvas = makeCanvas();
    const system = makeSystem('l-system');
    const renderer = new CanvasRenderer(canvas, system);
    const spy = vi.spyOn(renderer.ctx, 'stroke');

    expect(() => renderer.render()).not.toThrow();
    expect(spy).toHaveBeenCalled();
  });

  it("routes 'boids' to the triangle drawing path", () => {
    const canvas = makeCanvas();
    const system = makeSystem('boids');
    const renderer = new CanvasRenderer(canvas, system);
    const spy = vi.spyOn(renderer.ctx, 'translate');

    expect(() => renderer.render()).not.toThrow();
    expect(spy).toHaveBeenCalled();
  });

  it("logs a warning for an unknown type instead of throwing", () => {
    const canvas = makeCanvas();
    const system = { getState: () => ({ type: 'unknown-system' }), config: {} };
    const renderer = new CanvasRenderer(canvas, system);
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    expect(() => renderer.render()).not.toThrow();
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('unknown-system'));
  });
});
