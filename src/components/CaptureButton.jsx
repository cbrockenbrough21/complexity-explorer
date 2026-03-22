import { useState } from "react";
import { PrintRenderer } from "../renderer/PrintRenderer.js";
import { exportCanvas } from "../utils/exportCanvas.js";
import {
  PRINT_PRESETS,
  DEFAULT_PRINT_PRESET_ID,
  getPrintPresetById
} from "../data/printPresets.js";
import styles from "./CaptureButton.module.css";

/**
 * Capture a high-resolution still from the current simulation state.
 * @param {{ simulationApi: { pause: Function, resume: Function, getSystem: Function, getGeneration: Function } | null, systemName: string }} props
 */
export default function CaptureButton({ simulationApi, systemName }) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [presetId, setPresetId] = useState(DEFAULT_PRINT_PRESET_ID);

  const selectedPreset =
    getPrintPresetById(presetId) ??
    getPrintPresetById(DEFAULT_PRINT_PRESET_ID) ??
    PRINT_PRESETS[0];

  const handleCapture = async () => {
    if (!simulationApi || isCapturing) {
      return;
    }

    setIsCapturing(true);
    simulationApi.pause();

    try {
      const renderer = new PrintRenderer(simulationApi.getSystem(), selectedPreset);
      const printCanvas = renderer.renderFrame();
      exportCanvas(printCanvas, {
        systemName,
        generation: simulationApi.getGeneration()
      });
    } finally {
      simulationApi.resume();
      setIsCapturing(false);
    }
  };

  return (
    <div className={styles.captureRow}>
      <label className={styles.presetControl}>
        <span>Preset</span>
        <select
          className={styles.select}
          value={presetId}
          onChange={(event) => setPresetId(event.target.value)}
          disabled={isCapturing}
        >
          {PRINT_PRESETS.map((preset) => (
            <option key={preset.id} value={preset.id}>
              {preset.label}
            </option>
          ))}
        </select>
      </label>

      <button
        type="button"
        className={styles.captureButton}
        onClick={handleCapture}
        disabled={!simulationApi || isCapturing}
      >
        {isCapturing ? "Capturing..." : "Capture High-Res PNG"}
      </button>
      <p className={styles.note}>
        {selectedPreset.width} x {selectedPreset.height}
      </p>
    </div>
  );
}
