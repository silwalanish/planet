import { ShaderType } from "../compiler/shader";

import NOISE_MODULE from "../glsl/modules/noise.glsl?raw";
import RANDOM_MODULE from "../glsl/modules/random.glsl?raw";
import VERTEX_TEMPLATE from "../glsl/templates/vertex.glsl?raw";
import FRAGMENT_TEMPLATE from "../glsl/templates/fragment.glsl?raw";

const MODULES: Record<string, string> = {
  noise: NOISE_MODULE,
  random: RANDOM_MODULE,
};

export interface Uniform {
  name: string;
  type: string;
}

export interface ShaderSpecs {
  shaderType: ShaderType;
  additionalUniforms: Uniform[];
  mainFunction: string;
}

export class ShaderGenerationError extends Error {
  shaderSource: string;

  constructor(message: string, shaderSource: string) {
    super(ShaderGenerationError.getMessage(message, shaderSource));
    this.shaderSource = shaderSource;
    this.name = `ShaderGenerationError::`;
  }

  static getMessage(message: string, shaderSource: string): string {
    return `\n\n${shaderSource}\n\n${message}\n`;
  }
}

function resolveModule(
  source: string,
  includedModules: string[] = []
): {
  resolvedSource: string;
  resolvedModules: string[];
} {
  let modules = source.matchAll(
    /#include\s+(["']?)(?<moduleName>[a-zA-Z]+)\1/g
  );
  let resolvedSource = source;
  let resolvedModules = [...includedModules];

  for (const module of modules) {
    let moduleName = module.groups?.["moduleName"];

    if (moduleName && MODULES[moduleName]) {
      if (resolvedModules.includes(moduleName)) {
        resolvedSource = resolvedSource.replace(module[0], "");
        continue;
      }

      resolvedModules.push(moduleName);

      let moduleCode = resolveModule(MODULES[moduleName], resolvedModules);
      resolvedSource = resolvedSource.replace(
        module[0],
        moduleCode.resolvedSource
      );

      resolvedModules = moduleCode.resolvedModules;
    } else {
      throw new ShaderGenerationError(
        `Module ${moduleName} not found.`,
        source
      );
    }
  }

  return { resolvedSource, resolvedModules };
}

function generateAdditionalUniforms(uniforms: Uniform[]): string {
  let additionalUniformsCode = "";
  for (const uniform of uniforms) {
    additionalUniformsCode += `uniform ${uniform.type} ${uniform.name};\n`;
  }

  return additionalUniformsCode;
}

export function generateShaderCode(shader: ShaderSpecs): string {
  let shaderCode = "";
  if (shader.shaderType === ShaderType.Vertex) {
    shaderCode = VERTEX_TEMPLATE;
  } else {
    shaderCode = FRAGMENT_TEMPLATE;
  }

  shaderCode = shaderCode.replace(
    "// {additionalUniforms}",
    generateAdditionalUniforms(shader.additionalUniforms)
  );
  shaderCode = shaderCode.replace("// {mainFunction}", shader.mainFunction);

  shaderCode = resolveModule(shaderCode).resolvedSource;

  return shaderCode;
}
