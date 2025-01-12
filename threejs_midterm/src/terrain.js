import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
const noise = new SimplexNoise();

const tileSize = 8000;
const numTiles = 3; // Number of tiles in each direction
let terrainTiles = [];
let heightMaps = [];

export async function createTerrainTile(heightMapUrl, size = 8000) {
  const geometry = new THREE.PlaneGeometry(size, size, 400, 400);

  // Load textures
  const textureLoader = new THREE.TextureLoader();
  const terrainTexture = textureLoader.load(
    "/assets/textures/sandy_gravel_02_diff_1k.jpg"
  );
  const displacementTexture = textureLoader.load(
    "/assets/textures/sandy_gravel_02_disp_1k.png"
  );

  // Set texture properties
  terrainTexture.wrapS = terrainTexture.wrapT = THREE.RepeatWrapping;
  displacementTexture.wrapS = displacementTexture.wrapT = THREE.RepeatWrapping;
  terrainTexture.repeat.set(100, 100);
  displacementTexture.repeat.set(100, 100);

  terrainTexture.offset.set(0.5, 0.5);
  displacementTexture.offset.set(0.5, 0.5);

  const material = new THREE.MeshStandardMaterial({
    map: terrainTexture,
    displacementMap: displacementTexture,
    displacementScale: 10,
    roughness: 0.8,
    metalness: 0.2,
  });
  const plane = new THREE.Mesh(geometry, material);
  plane.rotation.x = -Math.PI / 2;
  plane.position.y = -7;

  const heightMap = await loadHeightMap(heightMapUrl);
  const vertices = plane.geometry.attributes.position.array;

  for (let i = 0; i < vertices.length; i += 3) {
    const x = vertices[i];
    const y = vertices[i + 1];
    const z = vertices[i + 2];
    const height = getHeightFromMap(heightMap, x, y, size);
    const noiseValue = noise.noise2D(x / 100, y / 100) * 5;
    vertices[i + 2] = height * 10 + noiseValue;
  }
  plane.geometry.attributes.position.needsUpdate = true;
  plane.geometry.computeVertexNormals();
  return { plane, heightMap };
}

function loadHeightMap(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const context = canvas.getContext("2d");
      context.drawImage(img, 0, 0);
      const imageData = context.getImageData(0, 0, img.width, img.height);
      console.log("Loaded height map data:", imageData);
      resolve(imageData);
    };
    img.onerror = reject;
  });
}

function getHeightFromMap(heightMap, x, y, size) {
  const width = heightMap.width;
  const height = heightMap.height;
  const i = Math.floor(((x + size / 2) / size) * width);
  const j = Math.floor(((y + size / 2) / size) * height);
  const index = (j * width + i) * 4;
  const r = heightMap.data[index];
  const g = heightMap.data[index + 1];
  const b = heightMap.data[index + 2];
  return (r + g + b) / 3 / 255;
}

export async function createTerrainTiles(scene, heightMapUrl) {
  terrainTiles = [];
  heightMaps = [];

  for (let i = -Math.floor(numTiles / 2); i <= Math.floor(numTiles / 2); i++) {
    for (
      let j = -Math.floor(numTiles / 2);
      j <= Math.floor(numTiles / 2);
      j++
    ) {
      const { plane, heightMap } = await createTerrainTile(
        heightMapUrl,
        tileSize
      );
      plane.position.set(i * tileSize, -7, j * tileSize);
      terrainTiles.push(plane);
      heightMaps.push(heightMap);
      scene.add(plane);
    }
  }
  return { terrainTiles, heightMaps };
}

export function updateTerrainTiles(camera) {
  const cameraTileX = Math.floor(camera.position.x / tileSize);
  const cameraTileZ = Math.floor(camera.position.z / tileSize);

  for (let i = 0; i < terrainTiles.length; i++) {
    const tile = terrainTiles[i];
    const tileX = Math.floor(tile.position.x / tileSize);
    const tileZ = Math.floor(tile.position.z / tileSize);

    if (Math.abs(cameraTileX - tileX) > Math.floor(numTiles / 2)) {
      tile.position.x += Math.sign(cameraTileX - tileX) * tileSize * numTiles;
    }
    if (Math.abs(cameraTileZ - tileZ) > Math.floor(numTiles / 2)) {
      tile.position.z += Math.sign(cameraTileZ - tileZ) * tileSize * numTiles;
    }
  }
}

export async function loadCactusModel() {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(
      "/assets/cactus.glb",
      (gltf) => {
        resolve(gltf.scene);
      },
      undefined,
      (error) => {
        reject(error);
      }
    );
  });
}

export async function placeCactiOnTerrain(scene, numCacti = 500) {
  const cactusModel = await loadCactusModel();
  for (let i = 0; i < numCacti; i++) {
    const tileIndex = Math.floor(Math.random() * terrainTiles.length);
    const tile = terrainTiles[tileIndex];
    const heightMap = heightMaps[tileIndex];

    // Adjust the range of x and z values to be closer to the origin
    const xRange = tile.geometry.parameters.width / 4;
    const zRange = tile.geometry.parameters.height / 4;

    const x = Math.random() * xRange - xRange / 2;
    const z = Math.random() * zRange - zRange / 2;
    const y = getHeightFromMap(heightMap, x, z, tile.geometry.parameters.width);

    console.log(
      `Placing cactus at (${x + tile.position.x}, ${y}, ${z + tile.position.z})`
    );

    const cactus = cactusModel.clone();
    cactus.position.set(x + tile.position.x, y, z + tile.position.z);

    const scale = Math.random() * 0.2 + 0.1;
    cactus.scale.set(scale, scale, scale);

    cactus.rotation.y = Math.random() * Math.PI * 2;

    scene.add(cactus);
  }
}
