import {
  Circle,
  FabricImage,
  Line,
  Rect,
  Textbox,
  type Canvas,
} from "fabric";

import type { Format } from "@/types/editor";
import { FESTIVALS } from "@/lib/editor/festivals";
import { getSocialTemplateImage } from "@/lib/editor/templateImages";
import {
  PREMIUM_TEMPLATE_DEFINITIONS,
  applyPremiumTemplate,
  isPremiumTemplate,
} from "@/lib/editor/premiumTemplates";

export type TemplateType = string;

export type TemplateCard = {
  type: TemplateType;
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
  festival?: boolean;
  region?: string;
};

type SocialCategory = {
  slug: string;
  label: string;
  headline: string;
  subline: string;
  eyebrow: string;
  cta: string;
};

type Palette = {
  name: string;
  bg: string;
  fg: string;
  accent: string;
  soft: string;
  previewClass: string;
};

type TemplateDefinition = TemplateCard & {
  width: number;
  height: number;
  headline?: string;
  subline?: string;
  eyebrow?: string;
  cta?: string;
};

const SOCIAL_CATEGORIES: SocialCategory[] = [
  {
    slug: "sale",
    label: "Sale",
    headline: "THE BIG SALE",
    subline: "Fresh prices. Limited time. Designed to convert.",
    eyebrow: "LIMITED OFFER",
    cta: "SHOP NOW",
  },
  {
    slug: "business",
    label: "Business",
    headline: "BUILD A BRAND PEOPLE REMEMBER",
    subline: "Simple strategy for sharper positioning and stronger growth.",
    eyebrow: "BUSINESS PLAYBOOK",
    cta: "LEARN MORE",
  },
  {
    slug: "food",
    label: "Food",
    headline: "FRESH. SIMPLE. DELICIOUS.",
    subline: "Seasonal ingredients and bold flavours made for today.",
    eyebrow: "TODAY'S SPECIAL",
    cta: "ORDER NOW",
  },
  {
    slug: "quote",
    label: "Quote",
    headline: "MAKE THE NEXT MOVE COUNT.",
    subline: "Progress is built one clear decision at a time.",
    eyebrow: "DAILY NOTE",
    cta: "SAVE THIS",
  },
  {
    slug: "fitness",
    label: "Fitness",
    headline: "STRONGER STARTS TODAY",
    subline: "Move with purpose. Train with consistency. Track the progress.",
    eyebrow: "30 DAY CHALLENGE",
    cta: "START NOW",
  },
  {
    slug: "event",
    label: "Event",
    headline: "A NIGHT WORTH SHOWING UP FOR",
    subline: "Friday • 7 PM • Downtown Studio",
    eyebrow: "YOU'RE INVITED",
    cta: "RSVP",
  },
  {
    slug: "education",
    label: "Education",
    headline: "LEARN ONE THING BETTER TODAY",
    subline: "Practical ideas for smarter study and better results.",
    eyebrow: "QUICK LESSON",
    cta: "READ MORE",
  },
  {
    slug: "fashion",
    label: "Fashion",
    headline: "THE NEW EDIT",
    subline: "Clean silhouettes, modern texture and confident everyday style.",
    eyebrow: "NEW COLLECTION",
    cta: "DISCOVER",
  },
  {
    slug: "realestate",
    label: "Real Estate",
    headline: "A HOME THAT FEELS LIKE YOURS",
    subline: "Bright spaces, thoughtful details and a location that works.",
    eyebrow: "NEW LISTING",
    cta: "VIEW HOME",
  },
  {
    slug: "travel",
    label: "Travel",
    headline: "GO SOMEWHERE THAT STAYS WITH YOU",
    subline: "A slower route, better views and stories worth bringing home.",
    eyebrow: "TRAVEL EDIT",
    cta: "EXPLORE",
  },
  {
    slug: "finance",
    label: "Finance",
    headline: "MAKE YOUR MONEY FEEL SIMPLE",
    subline: "Clear habits for saving, spending and planning with confidence.",
    eyebrow: "MONEY GUIDE",
    cta: "GET TIPS",
  },
  {
    slug: "creator",
    label: "Creator",
    headline: "CREATE. SHARE. GROW.",
    subline: "Build content people recognise and come back for.",
    eyebrow: "CREATOR MODE",
    cta: "FOLLOW",
  },
];

const PALETTES: Palette[] = [
  {
    name: "Obsidian Violet",
    bg: "#111116",
    fg: "#ffffff",
    accent: "#8b5cf6",
    soft: "#29222f",
    previewClass: "from-zinc-950 via-zinc-900 to-violet-800",
  },
  {
    name: "Editorial Cream",
    bg: "#f6f0e8",
    fg: "#171717",
    accent: "#ef5b3f",
    soft: "#e7ddcf",
    previewClass: "from-stone-100 via-orange-50 to-orange-300",
  },
  {
    name: "Electric Blue",
    bg: "#eaf2ff",
    fg: "#13213c",
    accent: "#2563eb",
    soft: "#cddfff",
    previewClass: "from-blue-100 via-sky-200 to-blue-600",
  },
  {
    name: "Olive Luxe",
    bg: "#f0f2e8",
    fg: "#153326",
    accent: "#4f6f52",
    soft: "#cbd2b7",
    previewClass: "from-lime-100 via-stone-200 to-emerald-700",
  },
  {
    name: "Rose Studio",
    bg: "#fff0f3",
    fg: "#3b1220",
    accent: "#e11d48",
    soft: "#f7c9d5",
    previewClass: "from-rose-100 via-pink-200 to-rose-600",
  },
  {
    name: "Sunset Orange",
    bg: "#fff3e7",
    fg: "#3d1f0f",
    accent: "#f97316",
    soft: "#ffd6b2",
    previewClass: "from-orange-100 via-amber-200 to-orange-600",
  },
  {
    name: "Deep Teal",
    bg: "#e9f8f5",
    fg: "#073b36",
    accent: "#0f766e",
    soft: "#b9e4dc",
    previewClass: "from-emerald-100 via-teal-200 to-teal-700",
  },
  {
    name: "Purple Mist",
    bg: "#f1edff",
    fg: "#281451",
    accent: "#7c3aed",
    soft: "#d9ceff",
    previewClass: "from-violet-100 via-purple-200 to-violet-700",
  },
  {
    name: "Monochrome",
    bg: "#f7f7f5",
    fg: "#111111",
    accent: "#111111",
    soft: "#ddddda",
    previewClass: "from-neutral-100 via-neutral-300 to-neutral-800",
  },
];

const SOCIAL_FORMATS: Format[] = [
  { name: "Instagram Post", width: 1080, height: 1080 },
  { name: "Instagram Post (4:5)", width: 1080, height: 1350 },
  { name: "Instagram Story", width: 1080, height: 1920 },
  { name: "Facebook Post", width: 940, height: 788 },
  { name: "YouTube Thumbnail", width: 1280, height: 720 },
  { name: "LinkedIn Post", width: 1200, height: 1200 },
];

const RESUME_FAMILIES = [
  { slug: "modern-split", label: "Modern Split" },
  { slug: "executive", label: "Executive" },
  { slug: "editorial", label: "Editorial" },
  { slug: "minimal-ats", label: "Minimal ATS" },
  { slug: "creative-grid", label: "Creative Grid" },
  { slug: "dark-luxe", label: "Dark Luxe" },
];

const SOCIAL_DEFINITIONS: TemplateDefinition[] =
  SOCIAL_CATEGORIES.flatMap(
    (category, categoryIndex) =>
      PALETTES.map(
        (palette, paletteIndex) => {
          const format =
            SOCIAL_FORMATS[
              (categoryIndex +
                paletteIndex) %
                SOCIAL_FORMATS.length
            ];

          return {
            type: `social-${category.slug}-${paletteIndex + 1}`,
            name: `${category.label} ${String(
              paletteIndex + 1
            ).padStart(2, "0")}`,
            category: `Social • ${category.label}`,
            previewClass:
              palette.previewClass,
            kind: "social" as const,
            formatName: format.name,
            layout: paletteIndex,
            accent: palette.accent,
            bg: palette.bg,
            fg: palette.fg,
            soft: palette.soft,
            width: format.width,
            height: format.height,
            headline:
              category.headline,
            subline:
              category.subline,
            eyebrow:
              category.eyebrow,
            cta: category.cta,
            image: getSocialTemplateImage(category.slug),
          };
        }
      )
  );

const EXTRA_SOCIAL_FORMATS: Format[] = [
  { name: "Instagram Reel", width: 1080, height: 1920 },
  { name: "YouTube Shorts", width: 1080, height: 1920 },
  { name: "TikTok Video", width: 1080, height: 1920 },
  { name: "WhatsApp Status", width: 1080, height: 1920 },
  { name: "Facebook Landscape", width: 1200, height: 630 },
  { name: "X / Twitter Post", width: 1600, height: 900 },
  { name: "LinkedIn Landscape", width: 1200, height: 627 },
  { name: "Pinterest Pin", width: 1000, height: 1500 },
  { name: "Presentation", width: 1920, height: 1080 },
];

// Additive launch coverage for formats that existed in the editor but previously
// had no dedicated filtered templates. Existing social template IDs/assignments
// above remain untouched.
const EXTRA_SOCIAL_DEFINITIONS: TemplateDefinition[] =
  EXTRA_SOCIAL_FORMATS.flatMap((format, formatIndex) =>
    Array.from({ length: 6 }, (_, variantIndex) => {
      const category =
        SOCIAL_CATEGORIES[(formatIndex * 2 + variantIndex) % SOCIAL_CATEGORIES.length];
      const palette =
        PALETTES[(formatIndex + variantIndex) % PALETTES.length];

      return {
        type: `format-${format.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")}-${variantIndex + 1}`,
        name: `${format.name} ${String(variantIndex + 1).padStart(2, "0")}`,
        category: `Social • ${category.label}`,
        previewClass: palette.previewClass,
        kind: "social" as const,
        formatName: format.name,
        layout: variantIndex,
        accent: palette.accent,
        bg: palette.bg,
        fg: palette.fg,
        soft: palette.soft,
        width: format.width,
        height: format.height,
        headline: category.headline,
        subline: category.subline,
        eyebrow: category.eyebrow,
        cta: category.cta,
        image: getSocialTemplateImage(category.slug),
      };
    })
  );

const FESTIVAL_DEFINITIONS: TemplateDefinition[] =
  FESTIVALS.map((festival) => ({
    type: `festival-${festival.slug}`,
    name: festival.name,
    category: `Festival • ${festival.region}`,
    previewClass: "from-orange-100 via-amber-50 to-rose-100",
    kind: "social" as const,
    formatName: "Festival Poster",
    layout: festival.layout,
    accent: festival.accent,
    bg: festival.bg,
    fg: festival.fg,
    soft: "#ffffff",
    image: festival.image,
    festival: true,
    region: festival.region,
    width: 1080,
    height: 1350,
    headline: festival.greeting,
    subline: festival.subline,
    eyebrow: festival.region.toUpperCase(),
    cta: "CELEBRATE",
  }));

const RESUME_DEFINITIONS: TemplateDefinition[] =
  RESUME_FAMILIES.flatMap(
    (family, familyIndex) =>
      PALETTES.map(
        (palette, paletteIndex) => ({
          type: `resume-${family.slug}-${paletteIndex + 1}`,
          name: `${family.label} ${String(
            paletteIndex + 1
          ).padStart(2, "0")}`,
          category: `Resume • ${family.label}`,
          previewClass:
            palette.previewClass,
          kind: "resume" as const,
          formatName: "A4 Portrait",
          layout: familyIndex,
          accent: palette.accent,
          bg: "#ffffff",
          fg:
            palette.fg === "#ffffff"
              ? "#111827"
              : palette.fg,
          soft: palette.soft,
          width: 2480,
          height: 3508,
        })
      )
  );

const LETTER_RESUME_DEFINITIONS: TemplateDefinition[] =
  RESUME_FAMILIES.flatMap((family, familyIndex) =>
    PALETTES.slice(0, 3).map((palette, paletteIndex) => ({
      type: `resume-letter-${family.slug}-${paletteIndex + 1}`,
      name: `${family.label} Letter ${String(paletteIndex + 1).padStart(2, "0")}`,
      category: `Resume • ${family.label}`,
      previewClass: palette.previewClass,
      kind: "resume" as const,
      formatName: "US Letter",
      layout: familyIndex,
      accent: palette.accent,
      bg: "#ffffff",
      fg: palette.fg === "#ffffff" ? "#111827" : palette.fg,
      soft: palette.soft,
      width: 2550,
      height: 3300,
    }))
  );

const DEFINITIONS = [
  ...PREMIUM_TEMPLATE_DEFINITIONS,
  ...SOCIAL_DEFINITIONS,
  ...EXTRA_SOCIAL_DEFINITIONS,
  ...FESTIVAL_DEFINITIONS,
  ...RESUME_DEFINITIONS,
  ...LETTER_RESUME_DEFINITIONS,
];

export const TEMPLATE_CARDS: TemplateCard[] =
  DEFINITIONS.map((item) => ({
    type: item.type,
    name: item.name,
    category: item.category,
    previewClass:
      item.previewClass,
    kind: item.kind,
    formatName:
      item.formatName,
    layout: item.layout,
    accent: item.accent,
    bg: item.bg,
    fg: item.fg,
    soft: item.soft,
    image: item.image,
    festival: item.festival,
    region: item.region,
  }));

export function getTemplateFormat(
  type: TemplateType
): Format | null {
  const item =
    DEFINITIONS.find(
      (template) =>
        template.type === type
    );

  if (!item) return null;

  return {
    name: item.formatName,
    width: item.width,
    height: item.height,
  };
}

function addText(
  canvas: Canvas,
  value: string,
  options: {
    left: number;
    top: number;
    width: number;
    fontSize: number;
    fill: string;
    fontWeight?:
      | "normal"
      | "bold";
    textAlign?:
      | "left"
      | "center"
      | "right";
    fontFamily?: string;
    lineHeight?: number;
    charSpacing?: number;
  }
) {
  const object =
    new Textbox(value, {
      left: options.left,
      top: options.top,
      width: options.width,
      fontSize:
        options.fontSize,
      fill: options.fill,
      fontWeight:
        options.fontWeight ||
        "normal",
      textAlign:
        options.textAlign ||
        "left",
      fontFamily:
        options.fontFamily ||
        "Arial",
      lineHeight:
        options.lineHeight ||
        1.15,
      charSpacing:
        options.charSpacing ||
        0,
      editable: true,
      splitByGrapheme: false,
      originX: "left",
      originY: "top",
      padding: 2,
    });

  canvas.add(object);
  return object;
}

function addPill(
  canvas: Canvas,
  label: string,
  x: number,
  y: number,
  width: number,
  height: number,
  bg: string,
  fg: string
) {
  canvas.add(
    new Rect({
      left: x,
      top: y,
      width,
      height,
      rx: height / 2,
      ry: height / 2,
      fill: bg,
    })
  );

  addText(canvas, label, {
    left: x,
    top:
      y + height * 0.21,
    width,
    fontSize:
      height * 0.30,
    fill: fg,
    fontWeight: "bold",
    textAlign: "center",
    charSpacing: 50,
  });
}

function addPhotoFrame(
  canvas: Canvas,
  x: number,
  y: number,
  width: number,
  height: number,
  accent: string,
  soft: string,
  round = 24
) {
  canvas.add(
    new Rect({
      left: x,
      top: y,
      width,
      height,
      rx: round,
      ry: round,
      fill: soft,
      stroke: accent,
      strokeWidth:
        Math.max(
          2,
          width * 0.008
        ),
    })
  );

  addText(
    canvas,
    "ADD PHOTO",
    {
      left: x,
      top:
        y +
        height * 0.47,
      width,
      fontSize:
        Math.max(
          11,
          width * 0.045
        ),
      fill: accent,
      fontWeight: "bold",
      textAlign: "center",
      charSpacing: 60,
    }
  );
}

function addSectionTitle(
  canvas: Canvas,
  value: string,
  x: number,
  y: number,
  width: number,
  accent: string,
  ink: string,
  fontSize: number
) {
  addText(canvas, value, {
    left: x,
    top: y,
    width,
    fontSize,
    fill: ink,
    fontWeight: "bold",
    charSpacing: 45,
  });

  canvas.add(
    new Rect({
      left: x,
      top:
        y +
        fontSize * 1.35,
      width,
      height: Math.max(
        2,
        fontSize * 0.08
      ),
      fill: accent,
    })
  );
}

function addBullets(
  canvas: Canvas,
  items: string[],
  x: number,
  y: number,
  width: number,
  size: number,
  fill: string
) {
  addText(
    canvas,
    items
      .map(
        (item) =>
          `• ${item}`
      )
      .join("\n"),
    {
      left: x,
      top: y,
      width,
      fontSize: size,
      fill,
      lineHeight: 1.42,
    }
  );
}

function addTemplateImageToSlot(
  canvas: Canvas,
  imageUrl: string,
  x: number,
  y: number,
  width: number,
  height: number,
  accent: string,
  renderToken: string
) {
  canvas.add(
    new Rect({
      left: x - Math.max(2, width * 0.012),
      top: y - Math.max(2, height * 0.012),
      width: width + Math.max(4, width * 0.024),
      height: height + Math.max(4, height * 0.024),
      rx: Math.max(8, Math.min(width, height) * 0.06),
      ry: Math.max(8, Math.min(width, height) * 0.06),
      fill: "rgba(255,255,255,0.18)",
      stroke: accent,
      strokeWidth: Math.max(2, Math.min(width, height) * 0.012),
      selectable: false,
      evented: false,
    })
  );

  void FabricImage.fromURL(
    imageUrl,
    { crossOrigin: "anonymous" } as any
  )
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

      image.set({
        left: x,
        top: y,
        width: cropW,
        height: cropH,
        cropX,
        cropY,
        scaleX: width / cropW,
        scaleY: height / cropH,
        opacity: 1,
      });

      (image as any).templateImage = true;
      (image as any).templateImageUrl = imageUrl;
      image.setCoords();
      canvas.add(image);
      canvas.requestRenderAll();
      canvas.fire("object:modified", { target: image } as any);
    })
    .catch(() => {
      // Keep the editable layout usable if a remote stock photo is unavailable.
    });
}

function queueSocialTemplateImage(
  canvas: Canvas,
  item: TemplateDefinition,
  renderToken: string,
  ratio: number,
  layout: number
) {
  if (!item.image) return;

  const w = canvas.getWidth();
  const h = canvas.getHeight();
  const pad = Math.min(w, h) * 0.065;
  let slot: [number, number, number, number];

  if (ratio > 1.28) {
    slot =
      layout === 0
        ? [w * 0.657, h * 0.105, w * 0.276, h * 0.79]
        : layout === 1
        ? [w * 0.73, h * 0.14, w * 0.19, h * 0.64]
        : [w * 0.755, h * 0.14, w * 0.13, h * 0.72];
  } else if (ratio < 0.82) {
    slot =
      layout === 0
        ? [pad * 1.08, h * 0.07, w - pad * 2.16, h * 0.41]
        : layout === 1
        ? [w * 0.61, h * 0.68, w * 0.28, h * 0.17]
        : [w * 0.61, h * 0.70, w * 0.25, h * 0.16];
  } else {
    slot =
      layout === 0
        ? [w * 0.73, h * 0.08, w * 0.19, h * 0.25]
        : layout === 1
        ? [w * 0.08, h * 0.68, w * 0.20, h * 0.16]
        : [pad * 1.08, h * 0.10, w * 0.35, h * 0.40];
  }

  addTemplateImageToSlot(
    canvas,
    item.image,
    slot[0],
    slot[1],
    slot[2],
    slot[3],
    item.accent,
    renderToken
  );
}

function socialTemplate(
  canvas: Canvas,
  item: TemplateDefinition,
  renderToken: string
) {
  const w = canvas.getWidth();
  const h = canvas.getHeight();
  const ratio = w / h;
  const pad =
    Math.min(w, h) * 0.065;
  const layout =
    item.layout % 3;

  canvas.clear();
  canvas.backgroundColor =
    item.bg;

  if (ratio > 1.28) {
    if (layout === 0) {
      canvas.add(
        new Rect({
          left: w * 0.61,
          top: 0,
          width: w * 0.39,
          height: h,
          fill: item.accent,
        })
      );

      addPhotoFrame(
        canvas,
        w * 0.65,
        h * 0.09,
        w * 0.29,
        h * 0.82,
        item.fg,
        item.soft,
        22
      );

      addPill(
        canvas,
        item.eyebrow || "FEATURED",
        pad,
        h * 0.12,
        w * 0.24,
        h * 0.075,
        item.accent,
        "#ffffff"
      );

      addText(
        canvas,
        item.headline || "",
        {
          left: pad,
          top: h * 0.28,
          width: w * 0.49,
          fontSize:
            h * 0.09,
          fill: item.fg,
          fontWeight: "bold",
          lineHeight: 0.98,
        }
      );

      addText(
        canvas,
        item.subline || "",
        {
          left: pad,
          top: h * 0.61,
          width: w * 0.44,
          fontSize:
            h * 0.032,
          fill: item.fg,
          lineHeight: 1.3,
        }
      );

      addText(
        canvas,
        `${item.cta} →`,
        {
          left: pad,
          top: h * 0.82,
          width: w * 0.30,
          fontSize:
            h * 0.032,
          fill: item.accent,
          fontWeight: "bold",
        }
      );
    } else if (layout === 1) {
      canvas.add(
        new Circle({
          left: w * 0.66,
          top: -h * 0.30,
          radius: h * 0.62,
          fill: item.accent,
        })
      );

      addText(
        canvas,
        item.eyebrow || "",
        {
          left: pad,
          top: h * 0.12,
          width: w * 0.46,
          fontSize:
            h * 0.028,
          fill: item.accent,
          fontWeight: "bold",
          charSpacing: 140,
        }
      );

      addText(
        canvas,
        item.headline || "",
        {
          left: pad,
          top: h * 0.26,
          width: w * 0.54,
          fontSize:
            h * 0.105,
          fill: item.fg,
          fontWeight: "bold",
          lineHeight: 0.94,
        }
      );

      addText(
        canvas,
        item.subline || "",
        {
          left: pad,
          top: h * 0.64,
          width: w * 0.44,
          fontSize:
            h * 0.033,
          fill: item.fg,
        }
      );

      addPill(
        canvas,
        item.cta || "START",
        pad,
        h * 0.80,
        w * 0.19,
        h * 0.085,
        item.fg,
        item.bg
      );
    } else {
      canvas.add(
        new Rect({
          left: pad,
          top: h * 0.08,
          width:
            w - pad * 2,
          height: h * 0.84,
          fill: "transparent",
          stroke: item.accent,
          strokeWidth:
            h * 0.012,
          rx: 24,
          ry: 24,
        })
      );

      addText(
        canvas,
        item.eyebrow || "",
        {
          left: pad * 1.7,
          top: h * 0.18,
          width: w * 0.42,
          fontSize:
            h * 0.027,
          fill: item.accent,
          fontWeight: "bold",
          charSpacing: 130,
        }
      );

      addText(
        canvas,
        item.headline || "",
        {
          left: pad * 1.7,
          top: h * 0.32,
          width: w * 0.52,
          fontSize:
            h * 0.086,
          fill: item.fg,
          fontWeight: "bold",
          fontFamily: "Georgia",
          lineHeight: 1,
        }
      );

      addText(
        canvas,
        item.subline || "",
        {
          left: pad * 1.7,
          top: h * 0.67,
          width: w * 0.44,
          fontSize:
            h * 0.03,
          fill: item.fg,
        }
      );

      canvas.add(
        new Rect({
          left: w * 0.72,
          top: h * 0.08,
          width: h * 0.12,
          height: h * 0.84,
          fill: item.accent,
        })
      );
    }
  } else if (ratio < 0.82) {
    if (layout === 0) {
      addPhotoFrame(
        canvas,
        pad,
        h * 0.06,
        w - pad * 2,
        h * 0.43,
        item.accent,
        item.soft,
        32
      );

      addPill(
        canvas,
        item.eyebrow || "",
        pad,
        h * 0.55,
        w * 0.38,
        h * 0.052,
        item.accent,
        "#ffffff"
      );

      addText(
        canvas,
        item.headline || "",
        {
          left: pad,
          top: h * 0.63,
          width:
            w - pad * 2,
          fontSize:
            w * 0.085,
          fill: item.fg,
          fontWeight: "bold",
          lineHeight: 0.98,
        }
      );

      addText(
        canvas,
        item.subline || "",
        {
          left: pad,
          top: h * 0.80,
          width:
            w - pad * 2.2,
          fontSize:
            w * 0.032,
          fill: item.fg,
        }
      );

      addText(
        canvas,
        `${item.cta} →`,
        {
          left: pad,
          top: h * 0.91,
          width: w * 0.44,
          fontSize:
            w * 0.032,
          fill: item.accent,
          fontWeight: "bold",
        }
      );
    } else if (layout === 1) {
      canvas.add(
        new Rect({
          left: 0,
          top: 0,
          width: w,
          height: h * 0.36,
          fill: item.accent,
        })
      );

      addText(
        canvas,
        item.eyebrow || "",
        {
          left: pad,
          top: h * 0.10,
          width: w * 0.50,
          fontSize:
            w * 0.028,
          fill: "#ffffff",
          fontWeight: "bold",
          charSpacing: 130,
        }
      );

      addText(
        canvas,
        item.headline || "",
        {
          left: pad,
          top: h * 0.19,
          width:
            w - pad * 2,
          fontSize:
            w * 0.082,
          fill: "#ffffff",
          fontWeight: "bold",
          lineHeight: 0.95,
        }
      );

      addText(
        canvas,
        item.subline || "",
        {
          left: pad,
          top: h * 0.48,
          width:
            w - pad * 2,
          fontSize:
            w * 0.033,
          fill: item.fg,
        }
      );

      canvas.add(
        new Line(
          [
            pad,
            h * 0.63,
            w - pad,
            h * 0.63,
          ],
          {
            stroke:
              item.accent,
            strokeWidth:
              w * 0.008,
          }
        )
      );

      addText(
        canvas,
        item.cta || "",
        {
          left: pad,
          top: h * 0.70,
          width: w * 0.46,
          fontSize:
            w * 0.034,
          fill: item.fg,
          fontWeight: "bold",
        }
      );
    } else {
      canvas.add(
        new Rect({
          left: pad,
          top: h * 0.05,
          width:
            w - pad * 2,
          height: h * 0.90,
          fill: item.soft,
          rx: 34,
          ry: 34,
        })
      );

      canvas.add(
        new Rect({
          left: pad * 1.4,
          top: h * 0.08,
          width:
            w - pad * 2.8,
          height: h * 0.36,
          fill: item.accent,
          rx: 28,
          ry: 28,
        })
      );

      addText(
        canvas,
        item.eyebrow || "",
        {
          left: pad * 1.8,
          top: h * 0.13,
          width:
            w - pad * 3.6,
          fontSize:
            w * 0.027,
          fill: "#ffffff",
          fontWeight: "bold",
          charSpacing: 120,
        }
      );

      addText(
        canvas,
        item.headline || "",
        {
          left: pad * 1.8,
          top: h * 0.22,
          width:
            w - pad * 3.6,
          fontSize:
            w * 0.072,
          fill: "#ffffff",
          fontWeight: "bold",
          fontFamily: "Georgia",
          lineHeight: 1,
        }
      );

      addText(
        canvas,
        item.subline || "",
        {
          left: pad * 1.8,
          top: h * 0.54,
          width:
            w - pad * 3.6,
          fontSize:
            w * 0.031,
          fill: item.fg,
        }
      );

      addPill(
        canvas,
        item.cta || "",
        pad * 1.8,
        h * 0.76,
        w * 0.38,
        h * 0.055,
        item.fg,
        item.bg
      );
    }
  } else {
    if (layout === 0) {
      canvas.add(
        new Circle({
          left: w * 0.60,
          top: -h * 0.08,
          radius: w * 0.32,
          fill: item.accent,
        })
      );

      addText(
        canvas,
        item.eyebrow || "",
        {
          left: pad,
          top: h * 0.12,
          width: w * 0.48,
          fontSize:
            w * 0.026,
          fill: item.accent,
          fontWeight: "bold",
          charSpacing: 140,
        }
      );

      addText(
        canvas,
        item.headline || "",
        {
          left: pad,
          top: h * 0.26,
          width: w * 0.68,
          fontSize:
            w * 0.075,
          fill: item.fg,
          fontWeight: "bold",
          lineHeight: 0.96,
        }
      );

      addText(
        canvas,
        item.subline || "",
        {
          left: pad,
          top: h * 0.60,
          width: w * 0.62,
          fontSize:
            w * 0.029,
          fill: item.fg,
        }
      );

      addPill(
        canvas,
        item.cta || "",
        pad,
        h * 0.77,
        w * 0.28,
        h * 0.07,
        item.fg,
        item.bg
      );
    } else if (layout === 1) {
      canvas.add(
        new Rect({
          left: pad,
          top: pad,
          width:
            w - pad * 2,
          height:
            h - pad * 2,
          fill: "transparent",
          stroke: item.accent,
          strokeWidth:
            w * 0.010,
          rx: 30,
          ry: 30,
        })
      );

      addText(
        canvas,
        item.eyebrow || "",
        {
          left: pad * 1.6,
          top: h * 0.16,
          width:
            w - pad * 3.2,
          fontSize:
            w * 0.025,
          fill: item.accent,
          fontWeight: "bold",
          textAlign: "center",
          charSpacing: 150,
        }
      );

      addText(
        canvas,
        item.headline || "",
        {
          left: pad * 1.6,
          top: h * 0.31,
          width:
            w - pad * 3.2,
          fontSize:
            w * 0.070,
          fill: item.fg,
          fontWeight: "bold",
          textAlign: "center",
          fontFamily: "Georgia",
          lineHeight: 1,
        }
      );

      addText(
        canvas,
        item.subline || "",
        {
          left: pad * 1.8,
          top: h * 0.60,
          width:
            w - pad * 3.6,
          fontSize:
            w * 0.028,
          fill: item.fg,
          textAlign: "center",
        }
      );

      addText(
        canvas,
        `${item.cta} →`,
        {
          left: pad * 1.6,
          top: h * 0.78,
          width:
            w - pad * 3.2,
          fontSize:
            w * 0.026,
          fill: item.accent,
          fontWeight: "bold",
          textAlign: "center",
        }
      );
    } else {
      canvas.add(
        new Rect({
          left: 0,
          top: h * 0.61,
          width: w,
          height: h * 0.39,
          fill: item.accent,
        })
      );

      addPhotoFrame(
        canvas,
        pad,
        h * 0.09,
        w * 0.37,
        h * 0.43,
        item.fg,
        item.soft,
        24
      );

      addText(
        canvas,
        item.eyebrow || "",
        {
          left: w * 0.50,
          top: h * 0.14,
          width: w * 0.39,
          fontSize:
            w * 0.024,
          fill: item.accent,
          fontWeight: "bold",
          charSpacing: 110,
        }
      );

      addText(
        canvas,
        item.headline || "",
        {
          left: w * 0.50,
          top: h * 0.26,
          width: w * 0.40,
          fontSize:
            w * 0.058,
          fill: item.fg,
          fontWeight: "bold",
          lineHeight: 0.98,
        }
      );

      addText(
        canvas,
        item.subline || "",
        {
          left: pad,
          top: h * 0.70,
          width: w * 0.56,
          fontSize:
            w * 0.028,
          fill: "#ffffff",
        }
      );

      addText(
        canvas,
        `${item.cta} →`,
        {
          left: w * 0.68,
          top: h * 0.81,
          width: w * 0.23,
          fontSize:
            w * 0.026,
          fill: "#ffffff",
          fontWeight: "bold",
          textAlign: "right",
        }
      );
    }
  }

  queueSocialTemplateImage(canvas, item, renderToken, ratio, layout);
  canvas.discardActiveObject();
  canvas.requestRenderAll();
}

function resumeModernSplit(
  canvas: Canvas,
  item: TemplateDefinition
) {
  const w = canvas.getWidth();
  const h = canvas.getHeight();
  const ink = "#182033";
  const accent = item.accent;
  const sideW = w * 0.34;
  const sidePad = w * 0.045;
  const mainX = w * 0.40;
  const mainW = w * 0.52;
  const body = w * 0.014;
  const small = w * 0.012;
  const section = w * 0.020;

  canvas.backgroundColor =
    "#ffffff";

  canvas.add(
    new Rect({
      left: 0,
      top: 0,
      width: sideW,
      height: h,
      fill: accent,
    })
  );

  canvas.add(
    new Circle({
      left: sideW * 0.17,
      top: h * 0.055,
      radius: sideW * 0.25,
      fill: item.soft,
      stroke: "#ffffff",
      strokeWidth: w * 0.006,
    })
  );

  addText(
    canvas,
    "PHOTO",
    {
      left: sideW * 0.17,
      top: h * 0.104,
      width: sideW * 0.50,
      fontSize:
        w * 0.015,
      fill: accent,
      fontWeight: "bold",
      textAlign: "center",
    }
  );

  addText(
    canvas,
    "CONTACT",
    {
      left: sidePad,
      top: h * 0.255,
      width:
        sideW -
        sidePad * 2,
      fontSize: section,
      fill: "#ffffff",
      fontWeight: "bold",
    }
  );

  addText(
    canvas,
    "morgan@email.com\n+91 98765 43210\nMumbai, India\nportfolio.com",
    {
      left: sidePad,
      top: h * 0.29,
      width:
        sideW -
        sidePad * 2,
      fontSize: small,
      fill: "#ffffff",
      lineHeight: 1.5,
    }
  );

  addText(
    canvas,
    "SKILLS",
    {
      left: sidePad,
      top: h * 0.47,
      width:
        sideW -
        sidePad * 2,
      fontSize: section,
      fill: "#ffffff",
      fontWeight: "bold",
    }
  );

  addBullets(
    canvas,
    [
      "Brand systems",
      "Typography",
      "Art direction",
      "Figma",
      "Illustration",
    ],
    sidePad,
    h * 0.505,
    sideW -
      sidePad * 2,
    small,
    "#ffffff"
  );

  addText(
    canvas,
    "LANGUAGES",
    {
      left: sidePad,
      top: h * 0.73,
      width:
        sideW -
        sidePad * 2,
      fontSize: section,
      fill: "#ffffff",
      fontWeight: "bold",
    }
  );

  addText(
    canvas,
    "English — Fluent\nHindi — Native",
    {
      left: sidePad,
      top: h * 0.765,
      width:
        sideW -
        sidePad * 2,
      fontSize: small,
      fill: "#ffffff",
      lineHeight: 1.55,
    }
  );

  addText(
    canvas,
    "MORGAN MAXWELL",
    {
      left: mainX,
      top: h * 0.055,
      width: mainW,
      fontSize:
        w * 0.057,
      fill: ink,
      fontWeight: "bold",
      fontFamily: "Georgia",
      lineHeight: 1,
    }
  );

  addText(
    canvas,
    "GRAPHIC DESIGNER",
    {
      left: mainX,
      top: h * 0.128,
      width: mainW,
      fontSize:
        w * 0.020,
      fill: accent,
      fontWeight: "bold",
      charSpacing: 70,
    }
  );

  addSectionTitle(
    canvas,
    "PROFILE",
    mainX,
    h * 0.21,
    mainW,
    accent,
    ink,
    section
  );

  addText(
    canvas,
    "Creative and detail-oriented designer with experience building clear visual systems for digital products, campaigns and brand communication.",
    {
      left: mainX,
      top: h * 0.255,
      width: mainW,
      fontSize: body,
      fill: "#475569",
      lineHeight: 1.35,
    }
  );

  addSectionTitle(
    canvas,
    "PROFESSIONAL EXPERIENCE",
    mainX,
    h * 0.36,
    mainW,
    accent,
    ink,
    section
  );

  addText(
    canvas,
    "Senior Graphic Designer",
    {
      left: mainX,
      top: h * 0.405,
      width: mainW,
      fontSize:
        w * 0.017,
      fill: ink,
      fontWeight: "bold",
    }
  );

  addText(
    canvas,
    "Studio North • Jun 2022 – Present",
    {
      left: mainX,
      top: h * 0.435,
      width: mainW,
      fontSize: small,
      fill: accent,
      fontWeight: "bold",
    }
  );

  addBullets(
    canvas,
    [
      "Led brand and campaign design across digital channels.",
      "Built reusable visual systems that improved delivery speed.",
      "Collaborated with marketing, product and content teams.",
    ],
    mainX,
    h * 0.475,
    mainW,
    body,
    "#475569"
  );

  addText(
    canvas,
    "Graphic Designer",
    {
      left: mainX,
      top: h * 0.65,
      width: mainW,
      fontSize:
        w * 0.017,
      fill: ink,
      fontWeight: "bold",
    }
  );

  addText(
    canvas,
    "Freelance • Jan 2020 – May 2022",
    {
      left: mainX,
      top: h * 0.68,
      width: mainW,
      fontSize: small,
      fill: accent,
      fontWeight: "bold",
    }
  );

  addBullets(
    canvas,
    [
      "Designed social campaigns, decks and launch assets.",
      "Created flexible templates for recurring client content.",
    ],
    mainX,
    h * 0.72,
    mainW,
    body,
    "#475569"
  );

  addSectionTitle(
    canvas,
    "EDUCATION",
    mainX,
    h * 0.86,
    mainW,
    accent,
    ink,
    section
  );

  addText(
    canvas,
    "Bachelor of Fine Arts — Graphic Design\nUniversity Name • 2016 – 2020",
    {
      left: mainX,
      top: h * 0.905,
      width: mainW,
      fontSize: body,
      fill: "#475569",
      lineHeight: 1.45,
    }
  );
}

function resumeExecutive(
  canvas: Canvas,
  item: TemplateDefinition
) {
  const w = canvas.getWidth();
  const h = canvas.getHeight();
  const accent = item.accent;
  const ink = "#111827";
  const x = w * 0.07;
  const fullW = w * 0.86;
  const mainW = w * 0.60;
  const sideX = w * 0.72;
  const sideW = w * 0.20;
  const body = w * 0.014;
  const section = w * 0.020;
  const small = w * 0.012;

  canvas.backgroundColor =
    "#fbfbfa";

  canvas.add(
    new Rect({
      left: 0,
      top: 0,
      width: w,
      height: h * 0.16,
      fill: ink,
    })
  );

  canvas.add(
    new Rect({
      left: 0,
      top: h * 0.16,
      width: w,
      height: h * 0.007,
      fill: accent,
    })
  );

  addText(
    canvas,
    "PRIYA SHARMA",
    {
      left: x,
      top: h * 0.04,
      width: w * 0.62,
      fontSize:
        w * 0.055,
      fill: "#ffffff",
      fontWeight: "bold",
      fontFamily: "Georgia",
    }
  );

  addText(
    canvas,
    "MARKETING & BRAND LEADER",
    {
      left: x,
      top: h * 0.105,
      width: w * 0.62,
      fontSize:
        w * 0.019,
      fill: accent,
      fontWeight: "bold",
      charSpacing: 60,
    }
  );

  addText(
    canvas,
    "priya@email.com • Bengaluru • +91 98765 43210",
    {
      left: x,
      top: h * 0.138,
      width: w * 0.62,
      fontSize: small,
      fill: "#d1d5db",
    }
  );

  addSectionTitle(
    canvas,
    "EXECUTIVE PROFILE",
    x,
    h * 0.22,
    mainW,
    accent,
    ink,
    section
  );

  addText(
    canvas,
    "Growth-focused marketing leader with experience building brands, launching integrated campaigns and turning audience insight into measurable business outcomes.",
    {
      left: x,
      top: h * 0.265,
      width: mainW,
      fontSize: body,
      fill: "#475569",
      lineHeight: 1.35,
    }
  );

  addSectionTitle(
    canvas,
    "EXPERIENCE",
    x,
    h * 0.38,
    mainW,
    accent,
    ink,
    section
  );

  addText(
    canvas,
    "Marketing Manager — Brand Studio",
    {
      left: x,
      top: h * 0.425,
      width: mainW,
      fontSize:
        w * 0.017,
      fill: ink,
      fontWeight: "bold",
    }
  );

  addText(
    canvas,
    "2022 – Present",
    {
      left: x,
      top: h * 0.454,
      width: mainW,
      fontSize: small,
      fill: accent,
      fontWeight: "bold",
    }
  );

  addBullets(
    canvas,
    [
      "Built integrated campaigns across paid, owned and creator channels.",
      "Improved qualified leads by 38% through sharper messaging.",
      "Managed content planning, reporting and cross-functional execution.",
    ],
    x,
    h * 0.49,
    mainW,
    body,
    "#475569"
  );

  addText(
    canvas,
    "Senior Marketing Executive",
    {
      left: x,
      top: h * 0.67,
      width: mainW,
      fontSize:
        w * 0.017,
      fill: ink,
      fontWeight: "bold",
    }
  );

  addText(
    canvas,
    "2019 – 2022",
    {
      left: x,
      top: h * 0.70,
      width: mainW,
      fontSize: small,
      fill: accent,
      fontWeight: "bold",
    }
  );

  addBullets(
    canvas,
    [
      "Owned campaign calendars and performance dashboards.",
      "Partnered with design and sales on high-priority launches.",
    ],
    x,
    h * 0.738,
    mainW,
    body,
    "#475569"
  );

  canvas.add(
    new Rect({
      left: sideX,
      top: h * 0.22,
      width: sideW,
      height: h * 0.68,
      fill: "#f1f3f5",
      rx: w * 0.02,
      ry: w * 0.02,
    })
  );

  addText(
    canvas,
    "CORE SKILLS",
    {
      left: sideX + sideW * 0.12,
      top: h * 0.27,
      width: sideW * 0.76,
      fontSize:
        w * 0.016,
      fill: ink,
      fontWeight: "bold",
    }
  );

  addBullets(
    canvas,
    [
      "Brand strategy",
      "Campaign planning",
      "Content",
      "Analytics",
      "CRM",
      "SEO",
    ],
    sideX + sideW * 0.12,
    h * 0.315,
    sideW * 0.76,
    w * 0.012,
    "#475569"
  );

  addText(
    canvas,
    "EDUCATION",
    {
      left: sideX + sideW * 0.12,
      top: h * 0.58,
      width: sideW * 0.76,
      fontSize:
        w * 0.016,
      fill: ink,
      fontWeight: "bold",
    }
  );

  addText(
    canvas,
    "MBA — Marketing\nUniversity Name\n2018",
    {
      left: sideX + sideW * 0.12,
      top: h * 0.625,
      width: sideW * 0.76,
      fontSize:
        w * 0.012,
      fill: "#475569",
      lineHeight: 1.45,
    }
  );

  addText(
    canvas,
    "TOOLS",
    {
      left: sideX + sideW * 0.12,
      top: h * 0.75,
      width: sideW * 0.76,
      fontSize:
        w * 0.016,
      fill: ink,
      fontWeight: "bold",
    }
  );

  addText(
    canvas,
    "GA4\nHubSpot\nMeta Ads\nNotion",
    {
      left: sideX + sideW * 0.12,
      top: h * 0.795,
      width: sideW * 0.76,
      fontSize:
        w * 0.012,
      fill: "#475569",
      lineHeight: 1.45,
    }
  );
}

function resumeEditorial(
  canvas: Canvas,
  item: TemplateDefinition
) {
  const w = canvas.getWidth();
  const h = canvas.getHeight();
  const accent = item.accent;
  const ink = "#1f2937";
  const pad = w * 0.07;
  const leftW = w * 0.29;
  const mainX = w * 0.41;
  const mainW = w * 0.51;
  const body = w * 0.014;
  const small = w * 0.012;
  const section = w * 0.020;

  canvas.backgroundColor =
    "#f7f3ed";

  addText(
    canvas,
    "ALEXANDER\nMORGAN",
    {
      left: pad,
      top: h * 0.045,
      width: w * 0.50,
      fontSize:
        w * 0.058,
      fill: ink,
      fontWeight: "bold",
      fontFamily: "Georgia",
      lineHeight: 0.92,
    }
  );

  addText(
    canvas,
    "PRODUCT DESIGNER",
    {
      left: w * 0.66,
      top: h * 0.075,
      width: w * 0.26,
      fontSize:
        w * 0.019,
      fill: accent,
      fontWeight: "bold",
    }
  );

  addText(
    canvas,
    "alex@email.com\n+91 98765 43210\nNew Delhi, India",
    {
      left: w * 0.66,
      top: h * 0.115,
      width: w * 0.26,
      fontSize: small,
      fill: "#64748b",
      lineHeight: 1.45,
    }
  );

  canvas.add(
    new Line(
      [
        pad,
        h * 0.19,
        w - pad,
        h * 0.19,
      ],
      {
        stroke: accent,
        strokeWidth:
          w * 0.005,
      }
    )
  );

  addSectionTitle(
    canvas,
    "PROFILE",
    pad,
    h * 0.26,
    leftW,
    accent,
    ink,
    section
  );

  addText(
    canvas,
    "Product designer focused on clear systems, useful experiences and thoughtful visual craft.",
    {
      left: pad,
      top: h * 0.305,
      width: leftW,
      fontSize: body,
      fill: "#475569",
      lineHeight: 1.35,
    }
  );

  addSectionTitle(
    canvas,
    "SKILLS",
    pad,
    h * 0.46,
    leftW,
    accent,
    ink,
    section
  );

  addBullets(
    canvas,
    [
      "Design systems",
      "Research",
      "Prototyping",
      "Visual design",
      "Strategy",
    ],
    pad,
    h * 0.505,
    leftW,
    body,
    "#475569"
  );

  addSectionTitle(
    canvas,
    "EDUCATION",
    pad,
    h * 0.72,
    leftW,
    accent,
    ink,
    section
  );

  addText(
    canvas,
    "B.Des — Visual Communication\nUniversity Name • 2020",
    {
      left: pad,
      top: h * 0.765,
      width: leftW,
      fontSize: body,
      fill: "#475569",
      lineHeight: 1.45,
    }
  );

  addSectionTitle(
    canvas,
    "EXPERIENCE",
    mainX,
    h * 0.26,
    mainW,
    accent,
    ink,
    section
  );

  addText(
    canvas,
    "Senior Product Designer",
    {
      left: mainX,
      top: h * 0.305,
      width: mainW,
      fontSize:
        w * 0.017,
      fill: ink,
      fontWeight: "bold",
    }
  );

  addText(
    canvas,
    "Product Company • 2023 – Present",
    {
      left: mainX,
      top: h * 0.335,
      width: mainW,
      fontSize: small,
      fill: accent,
      fontWeight: "bold",
    }
  );

  addBullets(
    canvas,
    [
      "Led core product flows from discovery through delivery.",
      "Built reusable components and improved consistency.",
      "Partnered with product and engineering on measurable UX improvements.",
    ],
    mainX,
    h * 0.375,
    mainW,
    body,
    "#475569"
  );

  addText(
    canvas,
    "Product Designer",
    {
      left: mainX,
      top: h * 0.60,
      width: mainW,
      fontSize:
        w * 0.017,
      fill: ink,
      fontWeight: "bold",
    }
  );

  addText(
    canvas,
    "Studio One • 2020 – 2023",
    {
      left: mainX,
      top: h * 0.63,
      width: mainW,
      fontSize: small,
      fill: accent,
      fontWeight: "bold",
    }
  );

  addBullets(
    canvas,
    [
      "Designed responsive experiences for web and mobile.",
      "Created prototypes, research plans and product narratives.",
    ],
    mainX,
    h * 0.67,
    mainW,
    body,
    "#475569"
  );

  addSectionTitle(
    canvas,
    "SELECTED PROJECTS",
    mainX,
    h * 0.82,
    mainW,
    accent,
    ink,
    section
  );

  addText(
    canvas,
    "Kriyavo — creator design editor\nFinance Dashboard — reporting platform",
    {
      left: mainX,
      top: h * 0.865,
      width: mainW,
      fontSize: body,
      fill: "#475569",
      lineHeight: 1.5,
    }
  );
}

function resumeMinimal(
  canvas: Canvas,
  item: TemplateDefinition
) {
  const w = canvas.getWidth();
  const h = canvas.getHeight();
  const accent = item.accent;
  const ink = "#111827";
  const pad = w * 0.07;
  const width = w * 0.86;
  const body = w * 0.014;
  const small = w * 0.012;
  const section = w * 0.020;

  canvas.backgroundColor =
    "#ffffff";

  addText(
    canvas,
    "ROHAN MEHTA",
    {
      left: pad,
      top: h * 0.045,
      width,
      fontSize:
        w * 0.058,
      fill: ink,
      fontWeight: "bold",
    }
  );

  addText(
    canvas,
    "SOFTWARE ENGINEER",
    {
      left: pad,
      top: h * 0.11,
      width,
      fontSize:
        w * 0.019,
      fill: accent,
      fontWeight: "bold",
      charSpacing: 60,
    }
  );

  addText(
    canvas,
    "rohan@email.com • Bengaluru • portfolio.dev • +91 98765 43210",
    {
      left: pad,
      top: h * 0.145,
      width,
      fontSize: small,
      fill: "#64748b",
    }
  );

  canvas.add(
    new Line(
      [
        pad,
        h * 0.18,
        w - pad,
        h * 0.18,
      ],
      {
        stroke: accent,
        strokeWidth:
          w * 0.004,
      }
    )
  );

  addSectionTitle(
    canvas,
    "SUMMARY",
    pad,
    h * 0.23,
    width,
    accent,
    ink,
    section
  );

  addText(
    canvas,
    "Engineer building reliable web products with TypeScript, React and modern backend systems. Strong at product thinking, performance and maintainable architecture.",
    {
      left: pad,
      top: h * 0.275,
      width,
      fontSize: body,
      fill: "#475569",
      lineHeight: 1.35,
    }
  );

  addSectionTitle(
    canvas,
    "EXPERIENCE",
    pad,
    h * 0.38,
    width,
    accent,
    ink,
    section
  );

  addText(
    canvas,
    "Software Engineer — Product Company",
    {
      left: pad,
      top: h * 0.425,
      width,
      fontSize:
        w * 0.017,
      fill: ink,
      fontWeight: "bold",
    }
  );

  addText(
    canvas,
    "2022 – Present",
    {
      left: pad,
      top: h * 0.455,
      width,
      fontSize: small,
      fill: accent,
      fontWeight: "bold",
    }
  );

  addBullets(
    canvas,
    [
      "Shipped customer-facing features across web and internal tools.",
      "Improved performance, reliability and developer experience.",
      "Worked closely with product and design on end-to-end delivery.",
    ],
    pad,
    h * 0.495,
    width,
    body,
    "#475569"
  );

  addText(
    canvas,
    "Frontend Developer — Studio Labs",
    {
      left: pad,
      top: h * 0.67,
      width,
      fontSize:
        w * 0.017,
      fill: ink,
      fontWeight: "bold",
    }
  );

  addText(
    canvas,
    "2020 – 2022",
    {
      left: pad,
      top: h * 0.70,
      width,
      fontSize: small,
      fill: accent,
      fontWeight: "bold",
    }
  );

  addBullets(
    canvas,
    [
      "Built responsive interfaces and reusable React components.",
      "Collaborated on accessibility and performance improvements.",
    ],
    pad,
    h * 0.74,
    width,
    body,
    "#475569"
  );

  addSectionTitle(
    canvas,
    "SKILLS",
    pad,
    h * 0.86,
    w * 0.39,
    accent,
    ink,
    section
  );

  addText(
    canvas,
    "TypeScript • React • Node.js • SQL • Git • Testing",
    {
      left: pad,
      top: h * 0.905,
      width: w * 0.39,
      fontSize: body,
      fill: "#475569",
    }
  );

  addSectionTitle(
    canvas,
    "EDUCATION",
    w * 0.55,
    h * 0.86,
    w * 0.38,
    accent,
    ink,
    section
  );

  addText(
    canvas,
    "B.Tech Computer Science\nUniversity Name • 2020",
    {
      left: w * 0.55,
      top: h * 0.905,
      width: w * 0.38,
      fontSize: body,
      fill: "#475569",
    }
  );
}

function resumeCreative(
  canvas: Canvas,
  item: TemplateDefinition
) {
  const w = canvas.getWidth();
  const h = canvas.getHeight();
  const accent = item.accent;
  const ink = "#172033";
  const pad = w * 0.05;
  const gap = w * 0.04;
  const colW =
    (w - pad * 2 - gap) /
    2;
  const body = w * 0.014;
  const section = w * 0.020;
  const small = w * 0.012;

  canvas.backgroundColor =
    "#f8fafc";

  canvas.add(
    new Rect({
      left: pad,
      top: h * 0.035,
      width:
        w - pad * 2,
      height: h * 0.19,
      fill: accent,
      rx: w * 0.025,
      ry: w * 0.025,
    })
  );

  addText(
    canvas,
    "NISHA KAPOOR",
    {
      left: pad * 2,
      top: h * 0.07,
      width: w * 0.55,
      fontSize:
        w * 0.054,
      fill: "#ffffff",
      fontWeight: "bold",
    }
  );

  addText(
    canvas,
    "UI / UX DESIGNER",
    {
      left: pad * 2,
      top: h * 0.135,
      width: w * 0.55,
      fontSize:
        w * 0.019,
      fill: "#ffffff",
      fontWeight: "bold",
    }
  );

  addPhotoFrame(
    canvas,
    w * 0.73,
    h * 0.055,
    w * 0.16,
    h * 0.13,
    "#ffffff",
    item.soft,
    w * 0.02
  );

  const leftX = pad;
  const rightX =
    pad + colW + gap;

  canvas.add(
    new Rect({
      left: leftX,
      top: h * 0.27,
      width: colW,
      height: h * 0.32,
      fill: "#ffffff",
      rx: w * 0.018,
      ry: w * 0.018,
    })
  );

  addSectionTitle(
    canvas,
    "PROFILE",
    leftX + w * 0.035,
    h * 0.305,
    colW - w * 0.07,
    accent,
    ink,
    section
  );

  addText(
    canvas,
    "Designer creating clear, useful and visually confident product experiences across web and mobile.",
    {
      left:
        leftX +
        w * 0.035,
      top: h * 0.355,
      width:
        colW -
        w * 0.07,
      fontSize: body,
      fill: "#475569",
      lineHeight: 1.35,
    }
  );

  addSectionTitle(
    canvas,
    "SKILLS",
    leftX + w * 0.035,
    h * 0.45,
    colW - w * 0.07,
    accent,
    ink,
    section
  );

  addBullets(
    canvas,
    [
      "Product design",
      "Research",
      "Prototyping",
      "Design systems",
      "Figma",
    ],
    leftX + w * 0.035,
    h * 0.50,
    colW - w * 0.07,
    body,
    "#475569"
  );

  canvas.add(
    new Rect({
      left: rightX,
      top: h * 0.27,
      width: colW,
      height: h * 0.64,
      fill: "#ffffff",
      rx: w * 0.018,
      ry: w * 0.018,
    })
  );

  addSectionTitle(
    canvas,
    "EXPERIENCE",
    rightX + w * 0.035,
    h * 0.305,
    colW - w * 0.07,
    accent,
    ink,
    section
  );

  addText(
    canvas,
    "Senior Product Designer",
    {
      left:
        rightX +
        w * 0.035,
      top: h * 0.355,
      width:
        colW -
        w * 0.07,
      fontSize:
        w * 0.017,
      fill: ink,
      fontWeight: "bold",
    }
  );

  addText(
    canvas,
    "Fintech Co. • 2022 – Present",
    {
      left:
        rightX +
        w * 0.035,
      top: h * 0.385,
      width:
        colW -
        w * 0.07,
      fontSize: small,
      fill: accent,
      fontWeight: "bold",
    }
  );

  addBullets(
    canvas,
    [
      "Owned key product journeys from research to release.",
      "Built scalable components and documentation.",
      "Improved conversion through iterative testing.",
    ],
    rightX + w * 0.035,
    h * 0.425,
    colW - w * 0.07,
    body,
    "#475569"
  );

  addText(
    canvas,
    "Product Designer",
    {
      left:
        rightX +
        w * 0.035,
      top: h * 0.64,
      width:
        colW -
        w * 0.07,
      fontSize:
        w * 0.017,
      fill: ink,
      fontWeight: "bold",
    }
  );

  addText(
    canvas,
    "Design Studio • 2019 – 2022",
    {
      left:
        rightX +
        w * 0.035,
      top: h * 0.67,
      width:
        colW -
        w * 0.07,
      fontSize: small,
      fill: accent,
      fontWeight: "bold",
    }
  );

  addBullets(
    canvas,
    [
      "Designed responsive websites and product prototypes.",
      "Presented design rationale to clients and stakeholders.",
    ],
    rightX + w * 0.035,
    h * 0.71,
    colW - w * 0.07,
    body,
    "#475569"
  );

  canvas.add(
    new Rect({
      left: leftX,
      top: h * 0.63,
      width: colW,
      height: h * 0.28,
      fill: item.soft,
      rx: w * 0.018,
      ry: w * 0.018,
    })
  );

  addSectionTitle(
    canvas,
    "EDUCATION",
    leftX + w * 0.035,
    h * 0.68,
    colW - w * 0.07,
    accent,
    ink,
    section
  );

  addText(
    canvas,
    "B.Des — Interaction Design\nDesign Institute • 2019",
    {
      left:
        leftX +
        w * 0.035,
      top: h * 0.735,
      width:
        colW -
        w * 0.07,
      fontSize: body,
      fill: "#475569",
      lineHeight: 1.45,
    }
  );
}

function resumeDark(
  canvas: Canvas,
  item: TemplateDefinition
) {
  const w = canvas.getWidth();
  const h = canvas.getHeight();
  const accent = item.accent;
  const leftW = w * 0.40;
  const sidePad = w * 0.05;
  const mainX = w * 0.47;
  const mainW = w * 0.46;
  const body = w * 0.014;
  const section = w * 0.020;
  const small = w * 0.012;

  canvas.backgroundColor =
    "#0f141d";

  canvas.add(
    new Rect({
      left: 0,
      top: 0,
      width: leftW,
      height: h,
      fill: "#151d29",
    })
  );

  addPhotoFrame(
    canvas,
    sidePad,
    h * 0.055,
    leftW - sidePad * 2,
    h * 0.18,
    accent,
    "#202b3b",
    w * 0.02
  );

  addText(
    canvas,
    "SAMIRA KHAN",
    {
      left: sidePad,
      top: h * 0.28,
      width:
        leftW -
        sidePad * 2,
      fontSize:
        w * 0.050,
      fill: "#f8fafc",
      fontWeight: "bold",
      fontFamily: "Georgia",
    }
  );

  addText(
    canvas,
    "CREATIVE DIRECTOR",
    {
      left: sidePad,
      top: h * 0.35,
      width:
        leftW -
        sidePad * 2,
      fontSize:
        w * 0.018,
      fill: accent,
      fontWeight: "bold",
    }
  );

  addText(
    canvas,
    "samira@email.com\n+91 98765 43210\nMumbai, India",
    {
      left: sidePad,
      top: h * 0.41,
      width:
        leftW -
        sidePad * 2,
      fontSize: small,
      fill: "#cbd5e1",
      lineHeight: 1.5,
    }
  );

  addText(
    canvas,
    "EXPERTISE",
    {
      left: sidePad,
      top: h * 0.58,
      width:
        leftW -
        sidePad * 2,
      fontSize: section,
      fill: "#f8fafc",
      fontWeight: "bold",
    }
  );

  addBullets(
    canvas,
    [
      "Creative direction",
      "Brand systems",
      "Campaigns",
      "Team leadership",
      "Storytelling",
    ],
    sidePad,
    h * 0.625,
    leftW -
      sidePad * 2,
    body,
    "#cbd5e1"
  );

  addText(
    canvas,
    "PROFILE",
    {
      left: mainX,
      top: h * 0.065,
      width: mainW,
      fontSize: section,
      fill: accent,
      fontWeight: "bold",
    }
  );

  addText(
    canvas,
    "Creative leader connecting brand strategy, visual systems and high-impact storytelling across campaigns, digital products and launch moments.",
    {
      left: mainX,
      top: h * 0.115,
      width: mainW,
      fontSize: body,
      fill: "#d7dee8",
      lineHeight: 1.4,
    }
  );

  addText(
    canvas,
    "EXPERIENCE",
    {
      left: mainX,
      top: h * 0.28,
      width: mainW,
      fontSize: section,
      fill: accent,
      fontWeight: "bold",
    }
  );

  addText(
    canvas,
    "Creative Director — North Studio",
    {
      left: mainX,
      top: h * 0.33,
      width: mainW,
      fontSize:
        w * 0.017,
      fill: "#f8fafc",
      fontWeight: "bold",
    }
  );

  addText(
    canvas,
    "2021 – Present",
    {
      left: mainX,
      top: h * 0.36,
      width: mainW,
      fontSize: small,
      fill: accent,
      fontWeight: "bold",
    }
  );

  addBullets(
    canvas,
    [
      "Directed brand, campaign and digital creative across major accounts.",
      "Led multidisciplinary teams from concept to production.",
      "Built design systems that improved consistency and speed.",
    ],
    mainX,
    h * 0.40,
    mainW,
    body,
    "#d7dee8"
  );

  addText(
    canvas,
    "Associate Creative Director",
    {
      left: mainX,
      top: h * 0.61,
      width: mainW,
      fontSize:
        w * 0.017,
      fill: "#f8fafc",
      fontWeight: "bold",
    }
  );

  addText(
    canvas,
    "2018 – 2021",
    {
      left: mainX,
      top: h * 0.64,
      width: mainW,
      fontSize: small,
      fill: accent,
      fontWeight: "bold",
    }
  );

  addBullets(
    canvas,
    [
      "Created integrated launch campaigns and brand platforms.",
      "Presented concepts and strategy to senior stakeholders.",
    ],
    mainX,
    h * 0.68,
    mainW,
    body,
    "#d7dee8"
  );

  addText(
    canvas,
    "EDUCATION",
    {
      left: mainX,
      top: h * 0.84,
      width: mainW,
      fontSize: section,
      fill: accent,
      fontWeight: "bold",
    }
  );

  addText(
    canvas,
    "BFA — Communication Design\nUniversity Name • 2018",
    {
      left: mainX,
      top: h * 0.89,
      width: mainW,
      fontSize: body,
      fill: "#d7dee8",
      lineHeight: 1.45,
    }
  );
}


function festivalTemplate(
  canvas: Canvas,
  item: TemplateDefinition,
  renderToken: string
) {
  const w = canvas.getWidth();
  const h = canvas.getHeight();
  const pad = w * 0.07;
  const layout = item.layout % 4;

  canvas.clear();
  canvas.backgroundColor = item.bg;

  canvas.add(
    new Circle({
      left: -w * 0.15,
      top: -w * 0.18,
      radius: w * 0.32,
      fill: item.accent,
      opacity: 0.12,
      selectable: false,
      evented: false,
    }),
    new Circle({
      left: w * 0.73,
      top: h * 0.79,
      radius: w * 0.24,
      fill: item.accent,
      opacity: 0.1,
      selectable: false,
      evented: false,
    })
  );

  const imageX =
    layout === 1
      ? w * 0.50
      : pad;

  const imageY =
    layout === 2
      ? h * 0.09
      : h * 0.08;

  const imageW =
    layout === 1
      ? w * 0.43
      : w - pad * 2;

  const imageH =
    layout === 1
      ? h * 0.47
      : h * 0.43;

  canvas.add(
    new Rect({
      left: imageX,
      top: imageY,
      width: imageW,
      height: imageH,
      rx: 34,
      ry: 34,
      fill: item.soft,
      stroke: item.accent,
      strokeWidth: Math.max(3, w * 0.006),
      opacity: 0.96,
    })
  );

  if (item.image) {
    void FabricImage.fromURL(item.image)
      .then((image) => {
        if (
          (canvas as any).__postMakerTemplateToken !==
          renderToken
        ) {
          return;
        }

        const sourceW = Math.max(1, image.width || 1);
        const sourceH = Math.max(1, image.height || 1);

        image.set({
          left: imageX + imageW * 0.02,
          top: imageY + imageH * 0.02,
          width: sourceW,
          height: sourceH,
          scaleX: (imageW * 0.96) / sourceW,
          scaleY: (imageH * 0.96) / sourceH,
          opacity: 1,
        });

        (image as any).festivalImage = true;
        (image as any).festivalName = item.name;

        canvas.add(image);
        canvas.requestRenderAll();
        canvas.fire(
          "object:modified",
          { target: image } as any
        );
      })
      .catch(() => {
        // The template remains fully editable even if the local preview image
        // fails to load for any reason.
      });
  }

  if (layout === 1) {
    addText(canvas, item.eyebrow || "INDIAN FESTIVAL", {
      left: pad,
      top: h * 0.10,
      width: w * 0.35,
      fontSize: w * 0.025,
      fill: item.accent,
      fontWeight: "bold",
      charSpacing: 90,
    });

    addText(canvas, item.headline || item.name, {
      left: pad,
      top: h * 0.20,
      width: w * 0.37,
      fontSize: w * 0.073,
      fill: item.fg,
      fontWeight: "bold",
      lineHeight: 0.98,
    });

    addText(canvas, item.subline || "", {
      left: pad,
      top: h * 0.48,
      width: w * 0.37,
      fontSize: w * 0.028,
      fill: item.fg,
      lineHeight: 1.32,
    });

    addPill(
      canvas,
      "SHARE WISHES",
      pad,
      h * 0.72,
      w * 0.34,
      h * 0.058,
      item.accent,
      "#ffffff"
    );
  } else {
    addText(canvas, item.eyebrow || "INDIAN FESTIVAL", {
      left: pad,
      top: h * 0.56,
      width: w - pad * 2,
      fontSize: w * 0.025,
      fill: item.accent,
      fontWeight: "bold",
      charSpacing: 95,
    });

    addText(canvas, item.headline || item.name, {
      left: pad,
      top: h * 0.63,
      width: w - pad * 2,
      fontSize: w * 0.07,
      fill: item.fg,
      fontWeight: "bold",
      lineHeight: 0.98,
      textAlign: layout === 3 ? "center" : "left",
    });

    addText(canvas, item.subline || "", {
      left: pad,
      top: h * 0.79,
      width: w - pad * 2,
      fontSize: w * 0.027,
      fill: item.fg,
      lineHeight: 1.32,
      textAlign: layout === 3 ? "center" : "left",
    });

    addText(canvas, "POSTMAKER • FESTIVAL GREETINGS", {
      left: pad,
      top: h * 0.94,
      width: w - pad * 2,
      fontSize: w * 0.018,
      fill: item.accent,
      fontWeight: "bold",
      charSpacing: 70,
      textAlign: layout === 3 ? "center" : "left",
    });
  }

  canvas.discardActiveObject();
  canvas.requestRenderAll();
}

function resumeTemplate(
  canvas: Canvas,
  item: TemplateDefinition
) {
  canvas.clear();

  const layout =
    item.layout % 6;

  if (layout === 0)
    resumeModernSplit(
      canvas,
      item
    );
  if (layout === 1)
    resumeExecutive(
      canvas,
      item
    );
  if (layout === 2)
    resumeEditorial(
      canvas,
      item
    );
  if (layout === 3)
    resumeMinimal(
      canvas,
      item
    );
  if (layout === 4)
    resumeCreative(
      canvas,
      item
    );
  if (layout === 5)
    resumeDark(
      canvas,
      item
    );

  canvas.discardActiveObject();
  canvas.requestRenderAll();
}

export function applyTemplate(
  canvas: Canvas,
  type: TemplateType
) {
  const item =
    DEFINITIONS.find(
      (template) =>
        template.type === type
    );

  if (!item) {
    throw new Error(
      `Unknown template: ${type}`
    );
  }

  const renderToken =
    `${type}-${Date.now()}-${Math.random()}`;

  (canvas as any).__postMakerTemplateToken =
    renderToken;

  if (isPremiumTemplate(type)) {
    applyPremiumTemplate(canvas, type, renderToken);
    return;
  }

  if (item.kind === "resume") {
    resumeTemplate(
      canvas,
      item
    );
  } else if (item.festival) {
    festivalTemplate(
      canvas,
      item,
      renderToken
    );
  } else {
    socialTemplate(
      canvas,
      item,
      renderToken
    );
  }
}
