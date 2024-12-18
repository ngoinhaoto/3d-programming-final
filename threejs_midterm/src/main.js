import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import {
  loadCarouselModel,
  loadMoonModel,
  loadChristmasTreeModel,
  loadChristmasGifts,
  loadLowPolyWinterScene,
  loadDeerModel,
  loadLogCabinModel,
} from "./loadAssets";
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x000036, 0, 300); // Add fog to simulate atmosphere
const noise = new SimplexNoise();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  800,
);
camera.position.set(0, 25, 100);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setClearColor(new THREE.Color(0x000036));
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;

function addLighting() {
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.75);
  scene.add(ambientLight);

  const hemisphereLight = new THREE.HemisphereLight(0x87ceeb, 0x000000, 0.5);
  scene.add(hemisphereLight);

  const warmLight = new THREE.DirectionalLight(0xffbb06, 50); // Warm orange light
  warmLight.position.set(0, 150, 0); // Position it above, simulating the sun or a strong light source
  warmLight.castShadow = true; // Enable shadow casting
  warmLight.shadow.camera.near = 0.1; // Near plane for the shadow camera
  warmLight.shadow.camera.far = 500; // Far plane for the shadow camera
  scene.add(warmLight);
}

const createGroundPlane = () => {
  const geometry = new THREE.PlaneGeometry(400, 400); // Create a large plane
  const material = new THREE.MeshStandardMaterial({
    color: 0xffffff, // White color for snow ground
    roughness: 1.0,
    metalness: 0.0,
  });
  const plane = new THREE.Mesh(geometry, material);

  plane.rotation.x = -Math.PI / 2; // Rotate the plane to lie flat
  plane.position.set(0, 0.5, 0); // Position it at the origin
  plane.receiveShadow = true; // Allow the plane to receive shadows
  scene.add(plane);
};

// === Snow Particles ===
const particleNum = 5000;
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

function animate() {
  requestAnimationFrame(animate);
  controls.update();

  if (spongebob) {
    if (moveForward) spongebob.position.z -= movementSpeed;
    if (moveBackward) spongebob.position.z += movementSpeed;
    if (moveLeft) spongebob.position.x -= movementSpeed;
    if (moveRight) spongebob.position.x += movementSpeed;

    const cameraOffset = new THREE.Vector3(0, 60, 70); // Adjust for desired view
    camera.position.copy(spongebob.position.clone().add(cameraOffset));
    camera.lookAt(spongebob.position);
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

let sound; // Global variable to store the sound instance
let isSoundReady = false; // Flag to indicate if the sound is preloaded

function preloadBackgroundMusic() {
  const listener = new THREE.AudioListener();
  camera.add(listener);

  sound = new THREE.Audio(listener);
  const audioLoader = new THREE.AudioLoader();

  // Preload the audio buffer
  audioLoader.load("/assets/music.mp3", (buffer) => {
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
  isPlaying = !isPlaying;
});

let spongebob;
function loadSpongebobModel() {
  const loader = new GLTFLoader();
  loader.load(
    "/assets/spongebob_squarepants_xmas/scene.gltf",
    (gltf) => {
      spongebob = gltf.scene;

      console.log(gltf);

      spongebob.scale.set(25, 25, 25);
      spongebob.position.set(10, -3, 10);
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

const movementSpeed = 0.5;
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;

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

function addMoonLighting() {
  const moonLight = new THREE.PointLight(0xaaaaaa, 1, 200); // Increase intensity
  moonLight.position.set(0, 200, -150); // Adjust position of moonlight
  scene.add(moonLight);
}

function init() {
  playBackgroundMusic();
  loadSpongebobModel();

  addLighting(); // Add enhanced lighting to the scene
  loadLowPolyWinterScene(scene); // Load the Low Poly Winter Scene
  createSnowParticles(); // Create snow particleds
  loadDeerModel(scene);
  loadMoonModel(scene); // Load the moon model
  loadCarouselModel(scene); // Load the carousel model
  addMoonLighting(); // Add moonlight
  createGroundPlane(); // Create the ground plane
  loadChristmasTreeModel(scene); // Load the Christmas tree model
  loadChristmasGifts(scene); // Load the Christmas gifts model
  loadLogCabinModel(scene);

  animate();
}

init();
