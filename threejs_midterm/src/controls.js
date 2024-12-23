export const movementSpeed = 0.5;
export let moveForward = false;
export let moveBackward = false;
export let moveLeft = false;
export let moveRight = false;
export let moveUp = false;
export let moveDown = false;

document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "w":
    case "W":
      moveForward = true;
      break;
    case "s":
    case "S":
      moveBackward = true;
      break;
    case "a":
    case "A":
      moveLeft = true;
      break;
    case "d":
    case "D":
      moveRight = true;
      break;
    case "q":
    case "Q":
      moveUp = true;
      break;
    case "e":
    case "E":
      moveDown = true;
      break;
  }
});

document.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "w":
    case "W":
      moveForward = false;
      break;
    case "s":
    case "S":
      moveBackward = false;
      break;
    case "a":
    case "A":
      moveLeft = false;
      break;
    case "d":
    case "D":
      moveRight = false;
      break;
    case "q":
    case "Q":
      moveUp = false;
      break;
    case "e":
    case "E":
      moveDown = false;
      break;
  }
});
