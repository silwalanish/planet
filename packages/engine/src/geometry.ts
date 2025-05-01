import { vec2, vec3 } from "gl-matrix";

export interface Geometry {
  get id(): string;
  get vertices(): vec3[];
  get normals(): vec3[];
  get uvs(): vec2[];
  get indices(): number[];

  set vertices(value: vec3[]);
  set normals(value: vec3[]);
  set uvs(value: vec2[]);
  set indices(value: number[]);
}
