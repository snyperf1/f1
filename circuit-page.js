import { DRIVERS_2026, TEAMS_2026 } from "./f1-data.js";
import {
  initSite,
  getQueryParam,
  findRaceByRound,
  formatDateRange,
  buildCircuitUrl,
  buildDriverUrl,
  buildTeamUrl,
} from "./site.js";

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function renderNotFound() {
  const root = document.getElementById("circuitDetailRoot");
  if (!root) return;
  root.innerHTML = `
    <section class="module page-hero">
      <p class="eyebrow">Circuit</p>
      <h1>Circuit not found</h1>
      <p class="lead">The selected round does not exist in the 2026 dataset.</p>
      <div class="hero-actions">
        <a class="btn btn-primary" href="circuits.html">Back to circuits</a>
      </div>
    </section>
  `;
}

function renderInfoCards(race) {
  const wrap = document.getElementById("circuitInfoCards");
  if (!wrap) return;

  wrap.innerHTML = `
    <article class="card">
      <h3>Track</h3>
      <p><strong>${race.circuit}</strong></p>
      <p>${race.city}, ${race.country}</p>
    </article>
    <article class="card">
      <h3>Weekend</h3>
      <p class="race-date">${formatDateRange(race.start, race.end)}</p>
      <p>Round ${String(race.round).padStart(2, "0")}</p>
    </article>
    <article class="card">
      <h3>Race Start</h3>
      <p>${race.raceStartLocal} local time</p>
      <p>${race.sprint ? "Sprint weekend format" : "Standard weekend format"}</p>
    </article>
  `;
}

function renderTeamSection() {
  const wrap = document.getElementById("circuitTeams");
  if (!wrap) return;

  wrap.innerHTML = TEAMS_2026.map(
    (team) => {
      const drivers = team.drivers
        .map((name) => `<a class="inline-link" href="${buildDriverUrl(name)}">${name}</a>`)
        .join(" / ");

      return `
      <article class="card team-card">
        <h3><a class="inline-link" href="${buildTeamUrl(team.name)}">${team.name}</a></h3>
        <p><strong>Power Unit:</strong> ${team.powerUnit}</p>
        <p><strong>Drivers:</strong> ${drivers}</p>
      </article>
    `;
    }
  ).join("");
}

function renderDriverSection() {
  const wrap = document.getElementById("circuitDrivers");
  if (!wrap) return;

  wrap.innerHTML = DRIVERS_2026.map(
    (driver) => `
      <article class="card">
        <h3><a class="inline-link" href="${buildDriverUrl(driver.name)}">${driver.name}</a></h3>
        <p>${driver.nationality}</p>
        <p><a class="inline-link" href="${buildTeamUrl(driver.team)}">${driver.team}</a></p>
      </article>
    `
  ).join("");
}

function renderRelatedRaces(race) {
  const wrap = document.getElementById("relatedRaces");
  if (!wrap) return;

  const candidates = [race.round - 1, race.round + 1]
    .map((round) => findRaceByRound(round))
    .filter(Boolean);

  wrap.innerHTML = candidates
    .map(
      (item) => `
      <a class="card card-link" href="${buildCircuitUrl(item.round)}">
        <p class="badge">Round ${String(item.round).padStart(2, "0")}</p>
        <h3>${item.grandPrix}</h3>
        <p class="race-date">${formatDateRange(item.start, item.end)}</p>
        <p>${item.circuit}</p>
      </a>
    `
    )
    .join("");
}

function renderCircuitPage() {
  const round = Number(getQueryParam("round"));
  const race = findRaceByRound(round);

  if (!race) {
    renderNotFound();
    return;
  }

  document.title = `Formula 1 2026 Hub | ${race.circuit}`;

  setText("circuitKicker", `Round ${String(race.round).padStart(2, "0")}`);
  setText("circuitTitle", race.circuit);
  setText("circuitLead", `${race.grandPrix} in ${race.city}, ${race.country} (${formatDateRange(race.start, race.end)})`);

  const navCalendar = document.getElementById("jumpCalendar");
  const navCircuits = document.getElementById("jumpCircuits");
  if (navCalendar) navCalendar.href = "calendar.html";
  if (navCircuits) navCircuits.href = "circuits.html";

  renderInfoCards(race);
  renderTeamSection();
  renderDriverSection();
  renderRelatedRaces(race);
}

initSite();
renderCircuitPage();
