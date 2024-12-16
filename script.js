const apiURL = "https://ergast.com/api/f1/current/next.json";
//in case API fails
const fallbackRaceDate = new Date("2025-02-29T15:00:00"); // TODO: Replace with fallback date from csv

async function fetchNextRaceDate() {
    try {
        const response = await fetch(apiURL);
        if (!response.ok) throw new Error("Failed to fetch data from API");
        const data = await response.json();
        
        // Check if the API returned any races
        const races = data.MRData.RaceTable.Races;
        if (races && races.length > 0) {
            const raceDate = races[0].date;
            const raceTime = races[0].time;
            return new Date(`${raceDate}T${raceTime}`);
        } else {
            console.warn("No upcoming race data available from API. Using fallback date.");
            return fallbackRaceDate;
        }
    } catch (error) {
        console.error("Error fetching race date:", error);
        return fallbackRaceDate;
    }
}

function initializeCountdown(nextRaceDate) {
    function updateCountdown() {
        const now = new Date();
        const timeDifference = nextRaceDate - now;

        if (timeDifference > 0) {
            const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeDifference % (1000 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

            document.getElementById("days").textContent = days.toString().padStart(2, '0');
            document.getElementById("hours").textContent = hours.toString().padStart(2, '0');
            document.getElementById("minutes").textContent = minutes.toString().padStart(2, '0');
            document.getElementById("seconds").textContent = seconds.toString().padStart(2, '0');
        } else {
            document.querySelector(".countdown-text").textContent = "The Race Has Begun!";
            document.querySelector(".countdown-units").style.display = "none";
        }
    }

    setInterval(updateCountdown, 1000);
}

fetchNextRaceDate().then(initializeCountdown);
