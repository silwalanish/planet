import { Scene } from "./scene";
import { World2D } from "./world2d";

export interface Scene2D extends Scene {
  get world(): World2D;
}
