import * as THREE from "three";
import { init } from "./init";
import { updateWinterScene, setupWinterScene } from "./scenes/winterScene"; // Import the setup and update functions for winter
import { updateSummerScene, setupSummerScene } from "./scenes/summerScene"; // Import the setup and update functions for summer
import { toggleMusic } from "./backgroundMusic"; // Import the toggleMusic function

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
const renderer = new THREE.WebGLRenderer();

const season = "winter"; // Change this to switch between seasons
let controls, particles, updateScene;

if (season === "winter") {
  ({ controls, particles } = setupWinterScene(scene, camera, renderer));
  updateScene = updateWinterScene;
} else if (season === "summer") {
  ({ controls, particles } = setupSummerScene(scene, camera, renderer));
  updateScene = updateSummerScene;
}

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  updateScene(scene, clock, controls, camera); // Call the appropriate update function
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

animate();
