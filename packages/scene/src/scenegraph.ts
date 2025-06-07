import { nanoid } from "nanoid";
import { GameObject, Scene, View } from "@silwalanish/engine";

import { SceneNode } from "./scenenode";
import { Camera } from "./nodes/camera";

export class SceneGraph<ShapeType> implements Scene<ShapeType> {
  private _id: string;
  private _root: GameObject<ShapeType>;
  private _camera: View;

  constructor(id?: string) {
    this._id = id || nanoid();
    this._root = new SceneNode<ShapeType>("root");
    this.registerNode(this._root);

    let camera = new Camera<ShapeType>("defaultCamera");
    this.addNode(camera);

    this._camera = camera;
  }

  public get camera(): View {
    return this._camera;
  }

  public get id(): string {
    return this._id;
  }

  public get root(): GameObject<ShapeType> {
    return this._root;
  }

  public set camera(value: View) {
    this._camera = value;
  }

  public set root(value: GameObject<ShapeType>) {
    this._root = value;
  }

  public physicsUpdate(): void {
    this._root.physicsUpdate();
  }

  public update(deltaTime: number) {
    this._root.update(deltaTime);
  }

  public registerNode(node: GameObject<ShapeType>): void {
    node.scene = this;

    node.children.forEach((child) => {
      this.registerNode(child);
    });
  }

  public addNode(node: GameObject<ShapeType>) {
    this._root.addChild(node);
  }
}
