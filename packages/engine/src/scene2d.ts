import { Scene } from "./scene";
import { World2D } from "./world2d";

export interface Scene2D<ShapeType, JointType>
  extends Scene<ShapeType, JointType> {
  get world(): World2D<ShapeType, JointType>;
}
