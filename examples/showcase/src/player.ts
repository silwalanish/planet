import { vec3, vec4 } from "gl-matrix";
import { Plane } from "@silwalanish/geometry";
import { BasicMaterial } from "@silwalanish/shader";
import { Camera, MeshComponent, SceneNode } from "@silwalanish/scene";
import { PlayerControl } from "./playercontrol";

const MAX_ACCELERATION = 100.0;
const MAX_DECCELERATION = 0.0;
const ACCELERATION_RATE = 5.0;
const DECCLERATION_RATE = 20.0;

export class Player extends SceneNode {
  private _camera: Camera;

  private _speed: number = 0.0;
  private _control: PlayerControl;

  public constructor(camera: Camera) {
    super("player");

    this._camera = camera;
    this._control = new PlayerControl();

    this.mesh = new MeshComponent(
      new Plane(2, 5),
      new BasicMaterial("playerMaterial", vec4.fromValues(1, 0, 0, 1))
    );
  }

  public get control() {
    return this._control;
  }

  public get speed() {
    return this._speed;
  }

  public override update(deltaTime: number): void {
    super.update(deltaTime);

    if (this._control.isAccelerating) {
      this._speed = Math.min(
        this._speed + ACCELERATION_RATE * deltaTime,
        MAX_ACCELERATION
      );
    } else if (this._control.isDeccelerating) {
      this._speed = Math.max(
        this._speed - DECCLERATION_RATE * deltaTime,
        -MAX_DECCELERATION
      );
    } else if (this._speed > 0.0) {
      this._speed = Math.max(this._speed - ACCELERATION_RATE * deltaTime, 0.0);
    } else if (this._speed < 0.0) {
      this._speed = Math.min(this._speed + ACCELERATION_RATE * deltaTime, 0.0);
    }

    this.transform.Position[0] += this._speed * deltaTime;

    this._camera.transform.Position[0] = this.transform.Position[0];
    this._camera.lookAt(vec3.fromValues(0, 0, -1));
  }
}
