# AGENTS.md

Read this file at the start of every session before doing anything else.

---

## What this project is

A website exploring complex systems through simulations, interactive learning modules, and articles. All four simulations demonstrate emergence — global patterns arising from simple local rules. The project prioritizes visual beauty and accessibility to non-technical audiences, alongside technical depth for engineers.

The site has three layers:
- **Simulations** — watch and interact with systems directly (Explorer, System pages)
- **Learning modules** — guided, interactive lessons that teach the underlying concepts
- **Articles** — long-form essays connecting complex systems ideas to the real world

---

## Architecture principles

### The ISimulation interface
Every simulation must implement exactly four methods:

```js
init(config)   // initialize or re-initialize with given config object
step()         // advance simulation by one tick
getState()     // return current state (shape varies per system, see below)
destroy()      // clean up any resources (timers, GL contexts, etc.)
```

React components never touch simulation internals. They only call these four methods. This is the strategy pattern — the UI layer is completely decoupled from the simulation layer.

### Why this matters
Phase 4 introduces `WebGLReactionDiffusion.js` — a GPU-accelerated version of Gray-Scott running in a fragment shader. Because it implements the same interface, no UI code needs to change. This is the architectural payoff of the pattern. Do not break this contract.

### CanvasRenderer
`CanvasRenderer.js` is the only place that knows how to draw. It calls `getState()` each frame and draws accordingly. It detects which system it is drawing from the shape of the state object. Simulation classes know nothing about rendering.

### React components
- Never import simulation internals directly
- Pass system class as a prop, not an instance
- All config changes go through `init()` — never mutate system state directly

---

## Known bugs — do not reintroduce

### Canvas aspect ratio
Cells and simulation visuals must always render as squares, never as stretched rectangles. This is most visible in Game of Life when the canvas is not square, but applies to all systems. The canvas element must never distort cell proportions. When sizing a canvas:
- For grid-based systems (Game of Life): canvas pixel size = grid width × cellSize by grid height × cellSize
- For continuous systems (Boids, Reaction-Diffusion): canvas pixel size = config.width × config.height exactly
- Never stretch the canvas element to fill a container if that would change the aspect ratio — use CSS object-fit or center it instead

---

## Default parameters

### Game of Life
- Grid: 80×80
- Cell size: 8px
- Initial density: 0.3 (30% alive on init)
- Steps per second: 10
- Grid is toroidal (edges wrap)

### Reaction-Diffusion (Gray-Scott)
- Grid: 256×256
- Feed rate (f): 0.055
- Kill rate (k): 0.062
- Diffusion rate A (dA): 1.0
- Diffusion rate B (dB): 0.5
- Steps per frame: 8
- Seed: random patches of B on init

### L-Systems
- Default preset: Fern
- Default iterations: 5
- Default angle: 25°
- Five presets: Fern, Algae, Bush, Dragon curve, Sierpinski triangle
- step() does nothing — L-systems are not time-stepped
- getState() returns { string, drawParams }

### Boids
- Agent count: 80
- Canvas: 600×600
- Max speed: 2
- Separation radius: 25
- Alignment radius: 50
- Cohesion radius: 50
- Separation weight: 1.5
- Alignment weight: 1.0
- Cohesion weight: 1.0
- Toroidal wrapping
- getState() returns array of { x, y, vx, vy }

---

## File structure

```
src/
  systems/
    ISimulation.js          # JSDoc interface definition
    GameOfLife.js
    ReactionDiffusion.js
    LSystem.js
    Boids.js
    WebGLReactionDiffusion.js  # Phase 4 only
  renderer/
    CanvasRenderer.js
    PrintRenderer.js           # Phase 2
  components/
    Nav.jsx                       # Phase 3
    SimulationView.jsx
    Controls.jsx
    TheoryPanel.jsx
    CaptureButton.jsx
    modules/
      ModulePlayer.jsx            # Phase 5
      GameOfLifePredictor.jsx     # Phase 5
      MiniGameOfLife.jsx          # Phase 5
      MiniBoids.jsx               # Phase 5
  pages/
    Home.jsx                      # Phase 3
    Explore.jsx                   # Phase 3
    SystemPage.jsx                # Phase 3
    About.jsx                     # Phase 3
    Articles.jsx                  # Phase 4
    ArticlePage.jsx               # Phase 4
    Learn.jsx                     # Phase 5
    ModulePage.jsx                # Phase 5
  data/
    systemContent.js
    printPresets.js
    articles.js                   # Phase 4
    modules.js                    # Phase 5
  content/
    articles/                     # Phase 4 — one .js file per article
  utils/
    exportCanvas.js
tests/
  GameOfLife.test.js
  Boids.test.js
  exportCanvas.test.js
```

---

## Testing rules

- Use Vitest
- All tests must pass before a session is considered complete
- Never move to the next session with failing tests
- Tests live in /tests, not colocated with source files

---

## Phase completion

The README.md tracks phase completion with checkboxes. At the end of each phase, update README.md to mark it complete.

Current phases:
- Phase 1 — Interactive explorer [x]
- Phase 2 — Downloadable high-res prints [x]
- Phase 3 — Website (routing, pages, about, deploy) [ ]
- Phase 4 — Articles scaffold [ ]
- Phase 5 — Learning modules [ ]
- Phase 6 — WebGL upgrade [ ]

---

## Code style

- ES modules throughout (import/export)
- JSDoc comments on all public methods
- No TypeScript — JSDoc for type hints is sufficient
- CSS modules for component styles
- No external UI libraries — build everything from scratch
- Keep simulation code framework-agnostic (no React imports in systems/)
- Learning module interactive components may import simulation system classes directly — they are not general UI components