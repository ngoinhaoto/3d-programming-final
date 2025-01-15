import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

function loadOldBuildingModel(scene) {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(
      "/assets/old_building.glb",
      (gltf) => {
        gltf.scene.scale.set(35, 35, 35);
        gltf.scene.position.set(1000, 25, -100);

        const oldBuilding = gltf.scene;
        scene.add(oldBuilding);

        console.log("oldBuilding model loaded successfully!");
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

function loadPropSwamp(scene) {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(
      "/assets/prop_swamp.glb",
      (gltf) => {
        gltf.scene.scale.set(1, 1, 1);
        gltf.scene.position.set(450, 120, -250);
        const propSwamp = gltf.scene;
        scene.add(propSwamp);

        console.log("prop_swamp model loaded successfully!");
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
function loadForestLoner(scene) {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(
      "/assets/house_for_panorama.glb",
      (gltf) => {
        gltf.scene.scale.set(150, 150, 150);
        gltf.scene.position.set(-400, 30, -1000);

        const forestLoner = gltf.scene;
        scene.add(forestLoner);

        console.log("forestLoner model loaded successfully!");
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

function sprinkleWoodenCabins(scene) {
  const positions = [
    [1000, 25, 800],
    [1800, 25, -200],
  ];

  const promises = positions.map((position, index) => {
    return new Promise((resolve, reject) => {
      const loader = new GLTFLoader();
      loader.load(
        "/assets/wooden_cabin.glb",
        (gltf) => {
          const scale = index % 2 === 0 ? 1 : 1.5;
          gltf.scene.scale.set(scale, scale, scale);

          const randomRotation = Math.random() * Math.PI * 3;
          gltf.scene.rotation.set(0, randomRotation, 0);

          gltf.scene.position.set(...position);

          const woodenCabin = gltf.scene;
          scene.add(woodenCabin);

          console.log("Wooden cabin model loaded successfully!");
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
  });

  return Promise.all(promises);
}

function sprinkleAbandonedHouses(scene) {
  const positions = [
    [-1500, 25, -100],
    [0, 25, 1500],
  ];

  const promises = positions.map((position, index) => {
    return new Promise((resolve, reject) => {
      const loader = new GLTFLoader();
      loader.load(
        "/assets/abandoned_house.glb",
        (gltf) => {
          const scale = index % 2 === 0 ? 50 : 80;
          gltf.scene.scale.set(scale, scale, scale);

          const randomRotation = Math.random() * Math.PI * 2;
          gltf.scene.rotation.set(0, randomRotation, 0);

          gltf.scene.position.set(...position);

          const abandonedHouse = gltf.scene;
          scene.add(abandonedHouse);

          console.log("abandoned house model loaded successfully!");
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
  });

  return Promise.all(promises);
}

function loadWindmill(scene) {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(
      "/assets/windmill_2k.glb",
      (gltf) => {
        gltf.scene.scale.set(8000, 8000, 8000);
        gltf.scene.position.set(750, 105, -500);
        gltf.scene.rotation.y = -Math.PI / 2;

        gltf.scene.name = "windmill_game_ready";

        scene.add(gltf.scene);

        console.log("windmill_game_ready loaded successfully!");

        const mixer = new THREE.AnimationMixer(gltf.scene);
        gltf.animations.forEach((clip) => {
          console.log("animating windmill");
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
function loadEndPortal(scene) {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(
      "/assets/isomatrix_glitch.glb",
      (gltf) => {
        gltf.scene.scale.set(250, 250, 250);
        gltf.scene.position.set(-1800, 500, 1400);
        gltf.scene.rotation.y = Math.PI / 6 + Math.PI / 2;

        gltf.scene.name = "isomatrix_glitch";
        gltf.scene.traverse((child) => {
          if (child.isMesh) {
            child.material.fog = false;
          }
        });

        scene.add(gltf.scene);

        console.log("isomatrix_glitch loaded successfully!");

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

        const pointLight = new THREE.PointLight(0xffffff, 100, 1000); // Color, intensity, distance
        pointLight.position.set(-1400, 800, 1000); // Adjust position as needed
        scene.add(pointLight);

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
  loadEndPortal,
  sprinkleWoodenCabins,
  loadOldBuildingModel,
  loadWindmill,
  sprinkleAbandonedHouses,
  loadPropSwamp,
  loadForestLoner,
};
