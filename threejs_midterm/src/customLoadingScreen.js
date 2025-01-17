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
  loadingScreen.style.flexDirection = "column";
  loadingScreen.style.justifyContent = "center";
  loadingScreen.style.alignItems = "center";
  loadingScreen.style.zIndex = "1000";
  loadingScreen.innerHTML = `
    <div style="text-align: center;">
      <h1 class="loading-text">Porting you to new dimension...</h1>
      <div id="loading-animation" style="margin-top: 20px;">
        <div style="width: 50px; height: 50px; border: 5px solid #fff; border-top: 5px solid #000; border-radius: 50%; animation: spin 1s linear infinite; margin: 20px auto 0;"></div>
      </div>
    </div>
  `;
  document.body.appendChild(loadingScreen);

  const style = document.createElement("style");
  style.innerHTML = `
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700&display=swap');

    .loading-text {
      font-family: 'Orbitron', sans-serif;
      font-size: 2em;
    }

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
