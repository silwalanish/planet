import { nanoid } from "nanoid";
import { mat4 } from "gl-matrix";

import { compile, ShaderCompilationSpecs } from "./compiler/compile";
import { generateShaderCode, ShaderSpecs, Uniform } from "./generator/generate";
import { Material } from "@silwalanish/engine";

const DEFAULT_UNIFORMS: Uniform[] = [
  {
    name: "u_projection",
    type: "mat4",
  },
  {
    name: "u_view",
    type: "mat4",
  },
  {
    name: "u_model",
    type: "mat4",
  },
];

export class Shader implements Material {
  private _id: string;
  private _name: string;
  private _program: WebGLProgram | null;
  private _positionAttribLocation: GLint;
  private _normalAttribLocation: GLint;
  private _uvAttribLocation: GLint;
  private _uniformLocations: Record<string, WebGLUniformLocation | null>;

  private _shaderSpecs: ShaderCompilationSpecs;
  private _vertexSpecs: ShaderSpecs;
  private _fragmentSpecs: ShaderSpecs;

  public constructor(
    name: string,
    vertexSpecs: ShaderSpecs,
    fragmentSpecs: ShaderSpecs
  ) {
    this._vertexSpecs = vertexSpecs;
    this._fragmentSpecs = fragmentSpecs;

    this._id = nanoid();
    this._name = name;
    this._program = null;
    this._positionAttribLocation = -1;
    this._normalAttribLocation = -1;
    this._uvAttribLocation = -1;
    this._shaderSpecs = {
      vertexShaderSource: "",
      fragmentShaderSource: "",
    };
    this._uniformLocations = {};

    this._generateCode();
  }

  public get id(): string {
    return this._id;
  }

  public get name(): string {
    return this._name;
  }

  private _generateCode(): void {
    this._shaderSpecs = {
      vertexShaderSource: generateShaderCode(this._vertexSpecs),
      fragmentShaderSource: generateShaderCode(this._fragmentSpecs),
    };
  }

  private _compile(gl: WebGL2RenderingContext): void {
    this._program = compile(gl, this._shaderSpecs);

    this._positionAttribLocation = gl.getAttribLocation(
      this._program,
      "a_position"
    );
    this._normalAttribLocation = gl.getAttribLocation(
      this._program,
      "a_normal"
    );
    this._uvAttribLocation = gl.getAttribLocation(this._program, "a_texcoord");

    let uniforms: Uniform[] = [
      ...DEFAULT_UNIFORMS,
      ...this._vertexSpecs.additionalUniforms,
      ...this._fragmentSpecs.additionalUniforms,
    ];

    for (const uniform of uniforms) {
      this._uniformLocations[uniform.name] = gl.getUniformLocation(
        this._program,
        uniform.name
      );
    }
  }

  public getUniformLocation(name: string): WebGLUniformLocation | null {
    return this._uniformLocations[name] || null;
  }

  public use(gl: WebGL2RenderingContext): void {
    if (!this._program) {
      this._compile(gl);
    }

    gl.useProgram(this._program);
  }

  public setProjectionMatrix(
    gl: WebGL2RenderingContext,
    projectionMatrix: mat4
  ): void {
    gl.uniformMatrix4fv(
      this.getUniformLocation("u_projection"),
      false,
      projectionMatrix
    );
  }

  public setViewMatrix(gl: WebGL2RenderingContext, viewMatrix: mat4): void {
    gl.uniformMatrix4fv(this.getUniformLocation("u_view"), false, viewMatrix);
  }

  public setModelMatrix(gl: WebGL2RenderingContext, modelMatrix: mat4): void {
    gl.uniformMatrix4fv(this.getUniformLocation("u_model"), false, modelMatrix);
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
