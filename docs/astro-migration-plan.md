# Astro Migration Plan

Goal: keep the site static, move content to typed files, then redesign.

Work on branch `astro-migration`. Merge each phase into `main` only when it is done, because `main` deploys.

## Phase 1: Parity migration (same look)

Target structure:

```
src/
  pages/           index.astro, projects.astro, repos.astro, links.astro, 404.astro
  layouts/         Base.astro (head, fonts, background layers, nav, footer)
  components/      Nav, Footer, ProjectCard, ExperienceItem, ContactCard, Icon
  scripts/         background.ts, reveal.ts (client-side only)
  styles/          tokens.css, components.css (from style/)
  content/projects/*.md
  data/            profile.yaml, experience.yaml, links.yaml
  content.config.ts
public/            favicon, static files
.github/workflows/deploy.yml
```

Tasks:
1. Scaffold Astro (latest, TypeScript strict) and add `package-lock.json`. Set `site: 'https://tiago-xavier-braga.github.io'`.
2. Split `data/profile.json`:
   - Each project becomes `src/content/projects/<slug>.md`, with its fields in the frontmatter.
   - Profile, stats, itch.io and experience become YAML files in `src/data/`.
   - Contacts become `src/data/links.yaml`. Each entry has `label`, `url`, `icon` and `contact` (bool). Entries with `contact: true` are shown in the home Contact section.
3. Define the schemas in `content.config.ts`:
   - `platform` is an enum: `itchio | steam | playstore | github`.
   - URL fields are restricted to `https://` or `mailto:`. A plain URL check also accepts `javascript:`.
   - Add an `order` field, so project order doesn't depend on file names.
4. Port the markup to components. Delete:
   - `escapeHTML`, because Astro escapes values by default;
   - the `FALLBACK` data, because there is no runtime fetch anymore;
   - the second nav copy in `projects.html`.
5. Port `background.js` and `reveal.js` as client scripts in `Base.astro`. Behavior stays the same.
6. Keep the old URL working: add `public/projects.html` with a meta refresh to `/projects/`. Add `src/pages/404.astro`, built to `404.html`, which GitHub Pages serves for unknown paths. It uses `Base.astro` and links back to `/` and `/projects/`.
7. Add the deploy workflow using `withastro/action` + `actions/deploy-pages`:
   - permissions are only `contents: read`, `pages: write` and `id-token: write`;
   - it runs only on push to `main`;
   - actions are pinned to commit SHAs.
   - turn on Dependabot for npm and Actions.
8. In the repo settings, change the Pages source to **GitHub Actions**.
9. Remove the old `index.html`, `projects.html`, `js/`, `style/` and `data/`. Update `README.md` and `CLAUDE.md`.

Done when the pages look the same as the old site, there are no console errors, `/projects.html` redirects, unknown paths show the 404 page, and `npm run build` fails on an invalid project file.

## Phase 2: Content model

1. Add project fields: `cover` (image), `trailer` (YouTube ID), `screenshots[]`, `embed` (itch.io iframe URL), `released` (date), `draft` (bool).
2. Add one page per project at `src/pages/projects/[slug].astro`. Its body comes from the project's Markdown.
3. Process images with `astro:assets` to generate WebP/AVIF in responsive sizes.
4. Exclude `draft: true` projects from the build. Note: drafts are still public in the repo.
5. Add a link-in-bio page at `src/pages/links.astro` (`/links/`):
   - it is meant to be shared in social media bios;
   - mobile-first, with no site nav: avatar, name and role, then one full-width button per entry in `links.yaml`;
   - add `highlight` (bool) to `links.yaml` to make an entry stand out (e.g. the latest release);
   - at the top, show the newest project that has `featured: true`, linking to its project page;
   - `Base.astro` gets a `minimal` prop that hides the nav and footer but keeps the background layers.

## Phase 3: GitHub repositories

Repo data is fetched from the GitHub GraphQL API at build time. The browser makes no API calls.

1. Add a custom content loader `src/loaders/github.ts`. It runs one GraphQL query for user `tiago-xavier-braga`:
   - `pinnedItems(first: 6, types: REPOSITORY)` gives the featured repos, in the order you pinned them;
   - `repositories(ownerAffiliations: OWNER, privacy: PUBLIC, isFork: false, isArchived: false)` gives the full list.
2. Define a `repos` collection with these fields: `name`, `description`, `url`, `homepageUrl`, `primaryLanguage`, `stargazerCount`, `topics`, `updatedAt` and `pinned` (bool). `homepageUrl` must be `https://` or empty.
3. Read the token from `GITHUB_TOKEN`, because GraphQL always requires authentication:
   - locally: `GITHUB_TOKEN=$(gh auth token) npm run dev`;
   - in CI: pass `${{ secrets.GITHUB_TOKEN }}` to the build step. If it can't read user data, use a fine-grained PAT with public read-only access, stored as a repo secret.
   - With no token, the build fails with a clear error. A failed build never replaces the live site.
4. Add an optional `src/data/repos.yaml` with an `exclude` list, to hide repos from `/repos/`.
5. Home page: add an "Open Source" section with the pinned repos, next to the featured games.
6. Add `src/pages/repos.astro` (`/repos/`) listing all repos, sorted by `updatedAt`. Add it to the nav.
7. Add `schedule: cron` (daily) and `workflow_dispatch` triggers to the deploy workflow, so stars, descriptions and pins stay current.

Done when changing your pins on GitHub and running the workflow updates the home section.

## Phase 4: Visual redesign

The brand comes from Penpot:
- **Xavi Games Press Kit**: the toucan logo and the dark `brand` token set (used for social carousels).
- **Site file**: the `light` token set, plus the page **Styleguide** with colors, type, spacing, radius, elevation, buttons, inputs, chips, tabs, cards and alerts.

The site's main theme is **light, with pastel off-whites**. Dark is the alternative theme (`color.dark.*` tokens).

| Token | Value | Use |
|---|---|---|
| `bg` | `#F1F1F1` | Page background |
| `surface` | `#F8F8F8` | Sections, secondary panels |
| `surface-raised` | `#FFFFFF` | Cards, inputs |
| `border` | `#AFB7B9` | Borders, dividers, cover placeholders |
| `text` | `#03191E` | Main text (16:1 on `bg`) |
| `text-muted` | `#4D5B5F` | Secondary text (6.2:1) |
| `text-subtle` | `#5E6C70` | Placeholder/disabled only (4.8:1) |
| `primary` / `on-primary` | `#03191E` / `#F1F1F1` | Primary button |
| `accent` | `#F3A712` | Highlights, accent button, focus ring, active tab. Fill only, never as text |
| `accent-2` | `#FF1B1C` | Fills, icons, dots and large title highlights. 3.4:1 on `bg`, so never use it for small text |
| `link` | `#D01314` | Text links and overlines (4.9:1). Highlighted words in titles use `accent-2` |
| `success` / `info` / `warning` / `error` | `#2F7A3A` / `#2B5C9E` / `#8A5A00` / `#B3361B` | Status text and icons |
| `*-bg` | `#E3F1E1` / `#E3ECF7` / `#FDF1D2` / `#FBE3DC` | Alert backgrounds |

Scales:
- Spacing: 4, 8, 16, 24, 32, 48, 64, 96.
- Radius: 0, 4, 8, 12, 24, full. Buttons, inputs and alerts use 12 (`radius.lg`). Cards use 24. Only chips and tags use full.
- Elevation: 0 = flat with a border; 1 = low (cards at rest); 2 = medium (hover); 3 = high (popovers, focused card). Shadows are tinted with `#03191E`.
- Type (Outfit):

  | Style | Size / weight |
  |---|---|
  | Display | 72/800 |
  | H1 | 48/800 |
  | H2 | 28/700 |
  | Subtitle | 22/500 |
  | Body | 18/400, line-height 1.6 |
  | Body small | 16/400 |
  | Caption | 14/400 |
  | Overline | 13/600, letter-spacing 2, uppercase |
  | Button | 16/600 |

Rules:
- Sentence case everywhere: capitalize the first letter of every sentence, title, button and label. Overlines are the exception, always uppercase. One highlighted word per title, in `link`.
- Positioning is generalist: "Software developer · Games, XR & tools". Content comes from the resume (`Notes/Book/Portfolio/Resume/Currículo.md`). The featured projects are XR Training Simulators (Haus), Dominoes Colors and Boompact. Never more than one accent color per element.
- Buttons, by role:
  - Primary is charcoal.
  - Accent (yellow) is for the single most important CTA on the page.
  - Secondary is an outline.
- Focus state: a 2px charcoal border plus a 4px yellow ring.
- 404 page: a single centered card on `bg` with an illustration (toucan), a short headline and a primary "Go home" button.

Home page order (work first, then proof, then the person, then contact):

1. **Hero**: name, role, one-line pitch, toucan/avatar, CTAs "View work" and "Contact". Below it, a stats strip (years of experience · projects shipped · XR simulators delivered · store launches), moved from About.
2. **Selected work**: 3 media-first project cards (client work + games). A "See all projects" link in the section header replaces the standalone itch.io banner.
3. **Open Source**: the pinned GitHub repos (Phase 3).
4. **Experience**.
5. **About**: text only; the stats moved to the hero.
6. **Contact**: the entries in `links.yaml` with `contact: true`.
7. Footer.

The order depends on the main audience, which is not decided yet:
- Recruiters/studios: move Experience to position 3, before Open Source.
- Players/followers: keep the order above. Open Source may move to `/repos/` only.

Tasks:
1. Rewrite `src/styles/tokens.css` with the tokens above (`--color-*`, `--space-*`, `--radius-*`, `--shadow-*`, type scale), with the dark theme under `[data-theme=dark]`. Remove the paper/rust/moss/gold tokens.
2. Recolor the low-poly background. Use pastel off-white tones, plus a few rare yellow and orange triangles.
3. Use the toucan mark (exported as SVG from Penpot) as the favicon, the nav logo and the avatar on `/links/`.
4. Use media-first cards: show the cover, or a short `.webm` loop on hover.
5. Add View Transitions between a card and its project page.
6. Add OG/Twitter meta per page and generate `sitemap.xml` with `@astrojs/sitemap`. Make OG images 1200×630 in the carousel style.
7. Check contrast on every text/background pair: 4.5:1 for body text, 3:1 for titles.
