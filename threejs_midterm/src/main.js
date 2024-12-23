import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { preloadBackgroundMusic, toggleMusic } from "./backgroundMusic.js";
import {
  loadCarouselModel,
  loadMoonModel,
  loadChristmasTreeModel,
  loadChristmasGifts,
  loadLowPolyWinterScene,
  loadDeerModel,
  loadLogCabinModel,
  updateGiftsEmissiveColor,
} from "./loadAssets.js";
import {
  movementSpeed,
  moveForward,
  moveBackward,
  moveLeft,
  moveRight,
} from "./controls.js";

import { createSnowParticles, updateSnowParticles } from "./snowParticles.js";
import { makeRoughGround, createGroundPlane } from "./snowGround.js";

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x000036, 0, 500); // Add fog to simulate atmosphere

const camera = new THREE.PerspectiveCamera(
  85,
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

  const warmLight = new THREE.DirectionalLight(0xffbb06, 100); // Warm orange light
  warmLight.position.set(180, 150, 0);
  warmLight.castShadow = true;
  warmLight.shadow.camera.near = 0.1;
  warmLight.shadow.camera.far = 500;
  scene.add(warmLight);

  const moonLight = new THREE.PointLight(0xaaaaaa, 1, 200);
  moonLight.position.set(0, 200, -150);
  scene.add(moonLight);
}

let particles;

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  controls.update();

  if (spongebob) {
    if (moveForward) spongebob.position.z -= movementSpeed;
    if (moveBackward) spongebob.position.z += movementSpeed;
    if (moveLeft) spongebob.position.x -= movementSpeed;
    if (moveRight) spongebob.position.x += movementSpeed;

    const cameraOffset = new THREE.Vector3(0, 40, 100);
    camera.position.copy(spongebob.position.clone().add(cameraOffset));
    camera.lookAt(spongebob.position);
  }

  updateGiftsEmissiveColor(scene, clock);

  if (particles) {
    updateSnowParticles(particles);
  }

  const planeMesh = scene.children.find((child) => child instanceof THREE.Mesh);
  if (planeMesh) {
    makeRoughGround(planeMesh);
  }

  renderer.render(scene, camera);
}
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

const musicButton = document.getElementById("toggleMusicButton");
musicButton.addEventListener("click", () => toggleMusic(musicButton));

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

function init() {
  loadSpongebobModel();
  preloadBackgroundMusic(camera);
  addLighting();
  loadLowPolyWinterScene(scene);
  particles = createSnowParticles(scene);
  loadDeerModel(scene);
  loadMoonModel(scene);
  loadCarouselModel(scene);
  createGroundPlane(scene);
  loadChristmasTreeModel(scene);
  loadChristmasGifts(scene);
  loadLogCabinModel(scene);
  animate();
}

init();
