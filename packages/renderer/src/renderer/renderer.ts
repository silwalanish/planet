import { mat4 } from "gl-matrix";
import { GameObject, Mesh, Projection, Scene } from "@silwalanish/engine";

import { RenderBuffer } from "./renderbuffer";
import { CanvasSurface } from "../surface/canvassurface";

export interface Viewport {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class Renderer {
  private _gl: WebGL2RenderingContext;
  private _surface: CanvasSurface;
  private _viewport: Viewport;
  private _renderObjects: { [key: string]: RenderBuffer };

  public constructor(surface: CanvasSurface) {
    this._surface = surface;

    let gl = this._surface.domElement.getContext("webgl2", {
      antialias: true,
    });
    if (!gl) {
      throw new Error("WebGL not supported");
    }

    this._viewport = {
      x: 0,
      y: 0,
      width: gl.drawingBufferWidth,
      height: gl.drawingBufferHeight,
    };

    this._gl = gl;
    this._renderObjects = {};
  }

  public get viewport() {
    return this._viewport;
  }

  public get domElement() {
    return this._surface.domElement;
  }

  public get context() {
    return this._gl;
  }

  private _clear() {
    this._gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT);
    this._gl.viewport(
      this._viewport.x,
      this._viewport.y,
      this._viewport.width,
      this._viewport.height
    );
  }

  private _prepareRenderBuffer(mesh: Mesh): RenderBuffer {
    if (!this._renderObjects[mesh.geometry.id]) {
      const buffer = new RenderBuffer();
      buffer.create(this._gl);
      buffer.bind(this._gl);
      buffer.setVerticesData(
        this._gl,
        mesh.material.getPostitionAttribLocation(),
        mesh.geometry.vertices,
        this._gl.STATIC_DRAW
      );
      buffer.setNormalsData(
        this._gl,
        mesh.material.getNormalAttribLocation(),
        mesh.geometry.normals,
        this._gl.STATIC_DRAW
      );
      buffer.setUVsData(
        this._gl,
        mesh.material.getUVAttribLocation(),
        mesh.geometry.uvs,
        this._gl.STATIC_DRAW
      );
      buffer.setIndicesData(
        this._gl,
        mesh.geometry.indices,
        this._gl.STATIC_DRAW
      );

      this._renderObjects[mesh.geometry.id] = buffer;
    }

    return this._renderObjects[mesh.geometry.id] as RenderBuffer;
  }

  public render(scene: Scene, projection: Projection) {
    this._clear();

    this._gl.enable(this._gl.DEPTH_TEST);
    this._gl.depthFunc(this._gl.LEQUAL);

    const projectionMatrix = projection.getProjectionMatrix();
    const viewMatrix = scene.camera.getViewMatrix();

    const gameObjects: GameObject[] = [scene.root];

    while (gameObjects.length > 0) {
      const gameObject = gameObjects.pop() as GameObject;

      if (gameObject.mesh) {
        gameObject.mesh.material.use(this._gl);
        gameObject.mesh.material.setProjectionMatrix(
          this._gl,
          projectionMatrix
        );
        gameObject.mesh.material.setViewMatrix(this._gl, viewMatrix);

        const modelMatrix = mat4.create();
        mat4.multiply(
          modelMatrix,
          gameObject.transform.getWorldMatrix(),
          gameObject.transform.getLocalMatrix()
        );
        gameObject.mesh.material.setModelMatrix(this._gl, modelMatrix);

        const buffer = this._prepareRenderBuffer(gameObject.mesh);
        buffer.render(this._gl);
      }

      for (const child of gameObject.children) {
        gameObjects.push(child);
      }
    }
  }
}
