import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import {
  loadBeachModel,
  loadCampfireModel,
  loadSummerMoon,
  loadAutumnPortal,
} from "../loadAssets/summerAssets.js";
import {
  moveForward,
  moveBackward,
  moveLeft,
  moveRight,
  moveUp,
  moveDown,
} from "../controls.js";
import { createWater, updateWater } from "../waterEffect";
import { createFire, updateFire } from "../fireEffect";
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
import { createFireflies, updateFireflies } from "../fireflies.js";
import { create3DText } from "../text3d.js";
import {
  showLoadingScreen,
  hideLoadingScreen,
} from "../customLoadingScreen.js";
import { switchToAutumnScene } from "./sceneSwitcher.js";
let controls,
  water,
  fireLight,
  spotlight,
  moonDirectionalLight,
  composer,
  portal;

export async function setupSummerScene(scene, camera, renderer) {
  showLoadingScreen();

  scene.fog = new THREE.Fog(0x000000, 0, 1200);

  camera.position.set(0, 3, 10);

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const loader = new THREE.TextureLoader();
  const texture = loader.load("/assets/night_sky.png");
  const skyboxGeometry = new THREE.SphereGeometry(900, 900, 900);
  const skyboxMaterial = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.BackSide,
  });
  const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
  scene.add(skybox);

  document.body.appendChild(renderer.domElement);

  controls = new PointerLockControls(camera, document.body);
  controls.pointerSpeed = 0.5;

  scene.add(controls.getObject());

  document.addEventListener("click", () => {
    controls.lock();
  });

  createFireflies(scene);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambientLight);

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

  spotlight = new THREE.SpotLight(0xffffff, 1.2); // Increase spotlight intensity
  spotlight.position.set(10, 20, 10); // Position the spotlight
  spotlight.angle = Math.PI / 6; // Set the spotlight angle
  spotlight.penumbra = 0.1; // Set the spotlight penumbra
  spotlight.decay = 2; // Set the spotlight decay
  spotlight.distance = 200; // Set the spotlight distance
  spotlight.castShadow = true; // Enable shadows
  scene.add(spotlight);

  composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  water = createWater(scene, renderer);

  await Promise.all([
    loadBeachModel(scene),
    loadAutumnPortal(scene).then((loadedPortal) => {
      portal = loadedPortal;
      scene.add(portal);
      console.log("portal loaded and added to the scene:", portal);
    }),

    loadCampfireModel(scene),
    loadSummerMoon(scene, composer),
  ]);

  fireLight = new THREE.PointLight(0xffaa00, 10, 100);
  fireLight.position.set(-1.5, 2.8, 8);
  scene.add(fireLight);

  const myText = new Text();
  scene.add(myText);

  create3DText({
    text: "Pluto Summer!",
    fontUrl: "/assets/fonts/great_vibes.json",
    size: 15,
    height: 1,
    position: new THREE.Vector3(-100, 50, -30),
    rotation: new THREE.Vector3(0, Math.PI / 2, 0),
    material: new THREE.MeshNormalMaterial(),
    scene: scene,
  });

  preloadBackgroundMusic(camera, "/assets/sleep_walk.mp3");
  preloadSoundEffect(camera, "/assets/water.mp3");

  createComets(scene, composer);

  hideLoadingScreen();

  return { controls, particles: null };
}

function checkCollisionWithPortal(camera, portal) {
  const cameraBox = new THREE.Box3().setFromCenterAndSize(
    camera.position,
    new THREE.Vector3(1, 1, 1)
  );

  if (!portal) {
    console.log("Portal is not defined");
    return false;
  }

  const portalBox = new THREE.Box3().setFromObject(portal);
  return cameraBox.intersectsBox(portalBox);
}

export function updateSummerScene(scene, clock, controls, camera, renderer) {
  const summerMovementSpeed = 0.5;
  const delta = clock.getDelta();
  controls.update();

  const direction = new THREE.Vector3();
  camera.getWorldDirection(direction);
  direction.y = 0;
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

  if (water) {
    updateWater(water, clock);
  }

  const campfire = scene.getObjectByName("CampFire");
  if (campfire && campfire.userData.fire && fireLight) {
    updateFire(campfire.userData.fire);
    fireLight.position.copy(campfire.userData.fire.position);
  }

  updateFireflies(delta);
  updateComets(delta);

  if (scene.userData.mixers) {
    scene.userData.mixers.forEach((mixer) => {
      mixer.update(delta);
    });
  }

  if (portal) {
    if (checkCollisionWithPortal(camera, portal)) {
      console.log("COLLIDED WITH PORTAL");

      updateScene = () => {};
      switchToAutumnScene(scene, camera, renderer, composer);
    }
  }
  // composer.render(delta);
  renderer.render(scene, camera);
}
