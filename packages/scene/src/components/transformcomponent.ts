import { vec3, mat4, quat } from "gl-matrix";
import { Transform } from "@silwalanish/engine";

export class TransformComponent implements Transform {
  private _position: vec3;
  private _rotation: quat;
  private _scale: vec3;

  private _parent: Transform | null;
  private _localMatrix: mat4;
  private _worldMatrix: mat4;
  private _worldPosition: vec3;

  public constructor() {
    this._position = vec3.fromValues(0, 0, 0);
    this._rotation = quat.create();
    this._scale = vec3.fromValues(1, 1, 1);

    this._localMatrix = mat4.create();
    this._worldMatrix = mat4.create();
    this._worldPosition = vec3.create();
    this._parent = null;

    this.recalculate();
  }

  public get Position(): vec3 {
    return this._position;
  }

  public set Position(value: vec3) {
    this._position = value;
    this.recalculate();
  }

  public get Rotation(): quat {
    return this._rotation;
  }

  public set Rotation(value: quat) {
    this._rotation = value;
    this.recalculate();
  }

  public get Scale(): vec3 {
    return this._scale;
  }

  public set Scale(value: vec3) {
    this._scale = value;
    this.recalculate();
  }

  public get Parent(): Transform | null {
    return this._parent;
  }

  public set Parent(parent: Transform | null) {
    this._parent = parent;
    this.recalculate();
  }

  public recalculate(): void {
    mat4.fromRotationTranslationScale(
      this._localMatrix,
      this._rotation,
      this._position,
      this._scale
    );

    this._worldMatrix = this._localMatrix;
    if (this._parent) {
      mat4.multiply(
        this._worldMatrix,
        this._parent.getWorldMatrix(),
        this._localMatrix
      );
    }

    vec3.transformMat4(this._worldPosition, this._position, this._worldMatrix);
  }

  public getWorldMatrix(): mat4 {
    return this._worldMatrix;
  }

  public getLocalMatrix(): mat4 {
    return this._localMatrix;
  }

  public getWorldPosition(): vec3 {
    return this._worldPosition;
  }
}
