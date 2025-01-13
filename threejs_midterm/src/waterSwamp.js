import * as THREE from "three";
import { Water } from "three/examples/jsm/objects/Water";

export function createWaterSwamp(scene, renderer) {
  const waterGeometry = new THREE.PlaneGeometry(10000, 10000);

  const water = new Water(waterGeometry, {
    textureWidth: 600,
    textureHeight: 600,
    waterNormals: new THREE.TextureLoader().load(
      "/assets/particles/waternormals.jpg",
      function (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      }
    ),
    sunDirection: new THREE.Vector3(),
    sunColor: 0x00ff00, // Greenish sun color
    waterColor: 0x001e0f,
    distortionScale: 3.7,
    fog: scene.fog !== undefined,
  });

  water.rotation.x = -Math.PI / 2;
  water.position.y = 3; // Set the initial water plane height
  scene.add(water);

  return water;
}

export function updateWaterSwamp(water, clock) {
  water.material.uniforms["time"].value += 1.0 / 60.0;

  const time = clock.getElapsedTime();
  water.position.y = 50 + Math.sin(time * 1) * 25 + Math.cos(time * 0.75) * 5;
}
