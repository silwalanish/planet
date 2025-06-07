import { View } from "./view";
import { GameObject } from "./gameobject";

export interface Scene<ShapeType> {
  get id(): string;
  get root(): GameObject<ShapeType>;
  get camera(): View;
  set camera(value: View);
  set root(value: GameObject<ShapeType>);

  update(deltaTime: number): void;
  physicsUpdate(): void;

  registerNode(node: GameObject<ShapeType>): void;
  addNode(node: GameObject<ShapeType>): void;
}
