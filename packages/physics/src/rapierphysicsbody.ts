import { nanoid } from "nanoid";
import { vec2 } from "gl-matrix";
import { PhysicsBody } from "@silwalanish/engine";
import { Collider, RigidBody } from "@dimforge/rapier2d";

export class RapierPhysicsBody implements PhysicsBody {
  private _id: string;
  private _rigidBody: RigidBody;
  private _collider: Collider;

  public constructor(rigidBody: RigidBody, collider: Collider) {
    this._id = nanoid();

    this._rigidBody = rigidBody;
    this._collider = collider;
  }

  public resetForces(): void {
    this._rigidBody.resetForces(true);
  }

  public addForce(force: vec2): void {
    this._rigidBody.addForce({ x: force[0], y: force[1] }, true);
  }

  public applyImpulse(impulse: vec2): void {
    this._rigidBody.applyImpulse({ x: impulse[0], y: impulse[1] }, true);
  }

  public get velocity(): vec2 {
    const vel = this._rigidBody.linvel();
    return vec2.fromValues(vel.x, vel.y);
  }

  public get rigidBody(): RigidBody {
    return this._rigidBody;
  }

  public get collider(): Collider {
    return this._collider;
  }

  public get id(): string {
    return this._id;
  }
}
