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
        resolve(gltf.scene);
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
function loadPlanet(scene) {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(
      "/assets/purple_planet.glb",
      (gltf) => {
        gltf.scene.scale.set(70, 70, 70);
        gltf.scene.position.set(0, 400, -400);
        gltf.scene.name = "purple_planet";

        gltf.scene.traverse((child) => {
          if (child.isMesh) {
            child.material.emissive = new THREE.Color(0x800080);
            child.material.emissiveIntensity = 5;

            // Set the bloom layer
            child.layers.enable(1); // Layer 1 for bloom
          }
        });
        scene.add(gltf.scene);

        console.log("purple_planet loaded successfully!");

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
        resolve(gltf.scene);
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

function loadPyramidModel(scene) {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(
      "/assets/pyramid.glb",
      (gltf) => {
        gltf.scene.scale.set(20, 20, 20);
        gltf.scene.position.set(500, -5, -100);

        const pyramid = gltf.scene;
        scene.add(pyramid);

        console.log("pyramid model loaded successfully!");
        resolve(gltf.scene);
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

function loadEgyptianPyramidModel(scene) {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(
      "/assets/egyptian_pyramid.glb",
      (gltf) => {
        gltf.scene.scale.set(100, 100, 100);
        gltf.scene.position.set(-100, -5, 200);

        const egyptian_pyramid = gltf.scene;
        scene.add(egyptian_pyramid);

        console.log("egyptian_pyramid model loaded successfully!");
        resolve(gltf.scene);
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

function loadDesertMesaModel(scene) {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(
      "/assets/desert_mesa.glb",
      (gltf) => {
        gltf.scene.scale.set(200, 200, 200);
        gltf.scene.position.set(-100, 60, -200);

        const desert_mesa = gltf.scene;
        scene.add(desert_mesa);

        console.log("desert_mesa model loaded successfully!");
        resolve(gltf.scene);
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

function loadSpringPortal(scene) {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(
      "/assets/the_well_spiders_portal.glb",
      (gltf) => {
        gltf.scene.scale.set(30, 30, 30);
        gltf.scene.position.set(-500, 8, -400);

        gltf.scene.name = "portal";

        scene.add(gltf.scene);

        console.log("Portal model loaded successfully!");

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
        resolve(gltf.scene);
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

export {
  loadFloatingIslandModel,
  loadPlanet,
  loadDesertMesaModel,
  loadEgyptianPyramidModel,
  loadPyramidModel,
  loadSpringPortal,
};
