import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar.jsx";
import Home from "./pages/Home.jsx";
import Explore from "./pages/Explore.jsx";
import SystemPage from "./pages/SystemPage.jsx";
import About from "./pages/About.jsx";
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
