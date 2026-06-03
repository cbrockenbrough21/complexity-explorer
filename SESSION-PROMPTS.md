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

## Phase 6

### Session 12 — getState() type discriminant

Read AGENTS.md carefully before doing anything.
Read the README to confirm Phase 5 is complete.

Task: Architectural fix — add explicit type discriminants to all getState() returns.

The current CanvasRenderer detects which system it is drawing by inspecting
the shape of the state object (field names, array types). This works for four
known systems but is fragile — a new system that happens to share field names
could be misidentified. Replace shape inference with an explicit type field.

1. Update each simulation class to include a `type` string in its getState()
   return value. Use these exact strings:

   GameOfLife.js     → type: 'game-of-life'
   ReactionDiffusion.js → type: 'reaction-diffusion'
   LSystem.js        → type: 'l-system'
   Boids.js          → type: 'boids'

   No other changes to these files. The type field is appended to the existing
   return object — do not restructure getState() returns.

2. Update CanvasRenderer.js to route on state.type instead of the four
   private shape-detection methods (#isGridState, #isReactionDiffusionState,
   #isLSystemState, #isBoidsState). Replace them with a single switch or
   if-chain on state.type. Log a clear warning to the console if an unknown
   type is encountered rather than silently doing nothing.

3. Update the JSDoc on ISimulation.js to note that all getState()
   implementations must include a type: string field. Add it as a documented
   requirement on the interface.

4. Add a test in tests/CanvasRenderer.test.js (create this file) that
   instantiates a mock system returning each of the four known type strings
   and confirms the renderer calls the correct drawing path without throwing.
   Use a headless canvas (install canvas package if not already present).

5. Run all tests. All must pass.

--
### Session 13a — WebGL upgrade for Reaction-Diffusion
Read AGENTS.md carefully before doing anything.
Read the README to confirm Phase 5 is complete and the Session 12 fix is in.
Task: Phase 6 — GPU-accelerated Reaction-Diffusion.
The goal is to replace the Canvas 2D Reaction-Diffusion renderer with a
WebGL 2 fragment shader implementation, gaining ~10-50x performance and making
large grid sizes (512×512, 1024×1024) real-time feasible. Because all
simulation classes implement ISimulation, no UI code should need to change.
If WebGL 2 is unavailable (`getContext('webgl2')` returns null), silently fall
back to the existing `ReactionDiffusion` class with no user-facing error.

1. Create src/systems/WebGLReactionDiffusion.js implementing the ISimulation
   interface exactly. Read ReactionDiffusion.js before writing this file and
   match all default config values exactly. Config shape is identical to
   ReactionDiffusion.js (width, height, feed, kill, dA, dB, dt, stepsPerFrame,
   patchCount, patchSizeMin, patchSizeMax) so it is a drop-in replacement.
   - init(config): sets up the WebGL 2 context on an offscreen canvas, compiles
     shaders, and allocates two ping-pong RGBA32F floating-point textures (A
     concentration in the red channel, B concentration in the green channel).
     Seeds initial state by generating a CPU-side Float32Array matching the same
     random patch logic as ReactionDiffusion.js (#seedRandomPatches: fills A=1
     everywhere, then places patchCount square patches of B=1/A=0 with random
     center and radius between patchSizeMin and patchSizeMax, with toroidal
     wrapping), then uploads it via texImage2D.
   - step(): runs exactly stepsPerFrame ping-pong passes of the simulation
     fragment shader per call, matching the CPU version's behavior precisely.
     Each pass reads from the current texture and writes to the other, then
     swaps. Uses NEAREST filtering and REPEAT wrap mode for toroidal boundary
     conditions.
   - getState(): returns { type: 'reaction-diffusion', width, height, texture }
     where texture is the WebGLTexture containing the current state. Does NOT
     read pixels back to the CPU — the renderer reads from the texture directly.
   - destroy(): deletes all WebGL resources (textures, framebuffers, programs,
     the offscreen canvas).
   Vertex shader: full-screen quad covering clip space using two triangles.
   Outputs a vUv varying for texture coordinates.
   Simulation fragment shader: reads A and B from the input texture (A in .r,
   B in .g). Implements the 8-neighbor weighted discrete Laplacian matching
   ReactionDiffusion.js exactly (center weight -1.0, cardinal neighbors 0.2
   each, diagonal neighbors 0.05 each). Applies Gray-Scott equations:
     reaction = A * B * B
     newA = A + (dA * lapA - reaction + feed * (1.0 - A)) * dt
     newB = B + (dB * lapB + reaction - (kill + feed) * B) * dt
   Clamps both outputs to [0, 1]. Toroidal wrapping via mod(). Uniforms:
   uState (sampler2D), uResolution (vec2), uFeed, uKill, uDA, uDB, uDT.
   Display fragment shader: maps A and B to the exact same color scheme as
   CanvasRenderer.js #drawReactionDiffusion. The CPU path computes
   val = clamp((A - B) * 255, 0, 255), R = val, G = clamp(val + 30, 0, 255),
   B = 220. Translated to GLSL:
     vec2 ab = texture(uState, vUv).rg;
     float val = clamp(ab.r - ab.g, 0.0, 1.0);
     gl_FragColor = vec4(val, clamp(val + 30.0/255.0, 0.0, 1.0), 220.0/255.0, 1.0);

2. Update CanvasRenderer.js to handle both paths. #drawReactionDiffusion
   already handles the CPU path (state.A and state.B as Float32Arrays). Add a
   WebGL path: when state.texture is present (and state.A is absent), blit the
   WebGLTexture to the display canvas using a simple WebGL 2 context on the
   display canvas, running the display fragment shader described above. When
   state.A is a Float32Array, keep the existing CPU pixel-write path entirely
   unchanged so MiniReactionDiffusion continues to work without WebGL.

3. Update src/data/systemContent.js — in the reaction-diffusion entry, update
   the forEngineers text to describe the WebGL 2 implementation: mention the
   ping-pong texture approach (two RGBA32F textures swapped each pass so the
   GPU never reads and writes the same texture simultaneously), the Gray-Scott
   fragment shader, the ~10-50x speedup over the Canvas 2D path, and that
   MiniReactionDiffusion intentionally keeps the CPU implementation for its
   smaller grid size.

4. Update the system selector in Explore.jsx (or wherever ReactionDiffusion
   is instantiated as the active system) to use WebGLReactionDiffusion instead.
   The fallback inside WebGLReactionDiffusion handles the no-WebGL-2 case
   transparently. Do not change MiniReactionDiffusion or any module components.

5. Update AGENTS.md — add WebGLReactionDiffusion.js to the known file structure
   and note that MiniReactionDiffusion uses the Canvas 2D implementation
   intentionally (smaller grid, no need for GPU overhead).

6. Update README — mark Phase 6 as complete.

7. Run all tests. All must pass.

### Session 13b — Benchmark WebGL Reaction-Diffusion grid sizes
The WebGL implementation is now complete. We need to find
the best default grid size based on real performance data.

1. Find every place ReactionDiffusion or WebGLReactionDiffusion is instantiated
   in the codebase, including the home page and any module/preview components.
   Show me the file, the grid size each one uses, and whether it is the main
   Explore view or a smaller preview.

2. Add a temporary benchmark mode to the Explore view only. Gate everything
   behind a URL param (?benchmark=1) so no production code paths are touched.
   When the param is present:
   - Test grid sizes 256x256, 512x512, 768x768, and 1024x1024
   - Run each for 60 frames, measuring actual frame time using performance.now()
   - Display results on screen as a simple overlay showing grid size and average fps
   - Clean up after itself completely when the param is absent

3. Once I have run the benchmark in the browser and shared the fps results,
   update the default grid size in WebGLReactionDiffusion.js to whichever size
   runs comfortably at 60fps, then remove all benchmark code.

4. Run all tests. All must pass.

---

## Phase 7 — Simulation lifecycle hardening

---

### Session 14 — Tab visibility pause/resume

```
Read AGENTS.md carefully before doing anything.

Task: Simulation lifecycle hardening.

The animation loop in SimulationView.jsx already pauses and resumes via
pausedRef. This session adds one improvement: pause the loop automatically
when the browser tab is backgrounded, and resume it when the tab returns
to the foreground.

1. In SimulationView.jsx, inside the useEffect that sets up the animation
   loop, add a visibilitychange listener on document:

   const handleVisibilityChange = () => {
     pausedRef.current = document.hidden;
   };
   document.addEventListener("visibilitychange", handleVisibilityChange);

   Remove the listener in the existing cleanup return:

   document.removeEventListener("visibilitychange", handleVisibilityChange);

   The listener must be added after pausedRef is initialized and before
   rafId is set. The cleanup must run cancelAnimationFrame, destroy the
   renderer and system, AND remove the event listener — all four, in that
   order.

2. Do not change any other behavior. The existing pause/resume controls,
   the frame counter, and all other SimulationView logic must remain
   identical.

3. Run all existing tests. All must pass.
```

## Phase 8 — Polish and module cleanup

---

### Session 15 — Nav cleanup, silent fallback, next-module navigation

```
Read AGENTS.md carefully before doing anything.

Task: Phase 8, Session 1.

---

1. src/components/Nav.jsx (or NavBar.jsx — check which filename exists)
   Remove the Articles entry from the nav links array:
     { to: "/articles", label: "Articles" }
   Do not remove the routes from App.jsx. The /articles URL should still
   resolve if visited directly — just not linked from the nav.

---

2. src/components/modules/ModulePlayer.jsx
   Currently, when a component name in an INTERACT step is not found in
   INTERACT_COMPONENTS, the fallback renders a placeholder div and the
   step's prompt text.

   Change this: if the component is not found in INTERACT_COMPONENTS,
   render nothing for that entire step — no placeholder div, no prompt.
   The module should read as if the INTERACT step is simply absent.

   Do not change behavior for steps whose component IS found.

---

3. src/pages/ModulePage.jsx
   Add a next-module link at the bottom of the page, below ModulePlayer.

   Logic:
   - Import MODULES from src/data/modules.js
   - Find the index of the current module in MODULES by matching module.id
   - If a next module exists (index + 1 is within bounds), render a link
     to /learn/[nextModule.id] labeled "Next: [nextModule.title]"
   - If the current module is the last in the array, render a link to
     /learn labeled "← Back to all modules"

   Style it consistently with any existing navigation links on the page.
   Give it enough top margin that it reads as a natural end to the page
   rather than something tacked on.

---

4. Run all tests. All must pass.
```