import * as THREE from "three";
import { MeshLine, MeshLineMaterial } from "three.meshline";

const windLines = [];
const maxWindLines = 50;
const windLineLength = 40;
const windSpeed = 70;

export function createWindEffect(scene) {
  for (let i = 0; i < maxWindLines; i++) {
    const positions = new Float32Array(windLineLength * 3);

    // Create a straight path for each wind line
    for (let j = 0; j < windLineLength; j++) {
      const x = j * 0.5; // Wind line spread
      positions[j * 3] = x; // X-coordinate
      positions[j * 3 + 1] = 0; // Y-coordinate (no variation)
      positions[j * 3 + 2] = 0; // Z-coordinate (no variation)
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const line = new MeshLine();
    line.setGeometry(geometry);

    const material = new MeshLineMaterial({
      color: new THREE.Color(0xffffff),
      lineWidth: 0.75,
      transparent: true,
      opacity: 1.0,
      resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
      sizeAttenuation: true,
    });

    const mesh = new THREE.Mesh(line.geometry, material);
    mesh.position.set(
      Math.random() * 200 - 200,
      Math.random() * 200 - 100,
      Math.random() * 200 - 100
    );

    scene.add(mesh);
    windLines.push({ mesh, material, trailGeometry: geometry, age: 0 });
  }

  return windLines;
}

export function updateWindEffect(clock) {
  const delta = clock.getDelta();
  const displacement = windSpeed * delta * 100;

  windLines.forEach((windLine) => {
    const { mesh, trailGeometry } = windLine;

    // Move mesh along the X-axis
    mesh.position.x += displacement;

    // Update the geometry (positions) of the wind line
    const positions = trailGeometry.attributes.position.array;

    // Shift all positions in the trail to make space for the new point
    for (let i = positions.length - 3; i >= 3; i -= 3) {
      positions[i] = positions[i - 3];
      positions[i + 1] = positions[i - 2];
      positions[i + 2] = positions[i - 1];
    }

    // Set the new position for the start of the line
    positions[0] = mesh.position.x;
    positions[1] = mesh.position.y;
    positions[2] = mesh.position.z;

    // Update the geometry to reflect the new positions
    trailGeometry.attributes.position.needsUpdate = true;

    // Reset position if the wind line goes too far
    if (mesh.position.x > 400) {
      mesh.position.set(
        Math.random() * 500 - 250,
        Math.random() * 200 - 100,
        Math.random() * 500 - 250
      );
    }
  });
}
