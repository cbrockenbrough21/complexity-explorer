import { NavLink } from "react-router-dom";
import styles from "./NavBar.module.css";

const NAV_LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/explore", label: "Explore" },
  { to: "/about", label: "About" }
];

export default function NavBar() {
  return (
    <header className={styles.shell}>
      <div className={styles.inner}>
        <NavLink to="/" className={styles.brand}>
          Complexity Explorer
        </NavLink>

        <nav className={styles.nav} aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => `${styles.link} ${isActive ? styles.linkActive : ""}`}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
