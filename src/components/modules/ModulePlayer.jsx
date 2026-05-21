import { GameOfLife } from "../../systems/GameOfLife.js";
import { Boids } from "../../systems/Boids.js";
import { ReactionDiffusion } from "../../systems/ReactionDiffusion.js";
import MiniGameOfLife from "./MiniGameOfLife.jsx";
import MiniBoids from "./MiniBoids.jsx";
import MiniReactionDiffusion from "./MiniReactionDiffusion.jsx";
import styles from "./ModulePlayer.module.css";

const INTERACT_COMPONENTS = {
  MiniGameOfLife: { Component: MiniGameOfLife, SystemClass: GameOfLife },
  MiniBoids: { Component: MiniBoids, SystemClass: Boids },
  MiniReactionDiffusion: { Component: MiniReactionDiffusion, SystemClass: ReactionDiffusion },
  // others coming in Session 3b
};

export default function ModulePlayer({ module }) {
  return (
    <div className={styles.player}>
      {module.steps.map((step, i) => (
        <div key={i} className={styles[`step_${step.type.toLowerCase()}`] || styles.step}>
          {step.type === "READ" && (
            <div className={styles.read}>
              {step.content.map((paragraph, j) => (
                <p key={j}>{paragraph}</p>
              ))}
            </div>
          )}

          {step.type === "INTERACT" && (
            <div className={styles.interact}>
              {(() => {
                const entry = INTERACT_COMPONENTS[step.component];
                if (entry) {
                  const { Component, SystemClass } = entry;
                  return <Component SystemClass={SystemClass} config={step.config} />;
                }
                return (
                  <div className={styles.interactPlaceholder}>
                    <span>{step.component}</span>
                    <span>Interactive component — coming soon</span>
                  </div>
                );
              })()}
              {step.prompt && <p className={styles.prompt}>{step.prompt}</p>}
            </div>
          )}

          {step.type === "REFLECT" && (
            <div className={styles.reflect}>
              <p>{step.question}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
