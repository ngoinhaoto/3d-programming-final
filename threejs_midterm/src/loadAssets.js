import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { createFire } from "./fireEffect";

function loadCarouselModel(scene) {
  const loader = new GLTFLoader();
  loader.load(
    "/assets/christmas_carousel/scene.gltf", // Path to the carousel model
    (gltf) => {
      gltf.scene.scale.set(5, 5, 5); // Adjust size if needed
      gltf.scene.position.set(-100, -3, -10); // Position carousel at desired location

      gltf.scene.name = "carousel";

      scene.add(gltf.scene);

      console.log("Christmas carousel model loaded successfully!");
    },
    (xhr) => {
      console.log(`Loading progress: ${(xhr.loaded / xhr.total) * 100}%`);
    },
    (error) => {
      console.error("An error occurred while loading the GLTF file:", error);
    },
  );
}
function loadMoonModel(scene) {
  const loader = new GLTFLoader();
  loader.load(
    "/assets/our_moon/scene.gltf", // Path to the moon model
    (gltf) => {
      const moon = gltf.scene;
      moon.scale.set(5, 5, 5); // Adjust size if needed
      moon.position.set(0, 200, -200); // Position the moon in the scene

      // Apply the texture to the moon
      const textureLoader = new THREE.TextureLoader();
      const texture = textureLoader.load(
        "/assets/our_moon/textures/lroc_color_poles_16k_baseColor.jpeg",
      );
      moon.traverse((child) => {
        if (child.isMesh) {
          child.material.map = texture; // Apply texture to the moon surface
          child.material.emissive = new THREE.Color(0x888888); // Make the moon emit a soft, cool light
          child.material.emissiveIntensity = 0.3; // Adjust the intensity of the emissive light
          child.material.needsUpdate = true;
        }
      });

      // Add a directional light to simulate moonlight
      const moonLight = new THREE.DirectionalLight(0x8888ff, 0.5); // Soft, cool moonlight color and intensity
      moonLight.position.set(0, 200, -200); // Position the light above and behind the scene
      moonLight.target.position.set(0, 0, 0); // Point the light towards the center of the scene
      scene.add(moonLight);
      scene.add(moonLight.target);

      scene.add(moon);
      console.log("Moon model loaded successfully!");
    },
    (xhr) => {
      console.log(`Loading progress: ${(xhr.loaded / xhr.total) * 100}%`);
    },
    (error) => {
      console.error("An error occurred while loading the GLTF file:", error);
    },
  );
}

function loadSummerMoon(scene) {
  const loader = new GLTFLoader();
  loader.load(
    "/assets/our_moon/scene.gltf", // Path to the moon model
    (gltf) => {
      const moon = gltf.scene;
      moon.scale.set(8, 8, 8); // Adjust size if needed
      moon.position.set(0, 200, -200); // Position the moon in the scene

      const textureLoader = new THREE.TextureLoader();
      const texture = textureLoader.load(
        "/assets/our_moon/textures/lroc_color_poles_16k_baseColor.jpeg",
      );
      moon.traverse((child) => {
        if (child.isMesh) {
          child.material.map = texture;
          child.material.emissive = new THREE.Color(0x888888); // Make the moon emit a soft, cool light
          child.material.emissiveIntensity = 0.7; // Adjust the intensity of the emissive light
          child.material.needsUpdate = true;
        }
      });

      const moonLight = new THREE.DirectionalLight(0x8888ff, 0.1); // Soft, cool moonlight color and intensity
      moonLight.position.set(0, 200, -200);
      moonLight.target.position.set(0, 0, 0);
      scene.add(moonLight);
      scene.add(moonLight.target);

      scene.add(moon);
      console.log("Moon model loaded successfully!");
    },
    (xhr) => {
      console.log(`Loading progress: ${(xhr.loaded / xhr.total) * 100}%`);
    },
    (error) => {
      console.error("An error occurred while loading the GLTF file:", error);
    },
  );
}

function loadChristmasTreeModel(scene) {
  const loader = new GLTFLoader();
  loader.load(
    "/assets/christmas_tree/scene.gltf", // Path to the Christmas tree model
    (gltf) => {
      // Scale and position the Christmas tree model
      gltf.scene.scale.set(20, 20, 20); // Adjust the size of the tree
      gltf.scene.position.set(65, -35, -10); // Position the tree in the scene (adjust as needed)
      scene.add(gltf.scene);

      console.log("Christmas tree model loaded successfully!");
    },
    (xhr) => {
      console.log(`Loading progress: ${(xhr.loaded / xhr.total) * 100}%`);
    },
    (error) => {
      console.error("An error occurred while loading the GLTF file:", error);
    },
  );
}

function loadChristmasGifts(scene) {
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
    },
    (xhr) => {
      console.log(`Loading progress: ${(xhr.loaded / xhr.total) * 100}%`);
    },
    (error) => {
      console.error("An error occurred while loading the GLTF file:", error);
    },
  );
}

function loadLowPolyWinterScene(scene) {
  const loader = new GLTFLoader();
  loader.load(
    "/assets/low_poly_winter_scene/scene.gltf",
    (gltf) => {
      // Scale the model here to make it bigger
      gltf.scene.scale.set(5, 5, 5); // Scale factor for the model
      scene.add(gltf.scene);

      console.log("Low Poly Winter Scene loaded successfully!");
    },
    (xhr) => {
      console.log(`Loading progress: ${(xhr.loaded / xhr.total) * 100}%`);
    },
    (error) => {
      console.error("An error occurred while loading the GLTF file:", error);
    },
  );
}

function loadDeerModel(scene) {
  const loader = new GLTFLoader();
  loader.load(
    "/assets/christmas_deer/scene.gltf", // Path to the deer model
    (gltf) => {
      // Scale and position the deer model
      gltf.scene.scale.set(4, 4, 4); // Adjust size if needed
      gltf.scene.position.set(20, 0, 0); // Position the deer at desired location

      // Add a point light inside the deer to make it glow
      const deer = gltf.scene;
      scene.add(deer);
    },
    (xhr) => {
      console.log(`Loading progress: ${(xhr.loaded / xhr.total) * 100}%`);
    },
    (error) => {
      console.error("An error occurred while loading the GLTF file:", error);
    },
  );
}

function loadLogCabinModel(scene, callback) {
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

      // Call the callback function with the loaded cabin
      if (callback) {
        callback(gltf.scene);
      }
    },
    (xhr) => {
      console.log(`Loading progress: ${(xhr.loaded / xhr.total) * 100}%`);
    },
    (error) => {
      console.error("An error occurred while loading the GLTF file:", error);
    },
  );
}

function applyTexturesToCabin(cabin) {
  const textureLoader = new THREE.TextureLoader();

  // Example of applying textures from the provided list
  cabin.traverse((child) => {
    if (child.isMesh) {
      if (child.name === "logs" || child.name.includes("log")) {
        const baseColorTexture = textureLoader.load(
          "log_cabin_free_download/textures/Logs.001_baseColor.jpeg",
        );
        const normalTexture = textureLoader.load(
          "log_cabin_free_download/textures/Logs.001_normal.png",
        );
        const metallicRoughnessTexture = textureLoader.load(
          "log_cabin_free_download/textures/Logs.001_metallicRoughness.png",
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
          t,
        );
        child.material.emissive = emissiveColor;
      }
    });
  }
}
function loadBeachModel(scene) {
  const loader = new GLTFLoader();
  loader.load(
    "/assets/beach.glb", // Path to the beach model
    (gltf) => {
      // Scale and position the beach model
      gltf.scene.scale.set(1, 1, 1); // Adjust size if needed
      gltf.scene.position.set(0, 0, 0); // Position the beach at desired location

      const beach = gltf.scene;
      scene.add(beach);
    },
    (xhr) => {
      console.log(`Loading progress: ${(xhr.loaded / xhr.total) * 100}%`);
    },
    (error) => {
      console.error("An error occurred while loading the GLB file:", error);
    },
  );
}

function loadCampfireModel(scene) {
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
    },
    (xhr) => {
      console.log(`Loading progress: ${(xhr.loaded / xhr.total) * 100}%`);
    },
    (error) => {
      console.error("An error occurred while loading the GLB file:", error);
    },
  );
}

export {
  loadCampfireModel,
  loadBeachModel,
  loadCarouselModel,
  loadSummerMoon,
  loadMoonModel,
  loadChristmasTreeModel,
  loadChristmasGifts,
  loadLowPolyWinterScene,
  loadDeerModel,
  loadLogCabinModel,
  applyTexturesToCabin,
  updateGiftsEmissiveColor, // Export the new function
};
