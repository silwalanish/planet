import { GameObject } from "./gameobject";
import { PhysicsBody } from "./physicsbody";

export interface World2D {
  get id(): string;

  createBody(gameObject: GameObject): PhysicsBody;

  update(deltaTime: number): void;
  physicsUpdate(): void;
}
