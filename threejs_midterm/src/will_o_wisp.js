import * as THREE from "three";
import {
  InstancedMesh,
  Matrix4,
  Vector3,
  PlaneGeometry,
  DynamicDrawUsage,
} from "three";
import { WillOWispMaterial } from "./helpers/WillOWispMaterial";

let willOWisps = [];

export function createWillOWisps(scene, wispCount = 175) {
  console.log("Creating Will-o'-the-Wisps...");

  const wispGeometry = new PlaneGeometry(20, 20); // Adjust size of Will o' the Wisp

  const colorPalette = [
    new THREE.Color(0xff0000), // Red
    new THREE.Color(0xffa500), // Orange
    new THREE.Color(0xffff00), // Yellow
    new THREE.Color(0x00ff00), // Green
    new THREE.Color(0x0000ff), // Blue
    new THREE.Color(0x4b0082), // Indigo
    new THREE.Color(0xee82ee), // Violet
    new THREE.Color(0xff1493), // Deep Pink
    new THREE.Color(0x00ffff), // Cyan
  ];
  const wispMaterial = new WillOWispMaterial({
    uTime: 0,
    uGlowRadius: 0.3,
    uColor: new THREE.Color(0xffffff), // Default color; will be overridden
  });

  const wispParticles = new InstancedMesh(
    wispGeometry,
    wispMaterial,
    wispCount
  );
  wispParticles.instanceMatrix.setUsage(DynamicDrawUsage);

  const position = new Vector3(); // Vector to hold position
  const matrix = new Matrix4(); // Matrix to transform each wisp
  const colors = []; // Array to store colors for each wisp

  for (let i = 0; i < wispCount; i++) {
    // Set initial position with y > 50
    position.set(
      Math.random() * 2000 - 1000, // Random x position
      Math.random() * 200 + 120, // Random y position between 50 and 150
      Math.random() * 2000 - 1000 // Random z position
    );

    matrix.setPosition(position);
    wispParticles.setMatrixAt(i, matrix);

    // Assign a random color from the palette
    colors.push(colorPalette[Math.floor(Math.random() * colorPalette.length)]);
  }

  // Apply the colors to the wisps
  wispParticles.geometry.setAttribute(
    "color",
    new THREE.InstancedBufferAttribute(
      new Float32Array(colors.flatMap((c) => c.toArray())),
      3
    )
  );

  wispParticles.renderOrder = 1; // Set render order to ensure proper layering
  wispParticles.instanceMatrix.needsUpdate = true; // Mark the instance matrix for update

  scene.add(wispParticles);
  willOWisps.push(wispParticles);

  console.log("Will-o'-the-Wisps created and added to the scene.");
}

export function updateWillOWisps(delta) {
  const boundary = {
    x: 1500,
    yMax: 500, // Upper y boundary
    yMin: 25, // Lower y threshold for disappearance
    z: 2000,
  };

  willOWisps.forEach((wispParticles) => {
    wispParticles.material.uniforms.uTime.value += delta;

    const matrix = new Matrix4();
    const position = new Vector3();
    for (let i = 0; i < wispParticles.count; i++) {
      wispParticles.getMatrixAt(i, matrix);
      matrix.decompose(position, new THREE.Quaternion(), new THREE.Vector3());

      // Apply noise to simulate movement
      position.x += Math.sin(delta * 5 + i) * 0.5;
      position.y += Math.cos(delta * 5 + i) * 0.5;
      position.z += Math.sin(delta * 5 + i) * 0.5;

      // Reset position if y is outside the bounds
      if (position.y < boundary.yMin || position.y > boundary.yMax) {
        position.set(
          Math.random() * 2000 - 1000, // Random x position
          Math.random() * 100 + 50, // Reset y between 50 and 150
          Math.random() * 2000 - 1000 // Random z position
        );
      }

      matrix.setPosition(position);
      wispParticles.setMatrixAt(i, matrix);
    }
    wispParticles.instanceMatrix.needsUpdate = true;
  });
}
