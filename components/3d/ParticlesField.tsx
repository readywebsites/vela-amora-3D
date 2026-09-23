"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ParticlesFieldProps {
  count?: number;
}

export const ParticlesField = ({ count = 1200 }: ParticlesFieldProps) => {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, colors, scales] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const sc = new Float32Array(count);

    const goldColor = new THREE.Color("#DFB76C");
    const cyanColor = new THREE.Color("#38BDF8");
    const whiteColor = new THREE.Color("#FFFFFF");

    for (let i = 0; i < count; i++) {
      // Scatter in a cylinder around the camera path
      const angle = Math.random() * Math.PI * 2;
      const radius = 2.5 + Math.random() * 14;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 2] = 12 - Math.random() * 130; // Spread from Z=12 down to Z=-118

      // Color variation
      const choice = Math.random();
      const c = choice < 0.4 ? goldColor : choice < 0.7 ? cyanColor : whiteColor;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;

      sc[i] = 0.5 + Math.random() * 1.5;
    }

    return [pos, col, sc];
  }, [count]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const t = clock.getElapsedTime() * 0.15;
    // Gentle ambient drift
    pointsRef.current.rotation.z = t * 0.05;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.065}
        vertexColors
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};
