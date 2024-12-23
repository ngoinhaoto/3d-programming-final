import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import {
  loadCarouselModel,
  loadMoonModel,
  loadChristmasTreeModel,
  loadChristmasGifts,
  loadLowPolyWinterScene,
  loadDeerModel,
  loadLogCabinModel,
  updateGiftsEmissiveColor,
} from "../loadAssets.js";
import { createSnowParticles, updateSnowParticles } from "../snowParticles.js";
import { makeRoughGround, createGroundPlane } from "../snowGround.js";
import { preloadBackgroundMusic } from "../backgroundMusic.js";
import {
  moveForward,
  moveBackward,
  moveLeft,
  moveRight,
  moveUp,
  moveDown,
  movementSpeed,
} from "../controls.js";
import { setupSummerScene, updateSummerScene } from "./summerScene";

let particles;
let spongebob;
let controls;
let cabin;
const winterMovementSpeed = 0.5; // Define movement speed for winter scene

export function setupWinterScene(scene, camera, renderer) {
  scene.fog = new THREE.Fog(0x000036, 0, 500); // Add fog to simulate atmosphere

  camera.position.set(0, 10, 30); // Adjust the initial camera position

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.setClearColor(new THREE.Color(0x000036));
  document.body.appendChild(renderer.domElement);

  controls = new PointerLockControls(camera, document.body);
  scene.add(controls.getObject());

  document.addEventListener("click", () => {
    controls.lock();
  });

  // Add lighting specific to the winter scene
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.75); // Soft ambient light
  scene.add(ambientLight);

  const hemisphereLight = new THREE.HemisphereLight(0x87ceeb, 0x000000, 0.5); // Light from the sky and ground
  scene.add(hemisphereLight);
  const warmLight = new THREE.DirectionalLight(0xffbb06, 50); // Warm orange light
  warmLight.position.set(0, 150, 0);
  warmLight.castShadow = true;
  warmLight.shadow.camera.near = 0.1;
  warmLight.shadow.camera.far = 500; // Far plane for the shadow camera
  scene.add(warmLight);

  preloadBackgroundMusic(camera); // Preload background music

  loadLowPolyWinterScene(scene);
  particles = createSnowParticles(scene);
  loadDeerModel(scene);
  loadMoonModel(scene);
  loadCarouselModel(scene);
  createGroundPlane(scene);
  loadChristmasTreeModel(scene);
  loadChristmasGifts(scene);
  loadLogCabinModel(scene, (loadedCabin) => {
    cabin = loadedCabin;
    scene.add(cabin);
    console.log("Cabin model loaded and added to the scene:", cabin);
  });

  loadSpongebobModel(scene);

  return { controls, particles };
}

let spongebobDirection = new THREE.Vector3(
  (Math.random() - 0.5) * 2,
  0,
  (Math.random() - 0.5) * 2,
).normalize();

function moveSpongebobSporadically() {
  if (spongebob) {
    spongebob.position.addScaledVector(spongebobDirection, 0.4); // Adjust the movement speed

    // Change direction randomly
    if (Math.random() < 0.01) {
      spongebobDirection = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        0,
        (Math.random() - 0.5) * 2,
      ).normalize();
    }

    // Keep SpongeBob within a certain range
    const range = 50;
    if (spongebob.position.x > range || spongebob.position.x < -range) {
      spongebobDirection.x = -spongebobDirection.x;
    }
    if (spongebob.position.z > range || spongebob.position.z < -range) {
      spongebobDirection.z = -spongebobDirection.z;
    }
  }
}

function loadSpongebobModel(scene) {
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

function checkCollisionWithCabin(camera, cabin) {
  const cameraBox = new THREE.Box3().setFromObject(camera);
  const cabinBox = new THREE.Box3().setFromObject(cabin);

  return cameraBox.intersectsBox(cabinBox);
}

function transitionToSummer(scene, camera, renderer) {
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "black";
  overlay.style.opacity = "0";
  overlay.style.transition = "opacity 1s";
  document.body.appendChild(overlay);

  overlay.style.opacity = "1";

  setTimeout(() => {
    scene.clear();
    ({ controls, particles } = setupSummerScene(scene, camera, renderer));
    updateScene = updateSummerScene;

    overlay.style.opacity = "0";
    setTimeout(() => {
      document.body.removeChild(overlay);
    }, 1000);
  }, 1000);
}

export function updateWinterScene(scene, clock, controls, camera) {
  controls.update();

  const direction = new THREE.Vector3();
  camera.getWorldDirection(direction);
  direction.y = 0; // Ignore vertical movement for forward/backward
  direction.normalize();

  const right = new THREE.Vector3();
  right.crossVectors(camera.up, direction).normalize();

  if (moveForward)
    camera.position.addScaledVector(direction, winterMovementSpeed);
  if (moveBackward)
    camera.position.addScaledVector(direction, -winterMovementSpeed);
  if (moveLeft) camera.position.addScaledVector(right, -winterMovementSpeed);
  if (moveRight) camera.position.addScaledVector(right, winterMovementSpeed);
  if (moveUp) camera.position.y += winterMovementSpeed;
  if (moveDown) camera.position.y -= winterMovementSpeed;

  moveSpongebobSporadically(); // Call the function to move SpongeBob continuously

  updateGiftsEmissiveColor(scene, clock);

  if (particles) {
    updateSnowParticles(particles);
  }

  const planeMesh = scene.children.find((child) => child instanceof THREE.Mesh);
  if (planeMesh) {
    makeRoughGround(planeMesh);
  }

  if (cabin) {
    console.log("Checking collision with cabin...");
    if (checkCollisionWithCabin(camera, cabin)) {
      console.log("COLLIDED WITH CABIN");
      transitionToSummer(scene, camera, renderer);
    }
  } else {
    console.log("Cabin is not defined");
  }
}
