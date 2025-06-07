import { nanoid } from "nanoid";
import {
  GameObject,
  Physics2D,
  Physics2DType,
  Physics2DJoint,
} from "@silwalanish/engine";
import { PhysicsJointType } from "./physicsjoints";
import { PhysicsShapeType } from "./physicsshapetype";

export class RapierJoint
  implements Physics2DJoint<PhysicsShapeType, PhysicsJointType>
{
  private _id: string;
  private _bodies: GameObject<PhysicsShapeType, PhysicsJointType>[];
  private _jointData: PhysicsJointType;

  public constructor(
    bodies: GameObject<PhysicsShapeType, PhysicsJointType>[],
    jointData: PhysicsJointType
  ) {
    this._id = nanoid();
    this._bodies = bodies;
    this._jointData = jointData;
  }

  public get id(): string {
    return this._id;
  }

  public get bodies(): GameObject<PhysicsShapeType, PhysicsJointType>[] {
    return this._bodies;
  }

  public get jointData(): PhysicsJointType {
    return this._jointData;
  }
}

export class RapierPhysics2D
  implements Physics2D<PhysicsShapeType, PhysicsJointType>
{
  private _id: string;
  private _type: Physics2DType;
  private _mass: number;
  private _friction: number;
  private _shape: PhysicsShapeType;
  private _joints: RapierJoint[];

  public constructor(
    type: Physics2DType,
    mass: number,
    friction: number,
    shape: PhysicsShapeType,
    joints: RapierJoint[] = []
  ) {
    this._id = nanoid();
    this._type = type;
    this._mass = mass;
    this._friction = friction;
    this._shape = shape;
    this._joints = joints;
  }

  public get id(): string {
    return this._id;
  }

  public get type(): Physics2DType {
    return this._type;
  }

  public get mass(): number {
    return this._mass;
  }

  public get friction(): number {
    return this._friction;
  }

  public get shape(): PhysicsShapeType {
    return this._shape;
  }

  public get joints(): RapierJoint[] {
    return this._joints;
  }
}
