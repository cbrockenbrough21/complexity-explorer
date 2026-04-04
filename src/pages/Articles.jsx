import { Link } from "react-router-dom";
import { articles } from "../data/articles.js";
import styles from "./Articles.module.css";

export default function Articles() {
  const published = articles.filter((a) => a.published);

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Articles</h1>
      {published.length === 0 ? (
        <p className={styles.empty}>No articles yet.</p>
      ) : (
        <ul className={styles.list}>
          {published.map((article) => (
            <li key={article.id} className={styles.item}>
              <Link to={`/articles/${article.id}`} className={styles.link}>
                <h2 className={styles.articleTitle}>{article.title}</h2>
                <p className={styles.description}>{article.description}</p>
                <div className={styles.meta}>
                  <span className={styles.date}>{article.date}</span>
                  <span className={styles.concepts}>
                    {article.concepts.join(", ")}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
