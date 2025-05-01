import { nanoid } from "nanoid";
import { GameObject, Scene, View } from "@silwalanish/engine";

import { SceneNode } from "./scenenode";
import { Camera } from "./nodes/camera";

export class SceneGraph implements Scene {
  private _id: string;
  private _root: GameObject;
  private _camera: View;

  constructor(id?: string) {
    this._id = id || nanoid();
    this._root = new SceneNode("root");

    let camera = new Camera("defaultCamera");
    this.addNode(camera);

    this._camera = camera;
  }

  public get camera(): View {
    return this._camera;
  }

  public get id(): string {
    return this._id;
  }

  public get root(): GameObject {
    return this._root;
  }

  public set camera(value: View) {
    this._camera = value;
  }

  public set root(value: GameObject) {
    this._root = value;
  }

  public update(deltaTime: number) {
    this._root.update(deltaTime);
  }

  public addNode(node: SceneNode) {
    this._root.addChild(node);
  }
}
