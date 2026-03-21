import { useEffect, useRef, useState } from "react";
import { CanvasRenderer } from "../renderer/CanvasRenderer.js";
import styles from "./SimulationView.module.css";

/**
 * Hosts a simulation strategy and renders it to a canvas.
 * @param {{ systemClass: new (config?:Object) => { init: Function, step: Function, getState: Function, destroy: Function, config?: object }, initialConfig?: Object, onSystemReady?: Function }} props
 */
export default function SimulationView({ systemClass, initialConfig = {}, onSystemReady }) {
  const canvasRef = useRef(null);
  const frameRef = useRef(0);
  const generationRef = useRef(0);
  const [counter, setCounter] = useState({ frame: 0, generation: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return undefined;
    }

    const system = new systemClass(initialConfig);
    applyCanvasSize(canvas, system.config);
    frameRef.current = 0;
    generationRef.current = 0;
    setCounter({ frame: 0, generation: 0 });

    if (typeof onSystemReady === "function") {
      onSystemReady(system, {
        applyConfig: (config) => {
          system.init(config);
          applyCanvasSize(canvas, system.config);
          frameRef.current = 0;
          generationRef.current = 0;
          setCounter({ frame: 0, generation: 0 });
        }
      });
    }

    const renderer = new CanvasRenderer(canvas, system);

    let rafId = 0;
    let lastTime = performance.now();
    let accumulator = 0;

    const animate = (timestamp) => {
      const delta = timestamp - lastTime;
      lastTime = timestamp;
      let stepsAdvanced = 0;

      const stepsPerSecond = system.config?.stepsPerSecond ?? 60;
      if (stepsPerSecond >= 60) {
        system.step();
        stepsAdvanced = 1;
      } else {
        const stepMs = 1000 / stepsPerSecond;
        accumulator += delta;
        while (accumulator >= stepMs) {
          system.step();
          accumulator -= stepMs;
          stepsAdvanced += 1;
        }
      }

      renderer.render();
      frameRef.current += 1;
      generationRef.current += stepsAdvanced;
      setCounter({
        frame: frameRef.current,
        generation: generationRef.current
      });
      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      renderer.destroy();
      system.destroy();
    };
  }, [systemClass]);

  return (
    <section className={styles.wrapper}>
      <p className={styles.counter}>
        Frame: <span className={styles.counterStrong}>{counter.frame}</span>
        {" | "}
        Generation: <span className={styles.counterStrong}>{counter.generation}</span>
      </p>
      <canvas ref={canvasRef} className={styles.canvas} />
    </section>
  );
}

function applyCanvasSize(canvas, config = {}) {
  const { width = 600, height = 600, cellSize } = config;

  if (typeof cellSize === "number") {
    canvas.width = Math.max(1, Math.floor(width * cellSize));
    canvas.height = Math.max(1, Math.floor(height * cellSize));
    return;
  }

  canvas.width = Math.max(1, Math.floor(width));
  canvas.height = Math.max(1, Math.floor(height));
}
