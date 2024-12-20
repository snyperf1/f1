// Set up the scene, camera, and renderer
let scene, camera, renderer;
let model;

init();
animate();

function init() {
    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xeeeeee);

    // Camera setup
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;  // Adjust the initial position of the camera

    // Renderer setup
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('model-container').appendChild(renderer.domElement);

    // Lighting setup
    const light = new THREE.AmbientLight(0x404040, 2); // Ambient light
    scene.add(light);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5).normalize();
    scene.add(directionalLight);

    // Load the 3D Model (Ensure path is correct)
    const loader = new THREE.GLTFLoader();
    loader.load('iphone_x.glb', function(gltf) {
        model = gltf.scene;

        // Position the model slightly forward to be within the camera's view
        model.position.set(0, 0, 0);  // Ensure it's positioned where the camera can see it
        scene.add(model);
        console.log('Model loaded successfully!');
    }, undefined, function(error) {
        console.error('Error loading the model:', error);
    });

    // OrbitControls for interactivity (zoom, rotate)
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;

    // Resize listener
    window.addEventListener('resize', onWindowResize, false);
}

function animate() {
    requestAnimationFrame(animate);

    // Scroll-based rotation
    const scrollPosition = window.scrollY;
    if (model) {
        model.rotation.z = scrollPosition * 0.005; // Adjust the scroll speed multiplier if needed
    }

    renderer.render(scene, camera);
}

// Resize event handling
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
