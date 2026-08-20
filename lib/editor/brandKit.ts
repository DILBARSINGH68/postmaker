export type BrandLogo = {
  id: string;
  name: string;
  dataUrl: string;
};

export type BrandKit = {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  headingFont: string;
  bodyFont: string;
  logos: BrandLogo[];
};

export const DEFAULT_BRAND_KIT: BrandKit = {
  name: "My Brand",
  primary: "#7c3aed",
  secondary: "#06b6d4",
  accent: "#f43f5e",
  background: "#ffffff",
  text: "#111827",
  headingFont: "Arial",
  bodyFont: "Arial",
  logos: [],
};

export const BRAND_PRESETS: Array<{
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}> = [
  {
    name: "Creator Violet",
    primary: "#7c3aed",
    secondary: "#06b6d4",
    accent: "#f43f5e",
    background: "#ffffff",
    text: "#111827",
  },
  {
    name: "Editorial Red",
    primary: "#d9482f",
    secondary: "#111827",
    accent: "#f2c14e",
    background: "#faf7f2",
    text: "#171717",
  },
  {
    name: "Ocean Blue",
    primary: "#2563eb",
    secondary: "#0f766e",
    accent: "#38bdf8",
    background: "#eff6ff",
    text: "#172033",
  },
  {
    name: "Forest Luxe",
    primary: "#365f4d",
    secondary: "#b58a52",
    accent: "#708d81",
    background: "#f5f3ec",
    text: "#17221b",
  },
  {
    name: "Rose Studio",
    primary: "#e11d48",
    secondary: "#7c3aed",
    accent: "#fb7185",
    background: "#fff1f2",
    text: "#3b1220",
  },
];

const STORAGE_KEY = "postmaker-brand-kit-v1";

export function loadBrandKit(): BrandKit {
  if (typeof window === "undefined") {
    return DEFAULT_BRAND_KIT;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) return DEFAULT_BRAND_KIT;

    const parsed = JSON.parse(raw) as Partial<BrandKit>;

    return {
      ...DEFAULT_BRAND_KIT,
      ...parsed,
      logos: Array.isArray(parsed.logos) ? parsed.logos : [],
    };
  } catch {
    return DEFAULT_BRAND_KIT;
  }
}

export function saveBrandKit(brandKit: BrandKit) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(brandKit)
  );
}
