import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { create3DText } from "../text3d.js";
import {
  showLoadingScreen,
  hideLoadingScreen,
} from "../customLoadingScreen.js";
import { Clouds, Cloud, CLOUD_URL } from "@pmndrs/vanilla";
import { createLensFlare } from "../lensFlare.js";
import {
  moveForward,
  moveBackward,
  moveLeft,
  moveRight,
  moveUp,
  moveDown,
} from "../controls.js";
import { preloadBackgroundMusic } from "../backgroundMusic.js";
import { preloadSoundEffect } from "../soundEffect.js";
import { createSwampTiles, updateSwampTiles } from "../swamp.js";
import { createWaterSwamp, updateWaterSwamp } from "../waterSwamp.js";

let controls, composer, clouds, particles, water;

export async function setupSpringScene(scene, camera, renderer) {
  showLoadingScreen();
  const loader = new THREE.CubeTextureLoader().setPath(
    "/assets/moonnight_green/"
  );
  const skyboxTexture = loader.load([
    "px.png",
    "nx.png",
    "py.png",
    "ny.png",
    "pz.png",
    "nz.png",
  ]);
  scene.background = skyboxTexture;

  scene.fog = new THREE.Fog(0x000000, 0, 800);
  document.body.appendChild(renderer.domElement);

  camera.position.set(100, 100, 150);

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  preloadBackgroundMusic(camera, "/assets/desert_music_klf.mp3");
  preloadSoundEffect(camera, "/assets/desert_sfx.mp3");

  controls = new PointerLockControls(camera, document.body);
  controls.pointerSpeed = 0.5;

  scene.add(controls.getObject());
  const light = createLensFlare();

  light.position.set(50, 470, -400); // Adjust the position as needed
  scene.add(light);

  create3DText({
    text: "SPOOKY SPRING!",
    fontUrl: "/assets/fonts/shadow.json",
    size: 50,
    height: 1,

    position: new THREE.Vector3(100, 400, -120),
    rotation: new THREE.Vector3(0, 0, 0),
    scene: scene,
  });

  document.addEventListener("click", () => {
    controls.lock();
  });
  const ambientLight = new THREE.AmbientLight(0xffffff, 3);
  scene.add(ambientLight);

  composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const { swampTiles, heightMaps } = await createSwampTiles(
    scene,
    "/assets/swamp_height_map.png"
  );

  water = createWaterSwamp(scene, renderer);

  hideLoadingScreen();
  return { controls, particles };
}

export function updateSpringScene(scene, clock, controls, camera, renderer) {
  const movementSpeed = 1;
  const delta = clock.getDelta();
  controls.update();

  const direction = new THREE.Vector3();
  camera.getWorldDirection(direction);
  direction.y = 0;
  direction.normalize();

  const right = new THREE.Vector3();
  right.crossVectors(camera.up, direction).normalize();

  if (moveForward) camera.position.addScaledVector(direction, movementSpeed);
  if (moveBackward) camera.position.addScaledVector(direction, -movementSpeed);
  if (moveLeft) camera.position.addScaledVector(right, movementSpeed);
  if (moveRight) camera.position.addScaledVector(right, -movementSpeed);
  if (moveUp) camera.position.y += movementSpeed;
  if (moveDown) camera.position.y -= movementSpeed;
  updateSwampTiles(camera);
  updateWaterSwamp(water, clock);

  controls.update();
  renderer.render(scene, camera);
}
