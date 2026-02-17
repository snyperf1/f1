import { DRIVERS_2026, RACES_2026, TEAM_MEDIA_2026 } from "./f1-data.js";
import {
  initSite,
  getQueryParam,
  findTeamBySlug,
  getDriversByTeam,
  formatDateRange,
  buildDriverUrl,
  buildCircuitUrl,
} from "./site.js";

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function renderNotFound() {
  const root = document.getElementById("teamDetailRoot");
  if (!root) return;
  root.innerHTML = `
    <section class="module page-hero">
      <p class="eyebrow">Team</p>
      <h1>Team not found</h1>
      <p class="lead">The selected team does not exist in the 2026 dataset.</p>
      <div class="hero-actions">
        <a class="btn btn-primary" href="teams.html">Back to teams</a>
      </div>
    </section>
  `;
}

function renderTeamFacts(team) {
  const wrap = document.getElementById("teamFacts");
  if (!wrap) return;
  const teamColor = TEAM_MEDIA_2026[team.name]?.color || "#6ac6ff";

  wrap.innerHTML = `
    <article class="card team-accent-card" style="--team-color:${teamColor}">
      <h3>Base</h3>
      <p>${team.base}</p>
    </article>
    <article class="card team-accent-card" style="--team-color:${teamColor}">
      <h3>Power Unit</h3>
      <p>${team.powerUnit}</p>
    </article>
    <article class="card team-accent-card" style="--team-color:${teamColor}">
      <h3>Driver Lineup</h3>
      <p>${team.drivers
        .map((name) => `<a class="inline-link driver-inline-link" style="--team-color:${teamColor}" href="${buildDriverUrl(name)}">${name}</a>`)
        .join(" / ")}</p>
    </article>
  `;
}

function renderTeamCar(team) {
  const wrap = document.getElementById("teamCarShowcase");
  if (!wrap) return;

  const media = TEAM_MEDIA_2026[team.name] || null;
  const teamColor = media?.color || "#6ac6ff";

  if (!media?.car) {
    wrap.innerHTML = `
      <article class="card team-accent-card" style="--team-color:${teamColor}">
        <h3>${team.name}</h3>
        <p>Car render is currently unavailable.</p>
      </article>
    `;
    return;
  }

  wrap.innerHTML = `
    <article class="card media-card team-accent-card" style="--team-color:${teamColor}">
      <img class="card-media car-media" src="${media.car}" alt="${team.name} 2026 car render" loading="lazy" decoding="async" />
      ${
        media.logo
          ? `<img class="team-logo-mark" src="${media.logo}" alt="${team.name} logo" loading="lazy" decoding="async" />`
          : ""
      }
      <h3>${team.name}</h3>
      <p>Official 2026 team car render.</p>
    </article>
  `;
}

function renderDrivers(team) {
  const wrap = document.getElementById("teamDrivers");
  if (!wrap) return;

  const teamDrivers = getDriversByTeam(team.name);
  const teamColor = TEAM_MEDIA_2026[team.name]?.color || "#6ac6ff";

  wrap.innerHTML = teamDrivers
    .map(
      (driver) => `
      <a class="card card-link team-accent-card" style="--team-color:${teamColor}" href="${buildDriverUrl(driver.name)}">
        <h3>${driver.name}</h3>
        <p class="race-date">${driver.nationality}</p>
        <p class="team-inline-link" style="--team-color:${teamColor}">${team.name}</p>
      </a>
    `
    )
    .join("");
}

function renderSeasonPath() {
  const wrap = document.getElementById("teamSeasonPath");
  if (!wrap) return;

  wrap.innerHTML = RACES_2026.map(
    (race) => `
      <tr>
        <td>${String(race.round).padStart(2, "0")}</td>
        <td><a class="inline-link" href="${buildCircuitUrl(race.round)}">${race.grandPrix}</a></td>
        <td>${race.city}, ${race.country}</td>
        <td>${formatDateRange(race.start, race.end)}</td>
      </tr>
    `
  ).join("");
}

function renderCrossLinks(team) {
  const wrap = document.getElementById("teamCrossLinks");
  if (!wrap) return;

  const otherDrivers = DRIVERS_2026.filter((driver) => driver.team !== team.name).slice(0, 6);
  wrap.innerHTML = otherDrivers
    .map((driver) => {
      const teamColor = TEAM_MEDIA_2026[driver.team]?.color || "#6ac6ff";
      return `
      <a class="card card-link team-accent-card" style="--team-color:${teamColor}" href="${buildDriverUrl(driver.name)}">
        <h3>${driver.name}</h3>
        <p class="team-inline-link" style="--team-color:${teamColor}">${driver.team}</p>
      </a>
    `;
    })
    .join("");
}

function renderTeamPage() {
  const slug = getQueryParam("team");
  const team = slug ? findTeamBySlug(slug) : null;

  if (!team) {
    renderNotFound();
    return;
  }

  document.title = `Formula 1 2026 Hub | ${team.name}`;
  setText("teamTitle", team.name);
  setText("teamLead", `${team.base} | Power unit: ${team.powerUnit}`);
  const teamColor = TEAM_MEDIA_2026[team.name]?.color || "#6ac6ff";
  const hero = document.querySelector("#teamDetailRoot .page-hero");
  if (hero) {
    hero.classList.add("team-accent-module");
    hero.style.setProperty("--team-color", teamColor);
  }

  renderTeamFacts(team);
  renderTeamCar(team);
  renderDrivers(team);
  renderSeasonPath();
  renderCrossLinks(team);
}

initSite();
renderTeamPage();
