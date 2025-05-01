import { View } from "./view";
import { GameObject } from "./gameobject";

export interface Scene {
  get id(): string;
  get root(): GameObject;
  get camera(): View;
  set camera(value: View);
  set root(value: GameObject);

  update(deltaTime: number): void;
  addNode(node: GameObject): void;
}
