import { useParams, Link } from "react-router-dom";
import { MODULES_BY_ID } from "../data/modules.js";
import ModulePlayer from "../components/modules/ModulePlayer.jsx";
import styles from "./ModulePage.module.css";

export default function ModulePage() {
  const { moduleId } = useParams();
  const module = MODULES_BY_ID[moduleId];

  if (!module) {
    return (
      <main className={styles.page}>
        <p className={styles.notFound}>Module not found.</p>
        <Link to="/learn" className={styles.back}>← Back to modules</Link>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <Link to="/learn" className={styles.back}>← Back to modules</Link>
      <h1 className={styles.title}>{module.title}</h1>
      <ModulePlayer module={module} />
    </main>
  );
}
