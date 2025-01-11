import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

let spongebob;
let spongebobDirection = new THREE.Vector3(
  (Math.random() - 0.5) * 2,
  0,
  (Math.random() - 0.5) * 2
).normalize();

export function loadSpongebobModel(scene) {
  const loader = new GLTFLoader();
  loader.load(
    "/assets/spongebob_squarepants_xmas/scene.gltf",
    (gltf) => {
      spongebob = gltf.scene;

      spongebob.scale.set(25, 25, 25);
      spongebob.position.set(10, -3, 10);
      scene.add(spongebob);
    },
    (xhr) => {
      console.log(`Loading progress: ${(xhr.loaded / xhr.total) * 100}%`);
    },
    (error) => {
      console.error("An error occurred while loading the GLTF file:", error);
    }
  );
}

export function moveSpongebobSporadically() {
  if (spongebob) {
    spongebob.position.addScaledVector(spongebobDirection, 0.1); // Adjust the movement speed

    if (Math.random() < 0.01) {
      spongebobDirection = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        0,
        (Math.random() - 0.5) * 2
      ).normalize();
    }

    const range = 50;
    if (spongebob.position.x > range || spongebob.position.x < -range) {
      spongebobDirection.x = -spongebobDirection.x;
    }
    if (spongebob.position.z > range || spongebob.position.z < -range) {
      spongebobDirection.z = -spongebobDirection.z;
    }
  }
}
