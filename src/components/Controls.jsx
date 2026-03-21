import { LSystem } from "../systems/LSystem.js";
import styles from "./Controls.module.css";

function NumberSlider({
  label,
  value,
  min,
  max,
  step = 1,
  unit = "",
  formatValue,
  onChange
}) {
  const displayedValue = formatValue
    ? formatValue(value)
    : Number(value).toFixed(step < 1 ? 2 : 0);

  return (
    <label className={styles.field}>
      <span className={styles.fieldLabelRow}>
        <span>{label}</span>
        <span className={styles.value}>{displayedValue}{unit}</span>
      </span>
      <input
        className={styles.input}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}

/**
 * System-specific controls. Each update sends a new config object upstream.
 */
export default function Controls({ systemKey, config, onConfigChange }) {
  const apply = (partial) => {
    onConfigChange({ ...config, ...partial });
  };

  if (systemKey === "gameOfLife") {
    return (
      <div className={styles.controlStack}>
        <NumberSlider
          label="Initial Density"
          value={config.initialDensity}
          min={0.05}
          max={0.7}
          step={0.01}
          unit="%"
          formatValue={(v) => Math.round(v * 100)}
          onChange={(v) => apply({ initialDensity: v })}
        />
        <NumberSlider
          label="Grid Cell Size"
          value={config.cellSize}
          min={4}
          max={14}
          step={1}
          unit=" px"
          onChange={(v) => apply({ cellSize: v })}
        />
        <NumberSlider
          label="Simulation Rate"
          value={config.stepsPerSecond}
          min={1}
          max={30}
          step={1}
          unit=" Hz"
          onChange={(v) => apply({ stepsPerSecond: v })}
        />
        <button className={styles.actionButton} type="button" onClick={() => apply({})}>Randomize Seed</button>
      </div>
    );
  }

  if (systemKey === "reactionDiffusion") {
    return (
      <div className={styles.controlStack}>
        <NumberSlider label="Feed Rate (f)" value={config.feed} min={0.01} max={0.09} step={0.001} onChange={(v) => apply({ feed: v })} />
        <NumberSlider label="Kill Rate (k)" value={config.kill} min={0.03} max={0.075} step={0.001} onChange={(v) => apply({ kill: v })} />
        <NumberSlider label="Diffusion A" value={config.dA} min={0.4} max={1.6} step={0.01} onChange={(v) => apply({ dA: v })} />
        <NumberSlider label="Diffusion B" value={config.dB} min={0.2} max={1.2} step={0.01} onChange={(v) => apply({ dB: v })} />
        <NumberSlider label="Micro-Steps / Frame" value={config.stepsPerFrame} min={1} max={16} step={1} onChange={(v) => apply({ stepsPerFrame: v })} />
        <button className={styles.actionButton} type="button" onClick={() => apply({})}>Reseed Patches</button>
      </div>
    );
  }

  if (systemKey === "lSystem") {
    const presetMeta = LSystem.getPresetMeta(config.preset);

    return (
      <div className={styles.controlStack}>
        <label className={styles.field}>
          <span>Preset</span>
          <select
            className={styles.select}
            value={config.preset}
            onChange={(e) => {
              const nextPreset = e.target.value;
              const nextMeta = LSystem.getPresetMeta(nextPreset);
              apply({
                preset: nextPreset,
                iterations: nextMeta.defaultIterations,
                angle: nextMeta.defaultAngle
              });
            }}
          >
            {LSystem.getPresetNames().map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </label>
        <p className={styles.presetMeta}>Max iterations for this preset: {presetMeta.maxIterations}</p>
        <NumberSlider label="Iterations" value={config.iterations} min={1} max={presetMeta.maxIterations} step={1} onChange={(v) => apply({ iterations: v })} />
        <NumberSlider label="Turn Angle" value={config.angle} min={5} max={170} step={1} unit=" deg" onChange={(v) => apply({ angle: v })} />
        <button className={styles.actionButton} type="button" onClick={() => apply({})}>Regenerate</button>
      </div>
    );
  }

  return (
    <div className={styles.controlStack}>
      <NumberSlider label="Agent Count" value={config.agentCount} min={20} max={220} step={1} onChange={(v) => apply({ agentCount: v })} />
      <NumberSlider label="Simulation Rate" value={config.stepsPerSecond} min={20} max={120} step={1} unit=" Hz" onChange={(v) => apply({ stepsPerSecond: v })} />
      <NumberSlider label="Max Speed" value={config.maxSpeed} min={0.5} max={4.5} step={0.1} unit=" px/tick" onChange={(v) => apply({ maxSpeed: v })} />
      <NumberSlider label="Separation Radius" value={config.separationRadius} min={8} max={90} step={1} unit=" px" onChange={(v) => apply({ separationRadius: v })} />
      <NumberSlider label="Alignment Radius" value={config.alignmentRadius} min={12} max={130} step={1} unit=" px" onChange={(v) => apply({ alignmentRadius: v })} />
      <NumberSlider label="Cohesion Radius" value={config.cohesionRadius} min={12} max={130} step={1} unit=" px" onChange={(v) => apply({ cohesionRadius: v })} />
      <NumberSlider label="Separation Weight" value={config.separationWeight} min={0.2} max={3.2} step={0.1} onChange={(v) => apply({ separationWeight: v })} />
      <NumberSlider label="Alignment Weight" value={config.alignmentWeight} min={0.2} max={3.2} step={0.1} onChange={(v) => apply({ alignmentWeight: v })} />
      <NumberSlider label="Cohesion Weight" value={config.cohesionWeight} min={0.2} max={3.2} step={0.1} onChange={(v) => apply({ cohesionWeight: v })} />
      <button className={styles.actionButton} type="button" onClick={() => apply({})}>Reset Flock</button>
    </div>
  );
}
