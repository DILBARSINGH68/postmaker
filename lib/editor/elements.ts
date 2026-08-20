import {
  Circle,
  Ellipse,
  Group,
  Line,
  Path,
  Polygon,
  Rect,
  Textbox,
  type Canvas,
  type FabricObject,
} from "fabric";

export type ElementCategory =
  | "All"
  | "Shapes"
  | "Lines & Arrows"
  | "Frames"
  | "Icons"
  | "Stickers"
  | "Graphics"
  | "Charts"
  | "Social";

export type ElementDefinition = {
  id: string;
  name: string;
  category: Exclude<ElementCategory, "All">;
  preview: string;
  keywords: string[];
};

export const ELEMENT_CATEGORIES: ElementCategory[] = [
  "All",
  "Shapes",
  "Lines & Arrows",
  "Frames",
  "Icons",
  "Stickers",
  "Graphics",
  "Charts",
  "Social",
];

export const ELEMENTS: ElementDefinition[] = [
  {
    "id": "shape-rect",
    "name": "Rectangle",
    "category": "Shapes",
    "preview": "▰",
    "keywords": [
      "rectangle"
    ]
  },
  {
    "id": "shape-rounded-rect",
    "name": "Rounded rectangle",
    "category": "Shapes",
    "preview": "▣",
    "keywords": [
      "rounded",
      "rectangle"
    ]
  },
  {
    "id": "shape-square",
    "name": "Square",
    "category": "Shapes",
    "preview": "■",
    "keywords": [
      "square"
    ]
  },
  {
    "id": "shape-circle",
    "name": "Circle",
    "category": "Shapes",
    "preview": "●",
    "keywords": [
      "circle"
    ]
  },
  {
    "id": "shape-ellipse",
    "name": "Ellipse",
    "category": "Shapes",
    "preview": "⬭",
    "keywords": [
      "ellipse"
    ]
  },
  {
    "id": "shape-triangle",
    "name": "Triangle",
    "category": "Shapes",
    "preview": "▲",
    "keywords": [
      "triangle"
    ]
  },
  {
    "id": "shape-triangle-down",
    "name": "Triangle down",
    "category": "Shapes",
    "preview": "▼",
    "keywords": [
      "triangle",
      "down"
    ]
  },
  {
    "id": "shape-right-triangle",
    "name": "Right triangle",
    "category": "Shapes",
    "preview": "◢",
    "keywords": [
      "right",
      "triangle"
    ]
  },
  {
    "id": "shape-diamond",
    "name": "Diamond",
    "category": "Shapes",
    "preview": "◆",
    "keywords": [
      "diamond"
    ]
  },
  {
    "id": "shape-pentagon",
    "name": "Pentagon",
    "category": "Shapes",
    "preview": "⬟",
    "keywords": [
      "pentagon"
    ]
  },
  {
    "id": "shape-hexagon",
    "name": "Hexagon",
    "category": "Shapes",
    "preview": "⬢",
    "keywords": [
      "hexagon"
    ]
  },
  {
    "id": "shape-octagon",
    "name": "Octagon",
    "category": "Shapes",
    "preview": "⯃",
    "keywords": [
      "octagon"
    ]
  },
  {
    "id": "shape-star5",
    "name": "5 point star",
    "category": "Shapes",
    "preview": "★",
    "keywords": [
      "5",
      "point",
      "star"
    ]
  },
  {
    "id": "shape-star8",
    "name": "8 point star",
    "category": "Shapes",
    "preview": "✦",
    "keywords": [
      "8",
      "point",
      "star"
    ]
  },
  {
    "id": "shape-burst12",
    "name": "Burst",
    "category": "Shapes",
    "preview": "✹",
    "keywords": [
      "burst"
    ]
  },
  {
    "id": "shape-heart",
    "name": "Heart",
    "category": "Shapes",
    "preview": "♥",
    "keywords": [
      "heart"
    ]
  },
  {
    "id": "shape-cloud",
    "name": "Cloud",
    "category": "Shapes",
    "preview": "☁",
    "keywords": [
      "cloud"
    ]
  },
  {
    "id": "shape-ring",
    "name": "Ring",
    "category": "Shapes",
    "preview": "◯",
    "keywords": [
      "ring"
    ]
  },
  {
    "id": "shape-pill",
    "name": "Pill",
    "category": "Shapes",
    "preview": "▬",
    "keywords": [
      "pill"
    ]
  },
  {
    "id": "shape-arch",
    "name": "Arch",
    "category": "Shapes",
    "preview": "⌒",
    "keywords": [
      "arch"
    ]
  },
  {
    "id": "shape-semi-circle",
    "name": "Semi circle",
    "category": "Shapes",
    "preview": "◒",
    "keywords": [
      "semi",
      "circle"
    ]
  },
  {
    "id": "shape-speech",
    "name": "Speech bubble",
    "category": "Shapes",
    "preview": "▱",
    "keywords": [
      "speech",
      "bubble"
    ]
  },
  {
    "id": "shape-tag",
    "name": "Tag",
    "category": "Shapes",
    "preview": "◈",
    "keywords": [
      "tag"
    ]
  },
  {
    "id": "shape-banner",
    "name": "Banner",
    "category": "Shapes",
    "preview": "▰",
    "keywords": [
      "banner"
    ]
  },
  {
    "id": "shape-chevron",
    "name": "Chevron",
    "category": "Shapes",
    "preview": "❯",
    "keywords": [
      "chevron"
    ]
  },
  {
    "id": "shape-bracket",
    "name": "Bracket",
    "category": "Shapes",
    "preview": "⌜",
    "keywords": [
      "bracket"
    ]
  },
  {
    "id": "shape-blob1",
    "name": "Organic blob 1",
    "category": "Shapes",
    "preview": "◉",
    "keywords": [
      "organic",
      "blob",
      "1"
    ]
  },
  {
    "id": "shape-blob2",
    "name": "Organic blob 2",
    "category": "Shapes",
    "preview": "◉",
    "keywords": [
      "organic",
      "blob",
      "2"
    ]
  },
  {
    "id": "shape-blob3",
    "name": "Organic blob 3",
    "category": "Shapes",
    "preview": "◉",
    "keywords": [
      "organic",
      "blob",
      "3"
    ]
  },
  {
    "id": "shape-blob4",
    "name": "Organic blob 4",
    "category": "Shapes",
    "preview": "◉",
    "keywords": [
      "organic",
      "blob",
      "4"
    ]
  },
  {
    "id": "shape-outline-square",
    "name": "Square outline",
    "category": "Shapes",
    "preview": "□",
    "keywords": [
      "square",
      "outline"
    ]
  },
  {
    "id": "shape-outline-circle",
    "name": "Circle outline",
    "category": "Shapes",
    "preview": "○",
    "keywords": [
      "circle",
      "outline"
    ]
  },
  {
    "id": "shape-capsule-outline",
    "name": "Capsule outline",
    "category": "Shapes",
    "preview": "▭",
    "keywords": [
      "capsule",
      "outline"
    ]
  },
  {
    "id": "shape-corner-frame",
    "name": "Corner frame",
    "category": "Shapes",
    "preview": "⌜",
    "keywords": [
      "corner",
      "frame"
    ]
  },
  {
    "id": "line-thin",
    "name": "Thin line",
    "category": "Lines & Arrows",
    "preview": "━",
    "keywords": [
      "thin",
      "line"
    ]
  },
  {
    "id": "line-medium",
    "name": "Medium line",
    "category": "Lines & Arrows",
    "preview": "━",
    "keywords": [
      "medium",
      "line"
    ]
  },
  {
    "id": "line-thick",
    "name": "Thick line",
    "category": "Lines & Arrows",
    "preview": "━",
    "keywords": [
      "thick",
      "line"
    ]
  },
  {
    "id": "line-dashed",
    "name": "Dashed line",
    "category": "Lines & Arrows",
    "preview": "┄",
    "keywords": [
      "dashed",
      "line"
    ]
  },
  {
    "id": "line-dotted",
    "name": "Dotted line",
    "category": "Lines & Arrows",
    "preview": "┈",
    "keywords": [
      "dotted",
      "line"
    ]
  },
  {
    "id": "line-double",
    "name": "Double line",
    "category": "Lines & Arrows",
    "preview": "═",
    "keywords": [
      "double",
      "line"
    ]
  },
  {
    "id": "line-arrow-right",
    "name": "Arrow right",
    "category": "Lines & Arrows",
    "preview": "→",
    "keywords": [
      "arrow",
      "right"
    ]
  },
  {
    "id": "line-arrow-left",
    "name": "Arrow left",
    "category": "Lines & Arrows",
    "preview": "←",
    "keywords": [
      "arrow",
      "left"
    ]
  },
  {
    "id": "line-arrow-up",
    "name": "Arrow up",
    "category": "Lines & Arrows",
    "preview": "↑",
    "keywords": [
      "arrow",
      "up"
    ]
  },
  {
    "id": "line-arrow-down",
    "name": "Arrow down",
    "category": "Lines & Arrows",
    "preview": "↓",
    "keywords": [
      "arrow",
      "down"
    ]
  },
  {
    "id": "line-arrow-both",
    "name": "Double arrow",
    "category": "Lines & Arrows",
    "preview": "↔",
    "keywords": [
      "double",
      "arrow"
    ]
  },
  {
    "id": "line-curved-right",
    "name": "Curved arrow",
    "category": "Lines & Arrows",
    "preview": "↪",
    "keywords": [
      "curved",
      "arrow"
    ]
  },
  {
    "id": "line-curved-left",
    "name": "Curved arrow left",
    "category": "Lines & Arrows",
    "preview": "↩",
    "keywords": [
      "curved",
      "arrow",
      "left"
    ]
  },
  {
    "id": "line-bent",
    "name": "Bent arrow",
    "category": "Lines & Arrows",
    "preview": "↳",
    "keywords": [
      "bent",
      "arrow"
    ]
  },
  {
    "id": "line-wave",
    "name": "Wave line",
    "category": "Lines & Arrows",
    "preview": "〰",
    "keywords": [
      "wave",
      "line"
    ]
  },
  {
    "id": "line-zigzag",
    "name": "Zigzag",
    "category": "Lines & Arrows",
    "preview": "〽",
    "keywords": [
      "zigzag"
    ]
  },
  {
    "id": "line-scribble",
    "name": "Scribble line",
    "category": "Lines & Arrows",
    "preview": "≈",
    "keywords": [
      "scribble",
      "line"
    ]
  },
  {
    "id": "line-dot-divider",
    "name": "Dot divider",
    "category": "Lines & Arrows",
    "preview": "•••",
    "keywords": [
      "dot",
      "divider"
    ]
  },
  {
    "id": "line-star-divider",
    "name": "Star divider",
    "category": "Lines & Arrows",
    "preview": "✦✦✦",
    "keywords": [
      "star",
      "divider"
    ]
  },
  {
    "id": "line-circle-ends",
    "name": "Circle end line",
    "category": "Lines & Arrows",
    "preview": "●━●",
    "keywords": [
      "circle",
      "end",
      "line"
    ]
  },
  {
    "id": "line-diamond-ends",
    "name": "Diamond end line",
    "category": "Lines & Arrows",
    "preview": "◆━◆",
    "keywords": [
      "diamond",
      "end",
      "line"
    ]
  },
  {
    "id": "line-arrow-line",
    "name": "Line arrow",
    "category": "Lines & Arrows",
    "preview": "━➤",
    "keywords": [
      "line",
      "arrow"
    ]
  },
  {
    "id": "line-underline",
    "name": "Swoosh underline",
    "category": "Lines & Arrows",
    "preview": "⌣",
    "keywords": [
      "swoosh",
      "underline"
    ]
  },
  {
    "id": "line-vertical",
    "name": "Vertical line",
    "category": "Lines & Arrows",
    "preview": "┃",
    "keywords": [
      "vertical",
      "line"
    ]
  },
  {
    "id": "line-vertical-dashed",
    "name": "Vertical dashed",
    "category": "Lines & Arrows",
    "preview": "┊",
    "keywords": [
      "vertical",
      "dashed"
    ]
  },
  {
    "id": "frame-square",
    "name": "Square frame",
    "category": "Frames",
    "preview": "□",
    "keywords": [
      "square",
      "frame"
    ]
  },
  {
    "id": "frame-rounded",
    "name": "Rounded frame",
    "category": "Frames",
    "preview": "▢",
    "keywords": [
      "rounded",
      "frame"
    ]
  },
  {
    "id": "frame-circle",
    "name": "Circle frame",
    "category": "Frames",
    "preview": "○",
    "keywords": [
      "circle",
      "frame"
    ]
  },
  {
    "id": "frame-ellipse",
    "name": "Ellipse frame",
    "category": "Frames",
    "preview": "⬭",
    "keywords": [
      "ellipse",
      "frame"
    ]
  },
  {
    "id": "frame-double",
    "name": "Double border",
    "category": "Frames",
    "preview": "▣",
    "keywords": [
      "double",
      "border"
    ]
  },
  {
    "id": "frame-polaroid",
    "name": "Polaroid frame",
    "category": "Frames",
    "preview": "▱",
    "keywords": [
      "polaroid",
      "frame"
    ]
  },
  {
    "id": "frame-portrait",
    "name": "Portrait frame",
    "category": "Frames",
    "preview": "▯",
    "keywords": [
      "portrait",
      "frame"
    ]
  },
  {
    "id": "frame-landscape",
    "name": "Landscape frame",
    "category": "Frames",
    "preview": "▭",
    "keywords": [
      "landscape",
      "frame"
    ]
  },
  {
    "id": "frame-browser",
    "name": "Browser window",
    "category": "Frames",
    "preview": "▤",
    "keywords": [
      "browser",
      "window"
    ]
  },
  {
    "id": "frame-phone",
    "name": "Phone frame",
    "category": "Frames",
    "preview": "▯",
    "keywords": [
      "phone",
      "frame"
    ]
  },
  {
    "id": "frame-film",
    "name": "Film strip",
    "category": "Frames",
    "preview": "▥",
    "keywords": [
      "film",
      "strip"
    ]
  },
  {
    "id": "frame-ticket",
    "name": "Ticket frame",
    "category": "Frames",
    "preview": "🎟",
    "keywords": [
      "ticket",
      "frame"
    ]
  },
  {
    "id": "frame-corners",
    "name": "Corner frame",
    "category": "Frames",
    "preview": "⌜⌟",
    "keywords": [
      "corner",
      "frame"
    ]
  },
  {
    "id": "frame-scallop",
    "name": "Scallop frame",
    "category": "Frames",
    "preview": "◌",
    "keywords": [
      "scallop",
      "frame"
    ]
  },
  {
    "id": "frame-grid2",
    "name": "2 photo grid",
    "category": "Frames",
    "preview": "▦",
    "keywords": [
      "2",
      "photo",
      "grid"
    ]
  },
  {
    "id": "frame-grid3",
    "name": "3 photo grid",
    "category": "Frames",
    "preview": "▥",
    "keywords": [
      "3",
      "photo",
      "grid"
    ]
  },
  {
    "id": "frame-grid4",
    "name": "4 photo grid",
    "category": "Frames",
    "preview": "▦",
    "keywords": [
      "4",
      "photo",
      "grid"
    ]
  },
  {
    "id": "frame-arch",
    "name": "Arch frame",
    "category": "Frames",
    "preview": "⌒",
    "keywords": [
      "arch",
      "frame"
    ]
  },
  {
    "id": "frame-instant",
    "name": "Instant photo",
    "category": "Frames",
    "preview": "▱",
    "keywords": [
      "instant",
      "photo"
    ]
  },
  {
    "id": "frame-story",
    "name": "Story frame",
    "category": "Frames",
    "preview": "▯",
    "keywords": [
      "story",
      "frame"
    ]
  },
  {
    "id": "icon-star",
    "name": "Star",
    "category": "Icons",
    "preview": "★",
    "keywords": [
      "star"
    ]
  },
  {
    "id": "icon-heart",
    "name": "Heart",
    "category": "Icons",
    "preview": "♥",
    "keywords": [
      "heart"
    ]
  },
  {
    "id": "icon-check",
    "name": "Check",
    "category": "Icons",
    "preview": "✓",
    "keywords": [
      "check"
    ]
  },
  {
    "id": "icon-plus",
    "name": "Plus",
    "category": "Icons",
    "preview": "+",
    "keywords": [
      "plus"
    ]
  },
  {
    "id": "icon-minus",
    "name": "Minus",
    "category": "Icons",
    "preview": "−",
    "keywords": [
      "minus"
    ]
  },
  {
    "id": "icon-bolt",
    "name": "Lightning",
    "category": "Icons",
    "preview": "⚡",
    "keywords": [
      "lightning"
    ]
  },
  {
    "id": "icon-home",
    "name": "Home",
    "category": "Icons",
    "preview": "⌂",
    "keywords": [
      "home"
    ]
  },
  {
    "id": "icon-search",
    "name": "Search",
    "category": "Icons",
    "preview": "⌕",
    "keywords": [
      "search"
    ]
  },
  {
    "id": "icon-menu",
    "name": "Menu",
    "category": "Icons",
    "preview": "☰",
    "keywords": [
      "menu"
    ]
  },
  {
    "id": "icon-user",
    "name": "User",
    "category": "Icons",
    "preview": "●",
    "keywords": [
      "user"
    ]
  },
  {
    "id": "icon-users",
    "name": "Users",
    "category": "Icons",
    "preview": "●●",
    "keywords": [
      "users"
    ]
  },
  {
    "id": "icon-camera",
    "name": "Camera",
    "category": "Icons",
    "preview": "▣",
    "keywords": [
      "camera"
    ]
  },
  {
    "id": "icon-image",
    "name": "Image",
    "category": "Icons",
    "preview": "▧",
    "keywords": [
      "image"
    ]
  },
  {
    "id": "icon-play",
    "name": "Play",
    "category": "Icons",
    "preview": "▶",
    "keywords": [
      "play"
    ]
  },
  {
    "id": "icon-pause",
    "name": "Pause",
    "category": "Icons",
    "preview": "Ⅱ",
    "keywords": [
      "pause"
    ]
  },
  {
    "id": "icon-volume",
    "name": "Volume",
    "category": "Icons",
    "preview": "◖",
    "keywords": [
      "volume"
    ]
  },
  {
    "id": "icon-mute",
    "name": "Mute",
    "category": "Icons",
    "preview": "⊘",
    "keywords": [
      "mute"
    ]
  },
  {
    "id": "icon-mail",
    "name": "Mail",
    "category": "Icons",
    "preview": "✉",
    "keywords": [
      "mail"
    ]
  },
  {
    "id": "icon-phone",
    "name": "Phone",
    "category": "Icons",
    "preview": "☎",
    "keywords": [
      "phone"
    ]
  },
  {
    "id": "icon-location",
    "name": "Location",
    "category": "Icons",
    "preview": "⌖",
    "keywords": [
      "location"
    ]
  },
  {
    "id": "icon-calendar",
    "name": "Calendar",
    "category": "Icons",
    "preview": "▦",
    "keywords": [
      "calendar"
    ]
  },
  {
    "id": "icon-clock",
    "name": "Clock",
    "category": "Icons",
    "preview": "◷",
    "keywords": [
      "clock"
    ]
  },
  {
    "id": "icon-link",
    "name": "Link",
    "category": "Icons",
    "preview": "🔗",
    "keywords": [
      "link"
    ]
  },
  {
    "id": "icon-globe",
    "name": "Globe",
    "category": "Icons",
    "preview": "◉",
    "keywords": [
      "globe"
    ]
  },
  {
    "id": "icon-lock",
    "name": "Lock",
    "category": "Icons",
    "preview": "▣",
    "keywords": [
      "lock"
    ]
  },
  {
    "id": "icon-unlock",
    "name": "Unlock",
    "category": "Icons",
    "preview": "▢",
    "keywords": [
      "unlock"
    ]
  },
  {
    "id": "icon-eye",
    "name": "Eye",
    "category": "Icons",
    "preview": "◉",
    "keywords": [
      "eye"
    ]
  },
  {
    "id": "icon-trash",
    "name": "Trash",
    "category": "Icons",
    "preview": "⌫",
    "keywords": [
      "trash"
    ]
  },
  {
    "id": "icon-edit",
    "name": "Edit",
    "category": "Icons",
    "preview": "✎",
    "keywords": [
      "edit"
    ]
  },
  {
    "id": "icon-settings",
    "name": "Settings",
    "category": "Icons",
    "preview": "⚙",
    "keywords": [
      "settings"
    ]
  },
  {
    "id": "icon-download",
    "name": "Download",
    "category": "Icons",
    "preview": "⇩",
    "keywords": [
      "download"
    ]
  },
  {
    "id": "icon-upload",
    "name": "Upload",
    "category": "Icons",
    "preview": "⇧",
    "keywords": [
      "upload"
    ]
  },
  {
    "id": "icon-share",
    "name": "Share",
    "category": "Icons",
    "preview": "↗",
    "keywords": [
      "share"
    ]
  },
  {
    "id": "icon-bookmark",
    "name": "Bookmark",
    "category": "Icons",
    "preview": "▮",
    "keywords": [
      "bookmark"
    ]
  },
  {
    "id": "icon-gift",
    "name": "Gift",
    "category": "Icons",
    "preview": "🎁",
    "keywords": [
      "gift"
    ]
  },
  {
    "id": "icon-cart",
    "name": "Cart",
    "category": "Icons",
    "preview": "🛒",
    "keywords": [
      "cart"
    ]
  },
  {
    "id": "icon-bag",
    "name": "Bag",
    "category": "Icons",
    "preview": "▢",
    "keywords": [
      "bag"
    ]
  },
  {
    "id": "icon-trophy",
    "name": "Trophy",
    "category": "Icons",
    "preview": "🏆",
    "keywords": [
      "trophy"
    ]
  },
  {
    "id": "icon-crown",
    "name": "Crown",
    "category": "Icons",
    "preview": "♛",
    "keywords": [
      "crown"
    ]
  },
  {
    "id": "icon-bell",
    "name": "Bell",
    "category": "Icons",
    "preview": "♢",
    "keywords": [
      "bell"
    ]
  },
  {
    "id": "icon-chat",
    "name": "Chat",
    "category": "Icons",
    "preview": "▱",
    "keywords": [
      "chat"
    ]
  },
  {
    "id": "icon-quote",
    "name": "Quote",
    "category": "Icons",
    "preview": "❝",
    "keywords": [
      "quote"
    ]
  },
  {
    "id": "icon-pin",
    "name": "Pin",
    "category": "Icons",
    "preview": "●",
    "keywords": [
      "pin"
    ]
  },
  {
    "id": "icon-flag",
    "name": "Flag",
    "category": "Icons",
    "preview": "⚑",
    "keywords": [
      "flag"
    ]
  },
  {
    "id": "icon-sparkle",
    "name": "Sparkle",
    "category": "Icons",
    "preview": "✦",
    "keywords": [
      "sparkle"
    ]
  },
  {
    "id": "icon-sun",
    "name": "Sun",
    "category": "Icons",
    "preview": "☀",
    "keywords": [
      "sun"
    ]
  },
  {
    "id": "icon-moon",
    "name": "Moon",
    "category": "Icons",
    "preview": "◐",
    "keywords": [
      "moon"
    ]
  },
  {
    "id": "icon-leaf",
    "name": "Leaf",
    "category": "Icons",
    "preview": "❧",
    "keywords": [
      "leaf"
    ]
  },
  {
    "id": "icon-flower",
    "name": "Flower",
    "category": "Icons",
    "preview": "✿",
    "keywords": [
      "flower"
    ]
  },
  {
    "id": "icon-music",
    "name": "Music",
    "category": "Icons",
    "preview": "♫",
    "keywords": [
      "music"
    ]
  },
  {
    "id": "icon-hashtag",
    "name": "Hashtag",
    "category": "Icons",
    "preview": "#",
    "keywords": [
      "hashtag"
    ]
  },
  {
    "id": "icon-at",
    "name": "At",
    "category": "Icons",
    "preview": "@",
    "keywords": [
      "at"
    ]
  },
  {
    "id": "sticker-sale",
    "name": "SALE",
    "category": "Stickers",
    "preview": "SALE",
    "keywords": [
      "sale"
    ]
  },
  {
    "id": "sticker-new",
    "name": "NEW",
    "category": "Stickers",
    "preview": "NEW",
    "keywords": [
      "new"
    ]
  },
  {
    "id": "sticker-hot",
    "name": "HOT",
    "category": "Stickers",
    "preview": "HOT",
    "keywords": [
      "hot"
    ]
  },
  {
    "id": "sticker-wow",
    "name": "WOW!",
    "category": "Stickers",
    "preview": "WOW",
    "keywords": [
      "wow!"
    ]
  },
  {
    "id": "sticker-free",
    "name": "FREE",
    "category": "Stickers",
    "preview": "FREE",
    "keywords": [
      "free"
    ]
  },
  {
    "id": "sticker-best",
    "name": "BEST",
    "category": "Stickers",
    "preview": "BEST",
    "keywords": [
      "best"
    ]
  },
  {
    "id": "sticker-limited",
    "name": "LIMITED",
    "category": "Stickers",
    "preview": "LIMIT",
    "keywords": [
      "limited"
    ]
  },
  {
    "id": "sticker-off50",
    "name": "50% OFF",
    "category": "Stickers",
    "preview": "50%",
    "keywords": [
      "50%",
      "off"
    ]
  },
  {
    "id": "sticker-verified",
    "name": "VERIFIED",
    "category": "Stickers",
    "preview": "✓",
    "keywords": [
      "verified"
    ]
  },
  {
    "id": "sticker-open",
    "name": "OPEN",
    "category": "Stickers",
    "preview": "OPEN",
    "keywords": [
      "open"
    ]
  },
  {
    "id": "sticker-closed",
    "name": "CLOSED",
    "category": "Stickers",
    "preview": "CLOSED",
    "keywords": [
      "closed"
    ]
  },
  {
    "id": "sticker-coming",
    "name": "COMING SOON",
    "category": "Stickers",
    "preview": "SOON",
    "keywords": [
      "coming",
      "soon"
    ]
  },
  {
    "id": "sticker-thankyou",
    "name": "THANK YOU",
    "category": "Stickers",
    "preview": "THANKS",
    "keywords": [
      "thank",
      "you"
    ]
  },
  {
    "id": "sticker-hello",
    "name": "HELLO!",
    "category": "Stickers",
    "preview": "HELLO",
    "keywords": [
      "hello!"
    ]
  },
  {
    "id": "sticker-love",
    "name": "LOVE",
    "category": "Stickers",
    "preview": "LOVE",
    "keywords": [
      "love"
    ]
  },
  {
    "id": "sticker-yes",
    "name": "YES!",
    "category": "Stickers",
    "preview": "YES",
    "keywords": [
      "yes!"
    ]
  },
  {
    "id": "sticker-no",
    "name": "NO",
    "category": "Stickers",
    "preview": "NO",
    "keywords": [
      "no"
    ]
  },
  {
    "id": "sticker-tap",
    "name": "TAP HERE",
    "category": "Stickers",
    "preview": "TAP",
    "keywords": [
      "tap",
      "here"
    ]
  },
  {
    "id": "sticker-swipe",
    "name": "SWIPE UP",
    "category": "Stickers",
    "preview": "↑",
    "keywords": [
      "swipe",
      "up"
    ]
  },
  {
    "id": "sticker-click",
    "name": "CLICK HERE",
    "category": "Stickers",
    "preview": "CLICK",
    "keywords": [
      "click",
      "here"
    ]
  },
  {
    "id": "sticker-subscribe",
    "name": "SUBSCRIBE",
    "category": "Stickers",
    "preview": "SUB",
    "keywords": [
      "subscribe"
    ]
  },
  {
    "id": "sticker-follow",
    "name": "FOLLOW",
    "category": "Stickers",
    "preview": "FOLLOW",
    "keywords": [
      "follow"
    ]
  },
  {
    "id": "sticker-save",
    "name": "SAVE THIS",
    "category": "Stickers",
    "preview": "SAVE",
    "keywords": [
      "save",
      "this"
    ]
  },
  {
    "id": "sticker-shop",
    "name": "SHOP NOW",
    "category": "Stickers",
    "preview": "SHOP",
    "keywords": [
      "shop",
      "now"
    ]
  },
  {
    "id": "graphic-sparkle1",
    "name": "Sparkle set",
    "category": "Graphics",
    "preview": "✦",
    "keywords": [
      "sparkle",
      "set"
    ]
  },
  {
    "id": "graphic-sparkle2",
    "name": "Mini sparkles",
    "category": "Graphics",
    "preview": "✧",
    "keywords": [
      "mini",
      "sparkles"
    ]
  },
  {
    "id": "graphic-confetti",
    "name": "Confetti",
    "category": "Graphics",
    "preview": "✣",
    "keywords": [
      "confetti"
    ]
  },
  {
    "id": "graphic-dots",
    "name": "Dot pattern",
    "category": "Graphics",
    "preview": "⠿",
    "keywords": [
      "dot",
      "pattern"
    ]
  },
  {
    "id": "graphic-checker",
    "name": "Checker pattern",
    "category": "Graphics",
    "preview": "▦",
    "keywords": [
      "checker",
      "pattern"
    ]
  },
  {
    "id": "graphic-crosses",
    "name": "Cross pattern",
    "category": "Graphics",
    "preview": "✚",
    "keywords": [
      "cross",
      "pattern"
    ]
  },
  {
    "id": "graphic-sunburst",
    "name": "Sunburst",
    "category": "Graphics",
    "preview": "☀",
    "keywords": [
      "sunburst"
    ]
  },
  {
    "id": "graphic-rainbow",
    "name": "Rainbow",
    "category": "Graphics",
    "preview": "◒",
    "keywords": [
      "rainbow"
    ]
  },
  {
    "id": "graphic-arch",
    "name": "Abstract arch",
    "category": "Graphics",
    "preview": "⌒",
    "keywords": [
      "abstract",
      "arch"
    ]
  },
  {
    "id": "graphic-squiggle",
    "name": "Squiggle",
    "category": "Graphics",
    "preview": "〰",
    "keywords": [
      "squiggle"
    ]
  },
  {
    "id": "graphic-circle-scribble",
    "name": "Circle scribble",
    "category": "Graphics",
    "preview": "◎",
    "keywords": [
      "circle",
      "scribble"
    ]
  },
  {
    "id": "graphic-underline",
    "name": "Hand underline",
    "category": "Graphics",
    "preview": "⌣",
    "keywords": [
      "hand",
      "underline"
    ]
  },
  {
    "id": "graphic-tape",
    "name": "Tape strip",
    "category": "Graphics",
    "preview": "▰",
    "keywords": [
      "tape",
      "strip"
    ]
  },
  {
    "id": "graphic-brush",
    "name": "Brush stroke",
    "category": "Graphics",
    "preview": "━",
    "keywords": [
      "brush",
      "stroke"
    ]
  },
  {
    "id": "graphic-blob-pair",
    "name": "Blob pair",
    "category": "Graphics",
    "preview": "●",
    "keywords": [
      "blob",
      "pair"
    ]
  },
  {
    "id": "graphic-organic-corner",
    "name": "Organic corner",
    "category": "Graphics",
    "preview": "◜",
    "keywords": [
      "organic",
      "corner"
    ]
  },
  {
    "id": "graphic-doodle-star",
    "name": "Doodle star",
    "category": "Graphics",
    "preview": "☆",
    "keywords": [
      "doodle",
      "star"
    ]
  },
  {
    "id": "graphic-doodle-heart",
    "name": "Doodle heart",
    "category": "Graphics",
    "preview": "♡",
    "keywords": [
      "doodle",
      "heart"
    ]
  },
  {
    "id": "graphic-doodle-arrow",
    "name": "Doodle arrow",
    "category": "Graphics",
    "preview": "↝",
    "keywords": [
      "doodle",
      "arrow"
    ]
  },
  {
    "id": "graphic-doodle-flower",
    "name": "Doodle flower",
    "category": "Graphics",
    "preview": "✿",
    "keywords": [
      "doodle",
      "flower"
    ]
  },
  {
    "id": "graphic-grid-dots",
    "name": "Dot grid",
    "category": "Graphics",
    "preview": "⠿",
    "keywords": [
      "dot",
      "grid"
    ]
  },
  {
    "id": "graphic-waves",
    "name": "Wave pattern",
    "category": "Graphics",
    "preview": "≋",
    "keywords": [
      "wave",
      "pattern"
    ]
  },
  {
    "id": "graphic-stripes",
    "name": "Stripe pattern",
    "category": "Graphics",
    "preview": "▤",
    "keywords": [
      "stripe",
      "pattern"
    ]
  },
  {
    "id": "graphic-halftone",
    "name": "Halftone",
    "category": "Graphics",
    "preview": "◌",
    "keywords": [
      "halftone"
    ]
  },
  {
    "id": "graphic-rays",
    "name": "Rays",
    "category": "Graphics",
    "preview": "✺",
    "keywords": [
      "rays"
    ]
  },
  {
    "id": "graphic-corner-lines",
    "name": "Corner lines",
    "category": "Graphics",
    "preview": "⌜",
    "keywords": [
      "corner",
      "lines"
    ]
  },
  {
    "id": "graphic-abstract-circles",
    "name": "Abstract circles",
    "category": "Graphics",
    "preview": "◉",
    "keywords": [
      "abstract",
      "circles"
    ]
  },
  {
    "id": "graphic-abstract-squares",
    "name": "Abstract squares",
    "category": "Graphics",
    "preview": "▦",
    "keywords": [
      "abstract",
      "squares"
    ]
  },
  {
    "id": "graphic-paper-tear",
    "name": "Paper tear",
    "category": "Graphics",
    "preview": "⌇",
    "keywords": [
      "paper",
      "tear"
    ]
  },
  {
    "id": "graphic-highlight",
    "name": "Highlight stroke",
    "category": "Graphics",
    "preview": "▬",
    "keywords": [
      "highlight",
      "stroke"
    ]
  },
  {
    "id": "chart-bars",
    "name": "Bar chart",
    "category": "Charts",
    "preview": "▥",
    "keywords": [
      "bar",
      "chart"
    ]
  },
  {
    "id": "chart-bars-horizontal",
    "name": "Horizontal bars",
    "category": "Charts",
    "preview": "☰",
    "keywords": [
      "horizontal",
      "bars"
    ]
  },
  {
    "id": "chart-donut",
    "name": "Donut chart",
    "category": "Charts",
    "preview": "◉",
    "keywords": [
      "donut",
      "chart"
    ]
  },
  {
    "id": "chart-pie",
    "name": "Pie chart",
    "category": "Charts",
    "preview": "◔",
    "keywords": [
      "pie",
      "chart"
    ]
  },
  {
    "id": "chart-progress",
    "name": "Progress ring",
    "category": "Charts",
    "preview": "◕",
    "keywords": [
      "progress",
      "ring"
    ]
  },
  {
    "id": "chart-steps3",
    "name": "3 steps",
    "category": "Charts",
    "preview": "①②③",
    "keywords": [
      "3",
      "steps"
    ]
  },
  {
    "id": "chart-steps4",
    "name": "4 steps",
    "category": "Charts",
    "preview": "1234",
    "keywords": [
      "4",
      "steps"
    ]
  },
  {
    "id": "chart-timeline",
    "name": "Timeline",
    "category": "Charts",
    "preview": "●━●",
    "keywords": [
      "timeline"
    ]
  },
  {
    "id": "chart-comparison",
    "name": "Comparison",
    "category": "Charts",
    "preview": "⇄",
    "keywords": [
      "comparison"
    ]
  },
  {
    "id": "chart-stats",
    "name": "Stats card",
    "category": "Charts",
    "preview": "99",
    "keywords": [
      "stats",
      "card"
    ]
  },
  {
    "id": "chart-quote-card",
    "name": "Quote card",
    "category": "Charts",
    "preview": "❝",
    "keywords": [
      "quote",
      "card"
    ]
  },
  {
    "id": "chart-rating",
    "name": "5 star rating",
    "category": "Charts",
    "preview": "★★★★★",
    "keywords": [
      "5",
      "star",
      "rating"
    ]
  },
  {
    "id": "chart-process",
    "name": "Process arrows",
    "category": "Charts",
    "preview": "➜➜",
    "keywords": [
      "process",
      "arrows"
    ]
  },
  {
    "id": "chart-funnel",
    "name": "Funnel",
    "category": "Charts",
    "preview": "▽",
    "keywords": [
      "funnel"
    ]
  },
  {
    "id": "chart-pyramid",
    "name": "Pyramid",
    "category": "Charts",
    "preview": "△",
    "keywords": [
      "pyramid"
    ]
  },
  {
    "id": "chart-matrix",
    "name": "2x2 matrix",
    "category": "Charts",
    "preview": "▦",
    "keywords": [
      "2x2",
      "matrix"
    ]
  },
  {
    "id": "social-instagram",
    "name": "Instagram",
    "category": "Social",
    "preview": "◎",
    "keywords": [
      "instagram"
    ]
  },
  {
    "id": "social-facebook",
    "name": "Facebook",
    "category": "Social",
    "preview": "f",
    "keywords": [
      "facebook"
    ]
  },
  {
    "id": "social-youtube",
    "name": "YouTube",
    "category": "Social",
    "preview": "▶",
    "keywords": [
      "youtube"
    ]
  },
  {
    "id": "social-linkedin",
    "name": "LinkedIn",
    "category": "Social",
    "preview": "in",
    "keywords": [
      "linkedin"
    ]
  },
  {
    "id": "social-x",
    "name": "X / Twitter",
    "category": "Social",
    "preview": "X",
    "keywords": [
      "x",
      "/",
      "twitter"
    ]
  },
  {
    "id": "social-pinterest",
    "name": "Pinterest",
    "category": "Social",
    "preview": "P",
    "keywords": [
      "pinterest"
    ]
  },
  {
    "id": "social-whatsapp",
    "name": "WhatsApp",
    "category": "Social",
    "preview": "☎",
    "keywords": [
      "whatsapp"
    ]
  },
  {
    "id": "social-telegram",
    "name": "Telegram",
    "category": "Social",
    "preview": "➤",
    "keywords": [
      "telegram"
    ]
  },
  {
    "id": "social-tiktok",
    "name": "TikTok",
    "category": "Social",
    "preview": "♪",
    "keywords": [
      "tiktok"
    ]
  },
  {
    "id": "social-mail",
    "name": "Email",
    "category": "Social",
    "preview": "✉",
    "keywords": [
      "email"
    ]
  },
  {
    "id": "social-web",
    "name": "Website",
    "category": "Social",
    "preview": "www",
    "keywords": [
      "website"
    ]
  },
  {
    "id": "social-link",
    "name": "Link",
    "category": "Social",
    "preview": "↗",
    "keywords": [
      "link"
    ]
  },
  {
    "id": "social-qr",
    "name": "QR placeholder",
    "category": "Social",
    "preview": "▦",
    "keywords": [
      "qr",
      "placeholder"
    ]
  },
  {
    "id": "social-hashtag",
    "name": "Hashtag",
    "category": "Social",
    "preview": "#",
    "keywords": [
      "hashtag"
    ]
  },
  {
    "id": "social-at",
    "name": "At mention",
    "category": "Social",
    "preview": "@",
    "keywords": [
      "at",
      "mention"
    ]
  },
  {
    "id": "social-share",
    "name": "Share",
    "category": "Social",
    "preview": "↗",
    "keywords": [
      "share"
    ]
  },
  {
    "id": "social-like",
    "name": "Like",
    "category": "Social",
    "preview": "♥",
    "keywords": [
      "like"
    ]
  },
  {
    "id": "social-comment",
    "name": "Comment",
    "category": "Social",
    "preview": "▱",
    "keywords": [
      "comment"
    ]
  }
];

const BLACK = "#111111";
const WHITE = "#ffffff";
const SOFT = "#eceff3";

function path(d: string, fill = BLACK, stroke = "transparent", strokeWidth = 0) {
  return new Path(d, { fill, stroke, strokeWidth });
}

function text(value: string, size = 72, fill = BLACK, weight: "normal" | "bold" = "bold") {
  return new Textbox(value, {
    text: value,
    width: Math.max(120, value.length * size * 0.75),
    fontSize: size,
    fontFamily: "Arial",
    fontWeight: weight,
    fill,
    textAlign: "center",
    editable: true,
    lineHeight: 1,
  });
}

function polygonPoints(sides: number, radius = 100, rotation = -Math.PI / 2) {
  return Array.from({ length: sides }, (_, index) => {
    const angle = rotation + (Math.PI * 2 * index) / sides;
    return { x: radius + Math.cos(angle) * radius, y: radius + Math.sin(angle) * radius };
  });
}

function starPoints(points = 5, outer = 100, inner = 45) {
  const total = points * 2;
  return Array.from({ length: total }, (_, index) => {
    const radius = index % 2 === 0 ? outer : inner;
    const angle = -Math.PI / 2 + (Math.PI * 2 * index) / total;
    return { x: outer + Math.cos(angle) * radius, y: outer + Math.sin(angle) * radius };
  });
}

function makeShape(id: string): FabricObject {
  switch (id) {
    case "shape-rect": return new Rect({ width: 260, height: 170, fill: BLACK });
    case "shape-rounded-rect": return new Rect({ width: 280, height: 170, rx: 38, ry: 38, fill: BLACK });
    case "shape-square": return new Rect({ width: 210, height: 210, fill: BLACK });
    case "shape-circle": return new Circle({ radius: 105, fill: BLACK });
    case "shape-ellipse": return new Ellipse({ rx: 145, ry: 90, fill: BLACK });
    case "shape-triangle": return new Polygon(polygonPoints(3), { fill: BLACK });
    case "shape-triangle-down": return new Polygon(polygonPoints(3, 100, Math.PI / 2), { fill: BLACK });
    case "shape-right-triangle": return new Polygon([{x:0,y:0},{x:220,y:220},{x:0,y:220}], { fill: BLACK });
    case "shape-diamond": return new Polygon([{x:110,y:0},{x:220,y:110},{x:110,y:220},{x:0,y:110}], { fill: BLACK });
    case "shape-pentagon": return new Polygon(polygonPoints(5), { fill: BLACK });
    case "shape-hexagon": return new Polygon(polygonPoints(6), { fill: BLACK });
    case "shape-octagon": return new Polygon(polygonPoints(8), { fill: BLACK });
    case "shape-star5": return new Polygon(starPoints(5), { fill: BLACK });
    case "shape-star8": return new Polygon(starPoints(8, 100, 62), { fill: BLACK });
    case "shape-burst12": return new Polygon(starPoints(12, 110, 70), { fill: BLACK });
    case "shape-heart": return path("M 100 180 C 55 145 10 105 10 58 C 10 18 60 2 100 42 C 140 2 190 18 190 58 C 190 105 145 145 100 180 Z");
    case "shape-cloud": return path("M 45 150 C 15 150 0 128 7 104 C 14 82 33 70 54 73 C 66 37 103 20 137 34 C 158 43 171 61 174 83 C 202 81 224 102 224 126 C 224 150 204 168 177 168 L 45 168 Z");
    case "shape-ring": return new Circle({ radius: 110, fill: "transparent", stroke: BLACK, strokeWidth: 28 });
    case "shape-pill": return new Rect({ width: 300, height: 110, rx: 55, ry: 55, fill: BLACK });
    case "shape-arch": return path("M 10 200 L 10 110 C 10 45 60 5 120 5 C 180 5 230 45 230 110 L 230 200 L 175 200 L 175 112 C 175 80 151 58 120 58 C 89 58 65 80 65 112 L 65 200 Z");
    case "shape-semi-circle": return path("M 0 100 A 100 100 0 0 1 200 100 L 200 100 L 0 100 Z");
    case "shape-speech": return new Group([new Rect({width:260,height:150,rx:32,ry:32,fill:BLACK}), new Polygon([{x:50,y:145},{x:98,y:145},{x:62,y:205}],{fill:BLACK})]);
    case "shape-tag": return new Group([new Polygon([{x:0,y:40},{x:50,y:0},{x:230,y:0},{x:230,y:100},{x:50,y:100},{x:0,y:60}],{fill:BLACK}), new Circle({left:32,top:38,radius:10,fill:WHITE})]);
    case "shape-banner": return new Group([new Rect({left:30,top:0,width:240,height:90,fill:BLACK}),new Polygon([{x:0,y:15},{x:30,y:0},{x:30,y:90},{x:0,y:75},{x:16,y:45}],{fill:BLACK}),new Polygon([{x:300,y:15},{x:270,y:0},{x:270,y:90},{x:300,y:75},{x:284,y:45}],{fill:BLACK})]);
    case "shape-chevron": return path("M 0 30 L 30 0 L 120 90 L 30 180 L 0 150 L 60 90 Z");
    case "shape-bracket": return path("M 100 0 L 25 0 L 25 70 L 0 70 L 0 25 C 0 10 10 0 25 0 Z M 25 160 L 25 230 L 100 230 L 100 255 L 25 255 C 10 255 0 245 0 230 L 0 160 Z");
    case "shape-blob1": return path("M 111 9 C 165 3 218 26 226 70 C 235 118 197 166 150 189 C 100 214 44 205 18 164 C -7 124 7 67 43 34 C 63 15 85 11 111 9 Z");
    case "shape-blob2": return path("M 39 19 C 82 -8 149 4 184 32 C 222 62 230 113 201 153 C 167 201 104 215 56 186 C 17 163 -5 117 5 75 C 12 48 22 30 39 19 Z");
    case "shape-blob3": return path("M 21 64 C 42 15 102 -6 153 8 C 199 20 227 63 220 109 C 214 150 178 193 132 207 C 81 222 26 195 8 152 C -5 121 4 89 21 64 Z");
    case "shape-blob4": return path("M 82 3 C 125 -6 181 8 208 42 C 234 74 230 122 203 156 C 176 192 124 214 79 201 C 34 188 2 147 4 104 C 6 60 39 13 82 3 Z");
    case "shape-outline-square": return new Rect({ width: 220, height: 220, fill: "transparent", stroke: BLACK, strokeWidth: 16 });
    case "shape-outline-circle": return new Circle({ radius: 105, fill: "transparent", stroke: BLACK, strokeWidth: 16 });
    case "shape-capsule-outline": return new Rect({ width: 300, height: 110, rx: 55, ry: 55, fill: "transparent", stroke: BLACK, strokeWidth: 14 });
    case "shape-corner-frame": return path("M 0 95 L 0 0 L 95 0 M 145 0 L 240 0 L 240 95 M 240 145 L 240 240 L 145 240 M 95 240 L 0 240 L 0 145", "transparent", BLACK, 14);
    default: return new Rect({ width: 220, height: 150, fill: BLACK });
  }
}

function arrowGroup(direction: "right"|"left"|"up"|"down"|"both") {
  const parts: FabricObject[] = [];
  if (direction === "right" || direction === "left" || direction === "both") {
    parts.push(new Line([20,80,250,80],{stroke:BLACK,strokeWidth:12,strokeLineCap:"round"}));
    if (direction === "right" || direction === "both") parts.push(new Polygon([{x:250,y:45},{x:300,y:80},{x:250,y:115}],{fill:BLACK}));
    if (direction === "left" || direction === "both") parts.push(new Polygon([{x:50,y:45},{x:0,y:80},{x:50,y:115}],{fill:BLACK}));
  } else {
    parts.push(new Line([80,20,80,250],{stroke:BLACK,strokeWidth:12,strokeLineCap:"round"}));
    if (direction === "up") parts.push(new Polygon([{x:45,y:50},{x:80,y:0},{x:115,y:50}],{fill:BLACK}));
    if (direction === "down") parts.push(new Polygon([{x:45,y:250},{x:80,y:300},{x:115,y:250}],{fill:BLACK}));
  }
  return new Group(parts);
}

function makeLine(id: string): FabricObject {
  switch(id) {
    case "line-thin": return new Line([0,0,420,0],{stroke:BLACK,strokeWidth:3,strokeLineCap:"round"});
    case "line-medium": return new Line([0,0,420,0],{stroke:BLACK,strokeWidth:8,strokeLineCap:"round"});
    case "line-thick": return new Line([0,0,420,0],{stroke:BLACK,strokeWidth:18,strokeLineCap:"round"});
    case "line-dashed": return new Line([0,0,420,0],{stroke:BLACK,strokeWidth:7,strokeDashArray:[28,18],strokeLineCap:"round"});
    case "line-dotted": return new Line([0,0,420,0],{stroke:BLACK,strokeWidth:8,strokeDashArray:[2,22],strokeLineCap:"round"});
    case "line-double": return new Group([new Line([0,0,420,0],{stroke:BLACK,strokeWidth:5}),new Line([0,22,420,22],{stroke:BLACK,strokeWidth:5})]);
    case "line-arrow-right": return arrowGroup("right"); case "line-arrow-left": return arrowGroup("left"); case "line-arrow-up": return arrowGroup("up"); case "line-arrow-down": return arrowGroup("down"); case "line-arrow-both": return arrowGroup("both");
    case "line-curved-right": return path("M 10 120 C 80 10 210 10 280 100 M 240 70 L 285 100 L 245 140", "transparent", BLACK, 10);
    case "line-curved-left": return path("M 280 120 C 210 10 80 10 10 100 M 50 70 L 5 100 L 45 140", "transparent", BLACK, 10);
    case "line-bent": return path("M 10 10 L 10 120 Q 10 160 50 160 L 270 160 M 230 125 L 275 160 L 230 195", "transparent", BLACK, 10);
    case "line-wave": return path("M 0 50 C 45 0 85 100 130 50 C 175 0 215 100 260 50 C 305 0 345 100 390 50", "transparent", BLACK, 10);
    case "line-zigzag": return path("M 0 80 L 55 20 L 110 80 L 165 20 L 220 80 L 275 20 L 330 80 L 385 20", "transparent", BLACK, 9);
    case "line-scribble": return path("M 0 55 C 30 10 70 95 110 45 C 145 0 175 100 220 48 C 260 8 295 92 340 42 C 365 18 385 40 410 48", "transparent", BLACK, 7);
    case "line-dot-divider": return new Group([0,1,2,3,4,5,6].map(i=>new Circle({left:i*50,top:0,radius:8,fill:BLACK})));
    case "line-star-divider": return new Group([0,1,2,3,4].map(i=>{const s=new Polygon(starPoints(5,18,8),{left:i*65,top:0,fill:BLACK});return s;}));
    case "line-circle-ends": return new Group([new Circle({left:0,top:0,radius:14,fill:BLACK}),new Line([28,14,390,14],{stroke:BLACK,strokeWidth:7}),new Circle({left:390,top:0,radius:14,fill:BLACK})]);
    case "line-diamond-ends": return new Group([new Polygon([{x:0,y:15},{x:15,y:0},{x:30,y:15},{x:15,y:30}],{fill:BLACK}),new Line([30,15,390,15],{stroke:BLACK,strokeWidth:7}),new Polygon([{x:390,y:15},{x:405,y:0},{x:420,y:15},{x:405,y:30}],{fill:BLACK})]);
    case "line-arrow-line": return new Group([new Line([0,40,350,40],{stroke:BLACK,strokeWidth:8}),new Polygon([{x:350,y:0},{x:420,y:40},{x:350,y:80}],{fill:BLACK})]);
    case "line-underline": return path("M 0 30 C 95 5 190 55 285 25 C 330 10 365 18 410 35", "transparent", BLACK, 10);
    case "line-vertical": return new Line([0,0,0,420],{stroke:BLACK,strokeWidth:7,strokeLineCap:"round"});
    case "line-vertical-dashed": return new Line([0,0,0,420],{stroke:BLACK,strokeWidth:7,strokeDashArray:[26,18],strokeLineCap:"round"});
    default: return new Line([0,0,420,0],{stroke:BLACK,strokeWidth:8});
  }
}

function makeFrame(id: string): FabricObject {
  const border=(w:number,h:number,r=0)=>new Rect({width:w,height:h,rx:r,ry:r,fill:"transparent",stroke:BLACK,strokeWidth:12});
  switch(id){
    case "frame-square": return border(240,240); case "frame-rounded": return border(260,220,32); case "frame-circle": return new Circle({radius:120,fill:"transparent",stroke:BLACK,strokeWidth:12}); case "frame-ellipse": return new Ellipse({rx:150,ry:100,fill:"transparent",stroke:BLACK,strokeWidth:12});
    case "frame-double": return new Group([border(270,220,18),new Rect({left:20,top:20,width:230,height:180,rx:10,ry:10,fill:"transparent",stroke:BLACK,strokeWidth:5})]);
    case "frame-polaroid": return new Group([new Rect({width:260,height:320,fill:WHITE,stroke:BLACK,strokeWidth:7}),new Rect({left:20,top:20,width:220,height:220,fill:SOFT,stroke:BLACK,strokeWidth:3})]);
    case "frame-portrait": return new Group([border(210,310,26),new Rect({left:20,top:20,width:170,height:230,fill:SOFT,rx:18,ry:18})]);
    case "frame-landscape": return new Group([border(330,220,26),new Rect({left:20,top:20,width:290,height:160,fill:SOFT,rx:18,ry:18})]);
    case "frame-browser": return new Group([border(360,240,18),new Line([0,48,360,48],{stroke:BLACK,strokeWidth:7}),new Circle({left:18,top:17,radius:7,fill:BLACK}),new Circle({left:42,top:17,radius:7,fill:BLACK}),new Circle({left:66,top:17,radius:7,fill:BLACK})]);
    case "frame-phone": return new Group([border(180,340,35),new Rect({left:65,top:18,width:50,height:8,rx:4,ry:4,fill:BLACK})]);
    case "frame-film": return new Group([border(370,220,10),...Array.from({length:7},(_,i)=>new Rect({left:15+i*52,top:10,width:24,height:18,fill:BLACK})),...Array.from({length:7},(_,i)=>new Rect({left:15+i*52,top:192,width:24,height:18,fill:BLACK}))]);
    case "frame-ticket": return new Group([new Rect({width:340,height:180,rx:22,ry:22,fill:"transparent",stroke:BLACK,strokeWidth:10}),new Line([240,15,240,165],{stroke:BLACK,strokeWidth:5,strokeDashArray:[10,10]})]);
    case "frame-corners": return path("M 90 0 L 0 0 L 0 90 M 230 0 L 320 0 L 320 90 M 320 210 L 320 300 L 230 300 M 90 300 L 0 300 L 0 210","transparent",BLACK,12);
    case "frame-scallop": return new Circle({radius:125,fill:"transparent",stroke:BLACK,strokeWidth:12,strokeDashArray:[10,8]});
    case "frame-grid2": return new Group([border(330,220,18),new Line([165,0,165,220],{stroke:BLACK,strokeWidth:8})]);
    case "frame-grid3": return new Group([border(330,220,18),new Line([165,0,165,220],{stroke:BLACK,strokeWidth:8}),new Line([165,110,330,110],{stroke:BLACK,strokeWidth:8})]);
    case "frame-grid4": return new Group([border(330,240,18),new Line([165,0,165,240],{stroke:BLACK,strokeWidth:8}),new Line([0,120,330,120],{stroke:BLACK,strokeWidth:8})]);
    case "frame-arch": return new Group([path("M 0 300 L 0 130 C 0 55 58 0 130 0 C 202 0 260 55 260 130 L 260 300","transparent",BLACK,12),new Line([0,300,260,300],{stroke:BLACK,strokeWidth:12})]);
    case "frame-instant": return new Group([new Rect({width:290,height:350,fill:WHITE,stroke:BLACK,strokeWidth:7}),new Rect({left:18,top:18,width:254,height:245,fill:SOFT})]);
    case "frame-story": return new Group([border(190,340,28),new Circle({left:76,top:18,radius:18,fill:SOFT,stroke:BLACK,strokeWidth:4})]);
    default:return border(260,220,24);
  }
}

const PATH_ICONS: Record<string,string> = {
  star:"M 50 0 L 61 35 L 98 35 L 68 57 L 79 91 L 50 70 L 21 91 L 32 57 L 2 35 L 39 35 Z",
  heart:"M 50 88 C 20 65 0 45 0 25 C 0 5 25 -5 50 15 C 75 -5 100 5 100 25 C 100 45 80 65 50 88 Z",
  check:"M 5 50 L 35 80 L 95 15 L 80 0 L 35 55 L 20 35 Z",
  plus:"M 40 0 L 60 0 L 60 40 L 100 40 L 100 60 L 60 60 L 60 100 L 40 100 L 40 60 L 0 60 L 0 40 L 40 40 Z",
  minus:"M 0 40 L 100 40 L 100 60 L 0 60 Z",
  bolt:"M 55 0 L 15 55 L 45 55 L 30 100 L 85 40 L 55 40 Z",
  play:"M 10 0 L 95 50 L 10 100 Z",
  pause:"M 15 0 L 40 0 L 40 100 L 15 100 Z M 60 0 L 85 0 L 85 100 L 60 100 Z",
  download:"M 40 0 L 60 0 L 60 55 L 82 33 L 96 47 L 50 94 L 4 47 L 18 33 L 40 55 Z M 0 105 L 100 105 L 100 125 L 0 125 Z",
  upload:"M 40 95 L 60 95 L 60 40 L 82 62 L 96 48 L 50 2 L 4 48 L 18 62 L 40 40 Z M 0 105 L 100 105 L 100 125 L 0 125 Z",
  bookmark:"M 10 0 L 90 0 L 90 110 L 50 85 L 10 110 Z",
  flag:"M 10 0 L 25 0 L 25 110 L 10 110 Z M 25 5 L 95 20 L 70 50 L 95 80 L 25 65 Z",
  leaf:"M 5 95 C 15 20 70 0 100 0 C 100 55 70 100 5 95 Z M 10 90 C 35 65 55 42 90 10",
};

const ICON_GLYPHS: Record<string,string> = {
  home:"⌂",search:"⌕",menu:"☰",user:"●",users:"●●",camera:"▣",image:"▧",volume:"◖",mute:"⊘",mail:"✉",phone:"☎",location:"⌖",calendar:"▦",clock:"◷",link:"↗",globe:"◉",lock:"▣",unlock:"▢",eye:"◉",trash:"⌫",edit:"✎",settings:"⚙",share:"↗",gift:"◆",cart:"▱",bag:"▢",trophy:"★",crown:"♛",bell:"♢",chat:"▱",quote:"❝",pin:"●",sparkle:"✦",sun:"☀",moon:"◐",flower:"✿",music:"♫",hashtag:"#",at:"@"
};

function makeIcon(id:string):FabricObject{
  const name=id.replace("icon-","");
  if(PATH_ICONS[name]) {
    if(name==="leaf") return path(PATH_ICONS[name],"transparent",BLACK,7);
    return path(PATH_ICONS[name],BLACK);
  }
  return text(ICON_GLYPHS[name] || "✦",110,BLACK,"bold");
}

function makeSticker(id:string):FabricObject{
  const labels:Record<string,string>={sale:"SALE",new:"NEW",hot:"HOT",wow:"WOW!",free:"FREE",best:"BEST",limited:"LIMITED",off50:"50% OFF",verified:"✓ VERIFIED",open:"OPEN",closed:"CLOSED",coming:"COMING SOON",thankyou:"THANK YOU",hello:"HELLO!",love:"LOVE",yes:"YES!",no:"NO",tap:"TAP HERE",swipe:"SWIPE UP ↑",click:"CLICK HERE",subscribe:"SUBSCRIBE",follow:"FOLLOW",save:"SAVE THIS",shop:"SHOP NOW"};
  const key=id.replace("sticker-",""); const label=labels[key]||"STICKER";
  const width=Math.max(220,label.length*30+70);
  const variants=["sale","hot","off50","wow"];
  if(variants.includes(key)) return new Group([new Polygon(starPoints(12,115,82),{fill:BLACK}),new Textbox(label,{left:20,top:85,width:190,fontSize:36,fontFamily:"Arial",fontWeight:"bold",fill:WHITE,textAlign:"center",editable:true})]);
  return new Group([new Rect({width,height:100,rx:50,ry:50,fill:BLACK}),new Textbox(label,{left:25,top:28,width:width-50,fontSize:34,fontFamily:"Arial",fontWeight:"bold",fill:WHITE,textAlign:"center",editable:true})]);
}

function makeGraphic(id:string):FabricObject{
  const key=id.replace("graphic-","");
  switch(key){
    case "sparkle1": return new Group([[0,0],[95,30],[40,105],[150,115]].map(([x,y],i)=>{const s=new Polygon(starPoints(i%2?4:5,22,8),{left:x,top:y,fill:BLACK});return s;}));
    case "sparkle2": return new Group(Array.from({length:8},(_,i)=>new Polygon(starPoints(4,12+(i%3)*4,4),{left:(i%4)*55,top:Math.floor(i/4)*70+(i%2)*10,fill:BLACK})));
    case "confetti": return new Group(Array.from({length:18},(_,i)=> i%3===0? new Circle({left:(i%6)*45,top:Math.floor(i/6)*55,radius:7,fill:BLACK}):new Rect({left:(i%6)*45,top:Math.floor(i/6)*55,width:10,height:28,angle:(i*31)%140,fill:BLACK})));
    case "dots": case "grid-dots": return new Group(Array.from({length:36},(_,i)=>new Circle({left:(i%6)*38,top:Math.floor(i/6)*38,radius:5,fill:BLACK})));
    case "checker": return new Group(Array.from({length:36},(_,i)=>new Rect({left:(i%6)*36,top:Math.floor(i/6)*36,width:36,height:36,fill:(i+Math.floor(i/6))%2?BLACK:"transparent",stroke:BLACK,strokeWidth:1})));
    case "crosses": return new Group(Array.from({length:16},(_,i)=>text("+",28,BLACK,"bold").set({left:(i%4)*55,top:Math.floor(i/4)*55}) as any));
    case "sunburst": case "rays": return new Group(Array.from({length:24},(_,i)=>new Rect({left:115,top:115,width:7,height:105,fill:BLACK,originX:"center",originY:"bottom",angle:i*15})));
    case "rainbow": return new Group([new Path("M 0 120 A 120 120 0 0 1 240 120",{fill:"transparent",stroke:BLACK,strokeWidth:22}),new Path("M 35 120 A 85 85 0 0 1 205 120",{fill:"transparent",stroke:BLACK,strokeWidth:14}),new Path("M 67 120 A 53 53 0 0 1 173 120",{fill:"transparent",stroke:BLACK,strokeWidth:10})]);
    case "arch": return makeShape("shape-arch");
    case "squiggle": return makeLine("line-wave");
    case "circle-scribble": return new Group([new Circle({radius:100,fill:"transparent",stroke:BLACK,strokeWidth:7}),new Ellipse({left:8,top:10,rx:103,ry:94,angle:10,fill:"transparent",stroke:BLACK,strokeWidth:4})]);
    case "underline": return makeLine("line-underline");
    case "tape": return new Rect({width:300,height:75,fill:BLACK,opacity:.75,angle:-4});
    case "brush": return path("M 0 35 C 70 0 160 18 235 8 C 300 0 360 18 420 5 L 420 75 C 335 58 250 83 160 67 C 95 55 45 77 0 66 Z");
    case "blob-pair": return new Group([makeShape("shape-blob1").set({scaleX:.7,scaleY:.7}) as any,makeShape("shape-blob3").set({left:135,top:65,scaleX:.6,scaleY:.6,opacity:.55}) as any]);
    case "organic-corner": return path("M 0 0 L 240 0 C 200 25 180 65 150 95 C 115 130 62 145 0 135 Z");
    case "doodle-star": return new Polygon(starPoints(5,100,45),{fill:"transparent",stroke:BLACK,strokeWidth:8});
    case "doodle-heart": return path("M 50 88 C 20 65 0 45 0 25 C 0 5 25 -5 50 15 C 75 -5 100 5 100 25 C 100 45 80 65 50 88 Z","transparent",BLACK,7);
    case "doodle-arrow": return path("M 0 70 C 60 20 135 110 220 50 M 180 18 L 225 50 L 190 88","transparent",BLACK,8);
    case "doodle-flower": return text("✿",160,BLACK,"normal");
    case "waves": return new Group([0,1,2,3].map(i=>makeLine("line-wave").set({top:i*45,scaleX:.7,scaleY:.7}) as any));
    case "stripes": return new Group(Array.from({length:9},(_,i)=>new Rect({left:i*32,top:0,width:15,height:220,fill:BLACK,angle:-12})));
    case "halftone": return new Group(Array.from({length:49},(_,i)=>{const x=i%7,y=Math.floor(i/7);return new Circle({left:x*32,top:y*32,radius:2+(x+y)*.8,fill:BLACK})}));
    case "corner-lines": return makeShape("shape-corner-frame");
    case "abstract-circles": return new Group([new Circle({radius:90,fill:BLACK}),new Circle({left:120,top:40,radius:55,fill:"transparent",stroke:BLACK,strokeWidth:12}),new Circle({left:70,top:135,radius:34,fill:BLACK,opacity:.45})]);
    case "abstract-squares": return new Group([new Rect({width:140,height:140,fill:BLACK}),new Rect({left:100,top:80,width:110,height:110,fill:"transparent",stroke:BLACK,strokeWidth:10}),new Rect({left:35,top:175,width:70,height:70,fill:BLACK,opacity:.45})]);
    case "paper-tear": return path("M 0 0 L 420 0 L 420 50 L 395 40 L 370 58 L 345 43 L 320 60 L 295 44 L 270 61 L 245 45 L 220 60 L 195 44 L 170 61 L 145 43 L 120 58 L 95 42 L 70 58 L 45 41 L 20 55 L 0 48 Z");
    case "highlight": return new Rect({width:420,height:70,rx:25,ry:25,fill:BLACK,opacity:.25,angle:-2});
    default:return makeShape("shape-blob1");
  }
}

function makeChart(id:string):FabricObject{
 const key=id.replace("chart-","");
 switch(key){
  case "bars": return new Group([80,150,210,125,185].map((h,i)=>new Rect({left:i*52,top:230-h,width:34,height:h,rx:6,ry:6,fill:BLACK})));
  case "bars-horizontal": return new Group([220,160,270,125].map((w,i)=>new Rect({left:0,top:i*55,width:w,height:28,rx:8,ry:8,fill:BLACK})));
  case "donut": return new Circle({radius:115,fill:"transparent",stroke:BLACK,strokeWidth:40,strokeDashArray:[420,160]});
  case "pie": return path("M 110 110 L 110 0 A 110 110 0 1 1 32 188 Z");
  case "progress": return new Group([new Circle({radius:110,fill:"transparent",stroke:SOFT,strokeWidth:24}),new Circle({radius:110,fill:"transparent",stroke:BLACK,strokeWidth:24,strokeDashArray:[470,220],angle:-90})]);
  case "steps3": return new Group([0,1,2].map(i=>new Group([new Circle({left:i*125,top:0,radius:38,fill:BLACK}),new Textbox(String(i+1),{left:i*125,top:18,width:76,fontSize:30,fontFamily:"Arial",fontWeight:"bold",fill:WHITE,textAlign:"center",editable:true}),...(i<2?[new Line([i*125+76,38,(i+1)*125,38],{stroke:BLACK,strokeWidth:6})]:[])])));
  case "steps4": return new Group([0,1,2,3].map(i=>new Group([new Rect({left:i*105,top:0,width:78,height:78,rx:18,ry:18,fill:BLACK}),new Textbox(String(i+1),{left:i*105,top:19,width:78,fontSize:30,fontFamily:"Arial",fontWeight:"bold",fill:WHITE,textAlign:"center",editable:true})])));
  case "timeline": return new Group([new Line([30,30,380,30],{stroke:BLACK,strokeWidth:6}),...Array.from({length:4},(_,i)=>new Circle({left:20+i*115,top:18,radius:12,fill:BLACK}))]);
  case "comparison": return new Group([new Rect({width:170,height:210,rx:18,ry:18,fill:SOFT,stroke:BLACK,strokeWidth:5}),new Rect({left:205,width:170,height:210,rx:18,ry:18,fill:SOFT,stroke:BLACK,strokeWidth:5}),text("VS",42,BLACK,"bold").set({left:155,top:78,width:65}) as any]);
  case "stats": return new Group([new Rect({width:300,height:180,rx:26,ry:26,fill:SOFT}),new Textbox("99%",{left:30,top:28,width:240,fontSize:70,fontFamily:"Arial",fontWeight:"bold",fill:BLACK,textAlign:"center",editable:true}),new Textbox("GROWTH",{left:30,top:115,width:240,fontSize:24,fontFamily:"Arial",fontWeight:"bold",fill:BLACK,textAlign:"center",editable:true})]);
  case "quote-card": return new Group([new Rect({width:330,height:220,rx:28,ry:28,fill:SOFT}),new Textbox("❝",{left:25,top:10,width:80,fontSize:80,fill:BLACK,fontFamily:"Georgia",editable:true}),new Textbox("YOUR QUOTE HERE",{left:55,top:92,width:230,fontSize:28,fontFamily:"Arial",fontWeight:"bold",fill:BLACK,textAlign:"center",editable:true})]);
  case "rating": return new Group([0,1,2,3,4].map(i=>new Polygon(starPoints(5,28,13),{left:i*65,top:0,fill:BLACK})));
  case "process": return new Group([0,1,2].map(i=>new Group([new Rect({left:i*140,top:0,width:100,height:70,rx:18,ry:18,fill:BLACK}),...(i<2?[new Polygon([{x:i*140+112,y:20},{x:i*140+140,y:35},{x:i*140+112,y:50}],{fill:BLACK})]:[])])));
  case "funnel": return new Group([new Polygon([{x:0,y:0},{x:300,y:0},{x:240,y:60},{x:60,y:60}],{fill:BLACK}),new Polygon([{x:70,y:80},{x:230,y:80},{x:195,y:135},{x:105,y:135}],{fill:BLACK,opacity:.75}),new Polygon([{x:115,y:155},{x:185,y:155},{x:165,y:210},{x:135,y:210}],{fill:BLACK,opacity:.5})]);
  case "pyramid": return new Group([new Polygon([{x:150,y:0},{x:240,y:70},{x:60,y:70}],{fill:BLACK}),new Polygon([{x:55,y:85},{x:245,y:85},{x:300,y:155},{x:0,y:155}],{fill:BLACK,opacity:.72}),new Polygon([{x:0,y:175},{x:300,y:175},{x:350,y:245},{x:-50,y:245}],{fill:BLACK,opacity:.45})]);
  case "matrix": return new Group([new Rect({width:260,height:260,fill:"transparent",stroke:BLACK,strokeWidth:7}),new Line([130,0,130,260],{stroke:BLACK,strokeWidth:7}),new Line([0,130,260,130],{stroke:BLACK,strokeWidth:7})]);
  default:return new Rect({width:300,height:180,fill:SOFT,stroke:BLACK,strokeWidth:6});
 }
}

function socialBadge(label:string, sub?:string):FabricObject{
 return new Group([new Rect({width:150,height:150,rx:38,ry:38,fill:BLACK}),new Textbox(label,{left:15,top:36,width:120,fontSize:label.length>3?36:56,fontFamily:"Arial",fontWeight:"bold",fill:WHITE,textAlign:"center",editable:true}),...(sub?[new Textbox(sub,{left:15,top:105,width:120,fontSize:16,fontFamily:"Arial",fontWeight:"bold",fill:WHITE,textAlign:"center",editable:true})]:[])]);
}
function makeSocial(id:string):FabricObject{
 const key=id.replace("social-","");
 const map:Record<string,[string,string?]>={instagram:["◎","IG"],facebook:["f"],youtube:["▶","YT"],linkedin:["in"],x:["X"],pinterest:["P"],whatsapp:["☎","WA"],telegram:["➤","TG"],tiktok:["♪","TT"],mail:["✉"],web:["www"],link:["↗"],qr:["▦","QR"],hashtag:["#"],at:["@"],share:["↗"],like:["♥"],comment:["▱"]};
 const [label,sub]=map[key]||["◎"];
 return socialBadge(label,sub);
}

function createElement(id:string):FabricObject{
 if(id.startsWith("shape-")) return makeShape(id);
 if(id.startsWith("line-")) return makeLine(id);
 if(id.startsWith("frame-")) return makeFrame(id);
 if(id.startsWith("icon-")) return makeIcon(id);
 if(id.startsWith("sticker-")) return makeSticker(id);
 if(id.startsWith("graphic-")) return makeGraphic(id);
 if(id.startsWith("chart-")) return makeChart(id);
 if(id.startsWith("social-")) return makeSocial(id);
 return makeShape("shape-rect");
}

function centerAndFit(canvas:Canvas, object:FabricObject, id:string){
 object.set({ originX:"left", originY:"top" });
 object.setCoords();
 const maxWide = id.startsWith("line-") ? .55 : id.startsWith("frame-") ? .42 : .34;
 const maxTall = id.startsWith("frame-") ? .42 : .34;
 const bounds=object.getBoundingRect();
 const targetW=canvas.getWidth()*maxWide;
 const targetH=canvas.getHeight()*maxTall;
 const scale=Math.min(1,targetW/Math.max(1,bounds.width),targetH/Math.max(1,bounds.height));
 object.set({scaleX:(object.scaleX||1)*scale,scaleY:(object.scaleY||1)*scale});
 object.setCoords();
 const b=object.getBoundingRect();
 object.set({left:(canvas.getWidth()-b.width)/2,top:(canvas.getHeight()-b.height)/2});
 object.setCoords();
}

export function insertElement(canvas:Canvas,id:string){
 const object=createElement(id);
 centerAndFit(canvas,object,id);
 (object as any).elementLibraryId=id;
 if(String(object.type).toLowerCase()==="group") {
   (object as any).fill=BLACK;
   (object as any).stroke=BLACK;
 }
 canvas.add(object);
 canvas.setActiveObject(object);
 canvas.requestRenderAll();
 return object;
}
