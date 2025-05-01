import { Geometry, Material, Mesh } from "@silwalanish/engine";

export class MeshComponent implements Mesh {
  geometry: Geometry;
  material: Material;

  public constructor(geometry: Geometry, material: Material) {
    this.geometry = geometry;
    this.material = material;
  }
}
