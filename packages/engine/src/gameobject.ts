import { Mesh } from "./mesh";
import { Physics2D } from "./physics2d";
import { Transform } from "./transform";
import { PhysicsBody } from "./physicsbody";

export interface GameObject {
  get id(): string;
  get name(): string;
  get mesh(): Mesh | null;
  get transform(): Transform;
  get children(): GameObject[];
  get physics(): Physics2D | null;
  get parent(): GameObject | null;
  get physicsBody(): PhysicsBody | null;

  set mesh(value: Mesh | null);
  set transform(value: Transform);
  set physics(value: Physics2D | null);
  set parent(value: GameObject | null);
  set physicsBody(value: PhysicsBody | null);

  update(deltaTime: number): void;
  addChild(child: GameObject): void;
  removeChild(child: GameObject): void;
}
