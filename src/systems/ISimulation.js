/**
 * Interface contract for every simulation in this project.
 *
 * The UI (React) only speaks to simulations through these four methods.
 * This strategy-pattern boundary keeps rendering and controls decoupled from
 * implementation details, so systems can be swapped (including GPU versions)
 * without changing component logic.
 */
export class ISimulation {
  /**
   * Initialize or re-initialize simulation state.
   * @param {Object} config - System-specific configuration values.
   */
  init(config) {
    throw new Error("init(config) must be implemented by simulation classes.");
  }

  /**
   * Advance the simulation by one tick.
   */
  step() {
    throw new Error("step() must be implemented by simulation classes.");
  }

  /**
   * Return the current simulation state.
   * @returns {*} State payload consumed by renderers.
   */
  getState() {
    throw new Error("getState() must be implemented by simulation classes.");
  }

  /**
   * Release resources held by the simulation.
   */
  destroy() {
    throw new Error("destroy() must be implemented by simulation classes.");
  }
}
