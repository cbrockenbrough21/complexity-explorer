import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar.jsx";
import Home from "./pages/Home.jsx";
import Explore from "./pages/Explore.jsx";
import SystemPage from "./pages/SystemPage.jsx";
import About from "./pages/About.jsx";
import Articles from "./pages/Articles.jsx";
import ArticlePage from "./pages/ArticlePage.jsx";
import Learn from "./pages/Learn.jsx";
import ModulePage from "./pages/ModulePage.jsx";
import styles from "./App.module.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<Home />} />
          <Route path="explore" element={<Explore />} />
          <Route path="systems/:id" element={<SystemPage />} />
          <Route path="about" element={<About />} />
          <Route path="articles" element={<Articles />} />
          <Route path="articles/:articleId" element={<ArticlePage />} />
          <Route path="learn" element={<Learn />} />
          <Route path="learn/:moduleId" element={<ModulePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function SiteLayout() {
  return (
    <div className={styles.siteFrame}>
      <NavBar />
      <Outlet />
    </div>
  );
}
