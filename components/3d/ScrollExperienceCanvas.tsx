"use client";

import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { SceneWorld } from "./SceneWorld";

interface ScrollExperienceCanvasProps {
  scrollProgressRef: React.MutableRefObject<number>;
  cameraZRef: React.MutableRefObject<number>;
}

const LoadingFallback = () => (
  <div className="w-full h-full flex flex-col items-center justify-center bg-[#04060d] text-white">
    <div className="w-12 h-12 border-2 border-white/10 border-t-[#DFB76C] rounded-full animate-spin mb-4" />
    <span className="text-xs uppercase tracking-[0.3em] text-[#DFB76C]/80 font-light">
      Loading Architectural Experience...
    </span>
  </div>
);

export const ScrollExperienceCanvas = ({
  scrollProgressRef,
  cameraZRef,
}: ScrollExperienceCanvasProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <LoadingFallback />;
  }

  return (
    <div className="fixed inset-0 w-full h-screen z-0 overflow-hidden pointer-events-auto bg-[#04060d]">
      <Canvas
        camera={{ position: [0, 0, 14.5], fov: 48, near: 0.1, far: 180 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]}
        className="w-full h-full"
      >
        <Suspense fallback={null}>
          <SceneWorld
            scrollProgressRef={scrollProgressRef}
            cameraZRef={cameraZRef}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
