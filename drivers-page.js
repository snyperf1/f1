import { DRIVERS_2026, DRIVER_PROFILES_2026 } from "./f1-data.js";
import { initSite, buildDriverUrl, buildTeamUrl } from "./site.js";

function renderDrivers() {
  const wrap = document.getElementById("driversGrid");
  if (!wrap) return;

  wrap.innerHTML = DRIVERS_2026.map(
    (driver, index) => {
      const profile = DRIVER_PROFILES_2026[driver.name];
      return `
      <article class="card driver-card media-card">
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
        <p><a class="inline-link" href="${buildTeamUrl(driver.team)}">${driver.team}</a></p>
        <p class="card-blurb">${profile?.story || ""}</p>
        <a class="tiny-link" href="${buildDriverUrl(driver.name)}">Open full profile</a>
      </article>
    `;
    }
  ).join("");
}

initSite();
renderDrivers();
