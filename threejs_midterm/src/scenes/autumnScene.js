import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import {
  moveForward,
  moveBackward,
  moveLeft,
  moveRight,
  moveUp,
  moveDown,
} from "../controls.js";
import {
  showLoadingScreen,
  hideLoadingScreen,
} from "../customLoadingScreen.js";
import { create3DText } from "../text3d.js";
import {
  EffectComposer,
  RenderPass,
  EffectPass,
  BloomEffect,
} from "postprocessing";
import { createTerrainWithHeightMap } from "../terrain.js";
import {
  loadFloatingIslandModel,
  loadSun,
  loadMedievalBook,
} from "../loadAssets/autumnAssets.js";

let controls, composer, particles;

export async function setupAutumnScene(scene, camera, renderer) {
  showLoadingScreen();

  scene.fog = new THREE.Fog(0x87ceeb, 0, 1200); // Light blue fog

  camera.position.set(0, 3, 10);

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setClearColor(0x87ceeb); // Set the background color to light blue

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

  composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));

  // Load procedural terrain
  const terrain = await createTerrainWithHeightMap("/assets/height_map.jpg");
  scene.add(terrain);

  await Promise.all([
    loadFloatingIslandModel(scene),
    loadMedievalBook(scene),
    loadSun(scene),
  ]);

  // Load toy castle model

  const myText = new Text();
  scene.add(myText);

  create3DText({
    text: "Not Autumn!",
    fontUrl: "/assets/fonts/lavish.json",
    size: 25,
    height: 2,
    position: new THREE.Vector3(-20, 100, -150),
    rotation: new THREE.Vector3(0, 0, 0),
    scene: scene,
  });

  hideLoadingScreen();

  return { controls, particles };
}

export function updateAutumnScene(scene, clock, controls, camera) {
  const delta = clock.getDelta();
  controls.update();

  const direction = new THREE.Vector3();
  camera.getWorldDirection(direction);
  direction.y = 0;
  direction.normalize();

  const right = new THREE.Vector3();
  right.crossVectors(camera.up, direction).normalize();

  if (moveForward) camera.position.addScaledVector(direction, 0.1);
  if (moveBackward) camera.position.addScaledVector(direction, -0.1);
  if (moveLeft) camera.position.addScaledVector(right, 0.1);
  if (moveRight) camera.position.addScaledVector(right, -0.1);
  if (moveUp) camera.position.y += 0.1;
  if (moveDown) camera.position.y -= 0.1;

  composer.render(delta);
}
