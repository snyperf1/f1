import { DRIVERS_2026, RACES_2026 } from "./f1-data.js";
import {
  initSite,
  getQueryParam,
  findDriverBySlug,
  getTeamByName,
  formatDateRange,
  buildDriverUrl,
  buildTeamUrl,
  buildCircuitUrl,
} from "./site.js";

const HOME_RACE_COUNTRY = {
  "United Kingdom": "Great Britain",
  Monaco: "Monaco",
  Italy: "Italy",
  Netherlands: "Netherlands",
  France: "France",
  Australia: "Australia",
  Thailand: "Thailand",
  Spain: "Spain",
  "New Zealand": "New Zealand",
  Canada: "Canada",
  Germany: "Germany",
  Brazil: "Brazil",
  Argentina: "Argentina",
  Mexico: "Mexico",
  Finland: "Finland",
};

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function renderNotFound() {
  const root = document.getElementById("driverDetailRoot");
  if (!root) return;
  root.innerHTML = `
    <section class="module page-hero">
      <p class="eyebrow">Driver</p>
      <h1>Driver not found</h1>
      <p class="lead">The selected driver does not exist in the 2026 dataset.</p>
      <div class="hero-actions">
        <a class="btn btn-primary" href="drivers.html">Back to drivers</a>
      </div>
    </section>
  `;
}

function renderInfo(driver, team) {
  const wrap = document.getElementById("driverInfo");
  if (!wrap) return;

  const teammates = team ? team.drivers.filter((name) => name !== driver.name) : [];

  wrap.innerHTML = `
    <article class="card">
      <h3>Nationality</h3>
      <p>${driver.nationality}</p>
    </article>
    <article class="card">
      <h3>Team</h3>
      <p><a class="inline-link" href="${buildTeamUrl(driver.team)}">${driver.team}</a></p>
    </article>
    <article class="card">
      <h3>Teammate</h3>
      <p>${teammates.length ? teammates.map((name) => `<a class="inline-link" href="${buildDriverUrl(name)}">${name}</a>`).join(" / ") : "TBC"}</p>
    </article>
  `;
}

function renderHomeRace(driver) {
  const wrap = document.getElementById("driverHomeRace");
  if (!wrap) return;

  const country = HOME_RACE_COUNTRY[driver.nationality];
  const homeRace = RACES_2026.find((race) => race.country === country);

  if (!homeRace) {
    wrap.innerHTML = `<article class="card"><h3>Home race</h3><p>No home race is listed in the 2026 calendar for this nationality.</p></article>`;
    return;
  }

  wrap.innerHTML = `
    <a class="card card-link" href="${buildCircuitUrl(homeRace.round)}">
      <p class="badge">Home race</p>
      <h3>${homeRace.grandPrix}</h3>
      <p class="race-date">${formatDateRange(homeRace.start, homeRace.end)}</p>
      <p>${homeRace.circuit}</p>
    </a>
  `;
}

function renderUpcomingRaces() {
  const wrap = document.getElementById("driverUpcoming");
  if (!wrap) return;

  wrap.innerHTML = RACES_2026.slice(0, 8)
    .map(
      (race) => `
      <a class="card card-link" href="${buildCircuitUrl(race.round)}">
        <p class="badge">Round ${String(race.round).padStart(2, "0")}</p>
        <h3>${race.grandPrix}</h3>
        <p class="race-date">${formatDateRange(race.start, race.end)}</p>
        <p>${race.city}, ${race.country}</p>
      </a>
    `
    )
    .join("");
}

function renderDriverPage() {
  const slug = getQueryParam("driver");
  const driver = slug ? findDriverBySlug(slug) : null;
  if (!driver) {
    renderNotFound();
    return;
  }

  const team = getTeamByName(driver.team);

  document.title = `Formula 1 2026 Hub | ${driver.name}`;
  setText("driverTitle", driver.name);
  setText("driverLead", `${driver.nationality} driver for ${driver.team}.`);

  renderInfo(driver, team);
  renderHomeRace(driver);
  renderUpcomingRaces();
}

initSite();
renderDriverPage();
