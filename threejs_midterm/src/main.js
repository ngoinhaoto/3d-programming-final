import * as THREE from "three";
import { init } from "./init";
import {
  updateWinterScene,
  setupWinterScene,
  switchToSummerScene,
} from "./scenes/winterScene"; // Import the switchToSummerScene function
import { updateSummerScene, setupSummerScene } from "./scenes/summerScene";
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

window.season = "summer"; // Change this to switch between seasons
let controls, particles;

if (window.season === "winter") {
  ({ controls, particles } = setupWinterScene(scene, camera, renderer));
  window.updateScene = (scene, clock, controls, camera) =>
    updateWinterScene(scene, clock, controls, camera, renderer);
} else if (window.season === "summer") {
  ({ controls, particles } = setupSummerScene(scene, camera, renderer));
  window.updateScene = (scene, clock, controls, camera) =>
    updateSummerScene(scene, clock, controls, camera, renderer);
}

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  window.updateScene(scene, clock, controls, camera);
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

animate();
