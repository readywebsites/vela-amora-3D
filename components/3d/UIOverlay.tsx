"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { HOME_CONFIG } from "@/config/homeConfig";

interface UIOverlayProps {
  activeSceneIndex: number;
  scrollProgress: number;
  onSelectScene: (index: number) => void;
}

export const UIOverlay = ({
  activeSceneIndex,
  scrollProgress,
}: UIOverlayProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);

  // Retrieve persisted sound state on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("vela_sound_enabled");
      if (saved === "true") {
        setSoundEnabled(true);
      }
    } catch {
      // Restricted storage context fallback
    }
  }, []);

  // Audio setup: strictly no autoplay without explicit user interaction
  useEffect(() => {
    const audio = new Audio("/assets/audio/ambient.mp3");
    audio.loop = true;
    audio.volume = 0.28;
    audioRef.current = audio;

    // If session had sound explicitly on, attempt resume
    try {
      if (sessionStorage.getItem("vela_sound_enabled") === "true") {
        audio.play().catch(() => {
          setSoundEnabled(false);
          sessionStorage.setItem("vela_sound_enabled", "false");
        });
      }
    } catch {}

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const handleToggleSound = () => {
    if (!audioRef.current) return;
    if (soundEnabled) {
      audioRef.current.pause();
      setSoundEnabled(false);
      try {
        sessionStorage.setItem("vela_sound_enabled", "false");
      } catch {}
    } else {
      audioRef.current
        .play()
        .then(() => {
          setSoundEnabled(true);
          try {
            sessionStorage.setItem("vela_sound_enabled", "true");
          } catch {}
        })
        .catch((err) => {
          console.warn("Audio playback blocked:", err);
        });
    }
  };

  // Premium Cursor 3D Interaction for Scene 01 VELA ARMON title
  const [isDesktop, setIsDesktop] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, rawX: 0.5, rawY: 0.5 });
  const targetMouse = useRef({ x: 0, y: 0, rawX: 0.5, rawY: 0.5 });
  const animFrameId = useRef<number | null>(null);

  useEffect(() => {
    // Only enable on desktop pointer devices
    const media = window.matchMedia("(pointer: fine) and (hover: hover)");
    setIsDesktop(media.matches);

    const onMediaChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    media.addEventListener("change", onMediaChange);

    const handleMouseMove = (e: MouseEvent) => {
      // Normalized coordinates: center = 0, range [-1, 1]
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = (e.clientY / window.innerHeight) * 2 - 1;
      // Raw percentage coordinates [0, 1] for light/sheen position
      const rawX = e.clientX / window.innerWidth;
      const rawY = e.clientY / window.innerHeight;

      targetMouse.current = { x: normX, y: normY, rawX, rawY };
    };

    if (media.matches) {
      window.addEventListener("mousemove", handleMouseMove, { passive: true });
    }

    // Smooth inertia interpolation (lerp) loop
    let currentX = 0;
    let currentY = 0;
    let currentRawX = 0.5;
    let currentRawY = 0.5;

    const loop = () => {
      if (activeSceneIndex === 0) {
        // 0.08 damping provides natural luxury inertia
        currentX += (targetMouse.current.x - currentX) * 0.08;
        currentY += (targetMouse.current.y - currentY) * 0.08;
        currentRawX += (targetMouse.current.rawX - currentRawX) * 0.08;
        currentRawY += (targetMouse.current.rawY - currentRawY) * 0.08;

        setMousePos({
          x: currentX,
          y: currentY,
          rawX: currentRawX,
          rawY: currentRawY,
        });
      }
      animFrameId.current = requestAnimationFrame(loop);
    };

    animFrameId.current = requestAnimationFrame(loop);

    return () => {
      media.removeEventListener("change", onMediaChange);
      window.removeEventListener("mousemove", handleMouseMove);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [activeSceneIndex]);

  return (
    <div className="fixed inset-0 pointer-events-none z-30 flex flex-col justify-between select-none overflow-hidden">
      {/* Top-Left Persistent VELA ARMON Logo */}
      <div className="fixed top-[18px] sm:top-[24px] md:top-[30px] left-[18px] sm:left-[25px] md:left-[40px] z-50 pointer-events-auto">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          aria-label="Vela Armon"
          className="block transition-opacity duration-300 hover:opacity-80 focus:outline-none select-none"
        >
          <Image
            src="/assets/images/vela-armon-logo.png"
            alt="Vela Armon"
            width={170}
            height={42}
            priority
            className="w-[115px] sm:w-[145px] md:w-[170px] h-auto object-contain"
          />
        </a>
      </div>

      {/* Top-Right Minimal Premium Sound Control */}
      <div className="fixed top-7 md:top-8 right-6 md:right-12 z-30 pointer-events-auto">
        <button
          type="button"
          onClick={handleToggleSound}
          className="group flex items-center space-x-2 px-3 py-1.5 rounded-full border border-white/15 bg-black/40 backdrop-blur-md transition-all duration-300 hover:border-white/35 hover:bg-black/60 active:scale-95 text-white/70 hover:text-white"
          aria-label={soundEnabled ? "Mute ambient audio" : "Play ambient audio"}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
              soundEnabled ? "bg-[#DFB76C] shadow-[0_0_8px_#DFB76C]" : "bg-white/30"
            }`}
          />
          <span className="text-[10px] md:text-[11px] font-sans font-light tracking-[0.24em] uppercase select-none">
            {soundEnabled ? "SOUND  ON" : "SOUND  OFF"}
          </span>
        </button>
      </div>

      {/* Subtle thin vertical scroll progress line on far right (matching reference video) */}
      <div className="fixed right-6 md:right-10 top-1/2 -translate-y-1/2 h-36 md:h-48 w-[1px] bg-white/10 pointer-events-none hidden sm:block">
        <div
          className="w-full bg-white/60 transition-all duration-150 ease-out"
          style={{ height: `${Math.min(100, Math.max(8, scrollProgress * 100))}%` }}
        />
      </div>

      {/* ============================================================ */}
      {/* 3D SCENE NARRATIVE OVERLAY (7 Reference Scenes)              */}
      {/* ============================================================ */}
      <div className="relative w-full h-full flex items-center px-6 md:px-16 pointer-events-none">
        {/* ========================================================== */}
        {/* SCENE 01: VELA ARMON / SEAMLESS TYPOGRAPHY TO TOWER EXPANSION */}
        {/* ========================================================== */}
        {activeSceneIndex === 0 && (() => {
          // Normalize Scene 01 progress across scroll range [0, 0.14]
          const s1 = Math.min(1, Math.max(0, scrollProgress / 0.14));

          // 1. Subtitle ("A NEW LEGACY FOR LUXURY") dissolves rapidly upon initial scroll
          const subOpacity = Math.max(0, 1 - s1 * 5.2);
          const subTranslateY = s1 * 24;

          // 2. Controlled, subtle letter expansion (scale 1.0 -> 1.18, majestic & smooth)
          const letterScale = 1 + Math.pow(s1, 1.2) * 0.22;

          // 3. Mask release: full-screen tower image emerges outward smoothly
          // Begins at s1 = 0.08, fully unveiled by s1 = 0.58
          const maskRelease = Math.min(1, Math.max(0, (s1 - 0.08) / 0.50));
          // Smooth cosine curve: 0 at start, smooth acceleration, gentle deceleration to 1
          const maskEase = 0.5 - 0.5 * Math.cos(maskRelease * Math.PI);

          // 4. Letter stroke gently dissolves as full image merges
          const strokeOpacity = Math.max(0, (1 - maskEase) * 0.45);
          const strokeWidth = Math.max(0.2, (1 - maskEase) * 1.0);

          // 5. Text fill fades once background is fully visible to ensure clean handoff
          const textOpacity = Math.max(0, 1 - Math.max(0, (s1 - 0.60) / 0.25));

          // 6. Editorial category badge "01 — RESIDENCES" emerges
          const badgeOpacity =
            s1 >= 0.35 && s1 <= 0.88
              ? Math.min(0.65, (s1 - 0.35) * 3.5) * Math.min(1, (0.88 - s1) * 8)
              : 0;

          // 7. Clean, seamless master exit into Scene 02 (p ≈ 0.12 - 0.14)
          const exitProgress = Math.min(1, Math.max(0, (s1 - 0.82) / 0.18));
          const scene1Opacity = 1 - exitProgress * exitProgress;

          // Gentle camera dolly zoom on the image
          const imageScale = 1 + s1 * 0.06;

          return (
            <div
              className="absolute inset-0 w-full h-full flex flex-col items-center justify-center text-center pointer-events-none perspective-[1200px] transition-opacity duration-150"
              style={{ opacity: scene1Opacity }}
            >
              {/* Full-bleed Tower Visual Layer (Viewport-fixed to perfectly match text image) */}
              <div
                className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
                style={{
                  opacity: maskEase,
                  transform: `scale(${imageScale})`,
                }}
              >
                <div
                  className="w-full h-full"
                  style={{
                    backgroundImage: "url('/assets/images/hero-tower.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundAttachment: "fixed",
                  }}
                />
                {/* Subtle vignette/contrast preservation */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#04060d] via-transparent to-[#04060d]/50 opacity-70" />
              </div>

              {/* Top-Right subtle editorial label (Scene 01) */}
              <div
                className="fixed top-18 md:top-20 right-6 md:right-12 text-[10px] md:text-xs tracking-[0.32em] uppercase text-white/60 font-light font-sans z-10 transition-opacity duration-300"
                style={{ opacity: Math.max(0.55, badgeOpacity) }}
              >
                01 — RESIDENCES
              </div>

              {/* Cursor Ambient Glow (Active only before mask release) */}
              {isDesktop && s1 < 0.35 && (
                <div
                  className="pointer-events-none absolute w-[650px] h-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full transition-opacity duration-300 z-0"
                  style={{
                    left: `${mousePos.rawX * 100}%`,
                    top: `${mousePos.rawY * 100}%`,
                    background:
                      "radial-gradient(ellipse 320px 180px at center, rgba(255, 255, 255, 0.08), transparent 75%)",
                    filter: "blur(25px)",
                    opacity: Math.max(0, 1 - s1 * 3.5),
                  }}
                />
              )}

              {/* Image-filled VELA ARMON typography */}
              <h1
                className="text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] xl:text-[13rem] font-bold tracking-[0.14em] uppercase leading-none font-sans select-none will-change-transform relative z-10"
                style={{
                  opacity: textOpacity,
                  transform: isDesktop
                    ? `perspective(1200px) rotateX(${mousePos.y * -3.5}deg) rotateY(${mousePos.x * 4.5}deg) translate3d(${mousePos.x * 12}px, ${mousePos.y * 8}px, 0) scale(${letterScale})`
                    : `scale(${letterScale})`,
                  filter: "drop-shadow(0 20px 50px rgba(0, 0, 0, 0.95))",
                  backgroundImage: "url('/assets/images/hero-tower.jpg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  backgroundAttachment: "fixed",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  color: "transparent",
                  WebkitTextStroke: `${strokeWidth}px rgba(255, 255, 255, ${strokeOpacity})`,
                }}
              >
                VELA ARMON
              </h1>

              {/* Tagline: A NEW LEGACY FOR LUXURY */}
              <p
                className="mt-4 md:mt-6 text-xs sm:text-sm md:text-base font-light tracking-[0.35em] text-white/80 uppercase max-w-xl will-change-transform relative z-10"
                style={{
                  opacity: subOpacity,
                  transform: isDesktop
                    ? `perspective(1200px) rotateX(${mousePos.y * -2.0}deg) rotateY(${mousePos.x * 2.5}deg) translate3d(${mousePos.x * 8}px, ${mousePos.y * 6 + subTranslateY}px, 0)`
                    : `translateY(${subTranslateY}px)`,
                  filter: `blur(${Math.max(0, (s1 - 0.1) * 20)}px)`,
                }}
              >
                A NEW LEGACY FOR LUXURY
              </p>

              {/* Description: Lightweight luxury narrative paragraph */}
              <p
                className="mt-3 text-xs sm:text-sm font-light tracking-wide text-white/60 max-w-md mx-auto leading-relaxed will-change-transform relative z-10 px-4"
                style={{
                  opacity: subOpacity,
                  transform: isDesktop
                    ? `perspective(1200px) rotateX(${mousePos.y * -1.5}deg) rotateY(${mousePos.x * 2.0}deg) translate3d(${mousePos.x * 6}px, ${mousePos.y * 4 + subTranslateY}px, 0)`
                    : `translateY(${subTranslateY}px)`,
                  filter: `blur(${Math.max(0, (s1 - 0.08) * 20)}px)`,
                }}
              >
                A new expression of modern living, shaped by architecture, light and an extraordinary view.
              </p>
            </div>
          );
        })()}

        {/* ========================================================== */}
        {/* SCENE 02: RESIDENCES                                       */}
        {/* ========================================================== */}
        {activeSceneIndex === 1 && (
          <div className="absolute bottom-16 md:bottom-20 left-6 md:left-16 max-w-xl flex flex-col items-start">
            <span className="text-[10px] md:text-xs font-light tracking-[0.32em] uppercase text-white/50 mb-2 font-sans animate-editorial-1">
              I — RESIDENCES
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-3 leading-tight drop-shadow-[0_8px_30px_rgba(0,0,0,0.9)] font-sans animate-editorial-2">
              Residences
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-white/80 font-light leading-relaxed max-w-md tracking-wide mb-3 animate-editorial-3">
              Digital homes for the developments and estates that redefine a skyline.
            </p>
            <div className="text-[9px] md:text-[10px] tracking-[0.35em] text-[#DFB76C]/75 uppercase font-mono animate-editorial-4">
              ARCHITECTURE / LIVING / EXPERIENCE
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* SCENE 03: HOROLOGY                                         */}
        {/* ========================================================== */}
        {activeSceneIndex === 2 && (
          <div className="absolute bottom-16 md:bottom-20 left-6 md:left-16 max-w-xl flex flex-col items-start">
            <span className="text-[10px] md:text-xs font-light tracking-[0.32em] uppercase text-white/50 mb-2 font-sans animate-editorial-1">
              II — HOROLOGY
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-3 leading-tight drop-shadow-[0_8px_30px_rgba(0,0,0,0.9)] font-sans animate-editorial-2">
              Horology
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-white/80 font-light leading-relaxed max-w-md tracking-wide mb-3 animate-editorial-3">
              Online showcases worthy of the maisons that keep the world&apos;s finest time.
            </p>
            <div className="text-[9px] md:text-[10px] tracking-[0.35em] text-[#F59E0B]/75 uppercase font-mono animate-editorial-4">
              PRECISION / CRAFT / HERITAGE
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* SCENE 04: YACHTS                                           */}
        {/* ========================================================== */}
        {activeSceneIndex === 3 && (
          <div className="absolute bottom-16 md:bottom-20 left-6 md:left-16 max-w-xl flex flex-col items-start">
            <span className="text-[10px] md:text-xs font-light tracking-[0.32em] uppercase text-white/50 mb-2 font-sans animate-editorial-1">
              III — YACHTS
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-3 leading-tight drop-shadow-[0_8px_30px_rgba(0,0,0,0.9)] font-sans animate-editorial-2">
              Yachts
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-white/80 font-light leading-relaxed max-w-md tracking-wide mb-3 animate-editorial-3">
              Flagship sites for the yards and brokerages behind the water&apos;s great vessels.
            </p>
            <div className="text-[9px] md:text-[10px] tracking-[0.35em] text-[#38BDF8]/75 uppercase font-mono animate-editorial-4">
              OCEAN / DESIGN / FREEDOM
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* SCENE 05: AVIATION                                         */}
        {/* ========================================================== */}
        {activeSceneIndex === 4 && (
          <div className="absolute bottom-16 md:bottom-20 left-6 md:left-16 max-w-xl flex flex-col items-start">
            <span className="text-[10px] md:text-xs font-light tracking-[0.32em] uppercase text-white/50 mb-2 font-sans animate-editorial-1">
              IV — AVIATION
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-3 leading-tight drop-shadow-[0_8px_30px_rgba(0,0,0,0.9)] font-sans animate-editorial-2">
              Aviation
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-white/80 font-light leading-relaxed max-w-md tracking-wide mb-3 animate-editorial-3">
              Online flagships for the charters and brokers who move the world by private jet.
            </p>
            <div className="text-[9px] md:text-[10px] tracking-[0.35em] text-[#E28743]/75 uppercase font-mono animate-editorial-4">
              PRIVATE / JOURNEY / HORIZONS
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* SCENE 06: STATEMENT                                        */}
        {/* ========================================================== */}
        {activeSceneIndex === 5 && (
          <div className="w-full h-full flex flex-col items-center justify-center text-center px-6">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal tracking-[0.05em] text-white leading-tight max-w-4xl drop-shadow-[0_10px_35px_rgba(0,0,0,0.85)] font-sans mb-4 animate-editorial-1">
              One studio. Every expression of luxury, online.
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-white/70 font-light leading-relaxed max-w-xl tracking-wide mx-auto animate-editorial-2">
              Digital experiences crafted for brands where design, technology and storytelling meet.
            </p>
          </div>
        )}

        {/* ========================================================== */}
        {/* SCENE 07: WHO WE ARE (STUDIO AGENCY CARD)                  */}
        {/* ========================================================== */}
        {activeSceneIndex === 6 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[92%] max-w-5xl rounded-2xl bg-[#090b12]/92 backdrop-blur-2xl border border-white/10 p-6 sm:p-8 md:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.95)] pointer-events-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center">
              {/* Left Column: Badge & Title */}
              <div className="flex flex-col items-start">
                <span className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-white/50 mb-2 font-sans animate-editorial-1">
                  [ 01 — THE STUDIO ]
                </span>
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight font-sans animate-editorial-2">
                  Who We Are
                </h3>
              </div>

              {/* Right Column: Statement paragraph & metadata */}
              <div className="flex flex-col justify-center">
                <p className="text-sm sm:text-base md:text-lg text-white/80 font-light leading-relaxed mb-4 animate-editorial-3">
                  We are a website agency built for luxury businesses, where hand craft meets machine intelligence.
                </p>
                <div className="text-[9px] md:text-[10px] tracking-[0.32em] text-white/45 uppercase font-mono animate-editorial-4">
                  DESIGN / TECHNOLOGY / DIGITAL EXPERIENCE
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
