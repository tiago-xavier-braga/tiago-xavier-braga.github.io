# tiago-xavier-braga.github.io

Personal portfolio: games, XR training simulators, open source tools and contact.

Live at https://tiago-xavier-braga.github.io/

Built with [Astro](https://astro.build/). The design lives in Penpot (site file, pages **Home** and **Styleguide**).

## Content

| What | Where |
|---|---|
| Projects (one page each) | `src/content/projects/*.md` |
| Name, headline, stats, about | `src/data/profile.yaml` |
| Experience | `src/data/experience.yaml` |
| Contact and link-in-bio entries | `src/data/links.yaml` |
| Repositories | `src/data/repos.yaml` |

Schemas are in `src/content.config.ts`. An invalid file fails the build. Links must be `https://` or `mailto:`.

To show the "Download CV" buttons, set `cv` in `profile.yaml`.

## Pages

`/`, `/projects/`, `/projects/<slug>/`, `/repos/`, `/links/` and a 404 page. `/projects.html` redirects to `/projects/`.

## Running locally

```sh
npm install
npm run dev
```

`npm run build` type-checks and builds to `dist/`.

## Deploy

Every push to `main` builds and deploys with GitHub Actions (`.github/workflows/deploy.yml`). The repository's Pages source must be set to **GitHub Actions**.
