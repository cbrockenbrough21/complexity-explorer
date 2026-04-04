import { useParams, Link } from "react-router-dom";
import { articles } from "../data/articles.js";
import { emergenceEverywhere } from "../content/articles/emergence-everywhere.js";
import styles from "./ArticlePage.module.css";

const contentMap = {
  "emergence-everywhere": emergenceEverywhere,
};

export default function ArticlePage() {
  const { articleId } = useParams();
  const meta = articles.find((a) => a.id === articleId);
  const content = contentMap[articleId];

  if (!meta || !content) {
    return (
      <main className={styles.page}>
        <p className={styles.notFound}>Article not found.</p>
        <Link to="/articles" className={styles.back}>
          ← Back to articles
        </Link>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <Link to="/articles" className={styles.back}>
        ← Back to articles
      </Link>
      <h1 className={styles.title}>{meta.title}</h1>
      <div className={styles.meta}>
        <span className={styles.date}>{meta.date}</span>
        <span className={styles.concepts}>{meta.concepts.join(", ")}</span>
      </div>
      <div className={styles.body}>
        {content.content.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
    </main>
  );
}
