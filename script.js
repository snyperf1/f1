function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    const hamburger = document.querySelector(".hamburger");

    sidebar.classList.toggle("active");
    hamburger.classList.toggle("active");
}


function toggleDropdown(event, dropdownId) {
    event.preventDefault(); // Prevent default link behavior
    const dropdown = document.getElementById(dropdownId);
    dropdown.classList.toggle('active');
}


// Add smooth scrolling to sidebar links
document.querySelectorAll('.sidebar a').forEach(link => {
    link.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId.startsWith('#')) {
            e.preventDefault();
            document.querySelector(targetId).scrollIntoView({ 
                behavior: 'smooth' 
            });
        }
    });
});

// Load the calendar data from the JSON file
fetch('calendar.json')
    .then(response => response.json())
    .then(data => {
        // Get the current date
        const currentDate = new Date();

        // Find the next race after the current date
        let nextRace = null;
        for (let race of data) {
            let raceDate = new Date(race.date);
            if (raceDate > currentDate) {
                nextRace = race;
                break;
            }
        }

        // If a race is found, set up the countdown timer
        if (nextRace) {
            const raceDate = new Date(nextRace.date);
            const raceVenue = nextRace.venue;
            const raceCountry = nextRace.country;

            // Update the page with race details
            document.querySelector('.countdown-text').textContent = `Countdown to the Next Race: ${raceVenue}, ${raceCountry}`;

            // Update countdown every second
            setInterval(function() {
                const now = new Date();
                const timeRemaining = raceDate - now;

                // Calculate days, hours, minutes, and seconds
                const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
                const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

                // Update the countdown elements on the page
                document.getElementById('days').textContent = days < 10 ? '0' + days : days;
                document.getElementById('hours').textContent = hours < 10 ? '0' + hours : hours;
                document.getElementById('minutes').textContent = minutes < 10 ? '0' + minutes : minutes;
                document.getElementById('seconds').textContent = seconds < 10 ? '0' + seconds : seconds;

                // If the race has passed, update the message
                if (timeRemaining < 0) {
                    document.querySelector('.countdown-text').textContent = `The race in ${raceVenue}, ${raceCountry} has already passed!`;
                }
            }, 1000);
        } else {
            document.querySelector('.countdown-text').textContent = 'No upcoming races!';
        }
    })
    .catch(err => console.error('Error loading calendar:', err));

