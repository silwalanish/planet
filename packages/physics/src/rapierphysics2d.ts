import { nanoid } from "nanoid";
import { ColliderDesc } from "@dimforge/rapier2d";
import { Physics2D, Physics2DType } from "@silwalanish/engine";

export class RapierPhysics2D implements Physics2D<ColliderDesc> {
  private _id: string;
  private _type: Physics2DType;
  private _mass: number;
  private _friction: number;
  private _shape: ColliderDesc;

  public constructor(
    type: Physics2DType,
    mass: number,
    friction: number,
    shape: ColliderDesc
  ) {
    this._id = nanoid();
    this._type = type;
    this._mass = mass;
    this._friction = friction;
    this._shape = shape;
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

  public get shape(): ColliderDesc {
    return this._shape;
  }
}
