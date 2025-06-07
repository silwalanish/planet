import { vec2, vec3, vec4 } from "gl-matrix";
import { Plane } from "@silwalanish/geometry";
import { BasicMaterial } from "@silwalanish/shader";
import { Physics2DType } from "@silwalanish/engine";
import { MeshComponent, SceneNode } from "@silwalanish/scene";
import { RapierPhysics2D, PhysicsShapeType, Box } from "@silwalanish/physics";

import { PlayerControl } from "./playercontrol";

const MAX_SPEED = 100.0;
const ACCELERATION_RATE = 5.0;
const DECCLERATION_RATE = 5.0;

export class Player extends SceneNode<PhysicsShapeType> {
  private _speed: number = 0.0;
  private _control: PlayerControl;

  public constructor() {
    super("player");

    this._control = new PlayerControl();

    this.mesh = new MeshComponent(
      new Plane(2, 2),
      new BasicMaterial("playerMaterial", vec4.fromValues(1, 0, 0, 1))
    );

    this.physics = new RapierPhysics2D(
      Physics2DType.DYNAMIC,
      10.0, // mass
      0.0, // friction
      Box(1, 1)
    );

    this.transform.Position = vec3.fromValues(0, 70, 0);
  }

  public get control() {
    return this._control;
  }

  public get speed() {
    return this._speed;
  }

  public override physicsUpdate(): void {
    super.physicsUpdate();

    if (!this.physicsBody) {
      return;
    }

    const body = this.physicsBody;

    this._speed = body.velocity[0];

    if (this._speed < MAX_SPEED) {
      if (this._control.isAccelerating) {
        body.applyImpulse(vec2.fromValues(ACCELERATION_RATE, 0));
      } else if (this._control.isDeccelerating) {
        body.applyImpulse(vec2.fromValues(-DECCLERATION_RATE, 0));
      }
    }
  }

  public override update(deltaTime: number): void {
    super.update(deltaTime);
  }
}
