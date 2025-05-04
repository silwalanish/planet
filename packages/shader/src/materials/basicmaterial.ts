import { vec4 } from "gl-matrix";

import { Shader } from "../shader";
import { ShaderType } from "../compiler/shader";
import { ShaderSpecs } from "../generator/generate";
import BASIC_VERTEX_SHADER from "../glsl/basic.vertex.glsl?raw";
import BASIC_FRAGMENT_SHADER from "../glsl/basic.fragment.glsl?raw";

const BASIC_MATERIAL_VERTEX_SPECS: ShaderSpecs = {
  shaderType: ShaderType.Vertex,
  additionalUniforms: [],
  mainFunction: BASIC_VERTEX_SHADER,
};

const BASIC_MATERIAL_FRAGMENT_SPECS: ShaderSpecs = {
  shaderType: ShaderType.Fragment,
  additionalUniforms: [
    {
      name: "u_color",
      type: "vec4",
    },
  ],
  mainFunction: BASIC_FRAGMENT_SHADER,
};

export class BasicMaterial extends Shader {
  public color: vec4;

  public constructor(name: string, color: vec4) {
    super(name, BASIC_MATERIAL_VERTEX_SPECS, BASIC_MATERIAL_FRAGMENT_SPECS);

    this.color = color;
  }

  public override use(gl: WebGL2RenderingContext): void {
    super.use(gl);

    gl.uniform4fv(this.getUniformLocation("u_color"), this.color);
  }
}
