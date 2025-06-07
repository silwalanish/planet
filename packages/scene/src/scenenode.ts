import { nanoid } from "nanoid";
import {
  GameObject,
  Mesh,
  Physics2D,
  PhysicsBody,
  Scene,
  Transform,
} from "@silwalanish/engine";

import { TransformComponent } from "./components/transformcomponent";

export class SceneNode<ShapeType> implements GameObject<ShapeType> {
  private _id: string;
  private _name: string;
  private _mesh: Mesh | null;
  private _transform: Transform;
  private _children: GameObject<ShapeType>[];
  private _physics: Physics2D<ShapeType> | null;
  private _parent: GameObject<ShapeType> | null;
  private _physicsBody: PhysicsBody | null;
  private _scene: Scene<ShapeType> | null;

  public constructor(name: string, id?: string) {
    this._id = id || nanoid();
    this._name = name;
    this._children = [];
    this._parent = null;
    this._mesh = null;
    this._physics = null;
    this._physicsBody = null;
    this._scene = null;
    this._transform = new TransformComponent();
  }

  public get scene(): Scene<ShapeType> | null {
    return this._scene;
  }

  public set scene(value: Scene<ShapeType> | null) {
    this._scene = value;
  }

  get physicsBody(): PhysicsBody | null {
    return this._physicsBody;
  }

  set physicsBody(value: PhysicsBody | null) {
    this._physicsBody = value;
  }

  get physics(): Physics2D<ShapeType> | null {
    return this._physics;
  }

  set physics(value: Physics2D<ShapeType> | null) {
    this._physics = value;
  }

  public get id(): string {
    return this._id;
  }

  public get name(): string {
    return this._name;
  }

  public get mesh(): Mesh | null {
    return this._mesh;
  }

  public get transform(): Transform {
    return this._transform;
  }

  public get children(): GameObject<ShapeType>[] {
    return this._children;
  }

  public get parent(): GameObject<ShapeType> | null {
    return this._parent;
  }

  public set mesh(value: Mesh | undefined) {
    this._mesh = value || null;
  }

  public set transform(value: Transform) {
    this._transform = value;
  }

  public set parent(value: GameObject<ShapeType> | null) {
    this._parent = value;
    this._transform.Parent = value ? value.transform : null;
  }

  public physicsUpdate(): void {
    this.children.forEach((child) => {
      child.physicsUpdate();
    });
  }

  public update(deltaTime: number) {
    this.transform.recalculate();

    this.children.forEach((child) => {
      child.update(deltaTime);
    });
  }

  public addChild(child: GameObject<ShapeType>) {
    if (child.parent) {
      child.parent.removeChild(child);
    }

    child.parent = this;
    this.children.push(child);

    this.scene?.registerNode(child);
  }

  public removeChild(child: GameObject<ShapeType>) {
    const index = this.children.indexOf(child);

    if (index != -1) {
      this.children.splice(index, 1);
    }
  }
}
