import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import {
  loadCarouselModel,
  loadMoonModel,
  loadSummerMoon,
  loadChristmasTreeModel,
  loadChristmasGifts,
  loadLowPolyWinterScene,
  loadDeerModel,
  loadLogCabinModel,
  updateGiftsEmissiveColor,
} from "../loadAssets.js";
import { createSnowParticles, updateSnowParticles } from "../snowParticles.js";
import { makeRoughGround, createGroundPlane } from "../snowGround.js";
import {
  preloadBackgroundMusic,
  stopBackgroundMusic,
} from "../backgroundMusic.js";

import { preloadSoundEffect, stopSoundEffect } from "../soundEffect.js";

import {
  moveForward,
  moveBackward,
  moveLeft,
  moveRight,
  moveUp,
  moveDown,
} from "../controls.js";
import { setupSummerScene, updateSummerScene } from "./summerScene";
import { Clouds, Cloud, CLOUD_URL } from "@pmndrs/vanilla";

import { create3DText } from "../text3d.js";

let particles;
let spongebob;
let controls;
let cabin;
let planeMesh;
let clouds;
let updateScene; // Declare updateScene as a global variable
const winterMovementSpeed = 0.5; // Define movement speed for winter scene

export function setupWinterScene(scene, camera, renderer, callback) {
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

  const ambientLight = new THREE.AmbientLight(0xffffff, 1.75); // Soft ambient light
  scene.add(ambientLight);

  const hemisphereLight = new THREE.HemisphereLight(0x87ceeb, 0x000000, 0.5); // Light from the sky and ground
  scene.add(hemisphereLight);

  preloadBackgroundMusic(camera, "/assets/winter_music.mp3");
  preloadSoundEffect(camera, "/assets/street.mp3");
  particles = createSnowParticles(scene);

  loadLowPolyWinterScene(scene);
  loadDeerModel(scene);
  loadMoonModel(scene, camera, renderer); // Pass camera and renderer to loadMoonModel
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

  create3DText({
    text: "Winter!",
    fontUrl: "/assets/fonts/lavish.json",
    size: 30,
    height: 2,
    position: new THREE.Vector3(-20, 90, -150),
    rotation: new THREE.Vector3(0, 0, 0),

    scene: scene,
  });
  create3DText({
    text: "Get in the cabin!",
    fontUrl: "https://threejs.org/examples/fonts/optimer_bold.typeface.json",
    size: 5,
    height: 2,
    color: 0xff0000,
    outlineColor: 0xffffff,
    outlineThickness: 0.2,
    position: new THREE.Vector3(140, 50, -20),
    rotation: new THREE.Euler(0, -Math.PI / 3.5, 0),
    scene: scene,
  });

  const cloudTexture = new THREE.TextureLoader().load(CLOUD_URL);
  clouds = new Clouds({ texture: cloudTexture, frustumCulled: false });
  scene.add(clouds);

  for (let i = 0; i < 5; i++) {
    const cloud = new Cloud({ fade: 1, growth: 1.5, speed: 1 });
    cloud.color.set("#ffffff");
    cloud.position.set(
      Math.random() * 300 - 300,
      Math.random() * 50 + 200,
      Math.random() * 300 - 300
    );
    cloud.scale.set(
      Math.random() * 10 + 20,
      Math.random() * 5 + 20,
      Math.random() * 10 + 20
    );
    cloud.growth = Math.random() * 0.5 + 0.5;
    cloud.speed = Math.random() * 0.5 + 0.5;

    console.log("cloud texture", CLOUD_URL);
    clouds.add(cloud);
  }

  return { controls, particles };
}

let spongebobDirection = new THREE.Vector3(
  (Math.random() - 0.5) * 2,
  0,
  (Math.random() - 0.5) * 2
).normalize();

function moveSpongebobSporadically() {
  if (spongebob) {
    spongebob.position.addScaledVector(spongebobDirection, 0.1); // Adjust the movement speed

    // Change direction randomly
    if (Math.random() < 0.01) {
      spongebobDirection = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        0,
        (Math.random() - 0.5) * 2
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

      spongebob.scale.set(25, 25, 25);
      spongebob.position.set(10, -3, 10);
      scene.add(spongebob);
    },
    (xhr) => {
      console.log(`Loading progress: ${(xhr.loaded / xhr.total) * 100}%`);
    },
    (error) => {
      console.error("An error occurred while loading the GLTF file:", error);
    }
  );
}

function checkCollisionWithCabin(camera, cabin) {
  const cameraBox = new THREE.Box3().setFromCenterAndSize(
    camera.position,
    new THREE.Vector3(1, 1, 1) // Adjust the size of the bounding box as needed
  );
  const cabinBox = new THREE.Box3().setFromObject(cabin);

  return cameraBox.intersectsBox(cabinBox);
}

export function switchToSummerScene(scene, camera, renderer) {
  stopBackgroundMusic();
  stopSoundEffect();
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

  if (planeMesh) {
    makeRoughGround(planeMesh);
  }

  // Update clouds
  clouds.update(camera, clock.getElapsedTime(), clock.getDelta());

  // Check for collision with the cabin
  if (cabin) {
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
