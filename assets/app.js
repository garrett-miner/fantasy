// Weekly flex rankings (landing page). Data: data/week.json
(function () {
  const state = { pos: "FLEX", q: "", team: "" };
  let data = null;
  let rows = [];

  const $ = (s) => document.querySelector(s);

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function fmtDate(iso) {
    return new Date(iso + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  // Build team -> {opp, day} from the games list ([away, home, day])
  function matchups(games) {
    const m = {};
    games.forEach(([away, home, day]) => {
      m[away] = { opp: "@ " + home, day };
      m[home] = { opp: "vs " + away, day };
    });
    return m;
  }

  function render() {
    const q = state.q.trim().toLowerCase();
    const list = rows.filter((p) =>
      (state.pos === "FLEX" || p.pos === state.pos) &&
      (!q || p.name.toLowerCase().includes(q)) &&
      (!state.team || p.team === state.team));

    $("#rows").innerHTML = list.map((p) => `
      <tr>
        <td class="num rank">${state.pos === "FLEX" ? p.rank : p.posRank}</td>
        <td class="player">${esc(p.name)}${state.pos === "FLEX" ? "" : ` <span class="sub">#${p.rank} flex</span>`}</td>
        <td class="poscell"><span class="pos ${p.pos}">${p.pos}${p.posRank}</span></td>
        <td class="team">${esc(p.team)}</td>
        <td class="team">${esc(p.opp)}</td>
        <td class="num game-col"><span class="day ${p.day === "Thu" ? "early" : ""}">${esc(p.day)}</span></td>
      </tr>`).join("");
    $("#empty").hidden = list.length > 0;
  }

  document.querySelectorAll(".tabs button").forEach((b) => {
    b.addEventListener("click", () => {
      document.querySelectorAll(".tabs button").forEach((x) => x.setAttribute("aria-selected", x === b));
      state.pos = b.dataset.pos;
      render();
    });
  });
  $("#search").addEventListener("input", (e) => { state.q = e.target.value; render(); });
  $("#team").addEventListener("change", (e) => { state.team = e.target.value; render(); });

  fetch("data/week.json", { cache: "no-cache" })
    .then((r) => r.json())
    .then((json) => {
      data = json;
      const m = matchups(data.games);
      const counts = {};
      rows = data.flex.map(([name, pos, team], i) => {
        counts[pos] = (counts[pos] || 0) + 1;
        const g = m[team] || { opp: "—", day: "—" };
        return { rank: i + 1, name, pos, posRank: counts[pos], team, opp: g.opp, day: g.day };
      });

      $("#eyebrow").textContent = `Week ${data.week} · ${data.season}`;
      $("#headline").textContent = `Week ${data.week} flex rankings`;
      document.title = `Week ${data.week} Flex Rankings (Non-PPR) — Standard Issue`;
      $("#meta").textContent = `${data.scoring} · Updated ${fmtDate(data.updated)}`;
      $("#byes").textContent = data.byes && data.byes.length ? `On bye: ${data.byes.join(", ")}` : "";
      const src = $("#source-link");
      src.textContent = data.source.name;
      src.href = data.source.url;

      const sel = $("#team");
      [...new Set(rows.map((r) => r.team))].sort().forEach((t) => {
        const o = document.createElement("option");
        o.value = o.textContent = t;
        sel.appendChild(o);
      });
      render();
    })
    .catch(() => { $("#meta").textContent = "Couldn't load this week's rankings."; });
})();
