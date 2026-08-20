import {
  Circle,
  Ellipse,
  FabricImage,
  Group,
  Line,
  Path,
  Polygon,
  Rect,
  Shadow,
  Textbox,
  type Canvas,
  type FabricObject,
} from "fabric";

export type MockupCategory =
  | "All"
  | "Devices"
  | "Social"
  | "Print"
  | "Branding"
  | "Packaging"
  | "Displays";

export type MockupFit = "fill" | "fit";

export type MockupDefinition = {
  id: string;
  name: string;
  category: Exclude<MockupCategory, "All">;
  kind:
    | "phone"
    | "tablet"
    | "laptop"
    | "desktop"
    | "watch"
    | "browser"
    | "social-post"
    | "social-story"
    | "youtube"
    | "paper"
    | "poster"
    | "card"
    | "book"
    | "magazine"
    | "tshirt"
    | "hoodie"
    | "mug"
    | "tote"
    | "bag"
    | "box"
    | "pouch"
    | "bottle"
    | "jar"
    | "can"
    | "tube"
    | "billboard"
    | "sign";
  preview: string;
  keywords: string[];
  theme: "dark" | "light" | "silver" | "cream" | "blue" | "kraft";
  variant?: number;
};

type Slot = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type Geometry = {
  width: number;
  height: number;
  slot: Slot;
  under: FabricObject[];
  over: FabricObject[];
};

export type MockupState = {
  fit: MockupFit;
  zoom: number;
  panX: number;
  panY: number;
  surfaceColor?: string;
  shadow: number;
};

const DEVICE_DEFS: MockupDefinition[] = [
  ["phone-black", "Phone — Black", "phone", "▯", "dark", 0],
  ["phone-light", "Phone — Light", "phone", "▯", "light", 1],
  ["phone-silver", "Phone — Silver", "phone", "▯", "silver", 2],
  ["phone-minimal", "Phone — Minimal", "phone", "▯", "cream", 3],
  ["tablet-portrait", "Tablet — Portrait", "tablet", "▭", "dark", 0],
  ["tablet-landscape", "Tablet — Landscape", "tablet", "▭", "silver", 1],
  ["tablet-light", "Tablet — Light", "tablet", "▭", "light", 2],
  ["laptop-dark", "Laptop — Dark", "laptop", "⌨", "dark", 0],
  ["laptop-silver", "Laptop — Silver", "laptop", "⌨", "silver", 1],
  ["laptop-light", "Laptop — Light", "laptop", "⌨", "light", 2],
  ["desktop-dark", "Desktop Monitor", "desktop", "▣", "dark", 0],
  ["desktop-silver", "Studio Monitor", "desktop", "▣", "silver", 1],
  ["watch-dark", "Smart Watch", "watch", "◉", "dark", 0],
  ["watch-light", "Smart Watch — Light", "watch", "◉", "light", 1],
  ["browser-clean", "Browser Window", "browser", "▤", "light", 0],
  ["browser-dark", "Browser — Dark", "browser", "▤", "dark", 1],
].map(([id, name, kind, preview, theme, variant]) => ({
  id: String(id),
  name: String(name),
  category: "Devices" as const,
  kind: kind as MockupDefinition["kind"],
  preview: String(preview),
  keywords: [String(name), String(kind), "device", "screen"],
  theme: theme as MockupDefinition["theme"],
  variant: Number(variant),
}));

const SOCIAL_DEFS: MockupDefinition[] = [
  ["instagram-post", "Instagram Post Preview", "social-post", "◎", 0],
  ["instagram-carousel", "Instagram Carousel", "social-post", "▦", 1],
  ["instagram-story", "Instagram Story Preview", "social-story", "▯", 0],
  ["instagram-reel", "Reel Cover Preview", "social-story", "▶", 1],
  ["youtube-thumb", "YouTube Thumbnail", "youtube", "▶", 0],
  ["youtube-player", "YouTube Player", "youtube", "▰", 1],
  ["facebook-post", "Facebook Post", "social-post", "f", 2],
  ["linkedin-post", "LinkedIn Post", "social-post", "in", 3],
  ["x-post", "X / Twitter Post", "social-post", "𝕏", 4],
  ["whatsapp-status", "WhatsApp Status", "social-story", "◉", 2],
].map(([id, name, kind, preview, variant]) => ({
  id: String(id),
  name: String(name),
  category: "Social" as const,
  kind: kind as MockupDefinition["kind"],
  preview: String(preview),
  keywords: [String(name), "social", "post", "preview"],
  theme: "light" as const,
  variant: Number(variant),
}));

const PRINT_DEFS: MockupDefinition[] = [
  ["paper-a4", "A4 Paper", "paper", "▯", 0],
  ["resume-sheet", "Resume Sheet", "paper", "▯", 1],
  ["paper-stack", "Paper Stack", "paper", "▱", 2],
  ["poster-wall", "Poster on Wall", "poster", "▥", 0],
  ["poster-frame", "Framed Poster", "poster", "▣", 1],
  ["flyer", "Flyer", "paper", "▯", 3],
  ["business-card", "Business Card", "card", "▭", 0],
  ["business-card-stack", "Business Cards Stack", "card", "▱", 1],
  ["book-cover", "Book Cover", "book", "▮", 0],
  ["book-hardcover", "Hardcover Book", "book", "▮", 1],
  ["magazine", "Magazine Cover", "magazine", "▯", 0],
  ["certificate", "Certificate", "paper", "▭", 4],
].map(([id, name, kind, preview, variant]) => ({
  id: String(id),
  name: String(name),
  category: "Print" as const,
  kind: kind as MockupDefinition["kind"],
  preview: String(preview),
  keywords: [String(name), "print", "paper", String(kind)],
  theme: "cream" as const,
  variant: Number(variant),
}));

const BRANDING_DEFS: MockupDefinition[] = [
  ["tshirt-white", "T-Shirt — White", "tshirt", "T", "light", 0],
  ["tshirt-black", "T-Shirt — Black", "tshirt", "T", "dark", 1],
  ["hoodie-light", "Hoodie — Light", "hoodie", "H", "light", 0],
  ["hoodie-dark", "Hoodie — Dark", "hoodie", "H", "dark", 1],
  ["mug-white", "Coffee Mug", "mug", "☕", "light", 0],
  ["mug-dark", "Dark Mug", "mug", "☕", "dark", 1],
  ["tote-canvas", "Canvas Tote Bag", "tote", "▱", "cream", 0],
  ["shopping-bag", "Shopping Bag", "bag", "▯", "kraft", 0],
  ["shopping-bag-black", "Luxury Shopping Bag", "bag", "▯", "dark", 1],
  ["stationery-card", "Brand Card", "card", "▭", "light", 2],
].map(([id, name, kind, preview, theme, variant]) => ({
  id: String(id),
  name: String(name),
  category: "Branding" as const,
  kind: kind as MockupDefinition["kind"],
  preview: String(preview),
  keywords: [String(name), "brand", "merch", String(kind)],
  theme: theme as MockupDefinition["theme"],
  variant: Number(variant),
}));

const PACKAGING_DEFS: MockupDefinition[] = [
  ["box-white", "Product Box", "box", "□", "light", 0],
  ["box-kraft", "Kraft Box", "box", "□", "kraft", 1],
  ["pouch-light", "Stand-up Pouch", "pouch", "▯", "light", 0],
  ["pouch-dark", "Premium Pouch", "pouch", "▯", "dark", 1],
  ["bottle-white", "Bottle", "bottle", "◉", "light", 0],
  ["bottle-dark", "Dark Bottle", "bottle", "◉", "dark", 1],
  ["jar", "Cosmetic Jar", "jar", "▰", "light", 0],
  ["can", "Beverage Can", "can", "▯", "silver", 0],
  ["tube", "Cosmetic Tube", "tube", "▯", "light", 0],
  ["cosmetic-box", "Cosmetic Box", "box", "□", "cream", 2],
].map(([id, name, kind, preview, theme, variant]) => ({
  id: String(id),
  name: String(name),
  category: "Packaging" as const,
  kind: kind as MockupDefinition["kind"],
  preview: String(preview),
  keywords: [String(name), "packaging", "label", String(kind)],
  theme: theme as MockupDefinition["theme"],
  variant: Number(variant),
}));

const DISPLAY_DEFS: MockupDefinition[] = [
  ["billboard-wide", "Wide Billboard", "billboard", "▰", 0],
  ["billboard-city", "City Billboard", "billboard", "▰", 1],
  ["sign-square", "Square Sign", "sign", "□", 0],
  ["sign-portrait", "Portrait Sign", "sign", "▯", 1],
  ["store-display", "Store Display", "sign", "▣", 2],
  ["digital-screen", "Digital Screen", "desktop", "▣", 3],
].map(([id, name, kind, preview, variant]) => ({
  id: String(id),
  name: String(name),
  category: "Displays" as const,
  kind: kind as MockupDefinition["kind"],
  preview: String(preview),
  keywords: [String(name), "display", "advertising", String(kind)],
  theme: "dark" as const,
  variant: Number(variant),
}));

export const MOCKUPS: MockupDefinition[] = [
  ...DEVICE_DEFS,
  ...SOCIAL_DEFS,
  ...PRINT_DEFS,
  ...BRANDING_DEFS,
  ...PACKAGING_DEFS,
  ...DISPLAY_DEFS,
];

export const MOCKUP_CATEGORIES: MockupCategory[] = [
  "All",
  "Devices",
  "Social",
  "Print",
  "Branding",
  "Packaging",
  "Displays",
];

const DEFAULT_STATE: MockupState = {
  fit: "fill",
  zoom: 1,
  panX: 0,
  panY: 0,
  shadow: 0.28,
};

function surface(theme: MockupDefinition["theme"], override?: string) {
  if (override) return override;
  if (theme === "dark") return "#15171c";
  if (theme === "silver") return "#cbd0d7";
  if (theme === "cream") return "#eee8dc";
  if (theme === "blue") return "#254b87";
  if (theme === "kraft") return "#b88a5a";
  return "#f8fafc";
}

function ink(theme: MockupDefinition["theme"]) {
  return theme === "dark" ? "#f8fafc" : "#111827";
}

function shadow(alpha: number) {
  return new Shadow({
    color: `rgba(15,23,42,${Math.max(0, Math.min(0.65, alpha))})`,
    blur: 24,
    offsetX: 0,
    offsetY: 12,
  });
}

function label(text: string, left: number, top: number, width: number, fill: string) {
  return new Textbox(text, {
    left,
    top,
    width,
    fontFamily: "Arial",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    fill,
    selectable: false,
    evented: false,
  });
}

function role<T extends FabricObject>(obj: T, value: string) {
  (obj as any).mockupRole = value;
  return obj;
}

function geometry(def: MockupDefinition, state: MockupState): Geometry {
  const s = surface(def.theme, state.surfaceColor);
  const fg = ink(def.theme);
  const sh = shadow(state.shadow);
  const under: FabricObject[] = [];
  const over: FabricObject[] = [];

  if (def.kind === "phone") {
    const w = 300;
    const h = 610;
    under.push(
      role(new Rect({ left: 0, top: 0, width: w, height: h, rx: 44, ry: 44, fill: s, shadow: sh }), "frame"),
      role(new Rect({ left: 18, top: 18, width: w - 36, height: h - 36, rx: 32, ry: 32, fill: "#eef2f7" }), "slot-bg")
    );
    over.push(
      role(new Rect({ left: 108, top: 10, width: 84, height: 16, rx: 8, ry: 8, fill: fg }), "detail"),
      role(new Rect({ left: 18, top: 18, width: w - 36, height: h - 36, rx: 32, ry: 32, fill: "transparent", stroke: "rgba(255,255,255,.22)", strokeWidth: 2 }), "detail")
    );
    return { width: w, height: h, slot: { x: 18, y: 18, width: w - 36, height: h - 36 }, under, over };
  }

  if (def.kind === "tablet") {
    const landscape = (def.variant || 0) === 1;
    const w = landscape ? 620 : 460;
    const h = landscape ? 450 : 620;
    under.push(
      role(new Rect({ left: 0, top: 0, width: w, height: h, rx: 36, ry: 36, fill: s, shadow: sh }), "frame"),
      role(new Rect({ left: 22, top: 22, width: w - 44, height: h - 44, rx: 22, ry: 22, fill: "#eef2f7" }), "slot-bg")
    );
    over.push(role(new Circle({ left: w - 17, top: h / 2 - 4, radius: 4, fill: fg }), "detail"));
    return { width: w, height: h, slot: { x: 22, y: 22, width: w - 44, height: h - 44 }, under, over };
  }

  if (def.kind === "laptop") {
    const w = 680;
    const h = 430;
    under.push(
      role(new Rect({ left: 54, top: 0, width: 572, height: 350, rx: 20, ry: 20, fill: s, shadow: sh }), "frame"),
      role(new Rect({ left: 76, top: 22, width: 528, height: 306, rx: 8, ry: 8, fill: "#eef2f7" }), "slot-bg"),
      role(new Rect({ left: 0, top: 350, width: 680, height: 30, rx: 8, ry: 8, fill: def.theme === "dark" ? "#3f4651" : "#b7bec8" }), "frame")
    );
    over.push(
      role(new Rect({ left: 300, top: 354, width: 80, height: 10, rx: 5, ry: 5, fill: "rgba(255,255,255,.5)" }), "detail"),
      role(new Line([95, 388, 585, 388], { stroke: "#a1a8b0", strokeWidth: 4 }), "detail")
    );
    return { width: w, height: h, slot: { x: 76, y: 22, width: 528, height: 306 }, under, over };
  }

  if (def.kind === "desktop") {
    const w = 660;
    const h = 500;
    under.push(
      role(new Rect({ left: 20, top: 0, width: 620, height: 380, rx: 18, ry: 18, fill: s, shadow: sh }), "frame"),
      role(new Rect({ left: 40, top: 20, width: 580, height: 326, rx: 7, ry: 7, fill: "#eef2f7" }), "slot-bg"),
      role(new Rect({ left: 300, top: 378, width: 60, height: 70, fill: def.theme === "dark" ? "#3f4651" : "#aab2bd" }), "frame"),
      role(new Rect({ left: 240, top: 444, width: 180, height: 18, rx: 9, ry: 9, fill: def.theme === "dark" ? "#3f4651" : "#aab2bd" }), "frame")
    );
    return { width: w, height: h, slot: { x: 40, y: 20, width: 580, height: 326 }, under, over };
  }

  if (def.kind === "watch") {
    const w = 300;
    const h = 540;
    under.push(
      role(new Rect({ left: 105, top: 0, width: 90, height: 540, rx: 34, ry: 34, fill: def.theme === "dark" ? "#24262d" : "#d8dce2" }), "frame"),
      role(new Rect({ left: 50, top: 120, width: 200, height: 250, rx: 52, ry: 52, fill: s, shadow: sh }), "frame"),
      role(new Rect({ left: 66, top: 136, width: 168, height: 218, rx: 42, ry: 42, fill: "#eef2f7" }), "slot-bg")
    );
    over.push(role(new Circle({ left: 244, top: 230, radius: 9, fill: fg }), "detail"));
    return { width: w, height: h, slot: { x: 66, y: 136, width: 168, height: 218 }, under, over };
  }

  if (def.kind === "browser") {
    const w = 700;
    const h = 470;
    under.push(
      role(new Rect({ left: 0, top: 0, width: w, height: h, rx: 20, ry: 20, fill: s, shadow: sh }), "frame"),
      role(new Rect({ left: 14, top: 58, width: w - 28, height: h - 72, rx: 8, ry: 8, fill: "#eef2f7" }), "slot-bg")
    );
    over.push(
      role(new Circle({ left: 20, top: 20, radius: 6, fill: "#fb7185" }), "detail"),
      role(new Circle({ left: 42, top: 20, radius: 6, fill: "#fbbf24" }), "detail"),
      role(new Circle({ left: 64, top: 20, radius: 6, fill: "#34d399" }), "detail"),
      role(new Rect({ left: 110, top: 14, width: 500, height: 24, rx: 12, ry: 12, fill: def.theme === "dark" ? "#343943" : "#e5e7eb" }), "detail")
    );
    return { width: w, height: h, slot: { x: 14, y: 58, width: w - 28, height: h - 72 }, under, over };
  }

  if (def.kind === "social-post") {
    const w = 520;
    const h = 620;
    under.push(
      role(new Rect({ left: 0, top: 0, width: w, height: h, rx: 22, ry: 22, fill: "#ffffff", stroke: "#e5e7eb", strokeWidth: 2, shadow: sh }), "frame"),
      role(new Circle({ left: 26, top: 24, radius: 19, fill: "#dbe4f0" }), "detail"),
      role(new Rect({ left: 78, top: 25, width: 140, height: 14, rx: 7, ry: 7, fill: "#9ca3af" }), "detail"),
      role(new Rect({ left: 20, top: 84, width: 480, height: 430, rx: 10, ry: 10, fill: "#eef2f7" }), "slot-bg")
    );
    over.push(
      role(new Textbox("♡   ◯   ↗", { left: 24, top: 536, width: 230, fontSize: 24, fill: "#111827", selectable: false, evented: false }), "detail"),
      role(new Rect({ left: 25, top: 580, width: 260, height: 10, rx: 5, ry: 5, fill: "#d1d5db" }), "detail")
    );
    return { width: w, height: h, slot: { x: 20, y: 84, width: 480, height: 430 }, under, over };
  }

  if (def.kind === "social-story") {
    const w = 330;
    const h = 640;
    under.push(
      role(new Rect({ left: 0, top: 0, width: w, height: h, rx: 38, ry: 38, fill: "#111827", shadow: sh }), "frame"),
      role(new Rect({ left: 12, top: 12, width: w - 24, height: h - 24, rx: 30, ry: 30, fill: "#eef2f7" }), "slot-bg")
    );
    over.push(
      role(new Rect({ left: 28, top: 28, width: 274, height: 6, rx: 3, ry: 3, fill: "rgba(255,255,255,.8)" }), "detail"),
      role(label("YOUR STORY", 58, 48, 214, "#ffffff"), "detail")
    );
    return { width: w, height: h, slot: { x: 12, y: 12, width: w - 24, height: h - 24 }, under, over };
  }

  if (def.kind === "youtube") {
    const w = 700;
    const h = 480;
    under.push(
      role(new Rect({ left: 0, top: 0, width: w, height: h, rx: 22, ry: 22, fill: "#ffffff", stroke: "#e5e7eb", strokeWidth: 2, shadow: sh }), "frame"),
      role(new Rect({ left: 18, top: 18, width: 664, height: 374, rx: 12, ry: 12, fill: "#eef2f7" }), "slot-bg")
    );
    over.push(
      role(new Circle({ left: 330, top: 172, radius: 34, fill: "rgba(0,0,0,.55)" }), "detail"),
      role(new Polygon([{ x: 350, y: 188 }, { x: 350, y: 224 }, { x: 382, y: 206 }], { fill: "white", selectable: false, evented: false }), "detail"),
      role(new Rect({ left: 24, top: 416, width: 380, height: 14, rx: 7, ry: 7, fill: "#9ca3af" }), "detail"),
      role(new Rect({ left: 24, top: 446, width: 220, height: 10, rx: 5, ry: 5, fill: "#d1d5db" }), "detail")
    );
    return { width: w, height: h, slot: { x: 18, y: 18, width: 664, height: 374 }, under, over };
  }

  if (["paper", "poster", "card", "book", "magazine"].includes(def.kind)) {
    const card = def.kind === "card";
    const book = def.kind === "book";
    const poster = def.kind === "poster";
    const w = card ? 560 : poster ? 440 : 460;
    const h = card ? 320 : poster ? 600 : 650;
    under.push(
      role(new Rect({ left: 0, top: 0, width: w, height: h, rx: card ? 18 : 4, ry: card ? 18 : 4, fill: s, shadow: sh }), "frame"),
      role(new Rect({ left: 12, top: 12, width: w - 24, height: h - 24, rx: card ? 12 : 2, ry: card ? 12 : 2, fill: "#ffffff" }), "slot-bg")
    );
    if (book) {
      over.push(role(new Rect({ left: 0, top: 0, width: 18, height: h, fill: "rgba(0,0,0,.15)" }), "detail"));
    }
    if ((def.variant || 0) === 2) {
      under.unshift(role(new Rect({ left: 22, top: 20, width: w, height: h, fill: "#f1f5f9", shadow: shadow(state.shadow * 0.5) }), "detail"));
    }
    return { width: w + ((def.variant || 0) === 2 ? 22 : 0), height: h + ((def.variant || 0) === 2 ? 20 : 0), slot: { x: 12, y: 12, width: w - 24, height: h - 24 }, under, over };
  }

  if (def.kind === "tshirt" || def.kind === "hoodie") {
    const hoodie = def.kind === "hoodie";
    const w = 520;
    const h = 600;
    const cloth = s;
    const bodyPath = hoodie
      ? "M145 95 L205 55 Q260 20 315 55 L375 95 L455 150 L420 245 L375 220 L365 555 L155 555 L145 220 L100 245 L65 150 Z"
      : "M155 70 L215 35 Q260 58 305 35 L365 70 L450 135 L405 220 L360 195 L350 555 L170 555 L160 195 L115 220 L70 135 Z";
    under.push(role(new Path(bodyPath, { fill: cloth, stroke: def.theme === "dark" ? "#252a31" : "#cbd5e1", strokeWidth: 2, shadow: sh }), "frame"));
    if (hoodie) {
      over.push(role(new Path("M205 58 Q260 118 315 58 Q305 22 260 16 Q215 22 205 58 Z", { fill: def.theme === "dark" ? "#252a31" : "#e5e7eb" }), "detail"));
      over.push(role(new Line([260, 92, 260, 155], { stroke: def.theme === "dark" ? "#d1d5db" : "#64748b", strokeWidth: 3 }), "detail"));
    }
    under.push(role(new Rect({ left: 175, top: 190, width: 170, height: 200, fill: "rgba(255,255,255,.10)" }), "slot-bg"));
    return { width: w, height: h, slot: { x: 175, y: 190, width: 170, height: 200 }, under, over };
  }

  if (def.kind === "mug") {
    const w = 460;
    const h = 360;
    under.push(
      role(new Rect({ left: 60, top: 60, width: 280, height: 240, rx: 36, ry: 36, fill: s, stroke: "#cbd5e1", strokeWidth: 2, shadow: sh }), "frame"),
      role(new Circle({ left: 300, top: 115, radius: 70, fill: "transparent", stroke: s, strokeWidth: 28 }), "frame"),
      role(new Rect({ left: 110, top: 105, width: 180, height: 130, fill: "rgba(255,255,255,.10)" }), "slot-bg")
    );
    return { width: w, height: h, slot: { x: 110, y: 105, width: 180, height: 130 }, under, over };
  }

  if (def.kind === "tote" || def.kind === "bag") {
    const w = 440;
    const h = 520;
    under.push(
      role(new Rect({ left: 55, top: 120, width: 330, height: 350, rx: def.kind === "bag" ? 8 : 18, ry: def.kind === "bag" ? 8 : 18, fill: s, stroke: "rgba(0,0,0,.12)", strokeWidth: 2, shadow: sh }), "frame"),
      role(new Path("M130 145 C130 35 310 35 310 145", { fill: "transparent", stroke: s, strokeWidth: 20 }), "frame"),
      role(new Rect({ left: 125, top: 205, width: 190, height: 170, fill: "rgba(255,255,255,.10)" }), "slot-bg")
    );
    return { width: w, height: h, slot: { x: 125, y: 205, width: 190, height: 170 }, under, over };
  }

  if (def.kind === "box") {
    const w = 520;
    const h = 530;
    under.push(
      role(new Polygon([{ x: 70, y: 120 }, { x: 330, y: 120 }, { x: 330, y: 450 }, { x: 70, y: 450 }], { fill: s, stroke: "rgba(0,0,0,.12)", strokeWidth: 2, shadow: sh }), "frame"),
      role(new Polygon([{ x: 330, y: 120 }, { x: 430, y: 170 }, { x: 430, y: 480 }, { x: 330, y: 450 }], { fill: def.theme === "dark" ? "#292d35" : "#d8dde4", stroke: "rgba(0,0,0,.12)", strokeWidth: 2 }), "detail"),
      role(new Polygon([{ x: 70, y: 120 }, { x: 170, y: 70 }, { x: 430, y: 170 }, { x: 330, y: 120 }], { fill: def.theme === "dark" ? "#343943" : "#edf0f4", stroke: "rgba(0,0,0,.12)", strokeWidth: 2 }), "detail"),
      role(new Rect({ left: 100, top: 170, width: 200, height: 230, fill: "rgba(255,255,255,.10)" }), "slot-bg")
    );
    return { width: w, height: h, slot: { x: 100, y: 170, width: 200, height: 230 }, under, over };
  }

  if (def.kind === "pouch") {
    const w = 420;
    const h = 560;
    under.push(
      role(new Path("M100 55 Q100 25 135 25 L285 25 Q320 25 320 55 L305 500 Q303 530 270 530 L150 530 Q117 530 115 500 Z", { fill: s, stroke: "rgba(0,0,0,.12)", strokeWidth: 2, shadow: sh }), "frame"),
      role(new Rect({ left: 132, top: 150, width: 156, height: 235, rx: 12, ry: 12, fill: "rgba(255,255,255,.10)" }), "slot-bg")
    );
    over.push(role(new Rect({ left: 130, top: 70, width: 160, height: 10, rx: 5, ry: 5, fill: "rgba(0,0,0,.16)" }), "detail"));
    return { width: w, height: h, slot: { x: 132, y: 150, width: 156, height: 235 }, under, over };
  }

  if (def.kind === "bottle") {
    const w = 380;
    const h = 600;
    under.push(
      role(new Rect({ left: 145, top: 30, width: 90, height: 70, rx: 8, ry: 8, fill: def.theme === "dark" ? "#24262d" : "#d5dae1" }), "detail"),
      role(new Rect({ left: 95, top: 90, width: 190, height: 450, rx: 58, ry: 58, fill: s, stroke: "rgba(0,0,0,.12)", strokeWidth: 2, shadow: sh }), "frame"),
      role(new Rect({ left: 120, top: 225, width: 140, height: 185, rx: 12, ry: 12, fill: "rgba(255,255,255,.12)" }), "slot-bg")
    );
    return { width: w, height: h, slot: { x: 120, y: 225, width: 140, height: 185 }, under, over };
  }

  if (def.kind === "jar") {
    const w = 440;
    const h = 360;
    under.push(
      role(new Rect({ left: 90, top: 60, width: 260, height: 70, rx: 22, ry: 22, fill: def.theme === "dark" ? "#30343c" : "#d6dae0", shadow: sh }), "detail"),
      role(new Rect({ left: 75, top: 120, width: 290, height: 190, rx: 55, ry: 55, fill: s, stroke: "rgba(0,0,0,.12)", strokeWidth: 2 }), "frame"),
      role(new Rect({ left: 125, top: 165, width: 190, height: 100, rx: 10, ry: 10, fill: "rgba(255,255,255,.12)" }), "slot-bg")
    );
    return { width: w, height: h, slot: { x: 125, y: 165, width: 190, height: 100 }, under, over };
  }

  if (def.kind === "can") {
    const w = 340;
    const h = 570;
    under.push(
      role(new Rect({ left: 85, top: 35, width: 170, height: 490, rx: 70, ry: 70, fill: s, stroke: "#9ba3ad", strokeWidth: 2, shadow: sh }), "frame"),
      role(new Ellipse({ left: 92, top: 35, rx: 78, ry: 18, fill: "rgba(255,255,255,.45)" }), "detail"),
      role(new Rect({ left: 110, top: 160, width: 120, height: 200, rx: 12, ry: 12, fill: "rgba(255,255,255,.10)" }), "slot-bg")
    );
    return { width: w, height: h, slot: { x: 110, y: 160, width: 120, height: 200 }, under, over };
  }

  if (def.kind === "tube") {
    const w = 360;
    const h = 590;
    under.push(
      role(new Path("M100 50 L260 50 L245 500 Q240 535 205 535 L155 535 Q120 535 115 500 Z", { fill: s, stroke: "rgba(0,0,0,.12)", strokeWidth: 2, shadow: sh }), "frame"),
      role(new Rect({ left: 125, top: 505, width: 110, height: 45, rx: 8, ry: 8, fill: "#cbd5e1" }), "detail"),
      role(new Rect({ left: 125, top: 170, width: 110, height: 210, rx: 10, ry: 10, fill: "rgba(255,255,255,.10)" }), "slot-bg")
    );
    return { width: w, height: h, slot: { x: 125, y: 170, width: 110, height: 210 }, under, over };
  }

  if (def.kind === "billboard") {
    const w = 760;
    const h = 500;
    under.push(
      role(new Rect({ left: 30, top: 20, width: 700, height: 330, rx: 10, ry: 10, fill: "#30343c", shadow: sh }), "frame"),
      role(new Rect({ left: 48, top: 38, width: 664, height: 294, fill: "#eef2f7" }), "slot-bg"),
      role(new Rect({ left: 330, top: 350, width: 100, height: 110, fill: "#69717c" }), "detail"),
      role(new Rect({ left: 250, top: 455, width: 260, height: 16, rx: 8, ry: 8, fill: "#69717c" }), "detail")
    );
    return { width: w, height: h, slot: { x: 48, y: 38, width: 664, height: 294 }, under, over };
  }

  const w = (def.variant || 0) === 1 ? 390 : 520;
  const h = (def.variant || 0) === 1 ? 590 : 420;
  under.push(
    role(new Rect({ left: 30, top: 30, width: w - 60, height: h - 100, rx: 8, ry: 8, fill: s, shadow: sh }), "frame"),
    role(new Rect({ left: 48, top: 48, width: w - 96, height: h - 136, fill: "#eef2f7" }), "slot-bg"),
    role(new Rect({ left: w / 2 - 14, top: h - 70, width: 28, height: 70, fill: "#6b7280" }), "detail")
  );
  return { width: w, height: h, slot: { x: 48, y: 48, width: w - 96, height: h - 136 }, under, over };
}


async function mockupImage(
  src: string,
  slot: Slot,
  state: MockupState
) {
  const img = await FabricImage.fromURL(src);
  const sourceW = Math.max(1, img.width || 1);
  const sourceH = Math.max(1, img.height || 1);

  (img as any).mockupRole = "image";
  img.set({ selectable: false, evented: false });

  if (state.fit === "fit") {
    const scale = Math.min(slot.width / sourceW, slot.height / sourceH) * Math.max(0.25, state.zoom);
    const shownW = sourceW * scale;
    const shownH = sourceH * scale;
    const freeX = Math.max(0, slot.width - shownW);
    const freeY = Math.max(0, slot.height - shownH);
    img.set({
      left: slot.x + freeX / 2 + state.panX * freeX * 0.5,
      top: slot.y + freeY / 2 + state.panY * freeY * 0.5,
      scaleX: scale,
      scaleY: scale,
      cropX: 0,
      cropY: 0,
      width: sourceW,
      height: sourceH,
    });
    return img;
  }

  const baseScale = Math.max(slot.width / sourceW, slot.height / sourceH);
  const scale = baseScale * Math.max(1, state.zoom);
  const cropW = Math.min(sourceW, slot.width / scale);
  const cropH = Math.min(sourceH, slot.height / scale);
  const maxCropX = Math.max(0, sourceW - cropW);
  const maxCropY = Math.max(0, sourceH - cropH);
  const cropX = maxCropX * (0.5 + Math.max(-1, Math.min(1, state.panX)) * 0.5);
  const cropY = maxCropY * (0.5 + Math.max(-1, Math.min(1, state.panY)) * 0.5);

  img.set({
    left: slot.x,
    top: slot.y,
    width: cropW,
    height: cropH,
    cropX,
    cropY,
    scaleX: scale,
    scaleY: scale,
  });

  return img;
}

export async function createMockupGroup(
  id: string,
  imageSrc?: string,
  partialState?: Partial<MockupState>
) {
  const def = MOCKUPS.find((item) => item.id === id);
  if (!def) throw new Error(`Unknown mockup: ${id}`);

  const state: MockupState = { ...DEFAULT_STATE, ...partialState };
  const geo = geometry(def, state);
  const objects: FabricObject[] = [...geo.under];

  if (imageSrc) {
    objects.push(await mockupImage(imageSrc, geo.slot, state));
  } else {
    objects.push(
      role(
        new Rect({
          left: geo.slot.x,
          top: geo.slot.y,
          width: geo.slot.width,
          height: geo.slot.height,
          fill: "#eef2f7",
          stroke: "#cbd5e1",
          strokeWidth: 2,
          strokeDashArray: [10, 8],
          selectable: false,
          evented: false,
        }),
        "placeholder"
      ),
      role(
        label("ADD IMAGE", geo.slot.x, geo.slot.y + geo.slot.height / 2 - 10, geo.slot.width, "#64748b"),
        "placeholder"
      )
    );
  }

  objects.push(...geo.over);

  const group = new Group(objects, {
    objectCaching: false,
    subTargetCheck: false,
  });

  (group as any).isMockup = true;
  (group as any).mockupId = id;
  (group as any).mockupFit = state.fit;
  (group as any).mockupZoom = state.zoom;
  (group as any).mockupPanX = state.panX;
  (group as any).mockupPanY = state.panY;
  (group as any).mockupSurfaceColor = state.surfaceColor || "";
  (group as any).mockupShadow = state.shadow;
  (group as any).mockupName = def.name;

  return group;
}

export function isMockupObject(obj: FabricObject | null | undefined) {
  return Boolean(obj && (obj as any).isMockup === true && obj.type === "group");
}

export function getMockupDefinition(obj: FabricObject | null | undefined) {
  if (!isMockupObject(obj)) return null;
  const id = String((obj as any).mockupId || "");
  return MOCKUPS.find((item) => item.id === id) || null;
}

export function getMockupImageSource(obj: FabricObject | null | undefined) {
  if (!isMockupObject(obj)) return null;
  const group = obj as Group;
  const child = group.getObjects().find((item: any) => item.mockupRole === "image");
  if (!child) return null;
  const image = child as FabricImage;
  return typeof (image as any).getSrc === "function" ? (image as any).getSrc() : ((image as any).src || null);
}

export function getMockupState(obj: FabricObject): MockupState {
  return {
    fit: (obj as any).mockupFit === "fit" ? "fit" : "fill",
    zoom: Number((obj as any).mockupZoom ?? 1),
    panX: Number((obj as any).mockupPanX ?? 0),
    panY: Number((obj as any).mockupPanY ?? 0),
    surfaceColor: String((obj as any).mockupSurfaceColor || "") || undefined,
    shadow: Number((obj as any).mockupShadow ?? 0.28),
  };
}

function copyTransform(from: FabricObject, to: FabricObject) {
  to.set({
    left: from.left,
    top: from.top,
    scaleX: from.scaleX,
    scaleY: from.scaleY,
    angle: from.angle,
    skewX: from.skewX,
    skewY: from.skewY,
    flipX: from.flipX,
    flipY: from.flipY,
    opacity: from.opacity,
    selectable: from.selectable,
    evented: from.evented,
    visible: from.visible,
    lockMovementX: from.lockMovementX,
    lockMovementY: from.lockMovementY,
    lockScalingX: from.lockScalingX,
    lockScalingY: from.lockScalingY,
    lockRotation: from.lockRotation,
  });
}

export async function rebuildMockup(
  canvas: Canvas,
  current: FabricObject,
  changes: Partial<MockupState>,
  imageSrcOverride?: string | null
) {
  if (!isMockupObject(current)) return null;
  const id = String((current as any).mockupId || "");
  const state = { ...getMockupState(current), ...changes };
  const currentSrc = getMockupImageSource(current);
  const src = imageSrcOverride === undefined ? currentSrc : imageSrcOverride;
  const index = canvas.getObjects().indexOf(current);
  const replacement = await createMockupGroup(id, src || undefined, state);
  copyTransform(current, replacement);
  canvas.remove(current);
  canvas.add(replacement);

  const currentIndex = canvas.getObjects().indexOf(replacement);
  for (let i = currentIndex; i > index; i--) {
    canvas.sendObjectBackwards(replacement);
  }

  canvas.setActiveObject(replacement);
  canvas.requestRenderAll();
  return replacement;
}
