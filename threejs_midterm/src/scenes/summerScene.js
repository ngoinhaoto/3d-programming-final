import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import { loadBeachModel } from "../loadAssets.js";
import {
  moveForward,
  moveBackward,
  moveLeft,
  moveRight,
  moveUp,
  moveDown,
} from "../controls.js";

let controls;

export function setupSummerScene(scene, camera, renderer) {
  scene.fog = new THREE.Fog(0x87ceeb, 0, 500); // Add fog to simulate atmosphere

  camera.position.set(0, 3, 10); // Adjust the initial camera position

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.setClearColor(new THREE.Color(0x87ceeb));
  document.body.appendChild(renderer.domElement);

  controls = new PointerLockControls(camera, document.body);
  scene.add(controls.getObject());

  document.addEventListener("click", () => {
    controls.lock();
  });

  // Add lighting specific to the summer scene
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.75); // Soft ambient light
  scene.add(ambientLight);

  const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1); // Light from the sky and ground
  scene.add(hemisphereLight);

  loadBeachModel(scene); // Load the beach model

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
}
