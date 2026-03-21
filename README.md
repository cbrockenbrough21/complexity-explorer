# complexity-explorer

An interactive learning experience built around four systems from complexity theory — where simple local rules produce emergent global behavior that nobody programmed.

Built as a personal project to understand, visualize, and share the beauty of emergence with technical and non-technical audiences alike.

> Simple rules. Complex worlds. No architect required.

---

## The four systems

| System | Core idea | Complexity concept |
|---|---|---|
| Conway's Game of Life | Three rules. Infinite behavior. | Emergence |
| Reaction-Diffusion (Gray-Scott) | Two chemicals. Every pattern in nature. | Self-organization |
| L-Systems | One rewriting rule. A whole forest. | Recursion, self-similarity |
| Boids | Three steering forces. A flock with no leader. | Decentralized intelligence |

---

## Project phases

- **Phase 1** — Interactive explorer with theory panel `[ ]`
- **Phase 2** — Downloadable high-resolution art prints `[ ]`
- **Phase 3** — Website with philosophical and technical explanations `[ ]`
- **Phase 4** — Raspberry Pi ambient display mode `[ ]`

---

## Tech stack

- Vite + React
- Canvas 2D (Phases 1–3), WebGL (Phase 4)
- Vitest for unit tests
- CSS modules

---

## Architecture

Every simulation implements a common `ISimulation` interface — `init()`, `step()`, `getState()`, `destroy()`. React never touches simulation internals. This allows swapping in a WebGL renderer in Phase 4 without changing any UI code.

See `AGENTS.md` for full architecture decisions, default parameters, and agent session instructions.

---

## Running locally

```bash
npm install
npm run dev
```

## Running tests

```bash
npm run test
```

---

## Motivation

Most people encounter complexity theory through a textbook. This project exists to make it visceral — something you can watch, adjust, and feel. The goal is for a non-technical person to sit in front of it and genuinely have their mind expanded.

All four systems demonstrate the same astonishing idea from different angles: emergence. The global pattern was never specified. It just appeared.