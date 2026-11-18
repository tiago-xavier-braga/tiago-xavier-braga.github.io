# tiago-xavier-braga.github.io

Personal portfolio website: shipped games, experience and contact.

Live at https://tiago-xavier-braga.github.io/

## Structure

- `index.html`: home page
- `projects.html`: projects page
- `data/profile.json`: all site content (profile, experience, projects, links)
- `js/`: page scripts
- `style/`: stylesheets, with design tokens in `tokens.css`

## Running locally

The pages load `data/profile.json` with `fetch`, so open them through a local server instead of the file system:

```sh
python -m http.server
```

Then open http://localhost:8000/.

## Deploy

GitHub Pages publishes the `main` branch from the repository root on every push.
