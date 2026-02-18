import { DRIVERS_2026, DRIVER_PROFILES_2026, TEAM_MEDIA_2026 } from "./f1-data.js";
import { initSite, buildDriverUrl, buildTeamUrl } from "./site.js";

const FORMULA1_DRIVERS_PAGE_ORDER = [
  "Pierre Gasly",
  "Franco Colapinto",
  "Fernando Alonso",
  "Lance Stroll",
  "Nico Hulkenberg",
  "Gabriel Bortoleto",
  "Sergio Perez",
  "Valtteri Bottas",
  "Charles Leclerc",
  "Lewis Hamilton",
  "Esteban Ocon",
  "Oliver Bearman",
  "Lando Norris",
  "Oscar Piastri",
  "George Russell",
  "Andrea Kimi Antonelli",
  "Liam Lawson",
  "Arvid Lindblad",
  "Max Verstappen",
  "Isack Hadjar",
  "Carlos Sainz",
  "Alexander Albon",
];

const DRIVER_ORDER_INDEX = Object.fromEntries(
  FORMULA1_DRIVERS_PAGE_ORDER.map((name, index) => [name, index])
);

function renderDrivers() {
  const wrap = document.getElementById("driversGrid");
  if (!wrap) return;

  const orderedDrivers = [...DRIVERS_2026].sort((a, b) => {
    const orderA = DRIVER_ORDER_INDEX[a.name] ?? Number.MAX_SAFE_INTEGER;
    const orderB = DRIVER_ORDER_INDEX[b.name] ?? Number.MAX_SAFE_INTEGER;
    if (orderA !== orderB) return orderA - orderB;
    return a.name.localeCompare(b.name);
  });

  wrap.innerHTML = orderedDrivers.map(
    (driver, index) => {
      const profile = DRIVER_PROFILES_2026[driver.name];
      const teamColor = TEAM_MEDIA_2026[driver.team]?.color || "#6ac6ff";
      return `
      <article class="card driver-card media-card team-accent-card" style="--team-color:${teamColor}">
        <a class="media-link" href="${buildDriverUrl(driver.name)}" aria-label="Open ${driver.name} driver page">
          <img
            class="card-media driver-media"
            src="${profile?.portrait || ""}"
            alt="${driver.name} driver portrait"
            loading="lazy"
            decoding="async"
          />
        </a>
        <p class="badge">Driver ${String(index + 1).padStart(2, "0")}</p>
        <div class="driver-id-line">
          <h3><a class="inline-link" href="${buildDriverUrl(driver.name)}">${driver.name}</a></h3>
          <span class="driver-code">#${profile?.number || "--"} ${profile?.code || ""}</span>
        </div>
        <p class="race-date">${driver.nationality}</p>
        <p><a class="inline-link team-inline-link" style="--team-color:${teamColor}" href="${buildTeamUrl(driver.team)}">${driver.team}</a></p>
        <p class="card-blurb">${profile?.story || ""}</p>
        <a class="tiny-link" href="${buildDriverUrl(driver.name)}">Open full profile</a>
      </article>
    `;
    }
  ).join("");
}

initSite();
renderDrivers();
