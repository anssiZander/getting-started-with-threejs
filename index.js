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

  video.style.zIndex = "0";
  video.style.pointerEvents = "none";

  canvas.style.position = "fixed";
  canvas.style.left = `${rect.left}px`;
  canvas.style.top = `${rect.top}px`;
  canvas.style.width = `${rect.width}px`;
  canvas.style.height = `${rect.height}px`;
  canvas.style.zIndex = "1";
  canvas.style.pointerEvents = "none";
  canvas.style.backgroundColor = "transparent";

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
