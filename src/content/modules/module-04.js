/**
 * Module 4 — Chaos and Complexity
 *
 * Concepts: sensitive dependence, determinism, unpredictability, bifurcation
 * Simulations used: LogisticMapViz (lightweight React component — logistic map r parameter)
 */

export const module04 = {
  id: "module-04",
  number: 4,
  title: "Chaos and complexity",
  description: "Sensitive dependence on initial conditions — and why prediction has limits even in deterministic systems.",
  concepts: ["chaos", "sensitive dependence", "determinism", "bifurcation", "unpredictability"],

  steps: [
    {
      id: "m04-s01",
      type: "READ",
      content: [
        "In 1961, Edward Lorenz was rerunning a weather simulation. To save time, he started it partway through using printed values from an earlier run. The new run diverged completely. The printout had rounded numbers to three decimal places. The simulation used six. That difference — less than one part in a thousand — produced an entirely different outcome.",
        "This is sensitive dependence on initial conditions. Tiny differences in starting state produce wildly different outcomes over time. It is not noise or randomness. The system is fully deterministic: given identical inputs, it always produces identical outputs. But inputs can never be measured with perfect precision, so long-range prediction becomes practically impossible.",
        "Lorenz eventually described this as the butterfly effect — the metaphor that a butterfly flapping its wings in Brazil could set off a tornado in Texas. The metaphor is imprecise but the point holds: in some systems, small causes can have large effects, and there is no way to know in advance which small causes those will be.",
      ],
    },
    {
      id: "m04-s02",
      type: "INTERACT",
      component: "LogisticMapViz",
      config: {
        // Displays bifurcation diagram and time series for x(n+1) = r * x(n) * (1 - x(n))
        initialR: 2.5,
        minR: 1.0,
        maxR: 4.0,
        showControls: ["rSlider", "twoTrajectories", "reset"],
        // twoTrajectories: show two starting values separated by 0.001 on same plot
      },
      prompt: "Move the growth rate (r) slowly from left to right. Watch where the behavior changes. At low values the population settles. At higher values it oscillates. Past a certain point, try starting the simulation twice with values that differ by a tiny amount.",
    },
    {
      id: "m04-s03",
      type: "READ",
      content: [
        "Chaos and complexity are related but not the same. A chaotic system can be structurally simple — the logistic map is a single equation — but produce unpredictable behavior. A complex system involves many interacting agents and produces emergent structure. Many complex systems are also chaotic, but the terms describe different properties.",
        "What connects them for this project is the limit on prediction. In both chaotic and complex systems, knowing the rules does not mean you can forecast the outcome. In a chaotic system, measurement error compounds. In a complex system, emergent behavior cannot always be derived from the rules in advance.",
        "This is not a failure of understanding. It is a property of the systems themselves.",
      ],
    },
    {
      id: "m04-s04",
      type: "REFLECT",
      question:
        "If a system is fully deterministic but practically unpredictable, does that distinction matter? What would change — about how you act, how you plan — if you took that limit seriously?",
    },
  ],
};
