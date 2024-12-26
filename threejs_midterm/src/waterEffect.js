import * as THREE from "three";
import { Water } from "three/examples/jsm/objects/Water";

export function createWater(scene, renderer) {
  const waterGeometry = new THREE.PlaneGeometry(10000, 10000);

  const water = new Water(waterGeometry, {
    textureWidth: 600,
    textureHeight: 600,
    waterNormals: new THREE.TextureLoader().load(
      "/assets/waternormals.jpg",
      function (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      },
    ),
    sunDirection: new THREE.Vector3(),
    sunColor: 0xffffff,
    waterColor: 0x001e0f,
    distortionScale: 3.7,
    fog: scene.fog !== undefined,
  });

  water.rotation.x = -Math.PI / 2;
  water.position.y = 1; // Set the initial water plane height
  scene.add(water);

  return water;
}

export function updateWater(water, clock) {
  water.material.uniforms["time"].value += 1.0 / 60.0;

  // Add oscillation effect
  const time = clock.getElapsedTime();
  water.position.y = 1.45 + Math.sin(time * 0.5) * 0.5; // Adjust the amplitude and speed as needed
}
