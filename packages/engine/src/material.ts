import { mat4 } from "gl-matrix";

export interface Material {
  get id(): string;
  get name(): string;

  use(gl: WebGL2RenderingContext): void;

  setProjectionMatrix(gl: WebGL2RenderingContext, projectionMatrix: mat4): void;
  setViewMatrix(gl: WebGL2RenderingContext, viewMatrix: mat4): void;
  setModelMatrix(gl: WebGL2RenderingContext, modelMatrix: mat4): void;

  getPostitionAttribLocation(): GLint;
  getNormalAttribLocation(): GLint;
  getUVAttribLocation(): GLint;
}
