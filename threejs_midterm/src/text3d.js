import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";

export function create3DText({
  text = "Hello world!",
  fontUrl = "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
  size = 1,
  height = 0.2,
  curveSegments = 6,
  bevelEnabled = true,
  bevelThickness = 0.03,
  bevelSize = 0.02,
  bevelOffset = 0,
  bevelSegments = 4,
  position = new THREE.Vector3(0, 0, 0),
  rotation = new THREE.Vector3(0, 0, 0),
  color = null, // Use MeshNormalMaterial if null
  specularColor = 0xaaaaaa,
  shininess = 200,
  outlineColor = 0x000000,
  outlineThickness = 0.05,
  bumpMap = null, // Optional bump map texture for surface detail
  bumpScale = 0.02,
  envMap = null, // Optional environment map for reflection
  scene,
}) {
  const fontLoader = new FontLoader();

  fontLoader.load(fontUrl, (font) => {
    const textGeometry = new TextGeometry(text, {
      font: font,
      size: size,
      height: height,
      curveSegments: curveSegments,
      bevelEnabled: bevelEnabled,
      bevelThickness: bevelThickness,
      bevelSize: bevelSize,
      bevelOffset: bevelOffset,
      bevelSegments: bevelSegments,
    });

    textGeometry.center();

    // Choose material based on whether color is provided
    const textMaterial = color
      ? new THREE.MeshPhongMaterial({
          color: color,
          specular: specularColor,
          shininess: shininess,
          bumpMap: bumpMap,
          bumpScale: bumpScale,
          envMap: envMap,
          reflectivity: envMap ? 0.5 : 0,
        })
      : new THREE.MeshNormalMaterial(); // Fallback material

    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.copy(position);
    textMesh.rotation.set(rotation.x, rotation.y, rotation.z);
    scene.add(textMesh);

    // Create the outline
    if (color) {
      const outlineGeometry = new TextGeometry(text, {
        font: font,
        size: size,
        height: height,
        curveSegments: curveSegments,
        bevelEnabled: bevelEnabled,
        bevelThickness: bevelThickness,
        bevelSize: bevelSize + outlineThickness,
        bevelOffset: bevelOffset,
        bevelSegments: bevelSegments,
      });

      outlineGeometry.center();

      const outlineMaterial = new THREE.MeshPhongMaterial({
        color: outlineColor,
        specular: specularColor,
        shininess: shininess,
        bumpMap: bumpMap,
        bumpScale: bumpScale,
        side: THREE.BackSide,
      });

      const outlineMesh = new THREE.Mesh(outlineGeometry, outlineMaterial);
      outlineMesh.position.copy(position);
      outlineMesh.rotation.set(rotation.x, rotation.y, rotation.z);
      scene.add(outlineMesh);
    }
  });
}
