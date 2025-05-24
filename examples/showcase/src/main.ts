import "./app.css";
import { App } from "./app";

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
});
