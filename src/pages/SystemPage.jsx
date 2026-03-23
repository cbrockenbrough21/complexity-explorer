import { Link, useParams } from "react-router-dom";
import { systemContent } from "../data/systemContent.js";
import { SYSTEMS } from "../data/systems.js";
import styles from "./SystemPage.module.css";

export default function SystemPage() {
  const { id } = useParams();
  const content = systemContent[id] ?? null;

  if (!content || !SYSTEMS[id]) {
    return (
      <main className={styles.page}>
        <section className={styles.panel}>
          <h1 className={styles.title}>System not found</h1>
          <p className={styles.body}>This route will be fully implemented in Phase 3 Session 2.</p>
          <Link to="/" className={styles.link}>Return home</Link>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <section className={styles.panel}>
        <h1 className={styles.title}>{content.title}</h1>
        <p className={styles.body}>{content.tagline}</p>
        <p className={styles.body}>This page is routed and ready for Session 2 implementation.</p>
      </section>
    </main>
  );
}
