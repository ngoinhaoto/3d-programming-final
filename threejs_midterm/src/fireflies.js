import * as THREE from "three";
import {
  InstancedMesh,
  Matrix4,
  Vector3,
  PlaneGeometry,
  DynamicDrawUsage,
} from "three";
import { FireFlyMaterial } from "./helpers/FireFlyMaterial";

let fireflies = [];

export function createFireflies(scene, fireflyCount = 100) {
  const fireflyGeometry = new PlaneGeometry(0.4, 0.4); // Adjust the size of the firefly as desired
  const fireflyMaterial = new FireFlyMaterial({
    uTime: 0,
    uFireFlyRadius: 0.2,
    uColor: new THREE.Color(0xffff00),
  });

  const fireflyParticles = new InstancedMesh(
    fireflyGeometry,
    fireflyMaterial,
    fireflyCount
  );
  fireflyParticles.instanceMatrix.setUsage(DynamicDrawUsage);

  const position = new Vector3(); // Vector to hold position
  const matrix = new Matrix4(); // Matrix to transform each firefly

  for (let i = 0; i < fireflyCount; i++) {
    // Calculate a random position for each firefly
    position.set(
      Math.random() * 50 - 25,
      Math.random() * 10 + 5,
      Math.random() * 50 - 25
    );

    // Set the matrix position for the firefly
    matrix.setPosition(position);
    fireflyParticles.setMatrixAt(i, matrix);
  }

  fireflyParticles.renderOrder = 1; // Set render order to ensure proper layering
  fireflyParticles.instanceMatrix.needsUpdate = true; // Mark the instance matrix for update

  scene.add(fireflyParticles);
  fireflies.push(fireflyParticles);
}

export function updateFireflies(delta) {
  fireflies.forEach((fireflyParticles) => {
    fireflyParticles.material.uniforms.uTime.value += delta;

    // Update the instance matrix for each firefly
    const matrix = new Matrix4();
    const position = new Vector3();
    for (let i = 0; i < fireflyParticles.count; i++) {
      fireflyParticles.getMatrixAt(i, matrix);
      matrix.decompose(position, new THREE.Quaternion(), new THREE.Vector3());

      // Apply noise to the particle motion
      position.x += Math.sin(delta * 0.5 + i) * 0.01;
      position.y += Math.cos(delta * 0.5 + i) * 0.01;
      position.z += Math.sin(delta * 0.5 + i) * 0.01;

      matrix.setPosition(position);
      fireflyParticles.setMatrixAt(i, matrix);
    }
    fireflyParticles.instanceMatrix.needsUpdate = true;
  });
}
