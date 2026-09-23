"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface Waypoint {
  p: number; // scroll progress [0, 1]
  x: number;
  y: number;
  z: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  fov: number;
}

// 7 Continuous Reference Scenes:
// 1: VELA ARMON (Z: 0)
// 2: Residences (Z: -20)
// 3: Horology (Z: -42)
// 4: Yachts (Z: -66)
// 5: Aviation (Z: -90)
// 6: Statement (Z: -112)
// 7: Who We Are / Studio (Z: -128)
const WAYPOINTS: Waypoint[] = [
  // 1: VELA ARMON / Hero Tower Cinematic Opening
  { p: 0.0, x: 0.0, y: 0.0, z: 14.5, rotX: 0.0, rotY: 0.0, rotZ: 0.0, fov: 48 },
  { p: 0.03, x: 0.0, y: 0.01, z: 12.0, rotX: 0.002, rotY: 0.0, rotZ: 0.0, fov: 48.5 },
  { p: 0.06, x: 0.0, y: 0.02, z: 8.5, rotX: 0.006, rotY: -0.01, rotZ: 0.0, fov: 49 },
  { p: 0.10, x: 0.0, y: 0.03, z: 4.5, rotX: 0.01, rotY: -0.015, rotZ: 0.0, fov: 49.5 },
  { p: 0.14, x: 0.0, y: 0.04, z: 0.8, rotX: 0.012, rotY: -0.008, rotZ: 0.0, fov: 50 },

  // 2: Penthouse Residences (Interior Living Space)
  { p: 0.18, x: 0.0, y: 0.0, z: -12.0, rotX: 0.0, rotY: 0.0, rotZ: 0.0, fov: 49 },
  { p: 0.28, x: 0.08, y: -0.04, z: -19.5, rotX: 0.01, rotY: -0.02, rotZ: 0.0, fov: 50 },

  // 3: Horology (Macro Timepiece & Tourbillon Gears)
  { p: 0.35, x: -0.08, y: 0.0, z: -34.0, rotX: 0.0, rotY: 0.03, rotZ: 0.01, fov: 48 },
  { p: 0.45, x: -0.04, y: 0.0, z: -41.2, rotX: 0.01, rotY: 0.02, rotZ: 0.02, fov: 46 },

  // 4: Yachts (Superyacht & Teak Deck)
  { p: 0.52, x: 0.18, y: 0.05, z: -58.0, rotX: -0.01, rotY: -0.03, rotZ: 0.0, fov: 49 },
  { p: 0.62, x: 0.1, y: 0.02, z: -65.2, rotX: 0.0, rotY: -0.01, rotZ: 0.0, fov: 50 },

  // 5: Aviation (Runway Rush & Jet Climb)
  { p: 0.69, x: 0.0, y: -0.08, z: -81.0, rotX: 0.01, rotY: 0.0, rotZ: 0.0, fov: 50 },
  { p: 0.78, x: 0.0, y: 0.18, z: -89.2, rotX: 0.05, rotY: 0.0, rotZ: 0.0, fov: 48 },

  // 6: Statement (Cloud Horizon)
  { p: 0.84, x: 0.0, y: 0.22, z: -103.5, rotX: 0.02, rotY: 0.0, rotZ: 0.0, fov: 48 },
  { p: 0.90, x: 0.0, y: 0.18, z: -111.2, rotX: 0.0, rotY: 0.0, rotZ: 0.0, fov: 48 },

  // 7: Who We Are (Studio Card)
  { p: 0.95, x: 0.0, y: 0.08, z: -120.5, rotX: 0.0, rotY: 0.0, rotZ: 0.0, fov: 48 },
  { p: 1.0, x: 0.0, y: 0.0, z: -126.5, rotX: 0.0, rotY: 0.0, rotZ: 0.0, fov: 48 },
];

function interpolateWaypoints(p: number): {
  x: number;
  y: number;
  z: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  fov: number;
} {
  const clampedP = Math.max(0, Math.min(1, p));

  // Find surrounding waypoints
  let i = 0;
  while (i < WAYPOINTS.length - 1 && WAYPOINTS[i + 1].p < clampedP) {
    i++;
  }

  if (i >= WAYPOINTS.length - 1) {
    return WAYPOINTS[WAYPOINTS.length - 1];
  }

  const w0 = WAYPOINTS[i];
  const w1 = WAYPOINTS[i + 1];
  const factor = (clampedP - w0.p) / (w1.p - w0.p);
  // Smooth cosine easing between keyframes
  const easeFactor = 0.5 - 0.5 * Math.cos(factor * Math.PI);

  return {
    x: THREE.MathUtils.lerp(w0.x, w1.x, easeFactor),
    y: THREE.MathUtils.lerp(w0.y, w1.y, easeFactor),
    z: THREE.MathUtils.lerp(w0.z, w1.z, easeFactor),
    rotX: THREE.MathUtils.lerp(w0.rotX, w1.rotX, easeFactor),
    rotY: THREE.MathUtils.lerp(w0.rotY, w1.rotY, easeFactor),
    rotZ: THREE.MathUtils.lerp(w0.rotZ, w1.rotZ, easeFactor),
    fov: THREE.MathUtils.lerp(w0.fov, w1.fov, easeFactor),
  };
}

interface CameraRigProps {
  scrollProgressRef: React.MutableRefObject<number>;
  cameraZRef: React.MutableRefObject<number>;
}

export const CameraRig = ({
  scrollProgressRef,
  cameraZRef,
}: CameraRigProps) => {
  const { camera } = useThree();
  const mouseRef = useRef({ x: 0, y: 0 });
  const currentPos = useRef(new THREE.Vector3(0, 0, 14.5));
  const currentRot = useRef(new THREE.Euler(0, 0, 0));

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((_, delta) => {
    const p = scrollProgressRef.current;
    const target = interpolateWaypoints(p);

    // Subtle mouse parallax tilt and shift for luxury depth
    const mouseX = mouseRef.current.x;
    const mouseY = mouseRef.current.y;

    const targetPosX = target.x + mouseX * 0.35;
    const targetPosY = target.y + mouseY * 0.25;
    const targetPosZ = target.z;

    const targetRotX = target.rotX + mouseY * 0.03;
    const targetRotY = target.rotY - mouseX * 0.04;
    const targetRotZ = target.rotZ - mouseX * 0.01;

    // Smooth dampening
    const dampSpeed = Math.min(1, delta * 5.0);

    currentPos.current.x = THREE.MathUtils.lerp(currentPos.current.x, targetPosX, dampSpeed);
    currentPos.current.y = THREE.MathUtils.lerp(currentPos.current.y, targetPosY, dampSpeed);
    currentPos.current.z = THREE.MathUtils.lerp(currentPos.current.z, targetPosZ, dampSpeed);

    currentRot.current.x = THREE.MathUtils.lerp(currentRot.current.x, targetRotX, dampSpeed);
    currentRot.current.y = THREE.MathUtils.lerp(currentRot.current.y, targetRotY, dampSpeed);
    currentRot.current.z = THREE.MathUtils.lerp(currentRot.current.z, targetRotZ, dampSpeed);

    camera.position.copy(currentPos.current);
    camera.rotation.copy(currentRot.current);

    // Keep cameraZRef updated for distance calculations
    cameraZRef.current = camera.position.z;

    // Smooth FOV adjust
    if ((camera as THREE.PerspectiveCamera).fov) {
      const persCam = camera as THREE.PerspectiveCamera;
      persCam.fov = THREE.MathUtils.lerp(persCam.fov, target.fov, dampSpeed);
      persCam.updateProjectionMatrix();
    }
  });

  return null;
};
