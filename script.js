const calendar2026 = [
  { round: 1, name: "Australian Grand Prix", location: "Melbourne", start: "2026-03-06", end: "2026-03-08" },
  { round: 2, name: "Chinese Grand Prix", location: "Shanghai", start: "2026-03-13", end: "2026-03-15" },
  { round: 3, name: "Japanese Grand Prix", location: "Suzuka", start: "2026-03-27", end: "2026-03-29" },
  { round: 4, name: "Bahrain Grand Prix", location: "Sakhir", start: "2026-04-10", end: "2026-04-12" },
  { round: 5, name: "Saudi Arabian Grand Prix", location: "Jeddah", start: "2026-04-17", end: "2026-04-19" },
  { round: 6, name: "Miami Grand Prix", location: "Miami", start: "2026-05-01", end: "2026-05-03" },
  { round: 7, name: "Canadian Grand Prix", location: "Montreal", start: "2026-05-22", end: "2026-05-24" },
  { round: 8, name: "Monaco Grand Prix", location: "Monaco", start: "2026-06-05", end: "2026-06-07" },
  { round: 9, name: "Spanish Grand Prix", location: "Barcelona-Catalunya", start: "2026-06-12", end: "2026-06-14" },
  { round: 10, name: "Austrian Grand Prix", location: "Spielberg", start: "2026-06-26", end: "2026-06-28" },
  { round: 11, name: "British Grand Prix", location: "Silverstone", start: "2026-07-03", end: "2026-07-05" },
  { round: 12, name: "Belgian Grand Prix", location: "Spa-Francorchamps", start: "2026-07-17", end: "2026-07-19" },
  { round: 13, name: "Hungarian Grand Prix", location: "Budapest", start: "2026-07-24", end: "2026-07-26" },
  { round: 14, name: "Dutch Grand Prix", location: "Zandvoort", start: "2026-08-21", end: "2026-08-23" },
  { round: 15, name: "Italian Grand Prix", location: "Monza", start: "2026-09-04", end: "2026-09-06" },
  { round: 16, name: "Spanish Grand Prix", location: "Madrid", start: "2026-09-11", end: "2026-09-13" },
  { round: 17, name: "Azerbaijan Grand Prix", location: "Baku", start: "2026-09-24", end: "2026-09-26" },
  { round: 18, name: "Singapore Grand Prix", location: "Singapore", start: "2026-10-09", end: "2026-10-11" },
  { round: 19, name: "United States Grand Prix", location: "Austin", start: "2026-10-23", end: "2026-10-25" },
  { round: 20, name: "Mexico City Grand Prix", location: "Mexico City", start: "2026-10-30", end: "2026-11-01" },
  { round: 21, name: "Sao Paulo Grand Prix", location: "Interlagos", start: "2026-11-06", end: "2026-11-08" },
  { round: 22, name: "Las Vegas Grand Prix", location: "Las Vegas", start: "2026-11-19", end: "2026-11-21" },
  { round: 23, name: "Qatar Grand Prix", location: "Lusail", start: "2026-11-27", end: "2026-11-29" },
  { round: 24, name: "Abu Dhabi Grand Prix", location: "Yas Marina", start: "2026-12-04", end: "2026-12-06" },
];

const ids = {
  days: document.getElementById("days"),
  hours: document.getElementById("hours"),
  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds"),
  raceName: document.getElementById("nextRaceName"),
  raceMeta: document.getElementById("nextRaceMeta"),
  status: document.getElementById("countdownStatus"),
  todayDate: document.getElementById("todayDate"),
  roundsCompleted: document.getElementById("roundsCompleted"),
  roundsRemaining: document.getElementById("roundsRemaining"),
  seasonPhase: document.getElementById("seasonPhase"),
};

function parseUtcDay(dateStr) {
  return new Date(`${dateStr}T00:00:00Z`);
}

function parseUtcDayEnd(dateStr) {
  const date = parseUtcDay(dateStr);
  date.setUTCHours(23, 59, 59, 999);
  return date;
}

function applyCountdownValue(el, value) {
  if (el) {
    el.textContent = String(value).padStart(2, "0");
  }
}

function formatDate(dateStr) {
  return parseUtcDay(dateStr).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getNextRace(now) {
  return calendar2026.find((race) => now <= parseUtcDayEnd(race.end)) || null;
}

function setSeasonFacts(now) {
  const completed = calendar2026.filter((race) => parseUtcDayEnd(race.end) < now).length;
  const remaining = calendar2026.length - completed;
  const firstStart = parseUtcDay(calendar2026[0].start);
  const lastEnd = parseUtcDayEnd(calendar2026[calendar2026.length - 1].end);
  const activeRace = calendar2026.find(
    (race) => now >= parseUtcDay(race.start) && now <= parseUtcDayEnd(race.end)
  );

  let phase = "In-season";
  if (now < firstStart) {
    phase = "Pre-season";
  } else if (now > lastEnd) {
    phase = "Post-season";
  } else if (activeRace) {
    phase = "Race weekend live";
  }

  if (ids.todayDate) {
    ids.todayDate.textContent = now.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
  if (ids.roundsCompleted) {
    ids.roundsCompleted.textContent = String(completed);
  }
  if (ids.roundsRemaining) {
    ids.roundsRemaining.textContent = String(remaining);
  }
  if (ids.seasonPhase) {
    ids.seasonPhase.textContent = phase;
  }
}

function updateCountdown() {
  const now = new Date();
  const nextRace = getNextRace(now);

  setSeasonFacts(now);

  if (!nextRace) {
    applyCountdownValue(ids.days, 0);
    applyCountdownValue(ids.hours, 0);
    applyCountdownValue(ids.minutes, 0);
    applyCountdownValue(ids.seconds, 0);
    if (ids.raceName) {
      ids.raceName.textContent = "2026 season complete";
    }
    if (ids.raceMeta) {
      ids.raceMeta.textContent = "All 24 rounds are completed.";
    }
    if (ids.status) {
      ids.status.textContent = "Awaiting official 2027 calendar confirmation.";
    }
    return;
  }

  const start = parseUtcDay(nextRace.start);
  const end = parseUtcDayEnd(nextRace.end);

  if (ids.raceName) {
    ids.raceName.textContent = `${nextRace.name} (Round ${String(nextRace.round).padStart(2, "0")})`;
  }
  if (ids.raceMeta) {
    ids.raceMeta.textContent = `${nextRace.location} | ${formatDate(nextRace.start)} - ${formatDate(nextRace.end)}`;
  }

  if (now >= start && now <= end) {
    applyCountdownValue(ids.days, 0);
    applyCountdownValue(ids.hours, 0);
    applyCountdownValue(ids.minutes, 0);
    applyCountdownValue(ids.seconds, 0);
    if (ids.status) {
      ids.status.textContent = "Race weekend is live.";
    }
    return;
  }

  const diff = start.getTime() - now.getTime();
  const totalSeconds = Math.max(0, Math.floor(diff / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  applyCountdownValue(ids.days, days);
  applyCountdownValue(ids.hours, hours);
  applyCountdownValue(ids.minutes, minutes);
  applyCountdownValue(ids.seconds, seconds);

  if (ids.status) {
    ids.status.textContent = `Countdown to ${nextRace.name} weekend start.`;
  }
}

function setupReveal() {
  const revealNodes = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    revealNodes.forEach((node) => node.classList.add("is-visible"));
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
    { threshold: 0.17 }
  );

  revealNodes.forEach((node) => observer.observe(node));
}

function setupJoinForm() {
  const joinForm = document.getElementById("joinForm");
  const formStatus = document.getElementById("formStatus");

  if (!joinForm || !formStatus) {
    return;
  }

  joinForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formStatus.textContent = "Pit pass request received.";
    joinForm.reset();
  });
}

updateCountdown();
setupReveal();
setupJoinForm();
setInterval(updateCountdown, 1000);
