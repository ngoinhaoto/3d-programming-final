export const movementSpeed = 0.5;
export let moveForward = false;
export let moveBackward = false;
export let moveLeft = false;
export let moveRight = false;

document.addEventListener("keydown", (event) => {
  if (event.key === "w" || event.key === "W") {
    moveForward = true;
  }
  if (event.key === "s" || event.key === "S") {
    moveBackward = true;
  }
  if (event.key === "a" || event.key === "A") {
    moveLeft = true;
  }
  if (event.key === "d" || event.key === "D") {
    moveRight = true;
  }
});

document.addEventListener("keyup", (event) => {
  if (event.key === "w" || event.key === "W") {
    moveForward = false;
  }
  if (event.key === "s" || event.key === "S") {
    moveBackward = false;
  }
  if (event.key === "a" || event.key === "A") {
    moveLeft = false;
  }
  if (event.key === "d" || event.key === "D") {
    moveRight = false;
  }
});
