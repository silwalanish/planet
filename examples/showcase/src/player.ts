import { vec3, vec4 } from "gl-matrix";
import { BasicMaterial } from "@silwalanish/shader";
import { Physics2DType } from "@silwalanish/engine";
import { Circle, Plane } from "@silwalanish/geometry";
import { MeshComponent, SceneNode } from "@silwalanish/scene";
import {
  RapierPhysics2D,
  PhysicsShapeType,
  Box,
  Ball,
  RapierJoint,
  RevoluteJoint,
  PhysicsJointType,
} from "@silwalanish/physics";

import { PlayerControl } from "./playercontrol";

const MAX_SPEED = 500.0;

export class Player extends SceneNode<PhysicsShapeType, PhysicsJointType> {
  private _speed: number = 0.0;
  private _control: PlayerControl;
  private _rightWheel: SceneNode<PhysicsShapeType, PhysicsJointType>;
  private _leftWheel: SceneNode<PhysicsShapeType, PhysicsJointType>;

  public constructor() {
    super("player");

    this._control = new PlayerControl();

    this.mesh = new MeshComponent(
      new Plane(5, 2),
      new BasicMaterial("playerMaterial", vec4.fromValues(1, 0, 0, 1))
    );

    this.physics = new RapierPhysics2D(
      Physics2DType.DYNAMIC,
      5.0, // mass
      0.0, // friction
      Box(2.5, 1)
    );

    this.transform.Position = vec3.fromValues(0, 15, 0);

    this._rightWheel = new SceneNode<PhysicsShapeType, PhysicsJointType>(
      "rightWheel"
    );
    this._rightWheel.mesh = new MeshComponent(
      new Circle(0.75),
      new BasicMaterial("wheelMaterial", vec4.fromValues(0, 0, 1, 1))
    );

    this._rightWheel.physics = new RapierPhysics2D(
      Physics2DType.DYNAMIC,
      1.0, // mass
      0.02, // friction
      Ball(0.75),
      [
        new RapierJoint(
          [this, this._rightWheel],
          RevoluteJoint({ x: 1.5, y: -1.0 }, { x: 0.0, y: 0.0 })
        ),
      ]
    );

    this._leftWheel = new SceneNode<PhysicsShapeType, PhysicsJointType>(
      "leftWheel"
    );
    this._leftWheel.mesh = new MeshComponent(
      new Circle(0.75),
      new BasicMaterial("wheelMaterial", vec4.fromValues(0, 1, 0, 1))
    );

    this._leftWheel.physics = new RapierPhysics2D(
      Physics2DType.DYNAMIC,
      1.0, // mass
      0.002, // friction
      Ball(0.75),
      [
        new RapierJoint(
          [this, this._leftWheel],
          RevoluteJoint({ x: -1.5, y: -1.0 }, { x: 0.0, y: 0.0 })
        ),
      ]
    );

    this.addChild(this._rightWheel);
    this.addChild(this._leftWheel);
  }

  public get control() {
    return this._control;
  }

  public get speed() {
    return this._speed;
  }

  public override physicsUpdate(): void {
    super.physicsUpdate();

    if (!this._rightWheel.physicsBody) {
      return;
    }

    const backwheel = this._rightWheel.physicsBody;
    const backwheelJoint = this._rightWheel.physicsBody.joints[0];

    this._speed = backwheel.velocity[0];

    if (this._speed < MAX_SPEED) {
      if (this._control.isAccelerating) {
        backwheelJoint.configureMotorVelocity(-MAX_SPEED, 2.0);
      } else if (this._control.isDeccelerating) {
        backwheelJoint.configureMotorVelocity(MAX_SPEED / 5, 2.0);
      } else {
        backwheelJoint.configureMotorVelocity(0.0, 0.6);
      }
    }
  }

  public override update(deltaTime: number): void {
    super.update(deltaTime);
  }
}
