import styles from "./About.module.css";

export default function About() {
  return (
    <main className={styles.page}>
      <section className={styles.panel}>
        <h1 className={styles.title}>About</h1>
        <p className={styles.body}>
          This page is intentionally minimal for Phase 3 Session 1 and will be expanded in Session 3.
          The routing and persistent navigation are in place.
        </p>
      </section>
    </main>
  );
}
