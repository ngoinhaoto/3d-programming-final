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
} from "../controls.js";
import { setupSummerScene, updateSummerScene } from "./summerScene";

let particles;
let spongebob;
let controls;
let cabin;
let updateScene; // Declare updateScene as a global variable
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
  const cameraBox = new THREE.Box3().setFromCenterAndSize(
    camera.position,
    new THREE.Vector3(1, 1, 1), // Adjust the size of the bounding box as needed
  );
  const cabinBox = new THREE.Box3().setFromObject(cabin);

  console.log("Camera Box:", cameraBox);
  console.log("Cabin Box:", cabinBox);

  return cameraBox.intersectsBox(cabinBox);
}

export function switchToSummerScene(scene, camera, renderer) {
  scene.clear();
  renderer.clear();
  const { controls, particles } = setupSummerScene(scene, camera, renderer);
  window.season = "summer";
  window.updateScene = (scene, clock, controls, camera) =>
    updateSummerScene(scene, clock, controls, camera, renderer); // Set updateScene to updateSummerScene
}

export function updateWinterScene(scene, clock, controls, camera, renderer) {
  controls.update();

  const direction = new THREE.Vector3();
  camera.getWorldDirection(direction);
  direction.y = 0; // Ignore vertical movement for forward/backward
  direction.normalize();

  console.log("update winter scene");
  const right = new THREE.Vector3();
  right.crossVectors(camera.up, direction).normalize();

  if (moveForward)
    camera.position.addScaledVector(direction, winterMovementSpeed);
  if (moveBackward)
    camera.position.addScaledVector(direction, -winterMovementSpeed);
  if (moveLeft) camera.position.addScaledVector(right, winterMovementSpeed);
  if (moveRight) camera.position.addScaledVector(right, -winterMovementSpeed);
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

  // Check for collision with the cabin
  if (cabin) {
    console.log("Checking collision with cabin...");
    if (checkCollisionWithCabin(camera, cabin)) {
      console.log("COLLIDED WITH CABIN");
      // Stop updating the winter scene
      updateScene = () => {};
      // Switch to summer scene
      switchToSummerScene(scene, camera, renderer);
    }
  } else {
    console.log("Cabin is not defined");
  }
}
