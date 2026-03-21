import { useEffect, useRef } from "react";
import { CanvasRenderer } from "../renderer/CanvasRenderer.js";

/**
 * Hosts a simulation strategy and renders it to a canvas.
 * @param {{ systemClass: new () => { init: Function, step: Function, getState: Function, destroy: Function, config?: object } }} props
 */
export default function SimulationView({ systemClass }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return undefined;
    }

    const system = new systemClass();
    const { width, height, cellSize, stepsPerSecond } = system.config;

    canvas.width = width * cellSize;
    canvas.height = height * cellSize;

    const renderer = new CanvasRenderer(canvas, system);

    let rafId = 0;
    let lastTime = performance.now();
    let accumulator = 0;
    const stepMs = 1000 / stepsPerSecond;

    const animate = (timestamp) => {
      const delta = timestamp - lastTime;
      lastTime = timestamp;
      accumulator += delta;

      while (accumulator >= stepMs) {
        system.step();
        accumulator -= stepMs;
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

  return <canvas ref={canvasRef} />;
}
