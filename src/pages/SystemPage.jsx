import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CaptureButton from "../components/CaptureButton.jsx";
import TheoryPanel from "../components/TheoryPanel.jsx";
import { CanvasRenderer } from "../renderer/CanvasRenderer.js";
import { systemContent } from "../data/systemContent.js";
import { SYSTEM_ORDER, SYSTEMS } from "../data/systems.js";
import styles from "./SystemPage.module.css";

const HERO_CONFIG_OVERRIDES = {
  gameOfLife: {
    width: 160,
    height: 96,
    initialDensity: 0.28,
    stepsPerSecond: 14
  },
  reactionDiffusion: {
    width: 320,
    height: 220,
    feed: 0.053,
    kill: 0.061,
    stepsPerFrame: 10,
    stepsPerSecond: 30
  },
  lSystem: {
    width: 1200,
    height: 700,
    preset: "Fern",
    iterations: 6,
    angle: 23,
    stepsPerSecond: 8
  },
  boids: {
    width: 1400,
    height: 540,
    agentCount: 120,
    alignmentWeight: 1.15,
    cohesionWeight: 1.1,
    separationWeight: 1.45,
    stepsPerSecond: 60
  }
};

export default function SystemPage() {
  const { id } = useParams();
  const [simulationApi, setSimulationApi] = useState(null);
  const content = id ? systemContent[id] ?? null : null;
  const systemDef = id ? SYSTEMS[id] ?? null : null;

  const nextSystem = useMemo(() => {
    if (!id || !systemDef) {
      return null;
    }

    const currentIndex = SYSTEM_ORDER.indexOf(id);
    if (currentIndex === -1) {
      return null;
    }

    const nextId = SYSTEM_ORDER[(currentIndex + 1) % SYSTEM_ORDER.length];
    return {
      id: nextId,
      label: SYSTEMS[nextId].label,
      title: systemContent[nextId].title
    };
  }, [id, systemDef]);

  useEffect(() => {
    setSimulationApi(null);
  }, [id]);

  useEffect(() => {
    const revealedClass = styles.revealVisible;
    const sections = document.querySelectorAll('[data-system-reveal="true"]');

    if (typeof IntersectionObserver !== "function") {
      sections.forEach((section) => section.classList.add(revealedClass));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add(revealedClass);
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -8% 0px"
      }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  if (!content || !systemDef) {
    return (
      <main className={styles.page}>
        <section className={styles.notFoundPanel}>
          <h1 className={styles.notFoundTitle}>System not found</h1>
          <p className={styles.notFoundBody}>
            This system id does not exist. Choose one of the four systems from the homepage.
          </p>
          <Link to="/" className={styles.returnLink}>Return home</Link>
        </section>
      </main>
    );
  }

  const heroConfig = {
    ...systemDef.defaultConfig,
    ...(HERO_CONFIG_OVERRIDES[id] ?? {})
  };

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <HeroSimulation
          systemClass={systemDef.classRef}
          config={heroConfig}
          onSystemReady={(_, api) => setSimulationApi(api)}
        />
        <div className={styles.heroScrim} aria-hidden="true" />

        <header className={styles.heroContent}>
          <p className={styles.kicker}>System Study</p>
          <h1 className={styles.title}>{content.title}</h1>
          <p className={styles.tagline}>{content.tagline}</p>
          <div className={styles.heroTags}>
            {content.concepts.map((concept) => (
              <span key={concept} className={styles.heroTagPill}>
                {concept}
              </span>
            ))}
          </div>
        </header>
      </section>

      <section
        className={`${styles.sectionCard} ${styles.revealBase}`}
        data-system-reveal="true"
      >
        <h2 className={styles.sectionTitle}>Capture this moment</h2>
        <p className={styles.sectionBody}>
          Export the current state as a high-resolution print. The live simulation is paused
          during capture and resumes immediately after.
        </p>
        <CaptureButton simulationApi={simulationApi} systemName={systemDef.label} />
      </section>

      <section
        className={`${styles.sectionCard} ${styles.revealBase}`}
        data-system-reveal="true"
      >
        <TheoryPanel systemKey={id} />
      </section>

      <section
        className={`${styles.sectionCard} ${styles.revealBase} ${styles.nextSection}`}
        data-system-reveal="true"
      >
        <p className={styles.nextLabel}>Continue the journey</p>
        <Link to={`/systems/${nextSystem.id}`} className={styles.nextLink}>
          Next: {nextSystem.label}
        </Link>
        <p className={styles.nextHint}>{nextSystem.title}</p>
      </section>
    </main>
  );
}

function HeroSimulation({ systemClass, config, onSystemReady }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return undefined;
    }

    const system = new systemClass(config);
    applyCanvasSize(canvas, system.config);
    const renderer = new CanvasRenderer(canvas, system);
    let paused = false;
    let frame = 0;
    let generation = 0;

    if (typeof onSystemReady === "function") {
      onSystemReady(system, {
        pause: () => {
          paused = true;
        },
        resume: () => {
          paused = false;
        },
        getSystem: () => system,
        getGeneration: () => generation,
        getFrame: () => frame,
        applyConfig: (nextConfig) => {
          system.init(nextConfig);
          frame = 0;
          generation = 0;
        }
      });
    }

    let rafId = 0;
    let lastTime = performance.now();
    let accumulator = 0;

    const animate = (timestamp) => {
      if (paused) {
        lastTime = timestamp;
        rafId = requestAnimationFrame(animate);
        return;
      }

      const delta = timestamp - lastTime;
      lastTime = timestamp;
      let stepsAdvanced = 0;

      const stepsPerSecond = system.config?.stepsPerSecond ?? 60;
      if (stepsPerSecond >= 60) {
        system.step();
        stepsAdvanced = 1;
      } else {
        accumulator += delta;
        const stepMs = 1000 / Math.max(stepsPerSecond, 1);
        while (accumulator >= stepMs) {
          system.step();
          accumulator -= stepMs;
          stepsAdvanced += 1;
        }
      }

      renderer.render();
      frame += 1;
      generation += stepsAdvanced;
      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      renderer.destroy();
      system.destroy();
    };
  }, [systemClass, config, onSystemReady]);

  return <canvas ref={canvasRef} className={styles.heroCanvas} aria-label="Live simulation" />;
}

function applyCanvasSize(canvas, config = {}) {
  const { width = 600, height = 600, cellSize } = config;

  if (typeof cellSize === "number") {
    canvas.width = Math.max(1, Math.floor(width * cellSize));
    canvas.height = Math.max(1, Math.floor(height * cellSize));
    return;
  }

  canvas.width = Math.max(1, Math.floor(width));
  canvas.height = Math.max(1, Math.floor(height));
}
