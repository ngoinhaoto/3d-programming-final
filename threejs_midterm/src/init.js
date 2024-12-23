import { setupWinterScene } from "./scenes/winterScene";
import { setupSpringScene } from "./scenes/springScene";
import { setupSummerScene } from "./scenes/summerScene";
import { setupAutumnScene } from "./scenes/autumnScene";

function addLighting(scene) {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const hemisphereLight = new THREE.HemisphereLight(0x87ceeb, 0x000000, 0.5);
  scene.add(hemisphereLight);

  const warmLight = new THREE.DirectionalLight(0xffbb06, 100); // Warm orange light
  warmLight.position.set(180, 150, 0);
  warmLight.castShadow = true;
  warmLight.shadow.camera.near = 0.1;
  warmLight.shadow.camera.far = 500;
  scene.add(warmLight);

  const moonLight = new THREE.PointLight(0xaaaaaa, 1, 200);
  moonLight.position.set(0, 200, -150);
  scene.add(moonLight);
}

export function init(scene, season) {
  addLighting(scene);
  let particles;
  switch (season) {
    case "winter":
      particles = setupWinterScene(scene);
      break;
    case "spring":
      particles = setupSpringScene(scene);
      break;
    case "summer":
      particles = setupSummerScene(scene);
      break;
    case "autumn":
      particles = setupAutumnScene(scene);
      break;
    default:
      console.error("Unknown season:", season);
  }
  return particles;
}
