import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// Create scene, camera, and renderer
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x000036, 0, 300); // Add fog to simulate atmosphere
const noise = new SimplexNoise();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  800,
);
camera.position.set(0, 25, 100); // Adjusted camera position (zoomed out further)

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setClearColor(new THREE.Color(0x000036)); // Set background color to dark blue (night sky)
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;

function addLighting() {
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.75); // Soft ambient light
  scene.add(ambientLight);

  // Optional: Hemisphere light for a bit of ambient lighting from the sky
  const hemisphereLight = new THREE.HemisphereLight(0x87ceeb, 0x000000, 0.5); // Light from the sky and ground
  scene.add(hemisphereLight);

  const warmLight = new THREE.DirectionalLight(0xffbb06, 50); // Warm orange light
  warmLight.position.set(0, 150, 0); // Position it above, simulating the sun or a strong light source
  warmLight.castShadow = true; // Enable shadow casting
  warmLight.shadow.camera.near = 0.1; // Near plane for the shadow camera
  warmLight.shadow.camera.far = 500; // Far plane for the shadow camera
  scene.add(warmLight);
}

// === Load Low Poly Winter Scene with Lights ===
function loadLowPolyWinterScene() {
  const loader = new GLTFLoader();
  loader.load(
    "low_poly_winter_scene/scene.gltf",
    (gltf) => {
      // Scale the model here to make it bigger
      gltf.scene.scale.set(5, 5, 5); // Scale factor for the model
      scene.add(gltf.scene);

      // Add lights to the house after loading it

      console.log("Low Poly Winter Scene loaded successfully!");
    },
    (xhr) => {
      console.log(`Loading progress: ${(xhr.loaded / xhr.total) * 100}%`);
    },
    (error) => {
      console.error("An error occurred while loading the GLTF file:", error);
    },
  );
}

// === Create Ground Plane ===
const createGroundPlane = () => {
  const geometry = new THREE.PlaneGeometry(400, 400); // Create a large plane
  const material = new THREE.MeshStandardMaterial({
    color: 0xffffff, // White color for snow ground
    roughness: 1.0,
    metalness: 0.0,
  });
  const plane = new THREE.Mesh(geometry, material);

  plane.rotation.x = -Math.PI / 2; // Rotate the plane to lie flat
  plane.position.set(0, 2, 0); // Position it at the origin
  plane.receiveShadow = true; // Allow the plane to receive shadows
  scene.add(plane);
};

function loadDeerModel() {
  const loader = new GLTFLoader();
  loader.load(
    "christmas_deer/scene.gltf", // Path to the deer model
    (gltf) => {
      // Scale and position the deer model
      gltf.scene.scale.set(4, 4, 4); // Adjust size if needed
      gltf.scene.position.set(20, 0, 0); // Position the deer at desired location

      // Add a point light inside the deer to make it glow
      const deer = gltf.scene;
      scene.add(deer);
    },
    (xhr) => {
      console.log(`Loading progress: ${(xhr.loaded / xhr.total) * 100}%`);
    },
    (error) => {
      console.error("An error occurred while loading the GLTF file:", error);
    },
  );
}

// === Snow Particles ===
const particleNum = 10000;
const maxRange = 300;
const minRange = maxRange / 2;
const textureSize = 64.0;

const getTexture = () => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const diameter = textureSize;
  canvas.width = diameter;
  canvas.height = diameter;
  const canvasRadius = diameter / 2;

  const gradient = ctx.createRadialGradient(
    canvasRadius,
    canvasRadius,
    0,
    canvasRadius,
    canvasRadius,
    canvasRadius,
  );
  gradient.addColorStop(0, "rgba(255,255,255,1.0)");
  gradient.addColorStop(0.5, "rgba(255,255,255,0.5)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const texture = new THREE.Texture(canvas);
  texture.type = THREE.FloatType;
  texture.needsUpdate = true;
  return texture;
};

let particles;

const createSnowParticles = () => {
  const pointGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleNum * 3);

  for (let i = 0; i < particleNum; i++) {
    const x = Math.floor(Math.random() * maxRange - minRange);
    const y = Math.floor(Math.random() * maxRange - minRange);
    const z = Math.floor(Math.random() * maxRange - minRange);

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
  }

  pointGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3),
  );

  const pointMaterial = new THREE.PointsMaterial({
    size: 1.5,
    color: 0xffffff,
    vertexColors: false,
    map: getTexture(),
    transparent: true,
    fog: true,
    depthWrite: false,
  });

  particles = new THREE.Points(pointGeometry, pointMaterial);
  scene.add(particles);
};

const makeRoughGround = (mesh) => {
  const time = Date.now();
  const positions = mesh.geometry.attributes.position.array;

  for (let i = 0; i < positions.length; i += 3) {
    const noise1 =
      noise.noise2D(
        positions[i] * 0.01 + time * 0.0001, // Slow snow rise
        positions[i + 1] * 0.01 + time * 0.0001, // Slow snow rise
      ) * 5;
    const noise2 =
      noise.noise2D(
        positions[i] * 0.02 + time * 0.00004, // Slow snow rise
        positions[i + 1] * 0.02 + time * 0.00006, // Slow snow rise
      ) * 4;
    const noise3 =
      noise.noise2D(
        positions[i] * 0.009 + time * 0.00006, // Slow snow rise
        positions[i + 1] * 0.012 + time * 0.00004, // Slow snow rise
      ) * 4;
    const distance = noise1 + noise2 + noise3;
    positions[i + 2] = distance; // Update the z position for roughness
  }

  mesh.geometry.attributes.position.needsUpdate = true;
};

const clock = new THREE.Clock(); // Create a clock to track time

// Array of colors for the emissive animation

function animate() {
  requestAnimationFrame(animate);
  controls.update();

  // Move Spongebob based on key presses
  if (spongebob) {
    if (moveForward) {
      spongebob.position.z -= movementSpeed;
    }
    if (moveBackward) {
      spongebob.position.z += movementSpeed;
    }
    if (moveLeft) {
      spongebob.position.x -= movementSpeed;
    }
    if (moveRight) {
      spongebob.position.x += movementSpeed;
    }
  }

  const gifts = scene.children.find((child) => child.name === "ChristmasGifts");
  if (gifts) {
    gifts.traverse((child) => {
      if (child.isMesh) {
        const time = clock.getElapsedTime(); // Get elapsed time
        const t = (Math.sin(time * 2) + 1) / 2; // Create a smooth oscillation between 0 and 1
        const emissiveColor = new THREE.Color().lerpColors(
          new THREE.Color(0xffc606), // Yellow
          new THREE.Color(0xff4500), // Orange-Red
          t,
        );
        child.material.emissive = emissiveColor;
      }
    });
  }

  // Update snow particles and other animations
  const posArr = particles.geometry.attributes.position.array;
  for (let i = 0; i < posArr.length; i += 3) {
    posArr[i + 1] -= 0.03;
    if (posArr[i + 1] < -minRange) {
      posArr[i + 1] = minRange;
    }
  }
  particles.geometry.attributes.position.needsUpdate = true;

  // Update ground roughness
  const planeMesh = scene.children.find((child) => child instanceof THREE.Mesh);
  if (planeMesh) {
    makeRoughGround(planeMesh);
  }

  renderer.render(scene, camera);
}

// === Resize Handling ===
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

function loadLogCabinModel() {
  const loader = new GLTFLoader();
  loader.load(
    "log_cabin_free_download/scene.gltf", // Path to the log cabin model
    (gltf) => {
      // Scale the model and add it to the scene
      gltf.scene.scale.set(5, 5, 5); // Adjust size if needed
      gltf.scene.position.set(80, 8, 0); // Position the cabin as needed
      scene.add(gltf.scene);

      // Optionally, you can apply textures here, for example:
      applyTexturesToCabin(gltf.scene);

      console.log("Log cabin model loaded successfully!");
    },
    (xhr) => {
      console.log(`Loading progress: ${(xhr.loaded / xhr.total) * 100}%`);
    },
    (error) => {
      console.error("An error occurred while loading the GLTF file:", error);
    },
  );
}

function applyTexturesToCabin(cabin) {
  const textureLoader = new THREE.TextureLoader();

  // Example of applying textures from the provided list
  cabin.traverse((child) => {
    if (child.isMesh) {
      if (child.name === "logs" || child.name.includes("log")) {
        const baseColorTexture = textureLoader.load(
          "log_cabin_free_download/textures/Logs.001_baseColor.jpeg",
        );
        const normalTexture = textureLoader.load(
          "log_cabin_free_download/textures/Logs.001_normal.png",
        );
        const metallicRoughnessTexture = textureLoader.load(
          "log_cabin_free_download/textures/Logs.001_metallicRoughness.png",
        );

        child.material.map = baseColorTexture;
        child.material.normalMap = normalTexture;
        child.material.roughnessMap = metallicRoughnessTexture;
      }
      // Similarly apply other textures for different parts
    }
  });
}

// === Initialization ===

function loadCarouselModel() {
  const loader = new GLTFLoader();
  loader.load(
    "christmas_carousel/scene.gltf", // Path to the carousel model
    (gltf) => {
      // Scale and position the carousel model
      gltf.scene.scale.set(5, 5, 5); // Adjust size if needed
      gltf.scene.position.set(-100, -3, -10); // Position carousel at desired location

      // Set a name for the carousel object
      gltf.scene.name = "carousel";

      scene.add(gltf.scene);

      console.log("Christmas carousel model loaded successfully!");
    },
    (xhr) => {
      console.log(`Loading progress: ${(xhr.loaded / xhr.total) * 100}%`);
    },
    (error) => {
      console.error("An error occurred while loading the GLTF file:", error);
    },
  );
}

function loadMoonModel() {
  const loader = new GLTFLoader();
  loader.load(
    "our_moon/scene.gltf", // Path to the moon model
    (gltf) => {
      // Scale and position the moon model
      gltf.scene.scale.set(5, 5, 5); // Adjust size if needed
      gltf.scene.position.set(0, 125, -125); // Position the moon in the scene

      // Apply the texture to the moon
      const textureLoader = new THREE.TextureLoader();
      const texture = textureLoader.load(
        "our_moon/textures/lroc_color_poles_16k_baseColor.jpeg",
      );
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          child.material.map = texture; // Apply texture to the moon surface
          child.material.needsUpdate = true;
        }
      });

      scene.add(gltf.scene);
      console.log("Moon model loaded successfully!");
    },
    (xhr) => {
      console.log(`Loading progress: ${(xhr.loaded / xhr.total) * 100}%`);
    },
    (error) => {
      console.error("An error occurred while loading the GLTF file:", error);
    },
  );
}

let sound; // Global variable to store the sound instance
let isSoundReady = false; // Flag to indicate if the sound is preloaded

function preloadBackgroundMusic() {
  const listener = new THREE.AudioListener();
  camera.add(listener);

  sound = new THREE.Audio(listener);
  const audioLoader = new THREE.AudioLoader();

  // Preload the audio buffer
  audioLoader.load("music.mp3", (buffer) => {
    sound.setBuffer(buffer);
    sound.setLoop(true);
    sound.setVolume(0.5);
    isSoundReady = true; // Mark the sound as ready
    console.log("Background music preloaded!");
  });
}

function playBackgroundMusic() {
  if (isSoundReady && sound) {
    sound.play(); // Play the preloaded sound
    console.log("Background music playing!");
  } else {
    console.error("Music is not preloaded yet!");
  }
}

preloadBackgroundMusic();

let isPlaying = false;

const musicButton = document.getElementById("toggleMusicButton");
musicButton.addEventListener("click", () => {
  if (isPlaying) {
    sound.stop(); // Stop the music
    musicButton.textContent = "Play Music 🎵"; // Update button text
  } else {
    sound.play(); // Play the music
    musicButton.textContent = "Stop Music 🔇"; // Update button text
  }
  isPlaying = !isPlaying; // Toggle the play state
});

function loadChristmasTreeModel() {
  const loader = new GLTFLoader();
  loader.load(
    "christmas_tree/scene.gltf", // Path to the Christmas tree model
    (gltf) => {
      // Scale and position the Christmas tree model
      gltf.scene.scale.set(20, 20, 20); // Adjust the size of the tree
      gltf.scene.position.set(65, -35, -10); // Position the tree in the scene (adjust as needed)
      scene.add(gltf.scene);

      console.log("Christmas tree model loaded successfully!");
    },
    (xhr) => {
      console.log(`Loading progress: ${(xhr.loaded / xhr.total) * 100}%`);
    },
    (error) => {
      console.error("An error occurred while loading the GLTF file:", error);
    },
  );
}

function addMoonLighting() {
  const moonLight = new THREE.PointLight(0xaaaaaa, 1, 200); // Increase intensity
  moonLight.position.set(0, 200, -150); // Adjust position of moonlight
  scene.add(moonLight);
}

function loadChristmasGifts() {
  const loader = new GLTFLoader();

  // Load the Christmas gifts GLTF model
  loader.load(
    "3december_-_gifts/scene.gltf", // Path to the GLTF file
    (gltf) => {
      // Scale the model here to make it bigger or adjust as needed
      gltf.scene.scale.set(0.25, 0.25, 0.25); // Scale factor for the model
      gltf.scene.position.set(0, 0, 80); // Position the model at the center or adjust as needed
      gltf.scene.name = "ChristmasGifts";

      // Make the gifts glow and emissive
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          // Apply emissive material to each mesh
          child.material.emissive = new THREE.Color(0xffc606); // Red emissive color (can change the color)
          child.material.emissiveIntensity = 0.5; // Set how intense the glow is
        }
      });

      scene.add(gltf.scene);
      console.log("Christmas gifts scene loaded successfully!");
    },
    (xhr) => {
      console.log(`Loading progress: ${(xhr.loaded / xhr.total) * 100}%`);
    },
    (error) => {
      console.error("An error occurred while loading the GLTF file:", error);
    },
  );
}

let spongebob;

function loadSpongebobModel() {
  const loader = new GLTFLoader();
  loader.load(
    "spongebob_squarepants_xmas/scene.gltf", // Path to your Spongebob Xmas GLTF model
    (gltf) => {
      // Store the model
      spongebob = gltf.scene;

      // Scale the model
      spongebob.scale.set(25, 25, 25); // Adjust scale as needed
      spongebob.position.set(10, -3, 10); // Set initial position
      scene.add(spongebob);

      console.log("Spongebob Xmas model loaded successfully!");
    },
    (xhr) => {
      console.log(`Loading progress: ${(xhr.loaded / xhr.total) * 100}%`);
    },
    (error) => {
      console.error("An error occurred while loading the GLTF file:", error);
    },
  );
}

const movementSpeed = 0.5; // Speed at which Spongebob moves
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;

// Listen for keydown events
document.addEventListener("keydown", (event) => {
  if (event.key === "w" || event.key === "W") {
    moveForward = true;
  }
  if (event.key === "s" || event.key === "S") {
    moveBackward = true;
  }
  if (event.key === "a" || event.key === "A") {
    moveLeft = true;
  }
  if (event.key === "d" || event.key === "D") {
    moveRight = true;
  }
});

// Listen for keyup events to stop movement
document.addEventListener("keyup", (event) => {
  if (event.key === "w" || event.key === "W") {
    moveForward = false;
  }
  if (event.key === "s" || event.key === "S") {
    moveBackward = false;
  }
  if (event.key === "a" || event.key === "A") {
    moveLeft = false;
  }
  if (event.key === "d" || event.key === "D") {
    moveRight = false;
  }
});

// Add the Spongebob model loading to your init function
function init() {
  playBackgroundMusic();

  addLighting(); // Add enhanced lighting to the scene
  loadLowPolyWinterScene(); // Load the Low Poly Winter Scene
  createSnowParticles(); // Create snow particleds
  loadDeerModel();
  loadMoonModel(); // Load the moon model
  loadCarouselModel(); // Load the carousel model
  addMoonLighting(); // Add moonlight
  createGroundPlane(); // Create the ground plane
  loadChristmasTreeModel(); // Load the Christmas tree model
  loadChristmasGifts(); // Load the Christmas gifts model
  loadLogCabinModel();

  loadSpongebobModel(); // Load Spongebob model
  animate();
}

init();
