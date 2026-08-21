import {
  Circle,
  FabricImage,
  Line,
  Path,
  Rect,
  Shadow,
  Textbox,
  type Canvas,
  type FabricObject,
} from "fabric";

import { getSocialTemplateImage } from "@/lib/editor/templateImages";

export type FlagshipTemplateDefinition = {
  type: string;
  name: string;
  category: string;
  previewClass: string;
  kind: "social" | "resume";
  formatName: string;
  layout: number;
  accent: string;
  bg: string;
  fg: string;
  soft: string;
  image?: string;
  width: number;
  height: number;
  premium: true;
  flagship: true;
  festival?: boolean;
  region?: string;
};

type SocialFlagshipSeed = Omit<FlagshipTemplateDefinition, "kind" | "premium" | "flagship" | "image"> & {
  imageKey: string;
};

const SOCIAL_FLAGSHIP: SocialFlagshipSeed[] = [
  {
    type: "flagship-instagram-hiring-electric",
    name: "Electric Hiring Studio",
    category: "Flagship / Hiring",
    previewClass: "from-blue-950 via-blue-700 to-yellow-300",
    formatName: "Instagram Post",
    layout: 100,
    accent: "#ffd84d",
    bg: "#111fd8",
    fg: "#ffffff",
    soft: "#0a145f",
    imageKey: "business",
    width: 1080,
    height: 1080,
  },
  {
    type: "flagship-instagram-fashion-noir",
    name: "Noir Fashion Journal",
    category: "Flagship / Fashion",
    previewClass: "from-stone-100 via-stone-50 to-red-500",
    formatName: "Instagram Post (4:5)",
    layout: 101,
    accent: "#f0442f",
    bg: "#f3eee5",
    fg: "#151515",
    soft: "#ddd4c5",
    imageKey: "fashion",
    width: 1080,
    height: 1350,
  },
  {
    type: "flagship-instagram-food-bistro",
    name: "Modern Bistro Special",
    category: "Flagship / Food",
    previewClass: "from-red-950 via-rose-900 to-amber-100",
    formatName: "Instagram Post",
    layout: 102,
    accent: "#f5d7a1",
    bg: "#6f1721",
    fg: "#fff8eb",
    soft: "#3a0e16",
    imageKey: "food",
    width: 1080,
    height: 1080,
  },
  {
    type: "flagship-story-travel-postcards",
    name: "Postcard Travel Story",
    category: "Flagship / Travel",
    previewClass: "from-sky-200 via-cyan-100 to-orange-400",
    formatName: "Instagram Story",
    layout: 103,
    accent: "#ff653f",
    bg: "#dff4f5",
    fg: "#112f3b",
    soft: "#ffffff",
    imageKey: "travel",
    width: 1080,
    height: 1920,
  },
  {
    type: "flagship-story-event-neon",
    name: "Neon Afterdark Event",
    category: "Flagship / Event",
    previewClass: "from-black via-fuchsia-950 to-cyan-400",
    formatName: "Instagram Story",
    layout: 104,
    accent: "#ff4fd8",
    bg: "#07020d",
    fg: "#ffffff",
    soft: "#171020",
    imageKey: "event",
    width: 1080,
    height: 1920,
  },
  {
    type: "flagship-youtube-finance-dashboard",
    name: "Finance Dashboard Thumbnail",
    category: "Flagship / Finance",
    previewClass: "from-emerald-950 via-green-900 to-lime-300",
    formatName: "YouTube Thumbnail",
    layout: 105,
    accent: "#c9ff65",
    bg: "#08241c",
    fg: "#ffffff",
    soft: "#12382c",
    imageKey: "finance",
    width: 1280,
    height: 720,
  },
  {
    type: "flagship-youtube-fitness-impact",
    name: "Fitness Impact Thumbnail",
    category: "Flagship / Fitness",
    previewClass: "from-black via-neutral-900 to-orange-600",
    formatName: "YouTube Thumbnail",
    layout: 106,
    accent: "#ff5a1f",
    bg: "#0b0b0b",
    fg: "#ffffff",
    soft: "#1f1f1f",
    imageKey: "fitness",
    width: 1280,
    height: 720,
  },
  {
    type: "flagship-facebook-realestate-luxe",
    name: "Luxe Property Campaign",
    category: "Flagship / Real Estate",
    previewClass: "from-stone-50 via-amber-50 to-emerald-900",
    formatName: "Facebook Post",
    layout: 107,
    accent: "#8a6a42",
    bg: "#f6f0e6",
    fg: "#203027",
    soft: "#dcd6c9",
    imageKey: "realestate",
    width: 940,
    height: 788,
  },
  {
    type: "flagship-linkedin-leadership-report",
    name: "Leadership Report Card",
    category: "Flagship / Business",
    previewClass: "from-slate-950 via-blue-950 to-sky-300",
    formatName: "LinkedIn Post",
    layout: 108,
    accent: "#8bd7ff",
    bg: "#0d1b2f",
    fg: "#ffffff",
    soft: "#172a45",
    imageKey: "business",
    width: 1200,
    height: 1200,
  },
  {
    type: "flagship-instagram-creator-collage",
    name: "Creator Collage System",
    category: "Flagship / Creator",
    previewClass: "from-violet-950 via-fuchsia-600 to-lime-300",
    formatName: "Instagram Post (4:5)",
    layout: 109,
    accent: "#c7ff45",
    bg: "#291058",
    fg: "#ffffff",
    soft: "#f4d8ff",
    imageKey: "creator",
    width: 1080,
    height: 1350,
  },
];

const RESUME_FLAGSHIP: FlagshipTemplateDefinition[] = [
  {
    type: "flagship-resume-executive-editorial",
    name: "Executive Editorial",
    category: "Flagship / Executive Resume",
    previewClass: "from-slate-950 via-blue-950 to-stone-100",
    kind: "resume",
    formatName: "A4 Portrait",
    layout: 200,
    accent: "#c99d5b",
    bg: "#f8f5ef",
    fg: "#172033",
    soft: "#e7e0d4",
    image: getSocialTemplateImage("business"),
    width: 2480,
    height: 3508,
    premium: true,
    flagship: true,
  },
  {
    type: "flagship-resume-creative-grid",
    name: "Creative Grid Portfolio",
    category: "Flagship / Creative Resume",
    previewClass: "from-zinc-950 via-fuchsia-950 to-orange-400",
    kind: "resume",
    formatName: "A4 Portrait",
    layout: 201,
    accent: "#ff7a45",
    bg: "#141217",
    fg: "#f8f3ed",
    soft: "#2a2530",
    image: getSocialTemplateImage("creator"),
    width: 2480,
    height: 3508,
    premium: true,
    flagship: true,
  },
];

export const FLAGSHIP_TEMPLATE_DEFINITIONS: FlagshipTemplateDefinition[] = [
  ...SOCIAL_FLAGSHIP.map((item) => ({
    ...item,
    kind: "social" as const,
    image: getSocialTemplateImage(item.imageKey),
    premium: true as const,
    flagship: true as const,
  })),
  ...RESUME_FLAGSHIP,
];

const byType = new Map(FLAGSHIP_TEMPLATE_DEFINITIONS.map((item) => [item.type, item]));

export function isFlagshipTemplate(type: string) {
  return byType.has(type);
}

function addRect(
  canvas: Canvas,
  x: number,
  y: number,
  width: number,
  height: number,
  fill: string,
  radius = 0,
  extra: Record<string, unknown> = {}
) {
  const object = new Rect({
    left: x,
    top: y,
    width,
    height,
    fill,
    rx: radius,
    ry: radius,
    originX: "left",
    originY: "top",
    ...extra,
  });
  canvas.add(object);
  return object;
}

function addText(
  canvas: Canvas,
  value: string,
  options: {
    x: number;
    y: number;
    width: number;
    size: number;
    fill: string;
    weight?: "normal" | "bold";
    family?: string;
    align?: "left" | "center" | "right";
    lineHeight?: number;
    spacing?: number;
    stroke?: string;
    strokeWidth?: number;
    angle?: number;
  }
) {
  const object = new Textbox(value, {
    left: options.x,
    top: options.y,
    width: options.width,
    fontSize: options.size,
    fill: options.fill,
    fontWeight: options.weight || "normal",
    fontFamily: options.family || "Arial",
    textAlign: options.align || "left",
    lineHeight: options.lineHeight ?? 1.05,
    charSpacing: options.spacing ?? 0,
    stroke: options.stroke,
    strokeWidth: options.strokeWidth ?? 0,
    angle: options.angle ?? 0,
    editable: true,
    splitByGrapheme: false,
    objectCaching: false,
    padding: 2,
    originX: "left",
    originY: "top",
  });
  canvas.add(object);
  return object;
}

function addLine(
  canvas: Canvas,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  stroke: string,
  strokeWidth = 2
) {
  const line = new Line([x1, y1, x2, y2], {
    stroke,
    strokeWidth,
    selectable: true,
    evented: true,
    originX: "left",
    originY: "top",
  });
  canvas.add(line);
  return line;
}

function addCircle(
  canvas: Canvas,
  x: number,
  y: number,
  radius: number,
  fill: string,
  extra: Record<string, unknown> = {}
) {
  const circle = new Circle({
    left: x,
    top: y,
    radius,
    fill,
    originX: "left",
    originY: "top",
    ...extra,
  });
  canvas.add(circle);
  return circle;
}

function addStar(canvas: Canvas, x: number, y: number, scale: number, fill: string) {
  const star = new Path(
    "M 50 0 L 61 35 L 98 35 L 68 57 L 79 91 L 50 70 L 21 91 L 32 57 L 2 35 L 39 35 Z",
    {
      left: x,
      top: y,
      scaleX: scale,
      scaleY: scale,
      fill,
      stroke: "transparent",
      originX: "left",
      originY: "top",
    }
  );
  canvas.add(star);
  return star;
}

function addPhoto(
  canvas: Canvas,
  imageUrl: string | undefined,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  renderToken: string,
  fallback: string,
  options: { angle?: number; border?: string; shadow?: boolean; cropBiasX?: number; cropBiasY?: number } = {}
) {
  const slot = addRect(canvas, x, y, width, height, fallback, radius, {
    angle: options.angle ?? 0,
    stroke: options.border || "transparent",
    strokeWidth: options.border ? Math.max(2, Math.min(width, height) * 0.012) : 0,
    shadow: options.shadow
      ? new Shadow({ color: "rgba(0,0,0,0.24)", blur: 24, offsetX: 0, offsetY: 14 })
      : undefined,
  });

  if (!imageUrl) return slot;

  void FabricImage.fromURL(imageUrl, { crossOrigin: "anonymous" } as any)
    .then((image) => {
      if ((canvas as any).__postMakerTemplateToken !== renderToken) return;

      const sourceW = Math.max(1, Number(image.width || 1));
      const sourceH = Math.max(1, Number(image.height || 1));
      const targetRatio = width / Math.max(1, height);
      const sourceRatio = sourceW / sourceH;

      let cropX = 0;
      let cropY = 0;
      let cropW = sourceW;
      let cropH = sourceH;

      if (sourceRatio > targetRatio) {
        cropW = sourceH * targetRatio;
        cropX = (sourceW - cropW) * Math.min(1, Math.max(0, options.cropBiasX ?? 0.5));
      } else {
        cropH = sourceW / targetRatio;
        cropY = (sourceH - cropH) * Math.min(1, Math.max(0, options.cropBiasY ?? 0.5));
      }

      const localRadius = Math.max(0, Math.min(radius, Math.min(cropW, cropH) / 2));
      const clipPath = new Rect({
        width: cropW,
        height: cropH,
        rx: localRadius,
        ry: localRadius,
        originX: "center",
        originY: "center",
      });

      image.set({
        left: x,
        top: y,
        width: cropW,
        height: cropH,
        cropX,
        cropY,
        scaleX: width / cropW,
        scaleY: height / cropH,
        angle: options.angle ?? 0,
        originX: "left",
        originY: "top",
        clipPath,
        shadow: options.shadow
          ? new Shadow({ color: "rgba(0,0,0,0.24)", blur: 24, offsetX: 0, offsetY: 14 })
          : undefined,
      });

      (image as any).templateImage = true;
      (image as any).templateImageUrl = imageUrl;
      (image as any).cornerRadius = localRadius;
      image.setCoords();

      const slotIndex = canvas.getObjects().indexOf(slot as unknown as FabricObject);
      canvas.add(image);
      if (slotIndex >= 0 && typeof (canvas as any).moveObjectTo === "function") {
        (canvas as any).moveObjectTo(image, slotIndex + 1);
      }
      canvas.requestRenderAll();
    })
    .catch(() => {
      // Styled fallback remains visible when a remote photo cannot load.
    });

  return slot;
}

function labelPill(canvas: Canvas, value: string, x: number, y: number, width: number, height: number, bg: string, fg: string) {
  addRect(canvas, x, y, width, height, bg, height / 2);
  addText(canvas, value, {
    x,
    y: y + height * 0.26,
    width,
    size: height * 0.28,
    fill: fg,
    weight: "bold",
    align: "center",
    spacing: 70,
  });
}

function renderHiring(canvas: Canvas, item: FlagshipTemplateDefinition, token: string) {
  const w = canvas.getWidth();
  const h = canvas.getHeight();
  canvas.clear();
  canvas.backgroundColor = item.bg;

  for (let i = 0; i < 6; i++) {
    addLine(canvas, w * (0.69 + i * 0.045), 0, w * (0.69 + i * 0.045), h * 0.23, "rgba(255,255,255,0.18)", 2);
    addLine(canvas, w * 0.69, h * (0.04 + i * 0.038), w, h * (0.04 + i * 0.038), "rgba(255,255,255,0.18)", 2);
  }

  addText(canvas, "KRIYAVO / CAREERS", { x: w * 0.07, y: h * 0.065, width: w * 0.42, size: w * 0.025, fill: item.accent, weight: "bold", spacing: 180 });
  labelPill(canvas, "WE ARE", w * 0.07, h * 0.16, w * 0.22, h * 0.075, item.accent, "#101fd0");
  addText(canvas, "HIRING", { x: w * 0.065, y: h * 0.27, width: w * 0.62, size: w * 0.16, fill: "#ffffff", weight: "bold", family: "Arial", lineHeight: 0.82, spacing: -35 });
  addText(canvas, "DESIGN + CONTENT", { x: w * 0.075, y: h * 0.58, width: w * 0.43, size: w * 0.036, fill: "#ffffff", weight: "bold", spacing: 40 });

  addPhoto(canvas, item.image, w * 0.58, h * 0.37, w * 0.34, h * 0.50, w * 0.035, token, "#3542e6", { border: "#ffffff", shadow: true, cropBiasX: 0.64 });
  addRect(canvas, w * 0.54, h * 0.43, w * 0.10, w * 0.10, item.accent, w * 0.05, { angle: -9 });
  addStar(canvas, w * 0.555, h * 0.447, w * 0.00062, "#111fd8");

  ["GRAPHIC DESIGNER", "CONTENT WRITER", "SOCIAL CREATIVE"].forEach((role, index) => {
    const y = h * (0.69 + index * 0.065);
    addRect(canvas, w * 0.07, y, w * 0.43, h * 0.052, "#ffffff", h * 0.026);
    addCircle(canvas, w * 0.085, y + h * 0.012, h * 0.014, index % 2 === 0 ? item.accent : "#101fd0");
    addText(canvas, role, { x: w * 0.125, y: y + h * 0.014, width: w * 0.34, size: w * 0.0185, fill: "#101fd0", weight: "bold" });
  });

  addText(canvas, "SEND YOUR PORTFOLIO", { x: w * 0.07, y: h * 0.91, width: w * 0.34, size: w * 0.018, fill: item.accent, weight: "bold", spacing: 90 });
  addText(canvas, "hello@kriyavo.design", { x: w * 0.07, y: h * 0.945, width: w * 0.36, size: w * 0.018, fill: "#ffffff" });
}

function renderFashion(canvas: Canvas, item: FlagshipTemplateDefinition, token: string) {
  const w = canvas.getWidth();
  const h = canvas.getHeight();
  canvas.clear();
  canvas.backgroundColor = item.bg;

  addText(canvas, "ISSUE 07", { x: w * 0.06, y: h * 0.045, width: w * 0.20, size: w * 0.023, fill: item.fg, weight: "bold", spacing: 150 });
  addText(canvas, "KRIYAVO JOURNAL", { x: w * 0.64, y: h * 0.045, width: w * 0.28, size: w * 0.018, fill: item.fg, weight: "bold", align: "right", spacing: 100 });
  addPhoto(canvas, item.image, w * 0.07, h * 0.12, w * 0.86, h * 0.46, w * 0.018, token, item.soft, { shadow: true, cropBiasX: 0.55 });
  addRect(canvas, w * 0.75, h * 0.09, w * 0.16, h * 0.07, item.accent, 0, { angle: 4 });
  addText(canvas, "NEW DROP", { x: w * 0.75, y: h * 0.108, width: w * 0.16, size: w * 0.018, fill: "#ffffff", weight: "bold", align: "center" });
  addText(canvas, "THE\nNEW EDIT", { x: w * 0.06, y: h * 0.615, width: w * 0.60, size: w * 0.095, fill: item.fg, weight: "bold", family: "Georgia", lineHeight: 0.82, spacing: -30 });
  addText(canvas, "Quiet luxury, sharper lines and pieces made to outlive the season.", { x: w * 0.68, y: h * 0.65, width: w * 0.24, size: w * 0.024, fill: item.fg, lineHeight: 1.25 });
  addLine(canvas, w * 0.68, h * 0.79, w * 0.92, h * 0.79, item.accent, 4);
  addText(canvas, "01 / TEXTURE\n02 / FORM\n03 / ATTITUDE", { x: w * 0.68, y: h * 0.82, width: w * 0.24, size: w * 0.019, fill: item.fg, weight: "bold", lineHeight: 1.5, spacing: 70 });
  addText(canvas, "SHOP THE EDIT ->", { x: w * 0.06, y: h * 0.91, width: w * 0.37, size: w * 0.022, fill: item.accent, weight: "bold", spacing: 80 });
}

function renderFood(canvas: Canvas, item: FlagshipTemplateDefinition, token: string) {
  const w = canvas.getWidth();
  const h = canvas.getHeight();
  canvas.clear();
  canvas.backgroundColor = item.bg;

  addCircle(canvas, w * 0.61, h * 0.03, w * 0.27, "#852334");
  addPhoto(canvas, item.image, w * 0.48, h * 0.08, w * 0.45, h * 0.56, w * 0.225, token, "#8b2636", { border: item.accent, shadow: true });
  addText(canvas, "TABLE / 08", { x: w * 0.07, y: h * 0.07, width: w * 0.28, size: w * 0.021, fill: item.accent, weight: "bold", spacing: 160 });
  addText(canvas, "DINNER\nIS SERVED", { x: w * 0.065, y: h * 0.19, width: w * 0.50, size: w * 0.085, fill: item.fg, weight: "bold", family: "Georgia", lineHeight: 0.88 });
  addText(canvas, "Seasonal plates / natural wine / warm evenings", { x: w * 0.07, y: h * 0.49, width: w * 0.32, size: w * 0.024, fill: item.fg, lineHeight: 1.25 });
  addRect(canvas, w * 0.07, h * 0.64, w * 0.86, h * 0.25, "#fff6e6", w * 0.03);
  addText(canvas, "TONIGHT'S NOTES", { x: w * 0.10, y: h * 0.68, width: w * 0.28, size: w * 0.018, fill: "#6f1721", weight: "bold", spacing: 120 });
  ["Charred greens", "House pasta", "Citrus tart"].forEach((dish, index) => {
    addText(canvas, String(index + 1).padStart(2, "0"), { x: w * (0.10 + index * 0.27), y: h * 0.75, width: w * 0.06, size: w * 0.02, fill: item.accent, weight: "bold" });
    addText(canvas, dish, { x: w * (0.10 + index * 0.27), y: h * 0.795, width: w * 0.22, size: w * 0.021, fill: "#6f1721", weight: "bold" });
  });
  labelPill(canvas, "BOOK A TABLE", w * 0.68, h * 0.92, w * 0.25, h * 0.055, item.accent, "#6f1721");
}

function renderTravelStory(canvas: Canvas, item: FlagshipTemplateDefinition, token: string) {
  const w = canvas.getWidth();
  const h = canvas.getHeight();
  canvas.clear();
  canvas.backgroundColor = item.bg;

  addText(canvas, "WEEKEND FILES", { x: w * 0.07, y: h * 0.045, width: w * 0.35, size: w * 0.023, fill: item.fg, weight: "bold", spacing: 150 });
  addText(canvas, "03 DAYS / COAST", { x: w * 0.60, y: h * 0.045, width: w * 0.33, size: w * 0.018, fill: item.fg, weight: "bold", align: "right", spacing: 100 });

  addRect(canvas, w * 0.08, h * 0.13, w * 0.78, h * 0.34, "#ffffff", w * 0.02, { angle: -4, shadow: new Shadow({ color: "rgba(17,47,59,0.18)", blur: 22, offsetX: 0, offsetY: 12 }) });
  addPhoto(canvas, item.image, w * 0.105, h * 0.155, w * 0.73, h * 0.26, w * 0.012, token, "#bddfe3", { angle: -4, cropBiasY: 0.35 });
  addText(canvas, "somewhere warm", { x: w * 0.15, y: h * 0.405, width: w * 0.52, size: w * 0.026, fill: item.fg, family: "Courier New", angle: -4 });

  addRect(canvas, w * 0.54, h * 0.39, w * 0.39, h * 0.25, "#ffffff", w * 0.018, { angle: 6, shadow: new Shadow({ color: "rgba(17,47,59,0.16)", blur: 18, offsetX: 0, offsetY: 10 }) });
  addPhoto(canvas, item.image, w * 0.565, h * 0.415, w * 0.34, h * 0.16, w * 0.010, token, "#bddfe3", { angle: 6, cropBiasX: 0.8, cropBiasY: 0.7 });
  addText(canvas, "SUN / SALT / SLOW", { x: w * 0.59, y: h * 0.58, width: w * 0.28, size: w * 0.018, fill: item.accent, weight: "bold", angle: 6, spacing: 90 });

  addText(canvas, "TAKE\nTHE LONG\nWAY", { x: w * 0.07, y: h * 0.57, width: w * 0.62, size: w * 0.105, fill: item.fg, weight: "bold", family: "Georgia", lineHeight: 0.82, spacing: -35 });
  addCircle(canvas, w * 0.70, h * 0.72, w * 0.10, item.accent, { angle: 8 });
  addText(canvas, "GO", { x: w * 0.70, y: h * 0.744, width: w * 0.20, size: w * 0.045, fill: "#ffffff", weight: "bold", align: "center" });
  addText(canvas, "A small guide to quiet beaches, local cafes and mornings without an alarm.", { x: w * 0.08, y: h * 0.84, width: w * 0.56, size: w * 0.027, fill: item.fg, lineHeight: 1.3 });
  addText(canvas, "SAVE FOR LATER ->", { x: w * 0.08, y: h * 0.945, width: w * 0.40, size: w * 0.021, fill: item.accent, weight: "bold", spacing: 90 });
}

function renderEventStory(canvas: Canvas, item: FlagshipTemplateDefinition, token: string) {
  const w = canvas.getWidth();
  const h = canvas.getHeight();
  canvas.clear();
  canvas.backgroundColor = item.bg;
  addPhoto(canvas, item.image, 0, 0, w, h, 0, token, item.soft, { cropBiasY: 0.4 });
  addRect(canvas, 0, 0, w, h, "rgba(7,2,13,0.64)");
  addRect(canvas, w * 0.06, h * 0.06, w * 0.88, h * 0.88, "transparent", w * 0.025, { stroke: "rgba(255,255,255,0.48)", strokeWidth: 3 });
  addText(canvas, "AFTERDARK / 26", { x: w * 0.09, y: h * 0.09, width: w * 0.42, size: w * 0.022, fill: "#7df9ff", weight: "bold", spacing: 160 });
  addText(canvas, "08", { x: w * 0.09, y: h * 0.19, width: w * 0.36, size: w * 0.20, fill: "transparent", weight: "bold", stroke: item.accent, strokeWidth: w * 0.004, lineHeight: 0.8 });
  addText(canvas, "FRIDAY", { x: w * 0.12, y: h * 0.36, width: w * 0.48, size: w * 0.045, fill: "#ffffff", weight: "bold", spacing: 210 });
  addText(canvas, "ONE NIGHT.\nFULL VOLUME.", { x: w * 0.09, y: h * 0.49, width: w * 0.78, size: w * 0.095, fill: "#ffffff", weight: "bold", lineHeight: 0.84, spacing: -25 });
  addRect(canvas, w * 0.09, h * 0.72, w * 0.50, h * 0.105, "rgba(255,79,216,0.20)", h * 0.018, { stroke: item.accent, strokeWidth: 3 });
  addText(canvas, "LIVE SETS / VISUALS / LATE FOOD", { x: w * 0.12, y: h * 0.747, width: w * 0.44, size: w * 0.020, fill: "#ffffff", weight: "bold", lineHeight: 1.3, spacing: 65 });
  labelPill(canvas, "GET TICKETS", w * 0.09, h * 0.865, w * 0.36, h * 0.065, item.accent, "#15031b");
  addText(canvas, "DOORS 8 PM / STUDIO 04", { x: w * 0.57, y: h * 0.887, width: w * 0.31, size: w * 0.017, fill: "#7df9ff", weight: "bold", align: "right", spacing: 70 });
}

function renderFinanceYoutube(canvas: Canvas, item: FlagshipTemplateDefinition, token: string) {
  const w = canvas.getWidth();
  const h = canvas.getHeight();
  canvas.clear();
  canvas.backgroundColor = item.bg;
  addRect(canvas, 0, 0, w * 0.61, h, item.bg);
  addPhoto(canvas, item.image, w * 0.63, 0, w * 0.37, h, 0, token, item.soft, { cropBiasX: 0.72 });
  addRect(canvas, w * 0.60, 0, w * 0.06, h, "rgba(8,36,28,0.92)");
  labelPill(canvas, "MONEY SYSTEM", w * 0.055, h * 0.08, w * 0.23, h * 0.075, item.accent, item.bg);
  addText(canvas, "3 MONEY\nMOVES\nTHAT WORK", { x: w * 0.05, y: h * 0.22, width: w * 0.54, size: h * 0.105, fill: "#ffffff", weight: "bold", lineHeight: 0.82, spacing: -35 });
  addText(canvas, "A simple monthly dashboard", { x: w * 0.055, y: h * 0.69, width: w * 0.36, size: h * 0.035, fill: "#dffbe8", weight: "bold" });
  const bars = [0.14, 0.22, 0.34, 0.46];
  bars.forEach((heightRatio, index) => {
    addRect(canvas, w * (0.43 + index * 0.04), h * (0.84 - heightRatio), w * 0.022, h * heightRatio, index === bars.length - 1 ? item.accent : "#2f6a53", w * 0.01);
  });
  addText(canvas, "+24%", { x: w * 0.72, y: h * 0.10, width: w * 0.20, size: h * 0.075, fill: item.accent, weight: "bold", align: "center" });
  addText(canvas, "CASH FLOW", { x: w * 0.72, y: h * 0.22, width: w * 0.20, size: h * 0.025, fill: "#ffffff", weight: "bold", align: "center", spacing: 120 });
}

function renderFitnessYoutube(canvas: Canvas, item: FlagshipTemplateDefinition, token: string) {
  const w = canvas.getWidth();
  const h = canvas.getHeight();
  canvas.clear();
  canvas.backgroundColor = item.bg;
  addPhoto(canvas, item.image, w * 0.55, 0, w * 0.45, h, 0, token, item.soft, { cropBiasX: 0.7 });
  addRect(canvas, w * 0.52, 0, w * 0.12, h, "rgba(11,11,11,0.82)");
  addText(canvas, "30", { x: w * 0.035, y: h * 0.03, width: w * 0.30, size: h * 0.30, fill: "transparent", weight: "bold", stroke: item.accent, strokeWidth: h * 0.012, lineHeight: 0.8 });
  addText(canvas, "DAYS", { x: w * 0.30, y: h * 0.09, width: w * 0.23, size: h * 0.09, fill: item.accent, weight: "bold", spacing: 80 });
  addText(canvas, "NO\nEXCUSES", { x: w * 0.045, y: h * 0.38, width: w * 0.50, size: h * 0.16, fill: "#ffffff", weight: "bold", lineHeight: 0.78, spacing: -30 });
  addRect(canvas, w * 0.045, h * 0.80, w * 0.38, h * 0.09, item.accent, h * 0.045, { angle: -2 });
  addText(canvas, "START THE RESET", { x: w * 0.045, y: h * 0.823, width: w * 0.38, size: h * 0.036, fill: "#0b0b0b", weight: "bold", align: "center", angle: -2, spacing: 70 });
  addStar(canvas, w * 0.84, h * 0.08, h * 0.0010, item.accent);
}

function renderRealEstate(canvas: Canvas, item: FlagshipTemplateDefinition, token: string) {
  const w = canvas.getWidth();
  const h = canvas.getHeight();
  canvas.clear();
  canvas.backgroundColor = item.bg;
  addPhoto(canvas, item.image, 0, 0, w, h * 0.70, 0, token, item.soft, { cropBiasY: 0.44 });
  addRect(canvas, w * 0.055, h * 0.47, w * 0.89, h * 0.44, "rgba(246,240,230,0.97)", w * 0.025, { shadow: new Shadow({ color: "rgba(20,35,28,0.22)", blur: 20, offsetX: 0, offsetY: 10 }) });
  addText(canvas, "JUST LISTED / GREENWOOD", { x: w * 0.09, y: h * 0.52, width: w * 0.46, size: w * 0.021, fill: item.accent, weight: "bold", spacing: 100 });
  addText(canvas, "A QUIET\nKIND OF LUXURY", { x: w * 0.085, y: h * 0.59, width: w * 0.53, size: w * 0.064, fill: item.fg, weight: "bold", family: "Georgia", lineHeight: 0.91 });
  addText(canvas, "4 BED / 3 BATH / 2,850 SQ FT", { x: w * 0.66, y: h * 0.60, width: w * 0.22, size: w * 0.018, fill: item.fg, weight: "bold", lineHeight: 1.5, spacing: 40 });
  addText(canvas, "Rs 2.4 CR", { x: w * 0.66, y: h * 0.71, width: w * 0.22, size: w * 0.04, fill: item.accent, weight: "bold", family: "Georgia" });
  addText(canvas, "Light-filled living, warm timber and a garden designed for slow mornings.", { x: w * 0.09, y: h * 0.80, width: w * 0.50, size: w * 0.021, fill: item.fg, lineHeight: 1.25 });
  addText(canvas, "BOOK A VIEWING ->", { x: w * 0.66, y: h * 0.84, width: w * 0.23, size: w * 0.018, fill: item.accent, weight: "bold", align: "right" });
}

function renderLinkedin(canvas: Canvas, item: FlagshipTemplateDefinition, token: string) {
  const w = canvas.getWidth();
  const h = canvas.getHeight();
  canvas.clear();
  canvas.backgroundColor = item.bg;
  addRect(canvas, w * 0.055, h * 0.055, w * 0.89, h * 0.89, item.soft, w * 0.028);
  addText(canvas, "LEADERSHIP / FIELD NOTE 07", { x: w * 0.09, y: h * 0.09, width: w * 0.43, size: w * 0.018, fill: item.accent, weight: "bold", spacing: 130 });
  addText(canvas, "CLARITY\nBEATS\nURGENCY.", { x: w * 0.085, y: h * 0.20, width: w * 0.50, size: w * 0.082, fill: "#ffffff", weight: "bold", family: "Georgia", lineHeight: 0.88 });
  addPhoto(canvas, item.image, w * 0.64, h * 0.11, w * 0.23, h * 0.28, w * 0.115, token, "#263b59", { border: "#8bd7ff" });
  addText(canvas, "ALEX MORGAN", { x: w * 0.61, y: h * 0.43, width: w * 0.30, size: w * 0.020, fill: "#ffffff", weight: "bold", align: "center" });
  addText(canvas, "STRATEGY / OPERATIONS", { x: w * 0.61, y: h * 0.47, width: w * 0.30, size: w * 0.013, fill: item.accent, weight: "bold", align: "center", spacing: 90 });
  addLine(canvas, w * 0.09, h * 0.62, w * 0.91, h * 0.62, "rgba(139,215,255,0.35)", 2);
  const stats = [["03", "priorities"], ["01", "owner each"], ["24h", "decision window"]];
  stats.forEach(([num, label], index) => {
    const x = w * (0.10 + index * 0.28);
    addText(canvas, num, { x, y: h * 0.69, width: w * 0.17, size: w * 0.047, fill: item.accent, weight: "bold", family: "Georgia" });
    addText(canvas, label, { x, y: h * 0.77, width: w * 0.20, size: w * 0.016, fill: "#d5e5f5", weight: "bold", spacing: 60 });
  });
  addText(canvas, "Make the work visible. Name the tradeoffs. Then move.", { x: w * 0.09, y: h * 0.87, width: w * 0.64, size: w * 0.022, fill: "#ffffff", lineHeight: 1.25 });
  addText(canvas, "SAVE ->", { x: w * 0.78, y: h * 0.885, width: w * 0.12, size: w * 0.018, fill: item.accent, weight: "bold", align: "right" });
}

function renderCreator(canvas: Canvas, item: FlagshipTemplateDefinition, token: string) {
  const w = canvas.getWidth();
  const h = canvas.getHeight();
  canvas.clear();
  canvas.backgroundColor = item.bg;
  addCircle(canvas, w * 0.70, h * 0.03, w * 0.25, "#f237b4");
  addCircle(canvas, -w * 0.10, h * 0.70, w * 0.30, item.accent);
  addRect(canvas, w * 0.08, h * 0.12, w * 0.62, h * 0.41, "#ffffff", w * 0.018, { angle: -3, shadow: new Shadow({ color: "rgba(0,0,0,0.26)", blur: 22, offsetX: 0, offsetY: 12 }) });
  addPhoto(canvas, item.image, w * 0.105, h * 0.145, w * 0.57, h * 0.33, w * 0.012, token, "#6d31a7", { angle: -3, cropBiasX: 0.55 });
  addRect(canvas, w * 0.63, h * 0.33, w * 0.25, h * 0.16, item.accent, w * 0.018, { angle: 7 });
  addText(canvas, "POST\nMORE", { x: w * 0.64, y: h * 0.355, width: w * 0.23, size: w * 0.047, fill: "#291058", weight: "bold", align: "center", angle: 7, lineHeight: 0.82 });
  addText(canvas, "BUILD A\nVISUAL SIGNAL", { x: w * 0.075, y: h * 0.58, width: w * 0.70, size: w * 0.09, fill: "#ffffff", weight: "bold", lineHeight: 0.84, spacing: -30 });
  addText(canvas, "A repeatable system for content people recognise before they read your name.", { x: w * 0.08, y: h * 0.78, width: w * 0.62, size: w * 0.026, fill: "#f4d8ff", lineHeight: 1.25 });
  labelPill(canvas, "SAVE THE PLAYBOOK", w * 0.08, h * 0.90, w * 0.40, h * 0.055, item.accent, "#291058");
  addStar(canvas, w * 0.80, h * 0.76, w * 0.00078, "#ffffff");
}

function resumeHeading(canvas: Canvas, label: string, x: number, y: number, width: number, color: string, size: number) {
  addText(canvas, label.toUpperCase(), { x, y, width, size, fill: color, weight: "bold", spacing: 120 });
  addLine(canvas, x, y + size * 1.55, x + width, y + size * 1.55, color, Math.max(3, size * 0.09));
}

function renderExecutiveResume(canvas: Canvas, item: FlagshipTemplateDefinition, token: string) {
  const w = canvas.getWidth();
  const h = canvas.getHeight();
  const p = w * 0.065;
  canvas.clear();
  canvas.backgroundColor = item.bg;
  addRect(canvas, 0, 0, w * 0.30, h, "#172033");
  addRect(canvas, w * 0.30, 0, w * 0.012, h, item.accent);
  addPhoto(canvas, item.image, w * 0.065, h * 0.055, w * 0.17, h * 0.155, w * 0.085, token, "#26344f", { border: "#f8f5ef" });
  addText(canvas, "ALEX\nMORGAN", { x: w * 0.37, y: h * 0.055, width: w * 0.50, size: w * 0.050, fill: item.fg, weight: "bold", family: "Georgia", lineHeight: 0.87 });
  addText(canvas, "MARKETING DIRECTOR / BRAND STRATEGY", { x: w * 0.37, y: h * 0.155, width: w * 0.50, size: w * 0.016, fill: item.accent, weight: "bold", spacing: 90 });
  addText(canvas, "Strategic marketing leader building clear brands, integrated campaigns and teams that turn insight into measurable growth.", { x: w * 0.37, y: h * 0.215, width: w * 0.52, size: w * 0.017, fill: item.fg, lineHeight: 1.3 });

  resumeHeading(canvas, "Experience", w * 0.37, h * 0.32, w * 0.52, item.accent, w * 0.017);
  addText(canvas, "BRAND DIRECTOR / NORTH & CO.\n2022 - PRESENT\nLed positioning, portfolio launches and integrated campaigns across three product lines. Built a planning system used by brand, product and growth teams.", { x: w * 0.37, y: h * 0.37, width: w * 0.52, size: w * 0.0162, fill: item.fg, lineHeight: 1.32 });
  addText(canvas, "SENIOR MARKETING MANAGER / STUDIO NINE\n2018 - 2022\nOwned campaign strategy, research and reporting. Improved qualified demand while reducing duplicated production across channels.", { x: w * 0.37, y: h * 0.53, width: w * 0.52, size: w * 0.0162, fill: item.fg, lineHeight: 1.32 });
  resumeHeading(canvas, "Selected impact", w * 0.37, h * 0.70, w * 0.52, item.accent, w * 0.017);
  addText(canvas, "+38% qualified pipeline\n3 successful category launches\n12-person cross-functional team", { x: w * 0.37, y: h * 0.75, width: w * 0.52, size: w * 0.0165, fill: item.fg, lineHeight: 1.45, weight: "bold" });

  resumeHeading(canvas, "Contact", p, h * 0.28, w * 0.18, "#f2c879", w * 0.0155);
  addText(canvas, "alex@email.com\n+91 98765 43210\nBengaluru, India\nlinkedin.com/in/alex", { x: p, y: h * 0.33, width: w * 0.18, size: w * 0.0145, fill: "#e7edf8", lineHeight: 1.5 });
  resumeHeading(canvas, "Expertise", p, h * 0.50, w * 0.18, "#f2c879", w * 0.0155);
  addText(canvas, "Brand Strategy\nGo-to-market\nConsumer Insight\nCampaign Systems\nTeam Leadership\nPerformance", { x: p, y: h * 0.55, width: w * 0.18, size: w * 0.0145, fill: "#e7edf8", lineHeight: 1.5 });
  resumeHeading(canvas, "Education", p, h * 0.76, w * 0.18, "#f2c879", w * 0.0155);
  addText(canvas, "MBA / Marketing\nUniversity of Delhi\n\nB.Com\nChrist University", { x: p, y: h * 0.81, width: w * 0.18, size: w * 0.0145, fill: "#e7edf8", lineHeight: 1.45 });
}

function renderCreativeResume(canvas: Canvas, item: FlagshipTemplateDefinition, token: string) {
  const w = canvas.getWidth();
  const h = canvas.getHeight();
  const p = w * 0.06;
  canvas.clear();
  canvas.backgroundColor = item.bg;
  addCircle(canvas, w * 0.72, -w * 0.10, w * 0.22, "#7b2cbf");
  addRect(canvas, p, h * 0.05, w * 0.88, h * 0.17, "#201c25", w * 0.022);
  addText(canvas, "MAYA SHARMA", { x: w * 0.09, y: h * 0.075, width: w * 0.48, size: w * 0.050, fill: "#ffffff", weight: "bold", family: "Georgia" });
  addText(canvas, "CREATIVE STRATEGIST / ART DIRECTION", { x: w * 0.09, y: h * 0.145, width: w * 0.50, size: w * 0.015, fill: item.accent, weight: "bold", spacing: 85 });
  addPhoto(canvas, item.image, w * 0.73, h * 0.065, w * 0.16, h * 0.14, w * 0.02, token, "#352f3a", { border: item.accent });

  addRect(canvas, p, h * 0.27, w * 0.30, h * 0.62, "#201c25", w * 0.02);
  resumeHeading(canvas, "Profile", w * 0.09, h * 0.31, w * 0.22, item.accent, w * 0.015);
  addText(canvas, "Creative strategist shaping visual systems, campaigns and social-first stories for culture, lifestyle and technology brands.", { x: w * 0.09, y: h * 0.36, width: w * 0.22, size: w * 0.0147, fill: "#d7d0dc", lineHeight: 1.35 });
  resumeHeading(canvas, "Toolkit", w * 0.09, h * 0.53, w * 0.22, item.accent, w * 0.015);
  ["Creative Direction", "Campaign Concepts", "Brand Systems", "Copywriting", "Presentation Design"].forEach((skill, index) => {
    labelPill(canvas, skill, w * 0.09, h * (0.58 + index * 0.055), w * 0.20, h * 0.036, index % 2 === 0 ? "#342d3b" : "#2a2530", "#f8f3ed");
  });
  resumeHeading(canvas, "Contact", w * 0.09, h * 0.84, w * 0.22, item.accent, w * 0.015);
  addText(canvas, "maya@email.com / Mumbai / mayasharma.design", { x: w * 0.09, y: h * 0.89, width: w * 0.22, size: w * 0.0138, fill: "#d7d0dc", lineHeight: 1.3 });

  resumeHeading(canvas, "Selected work", w * 0.41, h * 0.29, w * 0.50, item.accent, w * 0.0165);
  addText(canvas, "AURA / LAUNCH SYSTEM\nCreative lead for a multi-format launch spanning paid social, creator partnerships and product storytelling.", { x: w * 0.41, y: h * 0.345, width: w * 0.50, size: w * 0.016, fill: item.fg, lineHeight: 1.32 });
  addText(canvas, "NORTH / EDITORIAL SERIES\nBuilt visual direction and reusable content formats that improved weekly publishing consistency.", { x: w * 0.41, y: h * 0.485, width: w * 0.50, size: w * 0.016, fill: item.fg, lineHeight: 1.32 });
  resumeHeading(canvas, "Experience", w * 0.41, h * 0.64, w * 0.50, item.accent, w * 0.0165);
  addText(canvas, "CREATIVE LEAD / STUDIO COMMON / 2022 - PRESENT\nCONTENT DESIGNER / FRAME & FIELD / 2019 - 2022", { x: w * 0.41, y: h * 0.695, width: w * 0.50, size: w * 0.016, fill: item.fg, lineHeight: 1.45 });
  resumeHeading(canvas, "Education", w * 0.41, h * 0.82, w * 0.50, item.accent, w * 0.0165);
  addText(canvas, "B.Des / Communication Design / NID", { x: w * 0.41, y: h * 0.875, width: w * 0.50, size: w * 0.016, fill: item.fg, weight: "bold" });
}

export function applyFlagshipTemplate(canvas: Canvas, type: string, renderToken: string) {
  const item = byType.get(type);
  if (!item) return false;
  (canvas as any).__postMakerTemplateToken = renderToken;

  switch (type) {
    case "flagship-instagram-hiring-electric":
      renderHiring(canvas, item, renderToken);
      break;
    case "flagship-instagram-fashion-noir":
      renderFashion(canvas, item, renderToken);
      break;
    case "flagship-instagram-food-bistro":
      renderFood(canvas, item, renderToken);
      break;
    case "flagship-story-travel-postcards":
      renderTravelStory(canvas, item, renderToken);
      break;
    case "flagship-story-event-neon":
      renderEventStory(canvas, item, renderToken);
      break;
    case "flagship-youtube-finance-dashboard":
      renderFinanceYoutube(canvas, item, renderToken);
      break;
    case "flagship-youtube-fitness-impact":
      renderFitnessYoutube(canvas, item, renderToken);
      break;
    case "flagship-facebook-realestate-luxe":
      renderRealEstate(canvas, item, renderToken);
      break;
    case "flagship-linkedin-leadership-report":
      renderLinkedin(canvas, item, renderToken);
      break;
    case "flagship-instagram-creator-collage":
      renderCreator(canvas, item, renderToken);
      break;
    case "flagship-resume-executive-editorial":
      renderExecutiveResume(canvas, item, renderToken);
      break;
    case "flagship-resume-creative-grid":
      renderCreativeResume(canvas, item, renderToken);
      break;
    default:
      return false;
  }

  canvas.discardActiveObject();
  canvas.requestRenderAll();
  return true;
}
