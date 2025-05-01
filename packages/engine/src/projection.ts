import { mat4 } from "gl-matrix";

export interface Projection {
  getProjectionMatrix(): mat4;
}
