import { SceneGraph } from "@silwalanish/scene";
import { GameObject, World2D } from "@silwalanish/engine";

import { RapierWorld2D } from "./rapierworld2d";
import { PhysicsShapeType } from "./physicsshapetype";

export class PhysicsScene2D extends SceneGraph<PhysicsShapeType> {
  private _world: World2D<PhysicsShapeType>;

  public constructor(id?: string) {
    super(id);

    this._world = new RapierWorld2D(this);
  }

  private _addPhysicsBody(node: GameObject<PhysicsShapeType>): void {
    if (node.physics) {
      node.physicsBody = this._world.createBody(node);
    }

    for (const child of node.children) {
      this._addPhysicsBody(child);
    }
  }

  public override registerNode(node: GameObject<PhysicsShapeType>): void {
    super.registerNode(node);

    this._addPhysicsBody(node);
  }

  public override physicsUpdate(): void {
    super.physicsUpdate();

    this._world.physicsUpdate();
  }

  public get world(): World2D<PhysicsShapeType> {
    return this._world;
  }
}
