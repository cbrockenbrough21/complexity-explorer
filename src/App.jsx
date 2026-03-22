import { useMemo, useRef, useState } from "react";
import SimulationView from "./components/SimulationView.jsx";
import Controls from "./components/Controls.jsx";
import TheoryPanel from "./components/TheoryPanel.jsx";
import CaptureButton from "./components/CaptureButton.jsx";
import { GameOfLife } from "./systems/GameOfLife.js";
import { ReactionDiffusion } from "./systems/ReactionDiffusion.js";
import { LSystem } from "./systems/LSystem.js";
import { Boids } from "./systems/Boids.js";
import styles from "./App.module.css";

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
    </main>
  );
}
