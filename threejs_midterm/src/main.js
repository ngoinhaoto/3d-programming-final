import * as THREE from "three";
import {
  updateWinterScene,
  setupWinterScene,
  switchToSummerScene,
} from "./scenes/winterScene"; // Import the switchToSummerScene function
import { updateSummerScene, setupSummerScene } from "./scenes/summerScene";
import { updateAutumnScene, setupAutumnScene } from "./scenes/autumnScene";
import { toggleMusic } from "./backgroundMusic";
import { toggleSoundEffect } from "./soundEffect";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();

window.season = "autumn";
let controls, particles;

async function initializeScene() {
  if (window.season === "winter") {
    ({ controls, particles } = await setupWinterScene(scene, camera, renderer));
    window.updateScene = (scene, clock, controls, camera) =>
      updateWinterScene(scene, clock, controls, camera, renderer);
  } else if (window.season === "summer") {
    ({ controls, particles } = await setupSummerScene(scene, camera, renderer));
    window.updateScene = (scene, clock, controls, camera) =>
      updateSummerScene(scene, clock, controls, camera, renderer);
  } else if (window.season === "autumn") {
    ({ controls, particles } = await setupAutumnScene(scene, camera, renderer));
    window.updateScene = (scene, clock, controls, camera) =>
      updateAutumnScene(scene, clock, controls, camera, renderer);
  }

  animate();
}

initializeScene();

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  if (window.updateScene) {
    window.updateScene(scene, clock, controls, camera);
  }
  renderer.render(scene, camera);
}

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

document
  .getElementById("toggleMusicButton")
  .addEventListener("click", function () {
    toggleMusic(this);
  });

document
  .getElementById("toggleSoundEffectButton")
  .addEventListener("click", function () {
    toggleSoundEffect(this);
  });
