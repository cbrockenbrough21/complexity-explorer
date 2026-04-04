/**
 * Module 1 — How Does Complexity Arise
 *
 * Concepts: emergence, complicated vs complex, local rules, global behavior
 * Simulations used: MiniGameOfLife
 */

export const module01 = {
  id: "module-01",
  number: 1,
  title: "How does complexity arise",
  description: "The difference between complicated and complex — and why it matters.",
  concepts: ["emergence", "local rules", "global behavior"],

  steps: [
    {
      id: "m01-s01",
      type: "READ",
      content: [
        "A light switch is simple: one input, one output. A jet engine is complicated. It has thousands of parts, but understanding each part gets you to understanding the whole. You can take it apart, diagnose it, predict it.",
        "A murmuration of starlings doesn't work that way. Each bird simply tracks its nearest neighbors, matches their speed and stays close. No bird has information about the flock as a whole. No one bird is responsible for the shape. It emerges from the interactions among the birds.",
        "This is the distinction complexity science cares about. Complicated systems can be decomposed into their parts and understood that way. Complex systems cannot — not because they are harder to understand, but because the behavior lives in the relationships between parts, not in the parts themselves.",
      ],
    },
    {
      id: "m01-s02",
      type: "INTERACT",
      component: "MiniGameOfLife",
      config: {
        width: 40,
        height: 40,
        cellSize: 10,
        initialDensity: 0.3,
        stepsPerSecond: 8,
        showControls: ["play", "pause", "step", "reset", "density"],
      },
      prompt: "Run the simulation for a while. Then pause it and step forward one generation at a time. Watch what happens at the level of a single cell, then pull back and watch the whole grid.",
    },
    {
      id: "m01-s03",
      type: "READ",
      content: [
        "The Game of Life has three rules. A live cell with two or three live neighbors survives. A dead cell with exactly three live neighbors becomes alive. All other cells die or stay dead.",
        "No rule describes a glider — a pattern that travels across the grid indefinitely. No rule describes an oscillator, or a stable block, or the complex structures that emerge from random starting conditions. Those patterns are not specified anywhere. They come out of many cells applying the same three rules simultaneously.",
        "This is what emergence means. The whole has properties that none of its parts have, and that you could not predict from examining any single part in isolation.",
      ],
    },
    {
      id: "m01-s04",
      type: "REFLECT",
      question:
        "Think of a system — biological, social, technological — where the behavior of the whole seems disconnected from the behavior of its parts. What are the parts doing? What is the whole doing that no part is responsible for?",
    },
  ],
};
