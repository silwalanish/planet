import { Mesh } from "./mesh";
import { Scene } from "./scene";
import { Physics2D } from "./physics2d";
import { Transform } from "./transform";
import { PhysicsBody } from "./physicsbody";

export interface GameObject<ShapeType, JointType> {
  get id(): string;
  get name(): string;
  get mesh(): Mesh | null;
  get transform(): Transform;
  get children(): GameObject<ShapeType, JointType>[];
  get physics(): Physics2D<ShapeType, JointType> | null;
  get parent(): GameObject<ShapeType, JointType> | null;
  get physicsBody(): PhysicsBody | null;
  get scene(): Scene<ShapeType, JointType> | null;

  set mesh(value: Mesh | null);
  set transform(value: Transform);
  set physics(value: Physics2D<ShapeType, JointType> | null);
  set parent(value: GameObject<ShapeType, JointType> | null);
  set physicsBody(value: PhysicsBody | null);
  set scene(value: Scene<ShapeType, JointType> | null);

  update(deltaTime: number): void;
  physicsUpdate(): void;
  addChild(child: GameObject<ShapeType, JointType>): void;
  removeChild(child: GameObject<ShapeType, JointType>): void;
}
