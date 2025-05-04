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
import { Player } from "./player";

function leftpad(s: string, width: number, char: string) {
  return s.length >= width
    ? s
    : (new Array(width).join(char) + s).slice(-width);
}

export class App {
  private _lastTime: number;
  private _surface: CanvasSurface;
  private _renderer: Renderer;
  private _scene: SceneGraph;
  private _perspective: Perspective;
  private _orthographic: Orthographic;
  private _groundManager: GroundManager;
  private _camera: Camera;
  private _sky: SceneNode;
  private _player: Player;
  private _domElement: HTMLDivElement;
  private _speedLabel: HTMLLabelElement;

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
    this._camera = new Camera("activeCamera");
    this._groundManager = new GroundManager(this._camera);
    this._sky = new SceneNode("sky");
    this._player = new Player(this._camera);

    this._speedLabel = document.createElement("label");

    this._domElement = document.createElement("div");
    this._domElement.appendChild(this._surface.domElement);

    this._lastTime = Date.now();

    this._makeUI();
  }

  private _makeUI() {
    const speedContainer = document.createElement("div");
    speedContainer.className = "speed-container";
    this._speedLabel.className = "speed";
    this._speedLabel.innerText = "000";
    speedContainer.appendChild(this._speedLabel);

    const label = document.createElement("label");
    label.innerText = "KM/H";
    speedContainer.appendChild(label);
    this._domElement.appendChild(speedContainer);

    const container = document.createElement("div");
    container.className = "button-container";

    const backwardButton = document.createElement("button");
    backwardButton.className = "backward";
    backwardButton.onmousedown = () => {
      this._player.deccelerate();
    };
    backwardButton.onmouseup = () => {
      this._player.neutral();
    };
    backwardButton.ontouchstart = () => {
      this._player.deccelerate();
    };
    backwardButton.ontouchend = () => {
      this._player.neutral();
    };
    backwardButton.ontouchcancel = () => {
      this._player.neutral();
    };
    container.appendChild(backwardButton);

    const forwardButton = document.createElement("button");
    forwardButton.className = "forward";
    forwardButton.onmousedown = () => {
      this._player.accelerate();
    };
    forwardButton.onmouseup = () => {
      this._player.neutral();
    };
    forwardButton.ontouchstart = () => {
      this._player.accelerate();
    };
    forwardButton.ontouchend = () => {
      this._player.neutral();
    };
    forwardButton.ontouchcancel = () => {
      this._player.neutral();
    };
    container.appendChild(forwardButton);

    this._domElement.appendChild(container);
  }

  private _onResize(width: number, height: number) {
    this._renderer.viewport.width = width;
    this._renderer.viewport.height = height;

    this._perspective.aspect = width / height;
  }

  public init() {
    this._scene.addNode(this._groundManager);
    this._scene.addNode(this._player);

    this._camera.transform.Position = vec3.fromValues(0, 0, 10);
    this._camera.lookAt(vec3.fromValues(0, 0, -1));

    this._scene.addNode(this._camera);
    this._scene.camera = this._camera;

    this._sky.mesh = new MeshComponent(
      new Plane(150, 100),
      new BasicMaterial("skyMaterial", vec4.fromValues(0.5, 0.7, 1, 1))
    );
    this._sky.transform.Position = vec3.fromValues(0, 0, -20);
    this._camera.addChild(this._sky);
  }

  public pause() {
    this.isPaused = true;
  }

  public resume() {
    this.isPaused = false;
    this._lastTime = Date.now();
  }

  public loop() {
    const currentTime = Date.now();
    const deltaTime = (currentTime - this._lastTime) / 1000.0;
    this._lastTime = currentTime;

    if (!this.isPaused) {
      this._speedLabel.innerText = leftpad(
        Math.abs(Math.round(this._player.speed)).toString(),
        3,
        "0"
      );
      this._scene.update(deltaTime);
      this._renderer.render(this._scene, this._orthographic);
    }

    window.requestAnimationFrame(() => {
      this.loop();
    });
  }

  public get domElement() {
    return this._domElement;
  }
}
