import { Scene } from "./scene";
import { World2D } from "./world2d";

export interface Scene2D<ShapeType> extends Scene<ShapeType> {
  get world(): World2D<ShapeType>;
}
