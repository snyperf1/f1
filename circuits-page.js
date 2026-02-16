import { RACES_2026, CIRCUIT_PROFILES_2026 } from "./f1-data.js";
import { initSite, formatDateRange, buildCircuitUrl } from "./site.js";

function renderCircuits() {
  const wrap = document.getElementById("circuitsGrid");
  if (!wrap) return;

  wrap.innerHTML = RACES_2026.map(
    (race) => {
      const profile = CIRCUIT_PROFILES_2026[race.round];
      return `
      <a class="card circuit-card card-link" href="${buildCircuitUrl(race.round)}" aria-label="Open ${race.circuit} detail page">
        <img
          class="card-media circuit-media"
          src="${profile?.heroImage || ""}"
          alt="${race.grandPrix} track image"
          loading="lazy"
          decoding="async"
        />
        <p class="badge">Round ${String(race.round).padStart(2, "0")}</p>
        <h3>${race.circuit}</h3>
        <p class="race-date">${race.grandPrix}</p>
        <p>${race.city}, ${race.country}</p>
        <p class="card-blurb">${profile?.type || "Grand Prix circuit"} | ${profile?.signature || ""}</p>
        <p>${formatDateRange(race.start, race.end)}</p>
        <p><strong>Local start:</strong> ${race.raceStartLocal}</p>
        ${race.sprint ? '<p class="race-tag">Sprint weekend</p>' : ""}
      </a>
    `;
    }
  ).join("");
}

initSite();
renderCircuits();
