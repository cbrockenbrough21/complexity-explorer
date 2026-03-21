import { describe, expect, it } from "vitest";
import { LSystem } from "../src/systems/LSystem.js";

describe("LSystem safeguards", () => {
  it("resets to preset defaults when switching presets", () => {
    const lsys = new LSystem({ preset: "Fern", iterations: 6, angle: 30 });

    lsys.init({ preset: "Algae" });

    const state = lsys.getState();
    expect(state.drawParams.preset).toBe("Algae");
    expect(lsys.config.iterations).toBe(LSystem.getPresetMeta("Algae").defaultIterations);
    expect(lsys.config.angle).toBe(LSystem.getPresetMeta("Algae").defaultAngle);
  });

  it("caps runaway output length", () => {
    const lsys = new LSystem({ preset: "Fern", iterations: 99 });
    const state = lsys.getState();

    expect(state.string.length).toBeLessThanOrEqual(120000);
    expect(lsys.config.iterations).toBeLessThanOrEqual(LSystem.getPresetMeta("Fern").maxIterations);
  });
});
