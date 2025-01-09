import * as THREE from "three";
import { MeshLine, MeshLineMaterial, MeshLineRaycast } from "three.meshline";
import {
  BloomEffect,
  EffectComposer,
  EffectPass,
  RenderPass,
} from "postprocessing";

const comets = [];
const cometLights = [];
const trails = [];
const numComets = 4;

export function createComets(scene, composer) {
  for (let i = 0; i < numComets; i++) {
    const cometGeometry = new THREE.SphereGeometry(0.5, 16, 16);
    const cometMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const comet = new THREE.Mesh(cometGeometry, cometMaterial);
    comet.position.set(
      Math.random() * 100 - 50,
      Math.random() * 100 - 20,
      Math.random() * 100 - 50
    );
    scene.add(comet);
    comets.push(comet);

    const cometLight = new THREE.PointLight(new THREE.Color("xffffff"), 2, 200);
    cometLight.position.copy(comet.position);
    scene.add(cometLight);
    cometLights.push(cometLight);

    const points = [];
    for (let j = 0; j < Math.PI; j += (2 * Math.PI) / 100) {
      points.push(new THREE.Vector3(Math.cos(j), Math.sin(j), 0));
    }
    const trailGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const trail = new MeshLine();
    trail.setGeometry(trailGeometry);
    const trailMaterial = new MeshLineMaterial({
      color: cometLight.color,
      lineWidth: 0.3,
      transparent: true,
      opacity: 0.5,
      resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
    });
    const trailMesh = new THREE.Mesh(trail.geometry, trailMaterial);
    trailMesh.raycast = MeshLineRaycast;
    scene.add(trailMesh);
    trails.push({ trail, trailGeometry, trailMesh });
  }

  const bloomEffect = new BloomEffect({
    blendFunction: THREE.AdditiveBlending,
    intensity: 3.0,
    distinction: 1.0,
  });
  const effectPass = new EffectPass(composer.camera, bloomEffect);
  composer.addPass(effectPass);
}

export function updateComets() {
  comets.forEach((comet, index) => {
    comet.position.x += 0.5;
    comet.position.y += 0.1 * Math.sin(comet.position.x * 0.1); // Slightly curved path
    comet.position.z += 0.5;
    cometLights[index].position.copy(comet.position);

    // Update trail
    const { trail, trailGeometry, trailMesh } = trails[index];
    const positions = trailGeometry.attributes.position.array;
    for (let i = positions.length - 3; i > 0; i -= 3) {
      positions[i] = positions[i - 3];
      positions[i + 1] = positions[i - 2];
      positions[i + 2] = positions[i - 1];
    }
    positions[0] = comet.position.x;
    positions[1] = comet.position.y;
    positions[2] = comet.position.z;
    trail.setPoints(positions);
    trailMesh.geometry.attributes.position.needsUpdate = true;

    // Reset comet position if it goes out of bounds
    if (
      comet.position.x > 100 ||
      comet.position.y < -100 ||
      comet.position.z > 100
    ) {
      comet.position.set(
        -50,
        Math.random() * 100 - 50,
        Math.random() * 100 - 50
      );

      for (let i = 0; i < positions.length; i += 3) {
        positions[i] = comet.position.x;
        positions[i + 1] = comet.position.y;
        positions[i + 2] = comet.position.z;
      }
      trail.setPoints(positions);
      trailMesh.geometry.attributes.position.needsUpdate = true;
    }
  });
}
