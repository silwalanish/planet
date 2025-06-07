import { SceneGraph } from "@silwalanish/scene";
import { GameObject, World2D } from "@silwalanish/engine";

import { RapierWorld2D } from "./rapierworld2d";
import { PhysicsJointType } from "./physicsjoints";
import { PhysicsShapeType } from "./physicsshapetype";

export class PhysicsScene2D extends SceneGraph<
  PhysicsShapeType,
  PhysicsJointType
> {
  private _world: RapierWorld2D;

  public constructor(id?: string) {
    super(id);

    this._world = new RapierWorld2D(this);
  }

  private _addPhysicsBody(
    node: GameObject<PhysicsShapeType, PhysicsJointType>
  ): void {
    if (node.physics) {
      node.physicsBody = this._world.createBody(node);
    }

    for (const child of node.children) {
      this._addPhysicsBody(child);
    }
  }

  private _addPhysicsJoints(
    node: GameObject<PhysicsShapeType, PhysicsJointType>
  ): void {
    if (node.physics && node.physics.joints) {
      for (const joint of node.physics.joints) {
        this._world.createJoint(node, joint);
      }
    }

    for (const child of node.children) {
      this._addPhysicsJoints(child);
    }
  }

  public override registerNode(
    node: GameObject<PhysicsShapeType, PhysicsJointType>
  ): void {
    node.scene = this;

    this._addPhysicsBody(node);
    this._addPhysicsJoints(node);

    node.children.forEach((child) => {
      this.registerNode(child);
    });
  }

  public override physicsUpdate(): void {
    super.physicsUpdate();

    this._world.physicsUpdate();
  }

  public get world(): World2D<PhysicsShapeType, PhysicsJointType> {
    return this._world;
  }
}
