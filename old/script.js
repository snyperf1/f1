function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const menuButton = document.querySelector('.menu-button');
    
    sidebar.classList.toggle('active');
    menuButton.classList.toggle('active');
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

// Singapore GP 2025 date
const raceDate = new Date('October 3, 2025 20:00:00').getTime();

// Update countdown
function updateCountdown() {
    const now = new Date().getTime();
    const distance = raceDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = days.toString().padStart(2, '0');
    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
}

// Update the schedule handling
function populateSchedule() {
    const scheduleList = document.getElementById('schedule-list');
    
    // Fetch and process schedule data
    fetch('data/schedule.json')
        .then(response => response.json())
        .then(data => {
            // Create a flat array of all sessions with their series
            const allSessions = data.events.flatMap(event => 
                event.sessions.map(session => ({
                    series: event.series,
                    name: session.name,
                    time: new Date(session.time),
                    category: session.category
                }))
            );

            // Sort by time
            allSessions.sort((a, b) => a.time - b.time);

            // Clear existing items
            scheduleList.innerHTML = '';

            // Group sessions by date
            const sessionsByDate = groupSessionsByDate(allSessions);

            // Create schedule items
            Object.entries(sessionsByDate).forEach(([date, sessions]) => {
                // Add date header
                const dateHeader = document.createElement('div');
                dateHeader.className = 'schedule-date-header';
                dateHeader.textContent = formatDate(date);
                scheduleList.appendChild(dateHeader);

                // Add sessions for this date
                sessions.forEach(session => {
                    const scheduleItem = document.createElement('div');
                    scheduleItem.className = 'schedule-item';
                    scheduleItem.innerHTML = `
                        <div class="schedule-item-content">
                            <div class="schedule-item-time">${formatTime(session.time)}</div>
                            <div class="schedule-item-details">
                                <h3>${session.series}</h3>
                                <p>${session.name}</p>
                            </div>
                        </div>
                        <div class="calendar-actions">
                            <button class="calendar-button" aria-label="Add to calendar">
                                <svg viewBox="0 0 24 24">
                                    <path d="M12 7v4H8v2h4v4h2v-4h4v-2h-4V7h-2z"/>
                                </svg>
                            </button>
                            <div class="calendar-options" style="display: none;">
                                <button class="add-to-apple">Add to Apple Calendar</button>
                                <button class="add-to-google">Add to Google Calendar</button>
                            </div>
                        </div>
                    `;
                    scheduleList.appendChild(scheduleItem);
                    
                    // Add click handler for the calendar button
                    const calendarButton = scheduleItem.querySelector('.calendar-button');
                    const calendarOptions = scheduleItem.querySelector('.calendar-options');
                    
                    calendarButton.addEventListener('click', (e) => {
                        e.stopPropagation();
                        // Close all other popovers
                        document.querySelectorAll('.calendar-options').forEach(options => {
                            options.classList.remove('active'); // Hide all
                            options.parentElement.classList.remove('active'); // Reset the card position
                        });
                        
                        // Toggle this options section
                        calendarOptions.classList.toggle('active');
                        scheduleItem.classList.toggle('active'); // Slide the card
                    });

                    // Add functionality for the Apple and Google buttons
                    const appleButton = scheduleItem.querySelector('.add-to-apple');
                    const googleButton = scheduleItem.querySelector('.add-to-google');

                    appleButton.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const title = `${session.series} Practice`;
                        addToAppleCalendar(e, title, session.time);
                    });

                    googleButton.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const title = `${session.series} Practice`;
                        addToGoogleCalendar(e, title, session.time);
                    });
                });
            });
        })
        .catch(error => console.error('Error loading schedule:', error));
}

// Helper functions
function groupSessionsByDate(sessions) {
    return sessions.reduce((groups, session) => {
        const date = session.time.toDateString();
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(session);
        return groups;
    }, {});
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-SG', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric' 
    });
}

function formatTime(date) {
    return date.toLocaleTimeString('en-SG', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
    });
}

// Intersection Observer for fade effects
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Optional: unobserve after animation
            fadeObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateCountdown();
    setInterval(updateCountdown, 1000);
    populateSchedule();
    
    // Observe fade elements
    const fadeElements = document.querySelectorAll('.circuit-section');
    fadeElements.forEach(element => fadeObserver.observe(element));
    
    // Set initial theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Set initial icon
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    sunIcon.style.display = savedTheme === 'dark' ? 'none' : 'block';
    moonIcon.style.display = savedTheme === 'dark' ? 'block' : 'none';
});

function toggleTheme() {
    const body = document.documentElement;
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Toggle icons
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    sunIcon.style.display = newTheme === 'dark' ? 'none' : 'block';
    moonIcon.style.display = newTheme === 'dark' ? 'block' : 'none';
}

// Close popovers when clicking outside
document.addEventListener('click', (e) => {
    // Check if the click is outside the calendar actions
    if (!e.target.closest('.calendar-actions')) {
        // Hide all calendar options
        document.querySelectorAll('.calendar-options').forEach(options => {
            options.classList.remove('active'); // Hide all
            options.parentElement.classList.remove('active'); // Reset the card position
        });
    }
});

// Add this function to handle form submission
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent default form submission

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    // Here you can handle the form data, e.g., send it to a server
    console.log('Form submitted:', { name, email, message });

    // Optionally, reset the form
    this.reset();
});

