import { GameObject } from "./gameobject";
import { PhysicsBody } from "./physicsbody";

export interface World2D<ShapeType, JointType> {
  get id(): string;

  createBody(gameObject: GameObject<ShapeType, JointType>): PhysicsBody;

  physicsUpdate(): void;
}
