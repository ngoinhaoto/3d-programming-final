import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { create3DText } from "../text3d.js";
import { Text } from "troika-three-text";
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
import {
  createSwampTiles,
  updateSwampTiles,
  placeTreeOnSwamp,
} from "../swamp.js";
import { createWaterSwamp, updateWaterSwamp } from "../waterSwamp.js";
import {
  loadOldBuildingModel,
  loadWindmill,
  sprinkleWoodenCabins,
  sprinkleAbandonedHouses,
  loadForestLoner,
  loadEndPortal,
  loadPropSwamp,
} from "../loadAssets/springAssets.js";
import { createWillOWisps, updateWillOWisps } from "../will_o_wisp.js";

let controls, composer, clouds, particles, water, portal;

export async function setupSpringScene(scene, camera, renderer) {
  showLoadingScreen();
  const loader = new THREE.CubeTextureLoader().setPath(
    "/assets/moonnight_green/",
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

  scene.fog = new THREE.Fog(0x000f04, 0, 1900);
  document.body.appendChild(renderer.domElement);

  camera.position.set(100, 100, 500);
  camera.near = 0.1;
  camera.far = 10000;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  preloadBackgroundMusic(camera, "/assets/haggstrom.mp3");
  preloadSoundEffect(camera, "/assets/swamp_sfx.mp3");

  controls = new PointerLockControls(camera, document.body);
  controls.pointerSpeed = 0.5;
  document.addEventListener("click", () => {
    controls.lock();
  });

  water = createWaterSwamp(scene, renderer);
  composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const { swampTiles, heightMaps } = await createSwampTiles(
    scene,
    "/assets/swamp_height_map.png",
  );
  await placeTreeOnSwamp(scene, 250);
  await Promise.all([
    loadOldBuildingModel(scene),
    loadWindmill(scene),
    sprinkleWoodenCabins(scene),
    sprinkleAbandonedHouses(scene),
    loadPropSwamp(scene),
    loadForestLoner(scene),
    loadEndPortal(scene).then((loadedPortal) => {
      portal = loadedPortal;
      scene.add(portal);
    }),
  ]);

  scene.add(controls.getObject());
  const light = createLensFlare();

  light.position.set(4000, 3200, -3000);
  scene.add(light);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xfffbb6, 5);
  directionalLight.position.set(5000, 2500, 0);
  directionalLight.castShadow = true;

  directionalLight.shadow.mapSize.width = 5000;
  directionalLight.shadow.mapSize.height = 5000;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 15000;

  createWillOWisps(scene, 120);

  const cloudTexture = new THREE.TextureLoader().load(CLOUD_URL);
  clouds = new Clouds({ texture: cloudTexture, frustumCulled: false });
  scene.add(clouds);

  const cloudPositions = [
    new THREE.Vector3(-700, 1000, -600),
    new THREE.Vector3(0, 1000, -600),
    new THREE.Vector3(800, 1000, -600),
  ];

  for (let i = 0; i < 3; i++) {
    const cloud = new Cloud({
      fade: 1,
      growth: 2.5,
      speed: 1,
      opacity: 1,
      color: new THREE.Color("#a9ff47"),
    });

    const newPosition = cloudPositions[i];
    cloud.position.copy(newPosition);

    cloud.scale.set(150, 120, 150);

    cloud.growth = Math.random() * 1 + 1;
    cloud.speed = Math.random() * 0.5 + 0.7;

    console.log("cloud texture", CLOUD_URL);
    clouds.add(cloud);
  }

  scene.add(directionalLight);

  const assets = [
    { position: new THREE.Vector3(450, 120, -250), color: 0xffa500 },
    { position: new THREE.Vector3(500, 100, -300), color: 0xffa500 },
    { position: new THREE.Vector3(600, 150, -350), color: 0xffa500 },
    { position: new THREE.Vector3(700, 200, -400), color: 0xffa500 },
    { position: new THREE.Vector3(800, 250, -450), color: 0xffa500 },
    { position: new THREE.Vector3(900, 300, -500), color: 0xffa500 },
  ];

  assets.forEach((asset) => {
    const pointLight = new THREE.PointLight(asset.color, 5, 600);
    pointLight.position.copy(asset.position);
    scene.add(pointLight);
  });

  create3DText({
    text: "Swamp Spring!",
    size: 90,
    fontUrl: "/assets/fonts/shadow.json",
    height: 1,
    bevelThickness: 9,
    bevelSize: 4,
    outlineThickness: 10,
    position: new THREE.Vector3(450, 900, -300),
    rotation: new THREE.Vector3(0, 0, 0),
    scene: scene,
  });

  create3DText({
    text: "The end is here!",
    size: 60,
    fontUrl: "/assets/fonts/shadow.json",
    height: 1,
    bevelThickness: 9,
    bevelSize: 4,
    outlineThickness: 10,
    position: new THREE.Vector3(-1400, 600, 1200),
    rotation: new THREE.Vector3(0, Math.PI / 2 + Math.PI / 6, 0),
    scene: scene,
  });

  hideLoadingScreen();
  return { controls, particles };
}

function checkCollisionWithPortal(camera, portal) {
  const cameraBox = new THREE.Box3().setFromCenterAndSize(
    camera.position,
    new THREE.Vector3(1, 1, 1),
  );

  if (!portal) {
    console.log("Portal is not defined");
    return false;
  }

  const portalBox = new THREE.Box3().setFromObject(portal);
  return cameraBox.intersectsBox(portalBox);
}

export function updateSpringScene(scene, clock, controls, camera, renderer) {
  const movementSpeed = 15;
  const delta = clock.getDelta();
  controls.update();

  const direction = new THREE.Vector3();
  camera.getWorldDirection(direction);
  direction.y = 0;
  direction.normalize();

  const right = new THREE.Vector3();
  right.crossVectors(camera.up, direction).normalize();
  if (clouds) {
    clouds.update(camera, clock.getElapsedTime(), delta);
  }

  if (moveForward) camera.position.addScaledVector(direction, movementSpeed);
  if (moveBackward) camera.position.addScaledVector(direction, -movementSpeed);
  if (moveLeft) camera.position.addScaledVector(right, movementSpeed);
  if (moveRight) camera.position.addScaledVector(right, -movementSpeed);
  if (moveUp) camera.position.y += movementSpeed;
  if (moveDown) camera.position.y -= movementSpeed;
  updateSwampTiles(camera);
  updateWaterSwamp(water, clock);
  updateWillOWisps(delta);

  if (portal) {
    if (checkCollisionWithPortal(camera, portal)) {
      console.log("COLLIDED WITH PORTAL");
      setTimeout(() => {
        window.location.href = "/end.html";
      }, 200);
    }
  }
  controls.update();
  renderer.render(scene, camera);
}
