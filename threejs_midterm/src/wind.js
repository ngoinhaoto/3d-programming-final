import * as THREE from "three";
import { MeshLine, MeshLineMaterial } from "three.meshline";

const windLines = [];
const maxWindLines = 100;
const windLineLength = 10;
const windSpeed = 0.1;

export function createWindEffect(scene) {
  for (let i = 0; i < maxWindLines; i++) {
    const positions = [];
    for (let j = 0; j < windLineLength; j++) {
      positions.push(j, 0, 0); // Start positions for wind lines, move in the X direction
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );

    const line = new MeshLine();
    line.setGeometry(geometry);

    const material = new MeshLineMaterial({
      color: new THREE.Color(0xffffff),
      lineWidth: 0.1,
      transparent: true,
      opacity: 1.0,
      resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
      sizeAttenuation: true,
    });

    const mesh = new THREE.Mesh(line.geometry, material);
    mesh.position.set(
      Math.random() * 200 - 100,
      Math.random() * 200 - 100,
      Math.random() * 200 - 100
    );

    scene.add(mesh);
    windLines.push({ mesh, material, trailGeometry: geometry, age: 0 });
  }
}

export function updateWindEffect(clock) {
  const delta = clock.getDelta(); // Get delta time between frames
  windLines.forEach((windLine, index) => {
    const { mesh, material, trailGeometry } = windLine;

    // Move the wind line forward
    mesh.position.x += windSpeed * delta;

    // Update the trail position: the trail follows the wind line's movement
    const positions = trailGeometry.attributes.position.array;
    for (let i = positions.length - 3; i > 0; i -= 3) {
      positions[i] = positions[i - 3];
      positions[i + 1] = positions[i - 2];
      positions[i + 2] = positions[i - 1];
    }
    positions[0] = mesh.position.x;
    positions[1] = mesh.position.y;
    positions[2] = mesh.position.z;

    // Update the mesh geometry with new positions
    trailGeometry.attributes.position.needsUpdate = true;

    // Fade out the wind line as it ages
    windLine.age += delta;
    material.opacity = Math.max(0, 1 - windLine.age / 5);

    // Reset the wind line if it has faded out completely
    if (material.opacity === 0) {
      mesh.position.set(
        Math.random() * 500 - 250,
        Math.random() * 500 - 250,
        Math.random() * 500 - 250
      );
      windLine.age = 0;
      material.opacity = 1.0;
    }
  });
}
