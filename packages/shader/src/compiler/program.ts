export interface ProgramSpecs {
  vertexShader: WebGLShader;
  fragmentShader: WebGLShader;
}

export class ProgramLinkingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProgramLinkingError";
  }
}

/**
 * Creates and links a WebGL program using the provided vertex and fragment shaders.
 *
 * @param gl - The WebGL2 rendering context used to create and manage the program.
 * @param programSpecs - An object containing the specifications for the program, including:
 *   - `vertexShader`: The compiled vertex shader.
 *   - `fragmentShader`: The compiled fragment shader.
 * @returns The linked WebGL program.
 * @throws Will throw an error if the program fails to link, including the program info log if available.
 */
export function createProgram(
  gl: WebGL2RenderingContext,
  programSpecs: ProgramSpecs
): WebGLProgram {
  var program = gl.createProgram();

  gl.attachShader(program, programSpecs.vertexShader);
  gl.attachShader(program, programSpecs.fragmentShader);
  gl.linkProgram(program);

  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!success) {
    const info = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new ProgramLinkingError(info || "Unable to link program");
  }

  return program;
}
