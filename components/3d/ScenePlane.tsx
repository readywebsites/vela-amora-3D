"use client";

import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const textureCache = new Map<string, THREE.Texture>();
const loadingPromises = new Map<string, Promise<THREE.Texture>>();

export function preloadTexture(src: string): Promise<THREE.Texture> {
  if (!src) return Promise.reject(new Error("No src provided"));
  if (textureCache.has(src)) {
    return Promise.resolve(textureCache.get(src)!);
  }

  if (loadingPromises.has(src)) {
    return loadingPromises.get(src)!;
  }

  const promise = new Promise<THREE.Texture>((resolve, reject) => {
    const loader = new THREE.TextureLoader();

    loader.load(
      src,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.generateMipmaps = true;
        tex.needsUpdate = true;

        textureCache.set(src, tex);
        resolve(tex);
      },
      undefined,
      (err) => {
        console.warn(`Error loading texture ${src}`, err);
        reject(err);
      }
    );
  });

  loadingPromises.set(src, promise);

  return promise;
}

interface ScenePlaneProps {
  imageSrc: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  aspect?: number;
  width?: number;
  cameraZRef: React.MutableRefObject<number>;
  fadeOutBehind?: boolean;
  floating?: boolean;
  floatSpeed?: number;
  floatIntensity?: number;
  fadeInRange?: [number, number];
}

export const ScenePlane = ({
  imageSrc,
  position,
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  width = 10.0,
  aspect = 16 / 9,
  cameraZRef,
  fadeOutBehind = true,
  floating = true,
  floatSpeed = 0.8,
  floatIntensity = 0.03,
  fadeInRange = [28, 18],
}: ScenePlaneProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);

  const [texture, setTexture] = useState<THREE.Texture | null>(
    () => textureCache.get(imageSrc) || null
  );

  const [aspectRatio, setAspectRatio] = useState<number>(aspect);

  const updateAspectRatio = (tex: THREE.Texture) => {
    const image = tex.image as
      | {
          width?: number;
          height?: number;
        }
      | undefined;

    if (image?.width && image?.height) {
      setAspectRatio(image.width / image.height);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const cachedTexture = textureCache.get(imageSrc);

    if (cachedTexture) {
      setTexture(cachedTexture);
      updateAspectRatio(cachedTexture);

      if (materialRef.current) {
        materialRef.current.map = cachedTexture;
        materialRef.current.needsUpdate = true;
      }

      return () => {
        isMounted = false;
      };
    }

    preloadTexture(imageSrc)
      .then((tex) => {
        if (!isMounted) return;

        setTexture(tex);
        updateAspectRatio(tex);

        if (materialRef.current) {
          materialRef.current.map = tex;
          materialRef.current.needsUpdate = true;
        }
      })
      .catch((error) => {
        console.warn(`Failed to preload texture: ${imageSrc}`, error);
      });

    return () => {
      isMounted = false;
    };
  }, [imageSrc]);

  useEffect(() => {
    if (materialRef.current && texture) {
      materialRef.current.map = texture;
      materialRef.current.needsUpdate = true;
    }
  }, [texture]);

  const height = width / aspectRatio;

  useFrame(({ clock }) => {
    if (!meshRef.current || !materialRef.current) return;

    const t = clock.getElapsedTime() * floatSpeed;

    // Subtle gentle drift
    if (floating) {
      meshRef.current.position.y =
        position[1] + Math.sin(t) * floatIntensity;
    }

    // Distance relative to camera Z
    const camZ = cameraZRef.current;
    const planeZ = position[2];
    const distToCam = camZ - planeZ;

    let targetOpacity = 0;

    const [fadeStartDist, fadeFullDist] = fadeInRange;

    if (distToCam > 0) {
      if (distToCam > fadeStartDist) {
        // Far ahead: hidden
        targetOpacity = 0;
      } else if (distToCam > fadeFullDist) {
        // Smooth fade-in
        targetOpacity =
          (fadeStartDist - distToCam) /
          (fadeStartDist - fadeFullDist);
      } else if (distToCam < 2.2 && fadeOutBehind) {
        // Smooth fade-out after camera passes
        targetOpacity = Math.max(
          0,
          (distToCam - 0.4) / 1.8
        );
      } else {
        // Main viewing range
        targetOpacity = 1;
      }
    } else {
      // Plane is behind camera
      targetOpacity = 0;
    }

    // Smooth opacity
    materialRef.current.opacity = THREE.MathUtils.lerp(
      materialRef.current.opacity,
      targetOpacity,
      0.2
    );

    // Hide completely invisible planes
    meshRef.current.visible = Boolean(
      texture && materialRef.current.opacity > 0.005
    );
  });

  return (
    <group
      position={position}
      rotation={rotation}
      scale={scale}
    >
      <mesh
        ref={meshRef}
        visible={Boolean(texture)}
      >
        <planeGeometry args={[width, height]} />

        <meshBasicMaterial
          ref={materialRef}
          map={texture || undefined}
          transparent
          opacity={0}
          side={THREE.FrontSide}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
};