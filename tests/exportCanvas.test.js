import { describe, expect, it, vi } from "vitest";
import { PRINT_PRESETS } from "../src/data/printPresets.js";
import { createPrintCanvas } from "../src/utils/exportCanvas.js";

describe("createPrintCanvas", () => {
  it("matches each print preset dimension exactly", () => {
    const sourceCanvas = { width: 640, height: 640 };

    for (const preset of PRINT_PRESETS) {
      const drawImage = vi.fn();
      const outputCanvas = createPrintCanvas(sourceCanvas, preset, {
        createCanvas: () => ({
          width: 0,
          height: 0,
          getContext: () => ({ drawImage })
        })
      });

      expect(outputCanvas.width).toBe(preset.width);
      expect(outputCanvas.height).toBe(preset.height);
      expect(drawImage).toHaveBeenCalledWith(
        sourceCanvas,
        0,
        0,
        preset.width,
        preset.height
      );
    }
  });
});
