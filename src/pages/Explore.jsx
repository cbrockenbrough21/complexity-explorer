import { useMemo, useRef, useState } from "react";
import SimulationView from "../components/SimulationView.jsx";
import Controls from "../components/Controls.jsx";
import TheoryPanel from "../components/TheoryPanel.jsx";
import CaptureButton from "../components/CaptureButton.jsx";
import { SYSTEMS } from "../data/systems.js";
import styles from "./Explore.module.css";

export default function Explore() {
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
