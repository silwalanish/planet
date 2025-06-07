import { vec2, vec3, vec4 } from "gl-matrix";
import { GameObject, Physics2DType } from "@silwalanish/engine";
import {
  PhysicsShapeType,
  Polyline,
  RapierPhysics2D,
} from "@silwalanish/physics";
import { MeshComponent, SceneNode } from "@silwalanish/scene";

import { Ground } from "./ground";
import { PlanetMaterial } from "./material";

const LOD = vec2.fromValues(1000, 1);

export class GroundManager extends SceneNode<PhysicsShapeType> {
  private _camera: GameObject<any>;
  private _planetMaterial: PlanetMaterial;
  private _offset: number;

  public constructor(camera: GameObject<any>) {
    super("groundManager");

    this._camera = camera;
    this._planetMaterial = new PlanetMaterial(
      "planetMaterial",
      vec4.fromValues(86 / 255, 125 / 255, 70 / 255, 1),
      vec4.fromValues(146 / 255, 116 / 255, 91 / 255, 1)
    );

    this._offset = 0;
    this._init();
  }

  private _spawnGround() {
    const ground = new SceneNode<PhysicsShapeType>("ground" + this._offset);
    ground.mesh = new MeshComponent(
      new Ground(vec3.fromValues(this._offset, 0, 0), LOD, 200),
      this._planetMaterial
    );
    ground.transform.Position = vec3.fromValues(this._offset * 100, 0, 0);

    const vertices = ground.mesh.geometry.vertices;
    const verticesFloatArray = new Float32Array((LOD[0] + 2) * 2);
    let index = 0;
    for (let i = LOD[1] + 1; i < vertices.length; i += 3) {
      const vertex = vertices[i] as vec3;

      verticesFloatArray[index] = vertex[0];
      verticesFloatArray[index + 1] = vertex[1];

      index += 2;
    }

    ground.physics = new RapierPhysics2D(
      Physics2DType.STATIC,
      1000.0, // mass
      0.0, // friction
      Polyline(verticesFloatArray)
    );

    this.addChild(ground);
    this._offset++;
  }

  private _init() {
    for (let i = 0; i < 4; i++) {
      this._spawnGround();
    }
  }

  public override update(deltaTime: number): void {
    super.update(deltaTime);

    let cameraX = Math.ceil(this._camera.transform.getWorldPosition()[0]);

    const offScreenChildren = this.children.filter((children) => {
      return cameraX - children.transform.getWorldPosition()[0] > 150;
    });

    offScreenChildren.forEach((children) => {
      this.removeChild(children);
      this._spawnGround();
    });
  }
}
