/**
 * Module 7 — Networks and Connectivity
 *
 * Concepts: small-world networks, scale-free networks, hubs, robustness vs fragility
 * Simulations used: NetworkViz (lightweight React component — node/edge graph with rewiring)
 */

export const module07 = {
  id: "module-07",
  number: 7,
  title: "Networks and connectivity",
  description: "How the structure of connections shapes what can spread, fail, or survive.",
  concepts: ["networks", "small-world", "scale-free", "hubs", "robustness", "cascades"],

  steps: [
    {
      id: "m07-s01",
      type: "READ",
      content: [
        "In 1998, Duncan Watts and Steven Strogatz described a class of networks that are neither fully ordered nor fully random. They have two properties simultaneously: high clustering, meaning most of your connections know each other, and short average path lengths, meaning you can reach almost anyone in the network through a small number of steps.",
        "The same structure appeared in the power grid of the western United States, the neural network of the roundworm C. elegans, and the collaboration network of film actors. The property is not coincidental. It emerges in networks that have evolved or self-organized under similar constraints — local connection is cheap, long-range connection is expensive, and the network needs to be both cohesive and navigable.",
        "Watts and Strogatz called these small-world networks. The name comes from the intuition most people have had — that the world is somehow smaller than it looks, that a short chain of introductions can connect almost any two people.",
      ],
    },
    {
      id: "m07-s02",
      type: "INTERACT",
      component: "NetworkViz",
      config: {
        nodeCount: 30,
        initialTopology: "smallWorld", // "random" | "smallWorld" | "scaleFree"
        showControls: ["topology", "addHub", "removeHub", "cascade", "reset"],
        // cascade: highlight which nodes fail when a selected node is removed
      },
      prompt: "Start with the small-world topology. Select a random node and remove it — watch how many other nodes become disconnected. Then switch to scale-free and try removing a hub node. Try removing a random peripheral node in the same topology.",
    },
    {
      id: "m07-s03",
      type: "READ",
      content: [
        "Network structure determines vulnerability in ways that are not obvious from looking at any individual node. A random network degrades gradually as nodes are removed — each removal has a small effect. A scale-free network, where a small number of hubs have many more connections than average, is highly resilient to random failure but fragile to targeted attack on those hubs.",
        "The internet was designed with redundancy in mind. The web grew without a designer, and the structure it settled into has different properties than the infrastructure it runs on. Both are networks. Neither behaves the same way under failure.",
        "Understanding a network's structure — how connected it is, where the hubs are, how clustered — tells you something about what can spread through it and what can take it down. This applies to infrastructure, to disease transmission, to how ideas and behaviors propagate through social systems.",
      ],
    },
    {
      id: "m07-s04",
      type: "REFLECT",
      question:
        "Think of a network you participate in — professional, social, digital. Where are you a hub? Where are you peripheral? What does your position mean for what reaches you and what you can reach?",
    },
  ],
};
