import { DRIVERS_2026, TEAMS_2026 } from "./f1-data.js";
import { initSite, buildDriverUrl, buildTeamUrl } from "./site.js";

function renderDrivers() {
  const body = document.getElementById("driversStandingBody");
  if (!body) return;

  body.innerHTML = DRIVERS_2026.map(
    (driver, index) => `
      <tr>
        <td>${index + 1}</td>
        <td><a class="inline-link" href="${buildDriverUrl(driver.name)}">${driver.name}</a></td>
        <td><a class="inline-link" href="${buildTeamUrl(driver.team)}">${driver.team}</a></td>
        <td>0</td>
      </tr>
    `
  ).join("");
}

function renderConstructors() {
  const body = document.getElementById("constructorsStandingBody");
  if (!body) return;

  body.innerHTML = TEAMS_2026.map(
    (team, index) => {
      const driverLinks = team.drivers
        .map((name) => `<a class="inline-link" href="${buildDriverUrl(name)}">${name}</a>`)
        .join(" / ");
      return `
      <tr>
        <td>${index + 1}</td>
        <td><a class="inline-link" href="${buildTeamUrl(team.name)}">${team.name}</a></td>
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
