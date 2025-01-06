import * as THREE from "three";

let sound; // Global variable to store the sound instance
let isSoundReady = false; // Flag to indicate if the sound is preloaded
let isPlaying = false;

export function preloadBackgroundMusic(camera, audioPath) {
  const listener = new THREE.AudioListener();
  camera.add(listener);

  sound = new THREE.Audio(listener);
  const audioLoader = new THREE.AudioLoader();

  // Preload the audio buffer
  audioLoader.load(audioPath, (buffer) => {
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
    button.textContent = "🔕"; // Change text to muted icon
  } else {
    sound.play(); // Play the music
    button.textContent = "🎵"; // Change text to music note
  }
  isPlaying = !isPlaying;
}

export function setMusicVolume(volume) {
  if (sound) {
    sound.setVolume(volume);
  }
}

export function stopBackgroundMusic() {
  if (sound && isPlaying) {
    sound.stop();
    isPlaying = false;
    console.log("Background music stopped");
  }
}
