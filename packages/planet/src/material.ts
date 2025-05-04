import { vec4 } from "gl-matrix";
import { Shader, ShaderSpecs, ShaderType } from "@silwalanish/shader";

import PLANET_VERTEX from "./glsl/planet.vertex.glsl?raw";
import PLANET_FRAGMENT from "./glsl/planet.fragment.glsl?raw";

const PLANET_VERTEX_SPECS: ShaderSpecs = {
  shaderType: ShaderType.Vertex,
  additionalUniforms: [],
  mainFunction: PLANET_VERTEX,
};
const PLANET_FRAGMENT_SPECS: ShaderSpecs = {
  shaderType: ShaderType.Fragment,
  additionalUniforms: [
    {
      name: "u_grassColor",
      type: "vec4",
    },
    {
      name: "u_soilColor",
      type: "vec4",
    },
  ],
  mainFunction: PLANET_FRAGMENT,
};

export class PlanetMaterial extends Shader {
  public grassColor: vec4;
  public soilColor: vec4;

  public constructor(name: string, grassColor: vec4, soilColor: vec4) {
    super(name, PLANET_VERTEX_SPECS, PLANET_FRAGMENT_SPECS);

    this.grassColor = grassColor;
    this.soilColor = soilColor;
  }

  public override use(gl: WebGL2RenderingContext): void {
    super.use(gl);
    gl.uniform4fv(this.getUniformLocation("u_grassColor"), this.grassColor);
    gl.uniform4fv(this.getUniformLocation("u_soilColor"), this.soilColor);
  }
}
