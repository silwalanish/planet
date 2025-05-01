import { mat4, quat, vec3 } from "gl-matrix";

export interface Transform {
  get Position(): vec3;
  get Rotation(): quat;
  get Scale(): vec3;
  get Parent(): Transform | null;

  set Position(value: vec3);
  set Rotation(value: quat);
  set Scale(value: vec3);
  set Parent(parent: Transform | null);

  getWorldMatrix(): mat4;
  getLocalMatrix(): mat4;
  getWorldPosition(): vec3;

  recalculate(): void;
}
