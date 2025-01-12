import * as THREE from "three";

const particleNum = 10000; // Increase the number of particles
const maxRange = 2000; // Adjust the range to cover the terrain
const minRange = maxRange / 2;
const textureSize = 64.0;

// Helper function to create a radial gradient texture
const getTexture = () => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const diameter = textureSize;
  canvas.width = diameter;
  canvas.height = diameter;
  const canvasRadius = diameter / 2;

  const gradient = ctx.createRadialGradient(
    canvasRadius,
    canvasRadius,
    0,
    canvasRadius,
    canvasRadius,
    canvasRadius
  );
  gradient.addColorStop(0, "rgba(210,180,140,1.0)"); // Sand color
  gradient.addColorStop(0.5, "rgba(210,180,140,0.5)");
  gradient.addColorStop(1, "rgba(210,180,140,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const texture = new THREE.Texture(canvas);
  texture.type = THREE.FloatType;
  texture.needsUpdate = true;
  return texture;
};

// Function to create sand particles
export const createSandParticles = (scene) => {
  const pointGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleNum * 3);

  for (let i = 0; i < particleNum; i++) {
    const x = Math.random() * maxRange - minRange;
    const y = Math.random() * maxRange - minRange;
    const z = Math.random() * maxRange - minRange;

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
  }

  pointGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );

  const pointMaterial = new THREE.PointsMaterial({
    size: 5, // Increase the size of the particles
    color: 0xd2b48c, // Sand color
    vertexColors: false,
    map: getTexture(),
    transparent: true,
    fog: true,
    depthWrite: false,
  });

  const particles = new THREE.Points(pointGeometry, pointMaterial);
  scene.add(particles);

  return particles;
};

// Function to update sand particles for animation
export const updateSandParticles = (particles) => {
  const posArr = particles.geometry.attributes.position.array;
  for (let i = 0; i < posArr.length; i += 3) {
    posArr[i + 1] -= 0.03; // Simulate falling
    posArr[i] += (Math.random() - 0.5) * 0.1; // Simulate wind in x direction
    posArr[i + 2] += (Math.random() - 0.5) * 0.1; // Simulate wind in z direction

    if (posArr[i + 1] < -10) {
      // Reset particle position to above the terrain
      posArr[i + 1] = minRange;
    }
  }
  particles.geometry.attributes.position.needsUpdate = true;
};
