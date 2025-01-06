import * as THREE from "three";

const particleNum = 2000;
const maxRange = 300;
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
  gradient.addColorStop(0, "rgba(255,255,255,1.0)");
  gradient.addColorStop(0.5, "rgba(255,255,255,0.5)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const texture = new THREE.Texture(canvas);
  texture.type = THREE.FloatType;
  texture.needsUpdate = true;
  return texture;
};

// Function to create snow particles
const createSnowParticles = (scene) => {
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
    size: 1.5,
    color: 0xffffff,
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

// Function to update snow particles for animation
const updateSnowParticles = (particles) => {
  const posArr = particles.geometry.attributes.position.array;
  for (let i = 0; i < posArr.length; i += 3) {
    posArr[i + 1] -= 0.03;
    if (posArr[i + 1] < -minRange) {
      posArr[i + 1] = minRange;
    }
  }
  particles.geometry.attributes.position.needsUpdate = true;
};

export { createSnowParticles, updateSnowParticles };
