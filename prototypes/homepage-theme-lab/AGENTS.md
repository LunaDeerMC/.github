# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Durable design decisions

- This prototype exists to compare two complete homepage themes before any production implementation begins.
- Light mode is a bright Minecraft pastoral/farm scene. Dark mode is a dusk Minecraft redstone workshop scene. They are separate art directions, not color-filtered variants.
- Theme switching must preserve page structure and scroll position so color, contrast, rhythm, and section transitions can be compared directly.
- The hero scene must resolve into a flat foreground color at its lower edge. The featured-work stage immediately below must use that same semantic foreground color.
- Keep the layout editorial and open: strong typography, generous spacing, restrained radii, and no wall of floating cards.
- The future hero will use four independently moving scene layers. This color prototype intentionally uses a single flattened scene per theme and must not be treated as approval of the final parallax motion.
- Navigation grouping is `[LunaDeerMC / 支持 / 关于]` and `[作品 / 文档 / 功能菜单]`.
- Use Mona Sans with a Chinese system-font fallback. Use Lucide for interface icons rather than drawing new SVG icons.
- On 2026-07-30, the user approved both complete theme palettes as shown in this homepage prototype. Treat the current light and dark semantic values as the design baseline; scene art quality and four-layer parallax remain unapproved and separate.
