import { TEAMS_2026 } from "./f1-data.js";
import { initSite, buildDriverUrl, buildTeamUrl } from "./site.js";

function renderTeams() {
  const wrap = document.getElementById("teamsGrid");
  if (!wrap) return;

  wrap.innerHTML = TEAMS_2026.map(
    (team, index) => {
      const driverLinks = team.drivers
        .map((name) => `<a class="inline-link" href="${buildDriverUrl(name)}">${name}</a>`)
        .join(" and ");

      return `
      <article class="card team-card">
        <p class="badge">Team ${String(index + 1).padStart(2, "0")}</p>
        <h3><a class="inline-link" href="${buildTeamUrl(team.name)}">${team.name}</a></h3>
        <p><strong>Base:</strong> ${team.base}</p>
        <p><strong>Power Unit:</strong> ${team.powerUnit}</p>
        <p><strong>Drivers:</strong> ${driverLinks}</p>
        <a class="tiny-link" href="${buildTeamUrl(team.name)}">Open team page</a>
      </article>
    `;
    }
  ).join("");
}

initSite();
renderTeams();
