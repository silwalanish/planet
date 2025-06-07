import { vec2 } from "gl-matrix";

export interface PhysicsBody {
  get id(): string;

  get velocity(): vec2;

  // TODO: replace with a more specific type
  get joints(): any[];

  addJoint(joint: any): void;

  resetForces(): void;

  addForce(force: vec2): void;
  applyTorqueImpulse(impulse: number): void;
  applyImpulse(impulse: vec2): void;
}
