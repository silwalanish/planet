import { nanoid } from "nanoid";
import { GameObject, Mesh, Transform } from "@silwalanish/engine";

import { TransformComponent } from "./components/transformcomponent";

export class SceneNode implements GameObject {
  private _id: string;
  private _name: string;
  private _mesh: Mesh | null;
  private _transform: Transform;
  private _children: GameObject[];
  private _parent: GameObject | null;

  public constructor(name: string, id?: string) {
    this._id = id || nanoid();
    this._name = name;
    this._children = [];
    this._parent = null;
    this._mesh = null;
    this._transform = new TransformComponent();
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

  public get children(): GameObject[] {
    return this._children;
  }

  public get parent(): GameObject | null {
    return this._parent;
  }

  public set mesh(value: Mesh | undefined) {
    this._mesh = value || null;
  }

  public set transform(value: Transform) {
    this._transform = value;
  }

  public set parent(value: GameObject | null) {
    this._parent = value;
    this._transform.Parent = value ? value.transform : null;
  }

  public update(deltaTime: number) {
    this.transform.recalculate();

    this.children.forEach((child) => {
      child.update(deltaTime);
    });
  }

  public addChild(child: GameObject) {
    if (child.parent) {
      child.parent.removeChild(child);
    }

    child.parent = this;
    this.children.push(child);
  }

  public removeChild(child: GameObject) {
    const index = this.children.indexOf(child);

    if (index != -1) {
      this.children.splice(index, 1);
    }
  }
}
