import { DRIVERS_2026, TEAMS_2026 } from "./f1-data.js";
import { initSite } from "./site.js";

function renderDrivers() {
  const body = document.getElementById("driversStandingBody");
  if (!body) return;

  body.innerHTML = DRIVERS_2026.map(
    (driver, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${driver.name}</td>
        <td>${driver.team}</td>
        <td>0</td>
      </tr>
    `
  ).join("");
}

function renderConstructors() {
  const body = document.getElementById("constructorsStandingBody");
  if (!body) return;

  body.innerHTML = TEAMS_2026.map(
    (team, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${team.name}</td>
        <td>${team.drivers.join(" / ")}</td>
        <td>0</td>
      </tr>
    `
  ).join("");
}

initSite();
renderDrivers();
renderConstructors();
