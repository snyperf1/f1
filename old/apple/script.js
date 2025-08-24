// Register GSAP Plugins
gsap.registerPlugin(
  ScrollTrigger,
  ScrollToPlugin,
  Draggable
);

// Hero Section Animation (fade-in and slide-up)
gsap.from('.hero h1', {
  opacity: 0,
  y: 50,
  duration: 1.5,
  delay: 0.5,
  ease: "power3.out",
});

gsap.from('.hero p', {
  opacity: 0,
  y: 50,
  duration: 1.5,
  delay: 1,
  ease: "power3.out",
});

// 3D Spinning Effect on Hero Image with ScrollTrigger
gsap.to('.hero-image', {
  scrollTrigger: {
    trigger: '.hero',
    start: 'top bottom',
    end: 'bottom top',
    scrub: 0.5,  // Smooth scrolling effect
  },
  rotationY: 360,  // Spin 360 degrees
  transformOrigin: 'center center',  // Rotate around the center
  ease: 'none',
});

// Design Section Slide-In Animation
gsap.from('.design .content', {
  opacity: 0,
  x: -150,
  duration: 1.5,
  delay: 1.5,
  ease: 'power3.out',
});

gsap.from('.design img', {
  opacity: 0,
  scale: 0.8,
  duration: 1.5,
  delay: 1.7,
  ease: 'power3.out',
});

// Face ID Section Slide-In Animation
gsap.from('.face-id .content', {
  opacity: 0,
  x: 200,
  duration: 1.5,
  delay: 2,
  ease: 'power3.out',
});

gsap.from('.face-id img', {
  opacity: 0,
  scale: 0.8,
  duration: 1.5,
  delay: 2.2,
  ease: 'power3.out',
});

// Power and Performance Section Animation
gsap.from('.power-performance .content', {
  opacity: 0,
  y: 100,
  duration: 1.5,
  delay: 2.5,
  ease: 'power3.out',
});

gsap.from('.power-performance img', {
  opacity: 0,
  scale: 0.8,
  duration: 1.5,
  delay: 2.7,
  ease: 'power3.out',
});

// Parallax Effect on Scroll for Each Section
gsap.to('.parallax-element', {
  scrollTrigger: {
    trigger: '.parallax-element',
    start: 'top bottom',
    end: 'bottom top',
    scrub: 1,  // Makes the effect synchronized with scrolling
  },
  y: '20%',  // Moves the element slightly as you scroll (parallax)
  ease: 'none',  // No easing to make it consistent with scroll
});


// Create the 3D rotation effect on the box
gsap.to(".box", {
  scrollTrigger: {
      trigger: ".hero",  
      start: "top top",   
      end: "bottom top",  
      scrub: 0.5,         
  },
  rotationX: 360,       // Rotate around X-axis (up-down)
  rotationY: 360,       // Rotate around Y-axis (left-right)
  ease: "none",         
});


