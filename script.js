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
                            <div class="calendar-popover">
                                <button class="calendar-popover-button" onclick="addToGoogleCalendar(event, '${session.name}', '${session.time}')">
                                    <svg viewBox="0 0 24 24">
                                        <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
                                    </svg>
                                    Add to Google Calendar
                                </button>
                                <button class="calendar-popover-button" onclick="addToAppleCalendar(event, '${session.name}', '${session.time}')">
                                    <svg viewBox="0 0 24 24">
                                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11"/>
                                    </svg>
                                    Add to Apple Calendar
                                </button>
                            </div>
                        </div>
                    `;
                    scheduleList.appendChild(scheduleItem);
                    
                    // Add click handler for the calendar button
                    const calendarButton = scheduleItem.querySelector('.calendar-button');
                    const popover = scheduleItem.querySelector('.calendar-popover');
                    
                    calendarButton.addEventListener('click', (e) => {
                        e.stopPropagation();
                        // Close all other popovers
                        document.querySelectorAll('.calendar-popover.active').forEach(p => {
                            if (p !== popover) {
                                p.classList.remove('active');
                            }
                        });
                        // Toggle this popover
                        popover.classList.toggle('active');
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
    if (!e.target.closest('.calendar-actions')) {
        document.querySelectorAll('.calendar-popover.active').forEach(popover => {
            popover.classList.remove('active');
        });
    }
});

// Calendar helper functions
function addToGoogleCalendar(e, title, dateTime) {
    e.stopPropagation();
    const date = new Date(dateTime);
    const endDate = new Date(date.getTime() + (60 * 60 * 1000)); // Add 1 hour
    
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}/${endDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}`;
    window.open(url, '_blank');
}

function addToAppleCalendar(e, title, dateTime) {
    e.stopPropagation();
    const date = new Date(dateTime);
    // Create .ics file content
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}
DTEND:${new Date(date.getTime() + (60 * 60 * 1000)).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}
SUMMARY:${title}
END:VEVENT
END:VCALENDAR`;
    
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `${title.replace(/\s+/g, '_')}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

