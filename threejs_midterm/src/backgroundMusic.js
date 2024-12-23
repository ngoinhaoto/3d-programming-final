import * as THREE from "three";

let sound; // Global variable to store the sound instance
let isSoundReady = false; // Flag to indicate if the sound is preloaded
let isPlaying = false;

export function preloadBackgroundMusic(camera) {
  const listener = new THREE.AudioListener();
  camera.add(listener);

  sound = new THREE.Audio(listener);
  const audioLoader = new THREE.AudioLoader();

  // Preload the audio buffer
  audioLoader.load("/assets/music.mp3", (buffer) => {
    sound.setBuffer(buffer);
    sound.setLoop(true);
    sound.setVolume(0.5);
    isSoundReady = true; // Mark the sound as ready
    console.log("Background music preloaded!");
  });
}

export function toggleMusic(button) {
  if (!isSoundReady || !sound) {
    console.error("Music is not preloaded yet!");
    return;
  }

  if (isPlaying) {
    sound.stop(); // Stop the music
    button.textContent = "Play Music 🎵";
  } else {
    sound.play(); // Play the music
    button.textContent = "Pause Music ⏸️";
  }
  isPlaying = !isPlaying;
}
