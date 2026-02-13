import { DRIVERS_2026 } from "./f1-data.js";
import { initSite, buildDriverUrl, buildTeamUrl } from "./site.js";

function renderDrivers() {
  const wrap = document.getElementById("driversGrid");
  if (!wrap) return;

  wrap.innerHTML = DRIVERS_2026.map(
    (driver, index) => `
      <article class="card driver-card">
        <p class="badge">Driver ${String(index + 1).padStart(2, "0")}</p>
        <h3><a class="inline-link" href="${buildDriverUrl(driver.name)}">${driver.name}</a></h3>
        <p class="race-date">${driver.nationality}</p>
        <p><a class="inline-link" href="${buildTeamUrl(driver.team)}">${driver.team}</a></p>
        <a class="tiny-link" href="${buildDriverUrl(driver.name)}">Open driver page</a>
      </article>
    `
  ).join("");
}

initSite();
renderDrivers();
