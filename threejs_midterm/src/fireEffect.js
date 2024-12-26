import * as THREE from "three";

export function createFire(scene, position) {
  const fireTexture = new THREE.TextureLoader().load("/assets/flame.jpg");
  const fireMaterial = new THREE.PointsMaterial({
    map: fireTexture,
    color: 0xffaa00,
    size: 0.5,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    depthTest: false,
  });

  const fireCount = 500;
  const fireGeometry = new THREE.BufferGeometry();
  const firePositions = new Float32Array(fireCount * 3);
  const fireVelocities = new Float32Array(fireCount);

  for (let i = 0; i < fireCount; i++) {
    firePositions[i * 3] = (Math.random() - 0.5) * 2;
    firePositions[i * 3 + 1] = 0; // Start at ground level
    firePositions[i * 3 + 2] = (Math.random() - 0.5) * 2;
    fireVelocities[i] = Math.random() * 0.02 + 0.01; // Random speed for each fire particle
  }

  fireGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(firePositions, 3),
  );
  fireGeometry.setAttribute(
    "velocity",
    new THREE.BufferAttribute(fireVelocities, 1),
  );

  const fire = new THREE.Points(fireGeometry, fireMaterial);
  fire.position.set(position.x, position.y, position.z);
  scene.add(fire);

  return fire;
}

export function updateFire(fire) {
  const positions = fire.geometry.attributes.position.array;
  const velocities = fire.geometry.attributes.velocity.array;

  for (let i = 0; i < positions.length; i += 3) {
    positions[i + 1] += velocities[i / 3]; // Move fire particles up
    positions[i] += (Math.random() - 0.5) * 0.02; // Add some horizontal randomness
    positions[i + 2] += (Math.random() - 0.5) * 0.02; // Add some horizontal randomness

    if (positions[i + 1] > 2) {
      // Reset position if it goes too high
      positions[i] = (Math.random() - 0.5) * 2;
      positions[i + 1] = 0; // Reset to ground level
      positions[i + 2] = (Math.random() - 0.5) * 2;
    }
  }
  fire.geometry.attributes.position.needsUpdate = true;
}
