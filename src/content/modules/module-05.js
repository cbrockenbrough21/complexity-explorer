/**
 * Module 5 — Top-Down and Bottom-Up
 *
 * Concepts: centralized control, decentralized organization, hybrid systems
 * Simulations used: DesirePathViz (lightweight React component — agents pathfinding)
 */

export const module05 = {
  id: "module-05",
  number: 5,
  title: "Top-down and bottom-up",
  description: "When central control helps, when it hurts, and what fills the gap when it's absent.",
  concepts: ["top-down control", "bottom-up organization", "self-organization", "hybrid systems"],

  steps: [
    {
      id: "m05-s01",
      type: "READ",
      content: [
        "A city grid is designed top-down. Someone decided where the streets go. But the paths worn across a park emerge bottom-up — they form from thousands of individual decisions about the shortest or most convenient route, with no designer involved. Urban planners sometimes call these desire lines.",
        "Top-down and bottom-up are not opposites in the sense that one replaces the other. Most functional systems involve both. The question is what each mode is good at producing, and what each tends to get wrong.",
        "Top-down control works well when the relevant information is already centralized, when the environment is stable, and when coordination needs to happen faster than local interaction can achieve it. Armies, assembly lines, and air traffic control work because the variables are known in advance and the rules do not change mid-operation.",
      ],
    },
    {
      id: "m05-s02",
      type: "INTERACT",
      component: "DesirePathViz",
      config: {
        gridWidth: 30,
        gridHeight: 20,
        agentCount: 40,
        // Agents move from random left-edge points to random right-edge points
        // Pheromone trail accumulates and influences subsequent agents
        showControls: ["addAgents", "clearPaths", "reset", "showPheromones"],
      },
      prompt: "Let agents move without any defined paths. Watch which routes form and strengthen over time. Then clear the trails and change the obstacle layout. Notice how the system recalculates.",
    },
    {
      id: "m05-s03",
      type: "READ",
      content: [
        "Bottom-up organization tends to be more robust when the environment is unpredictable or when the relevant information is distributed across many agents. Markets aggregate price information from millions of transactions that no central authority could process in time. The immune system responds to pathogens it has never encountered before. Language evolves to describe things that did not exist when the last speaker was alive.",
        "Neither mode is inherently superior. The interesting cases are where one is used when the other would work better — a market applied to a problem that requires coordination toward a single outcome, or a central authority trying to manage a system whose relevant information is irreducibly local.",
        "Most failures of complex systems involve this mismatch. The mechanism is fine. It is being applied to the wrong kind of problem.",
      ],
    },
    {
      id: "m05-s04",
      type: "REFLECT",
      question:
        "Think of an organization or institution you know well. Where does top-down control produce the outcomes it is meant to? Where does it not — and what takes over in those gaps?",
    },
  ],
};
