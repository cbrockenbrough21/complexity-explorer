/**
 * Module 6 — Self-Organization and Pattern Formation
 *
 * Concepts: self-organization, Turing patterns, reaction-diffusion, order from disorder
 * Simulations used: MiniReactionDiffusion (uses existing ReactionDiffusion system, smaller grid)
 */

export const module06 = {
  id: "module-06",
  number: 6,
  title: "Self-organization and pattern formation",
  description: "How ordered patterns appear spontaneously from disordered starting conditions.",
  concepts: ["self-organization", "Turing patterns", "reaction-diffusion", "pattern formation"],

  steps: [
    {
      id: "m06-s01",
      type: "READ",
      content: [
        "Sand dropped onto a flat surface forms a cone. Add more sand and the cone grows until the slope becomes too steep, then it avalanches. The final shape — stable slopes, repeating angle of repose — is not designed. It forms from the interaction between sand grains and gravity operating locally at every point on the surface.",
        "Self-organization is the process by which a system develops ordered structure without external direction. The order comes from within — from the interactions of the system's own components under the same local rules, applied everywhere simultaneously.",
        "The result is not random and not designed. It is constrained. The same rules applied to different initial conditions tend to produce recognizably similar structures. Sand always makes a cone. It does not sometimes make a cube.",
      ],
    },
    {
      id: "m06-s02",
      type: "INTERACT",
      component: "MiniReactionDiffusion",
      config: {
        width: 128,
        height: 128,
        stepsPerFrame: 10,
        presets: ["spots", "stripes", "labyrinth"],
        showControls: ["preset", "reset", "feed", "kill"],
      },
      prompt: "Try each preset. Each one uses the same two-chemical model with different parameter values. Watch how long it takes for the pattern to stabilize. Then adjust the feed rate slowly and watch the pattern shift.",
    },
    {
      id: "m06-s03",
      type: "READ",
      content: [
        "The reaction-diffusion system you just watched produces different patterns depending on the relative rates of two processes: how fast each chemical spreads, and how they interact. These are the dynamics Turing identified in 1952 as a candidate mechanism for biological pattern formation.",
        "Turing predicted that chemistry alone — two chemicals with competing feedback — could generate stripes, spots, and complex spatial patterns without any blueprint specifying where each marking should go. Subsequent experiments in angelfish and later in zebrafish found strong evidence that exactly this kind of dynamic is at work in skin patterning.",
        "Self-organization does not require complex rules. The Gray-Scott model is two equations. The patterns it produces are structurally rich because the system explores its state space as it finds equilibrium, and that space has a lot of interesting structure in it.",
      ],
    },
    {
      id: "m06-s04",
      type: "REFLECT",
      question:
        "The pattern was not specified anywhere. It formed because of the rules and the initial conditions. Does that change what the pattern means, or what it is?",
    },
  ],
};
