import { Geometry } from "./geometry";
import { Material } from "./material";

export interface Mesh {
  get geometry(): Geometry;
  get material(): Material;

  set geometry(value: Geometry);
  set material(value: Material);
}
