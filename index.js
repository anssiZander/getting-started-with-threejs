function setStatus(message) {
  const statusCopy = document.querySelector("[data-status-copy]");
  if (statusCopy) {
    statusCopy.textContent = message;
  }
}

function init() {
  if (!window.AFRAME) {
    setStatus("The AR libraries did not load. Refresh the page and try again.");
    return;
  }

  const marker = document.querySelector("[data-hiro-marker]");

  marker?.addEventListener("markerFound", () => {
    setStatus("Marker found. You should see a spinning orange cube on the Hiro marker.");
  });

  marker?.addEventListener("markerLost", () => {
    setStatus("Marker lost. Point your camera back at the Hiro image.");
  });
}

init();
