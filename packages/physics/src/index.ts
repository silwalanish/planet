export { RapierWorld2D } from "./rapierworld2d";
export { PhysicsScene2D } from "./physicsscene2d";
export { RapierPhysics2D } from "./rapierphysics2d";
export { RapierPhysicsBody } from "./rapierphysicsbody";
export type { PhysicsShapeType } from "./physicsshapetype";
export { Box, Trimesh, Heightfield, Polyline } from "./physicsshapetype";

declare global {
  interface Window {
    RAPIER?: any;
  }
}

export async function initPhysics() {
  const RAPIER = await import("@dimforge/rapier2d");
  if (!RAPIER) {
    window.dispatchEvent(new Event("rapierLoadError"));
  }

  window.RAPIER = RAPIER;

  window.dispatchEvent(new Event("rapierLoaded"));
}
