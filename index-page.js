import { RACES_2026, TESTING_SESSIONS, SEASON, CIRCUIT_PROFILES_2026 } from "./f1-data.js";
import {
  initSite,
  getNextRace,
  getSeasonProgress,
  parseUtcDay,
  formatDateRange,
  buildCircuitUrl,
} from "./site.js";

const TESTING_VISUAL =
  "https://media.formula1.com/image/upload/c_lfill,w_1200/q_auto/v1740000000/fom-website/static-assets/2026/races/card/pre-season-testing.webp";

function setHomeFeature(race) {
  const imageEl = document.getElementById("homeFeatureImage");
  const captionEl = document.getElementById("homeFeatureCaption");
  const linkEl = document.getElementById("homeFeatureLink");
  if (!imageEl || !captionEl || !linkEl) return;

  if (!race) {
    linkEl.href = "calendar.html";
    linkEl.setAttribute("aria-label", "Open calendar page");
    imageEl.src = TESTING_VISUAL;
    imageEl.alt = "Pre-season testing visual";
    captionEl.textContent = "Season complete. Pre-season testing visual.";
    return;
  }

  const profile = CIRCUIT_PROFILES_2026[race.round];
  linkEl.href = buildCircuitUrl(race.round);
  linkEl.setAttribute("aria-label", `Open ${race.grandPrix} circuit page`);
  imageEl.src = profile?.heroImage || TESTING_VISUAL;
  imageEl.alt = `${race.grandPrix} featured visual`;
  captionEl.textContent = `Round ${String(race.round).padStart(2, "0")} | ${race.grandPrix}`;
}

function renderUpcoming() {
  const wrap = document.getElementById("upcomingRaces");
  if (!wrap) return;

  const now = new Date();
  const nextIndex = RACES_2026.findIndex((race) => now <= parseUtcDay(race.end));
  const startAt = nextIndex === -1 ? 0 : nextIndex;
  const slice = [];
  for (let i = 0; i < 6; i += 1) {
    const race = RACES_2026[startAt + i];
    if (race) slice.push(race);
  }

  wrap.innerHTML = slice
    .map(
      (race) => {
        const profile = CIRCUIT_PROFILES_2026[race.round];
        return `
      <a class="card race-card card-link" href="${buildCircuitUrl(race.round)}" aria-label="Open ${race.circuit} page">
        <img class="card-media circuit-media" src="${profile?.heroImage || TESTING_VISUAL}" alt="${race.grandPrix} image" loading="lazy" decoding="async" />
        <p class="badge">Round ${String(race.round).padStart(2, "0")}</p>
        <h3>${race.grandPrix}</h3>
        <p class="race-date">${formatDateRange(race.start, race.end)}</p>
        <p>${race.city}, ${race.country}</p>
        <p>${race.circuit}</p>
        ${race.sprint ? '<p class="race-tag">Sprint weekend</p>' : ""}
      </a>
    `;
      }
    )
    .join("");
}

function renderTesting() {
  const wrap = document.getElementById("testingBlocks");
  if (!wrap) return;

  wrap.innerHTML = TESTING_SESSIONS.map(
    (session, index) => `
      <a class="card card-link" href="calendar.html" aria-label="Open calendar page">
        <img class="card-media circuit-media" src="${TESTING_VISUAL}" alt="Pre-season testing ${index + 1} visual" loading="lazy" decoding="async" />
        <h3>${session.name}</h3>
        <p class="race-date">${formatDateRange(session.start, session.end)}</p>
        <p>${session.location}</p>
      </a>
    `
  ).join("");
}

function setCountdownValue(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = String(value).padStart(2, "0");
}

function updateCountdown() {
  const now = new Date();
  const nextRace = getNextRace(now);
  const statusEl = document.getElementById("countdownStatus");
  const nameEl = document.getElementById("nextRaceName");
  const metaEl = document.getElementById("nextRaceMeta");

  if (!nextRace) {
    setHomeFeature(null);
    setCountdownValue("days", 0);
    setCountdownValue("hours", 0);
    setCountdownValue("minutes", 0);
    setCountdownValue("seconds", 0);
    if (nameEl) nameEl.textContent = "2026 season complete";
    if (metaEl) metaEl.textContent = "All rounds completed.";
    if (statusEl) statusEl.textContent = "Awaiting 2027 official calendar.";
    return;
  }

  const start = parseUtcDay(nextRace.start);
  const end = parseUtcDay(nextRace.end);
  end.setUTCHours(23, 59, 59, 999);
  setHomeFeature(nextRace);

  if (nameEl) {
    nameEl.innerHTML = `<a class="inline-link" href="${buildCircuitUrl(nextRace.round)}">${nextRace.grandPrix} (Round ${String(nextRace.round).padStart(2, "0")})</a>`;
  }
  if (metaEl) {
    metaEl.textContent = `${nextRace.city}, ${nextRace.country} | ${formatDateRange(nextRace.start, nextRace.end)} | Race start ${nextRace.raceStartLocal} local`;
  }

  if (now >= start && now <= end) {
    setCountdownValue("days", 0);
    setCountdownValue("hours", 0);
    setCountdownValue("minutes", 0);
    setCountdownValue("seconds", 0);
    if (statusEl) statusEl.textContent = "Race weekend in progress.";
    return;
  }

  const diff = start.getTime() - now.getTime();
  const total = Math.max(0, Math.floor(diff / 1000));
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;

  setCountdownValue("days", days);
  setCountdownValue("hours", hours);
  setCountdownValue("minutes", minutes);
  setCountdownValue("seconds", seconds);
  if (statusEl) statusEl.textContent = `Countdown to ${nextRace.grandPrix}.`;
}

function setTopStats() {
  const progress = getSeasonProgress(new Date());
  const completed = document.getElementById("statCompleted");
  const remaining = document.getElementById("statRemaining");
  const phase = document.getElementById("statPhase");
  const sprint = document.getElementById("statSprint");

  if (completed) completed.textContent = String(progress.completed);
  if (remaining) remaining.textContent = String(progress.remaining);
  if (phase) phase.textContent = progress.phase;
  if (sprint) sprint.textContent = String(SEASON.sprintWeekends);
}

initSite();
setTopStats();
renderTesting();
renderUpcoming();
updateCountdown();
setInterval(updateCountdown, 1000);
