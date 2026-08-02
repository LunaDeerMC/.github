# Design QA

## Evidence

- Source of truth: `public/assets/reference/selected-works-layout.png`
- Final desktop implementation: `qa/implementation-light-final.png`
- Final dark-theme implementation: `qa/implementation-dark.png`
- Final mobile list and detail: `qa/implementation-mobile-dark.png`, `qa/implementation-mobile-detail.png`
- Full-view comparison: `qa/comparison-final.png`
- Focused directory comparison: `qa/comparison-focused-directory-final.png`
- Focused detail comparison: `qa/comparison-focused-detail-final.png`

## Viewports and states

- Source concept: 1487 × 1058 px.
- Desktop implementation: 1800 × 1000 CSS px; captured content area 1785 × 992 px at DPR 1.
- Mobile implementation: 390 × 844 CSS px at DPR 1.
- Desktop primary state: light theme, “全部”, Dominion selected, empty search.
- Additional states checked: dark theme, search results, filtered results, alternate selection, empty state, utility menu, keyboard Escape, and mobile detail navigation.
- The reference and runtime viewport have different aspect ratios, so comparisons use proportional fitting without distortion. No pixel-exact equivalence is claimed.

## Fidelity review

### Typography

- Mona Sans Variable is used for Latin text with the system Chinese sans-serif stack as fallback.
- Directory labels, metadata, title, summary, and call-to-action preserve the reference hierarchy.

### Layout and spacing

- Desktop retains the reference’s narrow directory / broad detail split.
- The directory shows all twelve sample rows without an internal scrollbar at the tested desktop viewport.
- Detail content follows the reference sequence: cover, title, summary, facts, action.
- Mobile changes to a single-column list followed by detail instead of compressing the desktop split.

### Color

- Light theme uses the approved “白天牧场” surfaces, moss green accents, and warm paper neutrals.
- Dark theme uses the approved “黄昏红石工坊” navy surfaces, ember accents, and warm secondary text.
- Selected, hover, focus, divider, and button states remain legible in both themes.

### Imagery

- Existing approved pastoral and foundry scene assets are reused for the large detail media.
- The cover subjects are placeholders because production work covers were not supplied.

### Icons

- Intentional approved deviation from the visual concept: voxel/block icons were replaced by Lucide line icons at a consistent stroke weight.
- Minecraft styling is reserved for large artwork rather than navigation or utility symbols.

### Content

- The twelve works and their metadata are explicitly sample content for layout testing.
- Copy lengths were varied to test truncation, density, and the detail rhythm.

### Interaction and responsiveness

- Search, clear search, category filters, work selection, theme switching, utility-menu toggle, Escape close, and mobile selection-to-detail behavior were exercised.
- Visible focus treatment and reduced-motion handling are present.
- Browser console check: 0 errors and 0 warnings in tested desktop and mobile states.

## Iteration history

### Pass 1

- P2: the directory occupied too much width.
- P2: the detail title was oversized relative to the reference.
- P2: the reused scene exposed a homepage fade at the bottom edge.
- Fix: narrowed the directory, reduced title scale, and adjusted the cover crop.

### Pass 2

- P2: the detail title and summary were arranged side by side instead of following the source’s vertical hierarchy.
- P2: one directory row fell below the tested desktop fold.
- Fix: stacked title and summary, tightened row height, and added the sixth metadata value to restore the reference rhythm.

### Pass 3

- No actionable P0, P1, or P2 fidelity issues remained.
- Remaining differences are intentional: icon-library substitution requested by the user, placeholder work data, and approved existing scene imagery.

## Follow-ups

- P3: replace the sample works and reused scene covers once final content is available.
- P3: calibrate the final production breakpoint and list density against real copy lengths.

final result: passed
