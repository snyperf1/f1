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
