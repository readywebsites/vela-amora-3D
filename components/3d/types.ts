import { HOME_CONFIG, type SceneConfig } from "@/config/homeConfig";

export interface SceneInfo {
  id: string;
  navLabel?: string;
  category: string;
  title: string;
  tagline?: string;
  subtitle: string;
  description: string;
  metadata?: string;
  mainImage: string;
  secondaryImage?: string;
  accentColor: string;
  targetZ: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
}

export const SCENES: SceneInfo[] = HOME_CONFIG.scenes.map((s) => ({
  id: s.id,
  navLabel: s.navLabel,
  category: s.category,
  title: s.title,
  tagline: s.tagline || "",
  subtitle: s.subtitle || "",
  description: s.description || "",
  metadata: s.metadata || "",
  mainImage: s.mainImage,
  secondaryImage: s.secondaryImage,
  accentColor: s.accentColor,
  targetZ: s.targetZ,
  position: s.position,
  rotation: s.rotation,
}));

export function safeParseScenes(jsonString: unknown): SceneInfo[] {
  if (typeof jsonString !== "string" || !jsonString.trim()) {
    return SCENES;
  }
  try {
    const parsed = JSON.parse(jsonString);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed as SceneInfo[];
    }
    return SCENES;
  } catch (err) {
    console.warn("safeParseScenes encountered invalid JSON, using default SCENES:", err);
    return SCENES;
  }
}
