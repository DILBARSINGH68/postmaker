import {
  Circle,
  FabricImage,
  Line,
  Rect,
  Textbox,
  type Canvas,
} from "fabric";

import { getSocialTemplateImage } from "@/lib/editor/templateImages";

export type PremiumTemplateDefinition = {
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
  headline?: string;
  subline?: string;
  eyebrow?: string;
  cta?: string;
  premium: true;
  festival?: boolean;
  region?: string;
};

type SocialSeed = {
  type: string;
  name: string;
  category: string;
  formatName: string;
  width: number;
  height: number;
  layout: number;
  imageKey: string;
  bg: string;
  fg: string;
  accent: string;
  soft: string;
  headline: string;
  subline: string;
  eyebrow: string;
  cta: string;
  previewClass: string;
};

const SOCIAL_PREMIUM: SocialSeed[] = [
  {
    type: "premium-instagram-fashion-editorial",
    name: "Fashion Editorial Drop",
    category: "Premium • Fashion",
    formatName: "Instagram Post",
    width: 1080,
    height: 1080,
    layout: 0,
    imageKey: "fashion",
    bg: "#f3eadf",
    fg: "#16130f",
    accent: "#d95035",
    soft: "#ead6c1",
    headline: "THE NEW\nEDITORIAL",
    subline: "Modern silhouettes. Confident texture. Made for the next season.",
    eyebrow: "SPRING / SUMMER 26",
    cta: "SHOP THE EDIT",
    previewClass: "from-stone-100 via-orange-100 to-rose-500",
  },
  {
    type: "premium-instagram-creator-neon",
    name: "Creator Neon Launch",
    category: "Premium • Creator",
    formatName: "Instagram Post",
    width: 1080,
    height: 1080,
    layout: 1,
    imageKey: "creator",
    bg: "#0b1020",
    fg: "#ffffff",
    accent: "#b8ff39",
    soft: "#171f35",
    headline: "TURN IDEAS\nINTO MOMENTUM",
    subline: "Create a clear point of view and publish with confidence.",
    eyebrow: "CREATOR PLAYBOOK",
    cta: "SAVE THIS POST",
    previewClass: "from-slate-950 via-indigo-950 to-lime-400",
  },
  {
    type: "premium-instagram-food-studio",
    name: "Food Studio Special",
    category: "Premium • Food",
    formatName: "Instagram Post",
    width: 1080,
    height: 1080,
    layout: 2,
    imageKey: "food",
    bg: "#fff5e7",
    fg: "#2c190f",
    accent: "#ff6b2c",
    soft: "#ffd7bd",
    headline: "FRESH MADE.\nFULL FLAVOUR.",
    subline: "Seasonal plates made slowly, served beautifully.",
    eyebrow: "TODAY'S TABLE",
    cta: "BOOK A TABLE",
    previewClass: "from-orange-50 via-amber-200 to-orange-600",
  },
  {
    type: "premium-instagram-sale-bold",
    name: "Bold Commerce Sale",
    category: "Premium • Sale",
    formatName: "Instagram Post",
    width: 1080,
    height: 1080,
    layout: 4,
    imageKey: "sale",
    bg: "#f6ff2f",
    fg: "#0a0a0a",
    accent: "#ff3d00",
    soft: "#fff7b2",
    headline: "UP TO\n50% OFF",
    subline: "The biggest edit of the season. Limited quantities available.",
    eyebrow: "48 HOUR DROP",
    cta: "SHOP NOW",
    previewClass: "from-yellow-300 via-lime-300 to-red-500",
  },
  {
    type: "premium-instagram-realestate-luxe",
    name: "Luxe Property Listing",
    category: "Premium • Real Estate",
    formatName: "Instagram Post",
    width: 1080,
    height: 1080,
    layout: 3,
    imageKey: "realestate",
    bg: "#f6f2e9",
    fg: "#1f2c28",
    accent: "#537267",
    soft: "#dbe2db",
    headline: "A HOME WITH\nROOM TO BREATHE",
    subline: "Light-filled interiors, calm finishes and a location that works.",
    eyebrow: "JUST LISTED",
    cta: "VIEW PROPERTY",
    previewClass: "from-stone-100 via-emerald-100 to-emerald-700",
  },
  {
    type: "premium-instagram-fitness-impact",
    name: "Fitness Impact Campaign",
    category: "Premium • Fitness",
    formatName: "Instagram Post",
    width: 1080,
    height: 1080,
    layout: 5,
    imageKey: "fitness",
    bg: "#111111",
    fg: "#ffffff",
    accent: "#ff5d22",
    soft: "#252525",
    headline: "SHOW UP\nSTRONGER",
    subline: "Small sessions. Serious consistency. A stronger version of you.",
    eyebrow: "30 DAY RESET",
    cta: "START TODAY",
    previewClass: "from-neutral-950 via-neutral-800 to-orange-600",
  },

  {
    type: "premium-story-travel-editorial",
    name: "Travel Editorial Story",
    category: "Premium • Travel",
    formatName: "Instagram Story",
    width: 1080,
    height: 1920,
    layout: 0,
    imageKey: "travel",
    bg: "#f7efe4",
    fg: "#1e2d38",
    accent: "#ef6a47",
    soft: "#f0d8c7",
    headline: "GO WHERE\nTIME SLOWS\nDOWN",
    subline: "A coastal route, quiet mornings and a little more room to wander.",
    eyebrow: "WEEKEND ESCAPE",
    cta: "EXPLORE THE GUIDE",
    previewClass: "from-sky-100 via-orange-100 to-orange-500",
  },
  {
    type: "premium-story-event-night",
    name: "Night Event Story",
    category: "Premium • Event",
    formatName: "Instagram Story",
    width: 1080,
    height: 1920,
    layout: 1,
    imageKey: "event",
    bg: "#090b18",
    fg: "#ffffff",
    accent: "#ff3eb5",
    soft: "#17152b",
    headline: "ONE NIGHT.\nFULL ENERGY.",
    subline: "Live sets, late conversations and a room worth showing up for.",
    eyebrow: "FRIDAY • 8 PM",
    cta: "GET TICKETS",
    previewClass: "from-slate-950 via-purple-950 to-fuchsia-500",
  },
  {
    type: "premium-story-beauty-minimal",
    name: "Minimal Beauty Story",
    category: "Premium • Fashion",
    formatName: "Instagram Story",
    width: 1080,
    height: 1920,
    layout: 3,
    imageKey: "fashion",
    bg: "#f7f0f1",
    fg: "#3a2530",
    accent: "#ad5f78",
    soft: "#ead8de",
    headline: "SOFT FORM.\nSTRONG POINT\nOF VIEW.",
    subline: "A refined edit for everyday confidence.",
    eyebrow: "NEW ARRIVALS",
    cta: "DISCOVER",
    previewClass: "from-rose-50 via-pink-100 to-rose-500",
  },
  {
    type: "premium-story-coach-creator",
    name: "Creator Coach Story",
    category: "Premium • Creator",
    formatName: "Instagram Story",
    width: 1080,
    height: 1920,
    layout: 5,
    imageKey: "creator",
    bg: "#06191a",
    fg: "#f4fff9",
    accent: "#42e6b1",
    soft: "#123332",
    headline: "YOUR CONTENT\nNEEDS A CLEAR\nSIGNAL",
    subline: "Build a repeatable content system that feels like you.",
    eyebrow: "FREE WORKSHOP",
    cta: "RESERVE A SEAT",
    previewClass: "from-teal-950 via-emerald-950 to-emerald-400",
  },

  {
    type: "premium-youtube-business-growth",
    name: "Business Growth Thumbnail",
    category: "Premium • Business",
    formatName: "YouTube Thumbnail",
    width: 1280,
    height: 720,
    layout: 4,
    imageKey: "business",
    bg: "#0f172a",
    fg: "#ffffff",
    accent: "#38bdf8",
    soft: "#1e293b",
    headline: "5 MOVES\nTHAT SCALE",
    subline: "A practical growth framework for small teams.",
    eyebrow: "BUSINESS SYSTEMS",
    cta: "WATCH NOW",
    previewClass: "from-slate-950 via-blue-950 to-sky-500",
  },
  {
    type: "premium-youtube-finance-money",
    name: "Money Made Simple Thumbnail",
    category: "Premium • Finance",
    formatName: "YouTube Thumbnail",
    width: 1280,
    height: 720,
    layout: 1,
    imageKey: "finance",
    bg: "#f7f2e8",
    fg: "#13241c",
    accent: "#2f7d58",
    soft: "#dfe8dc",
    headline: "MONEY\nMADE SIMPLE",
    subline: "A calmer system for spending, saving and planning.",
    eyebrow: "PERSONAL FINANCE",
    cta: "START HERE",
    previewClass: "from-stone-100 via-emerald-100 to-emerald-700",
  },
  {
    type: "premium-youtube-fitness-challenge",
    name: "Fitness Challenge Thumbnail",
    category: "Premium • Fitness",
    formatName: "YouTube Thumbnail",
    width: 1280,
    height: 720,
    layout: 5,
    imageKey: "fitness",
    bg: "#121212",
    fg: "#ffffff",
    accent: "#ff4d00",
    soft: "#242424",
    headline: "30 DAYS\nNO EXCUSES",
    subline: "The reset that gets you moving again.",
    eyebrow: "NEW CHALLENGE",
    cta: "JOIN IN",
    previewClass: "from-neutral-950 via-neutral-800 to-orange-600",
  },
  {
    type: "premium-youtube-travel-guide",
    name: "Travel Guide Thumbnail",
    category: "Premium • Travel",
    formatName: "YouTube Thumbnail",
    width: 1280,
    height: 720,
    layout: 2,
    imageKey: "travel",
    bg: "#f2f0e9",
    fg: "#16283d",
    accent: "#f2a23a",
    soft: "#dde7ea",
    headline: "THE PERFECT\n3-DAY ESCAPE",
    subline: "Where to stay, eat and slow down.",
    eyebrow: "TRAVEL GUIDE",
    cta: "SAVE THIS",
    previewClass: "from-sky-100 via-amber-100 to-blue-600",
  },

  {
    type: "premium-facebook-food-launch",
    name: "Restaurant Launch Post",
    category: "Premium • Food",
    formatName: "Facebook Post",
    width: 940,
    height: 788,
    layout: 2,
    imageKey: "food",
    bg: "#fff6e9",
    fg: "#3a2115",
    accent: "#e65d32",
    soft: "#f8d7bd",
    headline: "A NEW TABLE\nIN TOWN",
    subline: "Seasonal cooking, warm service and a menu built for sharing.",
    eyebrow: "NOW OPEN",
    cta: "BOOK NOW",
    previewClass: "from-orange-50 via-amber-100 to-orange-600",
  },
  {
    type: "premium-facebook-realestate-openhouse",
    name: "Open House Campaign",
    category: "Premium • Real Estate",
    formatName: "Facebook Post",
    width: 940,
    height: 788,
    layout: 3,
    imageKey: "realestate",
    bg: "#eef1ec",
    fg: "#183128",
    accent: "#496b5d",
    soft: "#d6ded6",
    headline: "OPEN HOUSE\nTHIS SATURDAY",
    subline: "A calm, contemporary home with light in all the right places.",
    eyebrow: "10 AM — 2 PM",
    cta: "GET DIRECTIONS",
    previewClass: "from-stone-100 via-emerald-100 to-emerald-700",
  },
  {
    type: "premium-facebook-education-course",
    name: "Course Launch Campaign",
    category: "Premium • Education",
    formatName: "Facebook Post",
    width: 940,
    height: 788,
    layout: 0,
    imageKey: "education",
    bg: "#eef4ff",
    fg: "#152a4b",
    accent: "#3b66f5",
    soft: "#d7e2ff",
    headline: "LEARN THE\nSKILL THAT\nMOVES YOU",
    subline: "A focused 4-week course built around practical projects.",
    eyebrow: "ENROLMENT OPEN",
    cta: "SEE CURRICULUM",
    previewClass: "from-blue-50 via-indigo-100 to-blue-600",
  },
  {
    type: "premium-facebook-business-consulting",
    name: "Consulting Offer Campaign",
    category: "Premium • Business",
    formatName: "Facebook Post",
    width: 940,
    height: 788,
    layout: 1,
    imageKey: "business",
    bg: "#0a1524",
    fg: "#ffffff",
    accent: "#62d3ff",
    soft: "#15263c",
    headline: "CLARITY BEFORE\nMORE GROWTH",
    subline: "Strategy, positioning and systems for teams ready to scale.",
    eyebrow: "CONSULTING",
    cta: "BOOK A CALL",
    previewClass: "from-slate-950 via-blue-950 to-cyan-500",
  },

  {
    type: "premium-linkedin-leadership",
    name: "Leadership Insight Post",
    category: "Premium • Business",
    formatName: "LinkedIn Post",
    width: 1200,
    height: 1200,
    layout: 3,
    imageKey: "business",
    bg: "#f3efe6",
    fg: "#1c2430",
    accent: "#9c5b3b",
    soft: "#e6d8ca",
    headline: "GOOD LEADERS\nCREATE\nCLARITY",
    subline: "When priorities are visible, teams move faster with less friction.",
    eyebrow: "LEADERSHIP NOTE",
    cta: "SAVE FOR LATER",
    previewClass: "from-stone-100 via-orange-100 to-stone-700",
  },
  {
    type: "premium-linkedin-finance-report",
    name: "Finance Insight Post",
    category: "Premium • Finance",
    formatName: "LinkedIn Post",
    width: 1200,
    height: 1200,
    layout: 4,
    imageKey: "finance",
    bg: "#081b18",
    fg: "#f4fff8",
    accent: "#6ee7b7",
    soft: "#12312b",
    headline: "3 NUMBERS\nTO WATCH\nTHIS MONTH",
    subline: "A simple dashboard for healthier cash flow and better decisions.",
    eyebrow: "FINANCE CHECK-IN",
    cta: "READ THE NOTES",
    previewClass: "from-emerald-950 via-teal-950 to-emerald-400",
  },
  {
    type: "premium-linkedin-hiring",
    name: "Premium Hiring Post",
    category: "Premium • Hiring",
    formatName: "LinkedIn Post",
    width: 1200,
    height: 1200,
    layout: 5,
    imageKey: "creator",
    bg: "#10122a",
    fg: "#ffffff",
    accent: "#f8d84a",
    soft: "#202347",
    headline: "WE'RE\nHIRING",
    subline: "Join a small team doing ambitious work with thoughtful people.",
    eyebrow: "OPEN ROLE",
    cta: "APPLY TODAY",
    previewClass: "from-indigo-950 via-violet-950 to-yellow-400",
  },

  {
    type: "premium-portrait-sale-editorial",
    name: "Editorial Sale Portrait",
    category: "Premium • Sale",
    formatName: "Instagram Post (4:5)",
    width: 1080,
    height: 1350,
    layout: 0,
    imageKey: "sale",
    bg: "#fff7ea",
    fg: "#171717",
    accent: "#ef4f35",
    soft: "#f1dfcc",
    headline: "THE\nWEEKEND\nEDIT",
    subline: "Selected favourites, better prices, only for a little while.",
    eyebrow: "LIMITED RELEASE",
    cta: "SHOP THE DROP",
    previewClass: "from-stone-50 via-orange-100 to-red-500",
  },
  {
    type: "premium-portrait-creator-brand",
    name: "Creator Brand Portrait",
    category: "Premium • Creator",
    formatName: "Instagram Post (4:5)",
    width: 1080,
    height: 1350,
    layout: 1,
    imageKey: "creator",
    bg: "#151020",
    fg: "#ffffff",
    accent: "#b86bff",
    soft: "#2b203c",
    headline: "BUILD A\nBRAND PEOPLE\nRECOGNISE",
    subline: "A repeatable visual system for content that finally feels consistent.",
    eyebrow: "BRAND SYSTEM",
    cta: "START HERE",
    previewClass: "from-zinc-950 via-purple-950 to-violet-500",
  },
  {
    type: "premium-portrait-travel-diary",
    name: "Travel Diary Portrait",
    category: "Premium • Travel",
    formatName: "Instagram Post (4:5)",
    width: 1080,
    height: 1350,
    layout: 3,
    imageKey: "travel",
    bg: "#eef5f5",
    fg: "#16303b",
    accent: "#d9844b",
    soft: "#dce8e7",
    headline: "A SLOWER\nWAY TO SEE\nTHE WORLD",
    subline: "Notes from the coast: where to stay, eat and wander.",
    eyebrow: "TRAVEL DIARY",
    cta: "READ THE GUIDE",
    previewClass: "from-cyan-50 via-sky-100 to-orange-400",
  },
];

const RESUME_PREMIUM: PremiumTemplateDefinition[] = [
  {
    type: "premium-resume-executive-navy",
    name: "Executive Navy",
    category: "Premium • Executive Resume",
    previewClass: "from-slate-950 via-blue-950 to-sky-700",
    kind: "resume",
    formatName: "A4 Portrait",
    layout: 10,
    accent: "#1d4ed8",
    bg: "#ffffff",
    fg: "#111827",
    soft: "#e8eef8",
    image: getSocialTemplateImage("business"),
    width: 2480,
    height: 3508,
    premium: true,
  },
  {
    type: "premium-resume-creative-coral",
    name: "Creative Coral",
    category: "Premium • Creative Resume",
    previewClass: "from-orange-50 via-rose-100 to-rose-500",
    kind: "resume",
    formatName: "A4 Portrait",
    layout: 11,
    accent: "#e45d4f",
    bg: "#fffaf6",
    fg: "#2a1d1b",
    soft: "#f3ddd5",
    image: getSocialTemplateImage("creator"),
    width: 2480,
    height: 3508,
    premium: true,
  },
  {
    type: "premium-resume-minimal-ats",
    name: "Minimal ATS Pro",
    category: "Premium • ATS Resume",
    previewClass: "from-white via-slate-100 to-slate-700",
    kind: "resume",
    formatName: "A4 Portrait",
    layout: 12,
    accent: "#334155",
    bg: "#ffffff",
    fg: "#0f172a",
    soft: "#e2e8f0",
    width: 2480,
    height: 3508,
    premium: true,
  },
  {
    type: "premium-resume-tech-green",
    name: "Tech Product Green",
    category: "Premium • Tech Resume",
    previewClass: "from-emerald-950 via-teal-900 to-emerald-400",
    kind: "resume",
    formatName: "A4 Portrait",
    layout: 13,
    accent: "#10b981",
    bg: "#f8fffb",
    fg: "#10251e",
    soft: "#d9f7e8",
    width: 2480,
    height: 3508,
    premium: true,
  },
  {
    type: "premium-resume-editorial-olive",
    name: "Editorial Olive",
    category: "Premium • Editorial Resume",
    previewClass: "from-stone-100 via-lime-100 to-emerald-800",
    kind: "resume",
    formatName: "A4 Portrait",
    layout: 14,
    accent: "#536b4b",
    bg: "#f7f4ec",
    fg: "#1e2b21",
    soft: "#dfe5d8",
    image: getSocialTemplateImage("fashion"),
    width: 2480,
    height: 3508,
    premium: true,
  },
  {
    type: "premium-resume-dark-studio",
    name: "Dark Studio",
    category: "Premium • Designer Resume",
    previewClass: "from-neutral-950 via-zinc-900 to-fuchsia-600",
    kind: "resume",
    formatName: "A4 Portrait",
    layout: 15,
    accent: "#e879f9",
    bg: "#111111",
    fg: "#f7f7f7",
    soft: "#242424",
    image: getSocialTemplateImage("creator"),
    width: 2480,
    height: 3508,
    premium: true,
  },
];

export const PREMIUM_TEMPLATE_DEFINITIONS: PremiumTemplateDefinition[] = [
  ...SOCIAL_PREMIUM.map((item) => ({
    ...item,
    kind: "social" as const,
    image: getSocialTemplateImage(item.imageKey),
    premium: true as const,
  })),
  ...RESUME_PREMIUM,
];

const byType = new Map(PREMIUM_TEMPLATE_DEFINITIONS.map((item) => [item.type, item]));

export function isPremiumTemplate(type: string) {
  return byType.has(type);
}

function rect(
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

function text(
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
    lineHeight: options.lineHeight || 1.08,
    charSpacing: options.spacing || 0,
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

function pill(
  canvas: Canvas,
  label: string,
  x: number,
  y: number,
  width: number,
  height: number,
  bg: string,
  fg: string,
  fontSize: number
) {
  rect(canvas, x, y, width, height, bg, height / 2);
  text(canvas, label, {
    x,
    y: y + height * 0.24,
    width,
    size: fontSize,
    fill: fg,
    weight: "bold",
    align: "center",
    spacing: 70,
  });
}

function photo(
  canvas: Canvas,
  imageUrl: string | undefined,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  renderToken: string,
  fallback: string,
  border?: string
) {
  const slot = rect(canvas, x, y, width, height, fallback, radius, {
    stroke: border || "transparent",
    strokeWidth: border ? Math.max(2, Math.min(width, height) * 0.01) : 0,
  });

  if (!imageUrl) return;

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
        cropX = (sourceW - cropW) / 2;
      } else {
        cropH = sourceW / targetRatio;
        cropY = (sourceH - cropH) / 2;
      }

      const localRadius = Math.max(
        0,
        Math.min(radius, Math.min(cropW, cropH) / 2)
      );

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
        originX: "left",
        originY: "top",
        clipPath,
      });

      (image as any).templateImage = true;
      (image as any).templateImageUrl = imageUrl;
      (image as any).cornerRadius = localRadius;
      image.setCoords();

      const slotIndex = canvas.getObjects().indexOf(slot);
      canvas.add(image);
      if (
        slotIndex >= 0 &&
        typeof (canvas as any).moveObjectTo === "function"
      ) {
        (canvas as any).moveObjectTo(image, slotIndex + 1);
      }
      canvas.requestRenderAll();
    })
    .catch(() => {
      // Premium layouts stay usable because the photo slot has a styled fallback.
    });
}

function socialLayout(canvas: Canvas, item: PremiumTemplateDefinition, renderToken: string) {
  const w = canvas.getWidth();
  const h = canvas.getHeight();
  const ratio = w / Math.max(1, h);
  const p = Math.min(w, h) * 0.06;
  const layout = item.layout % 6;

  canvas.clear();
  canvas.backgroundColor = item.bg;

  if (layout === 0) {
    // Editorial split — image as a strong composition block, oversized headline left.
    const tall = ratio < 0.86;
    if (tall) {
      photo(canvas, item.image, p, p, w - p * 2, h * 0.48, p * 0.45, renderToken, item.soft);
      rect(canvas, p, h * 0.50, w - p * 2, 3, item.accent);
      text(canvas, item.eyebrow || "EDITORIAL", {
        x: p,
        y: h * 0.55,
        width: w * 0.55,
        size: w * 0.028,
        fill: item.accent,
        weight: "bold",
        spacing: 150,
      });
      text(canvas, item.headline || "", {
        x: p,
        y: h * 0.62,
        width: w - p * 2,
        size: w * 0.083,
        fill: item.fg,
        weight: "bold",
        family: "Georgia",
        lineHeight: 0.93,
      });
      text(canvas, item.subline || "", {
        x: p,
        y: h * 0.80,
        width: w - p * 2.3,
        size: w * 0.03,
        fill: item.fg,
        lineHeight: 1.25,
      });
      text(canvas, `${item.cta || "DISCOVER"} →`, {
        x: p,
        y: h * 0.92,
        width: w * 0.5,
        size: w * 0.029,
        fill: item.accent,
        weight: "bold",
      });
    } else {
      photo(canvas, item.image, w * 0.57, p, w * 0.37, h - p * 2, p * 0.35, renderToken, item.soft);
      rect(canvas, p, h * 0.12, w * 0.16, 5, item.accent);
      text(canvas, item.eyebrow || "EDITORIAL", {
        x: p,
        y: h * 0.16,
        width: w * 0.42,
        size: Math.min(w, h) * 0.026,
        fill: item.accent,
        weight: "bold",
        spacing: 150,
      });
      text(canvas, item.headline || "", {
        x: p,
        y: h * 0.29,
        width: w * 0.46,
        size: Math.min(w, h) * 0.074,
        fill: item.fg,
        weight: "bold",
        family: "Georgia",
        lineHeight: 0.92,
      });
      text(canvas, item.subline || "", {
        x: p,
        y: h * 0.65,
        width: w * 0.42,
        size: Math.min(w, h) * 0.027,
        fill: item.fg,
        lineHeight: 1.28,
      });
      text(canvas, `${item.cta || "DISCOVER"} →`, {
        x: p,
        y: h * 0.84,
        width: w * 0.34,
        size: Math.min(w, h) * 0.026,
        fill: item.accent,
        weight: "bold",
      });
    }
  } else if (layout === 1) {
    // Full-bleed image + dark editorial overlay.
    photo(canvas, item.image, 0, 0, w, h, 0, renderToken, item.soft);
    rect(canvas, 0, 0, w, h, "rgba(5,8,16,0.56)");
    rect(canvas, p, p, Math.max(4, w * 0.012), h - p * 2, item.accent);
    pill(canvas, item.eyebrow || "FEATURE", p * 1.6, h * 0.10, w * 0.34, h * 0.065, item.accent, item.bg, Math.min(w, h) * 0.018);
    text(canvas, item.headline || "", {
      x: p * 1.6,
      y: h * 0.25,
      width: ratio > 1.25 ? w * 0.50 : w * 0.72,
      size: ratio > 1.25 ? h * 0.115 : w * 0.092,
      fill: "#ffffff",
      weight: "bold",
      lineHeight: 0.91,
    });
    text(canvas, item.subline || "", {
      x: p * 1.6,
      y: h * (ratio > 1.25 ? 0.66 : 0.70),
      width: ratio > 1.25 ? w * 0.47 : w * 0.70,
      size: Math.min(w, h) * 0.026,
      fill: "#ffffff",
      lineHeight: 1.25,
    });
    text(canvas, item.cta || "LEARN MORE", {
      x: p * 1.6,
      y: h * 0.86,
      width: w * 0.36,
      size: Math.min(w, h) * 0.025,
      fill: item.accent,
      weight: "bold",
      spacing: 60,
    });
  } else if (layout === 2) {
    // Magazine card with image + structured lower panel.
    const imageH = ratio > 1.3 ? h * 0.72 : h * 0.56;
    photo(canvas, item.image, p, p, w - p * 2, imageH, p * 0.35, renderToken, item.soft);
    rect(canvas, p * 1.35, p * 1.35, w * 0.24, h * 0.075, item.accent, h * 0.037);
    text(canvas, item.eyebrow || "NEW", {
      x: p * 1.35,
      y: p * 1.35 + h * 0.022,
      width: w * 0.24,
      size: Math.min(w, h) * 0.018,
      fill: "#ffffff",
      weight: "bold",
      align: "center",
      spacing: 90,
    });
    const textTop = p + imageH + h * 0.045;
    text(canvas, item.headline || "", {
      x: p,
      y: textTop,
      width: w * 0.63,
      size: Math.min(w, h) * (ratio > 1.3 ? 0.055 : 0.065),
      fill: item.fg,
      weight: "bold",
      family: "Georgia",
      lineHeight: 0.95,
    });
    text(canvas, item.subline || "", {
      x: p,
      y: textTop + Math.min(w, h) * 0.16,
      width: w * 0.60,
      size: Math.min(w, h) * 0.025,
      fill: item.fg,
      lineHeight: 1.25,
    });
    rect(canvas, w * 0.76, textTop, w * 0.16, Math.min(w, h) * 0.11, item.accent, Math.min(w, h) * 0.055);
    text(canvas, "→", {
      x: w * 0.76,
      y: textTop + Math.min(w, h) * 0.025,
      width: w * 0.16,
      size: Math.min(w, h) * 0.045,
      fill: "#ffffff",
      weight: "bold",
      align: "center",
    });
  } else if (layout === 3) {
    // Luxury minimal — generous negative space, fine rules, smaller image.
    rect(canvas, p, p, w - p * 2, h - p * 2, "transparent", p * 0.25, {
      stroke: item.accent,
      strokeWidth: Math.max(2, Math.min(w, h) * 0.004),
    });
    photo(canvas, item.image, w * 0.58, h * 0.10, w * 0.29, h * 0.42, p * 0.25, renderToken, item.soft);
    text(canvas, item.eyebrow || "CURATED", {
      x: p * 1.55,
      y: h * 0.13,
      width: w * 0.36,
      size: Math.min(w, h) * 0.022,
      fill: item.accent,
      weight: "bold",
      spacing: 180,
    });
    text(canvas, item.headline || "", {
      x: p * 1.55,
      y: h * 0.28,
      width: w * 0.46,
      size: Math.min(w, h) * 0.067,
      fill: item.fg,
      weight: "bold",
      family: "Georgia",
      lineHeight: 0.96,
    });
    rect(canvas, p * 1.55, h * 0.63, w * 0.50, 2, item.accent);
    text(canvas, item.subline || "", {
      x: p * 1.55,
      y: h * 0.68,
      width: w * 0.56,
      size: Math.min(w, h) * 0.026,
      fill: item.fg,
      lineHeight: 1.28,
    });
    text(canvas, `${item.cta || "VIEW"} →`, {
      x: p * 1.55,
      y: h * 0.84,
      width: w * 0.40,
      size: Math.min(w, h) * 0.024,
      fill: item.accent,
      weight: "bold",
    });
  } else if (layout === 4) {
    // Bold commerce/grid style.
    rect(canvas, 0, 0, w, h, item.bg);
    rect(canvas, 0, 0, w * 0.20, h, item.accent);
    photo(canvas, item.image, w * 0.63, h * 0.08, w * 0.30, h * 0.84, p * 0.25, renderToken, item.soft, item.fg);
    text(canvas, item.eyebrow || "DROP", {
      x: w * 0.25,
      y: h * 0.12,
      width: w * 0.30,
      size: Math.min(w, h) * 0.024,
      fill: item.fg,
      weight: "bold",
      spacing: 170,
    });
    text(canvas, item.headline || "", {
      x: w * 0.25,
      y: h * 0.28,
      width: w * 0.35,
      size: ratio > 1.3 ? h * 0.125 : Math.min(w, h) * 0.084,
      fill: item.fg,
      weight: "bold",
      lineHeight: 0.88,
    });
    text(canvas, item.subline || "", {
      x: w * 0.25,
      y: h * 0.69,
      width: w * 0.34,
      size: Math.min(w, h) * 0.024,
      fill: item.fg,
      lineHeight: 1.26,
    });
    pill(canvas, item.cta || "SHOP NOW", w * 0.25, h * 0.82, w * 0.25, h * 0.075, item.fg, item.bg, Math.min(w, h) * 0.019);
  } else {
    // Dynamic creator/hiring style with image card and bold stacked text.
    rect(canvas, p, p, w - p * 2, h - p * 2, item.soft, p * 0.36);
    photo(canvas, item.image, w * 0.54, h * 0.10, w * 0.35, h * 0.48, p * 0.25, renderToken, item.bg);
    rect(canvas, w * 0.50, h * 0.14, w * 0.10, h * 0.10, item.accent, h * 0.05);
    text(canvas, "✦", {
      x: w * 0.50,
      y: h * 0.155,
      width: w * 0.10,
      size: Math.min(w, h) * 0.038,
      fill: item.bg,
      align: "center",
      weight: "bold",
    });
    text(canvas, item.eyebrow || "FEATURED", {
      x: p * 1.6,
      y: h * 0.14,
      width: w * 0.33,
      size: Math.min(w, h) * 0.021,
      fill: item.accent,
      weight: "bold",
      spacing: 140,
    });
    text(canvas, item.headline || "", {
      x: p * 1.6,
      y: h * 0.28,
      width: w * 0.43,
      size: Math.min(w, h) * 0.080,
      fill: item.fg,
      weight: "bold",
      lineHeight: 0.89,
    });
    text(canvas, item.subline || "", {
      x: p * 1.6,
      y: h * 0.68,
      width: w * 0.58,
      size: Math.min(w, h) * 0.025,
      fill: item.fg,
      lineHeight: 1.26,
    });
    text(canvas, `${item.cta || "START"} →`, {
      x: p * 1.6,
      y: h * 0.84,
      width: w * 0.42,
      size: Math.min(w, h) * 0.024,
      fill: item.accent,
      weight: "bold",
    });
  }

  canvas.discardActiveObject();
  canvas.requestRenderAll();
}

function resumeSection(
  canvas: Canvas,
  label: string,
  x: number,
  y: number,
  width: number,
  accent: string,
  ink: string,
  size: number
) {
  text(canvas, label.toUpperCase(), {
    x,
    y,
    width,
    size,
    fill: accent,
    weight: "bold",
    spacing: 110,
  });
  rect(canvas, x, y + size * 1.45, width, Math.max(3, size * 0.08), accent);
}

function resumeBody(
  canvas: Canvas,
  value: string,
  x: number,
  y: number,
  width: number,
  size: number,
  ink: string,
  weight: "normal" | "bold" = "normal"
) {
  text(canvas, value, {
    x,
    y,
    width,
    size,
    fill: ink,
    weight,
    lineHeight: 1.34,
  });
}

function resumeTemplate(canvas: Canvas, item: PremiumTemplateDefinition, renderToken: string) {
  const w = canvas.getWidth();
  const h = canvas.getHeight();
  const p = w * 0.065;
  const variant = item.layout - 10;

  canvas.clear();
  canvas.backgroundColor = item.bg;

  if (variant === 0) {
    // Executive split with restrained navy sidebar.
    rect(canvas, 0, 0, w * 0.31, h, "#10223f");
    if (item.image) photo(canvas, item.image, w * 0.065, h * 0.055, w * 0.18, w * 0.23, w * 0.03, renderToken, "#dbeafe", "#ffffff");
    text(canvas, "ALEX MORGAN", { x: w * 0.37, y: h * 0.065, width: w * 0.52, size: w * 0.047, fill: item.fg, weight: "bold", family: "Georgia" });
    text(canvas, "MARKETING & BRAND STRATEGY", { x: w * 0.37, y: h * 0.125, width: w * 0.50, size: w * 0.018, fill: item.accent, weight: "bold", spacing: 90 });
    rect(canvas, w * 0.37, h * 0.165, w * 0.53, 4, item.accent);
    resumeSection(canvas, "Profile", w * 0.37, h * 0.21, w * 0.53, item.accent, item.fg, w * 0.018);
    resumeBody(canvas, "Strategic marketer with 8+ years building clear brands, integrated campaigns and measurable growth across consumer and digital products.", w * 0.37, h * 0.255, w * 0.53, w * 0.0175, item.fg);
    resumeSection(canvas, "Experience", w * 0.37, h * 0.35, w * 0.53, item.accent, item.fg, w * 0.018);
    resumeBody(canvas, "BRAND LEAD — NORTH & CO.\n2022 — PRESENT\nLed positioning, launch planning and cross-functional campaigns across three product lines. Improved qualified demand and brand consistency across channels.", w * 0.37, h * 0.395, w * 0.53, w * 0.017, item.fg);
    resumeBody(canvas, "SENIOR MARKETING MANAGER — STUDIO NINE\n2018 — 2022\nBuilt campaign systems, content strategy and reporting frameworks used by a 12-person growth team.", w * 0.37, h * 0.57, w * 0.53, w * 0.017, item.fg);
    resumeSection(canvas, "Contact", w * 0.065, h * 0.34, w * 0.18, "#7dd3fc", "#ffffff", w * 0.016);
    resumeBody(canvas, "alex@email.com\n+91 98765 43210\nBengaluru, India\nlinkedin.com/in/alex", w * 0.065, h * 0.39, w * 0.18, w * 0.0155, "#e6eefc");
    resumeSection(canvas, "Skills", w * 0.065, h * 0.55, w * 0.18, "#7dd3fc", "#ffffff", w * 0.016);
    resumeBody(canvas, "Brand Strategy\nCampaign Planning\nResearch & Insight\nTeam Leadership\nPerformance Reporting", w * 0.065, h * 0.60, w * 0.18, w * 0.0155, "#e6eefc");
    resumeSection(canvas, "Education", w * 0.37, h * 0.77, w * 0.53, item.accent, item.fg, w * 0.018);
    resumeBody(canvas, "MBA, Marketing — University of Delhi\nB.Com — Christ University", w * 0.37, h * 0.815, w * 0.53, w * 0.017, item.fg);
  } else if (variant === 1) {
    // Creative coral portfolio resume.
    rect(canvas, 0, 0, w, h * 0.20, item.accent);
    text(canvas, "MAYA SHARMA", { x: p, y: h * 0.055, width: w * 0.56, size: w * 0.052, fill: "#ffffff", weight: "bold", family: "Georgia" });
    text(canvas, "CREATIVE STRATEGIST / CONTENT DESIGNER", { x: p, y: h * 0.125, width: w * 0.58, size: w * 0.017, fill: "#ffffff", weight: "bold", spacing: 70 });
    if (item.image) photo(canvas, item.image, w * 0.72, h * 0.045, w * 0.19, w * 0.19, w * 0.095, renderToken, item.soft, "#ffffff");
    resumeSection(canvas, "About", p, h * 0.26, w * 0.38, item.accent, item.fg, w * 0.018);
    resumeBody(canvas, "Creative strategist focused on social-first storytelling, branded content and campaigns that make complex ideas feel simple.", p, h * 0.305, w * 0.38, w * 0.0175, item.fg);
    resumeSection(canvas, "Selected work", w * 0.49, h * 0.26, w * 0.42, item.accent, item.fg, w * 0.018);
    resumeBody(canvas, "LAUNCH CAMPAIGN — AURA\nBuilt a multi-format creative system used across paid social, creator partnerships and product launch assets.\n\nEDITORIAL SERIES — NORTH\nDeveloped visual direction and content templates that increased weekly publishing consistency.", w * 0.49, h * 0.305, w * 0.42, w * 0.017, item.fg);
    resumeSection(canvas, "Experience", p, h * 0.50, w * 0.38, item.accent, item.fg, w * 0.018);
    resumeBody(canvas, "CREATIVE LEAD\nStudio Common • 2022 — Present\n\nCONTENT DESIGNER\nFrame & Field • 2019 — 2022", p, h * 0.545, w * 0.38, w * 0.017, item.fg);
    resumeSection(canvas, "Skills", w * 0.49, h * 0.59, w * 0.42, item.accent, item.fg, w * 0.018);
    resumeBody(canvas, "Creative Direction • Social Systems • Copywriting • Campaign Concepts • Art Direction • Presentation Design", w * 0.49, h * 0.635, w * 0.42, w * 0.017, item.fg);
    resumeSection(canvas, "Contact", p, h * 0.78, w * 0.84, item.accent, item.fg, w * 0.018);
    resumeBody(canvas, "maya@email.com     +91 98765 43210     Mumbai, India     mayasharma.design", p, h * 0.825, w * 0.84, w * 0.0165, item.fg);
  } else if (variant === 2) {
    // ATS-first, extremely stable and readable.
    text(canvas, "ARJUN MEHTA", { x: p, y: h * 0.05, width: w * 0.70, size: w * 0.050, fill: item.fg, weight: "bold" });
    text(canvas, "PRODUCT MANAGER", { x: p, y: h * 0.112, width: w * 0.55, size: w * 0.018, fill: item.accent, weight: "bold", spacing: 100 });
    resumeBody(canvas, "Bengaluru, India • arjun@email.com • +91 98765 43210 • linkedin.com/in/arjun", p, h * 0.155, w * 0.84, w * 0.0155, item.fg);
    rect(canvas, p, h * 0.195, w * 0.84, 4, item.accent);
    resumeSection(canvas, "Summary", p, h * 0.235, w * 0.84, item.accent, item.fg, w * 0.018);
    resumeBody(canvas, "Product manager with 7+ years shipping customer-facing products, aligning cross-functional teams and turning ambiguous problems into measurable product outcomes.", p, h * 0.28, w * 0.84, w * 0.0172, item.fg);
    resumeSection(canvas, "Experience", p, h * 0.36, w * 0.84, item.accent, item.fg, w * 0.018);
    resumeBody(canvas, "SENIOR PRODUCT MANAGER — NOVA LABS | 2021 — PRESENT\n• Led roadmap for a B2B workflow product used by 40K+ monthly users.\n• Improved activation by 18% through onboarding redesign and experimentation.\n• Partnered with engineering, design, sales and support on quarterly priorities.\n\nPRODUCT MANAGER — FLOWSTACK | 2018 — 2021\n• Launched analytics and collaboration features across web and mobile.\n• Built research and metrics cadence used for product planning.", p, h * 0.405, w * 0.84, w * 0.0168, item.fg);
    resumeSection(canvas, "Skills", p, h * 0.69, w * 0.84, item.accent, item.fg, w * 0.018);
    resumeBody(canvas, "Product Strategy • Roadmapping • User Research • Analytics • Experimentation • Stakeholder Management • Agile Delivery", p, h * 0.735, w * 0.84, w * 0.0168, item.fg);
    resumeSection(canvas, "Education", p, h * 0.82, w * 0.84, item.accent, item.fg, w * 0.018);
    resumeBody(canvas, "B.Tech, Computer Science — VIT University | 2018", p, h * 0.865, w * 0.84, w * 0.0168, item.fg);
  } else if (variant === 3) {
    // Tech product layout with compact sidebar chips.
    rect(canvas, 0, 0, w, h * 0.16, "#0b2b24");
    text(canvas, "NEHA IYER", { x: p, y: h * 0.048, width: w * 0.46, size: w * 0.048, fill: "#ffffff", weight: "bold" });
    text(canvas, "PRODUCT DESIGNER", { x: p, y: h * 0.105, width: w * 0.45, size: w * 0.017, fill: item.accent, weight: "bold", spacing: 90 });
    resumeBody(canvas, "neha@email.com   •   Bengaluru   •   nehaiyer.design", w * 0.55, h * 0.07, w * 0.36, w * 0.015, "#d9fff0");
    rect(canvas, p, h * 0.22, w * 0.27, h * 0.67, item.soft, w * 0.025);
    resumeSection(canvas, "Core skills", p * 1.35, h * 0.27, w * 0.20, item.accent, item.fg, w * 0.016);
    ["Product Design", "UX Research", "Design Systems", "Prototyping", "Figma", "Workshop Facilitation"].forEach((label, index) => {
      pill(canvas, label, p * 1.35, h * (0.33 + index * 0.065), w * 0.20, h * 0.045, "#ffffff", item.fg, w * 0.0125);
    });
    resumeSection(canvas, "Experience", w * 0.38, h * 0.23, w * 0.53, item.accent, item.fg, w * 0.018);
    resumeBody(canvas, "SENIOR PRODUCT DESIGNER — LATTICE\n2022 — PRESENT\nLed end-to-end product design for collaboration and analytics workflows. Built shared interaction patterns used across three product squads.\n\nPRODUCT DESIGNER — LOOP\n2019 — 2022\nShipped onboarding, reporting and mobile improvements with product and engineering.", w * 0.38, h * 0.28, w * 0.53, w * 0.017, item.fg);
    resumeSection(canvas, "Selected impact", w * 0.38, h * 0.61, w * 0.53, item.accent, item.fg, w * 0.018);
    resumeBody(canvas, "• Reduced setup time by 31% through onboarding redesign.\n• Created a component library adopted across 4 squads.\n• Ran 40+ customer interviews and usability sessions.", w * 0.38, h * 0.66, w * 0.53, w * 0.017, item.fg);
    resumeSection(canvas, "Education", w * 0.38, h * 0.81, w * 0.53, item.accent, item.fg, w * 0.018);
    resumeBody(canvas, "B.Des, Interaction Design — Srishti Institute", w * 0.38, h * 0.855, w * 0.53, w * 0.017, item.fg);
  } else if (variant === 4) {
    // Editorial olive with serif hierarchy and image block.
    rect(canvas, 0, 0, w * 0.39, h, "#314b39");
    if (item.image) photo(canvas, item.image, w * 0.075, h * 0.06, w * 0.24, h * 0.21, w * 0.02, renderToken, item.soft);
    text(canvas, "RIYA KAPOOR", { x: w * 0.46, y: h * 0.06, width: w * 0.45, size: w * 0.050, fill: item.fg, weight: "bold", family: "Georgia" });
    text(canvas, "EDITORIAL & CONTENT STRATEGY", { x: w * 0.46, y: h * 0.125, width: w * 0.44, size: w * 0.0165, fill: item.accent, weight: "bold", spacing: 75 });
    resumeSection(canvas, "Profile", w * 0.46, h * 0.21, w * 0.45, item.accent, item.fg, w * 0.0175);
    resumeBody(canvas, "Editorial strategist blending sharp writing, visual systems and audience insight to build content people actually want to read.", w * 0.46, h * 0.255, w * 0.45, w * 0.017, item.fg);
    resumeSection(canvas, "Experience", w * 0.46, h * 0.37, w * 0.45, item.accent, item.fg, w * 0.0175);
    resumeBody(canvas, "CONTENT DIRECTOR — FIELD NOTES\n2021 — PRESENT\nLed editorial calendar, branded series and partner content across digital channels.\n\nSENIOR EDITOR — HOUSE & CITY\n2017 — 2021\nManaged features, contributors and social extensions for monthly editorial themes.", w * 0.46, h * 0.415, w * 0.45, w * 0.0167, item.fg);
    resumeSection(canvas, "Contact", w * 0.075, h * 0.35, w * 0.24, "#c7d7bb", "#ffffff", w * 0.0155);
    resumeBody(canvas, "riya@email.com\n+91 98765 43210\nNew Delhi, India\nriyakapoor.work", w * 0.075, h * 0.40, w * 0.24, w * 0.015, "#eef5e9");
    resumeSection(canvas, "Expertise", w * 0.075, h * 0.58, w * 0.24, "#c7d7bb", "#ffffff", w * 0.0155);
    resumeBody(canvas, "Editorial Direction\nContent Strategy\nBrand Voice\nFeature Writing\nCreative Briefs\nAudience Research", w * 0.075, h * 0.63, w * 0.24, w * 0.015, "#eef5e9");
    resumeSection(canvas, "Education", w * 0.46, h * 0.78, w * 0.45, item.accent, item.fg, w * 0.0175);
    resumeBody(canvas, "MA, Media & Communication — Jamia Millia Islamia", w * 0.46, h * 0.825, w * 0.45, w * 0.0167, item.fg);
  } else {
    // Dark creative studio resume.
    canvas.backgroundColor = "#101010";
    rect(canvas, 0, 0, w, h, "#101010");
    rect(canvas, p, h * 0.05, w - p * 2, h * 0.16, "#1d1d1d", w * 0.025);
    text(canvas, "KABIR SEN", { x: p * 1.4, y: h * 0.075, width: w * 0.48, size: w * 0.052, fill: "#ffffff", weight: "bold", family: "Georgia" });
    text(canvas, "ART DIRECTOR / VISUAL DESIGNER", { x: p * 1.4, y: h * 0.145, width: w * 0.48, size: w * 0.0165, fill: item.accent, weight: "bold", spacing: 85 });
    if (item.image) photo(canvas, item.image, w * 0.75, h * 0.065, w * 0.15, h * 0.13, w * 0.02, renderToken, "#2a2a2a", item.accent);
    resumeSection(canvas, "Profile", p, h * 0.27, w * 0.38, item.accent, "#ffffff", w * 0.0175);
    resumeBody(canvas, "Art director creating expressive visual identities, campaigns and digital systems for culture, lifestyle and technology brands.", p, h * 0.315, w * 0.38, w * 0.017, "#d4d4d4");
    resumeSection(canvas, "Experience", w * 0.49, h * 0.27, w * 0.42, item.accent, "#ffffff", w * 0.0175);
    resumeBody(canvas, "ART DIRECTOR — STUDIO FORM\n2021 — PRESENT\nCreative direction across identity, campaign and editorial work.\n\nSENIOR DESIGNER — AFTER HOURS\n2017 — 2021\nBuilt visual systems and launch campaigns across digital channels.", w * 0.49, h * 0.315, w * 0.42, w * 0.0167, "#d4d4d4");
    resumeSection(canvas, "Capabilities", p, h * 0.56, w * 0.38, item.accent, "#ffffff", w * 0.0175);
    resumeBody(canvas, "Art Direction\nBrand Identity\nCampaign Systems\nEditorial Design\nDigital Product\nPresentation Design", p, h * 0.605, w * 0.38, w * 0.0167, "#d4d4d4");
    resumeSection(canvas, "Selected clients", w * 0.49, h * 0.61, w * 0.42, item.accent, "#ffffff", w * 0.0175);
    resumeBody(canvas, "Aster / Nova / Field / Common / North / Arc", w * 0.49, h * 0.655, w * 0.42, w * 0.0167, "#d4d4d4");
    resumeSection(canvas, "Contact", p, h * 0.82, w * 0.84, item.accent, "#ffffff", w * 0.0175);
    resumeBody(canvas, "kabir@email.com     +91 98765 43210     Mumbai, India     kabirsen.studio", p, h * 0.865, w * 0.84, w * 0.016, "#d4d4d4");
  }

  canvas.discardActiveObject();
  canvas.requestRenderAll();
}

export function applyPremiumTemplate(canvas: Canvas, type: string, renderToken: string) {
  const item = byType.get(type);
  if (!item) return false;

  (canvas as any).__postMakerTemplateToken = renderToken;

  if (item.kind === "resume") {
    resumeTemplate(canvas, item, renderToken);
  } else {
    socialLayout(canvas, item, renderToken);
  }

  return true;
}
