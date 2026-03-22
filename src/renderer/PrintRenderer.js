import { CanvasRenderer } from "./CanvasRenderer.js";

/**
 * Renders one high-resolution still from the system's current state.
 * Reads state only and does not step or mutate the simulation.
 */
export class PrintRenderer {
  /**
   * @param {{ getState: Function, config?: Object }} system
   * @param {{ width?: number, height?: number }} [printPreset]
   */
  constructor(system, printPreset = {}) {
    this.system = system;
    this.printPreset = printPreset;
  }

  /**
   * Render a single frame to an offscreen canvas.
   * @param {{ sourceWidth?: number, sourceHeight?: number }} [options]
   * @returns {HTMLCanvasElement}
   */
  renderFrame(options = {}) {
    const canvas = document.createElement("canvas");
    const sourceWidth = options.sourceWidth ?? this.#resolveBaseWidth();
    const sourceHeight = options.sourceHeight ?? this.#resolveBaseHeight();

    const width = Math.max(
      1,
      Math.floor(this.printPreset.width ?? sourceWidth * 4)
    );
    const height = Math.max(
      1,
      Math.floor(this.printPreset.height ?? sourceHeight * 4)
    );

    canvas.width = width;
    canvas.height = height;

    // Render at native simulation size first, then scale with preserved aspect ratio.
    const sourceCanvas = document.createElement("canvas");
    sourceCanvas.width = Math.max(1, Math.floor(sourceWidth));
    sourceCanvas.height = Math.max(1, Math.floor(sourceHeight));

    const renderer = new CanvasRenderer(sourceCanvas, this.system);
    renderer.render();
    renderer.destroy();

    const ctx = canvas.getContext("2d");
    const fit = getContainRect(sourceCanvas.width, sourceCanvas.height, canvas.width, canvas.height);

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(sourceCanvas, fit.x, fit.y, fit.width, fit.height);

    return canvas;
  }

  #resolveBaseWidth() {
    if (typeof this.system?.config?.cellSize === "number") {
      return this.system.config.width * this.system.config.cellSize;
    }
    return this.system?.config?.width ?? 600;
  }

  #resolveBaseHeight() {
    if (typeof this.system?.config?.cellSize === "number") {
      return this.system.config.height * this.system.config.cellSize;
    }
    return this.system?.config?.height ?? 600;
  }
}

/**
 * Compute centered "contain" bounds with no aspect-ratio distortion.
 * @param {number} sourceWidth
 * @param {number} sourceHeight
 * @param {number} targetWidth
 * @param {number} targetHeight
 * @returns {{x:number,y:number,width:number,height:number}}
 */
export function getContainRect(sourceWidth, sourceHeight, targetWidth, targetHeight) {
  const safeSourceWidth = Math.max(1, sourceWidth);
  const safeSourceHeight = Math.max(1, sourceHeight);
  const scale = Math.min(targetWidth / safeSourceWidth, targetHeight / safeSourceHeight);
  const width = safeSourceWidth * scale;
  const height = safeSourceHeight * scale;

  return {
    x: (targetWidth - width) / 2,
    y: (targetHeight - height) / 2,
    width,
    height
  };
}
