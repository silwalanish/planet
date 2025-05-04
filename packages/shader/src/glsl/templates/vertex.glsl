#version 300 es

in vec3 a_position;
in vec3 a_normal;
in vec2 a_texcoord;

uniform mat4 u_projection;
uniform mat4 u_view;
uniform mat4 u_model;

// {additionalUniforms}

out vec3 v_normal;
out vec2 v_texcoord;

void main() {
    gl_Position = u_projection * u_view * u_model * vec4(a_position, 1.0);

    v_normal = a_normal;
    v_texcoord = a_texcoord;
}
