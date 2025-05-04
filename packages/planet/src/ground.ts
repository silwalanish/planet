import alea from "alea";
import { nanoid } from "nanoid";
import { vec3, vec2 } from "gl-matrix";
import { Geometry } from "@silwalanish/engine";
import { createNoise2D, NoiseFunction2D } from "simplex-noise";

const SIZE = { x: 100, y: 20 };
const LOD = vec2.fromValues(1000, 1);

function fbm(
  x: number,
  y: number,
  noise: NoiseFunction2D,
  octaves: number,
  persistence: number,
  lacunarity: number
): number {
  let value = 0;
  let amplitude = 1.0;
  let frequency = 1.0;
  let maxAmplitude = 0;

  for (let i = 0; i < octaves; i++) {
    value += noise(x * frequency, y * frequency) * amplitude;
    maxAmplitude += amplitude;
    amplitude *= persistence;
    frequency *= lacunarity;
  }

  return value / maxAmplitude; // Normalize the result
}

export class Ground implements Geometry {
  private _id: string;
  private _vertices: vec3[];
  private _normals: vec3[];
  private _uvs: vec2[];
  private _indices: number[];

  private _offset: vec3;
  private _lod: vec2;
  private _width: number;
  private _height: number;
  private _noise: NoiseFunction2D;

  constructor(offset: vec3, seed: number) {
    this._id = nanoid();
    this._noise = createNoise2D(alea(seed));

    this._lod = LOD;
    this._width = SIZE.x;
    this._height = SIZE.y;
    this._offset = offset;

    this._vertices = [];
    this._normals = [];
    this._uvs = [];
    this._indices = [];

    this.init();
  }

  public init() {
    const segmentsX = this._lod[0] + 2;
    const segmentsY = this._lod[1] + 2;
    const stepSizeX = this._width / (segmentsX - 1);
    const stepSizeY = this._height / (segmentsY - 1);
    const halfWidth = this._width / 2;
    const halfHeight = this._height / 2;

    const z = 0;
    for (let i = 0; i < segmentsX; i++) {
      const x = -halfWidth + i * stepSizeX;
      const u = i / (segmentsX - 1);

      for (let j = 0; j < segmentsY; j++) {
        let y = this._offset[1] - halfHeight + j * stepSizeY;
        const v = j / (segmentsY - 1);

        if (j === segmentsY - 1) {
          y += fbm(u + this._offset[0], 1.0, this._noise, 6, 0.5, 2.0) * 15;
        }

        this._vertices.push(vec3.fromValues(x, y, z));
        this._normals.push(vec3.fromValues(0, 0, 1));
        this._uvs.push(vec2.fromValues(u, v));
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
