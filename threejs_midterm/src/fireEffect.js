import * as THREE from "three";

export function createFire(scene, position) {
  const fireTexture = new THREE.TextureLoader().load("/assets/burning.jpg");
  const fireMaterial = new THREE.PointsMaterial({
    map: fireTexture,
    size: 0.1,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    depthTest: true,
    vertexColors: true,
  });

  const fireCount = 2500; // Number of particles
  const fireGeometry = new THREE.BufferGeometry();
  const firePositions = new Float32Array(fireCount * 3);
  const fireVelocities = new Float32Array(fireCount);
  const fireHeights = new Float32Array(fireCount); // Add height thresholds
  const fireColors = new Float32Array(fireCount * 3); // Add colors

  for (let i = 0; i < fireCount; i++) {
    firePositions[i * 3] = (Math.random() - 0.5) * 0.6; // Increase horizontal spread
    firePositions[i * 3 + 1] = 0; // Start at ground level
    firePositions[i * 3 + 2] = (Math.random() - 0.5) * 0.6; // Increase horizontal spread
    fireVelocities[i] = Math.random() * 0.02 + 0.01; // Random speed for each fire particle
    fireHeights[i] = Math.random() * 1.0 + 0.2; // More random height threshold

    fireColors[i * 3] = 1.0; // Red
    fireColors[i * 3 + 1] = Math.random() * 0.5; // Green
    fireColors[i * 3 + 2] = 0.0; // Blue
  }

  fireGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(firePositions, 3)
  );
  fireGeometry.setAttribute(
    "velocity",
    new THREE.BufferAttribute(fireVelocities, 1)
  );
  fireGeometry.setAttribute(
    "height",
    new THREE.BufferAttribute(fireHeights, 1)
  );
  fireGeometry.setAttribute("color", new THREE.BufferAttribute(fireColors, 3));

  const fire = new THREE.Points(fireGeometry, fireMaterial);
  fire.position.set(position.x, position.y, position.z);
  scene.add(fire);

  return fire;
}

export function updateFire(fire) {
  const positions = fire.geometry.attributes.position.array;
  const velocities = fire.geometry.attributes.velocity.array;
  const heights = fire.geometry.attributes.height.array;

  for (let i = 0; i < positions.length; i += 3) {
    positions[i + 1] += velocities[i / 3];
    positions[i] += (Math.random() - 0.5) * 0.02; // Add more horizontal randomness
    positions[i + 2] += (Math.random() - 0.5) * 0.02; // Add more horizontal randomness

    if (positions[i + 1] > heights[i / 3]) {
      positions[i] = (Math.random() - 0.5) * 0.6; // Increase horizontal spread
      positions[i + 1] = 0; // Reset to ground level
      positions[i + 2] = (Math.random() - 0.5) * 0.6; // Increase horizontal spread
    }
  }
  fire.geometry.attributes.position.needsUpdate = true;
}
