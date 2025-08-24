// Sidebar Toggle Function
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const menuButton = document.querySelector('.menu-button');
    
    sidebar.classList.toggle('active');
    menuButton.classList.toggle('active');
}

// Countdown Timer Function
function updateCountdown() {
    // Set the date for the next race (example: Australian GP 2024)
    const raceDate = new Date('March 14, 2025 05:00:00').getTime();
    
    // Update countdown every second
    setInterval(() => {
        // Get current date and time
        const now = new Date().getTime();
        
        // Find the distance between now and race date
        const distance = raceDate - now;
        
        // Time calculations
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Update the HTML elements
        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
        
        // If countdown is finished
        if (distance < 0) {
            clearInterval(interval);
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
        }
    }, 1000);
}

// Menu Icon Animation
function setupMenuAnimation() {
    const menuButton = document.querySelector('.menu-button');
    
    menuButton.addEventListener('click', () => {
        const menuIcon = menuButton.querySelector('.menu-icon');
        menuIcon.classList.toggle('active');
    });
}

// Initialize all functions when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    updateCountdown();
    setupMenuAnimation();
    
    // Close sidebar when clicking outside
    document.addEventListener('click', (e) => {
        const sidebar = document.getElementById('sidebar');
        const menuButton = document.querySelector('.menu-button');
        
        if (!sidebar.contains(e.target) && 
            !menuButton.contains(e.target) && 
            sidebar.classList.contains('active')) {
            toggleSidebar();
        }
    });
});

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

// Intersection Observer for fade-in animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all fade-in elements
document.addEventListener('DOMContentLoaded', () => {
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(element => observer.observe(element));
});