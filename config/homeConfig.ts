/**
 * ============================================================================
 * HOME PAGE CONFIGURATION & CENTRALIZED IMAGE REPLACEMENT SYSTEM
 * ============================================================================
 * 
 * Edit this file to easily change images, project information, navigation items,
 * statistics, and scene details on the Home page without digging through
 * components or 3D scene code.
 */

export interface SceneConfig {
  id: string;
  navLabel: string;          // Name shown in vertical scene navigation
  category: string;          // Category / Section badge (e.g. 01 — RESIDENCES, I — RESIDENCES, etc.)
  title: string;             // Main title for the scene
  tagline?: string;          // Eyebrow / Tagline
  subtitle?: string;         // Subtitle / Eyebrow
  description?: string;      // Narrative text
  metadata?: string;         // Editorial metadata tags (e.g. ARCHITECTURE / LIVING / EXPERIENCE)
  mainImage: string;         // Primary 3D plane image
  secondaryImage?: string;   // Optional secondary 3D plane image
  accentColor: string;       // Accent glow and indicator color
  targetZ: number;           // 3D camera Z target for this scene
  position: [number, number, number]; // 3D world position
  rotation?: [number, number, number]; // Optional 3D tilt
}

export const HOME_CONFIG = {
  brand: {
    name: "VELA ARMON",
    tagline: "Every expression of luxury, online.",
    introTagline: "A NEW LEGACY FOR LUXURY",
    studioBadge: "[ 01 — THE STUDIO ]",
    studioTitle: "Who We Are",
    studioDescription:
      "We are a website agency built for luxury businesses, where hand craft meets machine intelligence.",
  },

  images: {
    hero: "/assets/images/hero-tower.jpg",
    residences: "/assets/images/scene-residences.jpg",
    horology: "/assets/images/scene-horology.jpg",
    yachts: "/assets/images/scene-yachts.jpg",
    yachtDeck: "/assets/images/yacht-deck.jpg",
    aviation: "/assets/images/scene-aviation.jpg",
    clouds: "/assets/images/scene1-clouds.jpg",
  },

  scenes: [
    {
      id: "vela-armon",
      navLabel: "Vela Armon",
      category: "01 — RESIDENCES",
      title: "VELA ARMON",
      tagline: "A NEW LEGACY FOR LUXURY",
      subtitle: "A NEW LEGACY FOR LUXURY",
      description:
        "A new expression of modern living, shaped by architecture, light and an extraordinary view.",
      mainImage: "/assets/images/hero-tower.jpg",
      accentColor: "#DFB76C",
      targetZ: -2.0,
      position: [0, 0, -2.0],
      rotation: [0, 0, 0],
    },
    {
      id: "residences",
      navLabel: "Residences",
      category: "I — RESIDENCES",
      title: "Residences",
      subtitle: "Digital homes for the developments and estates that redefine a skyline.",
      description:
        "Digital homes for the developments and estates that redefine a skyline.",
      metadata: "ARCHITECTURE / LIVING / EXPERIENCE",
      mainImage: "/assets/images/scene-residences.jpg",
      accentColor: "#DFB76C",
      targetZ: -20,
      position: [0, 0, -20],
      rotation: [0, 0, 0],
    },
    {
      id: "horology",
      navLabel: "Horology",
      category: "II — HOROLOGY",
      title: "Horology",
      subtitle: "Online showcases worthy of the maisons that keep the world's finest time.",
      description:
        "Online showcases worthy of the maisons that keep the world's finest time.",
      metadata: "PRECISION / CRAFT / HERITAGE",
      mainImage: "/assets/images/scene-horology.jpg",
      accentColor: "#F59E0B",
      targetZ: -42,
      position: [0, 0, -42],
      rotation: [0, 0, 0],
    },
    {
      id: "yachts",
      navLabel: "Yachts",
      category: "III — YACHTS",
      title: "Yachts",
      subtitle: "Flagship sites for the yards and brokerages behind the water's great vessels.",
      description:
        "Flagship sites for the yards and brokerages behind the water's great vessels.",
      metadata: "OCEAN / DESIGN / FREEDOM",
      mainImage: "/assets/images/scene-yachts.jpg",
      secondaryImage: "/assets/images/yacht-deck.jpg",
      accentColor: "#38BDF8",
      targetZ: -66,
      position: [0.3, 0, -66],
      rotation: [0, 0, 0],
    },
    {
      id: "aviation",
      navLabel: "Aviation",
      category: "IV — AVIATION",
      title: "Aviation",
      subtitle: "Online flagships for the charters and brokers who move the world by private jet.",
      description:
        "Online flagships for the charters and brokers who move the world by private jet.",
      metadata: "PRIVATE / JOURNEY / HORIZONS",
      mainImage: "/assets/images/scene-aviation.jpg",
      accentColor: "#E28743",
      targetZ: -90,
      position: [0, 0.2, -90],
      rotation: [0.02, 0, 0],
    },
    {
      id: "statement",
      navLabel: "Statement",
      category: "STUDIO",
      title: "One studio. Every expression of luxury, online.",
      subtitle: "",
      description:
        "Digital experiences crafted for brands where design, technology and storytelling meet.",
      mainImage: "/assets/images/scene1-clouds.jpg",
      accentColor: "#A78BFA",
      targetZ: -112,
      position: [0, 0.4, -112],
      rotation: [0, 0, 0],
    },
    {
      id: "studio",
      navLabel: "Who We Are",
      category: "[ 01 — THE STUDIO ]",
      title: "Who We Are",
      subtitle: "",
      description:
        "We are a website agency built for luxury businesses, where hand craft meets machine intelligence.",
      metadata: "DESIGN / TECHNOLOGY / DIGITAL EXPERIENCE",
      mainImage: "/assets/images/scene1-clouds.jpg",
      accentColor: "#FFFFFF",
      targetZ: -128,
      position: [0, 0, -128],
      rotation: [0, 0, 0],
    },
  ] as SceneConfig[],
};
