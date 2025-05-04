#include noise

void main() {
    vec2 pos = vec2(v_texcoord.x, v_texcoord.y);
    float height = v_texcoord.y;

    vec4 color = mix(u_soilColor, u_grassColor, height);

    outColor = vec4(color.rgb, 1.0);
}
