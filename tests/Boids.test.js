import { describe, expect, it } from "vitest";
import { Boids } from "../src/systems/Boids.js";

describe("Boids steering forces", () => {
  it("separation force points away from a nearby neighbor", () => {
    const boids = new Boids({
      width: 200,
      height: 200,
      seedBoids: [
        { x: 50, y: 50, vx: 0, vy: 0 },
        { x: 60, y: 50, vx: 0, vy: 0 }
      ]
    });

    const state = boids.getState();
    const force = boids.computeSeparationForce(state[0], 0, state);

    expect(force.x).toBeLessThan(0);
    expect(Math.abs(force.y)).toBeLessThan(1e-9);
  });

  it("alignment force steers toward neighbor heading", () => {
    const boids = new Boids({
      width: 200,
      height: 200,
      alignmentWeight: 1,
      seedBoids: [
        { x: 50, y: 50, vx: 0, vy: 0 },
        { x: 60, y: 50, vx: 1, vy: 0 }
      ]
    });

    const state = boids.getState();
    const force = boids.computeAlignmentForce(state[0], 0, state);

    expect(force.x).toBeGreaterThan(0);
    expect(Math.abs(force.y)).toBeLessThan(1e-9);
  });

  it("cohesion force points toward local center of mass", () => {
    const boids = new Boids({
      width: 200,
      height: 200,
      cohesionWeight: 1,
      seedBoids: [
        { x: 50, y: 50, vx: 0, vy: 0 },
        { x: 80, y: 50, vx: 0, vy: 0 },
        { x: 80, y: 80, vx: 0, vy: 0 }
      ]
    });

    const state = boids.getState();
    const force = boids.computeCohesionForce(state[0], 0, state);

    expect(force.x).toBeGreaterThan(0);
    expect(force.y).toBeGreaterThan(0);
  });
});
