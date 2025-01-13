import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import {
  BloomEffect,
  EffectComposer,
  EffectPass,
  RenderPass,
} from "postprocessing";

function loadCarouselModel(scene) {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(
      "/assets/christmas_carousel.glb",
      (gltf) => {
        gltf.scene.scale.set(5, 5, 5);
        gltf.scene.position.set(-100, -3, -10);

        gltf.scene.name = "carousel";

        scene.add(gltf.scene);

        console.log("Christmas carousel model loaded successfully!");

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

function loadMoonModel(scene) {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(
      "/assets/moon.glb", // Path to the new moon model
      (gltf) => {
        const moon = gltf.scene;
        moon.scale.set(3, 3, 3);
        moon.position.set(0, 200, -200);

        moon.traverse((child) => {
          if (child.isMesh) {
            child.material.emissive = new THREE.Color(0xffffff);
            child.material.emissiveIntensity = 0.25;
          }
        });

        const moonLight = new THREE.DirectionalLight(0xffbb66, 25);
        moonLight.position.set(0, 200, -200);
        moonLight.target.position.set(0, 0, 0); // Point the light towards the center of the scene
        scene.add(moonLight);
        scene.add(moonLight.target);

        scene.add(moon);
        console.log("Moon model loaded successfully!");
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
function loadChristmasTreeModel(scene) {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(
      "/assets/christmas_tree/scene.gltf", // Path to the Christmas tree model
      (gltf) => {
        // Scale and position the Christmas tree model
        gltf.scene.scale.set(20, 20, 20); // Adjust the size of the tree
        gltf.scene.position.set(65, -35, -10); // Position the tree in the scene (adjust as needed)
        scene.add(gltf.scene);

        console.log("Christmas tree model loaded successfully!");
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

function loadChristmasGifts(scene) {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();

    loader.load(
      "/assets/3december_-_gifts/scene.gltf", // Path to the GLTF file
      (gltf) => {
        gltf.scene.scale.set(0.25, 0.25, 0.25); // Scale factor for the model
        gltf.scene.position.set(0, 0, 80); // Position the model at the center or adjust as needed
        gltf.scene.name = "ChristmasGifts";

        gltf.scene.traverse((child) => {
          if (child.isMesh) {
            // Apply emissive material to each mesh
            child.material.emissive = new THREE.Color(0xffc606); // Red emissive color (can change the color)
            child.material.emissiveIntensity = 0.5; // Set how intense the glow is
          }
        });

        scene.add(gltf.scene);
        console.log("Christmas gifts scene loaded successfully!");
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

function loadLowPolyWinterScene(scene) {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(
      "/assets/low_poly_winter_scene/scene.gltf",
      (gltf) => {
        // Scale the model here to make it bigger
        gltf.scene.scale.set(5, 5, 5); // Scale factor for the model
        scene.add(gltf.scene);

        console.log("Low Poly Winter Scene loaded successfully!");
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
function loadDeerModel(scene) {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(
      "/assets/christmas_deer/scene.gltf",
      (gltf) => {
        gltf.scene.scale.set(4, 4, 4);
        gltf.scene.position.set(20, 0, 0);

        const deer = gltf.scene;
        scene.add(deer);
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

function loadLogCabinModel(scene) {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(
      "/assets/log_cabin_free_download/scene.gltf", // Path to the log cabin model
      (gltf) => {
        // Scale the model and add it to the scene
        gltf.scene.scale.set(5, 5, 5); // Adjust size if needed
        gltf.scene.position.set(80, 8, 0); // Position the cabin as needed
        scene.add(gltf.scene);

        // Optionally, you can apply textures here, for example:
        applyTexturesToCabin(gltf.scene);

        console.log("Log cabin model loaded successfully!");
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
function applyTexturesToCabin(cabin) {
  const textureLoader = new THREE.TextureLoader();

  cabin.traverse((child) => {
    if (child.isMesh) {
      if (child.name === "logs" || child.name.includes("log")) {
        const baseColorTexture = textureLoader.load(
          "log_cabin_free_download/textures/Logs.001_baseColor.jpeg"
        );
        const normalTexture = textureLoader.load(
          "log_cabin_free_download/textures/Logs.001_normal.png"
        );
        const metallicRoughnessTexture = textureLoader.load(
          "log_cabin_free_download/textures/Logs.001_metallicRoughness.png"
        );

        child.material.map = baseColorTexture;
        child.material.normalMap = normalTexture;
        child.material.roughnessMap = metallicRoughnessTexture;
      }
    }
  });
}

function updateGiftsEmissiveColor(scene, clock) {
  const gifts = scene.children.find((child) => child.name === "ChristmasGifts");
  if (gifts) {
    gifts.traverse((child) => {
      if (child.isMesh) {
        const time = clock.getElapsedTime(); // Get elapsed time
        const t = (Math.sin(time * 2) + 1) / 2; // Create a smooth oscillation between 0 and 1
        const emissiveColor = new THREE.Color().lerpColors(
          new THREE.Color(0xffc606), // Yellow
          new THREE.Color(0xff4500), // Orange-Red
          t
        );
        child.material.emissive = emissiveColor;
      }
    });
  }
}
export {
  loadMoonModel,
  loadChristmasTreeModel,
  loadChristmasGifts,
  loadLowPolyWinterScene,
  loadDeerModel,
  loadLogCabinModel,
  updateGiftsEmissiveColor,
  loadCarouselModel,
};
