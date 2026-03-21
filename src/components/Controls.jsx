import { LSystem } from "../systems/LSystem.js";

function NumberSlider({ label, value, min, max, step = 1, onChange }) {
  return (
    <label style={{ display: "grid", gap: 4 }}>
      <span>{label}: {Number(value).toFixed(step < 1 ? 3 : 0)}</span>
      <input
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
      <div style={{ display: "grid", gap: 8 }}>
        <NumberSlider label="Initial density" value={config.initialDensity} min={0.05} max={0.9} step={0.01} onChange={(v) => apply({ initialDensity: v })} />
        <NumberSlider label="Steps per second" value={config.stepsPerSecond} min={1} max={30} step={1} onChange={(v) => apply({ stepsPerSecond: v })} />
        <button type="button" onClick={() => apply({})}>Randomize</button>
      </div>
    );
  }

  if (systemKey === "reactionDiffusion") {
    return (
      <div style={{ display: "grid", gap: 8 }}>
        <NumberSlider label="Feed (f)" value={config.feed} min={0.01} max={0.1} step={0.001} onChange={(v) => apply({ feed: v })} />
        <NumberSlider label="Kill (k)" value={config.kill} min={0.01} max={0.09} step={0.001} onChange={(v) => apply({ kill: v })} />
        <NumberSlider label="Diffusion A" value={config.dA} min={0.1} max={1.5} step={0.01} onChange={(v) => apply({ dA: v })} />
        <NumberSlider label="Diffusion B" value={config.dB} min={0.1} max={1.2} step={0.01} onChange={(v) => apply({ dB: v })} />
        <NumberSlider label="Steps per frame" value={config.stepsPerFrame} min={1} max={20} step={1} onChange={(v) => apply({ stepsPerFrame: v })} />
        <button type="button" onClick={() => apply({})}>Reseed</button>
      </div>
    );
  }

  if (systemKey === "lSystem") {
    const presetMeta = LSystem.getPresetMeta(config.preset);

    return (
      <div style={{ display: "grid", gap: 8 }}>
        <label style={{ display: "grid", gap: 4 }}>
          <span>Preset</span>
          <select
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
        <NumberSlider label="Iterations" value={config.iterations} min={1} max={presetMeta.maxIterations} step={1} onChange={(v) => apply({ iterations: v })} />
        <NumberSlider label="Angle" value={config.angle} min={5} max={180} step={1} onChange={(v) => apply({ angle: v })} />
        <button type="button" onClick={() => apply({})}>Regenerate</button>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <NumberSlider label="Agent count" value={config.agentCount} min={10} max={200} step={1} onChange={(v) => apply({ agentCount: v })} />
      <NumberSlider label="Max speed" value={config.maxSpeed} min={0.5} max={6} step={0.1} onChange={(v) => apply({ maxSpeed: v })} />
      <NumberSlider label="Separation radius" value={config.separationRadius} min={5} max={80} step={1} onChange={(v) => apply({ separationRadius: v })} />
      <NumberSlider label="Alignment radius" value={config.alignmentRadius} min={5} max={120} step={1} onChange={(v) => apply({ alignmentRadius: v })} />
      <NumberSlider label="Cohesion radius" value={config.cohesionRadius} min={5} max={120} step={1} onChange={(v) => apply({ cohesionRadius: v })} />
      <button type="button" onClick={() => apply({})}>Reset flock</button>
    </div>
  );
}
