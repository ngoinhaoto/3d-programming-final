import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import {
  loadBeachModel,
  loadCampfireModel,
  loadSummerMoon,
} from "../loadAssets.js";
import {
  moveForward,
  moveBackward,
  moveLeft,
  moveRight,
  moveUp,
  moveDown,
} from "../controls.js";
import { createWater, updateWater } from "../waterEffect";
import { updateFire } from "../fireEffect";
import {
  preloadBackgroundMusic,
  stopBackgroundMusic,
} from "../backgroundMusic";
import { preloadSoundEffect, stopSoundEffect } from "../soundEffect.js";
import { createComets, updateComets } from "../comet.js";
import {
  EffectComposer,
  RenderPass,
  EffectPass,
  BloomEffect,
} from "postprocessing";

let controls, water, fireLight, spotlight, moonDirectionalLight, composer;

export function setupSummerScene(scene, camera, renderer) {
  scene.fog = new THREE.Fog(0x000000, 0, 500); // Darker fog for a darker scene

  camera.position.set(0, 3, 10); // Adjust the initial camera position

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.enabled = true; // Enable shadow maps
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Soft shadow map

  const loader = new THREE.TextureLoader();
  const texture = loader.load("/assets/night_sky.png");
  const skyboxGeometry = new THREE.SphereGeometry(300, 60, 40); // Reduce size for larger details
  const skyboxMaterial = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.BackSide,
  });
  const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
  scene.add(skybox);

  document.body.appendChild(renderer.domElement);

  controls = new PointerLockControls(camera, document.body);
  scene.add(controls.getObject());

  document.addEventListener("click", () => {
    controls.lock();
  });

  // Add ambient light for overall illumination
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambientLight);

  // Add hemisphere light to simulate natural light from the sky and ground
  const hemisphereLight = new THREE.HemisphereLight(0x444444, 0x080820, 0.8); // Increase hemisphere light intensity
  scene.add(hemisphereLight);

  moonDirectionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
  moonDirectionalLight.position.set(0, 150, -200);
  moonDirectionalLight.target.position.set(0, 0, 0);
  moonDirectionalLight.castShadow = true;
  moonDirectionalLight.shadow.mapSize.width = 2048;
  moonDirectionalLight.shadow.mapSize.height = 2048;
  moonDirectionalLight.shadow.camera.near = 0.5;
  moonDirectionalLight.shadow.camera.far = 500;
  moonDirectionalLight.shadow.camera.left = -200;
  moonDirectionalLight.shadow.camera.right = 200;
  moonDirectionalLight.shadow.camera.top = 200;
  moonDirectionalLight.shadow.camera.bottom = -200;
  scene.add(moonDirectionalLight);
  scene.add(moonDirectionalLight.target);

  // Add spotlight to highlight specific areas
  spotlight = new THREE.SpotLight(0xffffff, 1.2); // Increase spotlight intensity
  spotlight.position.set(10, 20, 10); // Position the spotlight
  spotlight.angle = Math.PI / 6; // Set the spotlight angle
  spotlight.penumbra = 0.1; // Set the spotlight penumbra
  spotlight.decay = 2; // Set the spotlight decay
  spotlight.distance = 200; // Set the spotlight distance
  spotlight.castShadow = true; // Enable shadows
  scene.add(spotlight);

  loadBeachModel(scene); // Load the beach model

  // Add water effect
  water = createWater(scene, renderer);

  // Add campfire model
  loadCampfireModel(scene);

  // Add moon model
  loadSummerMoon(scene);

  fireLight = new THREE.PointLight(0xffaa00, 10, 100); // Warm light color, intensity, and distance
  fireLight.position.set(-1.5, 2.8, 8); // Initial position, will be updated in updateSummerScene
  scene.add(fireLight);

  preloadBackgroundMusic(camera, "/assets/sleep_walk.mp3");
  preloadSoundEffect(camera, "/assets/water.mp3");

  // Create post-processing composer
  composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));

  // Create comets
  createComets(scene, composer);

  return { controls, particles: null };
}

export function updateSummerScene(scene, clock, controls, camera) {
  const summerMovementSpeed = 0.1;
  console.log("update summer");
  controls.update();

  const direction = new THREE.Vector3();
  camera.getWorldDirection(direction);
  direction.y = 0; // Ignore vertical movement for forward/backward
  direction.normalize();

  const right = new THREE.Vector3();
  right.crossVectors(camera.up, direction).normalize();

  if (moveForward)
    camera.position.addScaledVector(direction, summerMovementSpeed);
  if (moveBackward)
    camera.position.addScaledVector(direction, -summerMovementSpeed);
  if (moveLeft) camera.position.addScaledVector(right, summerMovementSpeed);
  if (moveRight) camera.position.addScaledVector(right, -summerMovementSpeed);
  if (moveUp) camera.position.y += summerMovementSpeed;
  if (moveDown) camera.position.y -= summerMovementSpeed;

  const beach = scene.getObjectByName("beach");
  if (beach) {
    beach.rotation.y += 0.01;
  }

  // Update water effect
  updateWater(water, clock);

  // Update fire effect
  const campfire = scene.getObjectByName("CampFire");
  if (campfire && campfire.userData.fire) {
    updateFire(campfire.userData.fire);

    // Update fire light position to match the fire
    fireLight.position.copy(campfire.userData.fire.position);
  }

  // Update comets
  updateComets();

  // Render scene with post-processing
  composer.render();
}
