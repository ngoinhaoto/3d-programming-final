import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { createFire } from "../fireEffect";
import {
  BloomEffect,
  EffectComposer,
  EffectPass,
  RenderPass,
} from "postprocessing";

function loadSummerMoon(scene, composer) {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(
      "/assets/rocket_orbiting_moon.glb", // Path to the new moon model
      (gltf) => {
        const moon = gltf.scene;
        moon.scale.set(0.4, 0.4, 0.4); // Adjust size if needed
        moon.position.set(0, 200, -300); // Position the moon in the scene

        // Add emissive material to the moon
        moon.traverse((child) => {
          if (child.isMesh) {
            child.material.emissive = new THREE.Color(0xffffff);
            child.material.emissiveIntensity = 20;
          }
        });

        scene.add(moon);
        console.log("Moon model loaded successfully!");

        const renderPass = new RenderPass(scene, composer.camera);
        const bloomEffect = new BloomEffect({
          intensity: 50, // Increase the intensity of the bloom effect
          luminanceThreshold: 0.1,
          luminanceSmoothing: 0.9,
        });
        const effectPass = new EffectPass(composer.camera, bloomEffect);
        composer.addPass(renderPass);
        composer.addPass(effectPass);

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
function loadBeachModel(scene) {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(
      "/assets/beach.glb", // Path to the beach model
      (gltf) => {
        // Scale and position the beach model
        gltf.scene.scale.set(1, 1, 1); // Adjust size if needed
        gltf.scene.position.set(0, 0, 0); // Position the beach at desired location

        const beach = gltf.scene;
        scene.add(beach);
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

function loadCampfireModel(scene) {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(
      "/assets/camp_fire.glb", // Path to the campfire model
      (gltf) => {
        // Scale and position the campfire model
        gltf.scene.scale.set(0.007, 0.007, 0.007); // Adjust size if needed
        gltf.scene.position.set(-1.5, 2.8, 8); // Position the campfire at desired location

        gltf.scene.name = "CampFire"; // Name the campfire model

        const campfire = gltf.scene;
        scene.add(campfire);

        // Add fire effect to the campfire
        const fire = createFire(scene, new THREE.Vector3(-1.6, 2.65, 8)); // Adjust position as needed
        campfire.userData.fire = fire;

        console.log("Campfire model loaded successfully!");
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
function loadAutumnPortal(scene) {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(
      "/assets/ancient_portal.glb",
      (gltf) => {
        gltf.scene.scale.set(0.1, 0.1, 0.1);
        gltf.scene.position.set(-100, 0, -100);
        gltf.scene.rotation.y = Math.PI / 3;

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

export { loadAutumnPortal, loadCampfireModel, loadBeachModel, loadSummerMoon };
