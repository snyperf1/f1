import { TEAMS_2026, TEAM_MEDIA_2026 } from "./f1-data.js";
import { initSite, buildDriverUrl, buildTeamUrl } from "./site.js";

function renderTeams() {
  const wrap = document.getElementById("teamsGrid");
  if (!wrap) return;

  wrap.innerHTML = TEAMS_2026.map(
    (team, index) => {
      const teamMedia = TEAM_MEDIA_2026[team.name] || null;
      const teamColor = teamMedia?.color || "#6ac6ff";
      const driverLinks = team.drivers
        .map((name) => `<a class="inline-link driver-inline-link" style="--team-color:${teamColor}" href="${buildDriverUrl(name)}">${name}</a>`)
        .join(" and ");

      return `
      <article class="card team-card media-card team-accent-card" style="--team-color:${teamColor}">
        ${
          teamMedia?.car
            ? `<img class="card-media car-media" src="${teamMedia.car}" alt="${team.name} 2026 car render" loading="lazy" decoding="async" />`
            : ""
        }
        ${
          teamMedia?.logo
            ? `<img class="team-logo-mark" src="${teamMedia.logo}" alt="${team.name} logo" loading="lazy" decoding="async" />`
            : ""
        }
        <p class="badge">Team ${String(index + 1).padStart(2, "0")}</p>
        <h3><a class="inline-link team-inline-link" style="--team-color:${teamColor}" href="${buildTeamUrl(team.name)}">${team.name}</a></h3>
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
