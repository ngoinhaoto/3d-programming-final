import * as THREE from "three";
const noise = new SimplexNoise();

export async function createTerrainWithHeightMap(heightMapUrl) {
  const geometry = new THREE.PlaneGeometry(1000, 1000, 100, 100);

  // Load textures
  const textureLoader = new THREE.TextureLoader();
  const terrainTexture = textureLoader.load(
    "/assets/textures/rocky_terrain_02_diff_1k.jpg"
  );
  const displacementTexture = textureLoader.load(
    "/assets/textures/rocky_terrain_02_disp_1k.png"
  );
  const specularTexture = textureLoader.load(
    "/assets/textures/rocky_terrain_02_spec_1k.png"
  );

  // Set texture properties
  terrainTexture.wrapS = terrainTexture.wrapT = THREE.RepeatWrapping;
  displacementTexture.wrapS = displacementTexture.wrapT = THREE.RepeatWrapping;
  specularTexture.wrapS = specularTexture.wrapT = THREE.RepeatWrapping;
  terrainTexture.repeat.set(50, 50);
  displacementTexture.repeat.set(50, 50);
  specularTexture.repeat.set(50, 50);

  // Apply tiling offset
  terrainTexture.offset.set(0.5, 0.5);
  displacementTexture.offset.set(0.5, 0.5);
  specularTexture.offset.set(0.5, 0.5);

  // Create material with texture
  const material = new THREE.MeshStandardMaterial({
    map: terrainTexture,
    displacementMap: displacementTexture,
    displacementScale: 10,
    roughnessMap: specularTexture,
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
    const height = getHeightFromMap(heightMap, x, y);
    const noiseValue = noise.noise2D(x / 100, y / 100) * 5; // Add noise to the height
    vertices[i + 2] = height * 10 + noiseValue; // Scale the height for flatter terrain and add noise
  }

  plane.geometry.attributes.position.needsUpdate = true;
  plane.geometry.computeVertexNormals();

  return plane;
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
      resolve(imageData);
    };
    img.onerror = reject;
  });
}

function getHeightFromMap(heightMap, x, y) {
  const width = heightMap.width;
  const height = heightMap.height;
  const i = Math.floor(((x + 500) / 1000) * width);
  const j = Math.floor(((y + 500) / 1000) * height);
  const index = (j * width + i) * 4;
  const r = heightMap.data[index];
  const g = heightMap.data[index + 1];
  const b = heightMap.data[index + 2];
  return (r + g + b) / 3 / 255; // Normalize the height value
}
