import { createEarth } from "./createEarth.js";

const AFRAME = window.AFRAME;
const THREE = AFRAME?.THREE || window.THREE;

function registerEarthComponent() {
  if (!AFRAME || !THREE || AFRAME.components["earth-globe"]) {
    return;
  }

  AFRAME.registerComponent("earth-globe", {
    init() {
      this.earth = createEarth(THREE);
      this.el.setObject3D("earth-globe", this.earth);
    },

    tick(_time, deltaTime) {
      if (!this.earth) {
        return;
      }

      this.earth.userData.spin(deltaTime / 1000);
    },

    remove() {
      if (!this.earth) {
        return;
      }

      this.earth.userData.dispose?.();
      this.el.removeObject3D("earth-globe");
      this.earth = null;
    },
  });
}

function setStatus(message) {
  const statusCopy = document.querySelector("[data-status-copy]");
  if (statusCopy) {
    statusCopy.textContent = message;
  }
}

function init() {
  if (!AFRAME || !THREE) {
    setStatus("The AR libraries did not load. Refresh the page and try again.");
    return;
  }

  registerEarthComponent();

  const earthAnchor = document.querySelector("[data-earth-anchor]");
  const marker = document.querySelector("[data-hiro-marker]");

  earthAnchor?.setAttribute("earth-globe", "");

  marker?.addEventListener("markerFound", () => {
    setStatus("Marker found. Move around a little to explore the Earth.");
  });

  marker?.addEventListener("markerLost", () => {
    setStatus("Marker lost. Point your camera back at the Hiro image.");
  });
}

init();
