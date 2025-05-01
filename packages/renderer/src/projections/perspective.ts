import { glMatrix, mat4 } from "gl-matrix";

import { Projection } from "@silwalanish/engine";

export class Perspective implements Projection {
  private _fov: number;
  private _aspect: number;
  private _near: number;
  private _far: number;
  private _projectionMatrix: mat4;

  public constructor(fov: number, aspect: number, near: number, far: number) {
    this._fov = fov;
    this._aspect = aspect;
    this._near = near;
    this._far = far;

    this._projectionMatrix = mat4.create();
    this._updateProjectionMatrix();
  }

  public get fov(): number {
    return this._fov;
  }

  public set fov(value: number) {
    this._fov = value;
    this._updateProjectionMatrix();
  }

  public get aspect(): number {
    return this._aspect;
  }

  public set aspect(value: number) {
    this._aspect = value;
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
    mat4.perspective(
      this._projectionMatrix,
      glMatrix.toRadian(this._fov),
      this._aspect,
      this._near,
      this._far
    );
  }
}
