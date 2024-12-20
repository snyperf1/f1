/*
document.addEventListener("DOMContentLoaded", () => {
  const standingsSection = document.getElementById("standings");

  // Fetch data from external JSON file
  fetch('data.json') // Ensure data.json is in the same directory
    .then(response => response.json()) // Parse the JSON data
    .then(data => {
      data.forEach(driver => {
        const driverCard = document.createElement("div");
        driverCard.className = "driver-card";

        // Dynamically add content
        const driverImageURL = `https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png`;

        driverCard.innerHTML = `
          <img src="${driverImageURL}" alt="${driver.DRIVER}">
          <div class="driver-info">
            <h2>${driver.DRIVER} <span style="font-size:0.8rem; color:#777;">(${driver.NATIONALITY})</span></h2>
            <p>${driver.CAR}</p>
          </div>
          <div class="points">${driver.PTS} PTS</div>
        `;

        standingsSection.appendChild(driverCard);
      });
    })
    .catch(error => console.error('Error fetching data:', error));
});
*/
// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", () => {
  // GSAP ScrollTrigger for animating sections on scroll
  gsap.registerPlugin(ScrollTrigger);

  gsap.utils.toArray("section").forEach((section) => {
      gsap.from(section, {
          scrollTrigger: {
              trigger: section,
              start: "top 80%",
              toggleActions: "play none none reverse"
          },
          opacity: 0,
          y: 50,
          duration: 1.2
      });
  });

  // Parallax effect for hero section
  const hero = document.querySelector(".hero");
  window.addEventListener("scroll", () => {
      const scrollPosition = window.scrollY;
      gsap.to(hero, { backgroundPositionY: `${scrollPosition * 0.5}px`, duration: 0.3 });
  });

  // Smooth scrolling to sections
  document.querySelectorAll("a[href^='#']").forEach((link) => {
      link.addEventListener("click", (e) => {
          e.preventDefault();
          const target = document.querySelector(link.getAttribute("href"));
          gsap.to(window, {
              scrollTo: { y: target, offsetY: 50 },
              duration: 1.5,
              ease: "power2.out"
          });
      });
  });

  // Custom animation using GSAP TextPlugin
  gsap.registerPlugin(TextPlugin);
  gsap.to(".hero h1", {
      text: "iPhone X - The Future is Here.",
      duration: 2,
      ease: "power2.inOut"
  });
});
