import { GameObject } from "./gameobject";

export enum Physics2DType {
  STATIC = "static",
  DYNAMIC = "dynamic",
  KINEMATIC = "kinematic",
}

export interface Physics2DJoint<TShapeType, TJointData> {
  get id(): string;
  get bodies(): GameObject<TShapeType, TJointData>[];
  get jointData(): TJointData;
}

export interface Physics2D<TShapeType, TJointType> {
  get id(): string;
  get type(): Physics2DType;

  get mass(): number;
  get friction(): number;

  get shape(): TShapeType;

  get joints(): Physics2DJoint<TShapeType, TJointType>[];
}
