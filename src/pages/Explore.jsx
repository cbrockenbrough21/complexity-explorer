import { useEffect, useMemo, useRef, useState } from "react";
import SimulationView from "../components/SimulationView.jsx";
import Controls from "../components/Controls.jsx";
import TheoryPanel from "../components/TheoryPanel.jsx";
import CaptureButton from "../components/CaptureButton.jsx";
import { SYSTEMS } from "../data/systems.js";
import { ReactionDiffusion } from "../systems/ReactionDiffusion.js";
import styles from "./Explore.module.css";

// ─── Benchmark (URL param ?benchmark=1 only — zero production impact) ─────────

const BENCH_SIZES = [256, 512, 768, 1024];
const BENCH_WARMUP_MS = 150;  // discarded before measuring
const BENCH_MEASURE_MS = 400; // measurement window per (size, implementation)

// Tight synchronous loop — bypasses rAF entirely so measurements are uncapped.
// stepsPerFrame:1 so each step() call is exactly one Gray-Scott pass.
function measureSync(SystemClass, size) {
  const system = new SystemClass({ width: size, height: size, stepsPerFrame: 1 });

  const wEnd = performance.now() + BENCH_WARMUP_MS;
  while (performance.now() < wEnd) system.step();

  let n = 0;
  const mEnd = performance.now() + BENCH_MEASURE_MS;
  while (performance.now() < mEnd) {
    system.step();
    n += 1;
  }

  system.destroy();
  return Math.round(n / (BENCH_MEASURE_MS / 1000));
}

function BenchmarkOverlay() {
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState("Starting…");

  useEffect(() => {
    const WebGLClass = SYSTEMS.reactionDiffusion.classRef;
    const allResults = [];
    let i = 0;

    // Chain measurements through setTimeout so React can repaint the status
    // label between each blocking call (~550ms each).
    const next = () => {
      if (i >= BENCH_SIZES.length) {
        setStatus("Done — remove ?benchmark=1 to exit.");
        return;
      }
      const size = BENCH_SIZES[i];

      setStatus(`${size}×${size} — CPU…`);
      setTimeout(() => {
        const cpu = measureSync(ReactionDiffusion, size);

        setStatus(`${size}×${size} — WebGL…`);
        setTimeout(() => {
          const gpu = measureSync(WebGLClass, size);

          allResults.push({ size, cpu, gpu });
          setResults([...allResults]);
          i += 1;
          next();
        }, 32); // yield so React paints "WebGL…" status before blocking
      }, 32);   // yield so React paints "CPU…" status before blocking
    };

    setTimeout(next, 100); // initial yield so overlay renders before first block
    return () => {};
  }, []);

  const done = results.length === BENCH_SIZES.length;
  const fmt = (n) => n.toLocaleString();
  const th = { textAlign: "right", color: "#64748b", paddingBottom: 6, fontWeight: "normal", paddingLeft: 20 };
  const td = (extra = {}) => ({ textAlign: "right", paddingBottom: 4, paddingLeft: 20, ...extra });

  return (
    <div style={{
      position: "fixed", top: 20, right: 20, zIndex: 9999,
      background: "rgba(10,12,18,0.93)", border: "1px solid #4ade80",
      borderRadius: 10, padding: "16px 20px", color: "#f8fafc",
      fontFamily: "monospace", fontSize: 13, minWidth: 340,
      boxShadow: "0 4px 24px rgba(0,0,0,0.5)"
    }}>
      <div style={{ color: "#4ade80", fontWeight: "bold", marginBottom: 10 }}>
        ⚡ GPU vs CPU — steps/sec (stepsPerFrame=1)
      </div>

      {!done && (
        <div style={{ color: "#94a3b8", marginBottom: 10 }}>{status}</div>
      )}

      {results.length > 0 && (
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", color: "#64748b", paddingBottom: 6, fontWeight: "normal" }}>Grid</th>
              <th style={th}>CPU</th>
              <th style={th}>WebGL</th>
              <th style={th}>Speedup</th>
            </tr>
          </thead>
          <tbody>
            {results.map(({ size, cpu, gpu }) => {
              const speedup = gpu / cpu;
              return (
                <tr key={size}>
                  <td style={{ paddingBottom: 4 }}>{size}×{size}</td>
                  <td style={td({ color: "#94a3b8" })}>{fmt(cpu)}</td>
                  <td style={td({ color: "#4ade80" })}>{fmt(gpu)}</td>
                  <td style={td({ color: speedup >= 10 ? "#4ade80" : speedup >= 3 ? "#facc15" : "#f87171" })}>
                    {speedup.toFixed(1)}×
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {done && (
        <div style={{ marginTop: 10, color: "#64748b", fontSize: 12 }}>
          {status}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function Explore() {
  const isBenchmark = new URLSearchParams(window.location.search).get("benchmark") === "1";

  const [activeKey, setActiveKey] = useState("gameOfLife");
  const [configs, setConfigs] = useState(() => ({
    gameOfLife: { ...SYSTEMS.gameOfLife.defaultConfig },
    reactionDiffusion: { ...SYSTEMS.reactionDiffusion.defaultConfig },
    lSystem: { ...SYSTEMS.lSystem.defaultConfig },
    boids: { ...SYSTEMS.boids.defaultConfig }
  }));

  const activeApiRef = useRef(null);
  const [simulationApi, setSimulationApi] = useState(null);

  const activeSystem = useMemo(() => SYSTEMS[activeKey], [activeKey]);

  const handleConfigChange = (nextConfig) => {
    setConfigs((prev) => ({ ...prev, [activeKey]: nextConfig }));
    if (activeApiRef.current) {
      activeApiRef.current.applyConfig(nextConfig);
    }
  };

  return (
    <main className={styles.appShell}>
      <header className={styles.header}>
        <h1 className={styles.title}>Complexity Explorer</h1>
        <p className={styles.subtitle}>
          Watch simple rules become rich, surprising behavior. Tune each system,
          compare dynamics, and read each layer from poetic intuition to
          algorithmic detail.
        </p>
      </header>

      <div className={styles.systemTabs}>
        {Object.entries(SYSTEMS).map(([key, system]) => (
          <button
            key={key}
            type="button"
            onClick={() => {
              setActiveKey(key);
              setSimulationApi(null);
            }}
            className={`${styles.tabButton} ${activeKey === key ? styles.tabButtonActive : ""}`}
          >
            {system.label}
          </button>
        ))}
      </div>

      <div className={styles.layout}>
        <section className={styles.leftColumn}>
          <CaptureButton
            simulationApi={simulationApi}
            systemName={activeSystem.label}
          />

          <SimulationView
            key={activeKey}
            systemClass={activeSystem.classRef}
            initialConfig={configs[activeKey]}
            onSystemReady={(_, api) => {
              activeApiRef.current = api;
              setSimulationApi(api);
            }}
          />

          <section className={styles.controlsPanel}>
            <h2 className={styles.controlsHeading}>{activeSystem.label} Controls</h2>
            <Controls
              systemKey={activeKey}
              config={configs[activeKey]}
              onConfigChange={handleConfigChange}
            />
          </section>
        </section>

        <TheoryPanel systemKey={activeKey} />
      </div>

      {isBenchmark && <BenchmarkOverlay />}
    </main>
  );
}
