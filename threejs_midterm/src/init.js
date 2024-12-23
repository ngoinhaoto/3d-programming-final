import * as THREE from "three";
import { setupWinterScene } from "./scenes/winterScene";
// import { setupSpringScene } from "./scenes/springScene";
import { setupSummerScene } from "./scenes/summerScene";
// import { setupAutumnScene } from "./scenes/autumnScene";

export function init(scene, season) {
  let particles;
  switch (season) {
    case "winter":
      particles = setupWinterScene(scene);
      break;
    // case "spring":
    //   particles = setupSpringScene(scene);
    //   break;
    case "summer":
      particles = setupSummerScene(scene);
      break;
    // case "autumn":
    //   particles = setupAutumnScene(scene);
    //   break;
    default:
      console.error("Unknown season:", season);
  }
  return particles;
}
