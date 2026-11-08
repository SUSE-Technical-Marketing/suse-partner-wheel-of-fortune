# SUSE Partner Wheel of Fortune

Spin the wheel, land on a partner, answer their questions. Builds to a single
self-contained `dist/index.html` (JS, CSS, font, logos and questions inlined).

## Develop

Tools are managed with [mise](https://mise.jdx.dev) (see `mise.toml`):

```sh
mise install        # installs Bun
mise run install    # bun install
mise run dev        # dev server
mise run build      # -> dist/index.html
```

## Content

- `assets/partners_questions.yaml` – partners, logos and questions (schema documented at the top of the file).
  A partner with `questions: []` only gets a "Reset" button.
- `assets/logos/` – partner logos. Add a file, then reference it from the YAML.
- `assets/partner_questions.yaml` / `assets/raw_questions.csv` – original source files, unused by the build.

## Deploy

Push to `main`; `.github/workflows/deploy.yml` builds and publishes `dist/` to GitHub Pages
(enable *Settings → Pages → Source: GitHub Actions*). Or just host `dist/index.html` anywhere.
