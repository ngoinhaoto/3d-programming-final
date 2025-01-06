import * as THREE from "three";

let soundEffect; // Global variable to store the sound effect instance
let isSoundEffectReady = false; // Flag to indicate if the sound effect is preloaded
let isSoundEffectPlaying = false;

export function preloadSoundEffect(camera, audioPath) {
  const listener = new THREE.AudioListener();
  camera.add(listener);

  soundEffect = new THREE.Audio(listener);
  const audioLoader = new THREE.AudioLoader();

  // Preload the audio buffer
  audioLoader.load(audioPath, (buffer) => {
    soundEffect.setBuffer(buffer);
    soundEffect.setLoop(true);
    soundEffect.setVolume(0.5);
    isSoundEffectReady = true; // Mark the sound effect as ready
    console.log("Sound effect preloaded!");
  });
}

export function toggleSoundEffect(button) {
  if (!isSoundEffectReady || !soundEffect) {
    console.error("Sound effect is not preloaded yet!");
    return;
  }

  if (isSoundEffectPlaying) {
    soundEffect.stop(); // Stop the sound effect
    button.textContent = "🔇"; // Change text to muted icon
  } else {
    soundEffect.play(); // Play the sound effect
    button.textContent = "🔊"; // Change text to sound icon
  }
  isSoundEffectPlaying = !isSoundEffectPlaying;
}

export function stopSoundEffect() {
  if (soundEffect && isSoundEffectPlaying) {
    soundEffect.stop();
    isSoundEffectPlaying = false;
    console.log("Sound effect stopped");
  }
}
