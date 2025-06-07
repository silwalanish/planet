import { View } from "./view";
import { GameObject } from "./gameobject";

export interface Scene<ShapeType, JointType> {
  get id(): string;
  get root(): GameObject<ShapeType, JointType>;
  get camera(): View;
  set camera(value: View);
  set root(value: GameObject<ShapeType, JointType>);

  update(deltaTime: number): void;
  physicsUpdate(): void;

  registerNode(node: GameObject<ShapeType, JointType>): void;
  addNode(node: GameObject<ShapeType, JointType>): void;
}
