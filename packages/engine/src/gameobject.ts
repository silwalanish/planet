import { Mesh } from "./mesh";
import { Transform } from "./transform";

export interface GameObject {
  get id(): string;
  get name(): string;
  get mesh(): Mesh | null;
  get transform(): Transform;
  get children(): GameObject[];
  get parent(): GameObject | null;

  set mesh(value: Mesh | null);
  set transform(value: Transform);
  set parent(value: GameObject | null);

  update(deltaTime: number): void;
  addChild(child: GameObject): void;
  removeChild(child: GameObject): void;
}
