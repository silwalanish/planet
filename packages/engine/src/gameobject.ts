import { Mesh } from "./mesh";
import { Scene } from "./scene";
import { Physics2D } from "./physics2d";
import { Transform } from "./transform";
import { PhysicsBody } from "./physicsbody";

export interface GameObject<ShapeType = any> {
  get id(): string;
  get name(): string;
  get mesh(): Mesh | null;
  get transform(): Transform;
  get children(): GameObject[];
  get physics(): Physics2D<ShapeType> | null;
  get parent(): GameObject | null;
  get physicsBody(): PhysicsBody | null;
  get scene(): Scene<ShapeType> | null;

  set mesh(value: Mesh | null);
  set transform(value: Transform);
  set physics(value: Physics2D<ShapeType> | null);
  set parent(value: GameObject | null);
  set physicsBody(value: PhysicsBody | null);
  set scene(value: Scene<ShapeType> | null);

  update(deltaTime: number): void;
  physicsUpdate(): void;
  addChild(child: GameObject): void;
  removeChild(child: GameObject): void;
}
