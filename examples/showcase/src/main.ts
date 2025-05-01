import "./app.css";

import { vec3, vec4 } from "gl-matrix";
import { Planet, PlanetMaterial } from "@silwalanish/planet";
import { BasicMaterial } from "@silwalanish/shader";
import {
  CanvasSurface,
  Orthographic,
  Perspective,
  Renderer,
} from "@silwalanish/renderer";
import {
  Camera,
  MeshComponent,
  SceneGraph,
  SceneNode,
} from "@silwalanish/scene";
import { Plane } from "@silwalanish/geometry";

class App {
  private _lastTime: number;
  private _surface: CanvasSurface;
  private _renderer: Renderer;
  private _scene: SceneGraph;
  private _perspective: Perspective;
  private _orthographic: Orthographic;

  public constructor() {
    this._surface = new CanvasSurface({
      autoResize: true,
      onResize: this._onResize.bind(this),
    });
    this._renderer = new Renderer(this._surface);

    this._scene = new SceneGraph();
    this._perspective = new Perspective(90, 1.33, 0.01, 1000);
    this._orthographic = new Orthographic(-50, 50, -5, 20, 0.01, 1000);

    this._lastTime = Date.now();
  }

  private _onResize(width: number, height: number) {
    this._renderer.viewport.width = width;
    this._renderer.viewport.height = height;

    this._perspective.aspect = width / height;
  }

  public init() {
    const camera = new Camera("activeCamera");
    this._scene.addNode(camera);
    this._scene.camera = camera;
    camera.transform.Position = vec3.fromValues(0, 0, 10);
    camera.lookAt(vec3.fromValues(0, 0, 0));

    const sky = new SceneNode("sky");
    sky.mesh = new MeshComponent(
      new Plane(100, 30),
      new BasicMaterial("skyMaterial", vec4.fromValues(0.5, 0.7, 1, 1))
    );
    sky.transform.Position = vec3.fromValues(0, 5, -5);
    this._scene.addNode(sky);

    const planet = new SceneNode("planet");
    planet.mesh = new MeshComponent(
      new Planet(),
      new PlanetMaterial(
        "planetMaterial",
        vec4.fromValues(86 / 255, 125 / 255, 70 / 255, 1),
        vec4.fromValues(146 / 255, 116 / 255, 91 / 255, 1),
        vec4.fromValues(0.1, 0.1, 0.1, 1)
      )
    );
    this._scene.addNode(planet);
  }

  public loop() {
    const currentTime = Date.now();
    const deltaTime = (currentTime - this._lastTime) / 1000.0;
    this._lastTime = currentTime;

    this._scene.update(deltaTime);
    this._renderer.render(this._scene, this._orthographic);

    window.requestAnimationFrame(() => {
      this.loop();
    });
  }

  public get domElement() {
    return this._surface.domElement;
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

  (window as any).app = app;
});
