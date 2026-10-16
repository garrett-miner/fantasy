(function () {
  const state = { pos: "ALL", q: "", team: "" };
  let data = null;

  const $ = (s) => document.querySelector(s);
  const rowsEl = $("#rows");
  const emptyEl = $("#empty");

  function fmtDate(iso) {
    const d = new Date(iso + "T12:00:00");
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  // Normalize to {rank, name, pos, team, bye}
  function listFor(pos) {
    if (pos === "ALL") {
      return data.overall.map(([name, p, team, bye], i) => ({ rank: i + 1, name, pos: p, team, bye }));
    }
    return (data.positions[pos] || []).map(([name, team, bye], i) => ({ rank: i + 1, name, pos, team, bye }));
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function render() {
    const q = state.q.trim().toLowerCase();
    const list = listFor(state.pos).filter((p) =>
      (!q || p.name.toLowerCase().includes(q)) && (!state.team || p.team === state.team)
    );
    rowsEl.innerHTML = list.map((p) => `
      <tr>
        <td class="num rank">${p.rank}</td>
        <td class="player">${esc(p.name)}</td>
        <td class="poscell"><span class="pos ${p.pos}">${p.pos}</span></td>
        <td class="team">${esc(p.team)}</td>
        <td class="num">${p.bye}</td>
      </tr>`).join("");
    emptyEl.hidden = list.length > 0;
  }

  function buildTeams() {
    const teams = new Set();
    data.overall.forEach((r) => teams.add(r[2]));
    Object.values(data.positions).forEach((l) => l.forEach((r) => teams.add(r[1])));
    const sel = $("#team");
    [...teams].sort().forEach((t) => {
      const o = document.createElement("option");
      o.value = o.textContent = t;
      sel.appendChild(o);
    });
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

  fetch("data/rankings.json", { cache: "no-cache" })
    .then((r) => r.json())
    .then((json) => {
      data = json;
      $("#season").textContent = data.season;
      $("#meta").textContent = `${data.scoring} · Updated ${fmtDate(data.updated)}`;
      const src = $("#source-link");
      src.textContent = data.source.name;
      src.href = data.source.url;
      buildTeams();
      render();
    })
    .catch(() => { $("#meta").textContent = "Couldn't load rankings."; });
})();
