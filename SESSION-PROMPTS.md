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
### Session 7 — About page + polish + deploy
```
Read AGENTS.md carefully before doing anything.
Read the README to confirm Phase 3 Sessions 5 and 6 are complete.

Task: Phase 3, Session 3.

1. Create src/pages/About.jsx using the following exact text as the page
   content. Do not rewrite, summarize, or editorialize — use this text
   as written:

   ---

   Catherine Brockenbrough

   I'm interested in systems where the behavior that emerges is something
   no individual part intended or designed.

   A flock of starlings. A language evolving over centuries. A pattern
   forming on the skin of a zebrafish. The way a single cell becomes a
   brain. These things weren't designed from the top down — they came out
   of local interactions, feedback, and some randomness along the way.

   These kinds of systems show up everywhere: biology, markets, how ideas
   spread, what it means to have agency inside something much larger than
   yourself. This project is an attempt to make some of those dynamics
   visible and tangible — through simulations, interactive modules, and
   writing.

   ---

   Leave a clearly marked placeholder for a photo: a styled empty block
   with the text "[ photo ]" centered inside it, positioned after the
   name and before the first paragraph.

2. Polish the full site:
   - Consistent spacing, typography, and color palette across all pages
   - All nav links work correctly
   - Mobile responsive: stacks sensibly on small screens
   - No broken routes
   - KNOWN BUG: audit all canvases for aspect ratio distortion. Cells
     must always render as squares, never stretched rectangles. This is
     most visible in Game of Life when the viewport is not square.
     See AGENTS.md for the full rule.

3. Set up deployment for Vercel. Add a DEPLOYMENT.md with clear
   instructions:
   - How to deploy for the first time
   - How to redeploy after changes
   - Any environment variables needed (there are none currently)

4. Update README — mark Phase 3 as complete: change [ ] to [x] next
   to Phase 3.

5. Run all tests. All must pass.
```

---

## Phase 4 — Articles scaffold

---

### Session 8 — Articles infrastructure

```
Read AGENTS.md carefully before doing anything.
Read the README to confirm Phase 3 is complete before starting.

Task: Phase 4, Session 1.

1. Create src/data/articles.js — a static index of articles. Each entry has:
   - id: string (kebab-case, matches filename in src/content/articles/)
   - title: string
   - description: string (1-2 sentences, shown in article listing)
   - date: string (ISO format: "2025-01-01")
   - concepts: string[] (concept tags)
   - published: boolean (false = draft, not shown in listing)

   Seed it with one placeholder article:
   {
     id: "emergence-everywhere",
     title: "Emergence everywhere",
     description: "A placeholder article.",
     date: "2025-01-01",
     concepts: ["emergence"],
     published: false,
   }

2. Create src/content/articles/emergence-everywhere.js — exports a single
   object with an id field matching the filename and a content field.
   Content is an array of paragraph strings. Use placeholder text.
   This establishes the pattern for all future articles.

   export const emergenceEverywhere = {
     id: "emergence-everywhere",
     content: [
       "Placeholder paragraph one.",
       "Placeholder paragraph two.",
     ],
   };

3. Add routes to the React Router config:
   /articles             → src/pages/Articles.jsx
   /articles/:articleId  → src/pages/ArticlePage.jsx

4. Create src/pages/Articles.jsx — lists all published articles from
   articles.js (where published === true). If no published articles exist,
   show a clean empty state: "No articles yet." Do not show drafts.

5. Create src/pages/ArticlePage.jsx — loads an article by ID. Imports
   the matching content file dynamically or via a lookup map. Renders
   the title, date, concept tags, and content paragraphs. Handles unknown
   IDs with a clear 404-style fallback.

6. Add /articles to the Nav component.

7. Update README — mark Phase 4 as complete: change [ ] to [x] next
   to Phase 4.

8. Run all tests. All must pass.
```

---

## Phase 5 — Learning modules

---

### Session 9 — Module data index

```
Read AGENTS.md carefully before doing anything.
Read the README to confirm Phase 4 is complete before starting.

Task: Phase 5, Session 1.

1. Verify that the following files exist in src/content/modules/:
   module-01.js through module-09.js
   If any are missing, stop and report which ones.

2. Create src/data/modules.js — imports all 9 module exports and
   re-exports them as an ordered array and a keyed object:

   import { module01 } from "../content/modules/module-01.js";
   import { module02 } from "../content/modules/module-02.js";
   ... (all 9)

   export const MODULES = [
     module01, module02, module03,
     module04, module05, module06,
     module07, module08, module09,
   ];

   export const MODULES_BY_ID = Object.fromEntries(
     MODULES.map(m => [m.id, m])
   );

3. Do not create any page or routing components yet. Content index only.

4. Run all tests. All must pass.
```

---

### Session 10 — ModulePlayer + Learn page + routing

```
Read AGENTS.md carefully before doing anything.
Read the README to confirm Phase 5 Session 1 is complete.

Task: Phase 5, Session 2.

1. Add routes to the React Router config:
   /learn                → src/pages/Learn.jsx
   /learn/:moduleId      → src/pages/ModulePage.jsx

2. Create src/pages/Learn.jsx — lists all 9 modules as cards.
   Each card shows: module number, title, description, concept tags.
   Links to /learn/:moduleId.

3. Create src/pages/ModulePage.jsx — loads a module by ID from
   MODULES_BY_ID. Renders ModulePlayer for that module. Handles
   unknown IDs with a clear fallback.

4. Create src/components/modules/ModulePlayer.jsx — a scrolling layout
that renders all steps in sequence as a single page. No next/back
navigation. Each step type has a distinct visual treatment with generous
vertical spacing between steps so the transitions feel deliberate.
READ steps render as flowing paragraphs.
INTERACT steps render the placeholder div with the prompt as a caption
below it. The interact block should be visually distinct from the
reading — enough whitespace above and below that it reads as a pause.
REFLECT steps render the question with extra top margin and no
additional UI. It should feel like the page ending, not a form.

   REFLECT: renders step.question as a single paragraph. No additional UI.

5. Add /learn to the Nav component.

6. Run all tests. All must pass.
```

---
### Session 11a — Interactive components (simulation-based)

```
Read AGENTS.md carefully before doing anything.
Read the README to confirm Phase 5 Session 2 is complete.

Task: Phase 5, Session 3a.

Build the three interactive components that wrap existing simulation
system classes. Each lives in src/components/modules/.

Rules for all three:
- Pass the system class as a prop. Never import simulation internals
  directly into the component.
- All config changes go through init(). Never mutate system state directly.
- All canvases follow the aspect ratio rules in AGENTS.md.
- No external libraries.

---

MiniGameOfLife
File: src/components/modules/MiniGameOfLife.jsx

Wraps the existing GameOfLife system class.
Accepts a config prop:
  {
    width: number,        // grid width in cells
    height: number,       // grid height in cells
    cellSize: number,     // pixels per cell
    initialDensity: number,
    stepsPerSecond: number,
    showControls: string[],
  }

showControls determines which controls render. Possible values:
  "play"    — button, starts the simulation
  "pause"   — button, pauses the simulation
  "step"    — button, advances one generation while paused
  "reset"   — button, calls init() with current config
  "density" — slider 0.1–0.9, calls init() with updated initialDensity

Canvas size = width * cellSize by height * cellSize exactly.

---

MiniBoids
File: src/components/modules/MiniBoids.jsx

Wraps the existing Boids system class.
Accepts a config prop:
  {
    agentCount: number,
    width: number,
    height: number,
    showControls: string[],
  }

showControls possible values:
  "separationWeight" — slider 0–3, calls init() with updated weight
  "alignmentWeight"  — slider 0–3, calls init() with updated weight
  "cohesionWeight"   — slider 0–3, calls init() with updated weight
  "reset"            — button, calls init() with current config

Canvas size = width by height exactly.
Simulation runs continuously. No play/pause needed.

---

MiniReactionDiffusion
File: src/components/modules/MiniReactionDiffusion.jsx

Wraps the existing ReactionDiffusion system class.
Accepts a config prop:
  {
    width: number,
    height: number,
    stepsPerFrame: number,
    presets: string[],
    showControls: string[],
  }

Presets map to these Gray-Scott parameter pairs:
  "spots"     — feed: 0.035, kill: 0.065
  "stripes"   — feed: 0.060, kill: 0.062
  "labyrinth" — feed: 0.055, kill: 0.062

showControls possible values:
  "preset" — dropdown of preset names, calls init() with preset parameters
  "reset"  — button, calls init() with current config
  "feed"   — slider 0.01–0.09, calls init() with updated feed rate
  "kill"   — slider 0.04–0.07, calls init() with updated kill rate

Canvas size = width by height exactly.

---

After building all three:

Replace the placeholder divs in ModulePlayer for these three components.
The lookup already exists from Session 2:

  const INTERACT_COMPONENTS = {
    MiniGameOfLife,
    MiniBoids,
    MiniReactionDiffusion,
    // others coming in Session 3b
  };

Leave placeholders for the Session 3b components.

Run all tests. All must pass.
```

---

### Session 11b — Interactive components (self-contained)

```
Read AGENTS.md carefully before doing anything.
Read the README to confirm Phase 5 Session 3a is complete.

Task: Phase 5, Session 3b.

Build the six self-contained interactive components. Each lives in
src/components/modules/. Each manages its own state with React hooks.
No ISimulation interface. Canvas 2D or plain DOM only. No external libraries.
All canvases follow the aspect ratio rules in AGENTS.md.

---

FeedbackLoopViz
File: src/components/modules/FeedbackLoopViz.jsx

Simulates a value evolving over time under positive or negative feedback.
Renders a live time-series line on a canvas. The line updates continuously.

Positive feedback: value moves away from center, grows or shrinks toward
the boundary. Negative feedback: value is pulled back toward the midpoint.

Accepts a config prop:
  {
    initialValue: number,   // starting value, e.g. 50
    minValue: number,       // e.g. 0
    maxValue: number,       // e.g. 100
    showControls: string[],
  }

showControls possible values:
  "feedbackType"     — toggle button: "positive" / "negative"
  "feedbackStrength" — slider 0.0–1.0
  "reset"            — resets value to initialValue, clears the line

---

LogisticMapViz
File: src/components/modules/LogisticMapViz.jsx

Renders the logistic map: x(n+1) = r * x(n) * (1 - x(n)).
Displays a time series on a canvas, updated each frame.
Starting value is always 0.5 unless twoTrajectories is enabled.

When twoTrajectories is enabled: plot two trajectories starting at
0.500 and 0.501 in two different colors on the same axes.

Accepts a config prop:
  {
    initialR: number,   // e.g. 2.5
    minR: number,       // e.g. 1.0
    maxR: number,       // e.g. 4.0
    showControls: string[],
  }

showControls possible values:
  "rSlider"          — slider from minR to maxR, step 0.01
  "twoTrajectories"  — checkbox, enables the two-trajectory mode
  "reset"            — clears the plot, restarts from x=0.5

---

DesirePathViz
File: src/components/modules/DesirePathViz.jsx

Grid-based. Agents spawn on the left edge and move toward the right edge.
Each agent deposits pheromone on the cells it visits. Subsequent agents
are attracted to stronger pheromone trails, with some randomness.
Pheromone fades slowly over time.

Accepts a config prop:
  {
    gridWidth: number,
    gridHeight: number,
    agentCount: number,
    showControls: string[],
  }

showControls possible values:
  "addAgents"      — button, adds 10 more agents
  "clearPaths"     — button, resets all pheromone to zero
  "reset"          — resets agents and pheromone, restarts
  "showPheromones" — toggle, shows pheromone intensity as a heatmap overlay

---

NetworkViz
File: src/components/modules/NetworkViz.jsx

Displays a node-edge graph rendered on a canvas.
Nodes are positioned using a simple force-directed layout or fixed
positions — either is acceptable as long as the graph is readable.

Supports three topologies:
  "random"     — edges assigned randomly, uniform degree distribution
  "smallWorld" — high clustering and short path lengths (Watts-Strogatz)
  "scaleFree"  — few hubs with many connections, most nodes with few
                 (preferential attachment)

Cascade mode: when a node is clicked, highlight in a distinct color
which other nodes would become unreachable if that node were removed.

Accepts a config prop:
  {
    nodeCount: number,
    initialTopology: string,
    showControls: string[],
  }

showControls possible values:
  "topology"   — dropdown: random / smallWorld / scaleFree, regenerates graph
  "addHub"     — button, adds one high-degree node connected to 5 existing nodes
  "removeHub"  — button, removes the highest-degree node
  "cascade"    — toggle, enables click-to-cascade mode
  "reset"      — regenerates graph with current topology

---

SchellingViz
File: src/components/modules/SchellingViz.jsx

Grid of agents in two groups (A and B) plus empty cells.
Each step: any agent whose fraction of same-type neighbors is below
the tolerance threshold moves to a random empty cell.

Accepts a config prop:
  {
    gridSize: number,       // e.g. 30 — renders as gridSize x gridSize
    groupARatio: number,    // e.g. 0.45
    groupBRatio: number,    // e.g. 0.45 — remainder are empty cells
    showControls: string[],
  }

showControls possible values:
  "toleranceThreshold" — slider 0.0–1.0, step 0.05
  "reset"              — reinitializes grid with current ratios
  "step"               — advances one generation
  "run"                — runs continuously until stable or button pressed again

Render group A and group B in two visually distinct colors.
Empty cells are the background color.

---

EvolutionViz
File: src/components/modules/EvolutionViz.jsx

A population of agents displayed on a 2D fitness landscape.
The landscape is a heatmap rendered on a canvas — warmer colors = higher
fitness. Agents are dots positioned on the landscape.

Each generation:
  1. Evaluate each agent's fitness from the landscape at its position.
  2. Remove the lowest 50% by fitness.
  3. Replace them with mutated copies of surviving agents.
     Mutation = small random offset to position, scaled by mutationRate.

changeEnvironment rerandomizes the fitness landscape using a new set
of gaussian peaks. The population must re-adapt.

Accepts a config prop:
  {
    populationSize: number,
    showControls: string[],
  }

showControls possible values:
  "mutationRate"       — slider 0.01–0.5
  "selectionStrength"  — slider 0.1–1.0 (fraction culled each generation)
  "changeEnvironment"  — button, rerandomizes the fitness landscape
  "reset"              — resets population and landscape

---

After building all six:

Complete the INTERACT_COMPONENTS lookup in ModulePlayer:

  const INTERACT_COMPONENTS = {
    MiniGameOfLife,
    MiniBoids,
    MiniReactionDiffusion,
    FeedbackLoopViz,
    LogisticMapViz,
    DesirePathViz,
    NetworkViz,
    SchellingViz,
    EvolutionViz,
  };

All nine components should now be wired up. Verify that every module
renders its INTERACT step with a real component, not a placeholder.

Update README — mark Phase 5 as complete: change [ ] to [x] next to Phase 5.

Run all tests. All must pass.
```