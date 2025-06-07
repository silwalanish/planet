export enum Physics2DType {
  STATIC = "static",
  DYNAMIC = "dynamic",
  KINEMATIC = "kinematic",
}

export interface Physics2D<TShapeType> {
  get id(): string;
  get type(): Physics2DType;

  get mass(): number;
  get friction(): number;

  get shape(): TShapeType;
}
