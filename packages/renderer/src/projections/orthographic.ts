import { mat4 } from "gl-matrix";

import { Projection } from "@silwalanish/engine";

export class Orthographic implements Projection {
  private _left: number;
  private _right: number;
  private _top: number;
  private _bottom: number;
  private _near: number;
  private _far: number;
  private _projectionMatrix: mat4;

  public constructor(
    left: number,
    right: number,
    bottom: number,
    top: number,
    near: number,
    far: number
  ) {
    this._left = left;
    this._right = right;
    this._top = top;
    this._bottom = bottom;
    this._near = near;
    this._far = far;

    this._projectionMatrix = mat4.create();
    this._updateProjectionMatrix();
  }

  public get left(): number {
    return this._left;
  }

  public set left(value: number) {
    this._left = value;
    this._updateProjectionMatrix();
  }

  public get right(): number {
    return this._right;
  }

  public set right(value: number) {
    this._right = value;
    this._updateProjectionMatrix();
  }

  public get top(): number {
    return this._top;
  }

  public set top(value: number) {
    this._top = value;
    this._updateProjectionMatrix();
  }

  public get bottom(): number {
    return this._bottom;
  }

  public set bottom(value: number) {
    this._bottom = value;
    this._updateProjectionMatrix();
  }

  public get near(): number {
    return this._near;
  }

  public set near(value: number) {
    this._near = value;
    this._updateProjectionMatrix();
  }

  public get far(): number {
    return this._far;
  }

  public set far(value: number) {
    this._far = value;
    this._updateProjectionMatrix();
  }

  public getProjectionMatrix(): mat4 {
    return this._projectionMatrix;
  }

  private _updateProjectionMatrix() {
    mat4.ortho(
      this._projectionMatrix,
      this._left,
      this._right,
      this._bottom,
      this._top,
      this._near,
      this._far
    );
  }
}
