import { nanoid } from "nanoid";
import { mat4, vec4 } from "gl-matrix";
import { Material } from "@silwalanish/engine";

import { compile, ShaderSpecs } from "@silwalanish/shader";

const PLANET_MATERIAL_SPECS: ShaderSpecs = {
  vertexShaderSource: `
        #version 300 es
        in vec3 a_position;
        in vec3 a_normal;
        in vec2 a_texcoord;
    
        uniform mat4 u_projection;
        uniform mat4 u_view;
        uniform mat4 u_model;

        out vec3 v_position;
        out vec3 v_normal;
        out vec2 v_texcoord;
    
        void main() {
            gl_Position = u_projection * u_view * u_model * vec4(a_position, 1.0);

            v_position = a_position;
            v_normal = a_normal;
            v_texcoord = a_texcoord;
        }
    `,
  fragmentShaderSource: `
        #version 300 es
        precision highp float;
    
        in vec3 v_position;
        in vec3 v_normal;
        in vec2 v_texcoord;

        uniform vec4 u_grassColor;
        uniform vec4 u_soilColor;
        uniform vec4 u_rockColor;
    
        out vec4 outColor;
    
        void main() {
            if (v_position.y > 4.0) {
                outColor = u_grassColor;
            } else if (v_position.y > -3.0) {
                outColor = u_soilColor;
            } else {
                outColor = u_rockColor;
            }
        }
    `,
};

export class PlanetMaterial implements Material {
  private _id: string;
  private _name: string;
  private _program: WebGLProgram | null;
  private _grassColorLocation: WebGLUniformLocation | null;
  private _soilColorLocation: WebGLUniformLocation | null;
  private _rockColorLocation: WebGLUniformLocation | null;
  private _projectionMatrixLocation: WebGLUniformLocation | null;
  private _viewMatrixLocation: WebGLUniformLocation | null;
  private _modelMatrixLocation: WebGLUniformLocation | null;
  private _positionAttribLocation: GLint;
  private _normalAttribLocation: GLint;
  private _uvAttribLocation: GLint;

  public grassColor: vec4;
  public soilColor: vec4;
  public rockColor: vec4;

  public constructor(
    name: string,
    grassColor: vec4,
    soilColor: vec4,
    rockColor: vec4,
    id?: string
  ) {
    this._id = id || nanoid();
    this._name = name;
    this._program = null;
    this._grassColorLocation = null;
    this._soilColorLocation = null;
    this._rockColorLocation = null;
    this._projectionMatrixLocation = null;
    this._viewMatrixLocation = null;
    this._modelMatrixLocation = null;
    this._positionAttribLocation = -1;
    this._normalAttribLocation = -1;
    this._uvAttribLocation = -1;

    this.grassColor = grassColor;
    this.soilColor = soilColor;
    this.rockColor = rockColor;
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  private _compile(gl: WebGL2RenderingContext): void {
    this._program = compile(gl, PLANET_MATERIAL_SPECS);

    this._grassColorLocation = gl.getUniformLocation(
      this._program,
      "u_grassColor"
    );
    this._soilColorLocation = gl.getUniformLocation(
      this._program,
      "u_soilColor"
    );
    this._rockColorLocation = gl.getUniformLocation(
      this._program,
      "u_rockColor"
    );
    this._projectionMatrixLocation = gl.getUniformLocation(
      this._program,
      "u_projection"
    );
    this._viewMatrixLocation = gl.getUniformLocation(this._program, "u_view");
    this._modelMatrixLocation = gl.getUniformLocation(this._program, "u_model");
    this._positionAttribLocation = gl.getAttribLocation(
      this._program,
      "a_position"
    );
    this._normalAttribLocation = gl.getAttribLocation(
      this._program,
      "a_normal"
    );
    this._uvAttribLocation = gl.getAttribLocation(this._program, "a_texcoord");
  }

  public use(gl: WebGL2RenderingContext): void {
    if (!this._program) {
      this._compile(gl);
    }

    gl.useProgram(this._program);
    gl.uniform4fv(this._grassColorLocation, this.grassColor);
    gl.uniform4fv(this._soilColorLocation, this.soilColor);
    gl.uniform4fv(this._rockColorLocation, this.rockColor);
  }

  public setProjectionMatrix(
    gl: WebGL2RenderingContext,
    projectionMatrix: mat4
  ): void {
    gl.uniformMatrix4fv(
      this._projectionMatrixLocation,
      false,
      projectionMatrix
    );
  }

  public setViewMatrix(gl: WebGL2RenderingContext, viewMatrix: mat4): void {
    gl.uniformMatrix4fv(this._viewMatrixLocation, false, viewMatrix);
  }

  public setModelMatrix(gl: WebGL2RenderingContext, modelMatrix: mat4): void {
    gl.uniformMatrix4fv(this._modelMatrixLocation, false, modelMatrix);
  }

  public getPostitionAttribLocation(): GLint {
    return this._positionAttribLocation;
  }

  public getNormalAttribLocation(): GLint {
    return this._normalAttribLocation;
  }

  public getUVAttribLocation(): GLint {
    return this._uvAttribLocation;
  }
}
