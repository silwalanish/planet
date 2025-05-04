void main() {
    gl_Position = u_projection * u_view * u_model * vec4(a_position, 1.0);
    v_normal = a_normal;
    v_texcoord = a_texcoord;
}
