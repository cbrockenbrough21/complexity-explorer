import styles from "./About.module.css";
import authorImage from "../assets/images/author.jpg";

export default function About() {
  return (
    <main className={styles.page}>
      <section className={styles.panel}>
        <h1 className={styles.title}>Catherine Brockenbrough</h1>

        <div className={styles.contentGrid}>
          <figure className={styles.photoBlock}>
            <img
              src={authorImage}
              alt="Portrait of Catherine Brockenbrough"
              className={styles.photo}
            />
          </figure>

          <div className={styles.textColumn}>
            <p className={`${styles.body} ${styles.lead}`}>
              I'm interested in systems where the behavior that emerges is something
              no individual part intended or designed.
            </p>

            <p className={styles.body}>
              A flock of starlings. A language evolving over centuries. A pattern
              forming on the skin of a zebrafish. The way a single cell becomes a
              brain. These things weren't designed from the top down — they came out
              of local interactions, feedback, and some randomness along the way.
            </p>

            <p className={styles.body}>
              These kinds of systems show up everywhere: biology, markets, how ideas
              spread, what it means to have agency inside something much larger than
              yourself. This project is an attempt to make some of those dynamics
              visible and tangible — through simulations, interactive modules, and
              writing.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
