import { createProgram } from "./program";
import { createShader, ShaderType } from "./shader";

export interface ShaderCompilationSpecs {
  vertexShaderSource: string;
  fragmentShaderSource: string;
}

function _cleanUp(
  gl: WebGL2RenderingContext,
  program: WebGLProgram | null,
  shader: WebGLShader | null
) {
  if (shader) {
    if (program) {
      gl.detachShader(program, shader);
    }
    gl.deleteShader(shader);
  }
}

export function compile(
  gl: WebGL2RenderingContext,
  specs: ShaderCompilationSpecs
): WebGLProgram {
  let vertexShader: WebGLShader | null = null;
  let fragmentShader: WebGLShader | null = null;
  let program: WebGLProgram | null = null;
  try {
    vertexShader = createShader(
      gl,
      ShaderType.Vertex,
      specs.vertexShaderSource
    );

    fragmentShader = createShader(
      gl,
      ShaderType.Fragment,
      specs.fragmentShaderSource
    );

    program = createProgram(gl, {
      vertexShader,
      fragmentShader,
    });
  } finally {
    _cleanUp(gl, program, vertexShader);
    _cleanUp(gl, program, fragmentShader);
  }

  return program;
}
