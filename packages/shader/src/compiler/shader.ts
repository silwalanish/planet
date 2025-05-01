type ShaderType =
  | typeof WebGL2RenderingContext.VERTEX_SHADER
  | typeof WebGL2RenderingContext.FRAGMENT_SHADER;

function shaderTypeToString(type: ShaderType): string {
  switch (type) {
    case WebGL2RenderingContext.VERTEX_SHADER:
      return "VERTEX_SHADER";
    case WebGL2RenderingContext.FRAGMENT_SHADER:
      return "FRAGMENT_SHADER";
    default:
      return "UNKNOWN_SHADER_TYPE";
  }
}

/**
 * Represents an error that occurs during the compilation of a shader.
 * This error provides detailed information about the shader type and source
 * code that caused the compilation failure.
 */
export class ShaderCompilationError extends Error {
  /**
   * The type of the shader that caused the error (e.g., vertex or fragment shader).
   */
  shaderType: ShaderType;

  /**
   * The source code of the shader that caused the error.
   */
  shaderSource: string;

  /**
   * Constructs a new `ShaderCompilationError` instance.
   *
   * @param message - A descriptive error message explaining the cause of the error.
   * @param shaderType - The type of the shader that caused the error.
   * @param shaderSource - The source code of the shader that caused the error.
   */
  constructor(message: string, shaderType: ShaderType, shaderSource: string) {
    super(ShaderCompilationError.getMessage(message, shaderSource));
    this.shaderType = shaderType;
    this.shaderSource = shaderSource;
    this.name = `ShaderCompilationError::${shaderTypeToString(
      this.shaderType
    )}:`;
  }

  /**
   * Generates a detailed error message that includes the shader source code
   * and the provided error message.
   *
   * @param message - The error message to include in the detailed output.
   * @param shaderSource - The source code of the shader that caused the error.
   * @returns A formatted error message containing the shader source and error details.
   */
  static getMessage(message: string, shaderSource: string): string {
    return `\n\n${shaderSource}\n\n${message}\n`;
  }
}

/**
 * Creates and compiles a WebGL shader.
 *
 * @param gl - The WebGL2 rendering context.
 * @param type - The type of shader to create (e.g., `gl.VERTEX_SHADER` or `gl.FRAGMENT_SHADER`).
 * @param source - The GLSL source code for the shader.
 * @returns The compiled WebGLShader object.
 * @throws {ShaderCompilationError} If the shader could not be created or compiled.
 */
export function createShader(
  gl: WebGL2RenderingContext,
  type: ShaderType,
  source: string
): WebGLShader {
  var shader = gl.createShader(type);
  if (!shader) {
    throw new ShaderCompilationError("Unable to create shader", type, source);
  }

  gl.shaderSource(shader, source.trim());
  gl.compileShader(shader);

  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!success) {
    var info = gl.getShaderInfoLog(shader);

    gl.deleteShader(shader);

    throw new ShaderCompilationError(
      info || "Unable to compile shader",
      type,
      source
    );
  }

  return shader;
}
