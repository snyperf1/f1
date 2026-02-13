const nextRace = {
  name: "Australian Grand Prix",
  location: "Albert Park, Melbourne",
  dateTime: "2026-03-08T05:00:00Z",
};

const ids = {
  days: document.getElementById("days"),
  hours: document.getElementById("hours"),
  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds"),
  raceName: document.getElementById("nextRaceName"),
  raceMeta: document.getElementById("nextRaceMeta"),
  status: document.getElementById("countdownStatus"),
};

const raceDate = new Date(nextRace.dateTime);

function setRaceMeta() {
  if (ids.raceName) {
    ids.raceName.textContent = nextRace.name;
  }

  if (ids.raceMeta) {
    const localTime = raceDate.toLocaleString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short",
    });
    ids.raceMeta.textContent = `${nextRace.location} | ${localTime}`;
  }
}

function applyCountdownValue(el, value) {
  if (el) {
    el.textContent = String(value).padStart(2, "0");
  }
}

function updateCountdown() {
  const now = Date.now();
  const diff = raceDate.getTime() - now;

  if (diff <= 0) {
    applyCountdownValue(ids.days, 0);
    applyCountdownValue(ids.hours, 0);
    applyCountdownValue(ids.minutes, 0);
    applyCountdownValue(ids.seconds, 0);
    if (ids.status) {
      ids.status.textContent = "Race weekend is live. Telemetry streaming now.";
    }
    return;
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  applyCountdownValue(ids.days, days);
  applyCountdownValue(ids.hours, hours);
  applyCountdownValue(ids.minutes, minutes);
  applyCountdownValue(ids.seconds, seconds);

  if (ids.status) {
    ids.status.textContent = "Systems green. Countdown locked to your local timezone.";
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
    formStatus.textContent = "Pit pass confirmed. You are in the intelligence feed.";
    joinForm.reset();
  });
}

setRaceMeta();
updateCountdown();
setupReveal();
setupJoinForm();
setInterval(updateCountdown, 1000);
