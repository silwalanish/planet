import { GameObject } from "./gameobject";
import { PhysicsBody } from "./physicsbody";

export interface World2D<ShapeType> {
  get id(): string;

  createBody(gameObject: GameObject<ShapeType>): PhysicsBody;

  physicsUpdate(): void;
}
