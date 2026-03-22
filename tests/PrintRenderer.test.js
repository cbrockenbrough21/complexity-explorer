import { describe, expect, it } from "vitest";
import { getContainRect } from "../src/renderer/PrintRenderer.js";

describe("PrintRenderer contain fit", () => {
  it("preserves aspect ratio for portrait target", () => {
    const rect = getContainRect(600, 600, 3508, 4961);

    expect(rect.width).toBe(3508);
    expect(rect.height).toBe(3508);
    expect(rect.x).toBe(0);
    expect(rect.y).toBeCloseTo((4961 - 3508) / 2, 6);
  });

  it("preserves aspect ratio for landscape target", () => {
    const rect = getContainRect(600, 800, 3000, 2000);

    expect(rect.width).toBe(1500);
    expect(rect.height).toBe(2000);
    expect(rect.x).toBe(750);
    expect(rect.y).toBe(0);
  });
});
