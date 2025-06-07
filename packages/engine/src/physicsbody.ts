import { vec2 } from "gl-matrix";

export interface PhysicsBody {
  get id(): string;

  get velocity(): vec2;

  resetForces(): void;

  addForce(force: vec2): void;
  applyImpulse(impulse: vec2): void;
}
