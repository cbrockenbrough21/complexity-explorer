/**
 * @param {string} systemName
 * @param {number} generation
 * @param {Date} [timestamp]
 * @returns {string}
 */
export function buildExportFilename(systemName, generation, timestamp = new Date()) {
  const safeName = String(systemName)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "simulation";
  const safeGeneration = Number.isFinite(generation) ? Math.max(0, Math.floor(generation)) : 0;

  const year = timestamp.getFullYear();
  const month = String(timestamp.getMonth() + 1).padStart(2, "0");
  const day = String(timestamp.getDate()).padStart(2, "0");
  const hours = String(timestamp.getHours()).padStart(2, "0");
  const minutes = String(timestamp.getMinutes()).padStart(2, "0");
  const seconds = String(timestamp.getSeconds()).padStart(2, "0");
  const timeStampString = `${year}${month}${day}-${hours}${minutes}${seconds}`;

  return `${safeName}-gen${safeGeneration}-${timeStampString}.png`;
}

/**
 * Create an output canvas with exact preset dimensions and draw source into it.
 * @param {{ width:number, height:number }} sourceCanvas
 * @param {{ width:number, height:number }} preset
 * @param {{ createCanvas?: Function }} [deps]
 * @returns {{ width:number, height:number, getContext?: Function }}
 */
export function createPrintCanvas(sourceCanvas, preset, deps = {}) {
  const createCanvas = deps.createCanvas ?? (() => document.createElement("canvas"));
  const outputCanvas = createCanvas();

  outputCanvas.width = preset.width;
  outputCanvas.height = preset.height;

  const context = outputCanvas.getContext?.("2d");
  if (context?.drawImage) {
    context.drawImage(sourceCanvas, 0, 0, outputCanvas.width, outputCanvas.height);
  }

  return outputCanvas;
}

/**
 * Export a canvas as a PNG file download.
 * @param {HTMLCanvasElement} canvas
 * @param {{ systemName: string, generation: number, timestamp?: Date }} options
 */
export function exportCanvas(canvas, options) {
  const { systemName, generation, timestamp = new Date() } = options;
  const filename = buildExportFilename(systemName, generation, timestamp);

  const triggerDownload = (url) => {
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
  };

  if (typeof canvas.toBlob === "function") {
    canvas.toBlob((blob) => {
      if (!blob) {
        const fallbackDataUrl = canvas.toDataURL("image/png");
        triggerDownload(fallbackDataUrl);
        return;
      }

      const blobUrl = URL.createObjectURL(blob);
      triggerDownload(blobUrl);
      URL.revokeObjectURL(blobUrl);
    }, "image/png");
    return;
  }

  const dataUrl = canvas.toDataURL("image/png");
  triggerDownload(dataUrl);
}
