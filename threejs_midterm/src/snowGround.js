import * as THREE from "three";

const noise = new SimplexNoise();

export const createGroundPlane = (scene) => {
  const geometry = new THREE.PlaneGeometry(10000, 10000, 100, 100);
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load("/assets/snow01.png");

  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(100, 100);

  const material = new THREE.MeshStandardMaterial({
    map: texture,
    roughness: 1.0,
    metalness: 0.0,
  });

  const plane = new THREE.Mesh(geometry, material);
  plane.rotation.x = -Math.PI / 2;
  plane.position.set(0, 0.5, 0);
  plane.receiveShadow = true;
  scene.add(plane);

  return plane;
};

export const makeRoughGround = (mesh) => {
  const time = Date.now();
  const positions = mesh.geometry.attributes.position.array; // Access position attribute

  for (let i = 0; i < positions.length; i += 3) {
    const x = positions[i];
    const y = positions[i + 1];

    // Generate noise based on the x and y values
    const noise1 =
      noise.noise2D(x * 0.01 + time * 0.0003, y * 0.01 + time * 0.0003) * 5;
    const noise2 =
      noise.noise2D(x * 0.02 + time * 0.00012, y * 0.02 + time * 0.00015) * 4;
    const noise3 =
      noise.noise2D(x * 0.009 + time * 0.00015, y * 0.012 + time * 0.00009) * 4;
    const distance = noise1 + noise2 + noise3;

    positions[i + 2] = distance;
  }

  mesh.geometry.attributes.position.needsUpdate = true;

  mesh.geometry.computeVertexNormals();
};
