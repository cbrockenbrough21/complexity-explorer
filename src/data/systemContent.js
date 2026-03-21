export const systemContent = {
  gameOfLife: {
    title: "Conway's Game of Life",
    tagline: "Three tiny rules, endless surprise.",
    forEveryone:
      "A grid of squares, each one alive or dead. Each cell checks its eight neighbors and updates: too few neighbors and it dies, too many and it dies, exactly the right number and it lives or new life spawns. From that: structures that glide, others that flicker, others that hold perfectly still until something disturbs them.",
    forCurious:
      "Some patterns are still lifes — the block, the beehive — stable because every live cell has exactly the right number of neighbors. Others are oscillators: blinkers, toads, beacons cycling between states indefinitely. Then there are gliders, the simplest pattern that moves. Five cells, repeats every four generations, travels diagonally forever.\n\nIn 1970 Conway offered a $50 prize for any pattern that grows without bound. The answer was the Gosper Glider Gun, a fixed pattern that sits in place and periodically fires a new glider, forever.\n\nGame of Life is Turing complete. It can function as a computer. People have built working computers inside it: logic gates from glider collisions, memory from stable patterns, a clock from a glider gun. Someone has run a Game of Life simulation inside a Game of Life board. It runs, just much slower.",
    forEngineers:
      "Synchronous cellular automaton on a 2D toroidal grid. Each step reads neighbor counts from the current grid and writes results to a fresh buffer: O(w×h) time and memory per generation. Primary optimization: maintain a dirty set of only the cells that changed last step and their neighbors, reducing work dramatically for sparse or stable worlds.",
    concepts: ["Emergence", "Cellular Automata", "Local Rules", "Nonlinearity"]
  },
  reactionDiffusion: {
    title: "Reaction-Diffusion (Gray-Scott)",
    tagline: "Chemistry writing geometry in real time.",
    forEveryone:
      "Two chemicals sharing the same space. Each one diffuses outward at a different rate, and where they meet they react, consuming and replenishing each other. Adjust the feed and kill rates and the same equations produce spots, stripes, branching coral, or slowly shifting clouds. The same math that runs here runs in the skin of a leopard, the stripes of a zebrafish, the spots on a seashell, and the branching of coral.",
    forCurious:
      "The reason this produces animal patterns is that two competing processes, spreading out and reacting, naturally find a middle ground that isn't uniform. Uniformity is unstable. Any small random fluctuation gets amplified by the feedback between the two chemicals until it settles into a stable pattern. The spots aren't a solution someone designed. They're the only stable outcome the math allows given those parameters.\n\nAlan Turing described this mechanism in 1952, a paper almost nobody read at the time because he was better known for other things. He predicted that chemistry alone could generate the patterns seen in animal coats, without any blueprint. The specific Gray-Scott equations came later, but the core insight was his.",
    forEngineers:
      "Per step, apply a discrete Laplacian to both concentration fields and integrate the Gray-Scott reaction terms. Cost is O(w×h) per step; this implementation runs multiple micro-steps per frame for visual stability. Primary optimization: move the update loop to a WebGL fragment shader using ping-pong textures, which makes 1024×1024 real-time feasible.",
    concepts: ["Self-Organization", "Dynamical Systems", "Pattern Formation", "Feedback Loops"]
  },
  lSystem: {
    title: "L-System",
    tagline: "A short sentence that grows into a forest.",
    forEveryone:
      "A short string of symbols and a rewriting rule. Every step, each symbol gets replaced according to the rule, and the string grows. After five or six iterations it is thousands of characters long. Read that string as drawing instructions and a fern appears, or a bush, or a dragon curve.",
    forCurious:
      "Each symbol in the string is a drawing instruction. Move forward, turn left, turn right. The branching comes from two special symbols: one that says \"remember this spot\" and one that says \"return to where you last remembered.\" Nest those inside each other and you get a branch that splits into smaller branches, which split into smaller branches still. The branching structure isn't designed. It falls out of that remembering and returning, the same way a real branch produces smaller branches, which produce smaller branches still.\n\nAristid Lindenmayer invented this formalism in 1968. He was a biologist, not a computer scientist, trying to describe how cells divide and plants grow. The fact that the same grammar produces fractal geometry was almost incidental. The Dragon Curve and Sierpinski Triangle fall out of the same machinery, just with different rules.",
    forEngineers:
      "String rewriting runs in O(output length), which grows exponentially with iteration depth, so presets need a hard iteration cap to stay practical. Turtle rendering maintains a position and angle stack for branch push and pop. Primary optimization: stream symbols directly to the renderer rather than materializing the full expanded string in memory.",
    concepts: ["Recursion", "Self-Similarity", "Formal Grammars", "Fractals"]
  },
  boids: {
    title: "Boids",
    tagline: "A flock without a leader still flies as one.",
    forEveryone:
      "Eighty agents moving through a space. Each one does three things: avoid crowding its nearest neighbors, match their speed, drift toward their center. No agent knows anything beyond its immediate surroundings. Run it and a flock forms, sweeps, splits around obstacles, and reforms.",
    forCurious:
      "Craig Reynolds created Boids in 1986 to generate realistic crowd and flock animation for film. The three rules have names: separation, alignment, cohesion. What makes it interesting is that you can tune the weights and the character of the flock changes completely. Heavy separation and the agents scatter nervously. Heavy cohesion and they clump and pulse like a murmuration of starlings. The behavior is sensitive to the balance in a way that feels biological.\n\nThe same model, with minor modifications, has been used to simulate fish schools, pedestrian crowds, and cell migration. Three rules appears to be close to the minimum required to produce something that looks alive.",
    forEngineers:
      "Three steering vectors per agent computed from neighbor sets, then velocity integration with speed clamping and toroidal wrapping. Naive implementation is O(n²) per frame. Primary optimization: uniform spatial grid for neighbor queries, reducing average-case cost to O(n) for typical densities.",
    concepts: ["Decentralized Intelligence", "Multi-Agent Systems", "Collective Behavior", "Emergence"]
  }
};