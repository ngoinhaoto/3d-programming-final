import * as THREE from "three";
import { Lensflare, LensflareElement } from "three/addons/objects/Lensflare.js";

// Point light and lens flare setup
const light = new THREE.PointLight(0xffffff, 4, 2000);

const textureLoader = new THREE.TextureLoader();
const textureFlare0 = textureLoader.load(
  "https://threejs.org/examples/textures/lensflare/lensflare0.png"
);
const textureFlare1 = textureLoader.load(
  "https://threejs.org/examples/textures/lensflare/lensflare2.png"
);
const textureFlare2 = textureLoader.load(
  "https://threejs.org/examples/textures/lensflare/lensflare3.png"
);

// Set the color to match the planet's emissive color
const flareColor = new THREE.Color(0xfee3ff); // Purple color

const lensflare = new Lensflare();
lensflare.addElement(new LensflareElement(textureFlare0, 512, 0, flareColor));
lensflare.addElement(new LensflareElement(textureFlare1, 512, 0, flareColor));
lensflare.addElement(new LensflareElement(textureFlare2, 80, 0.6, flareColor));

light.add(lensflare);
export { light };
