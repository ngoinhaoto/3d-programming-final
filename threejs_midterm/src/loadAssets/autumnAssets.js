import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

function loadFloatingIslandModel(scene) {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(
      "/assets/floating_island_of_the_potion_brewer.glb",
      (gltf) => {
        gltf.scene.scale.set(0.1, 0.1, 0.1);
        gltf.scene.position.set(100, 20, -100);

        const floatingIsland = gltf.scene;
        scene.add(floatingIsland);

        console.log("Floating island model loaded successfully!");
        resolve();
      },
      (xhr) => {
        console.log(`Loading progress: ${(xhr.loaded / xhr.total) * 100}%`);
      },
      (error) => {
        console.error("An error occurred while loading the GLB file:", error);
        reject(error);
      }
    );
  });
}

function loadMedievalBook(scene) {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(
      "/assets/medieval_fantasy_book.glb",
      (gltf) => {
        gltf.scene.scale.set(1, 1, 1);
        gltf.scene.position.set(-50, 20, -50);

        const fantasyBook = gltf.scene;
        scene.add(fantasyBook);

        const mixer = new THREE.AnimationMixer(gltf.scene);
        gltf.animations.forEach((clip) => {
          mixer.clipAction(clip).play();
        });

        const clock = new THREE.Clock();
        function animate() {
          requestAnimationFrame(animate);
          const delta = clock.getDelta();
          mixer.update(delta);
        }
        animate();
        resolve();
      },
      (xhr) => {
        console.log(`Loading progress: ${(xhr.loaded / xhr.total) * 100}%`);
      },
      (error) => {
        console.error("An error occurred while loading the GLTF file:", error);
        reject(error);
      }
    );
  });
}
function loadSun(scene) {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(
      "/assets/sun1.glb",
      (gltf) => {
        gltf.scene.scale.set(3, 3, 3);
        gltf.scene.position.set(0, 300, -200);

        const sun = gltf.scene;
        scene.add(sun);

        console.log("Sun model loaded successfully!");

        const mixer = new THREE.AnimationMixer(gltf.scene);
        gltf.animations.forEach((clip) => {
          mixer.clipAction(clip).play();
        });

        const clock = new THREE.Clock();
        function animate() {
          requestAnimationFrame(animate);
          const delta = clock.getDelta();
          mixer.update(delta);
        }
        animate();
        resolve();
      },
      (xhr) => {
        console.log(`Loading progress: ${(xhr.loaded / xhr.total) * 100}%`);
      },
      (error) => {
        console.error("An error occurred while loading the GLB file:", error);
        reject(error);
      }
    );
  });
}

export { loadFloatingIslandModel, loadMedievalBook, loadSun };
