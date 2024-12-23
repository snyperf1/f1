function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    const hamburger = document.querySelector(".hamburger");
    sidebar.classList.toggle("active");
    hamburger.classList.toggle("active");
}

function toggleDropdown(event, dropdownId) {
    event.preventDefault();
    const dropdown = document.getElementById(dropdownId);
    dropdown.classList.toggle('active');
}

// Add smooth scrolling to sidebar links
document.querySelectorAll('.sidebar a').forEach(link => {
    link.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId.startsWith('#')) {
            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});

// Update Breaking News
function updateBreakingNews(news) {
    const container = document.getElementById('breaking-news-container');
    container.innerHTML = `<span>${news}</span>`;
}

// Fetch JSON data and populate content
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        // Update Breaking News
        updateBreakingNews(data.breakingNews);

        // Set Countdown
        const nextSession = new Date(data.nextSessionDate);
        setInterval(() => {
            const now = new Date();
            const timeLeft = nextSession - now;
            
            document.getElementById('days').innerText = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            document.getElementById('hours').innerText = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
            document.getElementById('minutes').innerText = Math.floor((timeLeft / (1000 * 60)) % 60);
            document.getElementById('seconds').innerText = Math.floor((timeLeft / 1000) % 60);
        }, 1000);

        // Populate Circuit Info
        const circuitInfo = data.circuit;
        document.getElementById('circuit-image').src = circuitInfo.image;
        document.getElementById('circuit-name').innerText = circuitInfo.name;
        document.getElementById('circuit-length').innerText = circuitInfo.length;
        document.getElementById('circuit-laps').innerText = circuitInfo.laps;
        document.getElementById('circuit-distance').innerText = circuitInfo.distance;
        document.getElementById('circuit-record').innerText = circuitInfo.record;

        // Populate Timings
        const timingsList = document.getElementById('timings-list');
        data.timings.forEach(event => {
            const eventCard = document.createElement('div');
            eventCard.className = 'timing-card';
            eventCard.innerHTML = `
                <h3>${event.series}</h3>
                <p><strong>${event.type}</strong>: ${event.time}</p>
            `;
            timingsList.appendChild(eventCard);
        });
    })
    .catch(error => console.error('Error loading data:', error));