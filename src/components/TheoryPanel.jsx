import { useMemo, useState } from "react";
import { systemContent } from "../data/systemContent.js";
import styles from "./TheoryPanel.module.css";

const AUDIENCES = [
  { key: "forEveryone", label: "Everyone" },
  { key: "forCurious", label: "Curious" },
  { key: "forEngineers", label: "Engineers" }
];

/**
 * Multi-layer explanation panel for the currently selected system.
 * @param {{ systemKey: string }} props
 */
export default function TheoryPanel({ systemKey }) {
  const [audienceKey, setAudienceKey] = useState("forEveryone");

  const content = useMemo(() => {
    return systemContent[systemKey] ?? systemContent.gameOfLife;
  }, [systemKey]);

  const activeCopy = content[audienceKey] ?? content.forEveryone;

  return (
    <section className={styles.panel}>
      <header className={styles.header}>
        <h2 className={styles.title}>{content.title}</h2>
        <p className={styles.tagline}>{content.tagline}</p>
      </header>

      <div className={styles.tabRow} role="tablist" aria-label="Audience level">
        {AUDIENCES.map((audience) => (
          <button
            key={audience.key}
            type="button"
            role="tab"
            aria-selected={audience.key === audienceKey}
            className={`${styles.tabButton} ${audience.key === audienceKey ? styles.tabButtonActive : ""}`}
            onClick={() => setAudienceKey(audience.key)}
          >
            {audience.label}
          </button>
        ))}
      </div>

      <p className={styles.bodyText}>{activeCopy}</p>

      <div className={styles.tagSection}>
        <h3 className={styles.subhead}>Concepts</h3>
        <div className={styles.tagWrap}>
          {content.concepts.map((concept) => (
            <span key={concept} className={styles.tagPill}>
              {concept}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
