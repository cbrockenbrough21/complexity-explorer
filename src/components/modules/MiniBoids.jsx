import { useEffect, useRef, useState } from "react";
import { CanvasRenderer } from "../../renderer/CanvasRenderer.js";
import styles from "./MiniBoids.module.css";

/**
 * Interactive Boids component for learning modules. Runs continuously.
 * @param {{ SystemClass: new (config?: Object) => { init: Function, step: Function, getState: Function, destroy: Function, config: Object }, config: Object }} props
 */
export default function MiniBoids({ SystemClass, config }) {
  const canvasRef = useRef(null);
  const systemRef = useRef(null);
  const configRef = useRef({ ...config });

  const [weights, setWeights] = useState({
    separationWeight: config.separationWeight ?? 1.5,
    alignmentWeight: config.alignmentWeight ?? 1.0,
    cohesionWeight: config.cohesionWeight ?? 1.0,
  });

  const { showControls = [] } = config;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    canvas.width = config.width;
    canvas.height = config.height;

    const system = new SystemClass(configRef.current);
    systemRef.current = system;

    const renderer = new CanvasRenderer(canvas, system);

    let rafId;
    const animate = () => {
      system.step();
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

  const updateWeight = (key, rawValue) => {
    const value = parseFloat(rawValue);
    const nextConfig = { ...configRef.current, [key]: value };
    configRef.current = nextConfig;
    setWeights((prev) => ({ ...prev, [key]: value }));
    if (systemRef.current) {
      systemRef.current.init(nextConfig);
    }
  };

  const handleReset = () => {
    if (systemRef.current) {
      systemRef.current.init(configRef.current);
    }
  };

  return (
    <div className={styles.wrapper}>
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.controls}>
        {showControls.includes("separationWeight") && (
          <label className={styles.sliderLabel}>
            <span>Separation: {weights.separationWeight.toFixed(1)}</span>
            <input
              type="range"
              min="0"
              max="3"
              step="0.1"
              value={weights.separationWeight}
              onChange={(e) => updateWeight("separationWeight", e.target.value)}
            />
          </label>
        )}
        {showControls.includes("alignmentWeight") && (
          <label className={styles.sliderLabel}>
            <span>Alignment: {weights.alignmentWeight.toFixed(1)}</span>
            <input
              type="range"
              min="0"
              max="3"
              step="0.1"
              value={weights.alignmentWeight}
              onChange={(e) => updateWeight("alignmentWeight", e.target.value)}
            />
          </label>
        )}
        {showControls.includes("cohesionWeight") && (
          <label className={styles.sliderLabel}>
            <span>Cohesion: {weights.cohesionWeight.toFixed(1)}</span>
            <input
              type="range"
              min="0"
              max="3"
              step="0.1"
              value={weights.cohesionWeight}
              onChange={(e) => updateWeight("cohesionWeight", e.target.value)}
            />
          </label>
        )}
        {showControls.includes("reset") && (
          <button className={styles.button} onClick={handleReset}>
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
