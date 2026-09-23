"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollExperienceCanvas } from "@/components/3d/ScrollExperienceCanvas";
import { UIOverlay } from "@/components/3d/UIOverlay";
import { HOME_CONFIG } from "@/config/homeConfig";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef<number>(0);
  const cameraZRef = useRef<number>(14.5);
  const activeSceneIndexRef = useRef<number>(0);

  const [activeSceneIndex, setActiveSceneIndex] = useState<number>(0);
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (!containerRef.current) return;

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.2,
        onUpdate: (self) => {
          const p = self.progress;
          scrollProgressRef.current = p;

          // 7 Continuous Reference Scenes:
          // 0: VELA ARMON, 1: Residences, 2: Horology, 3: Yachts, 4: Aviation, 5: Statement, 6: Who We Are
          let sceneIdx = 0;
          if (p >= 0.92) sceneIdx = 6;      // Who We Are / Studio
          else if (p >= 0.81) sceneIdx = 5; // Statement (Clouds)
          else if (p >= 0.65) sceneIdx = 4; // Aviation
          else if (p >= 0.48) sceneIdx = 3; // Yachts
          else if (p >= 0.31) sceneIdx = 2; // Horology
          else if (p >= 0.14) sceneIdx = 1; // Residences
          else sceneIdx = 0;                // VELA ARMON

          if (sceneIdx !== activeSceneIndexRef.current) {
            activeSceneIndexRef.current = sceneIdx;
            setActiveSceneIndex(sceneIdx);
          }

          setScrollProgress(p);
        },
      });
    });

    return () => {
      ctx.revert();
    };
  }, []);

  const handleSelectScene = useCallback((index: number) => {
    if (!containerRef.current) return;
    // Normalized checkpoints for the 7 scenes
    const sceneP = [0.0, 0.22, 0.40, 0.56, 0.73, 0.86, 1.0][index] ?? 0;
    const totalScroll = containerRef.current.scrollHeight - window.innerHeight;
    const targetY = sceneP * totalScroll;

    window.scrollTo({
      top: targetY,
      behavior: "smooth",
    });
  }, []);

  return (
    <main className="relative w-full bg-[#04060d] text-white">
      {/* 3D WebGL Canvas Layer (Fixed Fullscreen Viewport) */}
      <ScrollExperienceCanvas
        scrollProgressRef={scrollProgressRef}
        cameraZRef={cameraZRef}
      />

      {/* Cinematic Luxury Real-Estate HUD Overlay */}
      <UIOverlay
        activeSceneIndex={activeSceneIndex}
        scrollProgress={scrollProgress}
        onSelectScene={handleSelectScene}
      />

      {/* Real Scroll Track Container (GSAP ScrollTrigger scrub) */}
      <div
        ref={containerRef}
        className="w-full h-[650vh] pointer-events-none relative"
        aria-hidden="true"
      >
        {/* Spatial waypoints for accessibility & section anchoring */}
        {HOME_CONFIG.scenes.map((scene, i) => (
          <div
            key={scene.id}
            id={`scene-${scene.id}`}
            className="sr-only"
            style={{ top: `${(i / (HOME_CONFIG.scenes.length - 1)) * 100}%` }}
          >
            {scene.title} - {scene.description}
          </div>
        ))}
      </div>
    </main>
  );
}
