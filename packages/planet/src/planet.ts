import { nanoid } from "nanoid";
import { vec3, vec2 } from "gl-matrix";
import { Geometry } from "@silwalanish/engine";

const STRIP_WIDTH = 100;
const STRIP_HEIGHT = 10;
const LOD = { x: 200, y: 2 };

export class Planet implements Geometry {
  private _id: string;
  private _vertices: vec3[];
  private _normals: vec3[];
  private _uvs: vec2[];
  private _indices: number[];

  constructor() {
    this._id = nanoid();

    this._vertices = [];
    this._normals = [];
    this._uvs = [];
    this._indices = [];

    this.init();
  }

  public init() {
    const segmentsX = LOD.x + 2;
    const segmentsY = LOD.y + 2;
    const stepSizeX = STRIP_WIDTH / (segmentsX - 1);
    const stepSizeY = STRIP_HEIGHT / (segmentsY - 1);
    const halfWidth = STRIP_WIDTH / 2;
    const halfHeight = STRIP_HEIGHT / 2;

    const z = 0;
    for (let i = 0; i < segmentsX; i++) {
      const x = -halfWidth + i * stepSizeX;

      for (let j = 0; j < segmentsY; j++) {
        let y = -halfHeight + j * stepSizeY;

        if (j === segmentsY - 1) {
          y += Math.sin((i / segmentsX) * Math.PI * 2) * 0.5;
        }

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
