import * as THREE from "three";
import { Lensflare, LensflareElement } from "three/addons/objects/Lensflare.js";

export function createLensFlare(color) {
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

  const lensflare = new Lensflare();
  if (color) {
    const flareColor = new THREE.Color(color);
    lensflare.addElement(
      new LensflareElement(textureFlare0, 1024, 0, flareColor)
    );
  } else {
    lensflare.addElement(new LensflareElement(textureFlare0, 1024, 0));
  }
  lensflare.addElement(new LensflareElement(textureFlare1, 1024, 0));
  lensflare.addElement(new LensflareElement(textureFlare2, 160, 0.6));

  light.add(lensflare);
  return light;
}
