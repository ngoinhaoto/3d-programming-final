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
    const cometGeometry = new THREE.SphereGeometry(0.25, 16, 16);
    const randomColor = new THREE.Color(
      `hsl(${Math.random() * 360}, 100%, 75%)`
    );

    // Use MeshStandardMaterial with emissive property for glow effect
    const cometMaterial = new THREE.MeshStandardMaterial({
      color: randomColor,
      emissive: randomColor,
      emissiveIntensity: 1,
    });
    const comet = new THREE.Mesh(cometGeometry, cometMaterial);
    comet.position.set(
      Math.random() * 100 - 50,
      Math.random() * 100 - 20,
      Math.random() * 100 - 50
    );
    scene.add(comet);
    comets.push(comet);

    const cometLight = new THREE.PointLight(randomColor, 2, 200);
    cometLight.position.copy(comet.position);
    scene.add(cometLight);
    cometLights.push(cometLight);

    const points = [];
    const widths = [];
    for (let j = 0; j < 100; j++) {
      points.push(new THREE.Vector3(0, 0, 0));
      widths.push(1 - j / 100);
    }
    const trailGeometry = new THREE.BufferGeometry().setFromPoints(points);
    trailGeometry.setAttribute(
      "width",
      new THREE.Float32BufferAttribute(widths, 1)
    );
    const trail = new MeshLine();
    trail.setGeometry(trailGeometry);
    const trailMaterial = new MeshLineMaterial({
      color: randomColor,
      lineWidth: 0.3,
      transparent: true,
      opacity: 0.5,
      resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
      sizeAttenuation: true,
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

export function updateComets(delta) {
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
