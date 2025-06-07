import { ColliderDesc } from "@dimforge/rapier2d";

export type PhysicsShapeType = ColliderDesc;
export const Box = ColliderDesc.cuboid;
export const Trimesh = ColliderDesc.trimesh;
export const Heightfield = ColliderDesc.heightfield;
export const Polyline = ColliderDesc.polyline;
export const Ball = ColliderDesc.ball;
