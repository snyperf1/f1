import { RACES_2026, TESTING_SESSIONS, SEASON } from "./f1-data.js";
import { initSite, getNextRace, getSeasonProgress, parseUtcDay, formatDateRange } from "./site.js";

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
      (race) => `
      <article class="card race-card">
        <p class="badge">Round ${String(race.round).padStart(2, "0")}</p>
        <h3>${race.grandPrix}</h3>
        <p class="race-date">${formatDateRange(race.start, race.end)}</p>
        <p>${race.city}, ${race.country}</p>
        <p>${race.circuit}</p>
        ${race.sprint ? '<p class="race-tag">Sprint weekend</p>' : ""}
      </article>
    `
    )
    .join("");
}

function renderTesting() {
  const wrap = document.getElementById("testingBlocks");
  if (!wrap) return;

  wrap.innerHTML = TESTING_SESSIONS.map(
    (session) => `
      <article class="card">
        <h3>${session.name}</h3>
        <p class="race-date">${formatDateRange(session.start, session.end)}</p>
        <p>${session.location}</p>
      </article>
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

  if (nameEl) nameEl.textContent = `${nextRace.grandPrix} (Round ${String(nextRace.round).padStart(2, "0")})`;
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
