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

