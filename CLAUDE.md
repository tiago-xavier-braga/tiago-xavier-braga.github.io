# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Astro static site. `npm run dev` to run, `npm run build` to type-check and build. Pushing to `main` deploys to GitHub Pages through Actions.

## Notes

- Content is in `src/content/projects/*.md` and `src/data/*.yaml`, validated by `src/content.config.ts`. Every collection has an `order` field; sort by it, because loaders don't keep file order.
- Colors, spacing, radius, shadows and type sizes are CSS variables in `src/styles/tokens.css`, mirrored from the Penpot tokens. Shared classes (`.display`, `.h1`, `.btn`, `.tag`, `.arrow-link`…) are in `src/styles/global.css`. Component styles are scoped in each `.astro` file.
- One highlighted word per title: `Highlight.astro` or `<em class="hl">`.
- Elements with `.reveal` fade in on scroll (`src/scripts/reveal.ts`). The low-poly background redraws itself when the page size changes.
- No comments in code unless the reason is not obvious from the code.
- Plan and design rules: `docs/astro-migration-plan.md`.
