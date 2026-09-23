"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ScenePlane, preloadTexture } from "./ScenePlane";
import { ParticlesField } from "./ParticlesField";
import { CameraRig } from "./CameraRig";
import { HOME_CONFIG } from "@/config/homeConfig";

interface SceneWorldProps {
  scrollProgressRef: React.MutableRefObject<number>;
  cameraZRef: React.MutableRefObject<number>;
}

// 3D Concentric Luxury Gears (Grand Lobby Horological Precision Detail)
const HorologyGears = ({ cameraZRef }: { cameraZRef: React.MutableRefObject<number> }) => {
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);
  const ring3 = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (ring1.current) ring1.current.rotation.z += delta * 0.35;
    if (ring2.current) ring2.current.rotation.z -= delta * 0.22;
    if (ring3.current) ring3.current.rotation.z += delta * 0.55;
  });

  return (
    <group position={[0, 0, -41.6]}>
      {/* Outer Golden Tourbillon Ring */}
      <mesh ref={ring1}>
        <torusGeometry args={[3.2, 0.025, 16, 64]} />
        <meshStandardMaterial
          color="#DFB76C"
          metalness={0.92}
          roughness={0.12}
          emissive="#78350F"
          emissiveIntensity={0.25}
        />
      </mesh>

      {/* Middle Escapement Ring */}
      <mesh ref={ring2} position={[0, 0, -0.2]}>
        <torusGeometry args={[2.4, 0.02, 16, 64]} />
        <meshStandardMaterial
          color="#F59E0B"
          metalness={0.95}
          roughness={0.1}
        />
      </mesh>

      {/* Inner Pinion Ring */}
      <mesh ref={ring3} position={[0, 0, -0.4]}>
        <torusGeometry args={[1.5, 0.03, 16, 48]} />
        <meshStandardMaterial
          color="#D97706"
          metalness={0.88}
          roughness={0.18}
        />
      </mesh>
    </group>
  );
};

// 3D Reflective Waterfront Pool / Sea Surface
const YachtWater = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    meshRef.current.position.y = -2.85 + Math.sin(t * 1.2) * 0.035;
  });

  return (
    <mesh
      ref={meshRef}
      position={[0, -2.85, -65]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <planeGeometry args={[32, 24, 16, 16]} />
      <meshStandardMaterial
        color="#051020"
        roughness={0.06}
        metalness={0.88}
        transparent
        opacity={0.72}
      />
    </mesh>
  );
};

// 3D Airport Runway & Perspective Lighting
const RunwayEnvironment = () => {
  return (
    <group position={[0, -2.8, -88]}>
      {/* Dark tarmac surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8, 30]} />
        <meshStandardMaterial color="#080B12" roughness={0.75} metalness={0.2} />
      </mesh>

      {/* Glowing centerline markers */}
      {Array.from({ length: 9 }).map((_, i) => (
        <mesh
          key={`centerline-${i}`}
          position={[0, 0.02, -13 + i * 3.4]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[0.2, 1.8]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
        </mesh>
      ))}

      {/* Runway edge lights */}
      {Array.from({ length: 10 }).map((_, i) => (
        <group key={`edge-lights-${i}`}>
          <mesh position={[-3.6, 0.05, -14 + i * 3.1]}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshBasicMaterial color="#DFB76C" />
          </mesh>
          <mesh position={[3.6, 0.05, -14 + i * 3.1]}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshBasicMaterial color="#38BDF8" />
          </mesh>
        </group>
      ))}
    </group>
  );
};

export const SceneWorld = ({
  scrollProgressRef,
  cameraZRef,
}: SceneWorldProps) => {
  // Preload all configured images for instant rendering
  useEffect(() => {
    const imagesToPreload = Object.values(HOME_CONFIG.images).filter(Boolean);
    imagesToPreload.forEach((src) => preloadTexture(src));
  }, []);

  const scenes = HOME_CONFIG.scenes;
  const sVelaArmon = scenes.find((s) => s.id === "vela-armon") || scenes[0];
  const sResidences = scenes.find((s) => s.id === "residences") || scenes[1];
  const sHorology = scenes.find((s) => s.id === "horology") || scenes[2];
  const sYachts = scenes.find((s) => s.id === "yachts") || scenes[3];
  const sAviation = scenes.find((s) => s.id === "aviation") || scenes[4];
  const sStatement = scenes.find((s) => s.id === "statement") || scenes[5];
  const sStudio = scenes.find((s) => s.id === "studio") || scenes[6];

  return (
    <>
      {/* Cinematic Perspective Camera driven by Scroll + Mouse parallax */}
      <CameraRig
        scrollProgressRef={scrollProgressRef}
        cameraZRef={cameraZRef}
      />

      {/* Luxury Cinematic Lighting */}
      <ambientLight intensity={1.1} color="#E2E8F0" />
      <directionalLight
        position={[9, 13, 11]}
        intensity={1.6}
        color="#FFFBEB"
      />
      <directionalLight
        position={[-9, -5, -20]}
        intensity={0.7}
        color="#1E3A8A"
      />

      {/* Deep Navy/Black Luxury Atmospheric Fog */}
      <fogExp2 attach="fog" args={["#04060E", 0.016]} />

      {/* 3D Global Particles Field (Golden motes drifting in space) */}
      <ParticlesField count={1600} />

      {/* ============================================================ */}
      {/* SCENE 1: VELA ARMON / TOWER FACADE ENTRANCE (Z: -2.0)         */}
      {/* ============================================================ */}
      <group>
        <pointLight
          position={[0, 2.0, 1.0]}
          intensity={1.4}
          distance={16}
          color="#DFB76C"
        />

        <ScenePlane
          imageSrc={sVelaArmon.mainImage}
          position={sVelaArmon.position}
          rotation={sVelaArmon.rotation}
          width={10.8}
          aspect={16 / 10}
          cameraZRef={cameraZRef}
          floating={false}
          fadeInRange={[8.0, 1.5]}
        />
      </group>

      {/* ============================================================ */}
      {/* SCENE 2: RESIDENCES / PENTHOUSE LIVING SPACE (Z: -20)         */}
      {/* ============================================================ */}
      <group>
        <pointLight
          position={[1.5, 1.8, -18]}
          intensity={1.4}
          distance={18}
          color="#FFFBEB"
        />

        <ScenePlane
          imageSrc={sResidences.mainImage}
          position={sResidences.position}
          rotation={sResidences.rotation}
          width={10.8}
          aspect={16 / 10}
          cameraZRef={cameraZRef}
          floating
          floatSpeed={0.75}
          floatIntensity={0.03}
        />
      </group>

      {/* ============================================================ */}
      {/* SCENE 3: HOROLOGY / WATCH & MACRO TOURBILLON (Z: -42)        */}
      {/* ============================================================ */}
      <group>
        <pointLight
          position={[0, 1.8, -40]}
          intensity={1.45}
          distance={16}
          color="#FEF3C7"
        />

        <ScenePlane
          imageSrc={sHorology.mainImage}
          position={sHorology.position}
          rotation={sHorology.rotation}
          width={10.2}
          aspect={16 / 10}
          cameraZRef={cameraZRef}
          floating
          floatSpeed={0.7}
          floatIntensity={0.03}
        />

        {/* 3D Rotating Golden Tourbillon Rings */}
        <HorologyGears cameraZRef={cameraZRef} />
      </group>

      {/* ============================================================ */}
      {/* SCENE 4: YACHTS / SUPERYACHT & TEAK DECK (Z: -66)             */}
      {/* ============================================================ */}
      <group>
        <pointLight
          position={[1.5, 2.5, -64]}
          intensity={1.5}
          distance={20}
          color="#BAE6FD"
        />

        {/* Main Superyacht in Harbor */}
        <ScenePlane
          imageSrc={sYachts.mainImage}
          position={sYachts.position}
          rotation={sYachts.rotation}
          width={10.4}
          aspect={16 / 10}
          cameraZRef={cameraZRef}
          floating
          floatSpeed={0.85}
          floatIntensity={0.04}
        />

        {/* Foreground Teak Deck */}
        {sYachts.secondaryImage && (
          <ScenePlane
            imageSrc={sYachts.secondaryImage}
            position={[-2.4, -0.25, -62.5]}
            rotation={[0, 0.16, -0.02]}
            width={5.6}
            aspect={16 / 10}
            cameraZRef={cameraZRef}
            floating
            floatSpeed={0.9}
            floatIntensity={0.05}
          />
        )}

        {/* 3D Reflective Waterfront Pool */}
        <YachtWater />
      </group>

      {/* ============================================================ */}
      {/* SCENE 5: AVIATION / RUNWAY & PRIVATE JET (Z: -90)             */}
      {/* ============================================================ */}
      <group>
        <pointLight
          position={[0, 3.2, -88]}
          intensity={1.7}
          distance={22}
          color="#FDE68A"
        />

        {/* Jet Takeoff / Climbing into Sky */}
        <ScenePlane
          imageSrc={sAviation.mainImage}
          position={sAviation.position}
          rotation={sAviation.rotation}
          width={10.8}
          aspect={16 / 10}
          cameraZRef={cameraZRef}
          floating
          floatSpeed={0.8}
          floatIntensity={0.035}
        />

        {/* 3D Runway Lighting & Centerline */}
        <RunwayEnvironment />
      </group>

      {/* ============================================================ */}
      {/* SCENE 6: STATEMENT / HIGH-ALTITUDE CLOUDS (Z: -112)          */}
      {/* ============================================================ */}
      <group>
        <pointLight
          position={[0, 2.5, -110]}
          intensity={1.4}
          distance={20}
          color="#DDD6FE"
        />

        <ScenePlane
          imageSrc={sStatement.mainImage}
          position={sStatement.position}
          rotation={sStatement.rotation}
          width={12.5}
          aspect={16 / 10}
          cameraZRef={cameraZRef}
          floating
          floatSpeed={0.65}
          floatIntensity={0.03}
        />
      </group>

      {/* ============================================================ */}
      {/* SCENE 7: STUDIO / WHO WE ARE AMBIENCE (Z: -128)               */}
      {/* ============================================================ */}
      <group>
        <pointLight
          position={[0, 2.0, -126]}
          intensity={1.2}
          distance={18}
          color="#E2E8F0"
        />

        <ScenePlane
          imageSrc={sStudio.mainImage}
          position={sStudio.position}
          rotation={sStudio.rotation}
          width={13.0}
          aspect={16 / 10}
          cameraZRef={cameraZRef}
          floating
          floatSpeed={0.5}
          floatIntensity={0.02}
        />
      </group>
    </>
  );
};
