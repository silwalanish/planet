import { vec3, vec4 } from "gl-matrix";
import { MeshComponent, SceneNode } from "@silwalanish/scene";

import { Ground } from "./ground";
import { PlanetMaterial } from "./material";

export class GroundManager extends SceneNode {
  private _planetMaterial: PlanetMaterial;
  private _offset: number;

  public constructor() {
    super("groundManager");

    this._planetMaterial = new PlanetMaterial(
      "planetMaterial",
      vec4.fromValues(86 / 255, 125 / 255, 70 / 255, 1),
      vec4.fromValues(146 / 255, 116 / 255, 91 / 255, 1)
    );

    this._offset = 0;
    this._init();
  }

  private _spawnGround() {
    const ground = new SceneNode("ground" + this._offset);
    ground.mesh = new MeshComponent(
      new Ground(vec3.fromValues(this._offset, 0, 0), 200),
      this._planetMaterial
    );
    ground.transform.Position = vec3.fromValues(
      (this.children[0]?.transform.Position[0] || 0) +
        this.children.length * 50,
      -20,
      0
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

    this.children.forEach((child) => {
      child.transform.Position[0] -= 10.0 * deltaTime;

      if (child.transform.Position[0] <= -50) {
        this.removeChild(child);

        this._spawnGround();
      }
    });
  }
}
