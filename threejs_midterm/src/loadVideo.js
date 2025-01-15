import * as THREE from "three";
import { create3DText } from "./text3d";

export function loadVideoCube(scene) {
  const video = document.getElementById("video");
  video.muted = true;
  video.load();
  // video.play().catch((error) => {
  //   console.error("Error playing video:", error);
  // });

  video.pause();
  const videoTexture = new THREE.VideoTexture(video);
  videoTexture.minFilter = THREE.LinearFilter;
  videoTexture.magFilter = THREE.LinearFilter;
  videoTexture.format = THREE.RGBFormat;

  const movieMaterial = new THREE.MeshBasicMaterial({
    map: videoTexture,
    side: THREE.FrontSide,
    toneMapped: false,
  });

  const movieGeometry = new THREE.BoxGeometry(150, 150, 150);
  const movieCubeScreen = new THREE.Mesh(movieGeometry, movieMaterial);

  movieCubeScreen.position.set(-100, 80, -700);
  scene.add(movieCubeScreen);

  document.addEventListener("keydown", (event) => {
    switch (event.key) {
      case " ":
        if (video.paused) {
          video.play();
        } else {
          video.pause();
        }
        break;
      case "p":
        video.play();
        break;
      case "m":
        video.muted = !video.muted;
        break;
      case "i":
        video.pause();
        video.currentTime = 0;
        break;
      case "j":
        video.currentTime = Math.max(0, video.currentTime - 5); // Rewind 10 seconds
        break;
      case "r":
        video.currentTime = 0;
        video.play();
      case "l":
        video.currentTime = Math.max(0, video.currentTime + 5); // Rewind 10 seconds
        break;
      default:
        break;
    }
  });

  create3DText({
    text: "Controls: Space - Play/Pause\nP - Play, M - Mute/Unmute\nI - Stop, J - Rewind\nL - Fast Forward, R - Restart",
    fontUrl: "/assets/fonts/melgrim.json",
    size: 10,
    height: 1,
    color: 0xffffff,
    position: new THREE.Vector3(-100, 240, -700),
    rotation: new THREE.Vector3(0, 0, 0),
    scene: scene,
  });

  return { movieCubeScreen, videoTexture };
}
export function disposeVideo() {
  if (video) {
    video.pause();
    video.currentTime = 0;
    video.remove();
  }
}
