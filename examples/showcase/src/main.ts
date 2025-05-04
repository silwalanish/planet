import "./app.css";
import { App } from "./app";

function toggleFullScreen(element: HTMLElement) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if ((element as any).mozRequestFullScreen) {
    (element as any).mozRequestFullScreen();
  } else if ((element as any).webkitRequestFullscreen) {
    (element as any).webkitRequestFullscreen();
  } else if ((element as any).msRequestFullscreen) {
    (element as any).msRequestFullscreen();
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const element = document.getElementById("app");
  if (!element) {
    throw new Error("Element with id 'app' not found");
  }

  const app = new App();
  app.init();

  element.appendChild(app.domElement);
  window.requestAnimationFrame(() => app.loop());

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      app.resume();
    } else {
      app.pause();
    }
  });

  (window as any).app = app;

  document.addEventListener("contextmenu", (event) => event.preventDefault());

  let lastTap = 0;
  let touchX = 0,
    touchY = 0;

  element.addEventListener("touchstart", function (event: TouchEvent) {
    const now = Date.now();
    const tapTimeout = 300; // Adjust as needed

    const currentTouchX = event.touches[0]?.clientX || 0;
    const currentTouchY = event.touches[0]?.clientY || 0;

    if (
      now - lastTap < tapTimeout &&
      Math.abs(currentTouchX - touchX) < 20 &&
      Math.abs(currentTouchY - touchY) < 20
    ) {
      event.preventDefault(); // Prevent default double-tap zoom
      toggleFullScreen(element);
    } else {
      touchX = currentTouchX;
      touchY = currentTouchY;
    }
    lastTap = now;
  });

  element.addEventListener("dblclick", function () {
    toggleFullScreen(element);
  });
});
