import { mat4, quat, vec3 } from "gl-matrix";

export function quatToEuler(q: quat): vec3 {
  const m = mat4.create();
  mat4.fromQuat(m, q);

  // Extract Euler angles from matrix
  const sy = Math.sqrt(m[0] * m[0] + m[1] * m[1]);
  let x, y, z;
  if (sy > 1e-6) {
    x = Math.atan2(m[6], m[10]);
    y = Math.atan2(-m[2], sy);
    z = Math.atan2(m[1], m[0]);
  } else {
    x = Math.atan2(-m[9], m[5]);
    y = Math.atan2(-m[2], sy);
    z = 0;
  }

  return vec3.fromValues(x, y, z);
}
