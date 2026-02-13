import { RACES_2026, TEAMS_2026, DRIVERS_2026, SEASON } from "./f1-data.js";

export function parseUtcDay(dateStr) {
  return new Date(`${dateStr}T00:00:00Z`);
}

export function parseUtcDayEnd(dateStr) {
  const date = parseUtcDay(dateStr);
  date.setUTCHours(23, 59, 59, 999);
  return date;
}

export function formatDateRange(start, end) {
  const a = parseUtcDay(start).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
  const b = parseUtcDay(end).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return `${a} - ${b}`;
}

export function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/\(.*?\)/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getQueryParam(key) {
  return new URLSearchParams(window.location.search).get(key);
}

export function buildDriverUrl(name) {
  return `driver.html?driver=${encodeURIComponent(slugify(name))}`;
}

export function buildTeamUrl(name) {
  return `team.html?team=${encodeURIComponent(slugify(name))}`;
}

export function buildCircuitUrl(round) {
  return `circuit.html?round=${encodeURIComponent(String(round))}`;
}

export function getTeamByName(name) {
  return TEAMS_2026.find((team) => team.name === name) || null;
}

export function getDriversByTeam(name) {
  return DRIVERS_2026.filter((driver) => driver.team === name);
}

export function findDriverBySlug(slug) {
  return DRIVERS_2026.find((driver) => slugify(driver.name) === slug) || null;
}

export function findTeamBySlug(slug) {
  return TEAMS_2026.find((team) => slugify(team.name) === slug) || null;
}

export function findRaceByRound(roundNumber) {
  return RACES_2026.find((race) => race.round === roundNumber) || null;
}

export function getNextRace(now = new Date()) {
  return RACES_2026.find((race) => now <= parseUtcDayEnd(race.end)) || null;
}

export function getSeasonProgress(now = new Date()) {
  const completed = RACES_2026.filter((race) => parseUtcDayEnd(race.end) < now).length;
  const remaining = RACES_2026.length - completed;
  const activeRace = RACES_2026.find(
    (race) => now >= parseUtcDay(race.start) && now <= parseUtcDayEnd(race.end)
  );

  let phase = "In season";
  if (now < parseUtcDay(RACES_2026[0].start)) {
    phase = "Pre-season";
  } else if (now > parseUtcDayEnd(RACES_2026[RACES_2026.length - 1].end)) {
    phase = "Post-season";
  } else if (activeRace) {
    phase = "Race weekend live";
  }

  return { completed, remaining, phase, activeRace };
}

function setupNav() {
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");

  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", nav.classList.contains("is-open") ? "true" : "false");
    });
  }

  const page = document.body.dataset.page;
  document.querySelectorAll(".site-nav a[data-page]").forEach((link) => {
    if (link.dataset.page === page) {
      link.classList.add("is-active");
    }
  });
}

export function setupReveal() {
  const nodes = document.querySelectorAll(".reveal");
  if (!nodes.length) {
    return;
  }

  if (!("IntersectionObserver" in window)) {
    nodes.forEach((node) => node.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  nodes.forEach((node) => observer.observe(node));
}

function setupJoinForm() {
  const form = document.getElementById("joinForm");
  const status = document.getElementById("formStatus");
  if (!form || !status) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    status.textContent = "Request received. We will send official updates only.";
    form.reset();
  });
}

function hydrateGlobalStats() {
  const rounds = document.getElementById("statRounds");
  const teams = document.getElementById("statTeams");
  const drivers = document.getElementById("statDrivers");

  if (rounds) rounds.textContent = String(SEASON.rounds);
  if (teams) teams.textContent = String(TEAMS_2026.length);
  if (drivers) drivers.textContent = String(DRIVERS_2026.length);
}

export function initSite() {
  setupNav();
  setupReveal();
  setupJoinForm();
  hydrateGlobalStats();
}
