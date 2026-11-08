# unit-js — methodica-math-percent-07

The shared layer, ONE copy for every component: motion.js, report-modal.js, quiz-engine.js, questions.js, unit.js, engine.js.

Each component's `script.js` is configuration only (`PART_CONFIG` + xAPI slugs);
every behaviour lives here. No top-level identifier may exist in both a
`script.js` and this layer — the collision is silent and last-wins.
