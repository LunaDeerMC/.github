# Design QA

Status: **Passed for color-comparison handoff**

Validated on 2026-07-30.

## Coverage

- Desktop viewport: 1440 × 900
- Mobile viewport: 390 × 844
- Light theme: 白天牧场
- Dark theme: 黄昏工坊
- Theme switching at the hero and after scrolling
- Hero-to-featured-stage color continuity
- Navigation, anchor links, function menu, Escape-to-close, and palette panel
- Horizontal overflow and browser console warnings/errors
- Reduced-motion fallback and visible keyboard focus styles

## Findings resolved

- Reduced the mobile hero wordmark so `LunaDeerMC` no longer clips at 390 px.
- Added accessible names to icon-only mobile theme controls.
- Made the function-menu label reflect its open or closed state.
- Hidden the inactive hero scene from assistive technology.
- Removed a trailing CSS fragment that produced a build warning.

## Intentional prototype limitations

- Hero art is flattened into one image per theme; final four-layer parallax motion is not represented.
- Copy and secondary work rows are layout placeholders pending final content inventory.
- Palette values were approved after this QA pass and now form the design baseline; final scene assets and parallax motion remain separate approval items.
