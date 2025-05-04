import { vec2, vec3 } from "gl-matrix";

export class RenderBuffer {
  private _vbo: WebGLBuffer | null;
  private _nbo: WebGLBuffer | null;
  private _ubo: WebGLBuffer | null;
  private _ibo: WebGLBuffer | null;
  private _vao: WebGLVertexArrayObject | null;
  private _vertexCount: number;
  private _indexType: GLuint;

  constructor() {
    this._vbo = null;
    this._nbo = null;
    this._ubo = null;
    this._ibo = null;
    this._vao = null;
    this._vertexCount = 0;
    this._indexType = WebGL2RenderingContext.UNSIGNED_BYTE;
  }

  public create(gl: WebGL2RenderingContext): void {
    this._vao = gl.createVertexArray();
    if (!this._vao) {
      throw new Error("Failed to create vertex array.");
    }
  }

  public destroy(gl: WebGL2RenderingContext): void {
    if (this._vao) {
      gl.deleteVertexArray(this._vao);
      this._vao = null;
    }
    if (this._vbo) {
      gl.deleteBuffer(this._vbo);
      this._vbo = null;
    }
    if (this._nbo) {
      gl.deleteBuffer(this._nbo);
      this._nbo = null;
    }
    if (this._ubo) {
      gl.deleteBuffer(this._ubo);
      this._ubo = null;
    }
    if (this._ibo) {
      gl.deleteBuffer(this._ibo);
      this._ibo = null;
    }
  }

  public bind(gl: WebGL2RenderingContext): void {
    if (!this._vao) {
      throw new Error("Buffer not created");
    }
    gl.bindVertexArray(this._vao);
  }

  public render(gl: WebGL2RenderingContext): void {
    if (!this._vao) {
      throw new Error("Buffer not created");
    }

    this.bind(gl);
    gl.drawElements(gl.TRIANGLES, this._vertexCount, this._indexType, 0);
  }

  public setVerticesData(
    gl: WebGL2RenderingContext,
    attributeLocation: number,
    data: vec3[],
    usage: number = gl.STATIC_DRAW
  ): void {
    if (!this._vbo) {
      this._vbo = gl.createBuffer();
      if (!this._vbo) {
        throw new Error("Failed to create vertex buffer.");
      }
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, this._vbo);
    const floatArray = new Float32Array(data.length * 3);
    for (let i = 0; i < data.length; i++) {
      const vertex = data[i] as vec3;

      floatArray[i * 3] = vertex[0];
      floatArray[i * 3 + 1] = vertex[1];
      floatArray[i * 3 + 2] = vertex[2];
    }
    gl.bufferData(gl.ARRAY_BUFFER, floatArray, usage);
    gl.enableVertexAttribArray(attributeLocation);
    gl.vertexAttribPointer(attributeLocation, 3, gl.FLOAT, false, 0, 0);
  }

  public setNormalsData(
    gl: WebGL2RenderingContext,
    attributeLocation: number,
    data: vec3[],
    usage: number = gl.STATIC_DRAW
  ): void {
    if (!this._nbo) {
      this._nbo = gl.createBuffer();
      if (!this._nbo) {
        throw new Error("Failed to create normal buffer.");
      }
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, this._nbo);
    const floatArray = new Float32Array(data.length * 3);
    for (let i = 0; i < data.length; i++) {
      const vertex = data[i] as vec3;

      floatArray[i * 3] = vertex[0];
      floatArray[i * 3 + 1] = vertex[1];
      floatArray[i * 3 + 2] = vertex[2];
    }
    gl.bufferData(gl.ARRAY_BUFFER, floatArray, usage);
    gl.enableVertexAttribArray(attributeLocation);
    gl.vertexAttribPointer(attributeLocation, 3, gl.FLOAT, false, 0, 0);
  }

  public setUVsData(
    gl: WebGL2RenderingContext,
    attributeLocation: number,
    data: vec2[],
    usage: number = gl.STATIC_DRAW
  ): void {
    if (!this._ubo) {
      this._ubo = gl.createBuffer();
      if (!this._ubo) {
        throw new Error("Failed to create uvs buffer.");
      }
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, this._ubo);
    const floatArray = new Float32Array(data.length * 2);
    for (let i = 0; i < data.length; i++) {
      const vertex = data[i] as vec2;

      floatArray[i * 2] = vertex[0];
      floatArray[i * 2 + 1] = vertex[1];
    }
    gl.bufferData(gl.ARRAY_BUFFER, floatArray, usage);
    gl.enableVertexAttribArray(attributeLocation);
    gl.vertexAttribPointer(attributeLocation, 2, gl.FLOAT, false, 0, 0);
  }

  public setIndicesData(
    gl: WebGL2RenderingContext,
    data: number[],
    usage: number = gl.STATIC_DRAW
  ): void {
    if (!this._ibo) {
      this._ibo = gl.createBuffer();
      if (!this._ibo) {
        throw new Error("Failed to create indices buffer.");
      }
    }
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._ibo);

    let ArrayClass:
      | Uint8ArrayConstructor
      | Uint16ArrayConstructor
      | Uint32ArrayConstructor = Uint8Array;
    this._indexType = gl.UNSIGNED_BYTE;
    if (data.length > 255 && data.length <= 65535) {
      ArrayClass = Uint16Array;
      this._indexType = gl.UNSIGNED_SHORT;
    } else {
      ArrayClass = Uint32Array;
      this._indexType = gl.UNSIGNED_INT;
    }

    const uintArray = new ArrayClass(data.length);
    for (let i = 0; i < data.length; i++) {
      uintArray[i] = data[i] as number;
    }
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, uintArray, usage);

    this._vertexCount = data.length;
  }
}
