import { stopBackgroundMusic } from "../backgroundMusic";
import { setupSummerScene, updateSummerScene } from "./summerScene";
import { setupAutumnScene, updateAutumnScene } from "./autumnScene";
import { setupSpringScene, updateSpringScene } from "./springScene";
import { stopSoundEffect } from "../soundEffect";
export function switchToSummerScene(scene, camera, renderer) {
  stopBackgroundMusic();
  stopSoundEffect();
  scene.clear();
  renderer.clear();
  const { controls, particles } = setupSummerScene(scene, camera, renderer);
  window.season = "summer";
  window.updateScene = (scene, clock, controls, camera) =>
    updateSummerScene(scene, clock, controls, camera, renderer); // Set updateScene to updateSummerScene
}

export function switchToAutumnScene(scene, camera, renderer, composer) {
  stopBackgroundMusic();
  stopSoundEffect();
  scene.clear();
  renderer.clear();
  composer.dispose();

  console.log("Switching to autumn scene...");

  setupAutumnScene(scene, camera, renderer)
    .then(({ controls, particles }) => {
      window.season = "autumn";
      window.updateScene = (scene, clock, controls, camera) =>
        updateAutumnScene(scene, clock, controls, camera, renderer);

      console.log("Autumn scene setup complete.");
    })
    .catch((error) => {
      console.error("Error setting up autumn scene:", error);
    });
}

export function switchToSpringScene(scene, camera, renderer, composer) {
  stopBackgroundMusic();
  stopSoundEffect();
  scene.clear();
  renderer.clear();
  composer.dispose();

  console.log("Switching to spring scene...");

  setupSpringScene(scene, camera, renderer)
    .then(({ controls, particles }) => {
      window.season = "spring";
      window.updateScene = (scene, clock, controls, camera) =>
        updateSpringScene(scene, clock, controls, camera, renderer);

      console.log("spring scene setup complete.");
    })
    .catch((error) => {
      console.error("Error setting up spring scene:", error);
    });
}
