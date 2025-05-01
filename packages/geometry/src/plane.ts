import { nanoid } from "nanoid";
import { vec3, vec2 } from "gl-matrix";
import { Geometry } from "@silwalanish/engine";

const SIZE = { x: 1, y: 1 };

export class Plane implements Geometry {
  private _id: string;
  private _vertices: vec3[];
  private _normals: vec3[];
  private _uvs: vec2[];
  private _indices: number[];

  private _lod: number;
  private _width: number;
  private _height: number;

  constructor(
    width: number = SIZE.x,
    height: number = SIZE.y,
    lod: number = 1
  ) {
    this._id = nanoid();

    this._lod = lod;
    this._width = width;
    this._height = height;

    this._vertices = [];
    this._normals = [];
    this._uvs = [];
    this._indices = [];

    this.init();
  }

  public init() {
    const segmentsX = this._lod + 2;
    const segmentsY = this._lod + 2;
    const stepSizeX = this._width / (segmentsX - 1);
    const stepSizeY = this._height / (segmentsY - 1);
    const halfWidth = this._width / 2;
    const halfHeight = this._height / 2;

    const z = 0;
    for (let i = 0; i < segmentsX; i++) {
      const x = -halfWidth + i * stepSizeX;

      for (let j = 0; j < segmentsY; j++) {
        let y = -halfHeight + j * stepSizeY;

        this._vertices.push(vec3.fromValues(x, y, z));
        this._normals.push(vec3.fromValues(0, 0, 1));
        this._uvs.push(vec2.fromValues(i / segmentsX, j / segmentsY));
      }
    }

    for (let i = 0; i < segmentsX - 1; i++) {
      for (let j = 0; j < segmentsY - 1; j++) {
        const a = i * segmentsY + j;
        const b = a + segmentsY;
        const c = a + 1;
        const d = b + 1;

        this._indices.push(a, b, c);
        this._indices.push(b, d, c);
      }
    }
  }

  get id(): string {
    return this._id;
  }

  get vertices(): vec3[] {
    return this._vertices;
  }

  set vertices(value: vec3[]) {
    this._vertices = value;
  }

  get normals(): vec3[] {
    return this._normals;
  }

  set normals(value: vec3[]) {
    this._normals = value;
  }

  get uvs(): vec2[] {
    return this._uvs;
  }

  set uvs(value: vec2[]) {
    this._uvs = value;
  }

  get indices(): number[] {
    return this._indices;
  }

  set indices(value: number[]) {
    this._indices = value;
  }
}
