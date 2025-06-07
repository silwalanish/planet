import { nanoid } from "nanoid";
import { GameObject, Scene, View } from "@silwalanish/engine";

import { SceneNode } from "./scenenode";
import { Camera } from "./nodes/camera";

export class SceneGraph<ShapeType, JointType>
  implements Scene<ShapeType, JointType>
{
  private _id: string;
  private _root: GameObject<ShapeType, JointType>;
  private _camera: View;

  constructor(id?: string) {
    this._id = id || nanoid();
    this._root = new SceneNode<ShapeType, JointType>("root");
    this.registerNode(this._root);

    let camera = new Camera<ShapeType, JointType>("defaultCamera");
    this.addNode(camera);

    this._camera = camera;
  }

  public get camera(): View {
    return this._camera;
  }

  public get id(): string {
    return this._id;
  }

  public get root(): GameObject<ShapeType, JointType> {
    return this._root;
  }

  public set camera(value: View) {
    this._camera = value;
  }

  public set root(value: GameObject<ShapeType, JointType>) {
    this._root = value;
  }

  public physicsUpdate(): void {
    this._root.physicsUpdate();
  }

  public update(deltaTime: number) {
    this._root.update(deltaTime);
  }

  public registerNode(node: GameObject<ShapeType, JointType>): void {
    node.scene = this;

    node.children.forEach((child) => {
      this.registerNode(child);
    });
  }

  public addNode(node: GameObject<ShapeType, JointType>) {
    this._root.addChild(node);
  }
}
