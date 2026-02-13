import { RACES_2026 } from "./f1-data.js";
import { initSite, formatDateRange } from "./site.js";

function renderCircuits() {
  const wrap = document.getElementById("circuitsGrid");
  if (!wrap) return;

  wrap.innerHTML = RACES_2026.map(
    (race) => `
      <article class="card circuit-card">
        <p class="badge">Round ${String(race.round).padStart(2, "0")}</p>
        <h3>${race.circuit}</h3>
        <p class="race-date">${race.grandPrix}</p>
        <p>${race.city}, ${race.country}</p>
        <p>${formatDateRange(race.start, race.end)}</p>
        <p><strong>Local start:</strong> ${race.raceStartLocal}</p>
        ${race.sprint ? '<p class="race-tag">Sprint weekend</p>' : ""}
      </article>
    `
  ).join("");
}

initSite();
renderCircuits();
