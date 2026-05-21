import { useEffect, useRef, useState } from "react";
import { CanvasRenderer } from "../../renderer/CanvasRenderer.js";
import styles from "./MiniReactionDiffusion.module.css";

const PRESETS = {
  spots: { feed: 0.035, kill: 0.065 },
  stripes: { feed: 0.060, kill: 0.062 },
  labyrinth: { feed: 0.055, kill: 0.062 },
};

/**
 * Interactive Reaction-Diffusion component for learning modules. Runs continuously.
 * @param {{ SystemClass: new (config?: Object) => { init: Function, step: Function, getState: Function, destroy: Function, config: Object }, config: Object }} props
 */
export default function MiniReactionDiffusion({ SystemClass, config }) {
  const canvasRef = useRef(null);
  const systemRef = useRef(null);
  const configRef = useRef({ ...config });

  const initialPreset = config.presets?.[0] ?? "labyrinth";
  const initialParams = PRESETS[initialPreset] ?? { feed: config.feed ?? 0.055, kill: config.kill ?? 0.062 };

  const [activePreset, setActivePreset] = useState(initialPreset);
  const [feed, setFeed] = useState(initialParams.feed);
  const [kill, setKill] = useState(initialParams.kill);

  const { showControls = [], presets = [] } = config;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    canvas.width = config.width;
    canvas.height = config.height;

    // Merge preset params into initial config
    const initConfig = { ...configRef.current, ...initialParams };
    configRef.current = initConfig;

    const system = new SystemClass(initConfig);
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

  const reinit = (nextConfig) => {
    configRef.current = nextConfig;
    if (systemRef.current) {
      systemRef.current.init(nextConfig);
    }
  };

  const handlePreset = (e) => {
    const preset = e.target.value;
    const params = PRESETS[preset];
    if (!params) return;
    setActivePreset(preset);
    setFeed(params.feed);
    setKill(params.kill);
    reinit({ ...configRef.current, ...params });
  };

  const handleFeed = (e) => {
    const value = parseFloat(e.target.value);
    setFeed(value);
    reinit({ ...configRef.current, feed: value });
  };

  const handleKill = (e) => {
    const value = parseFloat(e.target.value);
    setKill(value);
    reinit({ ...configRef.current, kill: value });
  };

  const handleReset = () => {
    reinit(configRef.current);
  };

  return (
    <div className={styles.wrapper}>
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.controls}>
        {showControls.includes("preset") && presets.length > 0 && (
          <label className={styles.selectLabel}>
            <span>Preset:</span>
            <select className={styles.select} value={activePreset} onChange={handlePreset}>
              {presets.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>
        )}
        {showControls.includes("feed") && (
          <label className={styles.sliderLabel}>
            <span>Feed: {feed.toFixed(3)}</span>
            <input
              type="range"
              min="0.01"
              max="0.09"
              step="0.001"
              value={feed}
              onChange={handleFeed}
            />
          </label>
        )}
        {showControls.includes("kill") && (
          <label className={styles.sliderLabel}>
            <span>Kill: {kill.toFixed(3)}</span>
            <input
              type="range"
              min="0.04"
              max="0.07"
              step="0.001"
              value={kill}
              onChange={handleKill}
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
