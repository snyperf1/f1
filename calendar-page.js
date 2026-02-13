import { RACES_2026, TESTING_SESSIONS } from "./f1-data.js";
import { initSite, formatDateRange } from "./site.js";

function renderTesting() {
  const wrap = document.getElementById("testingGrid");
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

function renderCalendar(filterSprint = false) {
  const body = document.getElementById("calendarBody");
  if (!body) return;
  const rows = RACES_2026.filter((race) => (filterSprint ? race.sprint : true));

  body.innerHTML = rows
    .map(
      (race) => `
        <tr>
          <td>${String(race.round).padStart(2, "0")}</td>
          <td>${race.grandPrix}</td>
          <td>${race.city}, ${race.country}</td>
          <td>${race.circuit}</td>
          <td>${formatDateRange(race.start, race.end)}</td>
          <td>${race.raceStartLocal}</td>
          <td>${race.sprint ? "Yes" : "No"}</td>
        </tr>
      `
    )
    .join("");

  const count = document.getElementById("calendarCount");
  if (count) count.textContent = `${rows.length} rounds shown`;
}

function setupFilter() {
  const toggle = document.getElementById("sprintOnlyToggle");
  if (!toggle) return;

  toggle.addEventListener("change", () => {
    renderCalendar(toggle.checked);
  });
}

initSite();
renderTesting();
renderCalendar(false);
setupFilter();
