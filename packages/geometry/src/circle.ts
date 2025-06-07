import { nanoid } from "nanoid";
import { vec3, vec2 } from "gl-matrix";
import { Geometry } from "@silwalanish/engine";

const DEFAULT_RADIUS = 1;
const DEFAULT_SEGMENTS = 32;

export class Circle implements Geometry {
  private _id: string;
  private _vertices: vec3[];
  private _normals: vec3[];
  private _uvs: vec2[];
  private _indices: number[];

  private _radius: number;
  private _segments: number;

  constructor(
    radius: number = DEFAULT_RADIUS,
    segments: number = DEFAULT_SEGMENTS
  ) {
    this._id = nanoid();
    this._radius = radius;
    this._segments = Math.max(3, segments); // A circle needs at least 3 segments

    this._vertices = [];
    this._normals = [];
    this._uvs = [];
    this._indices = [];

    this.init();
  }

  public init(): void {
    const center = vec3.fromValues(0, 0, 0);
    const centerUv = vec2.fromValues(0.5, 0.5);
    const normal = vec3.fromValues(0, 0, 1); // Assuming circle is on XY plane

    this._vertices.push(center);
    this._normals.push(normal);
    this._uvs.push(centerUv);

    for (let i = 0; i <= this._segments; i++) {
      const angle = (i / this._segments) * Math.PI * 2;
      const x = Math.cos(angle) * this._radius;
      const y = Math.sin(angle) * this._radius;
      const z = 0;

      this._vertices.push(vec3.fromValues(x, y, z));
      this._normals.push(normal);

      const u = (x / this._radius + 1) / 2;
      const v = (y / this._radius + 1) / 2;
      this._uvs.push(vec2.fromValues(u, v));
    }

    for (let i = 1; i <= this._segments; i++) {
      this._indices.push(0, i, i + 1);
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
