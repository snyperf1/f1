import { DRIVERS_2026, TEAMS_2026, TEAM_MEDIA_2026 } from "./f1-data.js";
import { initSite, buildDriverUrl, buildTeamUrl } from "./site.js";

function renderDrivers() {
  const body = document.getElementById("driversStandingBody");
  if (!body) return;

  const sortedDrivers = [...DRIVERS_2026].sort((a, b) => a.name.localeCompare(b.name));

  body.innerHTML = sortedDrivers.map((driver, index) => {
    const teamColor = TEAM_MEDIA_2026[driver.team]?.color || "#6ac6ff";
    return `
      <tr class="team-accent-row" style="--team-color:${teamColor}">
        <td>${index + 1}</td>
        <td><a class="inline-link driver-inline-link" style="--team-color:${teamColor}" href="${buildDriverUrl(driver.name)}">${driver.name}</a></td>
        <td><a class="inline-link team-inline-link" style="--team-color:${teamColor}" href="${buildTeamUrl(driver.team)}">${driver.team}</a></td>
        <td>0</td>
      </tr>
    `;
  }).join("");
}

function renderConstructors() {
  const body = document.getElementById("constructorsStandingBody");
  if (!body) return;

  body.innerHTML = TEAMS_2026.map(
    (team, index) => {
      const teamColor = TEAM_MEDIA_2026[team.name]?.color || "#6ac6ff";
      const driverLinks = team.drivers
        .map((name) => `<a class="inline-link driver-inline-link" style="--team-color:${teamColor}" href="${buildDriverUrl(name)}">${name}</a>`)
        .join(" / ");
      return `
      <tr class="team-accent-row" style="--team-color:${teamColor}">
        <td>${index + 1}</td>
        <td><a class="team-pill" style="--team-color:${teamColor}" href="${buildTeamUrl(team.name)}">${team.name}</a></td>
        <td>${driverLinks}</td>
        <td>0</td>
      </tr>
    `;
    }
  ).join("");
}

initSite();
renderDrivers();
renderConstructors();
