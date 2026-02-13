import { TEAMS_2026 } from "./f1-data.js";
import { initSite } from "./site.js";

function renderTeams() {
  const wrap = document.getElementById("teamsGrid");
  if (!wrap) return;

  wrap.innerHTML = TEAMS_2026.map(
    (team, index) => `
      <article class="card team-card">
        <p class="badge">Team ${String(index + 1).padStart(2, "0")}</p>
        <h3>${team.name}</h3>
        <p><strong>Base:</strong> ${team.base}</p>
        <p><strong>Power Unit:</strong> ${team.powerUnit}</p>
        <p><strong>Drivers:</strong> ${team.drivers.join(" and ")}</p>
      </article>
    `
  ).join("");
}

initSite();
renderTeams();
