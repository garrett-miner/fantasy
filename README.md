# Standard Issue

Fantasy football resources for standard (non-PPR) scoring leagues. Plain static site — no build step — hosted on GitHub Pages.

- **`index.html`** — landing page: this week's flex (RB/WR/TE) rankings. Data in `data/week.json`.
- **`rankings.html`** — positional rankings, scoring reference and strategy notes. Data in `data/season.json`.

## Weekly update (`data/week.json`)

1. Set `week` and `updated` (`YYYY-MM-DD`).
2. Replace `games` with the week's schedule: `["AWAY", "HOME", "Sun"]` (day can be Thu / Sun / SNF / MNF etc.).
3. Set `byes` to the teams on bye.
4. Replace `flex` with the ranked list, best first: `["Name", "POS", "TEAM"]`. Opponents, game day and positional ranks are filled in automatically.
5. Commit and push. Live in about a minute.

## Run locally

```
python3 -m http.server
```

Then open http://localhost:8000 (opening the HTML file directly won't load the JSON).
