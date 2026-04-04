/**
 * Module 2 — Feedback Loops
 *
 * Concepts: positive feedback, negative feedback, amplification, stability
 * Simulations used: FeedbackLoopViz (lightweight React component)
 */

export const module02 = {
  id: "module-02",
  number: 2,
  title: "Feedback loops",
  description: "How outputs that feed back into a system generate amplification, stability, and pattern.",
  concepts: ["positive feedback", "negative feedback", "stability", "amplification"],

  steps: [
    {
      id: "m02-s01",
      type: "READ",
      content: [
        "A thermostat keeps a room at a fixed temperature. When the room cools below the target, the heater turns on. When it warms above the target, the heater turns off. The output — room temperature — feeds back to control the input — whether the heater runs. This is a negative feedback loop. It resists change and produces stability.",
        "Positive feedback works the other way. A microphone held near its own speaker picks up the speaker's output, amplifies it, sends it back to the speaker, picks it up again. The signal grows until the system hits a physical limit. Positive feedback amplifies change rather than resisting it.",
        "Most systems involve both types simultaneously. The question is not which type is present but how they are balanced — and what happens when that balance shifts.",
      ],
    },
    {
      id: "m02-s02",
      type: "INTERACT",
      component: "FeedbackLoopViz",
      config: {
        initialValue: 50,
        minValue: 0,
        maxValue: 100,
        showControls: ["feedbackType", "feedbackStrength", "reset"],
        // feedbackType: "positive" | "negative"
        // feedbackStrength: 0.0 to 1.0 slider
      },
      prompt: "Start with negative feedback and a moderate strength. Watch the system find equilibrium. Then switch to positive feedback. Adjust the strength and watch what changes.",
    },
    {
      id: "m02-s03",
      type: "READ",
      content: [
        "The pattern on a zebrafish forms through competing feedback loops. An activator chemical promotes its own production — positive feedback. An inhibitor chemical spreads faster than the activator and suppresses it — negative feedback. The two processes together generate stripe patterns without any blueprint.",
        "Alan Turing described this mechanism in 1952. He predicted that chemistry alone, through competing feedback loops, could generate the patterns seen on animal skins without any blueprint. Subsequent experiments in angelfish and later in zebrafish found strong evidence that exactly this kind of dynamic is at work.",
        "The same basic structure — local activation, long-range inhibition — appears in how neurons fire, how populations grow and crash, and how some markets behave. The mechanism is general. The substrate varies.",
      ],
    },
    {
      id: "m02-s04",
      type: "REFLECT",
      question:
        "Where in your own experience have you watched a system tip from one kind of feedback to the other — from stable to runaway, or from amplifying to self-correcting?",
    },
  ],
};
