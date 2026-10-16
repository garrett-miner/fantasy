# Standard Issue

Fantasy football rankings and resources for standard (non-PPR) scoring leagues. Plain static site — no build step — hosted on GitHub Pages.

## Updating rankings

All rankings live in `data/rankings.json`. Each week:

1. Change `updated` to today's date (`YYYY-MM-DD`).
2. Replace the player lists. Position lists are `["Name", "TEAM", bye]`; the `overall` list is `["Name", "POS", "TEAM", bye]`. Order = rank.
3. Commit and push. The site picks it up in about a minute.

## Run locally

```
python3 -m http.server
```

Then open http://localhost:8000 (opening `index.html` directly won't load the JSON).

## Publish on GitHub Pages

Repo → Settings → Pages → Source: "Deploy from a branch" → `main` / root → Save.
