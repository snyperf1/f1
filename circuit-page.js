import { DRIVERS_2026, TEAMS_2026, DRIVER_PROFILES_2026, TEAM_MEDIA_2026, CIRCUIT_PROFILES_2026 } from "./f1-data.js";
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

function renderInfoCards(race, profile) {
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
      <h3>Weekend format</h3>
      <p>${profile?.type || "Grand Prix circuit"}</p>
      <p>${race.sprint ? "Sprint weekend format" : "Standard weekend format"}</p>
    </article>
    <article class="card">
      <h3>Race start</h3>
      <p>${race.raceStartLocal} local time</p>
      <p>${profile?.challenge || "Set-up balance and tyre life are critical across sessions."}</p>
    </article>
    <article class="card">
      <h3>Signature</h3>
      <p>${profile?.signature || race.circuit}</p>
    </article>
  `;
}

function renderVisuals(race, profile) {
  const wrap = document.getElementById("circuitVisuals");
  if (!wrap) return;

  wrap.innerHTML = `
    <a class="card card-link media-card" href="${buildCircuitUrl(race.round)}" aria-label="Open ${race.grandPrix} circuit page">
      <img class="card-media circuit-media" src="${profile?.heroImage || ""}" alt="${race.grandPrix} hero image" loading="lazy" decoding="async" />
      <h3>${race.grandPrix}</h3>
      <p class="race-date">${race.city}, ${race.country}</p>
    </a>
    <a class="card card-link media-card" href="${buildCircuitUrl(race.round)}" aria-label="Open ${race.circuit} page">
      <img class="card-media circuit-media" src="${profile?.mapImage || ""}" alt="${race.circuit} layout image" loading="lazy" decoding="async" />
      <h3>Track map</h3>
      <p>${race.circuit}</p>
    </a>
  `;
}

function renderTeamSection() {
  const wrap = document.getElementById("circuitTeams");
  if (!wrap) return;

  wrap.innerHTML = TEAMS_2026.map(
    (team) => {
      const media = TEAM_MEDIA_2026[team.name];
      const drivers = team.drivers
        .map((name) => `<a class="inline-link" href="${buildDriverUrl(name)}">${name}</a>`)
        .join(" / ");

      return `
      <article class="card team-card media-card team-accent-card" style="--team-color:${media?.color || "#6ac6ff"}">
        ${
          media?.car
            ? `<img class="card-media car-media" src="${media.car}" alt="${team.name} 2026 car" loading="lazy" decoding="async" />`
            : ""
        }
        ${
          media?.logo
            ? `<img class="team-logo-mark" src="${media.logo}" alt="${team.name} logo" loading="lazy" decoding="async" />`
            : ""
        }
        <h3><a class="inline-link team-inline-link" style="--team-color:${media?.color || "#6ac6ff"}" href="${buildTeamUrl(team.name)}">${team.name}</a></h3>
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
    (driver) => {
      const profile = DRIVER_PROFILES_2026[driver.name];
      const teamColor = TEAM_MEDIA_2026[driver.team]?.color || "#6ac6ff";
      return `
      <article class="card media-card team-accent-card" style="--team-color:${teamColor}">
        <a class="media-link" href="${buildDriverUrl(driver.name)}" aria-label="Open ${driver.name} driver page">
          <img class="card-media driver-media" src="${profile?.portrait || ""}" alt="${driver.name} portrait" loading="lazy" decoding="async" />
        </a>
        <h3><a class="inline-link driver-inline-link" style="--team-color:${teamColor}" href="${buildDriverUrl(driver.name)}">${driver.name}</a></h3>
        <p>${driver.nationality}</p>
        <p><a class="inline-link team-inline-link" style="--team-color:${teamColor}" href="${buildTeamUrl(driver.team)}">${driver.team}</a></p>
        <p class="card-blurb">#${profile?.number || "--"} ${profile?.code || ""}</p>
      </article>
    `;
    }
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
      (item) => {
        const profile = CIRCUIT_PROFILES_2026[item.round];
        return `
      <a class="card card-link media-card" href="${buildCircuitUrl(item.round)}">
        <img class="card-media circuit-media" src="${profile?.heroImage || ""}" alt="${item.grandPrix} image" loading="lazy" decoding="async" />
        <p class="badge">Round ${String(item.round).padStart(2, "0")}</p>
        <h3>${item.grandPrix}</h3>
        <p class="race-date">${formatDateRange(item.start, item.end)}</p>
        <p>${item.circuit}</p>
        <p class="card-blurb">${profile?.type || "Grand Prix circuit"}</p>
      </a>
    `;
      }
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

  const profile = CIRCUIT_PROFILES_2026[race.round] || null;

  document.title = `Formula 1 2026 Hub | ${race.circuit}`;

  setText("circuitKicker", `Round ${String(race.round).padStart(2, "0")}`);
  setText("circuitTitle", race.circuit);
  setText(
    "circuitLead",
    `${race.grandPrix} in ${race.city}, ${race.country} (${formatDateRange(race.start, race.end)}) | ${profile?.type || "Grand Prix circuit"}`
  );

  const navCalendar = document.getElementById("jumpCalendar");
  const navCircuits = document.getElementById("jumpCircuits");
  if (navCalendar) navCalendar.href = "calendar.html";
  if (navCircuits) navCircuits.href = "circuits.html";
  const hero = document.getElementById("circuitHeroImage");
  if (hero && profile?.heroImage) {
    hero.src = profile.heroImage;
    hero.alt = `${race.grandPrix} hero image`;
  }

  renderInfoCards(race, profile);
  renderVisuals(race, profile);
  renderTeamSection();
  renderDriverSection();
  renderRelatedRaces(race);
}

initSite();
renderCircuitPage();
