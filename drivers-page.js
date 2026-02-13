import { DRIVERS_2026 } from "./f1-data.js";
import { initSite } from "./site.js";

function renderDrivers() {
  const wrap = document.getElementById("driversGrid");
  if (!wrap) return;

  wrap.innerHTML = DRIVERS_2026.map(
    (driver, index) => `
      <article class="card driver-card">
        <p class="badge">Driver ${String(index + 1).padStart(2, "0")}</p>
        <h3>${driver.name}</h3>
        <p class="race-date">${driver.nationality}</p>
        <p>${driver.team}</p>
      </article>
    `
  ).join("");
}

initSite();
renderDrivers();
