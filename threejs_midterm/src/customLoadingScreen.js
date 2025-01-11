export function showLoadingScreen() {
  const loadingScreen = document.createElement("div");
  loadingScreen.id = "loading-screen";
  loadingScreen.style.position = "fixed";
  loadingScreen.style.top = "0";
  loadingScreen.style.left = "0";
  loadingScreen.style.width = "100%";
  loadingScreen.style.height = "100%";
  loadingScreen.style.backgroundColor = "#000";
  loadingScreen.style.color = "#fff";
  loadingScreen.style.display = "flex";
  loadingScreen.style.justifyContent = "center";
  loadingScreen.style.alignItems = "center";
  loadingScreen.style.zIndex = "1000";
  loadingScreen.innerHTML = `
      <div>
        <h1>Loading...</h1>
        <div id="loading-animation" style="margin-top: 20px;"></div>
      </div>
    `;
  document.body.appendChild(loadingScreen);

  // Add custom animation or other elements to the loading screen
  const loadingAnimation = document.getElementById("loading-animation");
  loadingAnimation.innerHTML = `
      <div style="width: 50px; height: 50px; border: 5px solid #fff; border-top: 5px solid #000; border-radius: 50%; animation: spin 1s linear infinite;"></div>
    `;

  // Add custom CSS for the animation
  const style = document.createElement("style");
  style.innerHTML = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
  document.head.appendChild(style);

  loadingScreen.offsetHeight; // Force reflow to ensure the loading screen is displayed
}

export function hideLoadingScreen() {
  const loadingScreen = document.getElementById("loading-screen");
  if (loadingScreen) {
    document.body.removeChild(loadingScreen);
  }
}
