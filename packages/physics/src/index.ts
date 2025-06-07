export { RapierWorld2D } from "./rapierworld2d";
export { PhysicsScene2D } from "./physicsscene2d";
export { RapierPhysics2D, RapierJoint } from "./rapierphysics2d";
export { RapierPhysicsBody } from "./rapierphysicsbody";
export type { PhysicsShapeType } from "./physicsshapetype";
export * from "./physicsshapetype";
export * from "./physicsjoints";

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
