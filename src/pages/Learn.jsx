import { Link } from "react-router-dom";
import { MODULES } from "../data/modules.js";
import styles from "./Learn.module.css";

export default function Learn() {
  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Learning Modules</h1>
      <ul className={styles.list}>
        {MODULES.map((module) => (
          <li key={module.id} className={styles.item}>
            <Link to={`/learn/${module.id}`} className={styles.card}>
              <span className={styles.number}>Module {module.number}</span>
              <h2 className={styles.moduleTitle}>{module.title}</h2>
              <p className={styles.description}>{module.description}</p>
              <div className={styles.tags}>
                {module.concepts.map((concept) => (
                  <span key={concept} className={styles.tag}>{concept}</span>
                ))}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
