import { DRIVERS_2026, RACES_2026, DRIVER_PROFILES_2026, CIRCUIT_PROFILES_2026 } from "./f1-data.js";
import {
  initSite,
  getQueryParam,
  findDriverBySlug,
  getTeamByName,
  formatDateRange,
  parseUtcDayEnd,
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

function getUpcomingRaces(limit = 8) {
  const now = new Date();
  const nextIndex = RACES_2026.findIndex((race) => now <= parseUtcDayEnd(race.end));
  if (nextIndex === -1) {
    return RACES_2026.slice(0, limit);
  }
  return RACES_2026.slice(nextIndex, nextIndex + limit);
}

function renderHero(driver, profile) {
  setText("driverTitle", driver.name);
  setText("driverLead", `${driver.nationality} | #${profile.number} ${profile.code} | ${driver.team}`);
  const teamColor = profile?.teamColor || "#6ac6ff";
  const hero = document.querySelector("#driverDetailRoot .page-hero");
  if (hero) {
    hero.classList.add("team-accent-module");
    hero.style.setProperty("--team-color", teamColor);
  }

  const portrait = document.getElementById("driverPortrait");
  if (portrait && profile?.portrait) {
    portrait.src = profile.portrait;
    portrait.alt = `${driver.name} official portrait`;
  }

  const jumpTeam = document.getElementById("jumpTeam");
  if (jumpTeam) {
    jumpTeam.href = buildTeamUrl(driver.team);
  }
}

function renderInfo(driver, team, profile) {
  const wrap = document.getElementById("driverInfo");
  if (!wrap) return;
  const teamColor = profile?.teamColor || "#6ac6ff";

  const teammates = team ? team.drivers.filter((name) => name !== driver.name) : [];

  wrap.innerHTML = `
    <article class="card">
      <h3>Driver code</h3>
      <p>#${profile.number} ${profile.code}</p>
    </article>
    <article class="card">
      <h3>Nationality</h3>
      <p>${driver.nationality}</p>
    </article>
    <article class="card">
      <h3>Team</h3>
      <p><a class="inline-link team-inline-link" style="--team-color:${teamColor}" href="${buildTeamUrl(driver.team)}">${driver.team}</a></p>
    </article>
    <article class="card">
      <h3>Teammate</h3>
      <p>${teammates.length ? teammates.map((name) => `<a class="inline-link" href="${buildDriverUrl(name)}">${name}</a>`).join(" / ") : "TBC"}</p>
    </article>
  `;
}

function renderHighlights(driver, profile) {
  const wrap = document.getElementById("driverHighlights");
  if (!wrap) return;

  const nextRace = getUpcomingRaces(1)[0] || null;
  const teamMedia = profile?.teamLogo
    ? `<img class="team-logo-mark" src="${profile.teamLogo}" alt="${driver.team} logo" loading="lazy" decoding="async" />`
    : "";

  wrap.innerHTML = `
    <article class="card">
      <h3>Storyline</h3>
      <p>${profile.story}</p>
    </article>
    <article class="card">
      <h3>2026 objective</h3>
      <p>${driver.team} is targeting consistent points conversion and stronger Sunday execution.</p>
      ${teamMedia}
    </article>
    <article class="card">
      <h3>Next spotlight</h3>
      <p>${
        nextRace
          ? `<a class="inline-link" href="${buildCircuitUrl(nextRace.round)}">${nextRace.grandPrix}</a> | ${nextRace.city}, ${nextRace.country}`
          : "Calendar complete."
      }</p>
    </article>
  `;
}

function renderTeamCar(driver, profile) {
  const wrap = document.getElementById("driverTeamCar");
  if (!wrap) return;
  const teamColor = profile?.teamColor || "#6ac6ff";

  if (!profile?.teamCar) {
    wrap.innerHTML = `<article class="card"><h3>Team car</h3><p>Car image currently unavailable.</p></article>`;
    return;
  }

  wrap.innerHTML = `
    <article class="card media-card team-accent-card" style="--team-color:${teamColor}">
      <img class="card-media car-media" src="${profile.teamCar}" alt="${driver.team} 2026 car render" loading="lazy" decoding="async" />
      <h3>${driver.team}</h3>
      <p>2026 package preview with official team render styling.</p>
    </article>
  `;
}

function renderHomeRace(driver) {
  const wrap = document.getElementById("driverHomeRace");
  if (!wrap) return null;

  const country = HOME_RACE_COUNTRY[driver.nationality];
  const homeRace = RACES_2026.find((race) => race.country === country);

  if (!homeRace) {
    wrap.innerHTML = `<article class="card"><h3>Home race</h3><p>No home race is listed in the 2026 calendar for this nationality.</p></article>`;
    return null;
  }

  const circuitProfile = CIRCUIT_PROFILES_2026[homeRace.round] || null;
  wrap.innerHTML = `
    <a class="card card-link media-card" href="${buildCircuitUrl(homeRace.round)}">
      <img
        class="card-media circuit-media"
        src="${circuitProfile?.heroImage || ""}"
        alt="${homeRace.grandPrix} circuit image"
        loading="lazy"
        decoding="async"
      />
      <p class="badge">Home race</p>
      <h3>${homeRace.grandPrix}</h3>
      <p class="race-date">${formatDateRange(homeRace.start, homeRace.end)}</p>
      <p>${homeRace.circuit}</p>
      <p class="card-blurb">${circuitProfile?.signature || ""}</p>
    </a>
  `;

  return homeRace;
}

function renderUpcomingRaces() {
  const wrap = document.getElementById("driverUpcoming");
  if (!wrap) return;

  wrap.innerHTML = getUpcomingRaces(8)
    .map(
      (race) => {
        const profile = CIRCUIT_PROFILES_2026[race.round];
        return `
      <a class="card card-link media-card" href="${buildCircuitUrl(race.round)}">
        <img class="card-media circuit-media" src="${profile?.heroImage || ""}" alt="${race.circuit} image" loading="lazy" decoding="async" />
        <p class="badge">Round ${String(race.round).padStart(2, "0")}</p>
        <h3>${race.grandPrix}</h3>
        <p class="race-date">${formatDateRange(race.start, race.end)}</p>
        <p>${race.city}, ${race.country}</p>
        <p class="card-blurb">${profile?.type || "Grand Prix weekend"}</p>
      </a>
    `;
      }
    )
    .join("");
}

function renderGallery(driver, profile, homeRace) {
  const wrap = document.getElementById("driverGallery");
  if (!wrap) return;

  const galleryCards = [
    {
      title: `${driver.name} Portrait`,
      image: profile.portrait,
      subtitle: `${profile.code} | #${profile.number}`,
      href: buildDriverUrl(driver.name),
    },
    {
      title: `${driver.team} Car`,
      image: profile.teamCar,
      subtitle: "2026 team render",
      href: buildTeamUrl(driver.team),
    },
    homeRace
      ? {
          title: homeRace.grandPrix,
          image: CIRCUIT_PROFILES_2026[homeRace.round]?.mapImage || "",
          subtitle: homeRace.circuit,
          href: buildCircuitUrl(homeRace.round),
        }
      : null,
  ].filter(Boolean);

  wrap.innerHTML = galleryCards
    .map(
      (item) => `
      <a class="card card-link media-card" href="${item.href}">
        <img class="card-media circuit-media" src="${item.image}" alt="${item.title}" loading="lazy" decoding="async" />
        <h3>${item.title}</h3>
        <p class="race-date">${item.subtitle}</p>
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
  const profile = DRIVER_PROFILES_2026[driver.name] || {
    code: "F1",
    number: "--",
    portrait: "",
    teamCar: "",
    teamLogo: "",
    story: `${driver.name} appears on the official entry list.`,
  };

  document.title = `Formula 1 2026 Hub | ${driver.name}`;
  renderHero(driver, profile);
  renderInfo(driver, team, profile);
  renderHighlights(driver, profile);
  renderTeamCar(driver, profile);
  const homeRace = renderHomeRace(driver);
  renderUpcomingRaces();
  renderGallery(driver, profile, homeRace);
}

initSite();
renderDriverPage();
