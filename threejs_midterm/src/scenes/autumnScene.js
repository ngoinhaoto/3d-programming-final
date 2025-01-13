import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import {
  showLoadingScreen,
  hideLoadingScreen,
} from "../customLoadingScreen.js";
import { create3DText } from "../text3d.js";
import {
  createTerrainTiles,
  updateTerrainTiles,
  placeCactiOnTerrain,
} from "../terrain.js";
import {
  loadFloatingIslandModel,
  loadPlanet,
} from "../loadAssets/autumnAssets.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { Clouds, Cloud, CLOUD_URL } from "@pmndrs/vanilla";
import { createSandParticles, updateSandParticles } from "../sandParticles.js"; // Import sand particles
import { light } from "../lensFlare.js";
import { createWindEffect, updateWindEffect } from "../wind.js";
import {
  moveForward,
  moveBackward,
  moveLeft,
  moveRight,
  moveUp,
  moveDown,
} from "../controls.js";
import { Text } from "troika-three-text";
let controls, composer, particles, clouds, sandParticles, windParticles;

export async function setupAutumnScene(scene, camera, renderer) {
  showLoadingScreen();
  const loader = new THREE.CubeTextureLoader();
  const skyboxTexture = loader.load([
    "/assets/nightskyemission.png",
    "/assets/nightskyemission.png",
    "/assets/nightskyemission.png",
    "/assets/nightskyemission.png",
    "/assets/nightskyemission.png",
    "/assets/nightskyemission.png",
  ]);
  scene.background = skyboxTexture;

  document.body.appendChild(renderer.domElement);

  scene.fog = new THREE.Fog(0x000000, 0, 1000);

  camera.position.set(0, 100, -30);

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  controls = new PointerLockControls(camera, document.body);
  scene.add(controls.getObject());

  light.position.set(50, 470, -400); // Adjust the position as needed
  scene.add(light);

  document.addEventListener("click", () => {
    controls.lock();
  });

  const ambientLight = new THREE.AmbientLight(0xffffff, 1.75); // Soft ambient light
  scene.add(ambientLight);

  const hemisphereLight = new THREE.HemisphereLight(0x87ceeb, 0x000000, 0.5); // Light from the sky and ground
  scene.add(hemisphereLight);

  composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));

  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.5, // Strength
    0.4, // Radius
    0.85, // Threshold
  );
  composer.addPass(bloomPass);

  // Create terrain tiles
  await createTerrainTiles(scene, "/assets/height_map.jpg");

  await placeCactiOnTerrain(scene);

  await Promise.all([loadFloatingIslandModel(scene), loadPlanet(scene)]);

  const cloudTexture = new THREE.TextureLoader().load(CLOUD_URL);
  clouds = new Clouds({ texture: cloudTexture, frustumCulled: false });
  scene.add(clouds);

  const cloudPositions = [
    new THREE.Vector3(-150, 175, -300),
    new THREE.Vector3(0, 175, -300),
    new THREE.Vector3(150, 175, -300),
  ];

  for (let i = 0; i < 3; i++) {
    const cloud = new Cloud({ fade: 1, growth: 1.5, speed: 1 });
    cloud.color.set("#ffffff");

    const newPosition = cloudPositions[i];
    cloud.position.copy(newPosition);

    cloud.scale.set(
      Math.random() * 10 + 25,
      Math.random() * 5 + 25,
      Math.random() * 10 + 25,
    );

    cloud.growth = Math.random() * 0.5 + 0.5;
    cloud.speed = Math.random() * 0.5 + 0.5;

    console.log("cloud texture", CLOUD_URL);
    clouds.add(cloud);
  }

  const myText = new Text();
  scene.add(myText);

  create3DText({
    text: "DESERT AUTUMN!",
    fontUrl: "/assets/fonts/melgrim.json",
    size: 20,
    height: 2,
    position: new THREE.Vector3(100, 120, -120),
    rotation: new THREE.Vector3(0, 0, 0),
    scene: scene,
  });

  const complexText = new Text();
  complexText.text = "Test Text";
  complexText.fontSize = 20;
  complexText.strokeWidth = 5;
  complexText.strokeColor = 0xff88;
  complexText.position.set(0, 100, 0);
  complexText.color = 0xff88ee;
  // complexText.curveRadius = 20;
  complexText.sync();
  scene.add(complexText);

  sandParticles = createSandParticles(scene); // Create sand particles

  hideLoadingScreen();

  return { controls, particles };
}

export function updateAutumnScene(scene, clock, controls, camera, renderer) {
  const movementSpeed = 0.5;
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
  if (clouds) {
    clouds.update(camera, clock.getElapsedTime(), clock.getDelta());
  }

  updateTerrainTiles(camera);

  if (sandParticles) {
    updateSandParticles(sandParticles); // Update sand particles
  }
  // if (windParticles) {
  //   console.log("UPDATING WIND PARTICLES ");
  //   updateWindEffect(clock);
  // }
  renderer.render(scene, camera);
}
