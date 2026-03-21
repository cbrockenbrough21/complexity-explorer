# Agent session prompts — complexity-explorer

Copy and paste each prompt into your agent when you're ready for that session.
Complete each session fully before starting the next one.
Run the tests at the end of every session before moving on.

---

## Phase 1 — Interactive explorer

---

### Session 1 — Scaffold + Game of Life

```
Read AGENTS.md carefully before doing anything.

Task: Phase 1, Session 1.

1. Scaffold a Vite + React project in the current directory. Remove all boilerplate components and styles — start clean.
2. Create src/systems/ISimulation.js — a JSDoc interface definition with four methods: init(config), step(), getState(), destroy(). Add comments explaining why this interface exists and what the strategy pattern achieves here.
3. Implement src/systems/GameOfLife.js behind that interface. Use the default parameters from AGENTS.md. The grid must be toroidal (edges wrap). getState() returns the grid as a 2D array.
4. Create src/renderer/CanvasRenderer.js — takes a canvas element and a system instance, calls getState() each frame, draws cells. No simulation logic here.
5. Create src/components/SimulationView.jsx — mounts a canvas, instantiates a system and renderer, runs requestAnimationFrame loop. Accepts a system class as a prop.
6. Wire up App.jsx to render SimulationView with GameOfLife. Unstyled is fine.
7. Install Vitest. Write tests/GameOfLife.test.js covering all four rules: underpopulation (fewer than 2 neighbors dies), survival (2-3 neighbors lives), overcrowding (more than 3 dies), birth (dead cell with exactly 3 neighbors becomes alive).
8. Run tests. All must pass before finishing.
```

---

### Session 2 — Remaining three systems

```
Read AGENTS.md carefully before doing anything.
Read the README to confirm Phase 1 Session 1 is complete.

Task: Phase 1, Session 2.

Implement the remaining three simulation systems, each behind the ISimulation interface from AGENTS.md defaults.

1. src/systems/ReactionDiffusion.js — Gray-Scott model. Two Float32Arrays (A and B). Discrete Laplacian for diffusion. getState() returns both grids. Seed with random patches on init.
2. src/systems/LSystem.js — string rewriting system. Ship five presets: Fern, Algae, Bush, Dragon curve, Sierpinski triangle. init() accepts preset name, iterations, angle. getState() returns the expanded string and draw parameters. step() does nothing (L-systems are not time-stepped).
3. src/systems/Boids.js — 80 agents. Three steering forces: separation, alignment, cohesion. Toroidal wrapping. getState() returns array of {x, y, vx, vy}.
4. Update CanvasRenderer.js to handle all four system types — detect from getState() shape and draw accordingly.
5. Build src/components/Controls.jsx — sliders and buttons per system. Each control calls init() with updated config, never directly mutates system state.
6. Update App.jsx with four tabs, one per system. All four must run without errors.
7. Write tests/Boids.test.js — test that separation force points away from neighbor, alignment force matches neighbor heading, cohesion force points toward centre of group.
8. Run all tests. All must pass before finishing.
```

---

### Session 3 — Theory panel + polish

```
Read AGENTS.md carefully before doing anything.
Read the README to confirm Phase 1 Session 2 is complete.

Task: Phase 1, Session 3.

1. Create src/data/systemContent.js — static content for all four systems. Each entry has:
   - title, tagline
   - forEveryone: 2-3 sentence poetic description, no jargon
   - forCurious: conceptual explanation with the aha moment
   - forEngineers: algorithm description, time complexity, optimization path
   - concepts: array of concept tags (e.g. Emergence, Self-organization)
   - interviewAngle: one paragraph on how to speak about this system in a technical interview

2. Create src/components/TheoryPanel.jsx — displays content from systemContent.js for the active system. Three audience tabs: Everyone / Curious / Engineers. Concept tags displayed as pills. Clean readable typography.

3. Update the main layout — simulation canvas on the left, theory panel on the right. Responsive: stacks vertically on mobile.

4. Polish the controls — labels, units, sensible min/max ranges per system.

5. Add a generation/frame counter displayed above the canvas.

6. Update README — mark Phase 1 as complete: change [ ] to [x] next to Phase 1.

7. Run all existing tests. All must pass.
```

---

## Phase 2 — Downloadable high-res prints

---

### Session 4 — Offscreen high-res capture

```
Read AGENTS.md carefully before doing anything.
Read the README to confirm Phase 1 is complete.

Task: Phase 2, Session 1.

1. Create src/renderer/PrintRenderer.js — renders a single frame to an offscreen canvas at 4x the display resolution. Accepts a system instance and a print preset. Must not affect the live running simulation.

2. Create src/utils/exportCanvas.js — takes a canvas element, exports it as a PNG download. Filename format: {systemName}-gen{generation}-{timestamp}.png

3. Add print presets to src/data/printPresets.js:
   - Square (3000×3000px)
   - A3 portrait (3508×4961px at 300dpi)
   - A2 portrait (4961×7016px at 300dpi)

4. Create src/components/CaptureButton.jsx — a button that pauses the simulation, renders a high-res frame using PrintRenderer, triggers download via exportCanvas, then resumes. Show a brief "Capturing..." state while rendering.

5. Add CaptureButton to the main UI above the canvas.

6. Write tests/exportCanvas.test.js — test that output canvas dimensions match each print preset exactly.

7. Run all tests. All must pass.

8. Update README — mark Phase 2 as complete: change [ ] to [x] next to Phase 2.
```

---

## Phase 3 — Website

---

### Session 5 — Routing + landing page

```
Read AGENTS.md carefully before doing anything.
Read the README to confirm Phase 2 is complete.

Task: Phase 3, Session 1.

1. Install React Router. Set up routes: / (home), /explore (the explorer from Phase 1), /systems/:id (individual system pages, Phase 3 Session 2), /about (Phase 3 Session 3).

2. Create src/pages/Home.jsx — landing page. Hero section with a live running simulation as background (pick whichever looks best). A short poetic statement about complexity. Four cards, one per system, each linking to /systems/:id. Clean, considered design.

3. Move the Phase 1 explorer into src/pages/Explore.jsx. Link to it from the nav.

4. Create a persistent nav component with links to Home, Explore, and About.

5. Run all tests. All must pass.
```

---

### Session 6 — Individual system pages

```
Read AGENTS.md carefully before doing anything.
Read the README to confirm Phase 3 Session 1 is complete.

Task: Phase 3, Session 2.

1. Create src/pages/SystemPage.jsx — dynamic page for each system driven by systemContent.js and the :id route param.

2. Each page has: hero section with live simulation running full-width, the three-layer explanation (Everyone / Curious / Engineers) from TheoryPanel, the capture/download button, concept tags, and a link to the next system.

3. The live simulation on the hero should auto-run with beautiful default parameters — no controls visible, just the art.

4. Add subtle transitions between sections as the user scrolls.

5. Run all tests. All must pass.
```

---

### Session 7 — About page + final polish

```
Read AGENTS.md carefully before doing anything.
Read the README to confirm Phase 3 Session 2 is complete.

Task: Phase 3, Session 3.

1. Create src/pages/About.jsx — your story. Why complexity theory, why this project, what you find beautiful about it. Written in first person. Space for a photo if you want one later.

2. Polish the full site — consistent spacing, typography, color palette across all pages.

3. Set up deployment — configure for GitHub Pages or Vercel. Add deploy instructions to README.

4. Run all tests. All must pass.

5. Update README — mark Phase 3 as complete: change [ ] to [x] next to Phase 3.
```

---

## Phase 4 — Raspberry Pi ambient display

---

### Session 8 — Ambient mode + WebGL reaction-diffusion

```
Read AGENTS.md carefully before doing anything.
Read the README to confirm Phase 3 is complete.

Task: Phase 4.

1. Create src/pages/Ambient.jsx — fullscreen route at /ambient with zero UI chrome. No nav, no controls, no theory panel. Auto-cycles through all four systems every 3 minutes with a slow fade transition between them. Each system runs with its most visually beautiful default parameters.

2. Implement src/systems/WebGLReactionDiffusion.js — Gray-Scott model running in a WebGL fragment shader. Must implement the same ISimulation interface as the canvas version: init(), step(), getState(), destroy(). Grid size 512×512. The React components must not need any changes — this is the payoff of the strategy pattern.

3. Swap WebGLReactionDiffusion in for ReactionDiffusion in the Ambient page only. Keep canvas version for the explorer (better for the controls interaction).

4. Create pi/autostart.sh — a shell script that launches Chromium in fullscreen kiosk mode pointing at /ambient on boot. Add setup instructions to README under a "Raspberry Pi setup" section.

5. Run all tests. All must pass.

6. Update README — mark Phase 4 as complete: change [ ] to [x] next to Phase 4. Add a note about what comes next.
```
