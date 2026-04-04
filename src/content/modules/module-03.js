/**
 * Module 3 — Collective Behavior Without a Leader
 *
 * Concepts: decentralization, local interaction, emergent coordination
 * Simulations used: MiniBoids
 */

export const module03 = {
  id: "module-03",
  number: 3,
  title: "Collective behavior without a leader",
  description: "How groups coordinate without any individual directing the whole.",
  concepts: ["decentralization", "local interaction", "emergent coordination", "swarm behavior"],

  steps: [
    {
      id: "m03-s01",
      type: "READ",
      content: [
        "A flock of starlings turns in less than a tenth of a second — faster than any signal could travel from a leader at the front to birds at the back. There is no leader. The turn propagates through the flock because each bird responds to the birds immediately around it.",
        "Craig Reynolds modeled this in 1986. He gave simulated agents three rules: stay close to your neighbors, avoid collisions with them, and match their direction of travel. The program produced flocking behavior that looked, to most observers, indistinguishable from the real thing. No rule describes a flock. The flock appears from the rules operating simultaneously across all agents.",
        "This matters because it shows that coordination does not require a coordinator. The outcome looks intentional. Nothing about the mechanism is.",
      ],
    },
    {
      id: "m03-s02",
      type: "INTERACT",
      component: "MiniBoids",
      config: {
        agentCount: 60,
        width: 500,
        height: 400,
        showControls: ["separationWeight", "alignmentWeight", "cohesionWeight", "reset"],
      },
      prompt: "Start with the default weights. Watch what the group does. Then set separation to maximum and cohesion to zero. Then reverse it. Notice how the collective behavior changes even though you are only adjusting parameters each individual follows.",
    },
    {
      id: "m03-s03",
      type: "READ",
      content: [
        "The same principle appears in ant colonies. No ant knows the colony's food supply or the optimal path to a food source. Each ant deposits pheromones as it walks and tends to follow stronger pheromone trails left by others. The colony finds and reinforces efficient paths through purely local interactions.",
        "The colony behaves as though it has a plan. It does not. The plan-like behavior is a consequence of many individuals following simple local rules simultaneously. Remove any one ant and the behavior continues. There is no single point of failure because there is no single point of control.",
        "This robustness is one of the distinctive properties of decentralized systems. It is also one of the reasons they are hard to redirect once they get going.",
      ],
    },
    {
      id: "m03-s04",
      type: "REFLECT",
      question:
        "Think of a group you have been part of — a team, a community, an online space — where coordination happened without anyone directing it. What were the local rules people were following? Who set them?",
    },
  ],
};
