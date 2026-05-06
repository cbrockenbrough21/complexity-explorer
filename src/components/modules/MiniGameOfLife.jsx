import { useEffect, useRef, useState } from "react";
import { CanvasRenderer } from "../../renderer/CanvasRenderer.js";
import styles from "./MiniGameOfLife.module.css";

/**
 * Interactive Game of Life component for learning modules.
 * @param {{ SystemClass: new (config?: Object) => { init: Function, step: Function, getState: Function, destroy: Function, config: Object }, config: Object }} props
 */
export default function MiniGameOfLife({ SystemClass, config }) {
  const canvasRef = useRef(null);
  const systemRef = useRef(null);
  const rendererRef = useRef(null);
  const playingRef = useRef(false);
  const configRef = useRef({ ...config });

  const [playing, setPlaying] = useState(false);
  const [density, setDensity] = useState(config.initialDensity ?? 0.3);

  const { showControls = [] } = config;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    canvas.width = config.width * config.cellSize;
    canvas.height = config.height * config.cellSize;

    const system = new SystemClass(configRef.current);
    systemRef.current = system;

    const renderer = new CanvasRenderer(canvas, system);
    rendererRef.current = renderer;

    let rafId;
    let lastTime = performance.now();
    let accumulator = 0;

    const animate = (timestamp) => {
      if (playingRef.current) {
        const delta = timestamp - lastTime;
        const stepsPerSecond = configRef.current.stepsPerSecond ?? 10;
        const stepMs = 1000 / stepsPerSecond;
        accumulator += delta;
        while (accumulator >= stepMs) {
          system.step();
          accumulator -= stepMs;
        }
      }
      lastTime = timestamp;
      renderer.render();
      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      renderer.destroy();
      system.destroy();
    };
  }, [SystemClass]);

  const handlePlay = () => {
    playingRef.current = true;
    setPlaying(true);
  };

  const handlePause = () => {
    playingRef.current = false;
    setPlaying(false);
  };

  const handleStep = () => {
    if (!playingRef.current && systemRef.current) {
      systemRef.current.step();
    }
  };

  const handleReset = () => {
    if (systemRef.current) {
      systemRef.current.init(configRef.current);
    }
  };

  const handleDensityChange = (e) => {
    const newDensity = parseFloat(e.target.value);
    setDensity(newDensity);
    configRef.current = { ...configRef.current, initialDensity: newDensity };
    if (systemRef.current) {
      systemRef.current.init(configRef.current);
    }
  };

  return (
    <div className={styles.wrapper}>
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.controls}>
        {showControls.includes("play") && (
          <button className={styles.button} onClick={handlePlay} disabled={playing}>
            Play
          </button>
        )}
        {showControls.includes("pause") && (
          <button className={styles.button} onClick={handlePause} disabled={!playing}>
            Pause
          </button>
        )}
        {showControls.includes("step") && (
          <button className={styles.button} onClick={handleStep} disabled={playing}>
            Step
          </button>
        )}
        {showControls.includes("reset") && (
          <button className={styles.button} onClick={handleReset}>
            Reset
          </button>
        )}
        {showControls.includes("density") && (
          <label className={styles.sliderLabel}>
            <span>Density: {density.toFixed(2)}</span>
            <input
              type="range"
              min="0.1"
              max="0.9"
              step="0.05"
              value={density}
              onChange={handleDensityChange}
            />
          </label>
        )}
      </div>
    </div>
  );
}
