import { nanoid } from "nanoid";
import { mat4, quat, vec3 } from "gl-matrix";
import { RigidBodyDesc, World } from "@dimforge/rapier2d";
import {
  GameObject,
  Physics2DType,
  PhysicsBody,
  Scene2D,
  World2D,
} from "@silwalanish/engine";

import { quatToEuler } from "./maths";
import { PhysicsShapeType } from "./physicsshapetype";
import { RapierPhysicsBody } from "./rapierphysicsbody";

const GRAVITY = -10;
const SCALE_FACTOR = 1;

export class RapierWorld2D implements World2D<PhysicsShapeType> {
  private _id: string;
  private _world: World;
  private _scene: Scene2D<PhysicsShapeType>;
  private _bodies: Map<string, RapierPhysicsBody>;

  public constructor(scene: Scene2D<PhysicsShapeType>) {
    this._id = nanoid();
    this._world = new World({ x: 0, y: GRAVITY });
    this._bodies = new Map<string, RapierPhysicsBody>();
    this._scene = scene;
  }

  get id(): string {
    return this._id;
  }

  public createBody(gameObject: GameObject<PhysicsShapeType>): PhysicsBody {
    if (!gameObject.physics) {
      throw new Error("GameObject does not have a physics component.");
    }

    if (this._bodies.has(gameObject.physics.id)) {
      return this._bodies.get(gameObject.physics.id)!;
    }

    const physics = gameObject.physics;
    const worldPosition = gameObject.transform.getWorldPosition();
    const worldRotation = gameObject.transform.getWorldRotation();
    const eulerRotation = quatToEuler(worldRotation);

    let physicsBodyDesc = null;

    if (physics.type === Physics2DType.STATIC) {
      physicsBodyDesc = RigidBodyDesc.fixed();
    } else if (physics.type === Physics2DType.DYNAMIC) {
      physicsBodyDesc = RigidBodyDesc.dynamic();
    } else if (physics.type === Physics2DType.KINEMATIC) {
      throw new Error("Kinematic bodies are not supported in yet.");
    }

    if (!physicsBodyDesc) {
      throw new Error("Invalid physics type.");
    }

    physicsBodyDesc.setTranslation(
      worldPosition[0] / SCALE_FACTOR,
      worldPosition[1] / SCALE_FACTOR
    );
    physicsBodyDesc.setRotation(eulerRotation[2]);

    const rigidBody = this._world.createRigidBody(physicsBodyDesc);
    const colliderDesc = gameObject.physics.shape;
    colliderDesc.setFriction(physics.friction);
    colliderDesc.setMass(physics.mass);

    const collider = this._world.createCollider(colliderDesc, rigidBody);

    const physicsBody = new RapierPhysicsBody(rigidBody, collider);

    this._bodies.set(physics.id, physicsBody);

    return physicsBody;
  }

  private _syncPosition(
    gameObject: GameObject<PhysicsShapeType>,
    body: RapierPhysicsBody
  ) {
    const physicsPosition = body.rigidBody.translation();

    const worldPosition = vec3.fromValues(
      physicsPosition.x * SCALE_FACTOR,
      physicsPosition.y * SCALE_FACTOR,
      gameObject.transform.getWorldPosition()[2]
    );

    const invWorldMatrix = mat4.invert(
      mat4.create(),
      gameObject.transform.Parent?.getWorldMatrix() ||
        gameObject.transform.getLocalMatrix()
    );

    const localPosition = vec3.transformMat4(
      vec3.create(),
      worldPosition,
      invWorldMatrix
    );

    gameObject.transform.Position = localPosition;
  }

  private _syncRotation(
    gameObject: GameObject<PhysicsShapeType>,
    body: RapierPhysicsBody
  ) {
    const objectRotation = quatToEuler(
      gameObject.transform.Parent?.getWorldRotation() ||
        gameObject.transform.Rotation
    );
    const physicsAngle = body.rigidBody.rotation();
    const physicsRotation = quat.fromEuler(
      quat.create(),
      objectRotation[0],
      objectRotation[1],
      physicsAngle * (180 / Math.PI) // Convert radians to degrees
    );

    if (gameObject.transform.Parent) {
      const inverseRotation = quat.invert(
        quat.create(),
        gameObject.transform.Parent.getWorldRotation()
      );
      const localRotation = quat.multiply(
        quat.create(),
        inverseRotation,
        physicsRotation
      );
      gameObject.transform.Rotation = localRotation;
    } else {
      gameObject.transform.Rotation = physicsRotation;
    }
  }

  private _syncToScene() {
    const root = this._scene.root;
    const objects = [root];

    while (objects.length > 0) {
      const gameObject = objects.pop() as GameObject<PhysicsShapeType>;

      if (gameObject.physics && this._bodies.has(gameObject.physics.id)) {
        const body = this._bodies.get(gameObject.physics.id);

        if (!body) {
          continue;
        }

        this._syncPosition(gameObject, body);
        this._syncRotation(gameObject, body);
      }

      for (const child of gameObject.children) {
        objects.push(child);
      }
    }
  }

  public physicsUpdate(): void {
    this._world.step();

    this._syncToScene();
  }
}
