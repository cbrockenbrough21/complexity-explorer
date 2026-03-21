import { useMemo, useRef, useState } from "react";
import SimulationView from "./components/SimulationView.jsx";
import Controls from "./components/Controls.jsx";
import { GameOfLife } from "./systems/GameOfLife.js";
import { ReactionDiffusion } from "./systems/ReactionDiffusion.js";
import { LSystem } from "./systems/LSystem.js";
import { Boids } from "./systems/Boids.js";

const SYSTEMS = {
  gameOfLife: {
    label: "Game of Life",
    classRef: GameOfLife,
    defaultConfig: {
      width: 80,
      height: 80,
      cellSize: 8,
      initialDensity: 0.3,
      stepsPerSecond: 10
    }
  },
  reactionDiffusion: {
    label: "Reaction-Diffusion",
    classRef: ReactionDiffusion,
    defaultConfig: {
      width: 256,
      height: 256,
      feed: 0.055,
      kill: 0.062,
      dA: 1.0,
      dB: 0.5,
      stepsPerFrame: 8
    }
  },
  lSystem: {
    label: "L-System",
    classRef: LSystem,
    defaultConfig: {
      width: 700,
      height: 700,
      preset: "Fern",
      iterations: 5,
      angle: 25,
      stepsPerSecond: 1
    }
  },
  boids: {
    label: "Boids",
    classRef: Boids,
    defaultConfig: {
      width: 600,
      height: 600,
      agentCount: 80,
      maxSpeed: 2,
      separationRadius: 25,
      alignmentRadius: 50,
      cohesionRadius: 50,
      separationWeight: 1.5,
      alignmentWeight: 1,
      cohesionWeight: 1,
      stepsPerSecond: 60
    }
  }
};

export default function App() {
  const [activeKey, setActiveKey] = useState("gameOfLife");
  const [configs, setConfigs] = useState(() => ({
    gameOfLife: { ...SYSTEMS.gameOfLife.defaultConfig },
    reactionDiffusion: { ...SYSTEMS.reactionDiffusion.defaultConfig },
    lSystem: { ...SYSTEMS.lSystem.defaultConfig },
    boids: { ...SYSTEMS.boids.defaultConfig }
  }));

  const activeApiRef = useRef(null);

  const activeSystem = useMemo(() => SYSTEMS[activeKey], [activeKey]);

  const handleConfigChange = (nextConfig) => {
    setConfigs((prev) => ({ ...prev, [activeKey]: nextConfig }));
    if (activeApiRef.current) {
      activeApiRef.current.applyConfig(nextConfig);
    }
  };

  return (
    <main style={{ padding: 16, fontFamily: "ui-sans-serif, system-ui, sans-serif", color: "#e2e8f0", background: "#0f172a", minHeight: "100vh" }}>
      <h1 style={{ marginTop: 0 }}>Complexity Explorer</h1>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        {Object.entries(SYSTEMS).map(([key, system]) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveKey(key)}
            style={{
              border: "1px solid #334155",
              background: activeKey === key ? "#1e293b" : "#0b1220",
              color: "#e2e8f0",
              padding: "8px 12px",
              cursor: "pointer"
            }}
          >
            {system.label}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "minmax(280px, 1fr) 320px", alignItems: "start" }}>
        <SimulationView
          key={activeKey}
          systemClass={activeSystem.classRef}
          initialConfig={configs[activeKey]}
          onSystemReady={(_, api) => {
            activeApiRef.current = api;
          }}
        />

        <section style={{ border: "1px solid #334155", padding: 12 }}>
          <h2 style={{ marginTop: 0, marginBottom: 12, fontSize: 18 }}>{activeSystem.label} Controls</h2>
          <Controls
            systemKey={activeKey}
            config={configs[activeKey]}
            onConfigChange={handleConfigChange}
          />
        </section>
      </div>
    </main>
  );
}
