# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Durable design decisions

- This prototype recreates the third works-list direction selected on 2026-07-30: a left-side searchable directory with a right-side selected-work detail preview.
- It is a layout experiment only. Mock work names and metadata are sample content, not an approved production inventory.
- Use the already approved Sunlit Pastoral light palette and Redstone Dusk dark palette without inventing a third color system.
- Preserve the shared navigation grouping `[LunaDeerMC / 支持 / 关于]` and `[作品 / 文档 / 功能菜单]`.
- The user explicitly rejected Minecraft-style voxel/block icons inside the directory. Use the established Lucide interface icon library with consistent size and stroke weight. Minecraft imagery belongs in the large work media.
- Keep surfaces open and editorial: thin separators, deliberate alignment, restrained 8–12px radii, and no wall of cards.
- Desktop uses master-detail browsing. Mobile becomes a filterable list followed by the selected detail; it must not squeeze the desktop table into the viewport.
