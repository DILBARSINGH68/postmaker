import type { FabricObject } from "fabric";

export type Format = {
  name: string;
  width: number;
  height: number;
};

export type TemplateScope = "all" | "format";

export type DesignPage = {
  id: string;
  design: string;
  background: string;
  width?: number;
  height?: number;
  hidden?: boolean;
};

export type SavedProject = {
  id: string;
  name: string;
  format: Format;
  background: string;
  design: string;
  pages?: DesignPage[];
  activePageIndex?: number;
  updatedAt: number;
};

export type EditorPanel =
  | "templates"
  | "festival"
  | "elements"
  | "mockups"
  | "brand"
  | "resume"
  | "frames"
  | "frameEdit"
  | "text"
  | "uploads"
  | "background"
  | "layers"
  | "imageEdit"
  | "textEffects"
  | null;

export type ImagePreset =
  | "none"
  | "grayscale"
  | "sepia"
  | "invert";

export type SelectedSnapshot = {
  type: string;
  text?: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string | number;
  fontStyle?: string;
  underline?: boolean;
  linethrough?: boolean;
  textAlign?: string;
  charSpacing?: number;
  lineHeight?: number;
  fill?: any;
  stroke?: any;
  strokeWidth?: number;
  opacity?: number;
  rx?: number;
  ry?: number;
  cornerRadius?: number;
  selectable?: boolean;
  visible?: boolean;
  flipX?: boolean;
  flipY?: boolean;
  left?: number;
  top?: number;
  angle?: number;
  scaleX?: number;
  scaleY?: number;
  cropX?: number;
  cropY?: number;
  imageBrightness?: number;
  imageContrast?: number;
  imageSaturation?: number;
  imageBlur?: number;
  imagePreset?: ImagePreset;
  isMockup?: boolean;
  mockupId?: string;
  mockupName?: string;
  mockupFit?: "fill" | "fit";
  mockupZoom?: number;
  mockupPanX?: number;
  mockupPanY?: number;
  mockupSurfaceColor?: string;
  mockupShadow?: number;
  mockupHasImage?: boolean;
  isSmartFrame?: boolean;
  smartFrameId?: string;
  smartFrameName?: string;
  smartFrameFit?: "fill" | "fit";
  smartFrameZoom?: number;
  smartFramePanX?: number;
  smartFramePanY?: number;
  smartFrameBorderColor?: string;
  smartFrameBorderWidth?: number;
  smartFrameHasImage?: boolean;
  hasOriginalImage?: boolean;
  width?: number;
  height?: number;
  selectionCount?: number;
  isMultiSelection?: boolean;
  isGroup?: boolean;
};
