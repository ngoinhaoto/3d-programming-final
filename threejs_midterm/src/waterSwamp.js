import * as THREE from "three";
import { Water } from "three/examples/jsm/objects/Water";

export function createWaterSwamp(scene, renderer) {
  const waterGeometry = new THREE.PlaneGeometry(8000, 8000);

  const water = new Water(waterGeometry, {
    textureWidth: 600,
    textureHeight: 600,
    waterNormals: new THREE.TextureLoader().load(
      "/assets/particles/waternormals.jpg",
      (texture) => {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      },
    ),
    sunDirection: new THREE.Vector3(0, 1, 0),
    sunColor: 0x063300, // Swampy green reflection
    waterColor: 0x063300, // Dark green for murkiness
    distortionScale: 3, // Lower distortion for a swampy look
    fog: true,
  });

  water.rotation.x = -Math.PI / 2;
  water.position.y = 3; // Set the initial water plane height
  scene.add(water);

  return water;
}

export function updateWaterSwamp(water, clock) {
  water.material.uniforms["time"].value += 1.0 / 60.0;

  const time = clock.getElapsedTime();
  water.position.y = 35 + Math.sin(time * 1) * 50 + Math.cos(time * 0.75) * 20;
}
