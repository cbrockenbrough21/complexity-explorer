import styles from "./ModulePlayer.module.css";

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
              <div className={styles.interactPlaceholder}>
                <span>{step.component}</span>
                <span>Interactive component — coming in Session 3</span>
              </div>
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
