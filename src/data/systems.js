import { GameOfLife } from "../systems/GameOfLife.js";
import { ReactionDiffusion } from "../systems/ReactionDiffusion.js";
import { LSystem } from "../systems/LSystem.js";
import { Boids } from "../systems/Boids.js";

export const SYSTEMS = {
  gameOfLife: {
    id: "gameOfLife",
    label: "Game of Life",
    classRef: GameOfLife,
    defaultConfig: {
      width: 80,
      height: 80,
      cellSize: 8,
      initialDensity: 0.3,
      stepsPerSecond: 10
    }
  },
  reactionDiffusion: {
    id: "reactionDiffusion",
    label: "Reaction-Diffusion",
    classRef: ReactionDiffusion,
    defaultConfig: {
      width: 256,
      height: 256,
      feed: 0.055,
      kill: 0.062,
      dA: 1.0,
      dB: 0.5,
      stepsPerFrame: 8
    }
  },
  lSystem: {
    id: "lSystem",
    label: "L-System",
    classRef: LSystem,
    defaultConfig: {
      width: 700,
      height: 700,
      preset: "Fern",
      iterations: 5,
      angle: 25,
      stepsPerSecond: 1
    }
  },
  boids: {
    id: "boids",
    label: "Boids",
    classRef: Boids,
    defaultConfig: {
      width: 600,
      height: 600,
      agentCount: 80,
      maxSpeed: 2,
      separationRadius: 25,
      alignmentRadius: 50,
      cohesionRadius: 50,
      separationWeight: 1.5,
      alignmentWeight: 1,
      cohesionWeight: 1,
      stepsPerSecond: 60
    }
  }
};

export const SYSTEM_ORDER = [
  "gameOfLife",
  "reactionDiffusion",
  "lSystem",
  "boids"
];
