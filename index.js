function setStatus(message) {
  const statusCopy = document.querySelector("[data-status-copy]");
  if (statusCopy) {
    statusCopy.textContent = message;
  }
}

function syncArViewport(scene) {
  const video = document.querySelector(".arjs-video, video");
  const canvas = scene?.canvas ?? document.querySelector(".a-canvas, a-scene canvas");

  if (!video || !canvas) {
    return false;
  }

  const rect = video.getBoundingClientRect();

  if (!rect.width || !rect.height) {
    return false;
  }

  const viewportKey = [
    Math.round(rect.left),
    Math.round(rect.top),
    Math.round(rect.width),
    Math.round(rect.height),
  ].join(":");
  const viewportChanged = scene.dataset.viewportKey !== viewportKey;

  scene.dataset.viewportKey = viewportKey;

  video.style.setProperty("position", "fixed", "important");
  video.style.setProperty("left", `${rect.left}px`, "important");
  video.style.setProperty("top", `${rect.top}px`, "important");
  video.style.setProperty("width", `${rect.width}px`, "important");
  video.style.setProperty("height", `${rect.height}px`, "important");
  video.style.setProperty("z-index", "1", "important");
  video.style.setProperty("pointer-events", "none", "important");

  scene.style.setProperty("position", "fixed", "important");
  scene.style.setProperty("left", `${rect.left}px`, "important");
  scene.style.setProperty("top", `${rect.top}px`, "important");
  scene.style.setProperty("width", `${rect.width}px`, "important");
  scene.style.setProperty("height", `${rect.height}px`, "important");
  scene.style.setProperty("z-index", "5", "important");
  scene.style.setProperty("background", "transparent", "important");
  scene.style.setProperty("pointer-events", "none", "important");

  canvas.style.setProperty("position", "absolute", "important");
  canvas.style.setProperty("left", "0", "important");
  canvas.style.setProperty("top", "0", "important");
  canvas.style.setProperty("width", "100%", "important");
  canvas.style.setProperty("height", "100%", "important");
  canvas.style.setProperty("z-index", "0", "important");
  canvas.style.setProperty("pointer-events", "none", "important");
  canvas.style.setProperty("background-color", "transparent", "important");

  if (viewportChanged && typeof scene.resize === "function") {
    scene.resize();
  }

  return true;
}

function initViewportSync(scene) {
  if (!scene) {
    return () => {};
  }

  const runSync = () => {
    syncArViewport(scene);
  };

  const domObserver = new MutationObserver(runSync);
  domObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });

  const intervalId = window.setInterval(runSync, 250);

  window.addEventListener("resize", runSync);
  window.addEventListener("orientationchange", runSync);

  scene.addEventListener("renderstart", runSync);
  scene.addEventListener("loaded", runSync);

  return () => {
    domObserver.disconnect();
    window.clearInterval(intervalId);
    window.removeEventListener("resize", runSync);
    window.removeEventListener("orientationchange", runSync);
  };
}

function init() {
  if (!window.AFRAME) {
    setStatus("The AR libraries did not load. Refresh the page and try again.");
    return;
  }

  const scene = document.querySelector("a-scene");
  const marker = document.querySelector("[data-hiro-marker]");

  initViewportSync(scene);

  marker?.addEventListener("markerFound", () => {
    setStatus("Marker found. You should see a spinning orange cube on the Hiro marker.");
  });

  marker?.addEventListener("markerLost", () => {
    setStatus("Marker lost. Point your camera back at the Hiro image.");
  });
}

init();
