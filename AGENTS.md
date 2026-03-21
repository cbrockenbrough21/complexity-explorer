# AGENTS.md

Read this file at the start of every session before doing anything else.

---

## What this project is

An interactive browser-based explorer for four systems from complexity theory. All four demonstrate emergence — global patterns arising from simple local rules. The project prioritizes visual beauty and accessibility to non-technical audiences, alongside technical depth for engineers.

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
    SimulationView.jsx
    Controls.jsx
    TheoryPanel.jsx
    CaptureButton.jsx          # Phase 2
  pages/
    Home.jsx                   # Phase 3
    Explore.jsx                # Phase 3
    SystemPage.jsx             # Phase 3
    About.jsx                  # Phase 3
    Ambient.jsx                # Phase 4
  data/
    systemContent.js           # theory panel content
    printPresets.js            # Phase 2
  utils/
    exportCanvas.js            # Phase 2
tests/
  GameOfLife.test.js
  Boids.test.js
  exportCanvas.test.js         # Phase 2
pi/
  autostart.sh                 # Phase 4
```

---

## Testing rules

- Use Vitest
- All tests must pass before a session is considered complete
- Never move to the next session with failing tests
- Tests live in /tests, not colocated with source files

---

## Phase completion

The README.md tracks phase completion with checkboxes. At the end of each phase, update README.md to mark it complete:

- Phase 1 complete: change `[ ]` to `[x]` next to Phase 1
- Same for Phases 2, 3, 4

Agent sessions check the README at the start to confirm prior phases are done before proceeding.

---

## Code style

- ES modules throughout (import/export)
- JSDoc comments on all public methods
- No TypeScript — JSDoc for type hints is sufficient
- CSS modules for component styles
- No external UI libraries — build everything from scratch
- Keep simulation code framework-agnostic (no React imports in systems/)
