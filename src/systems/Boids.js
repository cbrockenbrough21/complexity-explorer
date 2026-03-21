import { ISimulation } from "./ISimulation.js";

const DEFAULT_CONFIG = {
  agentCount: 80,
  width: 600,
  height: 600,
  maxSpeed: 2,
  separationRadius: 25,
  alignmentRadius: 50,
  cohesionRadius: 50,
  separationWeight: 1.5,
  alignmentWeight: 1.0,
  cohesionWeight: 1.0
};

/**
 * Boids flocking simulation with toroidal wrapping.
 */
export class Boids extends ISimulation {
  /**
   * @param {Object} [config]
   */
  constructor(config = {}) {
    super();
    this.config = { ...DEFAULT_CONFIG };
    this.boids = [];
    this.init(config);
  }

  /**
   * @param {Object} [config]
   */
  init(config = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };

    if (Array.isArray(config.seedBoids) && config.seedBoids.length > 0) {
      this.boids = config.seedBoids.map((boid) => ({ ...boid }));
      return;
    }

    const { agentCount, width, height, maxSpeed } = this.config;
    this.boids = Array.from({ length: agentCount }, () => {
      const angle = Math.random() * Math.PI * 2;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: Math.cos(angle) * maxSpeed,
        vy: Math.sin(angle) * maxSpeed
      };
    });
  }

  /**
   * Advance boid positions and velocities by one tick.
   */
  step() {
    const updates = this.boids.map((boid, idx) => {
      const sep = this.computeSeparationForce(boid, idx, this.boids);
      const align = this.computeAlignmentForce(boid, idx, this.boids);
      const coh = this.computeCohesionForce(boid, idx, this.boids);

      let vx = boid.vx + sep.x + align.x + coh.x;
      let vy = boid.vy + sep.y + align.y + coh.y;

      const speed = Math.hypot(vx, vy);
      if (speed > this.config.maxSpeed && speed > 0) {
        vx = (vx / speed) * this.config.maxSpeed;
        vy = (vy / speed) * this.config.maxSpeed;
      }

      let x = boid.x + vx;
      let y = boid.y + vy;

      x = (x + this.config.width) % this.config.width;
      y = (y + this.config.height) % this.config.height;

      return { x, y, vx, vy };
    });

    this.boids = updates;
  }

  /**
   * @returns {Array<{x:number,y:number,vx:number,vy:number}>}
   */
  getState() {
    return this.boids;
  }

  destroy() {
    this.boids = [];
  }

  /**
   * Steering force that pushes boids away from nearby neighbors.
   * @param {{x:number,y:number,vx:number,vy:number}} boid
   * @param {number} boidIndex
   * @param {Array<{x:number,y:number,vx:number,vy:number}>} boids
   * @returns {{x:number,y:number}}
   */
  computeSeparationForce(boid, boidIndex, boids = this.boids) {
    const { separationRadius, separationWeight } = this.config;
    let forceX = 0;
    let forceY = 0;

    for (let i = 0; i < boids.length; i += 1) {
      if (i === boidIndex) {
        continue;
      }

      const { dx, dy, dist } = this.#deltaTo(boid, boids[i]);
      if (dist > 0 && dist < separationRadius) {
        forceX += dx / (dist * dist);
        forceY += dy / (dist * dist);
      }
    }

    return {
      x: forceX * separationWeight,
      y: forceY * separationWeight
    };
  }

  /**
   * Steering force that aligns heading with nearby neighbors.
   * @param {{x:number,y:number,vx:number,vy:number}} boid
   * @param {number} boidIndex
   * @param {Array<{x:number,y:number,vx:number,vy:number}>} boids
   * @returns {{x:number,y:number}}
   */
  computeAlignmentForce(boid, boidIndex, boids = this.boids) {
    const { alignmentRadius, alignmentWeight } = this.config;
    let avgVx = 0;
    let avgVy = 0;
    let count = 0;

    for (let i = 0; i < boids.length; i += 1) {
      if (i === boidIndex) {
        continue;
      }

      const { dist } = this.#deltaTo(boid, boids[i]);
      if (dist < alignmentRadius) {
        avgVx += boids[i].vx;
        avgVy += boids[i].vy;
        count += 1;
      }
    }

    if (count === 0) {
      return { x: 0, y: 0 };
    }

    avgVx /= count;
    avgVy /= count;

    return {
      x: (avgVx - boid.vx) * alignmentWeight,
      y: (avgVy - boid.vy) * alignmentWeight
    };
  }

  /**
   * Steering force that pulls boids toward local center of mass.
   * @param {{x:number,y:number,vx:number,vy:number}} boid
   * @param {number} boidIndex
   * @param {Array<{x:number,y:number,vx:number,vy:number}>} boids
   * @returns {{x:number,y:number}}
   */
  computeCohesionForce(boid, boidIndex, boids = this.boids) {
    const { cohesionRadius, cohesionWeight } = this.config;
    let centerX = 0;
    let centerY = 0;
    let count = 0;

    for (let i = 0; i < boids.length; i += 1) {
      if (i === boidIndex) {
        continue;
      }

      const { dist } = this.#deltaTo(boid, boids[i]);
      if (dist < cohesionRadius) {
        centerX += boids[i].x;
        centerY += boids[i].y;
        count += 1;
      }
    }

    if (count === 0) {
      return { x: 0, y: 0 };
    }

    centerX /= count;
    centerY /= count;

    return {
      x: (centerX - boid.x) * 0.01 * cohesionWeight,
      y: (centerY - boid.y) * 0.01 * cohesionWeight
    };
  }

  #deltaTo(fromBoid, toBoid) {
    let dx = fromBoid.x - toBoid.x;
    let dy = fromBoid.y - toBoid.y;

    const halfW = this.config.width / 2;
    const halfH = this.config.height / 2;

    if (dx > halfW) {
      dx -= this.config.width;
    } else if (dx < -halfW) {
      dx += this.config.width;
    }

    if (dy > halfH) {
      dy -= this.config.height;
    } else if (dy < -halfH) {
      dy += this.config.height;
    }

    const dist = Math.hypot(dx, dy);
    return { dx, dy, dist };
  }
}
