import { vec2 } from "gl-matrix";

export enum Physics2DType {
  STATIC = "static",
  DYNAMIC = "dynamic",
  KINEMATIC = "kinematic",
}

export interface Physics2D {
  get id(): string;
  get type(): Physics2DType;

  get density(): number;
  get friction(): number;

  get shape(): vec2[];
}
