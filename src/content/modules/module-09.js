/**
 * Module 9 — Adaptation and Evolution
 *
 * Concepts: variation, selection, heredity, fitness landscapes, adaptation without foresight
 * Simulations used: EvolutionViz (lightweight React component — population on fitness landscape)
 */

export const module09 = {
  id: "module-09",
  number: 9,
  title: "Adaptation and evolution",
  description: "How systems change over time in response to selection pressure — without foresight or design.",
  concepts: ["evolution", "selection", "fitness landscapes", "adaptation", "variation"],

  steps: [
    {
      id: "m09-s01",
      type: "READ",
      content: [
        "Evolution has no goal. It has no direction. It has no mechanism for planning ahead. What it has is variation, selection, and heredity. Variants that survive and reproduce pass their properties to the next generation. Those that do not disappear from the population. That is sufficient.",
        "Sufficient, it turns out, to produce the immune system — a mechanism that generates novel antibodies to pathogens the organism has never encountered. The immune system operates by the same logic as evolution but at a faster timescale: variation is generated, variants that bind to the pathogen are selected and amplified, the response builds. No cell knows what the pathogen is. No cell knows what the organism needs. The response emerges from selection acting on variation.",
        "Both examples involve the same abstract process applied to different substrates at different speeds. The process does not know what it is doing. The results can look as though someone planned them.",
      ],
    },
    {
      id: "m09-s02",
      type: "INTERACT",
      component: "EvolutionViz",
      config: {
        populationSize: 50,
        // Population displayed on a 2D fitness landscape (color = fitness)
        // Each generation: low-fitness agents are replaced by mutated copies of high-fitness agents
        showControls: ["mutationRate", "selectionStrength", "changeEnvironment", "reset"],
        // changeEnvironment: shifts the fitness landscape, forcing re-adaptation
      },
      prompt: "Let the population adapt to the current environment until it stabilizes. Then change the environment. Watch how the population responds. Try a high mutation rate versus a low one — which recovers faster after the environment shifts?",
    },
    {
      id: "m09-s03",
      type: "READ",
      content: [
        "Adaptation without foresight tends to produce local optima rather than global ones. A population becomes well-adapted to a stable environment and in doing so can lose the variation that would allow it to respond to change. When conditions shift, the very fitness that served it becomes a liability.",
        "Fitness landscapes — the space of possible variants mapped to their reproductive success — help describe this. Evolution is movement through a fitness landscape, but the landscape itself can change. What made a variant fit yesterday may not make it fit tomorrow. The population has no way to know this in advance.",
        "The same pattern appears outside biology: organizations optimize for their current environment and become brittle when it shifts. Technologies converge on a dominant design and crowd out alternatives that might have been better under different conditions. The mechanism is general. The lesson is that adaptation and robustness are not the same thing.",
      ],
    },
    {
      id: "m09-s04",
      type: "REFLECT",
      question:
        "What does it mean to be well-adapted? Well-adapted to what, exactly, and for how long? Is there a version of adaptability that is not the same as being adapted to current conditions?",
    },
  ],
};
