import { mat4, vec3 } from "gl-matrix";
import { View } from "@silwalanish/engine";

import { SceneNode } from "../scenenode";

const UP: vec3 = vec3.fromValues(0, 1, 0);

export class Camera extends SceneNode implements View {
  private _viewMatrix: mat4;

  public constructor(name: string) {
    super(name);

    this._viewMatrix = mat4.create();
  }

  public lookAt(direction: vec3): void {
    mat4.lookAt(
      this._viewMatrix,
      this.transform.getWorldPosition(),
      vec3.add(vec3.create(), this.transform.getWorldPosition(), direction),
      UP
    );
  }

  public getViewMatrix(): mat4 {
    return this._viewMatrix;
  }
}
