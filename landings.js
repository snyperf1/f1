// JavaScript to add rotation effect as you scroll
window.addEventListener('scroll', function () {
  const containers = document.querySelectorAll('.container');
  
  containers.forEach((container) => {
    const rect = container.getBoundingClientRect();
    const offset = window.innerHeight - rect.top;
    
    if (offset > 200) {
      container.classList.add('rotate');
    } else {
      container.classList.remove('rotate');
    }
  });
});
