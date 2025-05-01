import { mat4 } from "gl-matrix";

export interface View {
  getViewMatrix(): mat4;
}
