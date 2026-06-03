/**
 * Module 8 — How Individual Actions Propagate Through Systems
 *
 * Concepts: aggregation, unintended consequences, tipping points, Schelling segregation
 * Simulations used: SchellingViz (lightweight React component — grid-based segregation model)
 */

export const module08 = {
  id: "module-08",
  number: 8,
  title: "How individual actions propagate through systems",
  description: "From local decision to system-wide effect — the paths that individual behavior travels.",
  concepts: ["aggregation", "unintended consequences", "tipping points", "Schelling model"],

  steps: [
    {
      id: "m08-s01",
      type: "READ",
      content: [
        "In 1969, economist Thomas Schelling showed that extreme residential segregation could result from individuals with only mild preferences about their neighbors. Each agent in his model simply preferred not to be in a neighborhood where they were a small minority — a threshold of, say, 30 percent similar neighbors was enough to stay. Below that, they moved.",
        "The aggregate outcome was near-total separation. No individual agent in the simulation chose this outcome. Each individual's rule was mild. The system-level result was extreme.",
        "This is a demonstration of how individual behavior aggregates into system-level patterns that are not legible from any individual's perspective. You would not predict the outcome from observing one agent. Distributed causation does not make the outcome less real or less changeable. It makes it harder to locate, and that is exactly the problem.",
      ],
    },
    {
      id: "m08-s02",
      type: "INTERACT",
      component: "SchellingViz",
      config: {
        gridSize: 30,
        groupARatio: 0.45,
        groupBRatio: 0.45,
        // empty cells: remainder
        showControls: ["toleranceThreshold", "reset", "step", "run"],
        // toleranceThreshold: 0 to 1 slider (fraction of same-type neighbors required to stay)
      },
      prompt: "Start with a tolerance threshold of 0.3 — agents move if fewer than 30% of their neighbors are the same type as them. Run until the system stabilizes. Then reset and try 0.5. Watch what changes in the outcome when the individual preference shifts.",
    },
    {
      id: "m08-s03",
      type: "READ",
      content: [
        "The Schelling model is worth sitting with because it treats individual preferences as given rather than as the object of scrutiny. That is a deliberate simplification. The harm is a property of the aggregate, not traceable to any single agent, but the aggregate outcome is still a fact about the world, and the preferences that feed into it are not beyond examination.",
        "The model also does not describe the history of residential segregation. Real segregation was produced and maintained by explicit mechanisms: restrictive covenants, discriminatory lending, exclusionary zoning, and policy enforced over decades. The Schelling model shows that mild preferences are sufficient to produce segregation in theory. It does not account for what produced it in fact.",
        "This matters for how we think about intervention: changing individual behavior may not change the system-level outcome if the feedback structure that connects individual decisions to aggregate outcomes remains in place.",
        "Propagation also works in the other direction. Small individual actions can produce large system effects, particularly in networks with high connectivity or in systems operating near a tipping point. A cascade can start anywhere. Whether it propagates depends on the structure, not just the size of the initial event.",
        "The question of what causes a system-level outcome is almost never fully answered by pointing at individuals.",
      ],
    },
    {
      id: "m08-s04",
      type: "REFLECT",
      question:
        "Think of a system-level outcome — social, economic, or institutional — that troubles you. How do individual behavior and the structure people are embedded in produce it together? What would changing one without the other actually accomplish?",
    },
  ],
};
