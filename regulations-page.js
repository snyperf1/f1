import { REGULATION_FACTS_2026, SOURCES, SEASON } from "./f1-data.js";
import { initSite } from "./site.js";

function renderRegulations() {
  const wrap = document.getElementById("regFacts");
  if (!wrap) return;

  wrap.innerHTML = REGULATION_FACTS_2026.map(
    (fact) => `
      <article class="card">
        <h3>${fact.title}</h3>
        <p>${fact.detail}</p>
      </article>
    `
  ).join("");
}

function renderSources() {
  const wrap = document.getElementById("regSources");
  if (!wrap) return;

  wrap.innerHTML = SOURCES.map(
    (source) => `
      <li>
        <a href="${source.url}" target="_blank" rel="noopener">${source.label}</a>
      </li>
    `
  ).join("");
}

function hydrateMeta() {
  const el = document.getElementById("rulesMeta");
  if (!el) return;
  el.textContent = `${SEASON.year} season: ${SEASON.rounds} rounds, ${SEASON.sprintWeekends} sprint weekends, ${SEASON.teams} teams, ${SEASON.drivers} drivers.`;
}

initSite();
renderRegulations();
renderSources();
hydrateMeta();
