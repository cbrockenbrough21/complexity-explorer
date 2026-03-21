import { useEffect, useRef } from "react";
import { CanvasRenderer } from "../renderer/CanvasRenderer.js";

/**
 * Hosts a simulation strategy and renders it to a canvas.
 * @param {{ systemClass: new (config?:Object) => { init: Function, step: Function, getState: Function, destroy: Function, config?: object }, initialConfig?: Object, onSystemReady?: Function }} props
 */
export default function SimulationView({ systemClass, initialConfig = {}, onSystemReady }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return undefined;
    }

    const system = new systemClass(initialConfig);
    applyCanvasSize(canvas, system.config);

    if (typeof onSystemReady === "function") {
      onSystemReady(system, {
        applyConfig: (config) => {
          system.init(config);
          applyCanvasSize(canvas, system.config);
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

      const stepsPerSecond = system.config?.stepsPerSecond ?? 60;
      if (stepsPerSecond >= 60) {
        system.step();
      } else {
        const stepMs = 1000 / stepsPerSecond;
        accumulator += delta;
        while (accumulator >= stepMs) {
          system.step();
          accumulator -= stepMs;
        }
      }

      renderer.render();
      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      renderer.destroy();
      system.destroy();
    };
  }, [systemClass]);

  return <canvas ref={canvasRef} style={{ maxWidth: "100%", height: "auto", border: "1px solid #334155" }} />;
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
