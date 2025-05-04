import { vec3, vec4 } from "gl-matrix";
import { BasicMaterial } from "@silwalanish/shader";
import { GroundManager } from "@silwalanish/planet";
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

export class App {
  private _lastTime: number;
  private _surface: CanvasSurface;
  private _renderer: Renderer;
  private _scene: SceneGraph;
  private _perspective: Perspective;
  private _orthographic: Orthographic;
  private _groundManager: GroundManager;

  public isPaused: boolean = false;

  public constructor() {
    this._surface = new CanvasSurface({
      autoResize: true,
      onResize: this._onResize.bind(this),
    });
    this._renderer = new Renderer(this._surface);

    this._scene = new SceneGraph();
    this._perspective = new Perspective(90, 1.33, 0.01, 1000);
    this._orthographic = new Orthographic(-50, 50, -50, 50, 0.01, 1000);
    this._groundManager = new GroundManager();

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
      new Plane(100, 100),
      new BasicMaterial("skyMaterial", vec4.fromValues(0.5, 0.7, 1, 1))
    );
    sky.transform.Position = vec3.fromValues(0, 0, -1);
    this._scene.addNode(sky);

    this._scene.addNode(this._groundManager);
  }

  public loop() {
    const currentTime = Date.now();
    const deltaTime = (currentTime - this._lastTime) / 1000.0;
    this._lastTime = currentTime;

    if (!this.isPaused) {
      this._scene.update(deltaTime);
      this._renderer.render(this._scene, this._orthographic);
    }

    window.requestAnimationFrame(() => {
      this.loop();
    });
  }

  public get domElement() {
    return this._surface.domElement;
  }
}
