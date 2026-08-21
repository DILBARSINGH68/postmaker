"use client";

import { useEffect, useRef, useState } from "react";
import {
  ActiveSelection,
  BaseFabricObject,
  Canvas,
  Group,
  Circle,
  FabricImage,
  Line,
  Path,
  Rect,
  Textbox,
  filters,
  FabricObject,
} from "fabric";

// Fabric 7 changed object origins to center/center by default.
// Kriyavo's editor and template coordinates are authored from the
// top-left corner, so keep one coordinate convention everywhere.
BaseFabricObject.ownDefaults.originX = "left";
BaseFabricObject.ownDefaults.originY = "top";

const fabricCustomProperties = [
  "isMockup",
  "mockupId",
  "mockupName",
  "mockupFit",
  "mockupZoom",
  "mockupPanX",
  "mockupPanY",
  "mockupSurfaceColor",
  "mockupShadow",
  "mockupRole",
  "isBrandLogo",
  "isSmartFrame",
  "smartFrameId",
  "smartFrameName",
  "smartFrameFit",
  "smartFrameZoom",
  "smartFramePanX",
  "smartFramePanY",
  "smartFrameBorderColor",
  "smartFrameBorderWidth",
  "smartFrameRole",
];

FabricObject.customProperties = Array.from(
  new Set([
    ...(FabricObject.customProperties || []),
    ...fabricCustomProperties,
  ])
);

import { useAuth } from "@/components/auth/AuthProvider";
import EditorHeader from "@/components/editor/EditorHeader";
import LeftRail from "@/components/editor/LeftRail";
import SidePanel from "@/components/editor/SidePanel";
import ContextToolbar from "@/components/editor/ContextToolbar";
import PositionPanel from "@/components/editor/PositionPanel";
import CanvasArea, { type SnapGuides } from "@/components/editor/CanvasArea";
import ProjectsModal from "@/components/editor/ProjectsModal";
import MobileToolbar from "@/components/editor/MobileToolbar";
import RightClickMenu from "@/components/editor/RightClickMenu";
import ResizePanel from "@/components/editor/ResizePanel";
import DownloadPanel, { type DownloadType } from "@/components/editor/DownloadPanel";
import DesktopPageBar from "@/components/editor/DesktopPageBar";

import { FORMATS } from "@/lib/editor/formats";
import {
  DEFAULT_BRAND_KIT,
  loadBrandKit,
  saveBrandKit,
  type BrandKit,
  type BrandLogo,
} from "@/lib/editor/brandKit";
import { getEditorCanvasSize } from "@/lib/editor/canvasSize";
import { smartReflowCanvas } from "@/lib/editor/smartResize";
import {
  createSmartFrameGroup,
  getSmartFrameImageSource,
  isSmartFrameObject,
  rebuildSmartFrame,
  type SmartFrameFit,
} from "@/lib/editor/smartFrames";
import {
  DEFAULT_RESUME_DATA,
  buildResumeFromData,
  loadResumeData,
  saveResumeData,
  type ResumeData,
  type ResumeTheme,
} from "@/lib/editor/resumeBuilder";
import { insertElement } from "@/lib/editor/elements";
import {
  createMockupGroup,
  getMockupImageSource,
  isMockupObject,
  rebuildMockup,
  type MockupFit,
} from "@/lib/editor/mockups";
import { applyTemplate, getTemplateFormat, type TemplateType } from "@/lib/editor/templates";
import {
  loadAutosave,
  loadProjects,
  saveAutosave,
  saveProjects,
} from "@/lib/editor/storage";
import {
  deleteCloudProject,
  getCurrentCloudDesignId,
  listCloudProjects,
  mergeProjectLists,
  resetCurrentCloudDesignId,
  saveCloudProject,
  setCurrentCloudDesignId,
} from "@/lib/editor/cloudStorage";

import type {
  DesignPage,
  EditorPanel,
  Format,
  SavedProject,
  SelectedSnapshot,
  TemplateScope,
} from "@/types/editor";

type CropSession = {
  object: FabricImage;
  original: {
    left: number;
    top: number;
    width: number;
    height: number;
    cropX: number;
    cropY: number;
    scaleX: number;
    scaleY: number;
    angle: number;
    lockScalingX: boolean;
    lockScalingY: boolean;
    lockRotation: boolean;
  };
  fixedLeft: number;
  fixedTop: number;
  startCropX: number;
  startCropY: number;
  sourceWidth: number;
  sourceHeight: number;
};

const normalizeBrandColor = (value: unknown) => {
  if (typeof value !== "string") return null;

  const color = value.trim().toLowerCase();

  if (!color || color === "transparent" || color === "none") {
    return null;
  }

  if (color === "white") return "#ffffff";
  if (color === "black") return "#000000";

  if (/^#[0-9a-f]{3}$/.test(color)) {
    return `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`;
  }

  if (/^#[0-9a-f]{6}$/.test(color)) {
    return color;
  }

  const rgb = color.match(
    /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/
  );

  if (rgb) {
    const toHex = (number: number) =>
      Math.max(0, Math.min(255, number))
        .toString(16)
        .padStart(2, "0");

    return `#${toHex(Number(rgb[1]))}${toHex(Number(rgb[2]))}${toHex(Number(rgb[3]))}`;
  }

  return null;
};

const brandColorLuminance = (value: unknown) => {
  const color = normalizeBrandColor(value);
  if (!color) return null;

  const channels = [1, 3, 5].map((index) => {
    const channel = parseInt(color.slice(index, index + 2), 16) / 255;
    return channel <= 0.03928
      ? channel / 12.92
      : Math.pow((channel + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
};

const isBrandNearWhite = (value: unknown) => {
  const luminance = brandColorLuminance(value);
  return luminance !== null && luminance > 0.86;
};

const isBrandNearBlack = (value: unknown) => {
  const luminance = brandColorLuminance(value);
  return luminance !== null && luminance < 0.08;
};

export default function EditorPage() {
  const { user } = useAuth();
  const canvasElementRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<Canvas | null>(null);

  const historyRef = useRef<string[]>([]);
  const historyIndexRef = useRef(-1);
  const restoringRef = useRef(false);
  const clipboardRef = useRef<FabricObject | null>(null);
  const styleClipboardRef = useRef<Record<string, any> | null>(null);
  const cropSessionRef = useRef<CropSession | null>(null);
  const rightClickTargetRef = useRef<FabricObject | null>(null);
  const pagesRef = useRef<DesignPage[]>([]);
  const activePageIndexRef = useRef(0);
  const textEditingRef = useRef(false);
  const textEditAnchorRef = useRef(new WeakMap<object, { x: number; y: number }>());

  const [cropMode, setCropMode] = useState(false);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const [format, setFormat] = useState<Format>(FORMATS[0]);
  const [background, setBackground] = useState("#ffffff");
  const [selected, setSelected] = useState<SelectedSnapshot | null>(null);
  const [objects, setObjects] = useState<FabricObject[]>([]);
  const [zoom, setZoom] = useState(57);
  const [saved, setSaved] = useState(false);
  const [projectName, setProjectName] = useState("Untitled Design");
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [showProjects, setShowProjects] = useState(false);
  const [showResize, setShowResize] = useState(false);
  const [showDownload, setShowDownload] = useState(false);
  const [showPosition, setShowPosition] = useState(false);
  const [pages, setPages] = useState<DesignPage[]>([]);
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [showPageManager, setShowPageManager] = useState(false);
  const [snapGuides, setSnapGuides] = useState<SnapGuides>({
    vertical: [],
    horizontal: [],
  });
  const [templateScope, setTemplateScope] = useState<TemplateScope>("all");
  const [activePanel, setActivePanel] = useState<EditorPanel>("templates");
  const [brandKit, setBrandKit] = useState<BrandKit>(DEFAULT_BRAND_KIT);
  const [resumeData, setResumeData] =
    useState<ResumeData>(
      DEFAULT_RESUME_DATA
    );
  const [resumeTheme, setResumeTheme] =
    useState<ResumeTheme>(
      "modern"
    );

  const [historyState, setHistoryState] = useState({
    undo: false,
    redo: false,
  });
  const [designRevision, setDesignRevision] = useState(0);
  const [editorReady, setEditorReady] = useState(false);

  const canvas = () => fabricRef.current;
  const refreshCloudProjects = async () => {
    const localProjects = loadProjects();

    if (!user) {
      setProjects(localProjects);
      return;
    }

    const cloudProjects = await listCloudProjects(user.id);
    setProjects(mergeProjectLists(localProjects, cloudProjects));
  };

  useEffect(() => {
    let cancelled = false;

    const refresh = async () => {
      const localProjects = loadProjects();
      if (!user) {
        if (!cancelled) setProjects(localProjects);
        return;
      }

      const cloudProjects = await listCloudProjects(user.id);
      if (!cancelled) {
        setProjects(mergeProjectLists(localProjects, cloudProjects));
      }
    };

    void refresh();

    return () => {
      cancelled = true;
    };
  }, [user?.id, showProjects]);

  const makePageId = () =>
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `page-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  const commitPages = (nextPages: DesignPage[]) => {
    pagesRef.current = nextPages;
    setPages(nextPages);
  };

  const commitActivePageIndex = (index: number) => {
    activePageIndexRef.current = index;
    setActivePageIndex(index);
  };

  const captureCanvasPage = (
    c: Canvas,
    existing?: DesignPage
  ): DesignPage => ({
    id: existing?.id || makePageId(),
    design: JSON.stringify(c.toJSON()),
    background:
      typeof c.backgroundColor === "string"
        ? c.backgroundColor
        : existing?.background || "#ffffff",
    width: c.getWidth(),
    height: c.getHeight(),
    hidden: existing?.hidden ?? false,
  });

  const createBlankDesignPage = (c: Canvas): DesignPage => {
    const base = c.toJSON() as Record<string, any>;
    const blank: Record<string, any> = {
      ...base,
      objects: [],
      background: "#ffffff",
    };

    delete blank.backgroundImage;
    delete blank.overlayImage;
    delete blank.clipPath;

    return {
      id: makePageId(),
      design: JSON.stringify(blank),
      background: "#ffffff",
      width: c.getWidth(),
      height: c.getHeight(),
      hidden: false,
    };
  };

  const snapshotAllPages = (c: Canvas) => {
    const currentIndex = Math.max(0, activePageIndexRef.current);
    const currentPages = pagesRef.current.length
      ? [...pagesRef.current]
      : [captureCanvasPage(c)];

    while (currentPages.length <= currentIndex) {
      currentPages.push(captureCanvasPage(c));
    }

    currentPages[currentIndex] = captureCanvasPage(
      c,
      currentPages[currentIndex]
    );

    return currentPages;
  };

  const resetPageHistory = (c: Canvas) => {
    historyRef.current = [JSON.stringify(c.toJSON())];
    historyIndexRef.current = 0;
    updateHistoryButtons();
  };

  const initializeSinglePage = (c: Canvas) => {
    const firstPage = captureCanvasPage(c, pagesRef.current[0]);
    commitPages([firstPage]);
    commitActivePageIndex(0);
    setShowPageManager(false);
  };

  useEffect(() => {
    setBrandKit(loadBrandKit());
    setResumeData(loadResumeData());
  }, []);

  const updateBrandKit = (nextBrandKit: BrandKit) => {
    setBrandKit(nextBrandKit);

    try {
      saveBrandKit(nextBrandKit);
    } catch {
      window.alert(
        "Brand Kit save nahi ho saka. Logo file chhoti karke dobara try karo."
      );
    }
  };

  const updateResumeData = (
    nextData: ResumeData
  ) => {
    setResumeData(
      nextData
    );

    try {
      saveResumeData(
        nextData
      );
    } catch {
      // Local resume data is optional; editor can continue without persistence.
    }
  };

  const resetResumeData = () => {
    updateResumeData({
      ...DEFAULT_RESUME_DATA,
    });
  };

  const normalizeLoadedObjectOrigins = (c: Canvas) => {
    c.getObjects().forEach((obj) => {
      const topLeft = obj.getPositionByOrigin(
        "left",
        "top"
      );

      obj.set({
        originX: "left",
        originY: "top",
        left: topLeft.x,
        top: topLeft.y,
      });

      obj.setCoords();
    });

    c.calcOffset();
    c.requestRenderAll();
  };

  const syncCanvasDimensions = (
    c: Canvas,
    width: number,
    height: number
  ) => {
    c.setViewportTransform(
      [1, 0, 0, 1, 0, 0]
    );

    c.setDimensions(
      {
        width,
        height,
      },
      {
        cssOnly: false,
        backstoreOnly: false,
      } as any
    );

    c.calcOffset();
    c.requestRenderAll();
  };

  const syncCanvasToFormat = (
    c: Canvas,
    nextFormat: Format
  ) => {
    const size =
      getEditorCanvasSize(
        nextFormat
      );

    syncCanvasDimensions(
      c,
      size.width,
      size.height
    );

    return size;
  };

  const loadDesignPage = async (
    index: number,
    sourcePages?: DesignPage[],
    targetFormat: Format = format
  ) => {
    const c = canvas();
    if (!c) return;

    const pageList = sourcePages || snapshotAllPages(c);
    if (!pageList.length) return;

    const safeIndex = Math.min(Math.max(0, index), pageList.length - 1);
    const targetPage = pageList[safeIndex];
    const targetSize = getEditorCanvasSize(targetFormat);
    const sourceWidth = Math.max(1, Number(targetPage.width || targetSize.width));
    const sourceHeight = Math.max(1, Number(targetPage.height || targetSize.height));

    restoringRef.current = true;
    setContextMenu(null);
    setSnapGuides({ vertical: [], horizontal: [] });
    c.discardActiveObject();

    syncCanvasDimensions(c, sourceWidth, sourceHeight);

    try {
      await c.loadFromJSON(JSON.parse(targetPage.design));
      normalizeLoadedObjectOrigins(c);
      c.backgroundColor = targetPage.background || "#ffffff";

      if (
        sourceWidth !== targetSize.width ||
        sourceHeight !== targetSize.height
      ) {
        smartReflowCanvas(c, targetSize.width, targetSize.height);
        syncCanvasDimensions(c, targetSize.width, targetSize.height);
      }

      c.requestRenderAll();

      const normalizedPages = [...pageList];
      normalizedPages[safeIndex] = captureCanvasPage(c, targetPage);
      commitPages(normalizedPages);
      commitActivePageIndex(safeIndex);
      setBackground(normalizedPages[safeIndex].background);
      setSelected(null);
      refreshObjects();
      resetPageHistory(c);
      setSaved(false);
    } finally {
      restoringRef.current = false;
    }
  };

  const selectDesignPage = (index: number) => {
    const c = canvas();
    if (!c || index === activePageIndexRef.current) return;

    const nextPages = snapshotAllPages(c);
    commitPages(nextPages);
    void loadDesignPage(index, nextPages);
  };

  const addDesignPageAfter = (pageIndex: number) => {
    const c = canvas();
    if (!c) return;

    const nextPages = snapshotAllPages(c);
    const safeIndex = Math.min(Math.max(0, pageIndex), nextPages.length - 1);
    const insertIndex = Math.min(safeIndex + 1, nextPages.length);
    const newPage = createBlankDesignPage(c);

    nextPages.splice(insertIndex, 0, newPage);
    commitPages(nextPages);
    setSaved(false);
    void loadDesignPage(insertIndex, nextPages);
  };

  const addDesignPage = () => {
    addDesignPageAfter(activePageIndexRef.current);
  };

  const duplicateDesignPageAt = (pageIndex: number) => {
    const c = canvas();
    if (!c) return;

    const nextPages = snapshotAllPages(c);
    const safeIndex = Math.min(Math.max(0, pageIndex), nextPages.length - 1);
    const current = nextPages[safeIndex];
    const duplicate: DesignPage = {
      ...current,
      id: makePageId(),
      hidden: false,
    };

    nextPages.splice(safeIndex + 1, 0, duplicate);
    commitPages(nextPages);
    setSaved(false);
    void loadDesignPage(safeIndex + 1, nextPages);
  };

  const duplicateDesignPage = () => {
    duplicateDesignPageAt(activePageIndexRef.current);
  };

  const deleteDesignPageAt = (pageIndex: number) => {
    const c = canvas();
    if (!c) return;

    const nextPages = snapshotAllPages(c);

    if (nextPages.length <= 1) {
      window.alert("Design me kam se kam 1 page rehna chahiye.");
      return;
    }

    const safeIndex = Math.min(Math.max(0, pageIndex), nextPages.length - 1);

    if (!window.confirm(`Delete page ${safeIndex + 1}?`)) return;

    const currentActive = Math.min(
      activePageIndexRef.current,
      nextPages.length - 1
    );

    nextPages.splice(safeIndex, 1);
    commitPages(nextPages);
    setSaved(false);

    if (safeIndex === currentActive) {
      const nextIndex = Math.min(safeIndex, nextPages.length - 1);
      void loadDesignPage(nextIndex, nextPages);
      return;
    }

    if (safeIndex < currentActive) {
      commitActivePageIndex(Math.max(0, currentActive - 1));
    }
  };

  const deleteDesignPage = () => {
    deleteDesignPageAt(activePageIndexRef.current);
  };

  const toggleDesignPageHidden = (pageIndex: number) => {
    const c = canvas();
    if (!c) return;

    const nextPages = snapshotAllPages(c);
    const safeIndex = Math.min(Math.max(0, pageIndex), nextPages.length - 1);

    nextPages[safeIndex] = {
      ...nextPages[safeIndex],
      hidden: !nextPages[safeIndex].hidden,
    };

    commitPages(nextPages);
    setSaved(false);
  };

  const snapshotObject = (obj: any): SelectedSnapshot | null => {
    if (!obj) return null;

    const bounds =
      typeof obj.getBoundingRect === "function"
        ? obj.getBoundingRect()
        : {
            left: obj.left ?? 0,
            top: obj.top ?? 0,
            width: (obj.width ?? 0) * Math.abs(obj.scaleX ?? 1),
            height: (obj.height ?? 0) * Math.abs(obj.scaleY ?? 1),
          };

    const normalizedType = String(
      obj.type || obj.constructor?.name || ""
    ).toLowerCase();

    const isMultiSelection =
      normalizedType === "activeselection" ||
      normalizedType === "active-selection";

    const selectionCount =
      typeof obj.getObjects === "function"
        ? obj.getObjects().length
        : 1;

    return {
      type: String(obj.type || obj.constructor?.name || "").toLowerCase(),
      text: obj.text ?? "",
      fontFamily: obj.fontFamily ?? "Arial",
      fontSize: obj.fontSize ?? 40,
      fontWeight: obj.fontWeight ?? "normal",
      fontStyle: obj.fontStyle ?? "normal",
      underline: obj.underline ?? false,
      textAlign: obj.textAlign ?? "left",
      charSpacing: obj.charSpacing ?? 0,
      lineHeight: obj.lineHeight ?? 1.16,
      fill: obj.fill ?? "#111111",
      stroke: obj.stroke ?? "#111111",
      strokeWidth: obj.strokeWidth ?? 0,
      opacity: obj.opacity ?? 1,
      rx: obj.rx ?? 0,
      ry: obj.ry ?? 0,
      selectable: obj.selectable,
      visible: obj.visible,
      flipX: obj.flipX ?? false,
      flipY: obj.flipY ?? false,
      left: bounds.left ?? 0,
      top: bounds.top ?? 0,
      width: bounds.width ?? 0,
      height: bounds.height ?? 0,
      angle: obj.angle ?? 0,
      selectionCount,
      isMultiSelection,
      isGroup: normalizedType === "group",
      scaleX: obj.scaleX ?? 1,
      scaleY: obj.scaleY ?? 1,
      cropX: obj.cropX ?? 0,
      cropY: obj.cropY ?? 0,
      imageBrightness:
        obj.filters?.find(
          (f: any) =>
            String(
              f.type ||
                f.constructor?.name ||
                ""
            ).toLowerCase() ===
            "brightness"
        )?.brightness ?? 0,
      imageContrast:
        obj.filters?.find(
          (f: any) =>
            String(
              f.type ||
                f.constructor?.name ||
                ""
            ).toLowerCase() ===
            "contrast"
        )?.contrast ?? 0,
      imageSaturation:
        obj.filters?.find(
          (f: any) =>
            String(
              f.type ||
                f.constructor?.name ||
                ""
            ).toLowerCase() ===
            "saturation"
        )?.saturation ?? 0,
      imageBlur:
        obj.filters?.find(
          (f: any) =>
            String(
              f.type ||
                f.constructor?.name ||
                ""
            ).toLowerCase() ===
            "blur"
        )?.blur ?? 0,
      isMockup: Boolean(obj.isMockup),
      mockupId: obj.mockupId ?? "",
      mockupName: obj.mockupName ?? "",
      mockupFit: obj.mockupFit === "fit" ? "fit" : "fill",
      mockupZoom: Number(obj.mockupZoom ?? 1),
      mockupPanX: Number(obj.mockupPanX ?? 0),
      mockupPanY: Number(obj.mockupPanY ?? 0),
      mockupSurfaceColor: obj.mockupSurfaceColor || "#f8fafc",
      mockupShadow: Number(obj.mockupShadow ?? 0.28),
      mockupHasImage: Boolean(getMockupImageSource(obj)),
      isSmartFrame: Boolean(obj.isSmartFrame),
      smartFrameId: obj.smartFrameId ?? "",
      smartFrameName: obj.smartFrameName ?? "",
      smartFrameFit: obj.smartFrameFit === "fit" ? "fit" : "fill",
      smartFrameZoom: Number(obj.smartFrameZoom ?? 1),
      smartFramePanX: Number(obj.smartFramePanX ?? 0),
      smartFramePanY: Number(obj.smartFramePanY ?? 0),
      smartFrameBorderColor: obj.smartFrameBorderColor || "#ffffff",
      smartFrameBorderWidth: Number(obj.smartFrameBorderWidth ?? 6),
      smartFrameHasImage: Boolean(getSmartFrameImageSource(obj)),
      hasOriginalImage: Boolean(obj.originalImageSrc),
      imagePreset:
        obj.filters?.some(
          (f: any) =>
            String(
              f.type ||
                f.constructor?.name ||
                ""
            ).toLowerCase() ===
            "grayscale"
        )
          ? "grayscale"
          : obj.filters?.some(
              (f: any) =>
                String(
                  f.type ||
                    f.constructor?.name ||
                    ""
                ).toLowerCase() ===
                "sepia"
            )
          ? "sepia"
          : obj.filters?.some(
              (f: any) =>
                String(
                  f.type ||
                    f.constructor?.name ||
                    ""
                ).toLowerCase() ===
                "invert"
            )
          ? "invert"
          : "none",
    };
  };

  const refreshObjects = () => {
    const c = canvas();
    if (!c) return;
    setObjects([...c.getObjects()]);
  };

  const updateHistoryButtons = () => {
    setHistoryState({
      undo: historyIndexRef.current > 0,
      redo: historyIndexRef.current < historyRef.current.length - 1,
    });
  };

  const saveHistory = () => {
    const c = canvas();
    if (!c || restoringRef.current) return;

    const json = JSON.stringify(c.toJSON());
    const current = historyRef.current[historyIndexRef.current];

    if (current === json) return;

    const next = historyRef.current.slice(0, historyIndexRef.current + 1);
    next.push(json);

    // Image data URLs can make each history entry large. Keep a practical
    // undo window so image editing does not balloon browser memory.
    const trimmed = next.slice(-30);

    historyRef.current = trimmed;
    historyIndexRef.current = trimmed.length - 1;

    updateHistoryButtons();
    refreshObjects();
    setSaved(false);
    setDesignRevision((revision) => revision + 1);
  };

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const c = canvas();
      if (!c) return;
      c.calcOffset();
      c.requestRenderAll();
    });

    return () => window.cancelAnimationFrame(frame);
  }, [activePageIndex, zoom, pages.length]);

  useEffect(() => {
    const c = canvas();
    if (!c || !editorReady || restoringRef.current || textEditingRef.current) return;

    const timer = window.setTimeout(() => {
      const design = JSON.stringify(c.toJSON());
      const pageSnapshot = snapshotAllPages(c);

      void saveAutosave(
        design,
        format,
        background,
        pageSnapshot,
        activePageIndexRef.current
      ).then((didSave) => {
        setSaved(didSave);
      });
    }, 650);

    return () => window.clearTimeout(timer);
  }, [designRevision, editorReady, background, format, projectName, activePageIndex, pages]);

  useEffect(() => {
    const c = canvas();
    if (!c || !user || !editorReady || restoringRef.current || textEditingRef.current) return;

    const timer = window.setTimeout(() => {
      const pageSnapshot = snapshotAllPages(c);
      const currentIndex = Math.min(
        Math.max(0, activePageIndexRef.current),
        Math.max(0, pageSnapshot.length - 1)
      );
      const activePage = pageSnapshot[currentIndex] || captureCanvasPage(c);
      const cloudId = getCurrentCloudDesignId(user.id);

      const project: SavedProject = {
        id: cloudId,
        name: projectName.trim() || "Untitled Design",
        format,
        background: activePage.background,
        design: activePage.design,
        pages: pageSnapshot,
        activePageIndex: currentIndex,
        updatedAt: Date.now(),
      };

      void saveCloudProject(user.id, project);
    }, 2500);

    return () => window.clearTimeout(timer);
  }, [user?.id, designRevision, editorReady, background, format, projectName, activePageIndex, pages]);

  useEffect(() => {
    const canvasElement = canvasElementRef.current;

    if (!canvasElement) return;

    if (fabricRef.current) {
      return;
    }

    const c = new Canvas(canvasElement, {
      width: 1080,
      height: 1080,
      backgroundColor: "#ffffff",
      enableRetinaScaling: false,
      preserveObjectStacking: true,
      fireRightClick: true,
      stopContextMenu: true,
    } as any);

    fabricRef.current = c;

    historyRef.current = [JSON.stringify(c.toJSON())];
    historyIndexRef.current = 0;
    updateHistoryButtons();

    const updateSelection = () => {
      const obj = c.getActiveObject();
      setSelected(snapshotObject(obj));
      if (typeof window !== "undefined" && window.innerWidth < 768) {
        setActivePanel(null);
      }
    };

    const clearSelection = () => {
      setSelected(null);
    };

    const isEditableText = (target: any) =>
      ["textbox", "text", "i-text", "itext"].includes(
        String(target?.type || target?.constructor?.name || "").toLowerCase()
      );

    const stabilizeTextTopLeft = (target: any, anchor?: { x: number; y: number }) => {
      if (!target || !isEditableText(target)) return;

      const topLeft = anchor || target.getPositionByOrigin("left", "top");
      target.set({ originX: "left", originY: "top" });
      target.setPositionByOrigin(topLeft, "left", "top");
      target.setCoords();
    };

    const rememberTextAnchor = (opt: any) => {
      const target = opt?.target;
      if (!target || !isEditableText(target) || target.isEditing) return;
      const topLeft = target.getPositionByOrigin("left", "top");
      textEditAnchorRef.current.set(target, { x: topLeft.x, y: topLeft.y });
    };

    const textEditingEntered = (opt: any) => {
      const target = opt?.target || c.getActiveObject();
      if (!target || !isEditableText(target)) return;

      const currentTopLeft = target.getPositionByOrigin("left", "top");
      const topLeft = textEditAnchorRef.current.get(target) || {
        x: currentTopLeft.x,
        y: currentTopLeft.y,
      };
      textEditAnchorRef.current.set(target, topLeft);
      stabilizeTextTopLeft(target, topLeft);
      textEditingRef.current = true;
      setSelected(snapshotObject(target));
      c.requestRenderAll();
    };

    const textChanged = (opt: any) => {
      const target = opt?.target || c.getActiveObject();
      if (!target || !isEditableText(target)) return;

      const anchor = textEditAnchorRef.current.get(target);
      if (anchor) stabilizeTextTopLeft(target, anchor);
      setSelected(snapshotObject(target));
      c.requestRenderAll();
    };

    const textEditingExited = (opt: any) => {
      const target = opt?.target || c.getActiveObject();
      if (target && isEditableText(target)) {
        const anchor = textEditAnchorRef.current.get(target);
        if (anchor) stabilizeTextTopLeft(target, anchor);
        textEditAnchorRef.current.delete(target);
        setSelected(snapshotObject(target));
      }

      textEditingRef.current = false;
      if (!cropSessionRef.current) {
        saveHistory();
        setDesignRevision((revision) => revision + 1);
      }
      c.requestRenderAll();
    };

    const modified = (opt?: any) => {
      const target = opt?.target || c.getActiveObject();
      const active = c.getActiveObject();

      if (target && active === target) {
        setSelected(snapshotObject(target));
      }

      if (!cropSessionRef.current && !textEditingRef.current) {
        saveHistory();
      }
    };

    const cropMouseDown = (opt: any) => {
      const session = cropSessionRef.current;
      const target = opt.target as FabricImage | undefined;

      if (!session || !target || target !== session.object) return;

      session.fixedLeft = target.left || 0;
      session.fixedTop = target.top || 0;
      session.startCropX = target.cropX || 0;
      session.startCropY = target.cropY || 0;
    };

    const cropMoving = (opt: any) => {
      const session = cropSessionRef.current;
      const target = opt.target as FabricImage | undefined;

      if (!session || !target || target !== session.object) return;

      const dx = (target.left || 0) - session.fixedLeft;
      const dy = (target.top || 0) - session.fixedTop;

      const sx = Math.abs(target.scaleX || 1) || 1;
      const sy = Math.abs(target.scaleY || 1) || 1;

      const maxCropX = Math.max(
        0,
        session.sourceWidth - (target.width || session.sourceWidth)
      );

      const maxCropY = Math.max(
        0,
        session.sourceHeight - (target.height || session.sourceHeight)
      );

      target.set({
        left: session.fixedLeft,
        top: session.fixedTop,
        cropX: Math.min(
          maxCropX,
          Math.max(0, session.startCropX - dx / sx)
        ),
        cropY: Math.min(
          maxCropY,
          Math.max(0, session.startCropY - dy / sy)
        ),
      });

      target.setCoords();
      c.renderAll();
      setSelected(snapshotObject(target));
    };

    const smartSnapMoving = (opt: any) => {
      if (cropSessionRef.current) return;

      const target = opt.target as FabricObject | undefined;
      if (!target) return;

      target.setCoords();

      const threshold = 7;
      const canvasWidth = c.getWidth();
      const canvasHeight = c.getHeight();
      const box = target.getBoundingRect();

      const selectedChildren =
        typeof (target as any).getObjects === "function" &&
        ["activeselection", "active-selection"].includes(
          String(target.type || "").toLowerCase()
        )
          ? new Set<FabricObject>((target as any).getObjects())
          : new Set<FabricObject>();

      const verticalCandidates: number[] = [
        0,
        canvasWidth / 2,
        canvasWidth,
      ];

      const horizontalCandidates: number[] = [
        0,
        canvasHeight / 2,
        canvasHeight,
      ];

      c.getObjects().forEach((other) => {
        if (
          other === target ||
          selectedChildren.has(other) ||
          other.visible === false
        ) {
          return;
        }

        const otherBox = other.getBoundingRect();

        verticalCandidates.push(
          otherBox.left,
          otherBox.left + otherBox.width / 2,
          otherBox.left + otherBox.width
        );

        horizontalCandidates.push(
          otherBox.top,
          otherBox.top + otherBox.height / 2,
          otherBox.top + otherBox.height
        );
      });

      const targetX = [
        box.left,
        box.left + box.width / 2,
        box.left + box.width,
      ];

      const targetY = [
        box.top,
        box.top + box.height / 2,
        box.top + box.height,
      ];

      let bestX: { delta: number; guide: number } | null = null;
      let bestY: { delta: number; guide: number } | null = null;

      for (const anchor of targetX) {
        for (const candidate of verticalCandidates) {
          const delta = candidate - anchor;

          if (
            Math.abs(delta) <= threshold &&
            (!bestX || Math.abs(delta) < Math.abs(bestX.delta))
          ) {
            bestX = { delta, guide: candidate };
          }
        }
      }

      for (const anchor of targetY) {
        for (const candidate of horizontalCandidates) {
          const delta = candidate - anchor;

          if (
            Math.abs(delta) <= threshold &&
            (!bestY || Math.abs(delta) < Math.abs(bestY.delta))
          ) {
            bestY = { delta, guide: candidate };
          }
        }
      }

      if (bestX) {
        target.set({
          left: (target.left || 0) + bestX.delta,
        });
      }

      if (bestY) {
        target.set({
          top: (target.top || 0) + bestY.delta,
        });
      }

      if (bestX || bestY) {
        target.setCoords();
      }

      setSnapGuides({
        vertical: bestX ? [bestX.guide] : [],
        horizontal: bestY ? [bestY.guide] : [],
      });
    };

    const clearSmartGuides = () => {
      setSnapGuides({ vertical: [], horizontal: [] });
    };

    const cropMouseUp = () => {
      clearSmartGuides();
      const session = cropSessionRef.current;

      if (!session) return;

      session.fixedLeft = session.object.left || 0;
      session.fixedTop = session.object.top || 0;
      session.startCropX = session.object.cropX || 0;
      session.startCropY = session.object.cropY || 0;
    };

    c.on("selection:created", updateSelection);
    c.on("selection:updated", updateSelection);
    c.on("selection:cleared", clearSelection);
    c.on("mouse:down", rememberTextAnchor);
    c.on("object:modified", modified);
    c.on("text:editing:entered", textEditingEntered);
    c.on("text:changed", textChanged);
    c.on("text:editing:exited", textEditingExited);
    c.on("object:added", refreshObjects);
    c.on("object:removed", refreshObjects);
    c.on("mouse:down", cropMouseDown);
    c.on("object:moving", cropMoving);
    c.on("object:moving", smartSnapMoving);
    c.on("object:modified", clearSmartGuides);
    c.on("mouse:up", cropMouseUp);

    const wrapperEl = c.wrapperEl;
    const upperCanvas = c.upperCanvasEl;

    const rememberRightClickTarget = (opt: any) => {
      const e = opt.e as MouseEvent | PointerEvent | undefined;

      const isRightClick =
        e?.button === 2 ||
        opt.button === 3;

      if (!isRightClick) {
        return;
      }

      const eventTarget = opt.target as FabricObject | undefined;

      if (
        eventTarget &&
        typeof (eventTarget as any).onSelect === "function"
      ) {
        rightClickTargetRef.current = eventTarget;
        return;
      }

      const active = c.getActiveObject();

      rightClickTargetRef.current =
        active &&
        typeof (active as any).onSelect === "function"
          ? active
          : null;
    };

    c.on("mouse:down", rememberRightClickTarget);

    const handleContextMenuCapture = (e: MouseEvent) => {
      const eventTarget = e.target as Node | null;

      if (
        !eventTarget ||
        (!wrapperEl.contains(eventTarget) &&
          eventTarget !== upperCanvas)
      ) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      const active = c.getActiveObject();

      const activeIsFabricObject =
        active &&
        typeof (active as any).onSelect === "function";

      const remembered = rightClickTargetRef.current;

      const target =
        remembered &&
        typeof (remembered as any).onSelect === "function"
          ? remembered
          : activeIsFabricObject
          ? active
          : null;

      rightClickTargetRef.current = null;

      if (!target) {
        setContextMenu(null);
        return;
      }

      // `target` comes from Fabric's own mouse event, so it is a real
      // FabricObject. Do not use findTarget(nativeContextMenuEvent) here.
      if (c.getActiveObject() !== target) {
        c.setActiveObject(target, e as any);
      }

      c.requestRenderAll();

      setSelected(snapshotObject(target));

      setContextMenu({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener(
      "contextmenu",
      handleContextMenuCapture,
      true
    );

    setProjects(loadProjects());

    const params = new URLSearchParams(window.location.search);
    const requestedFormatName = params.get("format");
    const requestedTemplate = params.get("template");
    const requestedPanel = params.get("panel");
    const requestedNewDesign = params.get("new") === "1";
    if (user && (requestedNewDesign || requestedTemplate)) {
      resetCurrentCloudDesignId(user.id);
    }

    if (requestedPanel === "festival" || requestedPanel === "templates") {
      setActivePanel(requestedPanel);
    }

    const requestedFormat = requestedFormatName
      ? FORMATS.find((item) => item.name === requestedFormatName)
      : null;

    let initialContentHandled = false;

    if (requestedTemplate) {
      const templateFormat = getTemplateFormat(requestedTemplate);

      if (templateFormat) {
        syncCanvasToFormat(c, templateFormat);

        setFormat(templateFormat);
        setZoom(fitZoomForFormat(templateFormat));
      } else if (requestedFormat) {
        syncCanvasToFormat(c, requestedFormat);

        setFormat(requestedFormat);
        setZoom(fitZoomForFormat(requestedFormat));
      }

      applyTemplate(c, requestedTemplate);
      c.calcOffset();
      c.requestRenderAll();

      setBackground(
        typeof c.backgroundColor === "string"
          ? c.backgroundColor
          : "#ffffff"
      );

      setProjectName(
        requestedTemplate.startsWith("resume-")
          ? "New Resume"
          : requestedTemplate.startsWith("festival-")
          ? "New Festival Design"
          : "New Social Design"
      );

      if (window.innerWidth < 768) {
        setActivePanel(null);
      } else if (requestedTemplate.startsWith("festival-")) {
        setActivePanel("festival");
      }

      setSelected(null);
      setTemplateScope("format");

      historyRef.current = [JSON.stringify(c.toJSON())];
      historyIndexRef.current = 0;

      refreshObjects();
      updateHistoryButtons();
      initializeSinglePage(c);
      setEditorReady(true);
      initialContentHandled = true;
    } else if (requestedNewDesign) {
      if (requestedFormat) {
        syncCanvasToFormat(c, requestedFormat);

        setFormat(requestedFormat);
        setZoom(fitZoomForFormat(requestedFormat));
      }

      c.clear();
      c.backgroundColor = "#ffffff";
      c.renderAll();

      setBackground("#ffffff");

      if (requestedFormat?.name === "Festival Poster") {
        setProjectName("New Festival Design");
      }

      setSelected(null);
      setTemplateScope(
        requestedFormat
          ? "format"
          : "all"
      );

      historyRef.current = [JSON.stringify(c.toJSON())];
      historyIndexRef.current = 0;

      refreshObjects();
      updateHistoryButtons();
      initializeSinglePage(c);
      setEditorReady(true);
      initialContentHandled = true;
    }

    if (!initialContentHandled) {
      void loadAutosave().then(async (autosave) => {
        if (fabricRef.current !== c) return;

        if (!autosave) {
          initializeSinglePage(c);
          setEditorReady(true);
          return;
        }

        restoringRef.current = true;

        const restoredFormat = autosave.format || FORMATS[0];
        setFormat(restoredFormat);
        setZoom(fitZoomForFormat(restoredFormat));

        const restoredPages: DesignPage[] = autosave.pages?.length
          ? autosave.pages
          : [
              {
                id: makePageId(),
                design: autosave.design,
                background: autosave.background,
              },
            ];

        const restoredIndex = Math.min(
          Math.max(0, autosave.activePageIndex || 0),
          restoredPages.length - 1
        );
        const targetPage = restoredPages[restoredIndex];
        const targetSize = getEditorCanvasSize(restoredFormat);
        const sourceWidth = Math.max(
          1,
          Number(targetPage.width || targetSize.width)
        );
        const sourceHeight = Math.max(
          1,
          Number(targetPage.height || targetSize.height)
        );

        try {
          syncCanvasDimensions(c, sourceWidth, sourceHeight);
          await c.loadFromJSON(JSON.parse(targetPage.design));

          if (fabricRef.current !== c) return;

          normalizeLoadedObjectOrigins(c);
          c.backgroundColor = targetPage.background || autosave.background;

          if (
            sourceWidth !== targetSize.width ||
            sourceHeight !== targetSize.height
          ) {
            smartReflowCanvas(c, targetSize.width, targetSize.height);
            syncCanvasDimensions(c, targetSize.width, targetSize.height);
          }

          c.requestRenderAll();

          const normalizedPages = [...restoredPages];
          normalizedPages[restoredIndex] = captureCanvasPage(c, targetPage);
          commitPages(normalizedPages);
          commitActivePageIndex(restoredIndex);
          setBackground(normalizedPages[restoredIndex].background);

          historyRef.current = [JSON.stringify(c.toJSON())];
          historyIndexRef.current = 0;

          refreshObjects();
          updateHistoryButtons();
        } catch {
          initializeSinglePage(c);
        } finally {
          restoringRef.current = false;
          setEditorReady(true);
        }
      });
    }

    return () => {
      window.removeEventListener(
        "contextmenu",
        handleContextMenuCapture,
        true
      );
      c.off("mouse:down", rememberTextAnchor);
      c.off("text:editing:entered", textEditingEntered);
      c.off("text:changed", textChanged);
      c.off("text:editing:exited", textEditingExited);
      c.off("mouse:down", rememberRightClickTarget);
      c.off("mouse:down", cropMouseDown);
      c.off("object:moving", cropMoving);
      c.off("object:moving", smartSnapMoving);
      c.off("object:modified", clearSmartGuides);
      c.off("mouse:up", cropMouseUp);
      void c.dispose();

      if (fabricRef.current === c) {
        fabricRef.current = null;
      }
    };
  }, []);

  const selectAllObjects = () => {
    const c = canvas();
    if (!c) return;

    const selectable = c
      .getObjects()
      .filter(
        (object) =>
          object.visible !== false &&
          object.selectable !== false
      );

    c.discardActiveObject();

    if (selectable.length === 0) {
      setSelected(null);
      c.requestRenderAll();
      return;
    }

    if (selectable.length === 1) {
      c.setActiveObject(selectable[0]);
      setSelected(snapshotObject(selectable[0]));
      c.requestRenderAll();
      return;
    }

    const selection = new ActiveSelection(selectable, {
      canvas: c,
    });

    c.setActiveObject(selection);
    setSelected(snapshotObject(selection));
    c.requestRenderAll();
  };

  const groupSelected = () => {
    const c = canvas();
    const active = c?.getActiveObject();

    if (!c || !active) return;

    const type = String(active.type || "").toLowerCase();

    if (!["activeselection", "active-selection"].includes(type)) {
      return;
    }

    const members = (active as ActiveSelection).removeAll();

    if (members.length < 2) return;

    const group = new Group(members, {
      originX: "left",
      originY: "top",
    });

    c.add(group);
    c.setActiveObject(group);
    group.setCoords();
    c.requestRenderAll();

    setSelected(snapshotObject(group));
    refreshObjects();
    saveHistory();
  };

  const ungroupSelected = () => {
    const c = canvas();
    const active = c?.getActiveObject();

    if (!c || !active || isMockupObject(active) || isSmartFrameObject(active)) return;

    if (String(active.type || "").toLowerCase() !== "group") return;

    const group = active as Group;

    c.remove(group);

    const members = group.removeAll();

    if (members.length === 0) {
      c.discardActiveObject();
      setSelected(null);
      c.requestRenderAll();
      return;
    }

    const selection = new ActiveSelection(members, {
      canvas: c,
    });

    c.setActiveObject(selection);
    selection.setCoords();
    c.requestRenderAll();

    setSelected(snapshotObject(selection));
    refreshObjects();
    saveHistory();
  };

  const updateExactTransform = (changes: {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    angle?: number;
  }) => {
    const c = canvas();
    const active = c?.getActiveObject();

    if (!c || !active) return;

    let bounds = active.getBoundingRect();

    if (
      typeof changes.width === "number" &&
      Number.isFinite(changes.width) &&
      changes.width > 0 &&
      bounds.width > 0
    ) {
      active.set({
        scaleX:
          (active.scaleX || 1) *
          (changes.width / bounds.width),
      });
      active.setCoords();
      bounds = active.getBoundingRect();
    }

    if (
      typeof changes.height === "number" &&
      Number.isFinite(changes.height) &&
      changes.height > 0 &&
      bounds.height > 0
    ) {
      active.set({
        scaleY:
          (active.scaleY || 1) *
          (changes.height / bounds.height),
      });
      active.setCoords();
      bounds = active.getBoundingRect();
    }

    if (
      typeof changes.angle === "number" &&
      Number.isFinite(changes.angle)
    ) {
      active.set({ angle: changes.angle });
      active.setCoords();
      bounds = active.getBoundingRect();
    }

    const move: Record<string, number> = {};

    if (typeof changes.x === "number" && Number.isFinite(changes.x)) {
      move.left = (active.left || 0) + (changes.x - bounds.left);
    }

    if (typeof changes.y === "number" && Number.isFinite(changes.y)) {
      move.top = (active.top || 0) + (changes.y - bounds.top);
    }

    if (Object.keys(move).length) {
      active.set(move);
    }

    active.setCoords();
    c.requestRenderAll();
    setSelected(snapshotObject(active));
    saveHistory();
  };

  useEffect(() => {
    const keyboard = (e: KeyboardEvent) => {
      const c = canvas();
      if (!c) return;

      const target = e.target as HTMLElement;

      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable
      ) {
        return;
      }

      const editingObject = c.getActiveObject() as any;

      if (editingObject?.isEditing) {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "a") {
        e.preventDefault();
        selectAllObjects();
        return;
      }

      if (
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        e.key.toLowerCase() === "g"
      ) {
        e.preventDefault();
        ungroupSelected();
        return;
      }

      if (
        (e.ctrlKey || e.metaKey) &&
        !e.shiftKey &&
        e.key.toLowerCase() === "g"
      ) {
        e.preventDefault();
        groupSelected();
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        void undo();
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
        e.preventDefault();
        void redo();
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "c" && !e.altKey) {
        e.preventDefault();
        void copySelected();
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.altKey && e.key.toLowerCase() === "c") {
        e.preventDefault();
        copySelectedStyle();
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "v") {
        e.preventDefault();
        void pasteClipboard();
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "d") {
        e.preventDefault();
        void duplicateSelected();
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        addLinkToSelected();
        return;
      }

      if (e.key === "Delete" || e.key === "Backspace") {
        if (c.getActiveObject()) {
          e.preventDefault();
          deleteSelected();
        }
        return;
      }

      if (e.key === "Escape") {
        c.discardActiveObject();
        c.renderAll();
        setSelected(null);
        return;
      }

      const active = c.getActiveObject();
      if (!active) return;

      const step = e.shiftKey ? 10 : 1;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        active.set({ left: (active.left || 0) - step });
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        active.set({ left: (active.left || 0) + step });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        active.set({ top: (active.top || 0) - step });
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        active.set({ top: (active.top || 0) + step });
      } else {
        return;
      }

      active.setCoords();
      c.renderAll();

      setSelected(snapshotObject(active));
      saveHistory();
    };

    window.addEventListener("keydown", keyboard);
    return () => window.removeEventListener("keydown", keyboard);
  });

  const uploadBrandLogo = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (brandKit.logos.length >= 4) {
      window.alert("Brand Kit me maximum 4 logos save kar sakte ho.");
      e.target.value = "";
      return;
    }

    if (file.size > 1_500_000) {
      window.alert("Logo 1.5 MB se chhota rakho taaki Brand Kit browser me safely save rahe.");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== "string") return;

      const logo: BrandLogo = {
        id: `brand-logo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name: file.name,
        dataUrl: reader.result,
      };

      updateBrandKit({
        ...brandKit,
        logos: [...brandKit.logos, logo],
      });
    };

    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const removeBrandLogo = (logoId: string) => {
    updateBrandKit({
      ...brandKit,
      logos: brandKit.logos.filter((logo) => logo.id !== logoId),
    });
  };

  const addBrandLogo = async (logo: BrandLogo) => {
    const c = canvas();
    if (!c) return;

    try {
      const image = await FabricImage.fromURL(logo.dataUrl);
      const targetWidth = Math.min(260, c.getWidth() * 0.24);

      image.scaleToWidth(targetWidth);
      image.set({
        left: c.getWidth() * 0.06,
        top: c.getHeight() * 0.06,
      });

      (image as any).isBrandLogo = true;

      c.add(image);
      c.setActiveObject(image);
      image.setCoords();
      c.requestRenderAll();

      setSelected(snapshotObject(image));
      refreshObjects();
      saveHistory();
    } catch {
      window.alert("Logo canvas par add nahi ho saka. PNG, JPG, WEBP ya SVG use karo.");
    }
  };

  const visitBrandObject = (
    object: FabricObject,
    callback: (object: FabricObject) => void
  ) => {
    const anyObject = object as any;

    if (anyObject.isMockup) {
      return;
    }

    if (
      String(object.type || "").toLowerCase() === "group" &&
      typeof anyObject.getObjects === "function"
    ) {
      (anyObject.getObjects() as FabricObject[]).forEach((child) =>
        visitBrandObject(child, callback)
      );
      return;
    }

    callback(object);
  };

  const applyBrandColorToSelected = (color: string) => {
    const c = canvas();
    const active = c?.getActiveObject();

    if (!c || !active) {
      window.alert("Pehle canvas par koi object select karo.");
      return;
    }

    const targets =
      active instanceof ActiveSelection
        ? active.getObjects()
        : [active];

    targets.forEach((target) => {
      visitBrandObject(target, (object) => {
        const type = String(object.type || "").toLowerCase();
        const anyObject = object as any;

        if (["image", "fabricimage"].includes(type)) return;

        if (["line"].includes(type)) {
          anyObject.set({ stroke: color });
          return;
        }

        if (["textbox", "text", "i-text"].includes(type)) {
          anyObject.set({ fill: color });
          return;
        }

        const changes: Record<string, any> = {};

        if (anyObject.fill !== undefined && anyObject.fill !== "transparent") {
          changes.fill = color;
        }

        if (anyObject.stroke && anyObject.stroke !== "transparent") {
          changes.stroke = color;
        }

        anyObject.set(changes);
      });

      target.setCoords();
    });

    c.requestRenderAll();
    setSelected(snapshotObject(active));
    refreshObjects();
    saveHistory();
  };

  const applyBrandToDesign = () => {
    const c = canvas();
    if (!c) return;

    const palette = [
      brandKit.primary,
      brandKit.secondary,
      brandKit.accent,
    ];

    const colorOrder: string[] = [];

    c.getObjects().forEach((object) => {
      visitBrandObject(object, (child) => {
        const type = String(child.type || "").toLowerCase();
        const anyChild = child as any;

        if (
          ["image", "fabricimage", "textbox", "text", "i-text"].includes(type)
        ) {
          return;
        }

        [anyChild.fill, anyChild.stroke].forEach((paint) => {
          const normalized = normalizeBrandColor(paint);

          if (
            normalized &&
            !isBrandNearWhite(normalized) &&
            !isBrandNearBlack(normalized) &&
            !colorOrder.includes(normalized)
          ) {
            colorOrder.push(normalized);
          }
        });
      });
    });

    const colorMap = new Map<string, string>();
    colorOrder.forEach((color, index) => {
      colorMap.set(color, palette[index % palette.length]);
    });

    let maxFontSize = 1;

    c.getObjects().forEach((object) => {
      visitBrandObject(object, (child) => {
        const type = String(child.type || "").toLowerCase();
        if (["textbox", "text", "i-text"].includes(type)) {
          maxFontSize = Math.max(maxFontSize, Number((child as any).fontSize || 1));
        }
      });
    });

    const mapPaint = (paint: unknown) => {
      const normalized = normalizeBrandColor(paint);
      if (!normalized) return paint;

      if (isBrandNearWhite(normalized)) return brandKit.background;
      if (isBrandNearBlack(normalized)) return brandKit.text;

      return colorMap.get(normalized) || brandKit.primary;
    };

    c.backgroundColor = brandKit.background;
    setBackground(brandKit.background);

    c.getObjects().forEach((object) => {
      visitBrandObject(object, (child) => {
        const type = String(child.type || "").toLowerCase();
        const anyChild = child as any;

        if (["image", "fabricimage"].includes(type)) return;

        if (["textbox", "text", "i-text"].includes(type)) {
          const currentFill = normalizeBrandColor(anyChild.fill);
          const isHeading = Number(anyChild.fontSize || 0) >= maxFontSize * 0.68;

          anyChild.set({
            fontFamily: isHeading ? brandKit.headingFont : brandKit.bodyFont,
            fill: currentFill && isBrandNearWhite(currentFill)
              ? "#ffffff"
              : currentFill && !isBrandNearBlack(currentFill)
              ? brandKit.primary
              : brandKit.text,
          });

          return;
        }

        const changes: Record<string, any> = {};

        if (typeof anyChild.fill === "string" && anyChild.fill !== "transparent") {
          changes.fill = mapPaint(anyChild.fill);
        }

        if (typeof anyChild.stroke === "string" && anyChild.stroke !== "transparent") {
          changes.stroke = mapPaint(anyChild.stroke);
        }

        anyChild.set(changes);
      });

      object.setCoords();
    });

    c.discardActiveObject();
    c.requestRenderAll();

    setSelected(null);
    refreshObjects();
    saveHistory();
  };

  const addBrandText = (
    text: string,
    fontSize: number,
    fontFamily: string,
    weight: "normal" | "bold" = "normal"
  ) => {
    const c = canvas();
    if (!c) return;

    const width = Math.max(240, c.getWidth() * 0.72);

    const object = new Textbox(text, {
      left: c.getWidth() * 0.14,
      top: c.getHeight() * 0.22,
      width,
      fontSize,
      fontWeight: weight,
      fontFamily,
      fill: brandKit.text,
      textAlign: "left",
      padding: 8,
      editable: true,
    });

    c.add(object);
    c.setActiveObject(object);
    c.requestRenderAll();

    setSelected(snapshotObject(object));
    refreshObjects();
    saveHistory();
  };

  const addText = (
    text: string,
    fontSize: number,
    weight: "normal" | "bold" = "normal"
  ) => {
    const c = canvas();
    if (!c) return;

    const obj = new Textbox(text, {
      left: 150,
      top: 250,
      width: Math.max(400, c.getWidth() - 300),
      fontSize,
      fontWeight: weight,
      fontFamily: "Arial",
      fill: "#111111",
      textAlign: "center",
      padding: 10,
      editable: true,
    });

    c.add(obj);
    c.setActiveObject(obj);
    c.renderAll();

    setSelected(snapshotObject(obj));
    saveHistory();
  };

  const addRectangle = () => {
    const c = canvas();
    if (!c) return;

    const obj = new Rect({
      left: 250,
      top: 300,
      width: 580,
      height: 350,
      rx: 30,
      ry: 30,
      fill: "#111111",
    });

    c.add(obj);
    c.setActiveObject(obj);
    c.renderAll();

    setSelected(snapshotObject(obj));
    saveHistory();
  };

  const addCircle = () => {
    const c = canvas();
    if (!c) return;

    const obj = new Circle({
      left: 390,
      top: 330,
      radius: 160,
      fill: "#111111",
    });

    c.add(obj);
    c.setActiveObject(obj);
    c.renderAll();

    setSelected(snapshotObject(obj));
    saveHistory();
  };

  const addLine = () => {
    const c = canvas();
    if (!c) return;

    const obj = new Line([200, 500, 800, 500], {
      stroke: "#111111",
      strokeWidth: 10,
    });

    c.add(obj);
    c.setActiveObject(obj);
    c.renderAll();

    setSelected(snapshotObject(obj));
    saveHistory();
  };

  const addIcon = (
    icon:
      | "star"
      | "heart"
      | "arrow"
      | "check"
      | "plus"
      | "bolt"
  ) => {
    const c = canvas();
    if (!c) return;

    const paths: Record<
      string,
      string
    > = {
      star:
        "M 50 0 L 61 35 L 98 35 L 68 57 L 79 91 L 50 70 L 21 91 L 32 57 L 2 35 L 39 35 Z",
      heart:
        "M 50 88 C 20 65 0 45 0 25 C 0 5 25 -5 50 15 C 75 -5 100 5 100 25 C 100 45 80 65 50 88 Z",
      arrow:
        "M 0 40 L 70 40 L 70 15 L 100 50 L 70 85 L 70 60 L 0 60 Z",
      check:
        "M 5 50 L 35 80 L 95 15 L 80 0 L 35 55 L 20 35 Z",
      plus:
        "M 40 0 L 60 0 L 60 40 L 100 40 L 100 60 L 60 60 L 60 100 L 40 100 L 40 60 L 0 60 L 0 40 L 40 40 Z",
      bolt:
        "M 55 0 L 15 55 L 45 55 L 30 100 L 85 40 L 55 40 Z",
    };

    const obj = new Path(
      paths[icon],
      {
        left: 350,
        top: 350,
        fill: "#111111",
        stroke: "#111111",
        strokeWidth: 0,
        scaleX: 2,
        scaleY: 2,
      }
    );

    c.add(obj);
    c.setActiveObject(obj);
    c.renderAll();

    setSelected(
      snapshotObject(obj)
    );

    saveHistory();
  };

  const addLibraryElement = (id: string) => {
    const c = canvas();
    if (!c) return;

    const obj = insertElement(c, id);
    setSelected(snapshotObject(obj));
    refreshObjects();
    saveHistory();
  };

  const addSmartFrame = async (
    id: string
  ) => {
    const c = canvas();
    if (!c) return;

    const group =
      await createSmartFrameGroup(
        id
      );

    const rawWidth =
      Math.max(
        1,
        group.width || 1
      );

    const rawHeight =
      Math.max(
        1,
        group.height || 1
      );

    const scale =
      Math.min(
        1,
        (c.getWidth() *
          0.58) /
          rawWidth,
        (c.getHeight() *
          0.62) /
          rawHeight
      );

    group.set({
      left:
        (c.getWidth() -
          rawWidth *
            scale) /
        2,
      top:
        (c.getHeight() -
          rawHeight *
            scale) /
        2,
      scaleX: scale,
      scaleY: scale,
    });

    c.add(group);
    c.setActiveObject(
      group
    );
    c.requestRenderAll();

    setSelected(
      snapshotObject(
        group
      )
    );

    setActivePanel(
      "frameEdit"
    );

    refreshObjects();
    saveHistory();
  };

  const updateActiveSmartFrame =
    async (
      changes: Parameters<
        typeof rebuildSmartFrame
      >[2],
      imageSrcOverride?:
        | string
        | null
    ) => {
      const c = canvas();
      const active =
        c?.getActiveObject();

      if (
        !c ||
        !active ||
        !isSmartFrameObject(
          active
        )
      ) {
        return;
      }

      const replacement =
        await rebuildSmartFrame(
          c,
          active,
          changes,
          imageSrcOverride
        );

      if (!replacement)
        return;

      setSelected(
        snapshotObject(
          replacement
        )
      );

      refreshObjects();
      saveHistory();
    };

  const uploadSmartFrameImage = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      e.target.files?.[0];

    const c = canvas();

    const active =
      c?.getActiveObject();

    if (
      !file ||
      !c ||
      !active ||
      !isSmartFrameObject(
        active
      )
    ) {
      e.target.value = "";
      return;
    }

    const reader =
      new FileReader();

    reader.onload =
      async () => {
        if (
          typeof reader.result !==
          "string"
        ) {
          return;
        }

        await updateActiveSmartFrame(
          {},
          reader.result
        );
      };

    reader.readAsDataURL(
      file
    );

    e.target.value = "";
  };

  const setSmartFrameFit = (
    fit: SmartFrameFit
  ) =>
    void updateActiveSmartFrame({
      fit,
      zoom:
        fit === "fill"
          ? Math.max(
              1,
              Number(
                selected?.smartFrameZoom ??
                  1
              )
            )
          : Number(
              selected?.smartFrameZoom ??
                1
            ),
    });

  const setSmartFrameZoom = (
    zoom: number
  ) =>
    void updateActiveSmartFrame({
      zoom,
    });

  const setSmartFramePanX = (
    panX: number
  ) =>
    void updateActiveSmartFrame({
      panX,
    });

  const setSmartFramePanY = (
    panY: number
  ) =>
    void updateActiveSmartFrame({
      panY,
    });

  const setSmartFrameBorderColor =
    (
      borderColor: string
    ) =>
      void updateActiveSmartFrame({
        borderColor,
      });

  const setSmartFrameBorderWidth =
    (
      borderWidth: number
    ) =>
      void updateActiveSmartFrame({
        borderWidth,
      });

  const removeSmartFrameImage =
    () =>
      void updateActiveSmartFrame(
        {},
        null
      );

  const addMockup = async (id: string) => {
    const c = canvas();
    if (!c) return;

    const group = await createMockupGroup(id);
    const rawWidth = Math.max(1, group.width || 1);
    const rawHeight = Math.max(1, group.height || 1);
    const scale = Math.min(
      1,
      (c.getWidth() * 0.66) / rawWidth,
      (c.getHeight() * 0.72) / rawHeight
    );

    group.set({
      left: (c.getWidth() - rawWidth * scale) / 2,
      top: (c.getHeight() - rawHeight * scale) / 2,
      scaleX: scale,
      scaleY: scale,
    });

    c.add(group);
    c.setActiveObject(group);
    c.requestRenderAll();
    setSelected(snapshotObject(group));
    refreshObjects();
    saveHistory();
  };

  const updateActiveMockup = async (
    changes: Parameters<typeof rebuildMockup>[2],
    imageSrcOverride?: string | null
  ) => {
    const c = canvas();
    const active = c?.getActiveObject();

    if (!c || !active || !isMockupObject(active)) return;

    const replacement = await rebuildMockup(
      c,
      active,
      changes,
      imageSrcOverride
    );

    if (!replacement) return;

    setSelected(snapshotObject(replacement));
    refreshObjects();
    saveHistory();
  };

  const uploadMockupImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const c = canvas();
    const active = c?.getActiveObject();

    if (!file || !c || !active || !isMockupObject(active)) {
      e.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = async () => {
      if (typeof reader.result !== "string") return;
      await updateActiveMockup({}, reader.result);
    };

    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const setMockupFit = (fit: MockupFit) =>
    void updateActiveMockup({ fit, zoom: fit === "fill" ? Math.max(1, Number(selected?.mockupZoom ?? 1)) : Number(selected?.mockupZoom ?? 1) });

  const setMockupZoom = (zoom: number) =>
    void updateActiveMockup({ zoom });

  const setMockupPanX = (panX: number) =>
    void updateActiveMockup({ panX });

  const setMockupPanY = (panY: number) =>
    void updateActiveMockup({ panY });

  const setMockupSurfaceColor = (surfaceColor: string) =>
    void updateActiveMockup({ surfaceColor });

  const setMockupShadow = (shadow: number) =>
    void updateActiveMockup({ shadow });

  const removeMockupImage = () =>
    void updateActiveMockup({}, null);

  const uploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const c = canvas();

    if (!file || !c) return;

    const reader = new FileReader();

    reader.onload = async () => {
      if (typeof reader.result !== "string") return;

      const active = c.getActiveObject();

      if (active && isSmartFrameObject(active)) {
        const replacement = await rebuildSmartFrame(
          c,
          active,
          {},
          reader.result
        );

        if (replacement) {
          setSelected(snapshotObject(replacement));
          setActivePanel("frameEdit");
          refreshObjects();
          saveHistory();
        }

        return;
      }

      if (active && isMockupObject(active)) {
        const replacement = await rebuildMockup(c, active, {}, reader.result);
        if (replacement) {
          setSelected(snapshotObject(replacement));
          refreshObjects();
          saveHistory();
        }
        return;
      }

      const img = await FabricImage.fromURL(reader.result);

      img.set({
        left: 180,
        top: 180,
      });

      img.scaleToWidth(Math.min(500, c.getWidth() * 0.5));

      c.add(img);
      c.setActiveObject(img);
      c.renderAll();

      setSelected(snapshotObject(img));
      saveHistory();
    };

    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const uploadBackgroundImage = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      e.target.files?.[0];

    const c = canvas();

    if (!file || !c) return;

    const reader =
      new FileReader();

    reader.onload = async () => {
      if (
        typeof reader.result !==
        "string"
      ) {
        return;
      }

      const img =
        await FabricImage.fromURL(
          reader.result
        );

      const scale = Math.max(
        c.getWidth() /
          (img.width || 1),
        c.getHeight() /
          (img.height || 1)
      );

      img.set({
        left:
          (c.getWidth() -
            (img.width || 1) *
              scale) /
          2,
        top:
          (c.getHeight() -
            (img.height || 1) *
              scale) /
          2,
        scaleX: scale,
        scaleY: scale,
      });

      c.add(img);
      c.sendObjectToBack(img);
      c.setActiveObject(img);
      c.renderAll();

      setSelected(
        snapshotObject(img)
      );

      saveHistory();
    };

    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const replaceSelectedImage = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      e.target.files?.[0];

    const c = canvas();
    const obj =
      c?.getActiveObject();

    if (
      !file ||
      !c ||
      !obj ||
      ![
        "image",
        "fabricimage",
      ].includes(
        String(
          obj.type ||
            obj.constructor?.name ||
            ""
        ).toLowerCase()
      )
    ) {
      return;
    }

    const reader =
      new FileReader();

    reader.onload = async () => {
      if (
        typeof reader.result !==
        "string"
      ) {
        return;
      }

      await (
        obj as FabricImage
      ).setSrc(reader.result);

      obj.setCoords();
      c.renderAll();

      setSelected(
        snapshotObject(obj)
      );

      saveHistory();
    };

    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const setImageAsBackground =
    () => {
      const c = canvas();
      const obj =
        c?.getActiveObject();

      if (
        !c ||
        !obj ||
        ![
          "image",
          "fabricimage",
        ].includes(
          String(
            obj.type ||
              obj.constructor
                ?.name ||
              ""
          ).toLowerCase()
        )
      ) {
        return;
      }

      const image =
        obj as FabricImage;

      const scale = Math.max(
        c.getWidth() /
          (image.width || 1),
        c.getHeight() /
          (image.height || 1)
      );

      image.set({
        left:
          (c.getWidth() -
            (image.width || 1) *
              scale) /
          2,
        top:
          (c.getHeight() -
            (image.height || 1) *
              scale) /
          2,
        scaleX: scale,
        scaleY: scale,
        angle: 0,
      });

      image.setCoords();
      c.sendObjectToBack(image);
      c.renderAll();

      setSelected(
        snapshotObject(image)
      );

      saveHistory();
    };

  const removePlainImageBackground =
    async (
      tolerance: number
    ) => {
      const c = canvas();
      const object =
        c?.getActiveObject();

      if (
        !c ||
        !object ||
        ![
          "image",
          "fabricimage",
        ].includes(
          String(
            object.type ||
              object.constructor
                ?.name ||
              ""
          ).toLowerCase()
        )
      ) {
        return;
      }

      const image =
        object as FabricImage;

      const source =
        typeof (
          image as any
        ).getSrc ===
        "function"
          ? (
              image as any
            ).getSrc()
          : (
              image as any
            ).src;

      if (
        !source ||
        typeof source !==
          "string"
      ) {
        return;
      }

      if (
        !(image as any)
          .originalImageSrc
      ) {
        (
          image as any
        ).originalImageSrc =
          source;
      }

      const htmlImage =
        new Image();

      htmlImage.crossOrigin =
        "anonymous";

      const loaded =
        new Promise<void>(
          (
            resolve,
            reject
          ) => {
            htmlImage.onload =
              () =>
                resolve();

            htmlImage.onerror =
              () =>
                reject(
                  new Error(
                    "Image load failed"
                  )
                );
          }
        );

      htmlImage.src =
        source;

      try {
        await loaded;

        const sourceWidth =
          Math.max(
            1,
            htmlImage.naturalWidth ||
              htmlImage.width
          );

        const sourceHeight =
          Math.max(
            1,
            htmlImage.naturalHeight ||
              htmlImage.height
          );

        const maxSide =
          1800;

        const processingScale =
          Math.min(
            1,
            maxSide /
              Math.max(
                sourceWidth,
                sourceHeight
              )
          );

        const width =
          Math.max(
            1,
            Math.round(
              sourceWidth *
                processingScale
            )
          );

        const height =
          Math.max(
            1,
            Math.round(
              sourceHeight *
                processingScale
            )
          );

        const buffer =
          document.createElement(
            "canvas"
          );

        buffer.width =
          width;
        buffer.height =
          height;

        const context =
          buffer.getContext(
            "2d",
            {
              willReadFrequently:
                true,
            }
          );

        if (!context)
          return;

        context.drawImage(
          htmlImage,
          0,
          0,
          width,
          height
        );

        const data =
          context.getImageData(
            0,
            0,
            width,
            height
          );

        const pixels =
          data.data;

        const sampleRadius =
          Math.max(
            1,
            Math.round(
              Math.min(
                width,
                height
              ) *
                0.015
            )
          );

        const samplePoints = [
          [0, 0],
          [
            width -
              sampleRadius,
            0,
          ],
          [
            0,
            height -
              sampleRadius,
          ],
          [
            width -
              sampleRadius,
            height -
              sampleRadius,
          ],
        ];

        let sr = 0;
        let sg = 0;
        let sb = 0;
        let count = 0;

        samplePoints.forEach(
          ([
            startX,
            startY,
          ]) => {
            for (
              let y =
                startY;
              y <
              Math.min(
                height,
                startY +
                  sampleRadius
              );
              y++
            ) {
              for (
                let x =
                  startX;
                x <
                Math.min(
                  width,
                  startX +
                    sampleRadius
                );
                x++
              ) {
                const index =
                  (y *
                    width +
                    x) *
                  4;

                sr +=
                  pixels[
                    index
                  ];

                sg +=
                  pixels[
                    index +
                    1
                  ];

                sb +=
                  pixels[
                    index +
                    2
                  ];

                count++;
              }
            }
          }
        );

        const targetR =
          sr /
          Math.max(
            1,
            count
          );

        const targetG =
          sg /
          Math.max(
            1,
            count
          );

        const targetB =
          sb /
          Math.max(
            1,
            count
          );

        const hard =
          Math.max(
            5,
            tolerance
          );

        const soft =
          hard + 38;

        for (
          let i = 0;
          i <
          pixels.length;
          i += 4
        ) {
          const dr =
            pixels[i] -
            targetR;

          const dg =
            pixels[
              i + 1
            ] -
            targetG;

          const db =
            pixels[
              i + 2
            ] -
            targetB;

          const distance =
            Math.sqrt(
              dr * dr +
                dg * dg +
                db * db
            );

          if (
            distance <=
            hard
          ) {
            pixels[
              i + 3
            ] = 0;
          } else if (
            distance <
            soft
          ) {
            const ratio =
              (distance -
                hard) /
              (soft -
                hard);

            pixels[
              i + 3
            ] =
              Math.round(
                pixels[
                  i + 3
                ] *
                  ratio
              );
          }
        }

        context.putImageData(
          data,
          0,
          0
        );

        const result =
          buffer.toDataURL(
            "image/png"
          );

        const center =
          image.getCenterPoint();

        const visualWidth =
          (image.width ||
            1) *
          Math.abs(
            image.scaleX ||
              1
          );

        await image.setSrc(
          result
        );

        const naturalWidth =
          Math.max(
            1,
            image.width ||
              1
          );

        const nextScale =
          visualWidth /
          naturalWidth;

        image.set({
          scaleX:
            nextScale,
          scaleY:
            nextScale,
          cropX: 0,
          cropY: 0,
        });

        image.setPositionByOrigin(
          center as any,
          "center",
          "center"
        );

        image.setCoords();
        c.requestRenderAll();

        setSelected(
          snapshotObject(
            image
          )
        );

        saveHistory();
      } catch {
        window.alert(
          "Background remove nahi ho saka. Uploaded/local image par dobara try karo."
        );
      }
    };

  const restoreOriginalImage =
    async () => {
      const c = canvas();
      const object =
        c?.getActiveObject();

      if (
        !c ||
        !object ||
        ![
          "image",
          "fabricimage",
        ].includes(
          String(
            object.type ||
              object.constructor
                ?.name ||
              ""
          ).toLowerCase()
        )
      ) {
        return;
      }

      const image =
        object as FabricImage;

      const original =
        (image as any)
          .originalImageSrc;

      if (
        !original ||
        typeof original !==
          "string"
      ) {
        return;
      }

      const center =
        image.getCenterPoint();

      const visualWidth =
        (image.width ||
          1) *
        Math.abs(
          image.scaleX ||
            1
        );

      await image.setSrc(
        original
      );

      const naturalWidth =
        Math.max(
          1,
          image.width ||
            1
        );

      const nextScale =
        visualWidth /
        naturalWidth;

      image.set({
        scaleX:
          nextScale,
        scaleY:
          nextScale,
        cropX: 0,
        cropY: 0,
      });

      delete (
        image as any
      ).originalImageSrc;

      image.setPositionByOrigin(
        center as any,
        "center",
        "center"
      );

      image.setCoords();
      c.requestRenderAll();

      setSelected(
        snapshotObject(
          image
        )
      );

      saveHistory();
    };

  const rebuildImageFilters = (
    changes: {
      brightness?: number;
      contrast?: number;
      saturation?: number;
      blur?: number;
      preset?:
        | "none"
        | "grayscale"
        | "sepia"
        | "invert";
    }
  ) => {
    const c = canvas();
    const obj =
      c?.getActiveObject();

    if (
      !c ||
      !obj ||
      ![
        "image",
        "fabricimage",
      ].includes(
        String(
          obj.type ||
            obj.constructor?.name ||
            ""
        ).toLowerCase()
      )
    ) {
      return;
    }

    const img =
      obj as FabricImage;

    const current =
      snapshotObject(img);

    const brightness =
      changes.brightness ??
      current?.imageBrightness ??
      0;

    const contrast =
      changes.contrast ??
      current?.imageContrast ??
      0;

    const saturation =
      changes.saturation ??
      current?.imageSaturation ??
      0;

    const blur =
      changes.blur ??
      current?.imageBlur ??
      0;

    const preset =
      changes.preset ??
      current?.imagePreset ??
      "none";

    const nextFilters: any[] = [];

    if (brightness !== 0) {
      nextFilters.push(
        new filters.Brightness({
          brightness,
        })
      );
    }

    if (contrast !== 0) {
      nextFilters.push(
        new filters.Contrast({
          contrast,
        })
      );
    }

    if (saturation !== 0) {
      nextFilters.push(
        new filters.Saturation({
          saturation,
        })
      );
    }

    if (blur !== 0) {
      nextFilters.push(
        new filters.Blur({
          blur,
        })
      );
    }

    if (preset === "grayscale") {
      nextFilters.push(
        new filters.Grayscale()
      );
    }

    if (preset === "sepia") {
      nextFilters.push(
        new filters.Sepia()
      );
    }

    if (preset === "invert") {
      nextFilters.push(
        new filters.Invert()
      );
    }

    img.filters =
      nextFilters as any;

    img.applyFilters();
    c.renderAll();

    setSelected(
      snapshotObject(img)
    );

    saveHistory();
  };

  const updateImageCrop = (
    changes: {
      cropX?: number;
      cropY?: number;
    }
  ) => {
    const c = canvas();
    const obj = c?.getActiveObject();

    if (
      !c ||
      !obj ||
      ![
        "image",
        "fabricimage",
      ].includes(
        String(
          obj.type ||
            obj.constructor?.name ||
            ""
        ).toLowerCase()
      )
    ) {
      return;
    }

    const img = obj as FabricImage;
    const element = img.getElement() as HTMLImageElement;

    const sourceWidth =
      element.naturalWidth ||
      element.width ||
      img.width ||
      1;

    const sourceHeight =
      element.naturalHeight ||
      element.height ||
      img.height ||
      1;

    const maxCropX = Math.max(0, sourceWidth - (img.width || sourceWidth));
    const maxCropY = Math.max(0, sourceHeight - (img.height || sourceHeight));

    img.set({
      cropX:
        changes.cropX === undefined
          ? img.cropX
          : Math.min(maxCropX, Math.max(0, changes.cropX)),
      cropY:
        changes.cropY === undefined
          ? img.cropY
          : Math.min(maxCropY, Math.max(0, changes.cropY)),
    });

    img.setCoords();
    c.renderAll();

    setSelected(snapshotObject(img));
    saveHistory();
  };

  const toggleBulletList = () => {
    const c = canvas();
    const obj =
      c?.getActiveObject();

    if (!c || !obj) return;

    const type = String(
      obj.type ||
        obj.constructor?.name ||
        ""
    ).toLowerCase();

    if (
      ![
        "textbox",
        "text",
        "i-text",
        "itext",
      ].includes(type)
    ) {
      return;
    }

    const currentText = String(
      (obj as any).text || ""
    );

    const lines =
      currentText.split("\n");

    const allBulleted =
      lines.length > 0 &&
      lines.every((line) =>
        line.trimStart().startsWith(
          "• "
        )
      );

    const nextText = allBulleted
      ? lines
          .map((line) =>
            line.replace(
              /^\s*•\s*/,
              ""
            )
          )
          .join("\n")
      : lines
          .map(
            (line) => `• ${line}`
          )
          .join("\n");

    obj.set({
      text: nextText,
    });

    c.renderAll();

    setSelected(
      snapshotObject(obj)
    );

    saveHistory();
  };

  const unavailableTool = (
    name: string
  ) => {
    window.alert(
      `${name} AI/backend feature hai. Static ₹0 MVP me abhi UI placeholder rakha hai. Isko next phase me AI service se connect karenge.`
    );
  };

  const updateSelected = (changes: any) => {
    const c = canvas();
    const obj = c?.getActiveObject();

    if (!c || !obj) return;

    const objectType = String(obj.type || obj.constructor?.name || "").toLowerCase();
    const isTextObject = ["textbox", "text", "i-text", "itext"].includes(objectType);
    const textAnchor = isTextObject
      ? obj.getPositionByOrigin("left", "top")
      : null;

    if (objectType === "group" && typeof (obj as any).getObjects === "function") {
      const children = (obj as any).getObjects() as FabricObject[];

      if (typeof changes.fill === "string") {
        children.forEach((child: any) => {
          const childFill = child.fill;
          if (childFill !== "transparent" && childFill !== "#ffffff" && childFill !== "white") {
            child.set({ fill: changes.fill });
          }
          if (child.stroke && child.stroke !== "transparent" && child.stroke !== "#ffffff" && child.stroke !== "white") {
            child.set({ stroke: changes.fill });
          }
        });
      }

      if (typeof changes.stroke === "string") {
        children.forEach((child: any) => {
          if (child.stroke && child.stroke !== "transparent") {
            child.set({ stroke: changes.stroke });
          }
        });
      }

      obj.set(changes);
    } else {
      obj.set(changes);
    }

    if (isTextObject && textAnchor) {
      const anyText = obj as any;
      if (typeof anyText.initDimensions === "function") {
        anyText.initDimensions();
      }
      obj.set({ originX: "left", originY: "top" });
      obj.setPositionByOrigin(textAnchor, "left", "top");
    }

    obj.setCoords();
    c.requestRenderAll();

    setSelected(snapshotObject(obj));
    saveHistory();
  };

  const startInteractiveCrop = () => {
    const c = canvas();
    const obj = c?.getActiveObject();

    if (
      !c ||
      !obj ||
      !["image", "fabricimage"].includes(
        String(obj.type || obj.constructor?.name || "").toLowerCase()
      )
    ) {
      window.alert("Pehle image select karo.");
      return;
    }

    const img = obj as FabricImage;
    const element = img.getElement() as HTMLImageElement;

    const sourceWidth =
      element.naturalWidth ||
      element.width ||
      img.width ||
      1;

    const sourceHeight =
      element.naturalHeight ||
      element.height ||
      img.height ||
      1;

    cropSessionRef.current = {
      object: img,
      original: {
        left: img.left || 0,
        top: img.top || 0,
        width: img.width || sourceWidth,
        height: img.height || sourceHeight,
        cropX: img.cropX || 0,
        cropY: img.cropY || 0,
        scaleX: img.scaleX || 1,
        scaleY: img.scaleY || 1,
        angle: img.angle || 0,
        lockScalingX: !!img.lockScalingX,
        lockScalingY: !!img.lockScalingY,
        lockRotation: !!img.lockRotation,
      },
      fixedLeft: img.left || 0,
      fixedTop: img.top || 0,
      startCropX: img.cropX || 0,
      startCropY: img.cropY || 0,
      sourceWidth,
      sourceHeight,
    };

    // A completely uncropped Fabric image has no room to pan, so Crop can
    // look like it does nothing. Start with a subtle centered crop window
    // while preserving the same on-canvas size; Cancel restores the original.
    const isUncropped =
      Math.abs((img.cropX || 0)) < 0.01 &&
      Math.abs((img.cropY || 0)) < 0.01 &&
      Math.abs((img.width || sourceWidth) - sourceWidth) < 1 &&
      Math.abs((img.height || sourceHeight) - sourceHeight) < 1;

    if (isUncropped && sourceWidth > 10 && sourceHeight > 10) {
      const center = img.getCenterPoint();
      const visualWidth = sourceWidth * Math.abs(img.scaleX || 1);
      const visualHeight = sourceHeight * Math.abs(img.scaleY || 1);
      const cropWidth = sourceWidth * 0.9;
      const cropHeight = sourceHeight * 0.9;

      img.set({
        width: cropWidth,
        height: cropHeight,
        cropX: (sourceWidth - cropWidth) / 2,
        cropY: (sourceHeight - cropHeight) / 2,
        scaleX: visualWidth / cropWidth,
        scaleY: visualHeight / cropHeight,
      });

      img.setPositionByOrigin(center as any, "center", "center");
      img.setCoords();

      cropSessionRef.current.fixedLeft = img.left || 0;
      cropSessionRef.current.fixedTop = img.top || 0;
      cropSessionRef.current.startCropX = img.cropX || 0;
      cropSessionRef.current.startCropY = img.cropY || 0;
    }

    img.set({
      lockScalingX: true,
      lockScalingY: true,
      lockRotation: true,
    });

    img.setCoords();
    c.setActiveObject(img);
    c.renderAll();

    setCropMode(true);
    setActivePanel("imageEdit");
    setContextMenu(null);
    setSelected(snapshotObject(img));
  };

  const finishInteractiveCrop = () => {
    const c = canvas();
    const session = cropSessionRef.current;

    if (!c || !session) return;

    session.object.set({
      lockScalingX: session.original.lockScalingX,
      lockScalingY: session.original.lockScalingY,
      lockRotation: session.original.lockRotation,
    });

    session.object.setCoords();
    c.renderAll();

    setSelected(snapshotObject(session.object));
    cropSessionRef.current = null;
    setCropMode(false);
    saveHistory();
  };

  const cancelInteractiveCrop = () => {
    const c = canvas();
    const session = cropSessionRef.current;

    if (!c || !session) return;

    session.object.set({
      left: session.original.left,
      top: session.original.top,
      width: session.original.width,
      height: session.original.height,
      cropX: session.original.cropX,
      cropY: session.original.cropY,
      scaleX: session.original.scaleX,
      scaleY: session.original.scaleY,
      angle: session.original.angle,
      lockScalingX: session.original.lockScalingX,
      lockScalingY: session.original.lockScalingY,
      lockRotation: session.original.lockRotation,
    });

    session.object.setCoords();
    c.setActiveObject(session.object);
    c.renderAll();

    setSelected(snapshotObject(session.object));
    cropSessionRef.current = null;
    setCropMode(false);
  };

  const rotateCropImage = (angle: number) => {
    const c = canvas();
    const session = cropSessionRef.current;

    if (!c || !session) return;

    session.object.set({ angle });
    session.object.setCoords();
    c.renderAll();

    setSelected(snapshotObject(session.object));
  };

  const copySelected = async () => {
    const c = canvas();
    const obj = c?.getActiveObject();

    if (!c || !obj) return;

    clipboardRef.current = await obj.clone();
    setContextMenu(null);
  };

  const pasteClipboard = async () => {
    const c = canvas();
    const stored = clipboardRef.current;

    if (!c || !stored) return;

    const clone = await stored.clone();

    clone.set({
      left: (clone.left || 0) + 30,
      top: (clone.top || 0) + 30,
      evented: true,
      selectable: true,
    });

    c.add(clone);
    c.setActiveObject(clone);
    c.renderAll();

    clipboardRef.current = await clone.clone();

    setSelected(snapshotObject(clone));
    setContextMenu(null);
    saveHistory();
  };

  const copySelectedStyle = () => {
    const c = canvas();
    const obj = c?.getActiveObject() as any;

    if (!c || !obj) return;

    styleClipboardRef.current = {
      fill: obj.fill,
      stroke: obj.stroke,
      strokeWidth: obj.strokeWidth,
      opacity: obj.opacity,
      fontFamily: obj.fontFamily,
      fontSize: obj.fontSize,
      fontWeight: obj.fontWeight,
      fontStyle: obj.fontStyle,
      underline: obj.underline,
      linethrough: obj.linethrough,
      textAlign: obj.textAlign,
      charSpacing: obj.charSpacing,
      lineHeight: obj.lineHeight,
      rx: obj.rx,
      ry: obj.ry,
    };

    setContextMenu(null);
  };

  const pasteSelectedStyle = () => {
    const c = canvas();
    const obj = c?.getActiveObject();

    if (!c || !obj || !styleClipboardRef.current) return;

    const clean = Object.fromEntries(
      Object.entries(styleClipboardRef.current).filter(
        ([, value]) => value !== undefined
      )
    );

    obj.set(clean);
    obj.setCoords();
    c.renderAll();

    setSelected(snapshotObject(obj));
    setContextMenu(null);
    saveHistory();
  };

  const alignSelectedToPage = (
    align:
      | "left"
      | "center"
      | "right"
      | "top"
      | "middle"
      | "bottom"
  ) => {
    const c = canvas();
    const obj = c?.getActiveObject();

    if (!c || !obj) return;

    const box = obj.getBoundingRect();
    const center = obj.getCenterPoint();

    if (align === "center") {
      obj.setPositionByOrigin(
        { x: c.getWidth() / 2, y: center.y } as any,
        "center",
        "center"
      );
    }

    if (align === "middle") {
      obj.setPositionByOrigin(
        { x: center.x, y: c.getHeight() / 2 } as any,
        "center",
        "center"
      );
    }

    if (align === "left") {
      obj.set({
        left: (obj.left || 0) - box.left,
      });
    }

    if (align === "right") {
      obj.set({
        left:
          (obj.left || 0) +
          (c.getWidth() - (box.left + box.width)),
      });
    }

    if (align === "top") {
      obj.set({
        top: (obj.top || 0) - box.top,
      });
    }

    if (align === "bottom") {
      obj.set({
        top:
          (obj.top || 0) +
          (c.getHeight() - (box.top + box.height)),
      });
    }

    obj.setCoords();
    c.renderAll();

    setSelected(snapshotObject(obj));
    setContextMenu(null);
    saveHistory();
  };

  const addLinkToSelected = () => {
    const c = canvas();
    const obj = c?.getActiveObject() as any;

    if (!c || !obj) return;

    const current = obj.data?.link || "";
    const url = window.prompt("Link URL:", current);

    if (url === null) return;

    obj.set({
      data: {
        ...(obj.data || {}),
        link: url.trim(),
      },
    } as any);

    setContextMenu(null);
    saveHistory();
  };

  const addAltTextToSelected = () => {
    const c = canvas();
    const obj = c?.getActiveObject() as any;

    if (!c || !obj) return;

    const current = obj.data?.altText || "";
    const text = window.prompt("Alternative text:", current);

    if (text === null) return;

    obj.set({
      data: {
        ...(obj.data || {}),
        altText: text,
      },
    } as any);

    setContextMenu(null);
    saveHistory();
  };

  const applySelectedColorToPage = () => {
    const c = canvas();
    const obj = c?.getActiveObject() as any;

    if (!c || !obj) return;

    if (typeof obj.fill !== "string") {
      window.alert("Selected element ka solid color available nahi hai.");
      return;
    }

    c.backgroundColor = obj.fill;
    setBackground(obj.fill);
    c.renderAll();

    setContextMenu(null);
    saveHistory();
  };

  const downloadSelection = () => {
    const c = canvas();
    const obj = c?.getActiveObject();

    if (!c || !obj) return;

    const data = obj.toDataURL({
      format: "png",
      multiplier: 2,
    });

    const link = document.createElement("a");
    link.href = data;
    link.download = "kriyavo-selection.png";
    link.click();

    setContextMenu(null);
  };

  const showSelectedInfo = () => {
    const c = canvas();
    const obj = c?.getActiveObject();

    if (!c || !obj) return;

    const box = obj.getBoundingRect();

    window.alert(
      [
        `Type: ${String(obj.type || "object")}`,
        `Position: ${Math.round(box.left)}, ${Math.round(box.top)}`,
        `Size: ${Math.round(box.width)} × ${Math.round(box.height)}`,
        `Rotation: ${Math.round(obj.angle || 0)}°`,
        `Opacity: ${Math.round((obj.opacity ?? 1) * 100)}%`,
      ].join("\n")
    );

    setContextMenu(null);
  };

  const cropSelectedImagePreset = (aspect: number) => {
    const c = canvas();
    const obj = c?.getActiveObject();

    if (
      !c ||
      !obj ||
      !["image", "fabricimage"].includes(
        String(obj.type || obj.constructor?.name || "").toLowerCase()
      )
    ) {
      return;
    }

    if (!cropSessionRef.current) {
      startInteractiveCrop();
    }

    const img = obj as FabricImage;
    const element = img.getElement() as HTMLImageElement;

    const sourceWidth =
      element.naturalWidth ||
      element.width ||
      img.width ||
      1;

    const sourceHeight =
      element.naturalHeight ||
      element.height ||
      img.height ||
      1;

    const center = img.getCenterPoint();

    let cropWidth = sourceWidth;
    let cropHeight = cropWidth / aspect;

    if (cropHeight > sourceHeight) {
      cropHeight = sourceHeight;
      cropWidth = cropHeight * aspect;
    }

    img.set({
      cropX: Math.max(0, (sourceWidth - cropWidth) / 2),
      cropY: Math.max(0, (sourceHeight - cropHeight) / 2),
      width: cropWidth,
      height: cropHeight,
    });

    img.setPositionByOrigin(center as any, "center", "center");
    img.setCoords();

    const session = cropSessionRef.current;

    if (session) {
      session.fixedLeft = img.left || 0;
      session.fixedTop = img.top || 0;
      session.startCropX = img.cropX || 0;
      session.startCropY = img.cropY || 0;
      session.sourceWidth = sourceWidth;
      session.sourceHeight = sourceHeight;
    }

    c.setActiveObject(img);
    c.renderAll();

    setSelected(snapshotObject(img));
  };

  const resetSelectedImageCrop = () => {
    const c = canvas();
    const obj = c?.getActiveObject();

    if (
      !c ||
      !obj ||
      !["image", "fabricimage"].includes(
        String(obj.type || obj.constructor?.name || "").toLowerCase()
      )
    ) {
      return;
    }

    const img = obj as FabricImage;
    const element = img.getElement() as HTMLImageElement;
    const center = img.getCenterPoint();

    const sourceWidth =
      element.naturalWidth ||
      element.width ||
      img.width ||
      1;

    const sourceHeight =
      element.naturalHeight ||
      element.height ||
      img.height ||
      1;

    img.set({
      cropX: 0,
      cropY: 0,
      width: sourceWidth,
      height: sourceHeight,
    });

    img.setPositionByOrigin(center as any, "center", "center");
    img.setCoords();

    const session = cropSessionRef.current;

    if (session) {
      session.fixedLeft = img.left || 0;
      session.fixedTop = img.top || 0;
      session.startCropX = 0;
      session.startCropY = 0;
    }

    c.renderAll();
    setSelected(snapshotObject(img));
    saveHistory();
  };

  const deleteSelected = () => {
    const c = canvas();
    const obj = c?.getActiveObject();

    if (!c || !obj) return;

    const type = String(obj.type || "").toLowerCase();

    if (["activeselection", "active-selection"].includes(type)) {
      const members = (obj as ActiveSelection).getObjects();
      c.discardActiveObject();
      c.remove(...members);
    } else {
      c.remove(obj);
      c.discardActiveObject();
    }

    c.requestRenderAll();
    setSelected(null);
    refreshObjects();
    saveHistory();
  };

  const duplicateSelected = async () => {
    const c = canvas();
    const obj = c?.getActiveObject();

    if (!c || !obj) return;

    const type = String(obj.type || "").toLowerCase();

    if (["activeselection", "active-selection"].includes(type)) {
      const members = (obj as ActiveSelection).getObjects();
      const clones = await Promise.all(members.map((member) => member.clone()));

      clones.forEach((clone) => {
        clone.set({
          left: (clone.left || 0) + 30,
          top: (clone.top || 0) + 30,
        });
        clone.setCoords();
        c.add(clone);
      });

      const selection = new ActiveSelection(clones, { canvas: c });
      c.setActiveObject(selection);
      selection.setCoords();
      c.requestRenderAll();
      setSelected(snapshotObject(selection));
      refreshObjects();
      saveHistory();
      return;
    }

    const clone = await obj.clone();

    clone.set({
      left: (obj.left || 0) + 30,
      top: (obj.top || 0) + 30,
    });

    c.add(clone);
    c.setActiveObject(clone);
    c.requestRenderAll();

    setSelected(snapshotObject(clone));
    refreshObjects();
    saveHistory();
  };

  const bringForward = () => {
    const c = canvas();
    const obj = c?.getActiveObject();
    if (!c || !obj) return;

    c.bringObjectForward(obj);
    c.renderAll();
    saveHistory();
  };

  const sendBackward = () => {
    const c = canvas();
    const obj = c?.getActiveObject();
    if (!c || !obj) return;

    c.sendObjectBackwards(obj);
    c.renderAll();
    saveHistory();
  };

  const bringToFront = () => {
    const c = canvas();
    const obj = c?.getActiveObject();
    if (!c || !obj) return;

    c.bringObjectToFront(obj);
    c.renderAll();
    saveHistory();
  };

  const sendToBack = () => {
    const c = canvas();
    const obj = c?.getActiveObject();
    if (!c || !obj) return;

    c.sendObjectToBack(obj);
    c.renderAll();
    saveHistory();
  };

  const toggleSelectedLock = () => {
    const c = canvas();
    const obj = c?.getActiveObject();

    if (!c || !obj) return;

    const nextLocked = obj.selectable !== false;

    obj.set({
      selectable: !nextLocked,
      evented: !nextLocked,
      lockMovementX: nextLocked,
      lockMovementY: nextLocked,
      lockScalingX: nextLocked,
      lockScalingY: nextLocked,
      lockRotation: nextLocked,
    });

    if (nextLocked) {
      c.discardActiveObject();
      setSelected(null);
    }

    c.renderAll();
    refreshObjects();
    saveHistory();
  };

  const toggleSelectedVisibility = () => {
    const c = canvas();
    const obj = c?.getActiveObject();

    if (!c || !obj) return;

    const visible = obj.visible !== false;
    obj.set({ visible: !visible });

    if (visible) {
      c.discardActiveObject();
      setSelected(null);
    }

    c.renderAll();
    refreshObjects();
    saveHistory();
  };

  const flipHorizontal = () => {
    const c = canvas();
    const obj = c?.getActiveObject();
    if (!c || !obj) return;

    obj.set({ flipX: !obj.flipX });
    c.renderAll();

    setSelected(snapshotObject(obj));
    saveHistory();
  };

  const flipVertical = () => {
    const c = canvas();
    const obj = c?.getActiveObject();
    if (!c || !obj) return;

    obj.set({ flipY: !obj.flipY });
    c.renderAll();

    setSelected(snapshotObject(obj));
    saveHistory();
  };

  const undo = async () => {
    const c = canvas();
    if (!c || historyIndexRef.current <= 0) return;

    historyIndexRef.current--;

    restoringRef.current = true;
    await c.loadFromJSON(JSON.parse(historyRef.current[historyIndexRef.current]));
    normalizeLoadedObjectOrigins(c);
    c.renderAll();
    restoringRef.current = false;

    setSelected(null);
    refreshObjects();
    updateHistoryButtons();
  };

  const redo = async () => {
    const c = canvas();

    if (
      !c ||
      historyIndexRef.current >= historyRef.current.length - 1
    ) {
      return;
    }

    historyIndexRef.current++;

    restoringRef.current = true;
    await c.loadFromJSON(JSON.parse(historyRef.current[historyIndexRef.current]));
    normalizeLoadedObjectOrigins(c);
    c.renderAll();
    restoringRef.current = false;

    setSelected(null);
    refreshObjects();
    updateHistoryButtons();
  };

  const fitZoomForFormat = (
    nextFormat: Format
  ) => {
    const size = getEditorCanvasSize(nextFormat);

    if (typeof window !== "undefined" && window.innerWidth < 768) {
      const availableWidth = Math.max(240, window.innerWidth - 24);
      const availableHeight = Math.max(280, window.innerHeight - 252);
      const widthZoom = (availableWidth / Math.max(1, size.width)) * 100;
      const heightZoom = (availableHeight / Math.max(1, size.height)) * 100;

      return Math.max(16, Math.min(52, Math.floor(Math.min(widthZoom, heightZoom))));
    }

    const maxSide = Math.max(size.width, size.height);

    if (maxSide >= 1350) return 57;
    if (maxSide >= 1100) return 62;
    return 68;
  };

  const resizeDesign = (
    newFormat: Format,
    copyFirst = false
  ) => {
    const c = canvas();
    if (!c) return;

    const nextEditorSize =
      getEditorCanvasSize(
        newFormat
      );

    if (
      newFormat.width <= 0 ||
      newFormat.height <= 0
    ) {
      window.alert("Width aur height 0 se bade hone chahiye.");
      return;
    }

    if (copyFirst) {
      const originalPages = snapshotAllPages(c);
      const originalIndex = Math.min(
        Math.max(0, activePageIndexRef.current),
        originalPages.length - 1
      );
      const originalActive = originalPages[originalIndex];

      const originalProject: SavedProject = {
        id: crypto.randomUUID(),
        name: `${projectName.trim() || "Untitled Design"} - ${format.name}`,
        format,
        background: originalActive.background,
        design: originalActive.design,
        pages: originalPages,
        activePageIndex: originalIndex,
        updatedAt: Date.now(),
      };

      const updated = [originalProject, ...projects];
      setProjects(updated);
      saveProjects(updated);

      setProjectName(
        `${projectName.trim() || "Untitled Design"} - ${newFormat.name}`
      );
    }

    smartReflowCanvas(
      c,
      nextEditorSize.width,
      nextEditorSize.height
    );

    syncCanvasDimensions(
      c,
      nextEditorSize.width,
      nextEditorSize.height
    );

    c.discardActiveObject();
    c.renderAll();

    setFormat(newFormat);
    setTemplateScope("format");
    setZoom(fitZoomForFormat(newFormat));
    setSelected(null);
    setShowResize(false);

    refreshObjects();
    saveHistory();
    commitPages(snapshotAllPages(c));
  };

  const createResizeVariants = async (
    targetFormats: Format[]
  ) => {
    const sourceCanvas = canvas();

    if (!sourceCanvas || !targetFormats.length) {
      return;
    }

    const sourcePages = snapshotAllPages(sourceCanvas);
    const sourcePageIndex = Math.min(
      Math.max(0, activePageIndexRef.current),
      sourcePages.length - 1
    );

    const createdProjects: SavedProject[] = [];

    for (const targetFormat of targetFormats) {
      const targetSize = getEditorCanvasSize(targetFormat);
      const variantPages: DesignPage[] = [];

      for (const sourcePage of sourcePages) {
        const sourceWidth = Math.max(
          1,
          Number(sourcePage.width || sourceCanvas.getWidth())
        );
        const sourceHeight = Math.max(
          1,
          Number(sourcePage.height || sourceCanvas.getHeight())
        );
        const tempElement = document.createElement("canvas");
        const tempCanvas = new Canvas(tempElement, {
          width: sourceWidth,
          height: sourceHeight,
          backgroundColor: sourcePage.background,
          enableRetinaScaling: false,
          preserveObjectStacking: true,
        } as any);

        try {
          await tempCanvas.loadFromJSON(JSON.parse(sourcePage.design));
          normalizeLoadedObjectOrigins(tempCanvas);
          tempCanvas.backgroundColor = sourcePage.background;

          smartReflowCanvas(
            tempCanvas,
            targetSize.width,
            targetSize.height
          );

          variantPages.push({
            id: makePageId(),
            design: JSON.stringify(tempCanvas.toJSON()),
            background:
              typeof tempCanvas.backgroundColor === "string"
                ? tempCanvas.backgroundColor
                : sourcePage.background,
            width: targetSize.width,
            height: targetSize.height,
          });
        } finally {
          void tempCanvas.dispose();
        }
      }

      if (!variantPages.length) continue;

      const variantIndex = Math.min(
        sourcePageIndex,
        variantPages.length - 1
      );
      const activeVariant = variantPages[variantIndex];

      createdProjects.push({
        id: crypto.randomUUID(),
        name: `${projectName.trim() || "Untitled Design"} - ${targetFormat.name}`,
        format: targetFormat,
        background: activeVariant.background,
        design: activeVariant.design,
        pages: variantPages,
        activePageIndex: variantIndex,
        updatedAt: Date.now(),
      });
    }

    if (!createdProjects.length) {
      return;
    }

    const updatedProjects = [
      ...createdProjects,
      ...projects,
    ];

    setProjects(updatedProjects);
    saveProjects(updatedProjects);
    setShowResize(false);
    setShowProjects(true);

    window.alert(
      `${createdProjects.length} smart resize version${createdProjects.length === 1 ? "" : "s"} create ho gaye. Har version me saare pages preserve hain.`
    );
  };

  const changeFormat = (newFormat: Format) => {
    resizeDesign(newFormat, false);
  };

  const changeBackground = (e: React.ChangeEvent<HTMLInputElement>) => {
    const c = canvas();
    if (!c) return;

    c.backgroundColor = e.target.value;
    c.renderAll();

    setBackground(e.target.value);
    saveHistory();
  };

  const clearDesign = () => {
    const c = canvas();
    if (!c) return;

    if (!confirm("Clear this design?")) return;

    c.clear();
    c.backgroundColor = background;
    c.renderAll();

    setSelected(null);
    saveHistory();
  };

  const loadTemplate = (type: TemplateType) => {
    const c = canvas();
    if (!c) return;

    const templateFormat = getTemplateFormat(type);

    if (templateFormat) {
      syncCanvasToFormat(c, templateFormat);

      setFormat(templateFormat);
      setZoom(fitZoomForFormat(templateFormat));
    }

    applyTemplate(c, type);
    c.calcOffset();
    c.requestRenderAll();

    setTemplateScope("format");
    setBackground(
      typeof c.backgroundColor === "string"
        ? c.backgroundColor
        : "#ffffff"
    );

    setProjectName(
      type.startsWith("resume-")
        ? "New Resume"
        : type.startsWith("festival-")
        ? "New Festival Design"
        : "New Social Design"
    );

    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setActivePanel(null);
    } else if (type.startsWith("festival-")) {
      setActivePanel("festival");
    }

    setSelected(null);
    refreshObjects();
    saveHistory();
  };

  const buildStructuredResume = async () => {
    const c = canvas();
    if (!c) return;

    const a4 =
      FORMATS.find(
        (item) =>
          item.name ===
          "A4 Portrait"
      ) || {
        name:
          "A4 Portrait",
        width: 2480,
        height: 3508,
      };

    syncCanvasToFormat(
      c,
      a4
    );

    await buildResumeFromData(
      c,
      resumeData,
      resumeTheme
    );

    setFormat(a4);
    setZoom(
      fitZoomForFormat(
        a4
      )
    );
    setTemplateScope(
      "format"
    );

    setBackground(
      typeof c.backgroundColor ===
      "string"
        ? c.backgroundColor
        : "#ffffff"
    );

    setProjectName(
      `${resumeData.name.trim() || "New"} Resume`
    );

    setSelected(null);
    refreshObjects();
    saveHistory();
  };

  const cleanDownloadName = () =>
    (
      projectName.trim() ||
      "kriyavo"
    ).replace(
      /[\/:*?"<>|]+/g,
      "-"
    );

  const getExportMultiplier = (
    qualityMultiplier = 1
  ) => {
    const c = canvas();

    if (!c) return 1;

    const exactScale =
      format.width /
      c.getWidth();

    return (
      exactScale *
      qualityMultiplier
    );
  };

  const renderDataUrl = (
    type: "png" | "jpeg",
    qualityMultiplier = 1
  ) => {
    const c = canvas();

    if (!c) return null;

    c.discardActiveObject();
    c.requestRenderAll();

    return c.toDataURL({
      format: type,
      quality:
        type === "jpeg"
          ? 0.95
          : undefined,
      multiplier:
        getExportMultiplier(
          qualityMultiplier
        ),
    });
  };

  const downloadBlob = (
    blob: Blob,
    filename: string
  ) => {
    const url =
      URL.createObjectURL(
        blob
      );

    const link =
      document.createElement(
        "a"
      );

    link.href = url;
    link.download = filename;

    document.body.appendChild(
      link
    );

    link.click();
    link.remove();

    setTimeout(
      () =>
        URL.revokeObjectURL(
          url
        ),
      500
    );
  };

  const downloadDataUrl = (
    data: string,
    filename: string
  ) => {
    const link =
      document.createElement(
        "a"
      );

    link.href = data;
    link.download = filename;

    document.body.appendChild(
      link
    );

    link.click();
    link.remove();
  };

  const dataUrlToBytes = (
    dataUrl: string
  ) => {
    const base64 =
      dataUrl.split(",")[1];

    const binary =
      atob(base64);

    const bytes =
      new Uint8Array(
        binary.length
      );

    for (
      let i = 0;
      i < binary.length;
      i++
    ) {
      bytes[i] =
        binary.charCodeAt(i);
    }

    return bytes;
  };

  const buildMultiPagePdf = (
    pdfPages: Array<{
      jpegBytes: Uint8Array;
      imageWidth: number;
      imageHeight: number;
    }>
  ) => {
    const encoder = new TextEncoder();
    const chunks: Uint8Array[] = [];
    const totalObjects = 2 + pdfPages.length * 3;
    const offsets: number[] = new Array(totalObjects + 1).fill(0);
    let byteOffset = 0;

    const pushBytes = (bytes: Uint8Array) => {
      chunks.push(bytes);
      byteOffset += bytes.length;
    };

    const pushText = (value: string) => {
      pushBytes(encoder.encode(value));
    };

    const startObject = (objectNumber: number) => {
      offsets[objectNumber] = byteOffset;
      pushText(`${objectNumber} 0 obj\n`);
    };

    pushText("%PDF-1.4\n");

    startObject(1);
    pushText("<< /Type /Catalog /Pages 2 0 R >>\nendobj\n");

    const pageObjectNumbers = pdfPages.map((_, index) => 3 + index * 3);

    startObject(2);
    pushText(
      `<< /Type /Pages /Kids [${pageObjectNumbers
        .map((number) => `${number} 0 R`)
        .join(" ")}] /Count ${pdfPages.length} >>\nendobj\n`
    );

    pdfPages.forEach((page, index) => {
      const pageObject = 3 + index * 3;
      const imageObject = pageObject + 1;
      const contentObject = pageObject + 2;
      const ratio = page.imageWidth / page.imageHeight;

      let pageWidth: number;
      let pageHeight: number;

      if (ratio > 1) {
        pageWidth = 841.89;
        pageHeight = pageWidth / ratio;
      } else {
        pageHeight = 841.89;
        pageWidth = pageHeight * ratio;
      }

      startObject(pageObject);
      pushText(
        `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth.toFixed(
          2
        )} ${pageHeight.toFixed(
          2
        )}] /Resources << /XObject << /Im0 ${imageObject} 0 R >> >> /Contents ${contentObject} 0 R >>\nendobj\n`
      );

      startObject(imageObject);
      pushText(
        `<< /Type /XObject /Subtype /Image /Width ${page.imageWidth} /Height ${page.imageHeight} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${page.jpegBytes.length} >>\nstream\n`
      );
      pushBytes(page.jpegBytes);
      pushText("\nendstream\nendobj\n");

      const content = `q\n${pageWidth.toFixed(2)} 0 0 ${pageHeight.toFixed(
        2
      )} 0 0 cm\n/Im0 Do\nQ\n`;
      const contentBytes = encoder.encode(content);

      startObject(contentObject);
      pushText(`<< /Length ${contentBytes.length} >>\nstream\n`);
      pushBytes(contentBytes);
      pushText("endstream\nendobj\n");
    });

    const xrefOffset = byteOffset;

    pushText(`xref\n0 ${totalObjects + 1}\n`);
    pushText("0000000000 65535 f \n");

    for (let i = 1; i <= totalObjects; i++) {
      pushText(`${String(offsets[i] || 0).padStart(10, "0")} 00000 n \n`);
    }

    pushText(
      `trailer\n<< /Size ${totalObjects + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`
    );

    const totalLength = chunks.reduce(
      (total, chunk) => total + chunk.length,
      0
    );
    const output = new Uint8Array(totalLength);
    let cursor = 0;

    chunks.forEach((chunk) => {
      output.set(chunk, cursor);
      cursor += chunk.length;
    });

    return output;
  };

  const renderStoredPageForPdf = async (page: DesignPage) => {
    const targetSize = getEditorCanvasSize(format);
    const sourceWidth = Math.max(1, Number(page.width || targetSize.width));
    const sourceHeight = Math.max(1, Number(page.height || targetSize.height));
    const tempElement = document.createElement("canvas");
    const tempCanvas = new Canvas(tempElement, {
      width: sourceWidth,
      height: sourceHeight,
      backgroundColor: page.background,
      enableRetinaScaling: false,
      preserveObjectStacking: true,
    } as any);

    try {
      await tempCanvas.loadFromJSON(JSON.parse(page.design));
      normalizeLoadedObjectOrigins(tempCanvas);
      tempCanvas.backgroundColor = page.background;

      if (
        sourceWidth !== targetSize.width ||
        sourceHeight !== targetSize.height
      ) {
        smartReflowCanvas(tempCanvas, targetSize.width, targetSize.height);
      }

      tempCanvas.discardActiveObject();
      tempCanvas.requestRenderAll();

      const exportMultiplier = format.width / tempCanvas.getWidth();
      const jpeg = tempCanvas.toDataURL({
        format: "jpeg",
        quality: 0.95,
        multiplier: exportMultiplier,
      });

      return {
        jpegBytes: dataUrlToBytes(jpeg),
        imageWidth: Math.round(tempCanvas.getWidth() * exportMultiplier),
        imageHeight: Math.round(tempCanvas.getHeight() * exportMultiplier),
      };
    } finally {
      void tempCanvas.dispose();
    }
  };

  const exportDesign = async (
    type: DownloadType,
    qualityMultiplier = 1
  ) => {
    const c = canvas();

    if (!c) return;

    const filename =
      cleanDownloadName();

    if (
      type === "png" ||
      type === "jpeg"
    ) {
      const data =
        renderDataUrl(
          type,
          qualityMultiplier
        );

      if (!data) return;

      downloadDataUrl(
        data,
        `${filename}.${
          type === "jpeg"
            ? "jpg"
            : "png"
        }`
      );

      setShowDownload(
        false
      );

      return;
    }

    if (type === "svg") {
      c.discardActiveObject();
      c.requestRenderAll();

      const svg =
        c.toSVG();

      downloadBlob(
        new Blob(
          [svg],
          {
            type:
              "image/svg+xml;charset=utf-8",
          }
        ),
        `${filename}.svg`
      );

      setShowDownload(
        false
      );

      return;
    }

    const pageSnapshot = snapshotAllPages(c);
    const visiblePages = pageSnapshot.filter((page) => !page.hidden);
    const pdfPages = [] as Array<{
      jpegBytes: Uint8Array;
      imageWidth: number;
      imageHeight: number;
    }>;

    for (const page of visiblePages) {
      pdfPages.push(await renderStoredPageForPdf(page));
    }

    if (!pdfPages.length) {
      window.alert("Saare pages hidden hain. PDF export ke liye kam se kam 1 page unhide karo.");
      return;
    }

    const pdfBytes = buildMultiPagePdf(pdfPages);

    downloadBlob(
      new Blob([pdfBytes], {
        type: "application/pdf",
      }),
      `${filename}.pdf`
    );

    setShowDownload(false);
  };

  const shareDesign = async () => {
    const data =
      renderDataUrl(
        "png",
        1
      );

    if (!data) return;

    try {
      const response =
        await fetch(data);

      const blob =
        await response.blob();

      const file =
        new File(
          [blob],
          `${cleanDownloadName()}.png`,
          {
            type:
              "image/png",
          }
        );

      if (
        navigator.share &&
        (!navigator.canShare ||
          navigator.canShare({
            files: [file],
          }))
      ) {
        await navigator.share({
          title:
            projectName.trim() ||
            "Kriyavo design",
          text:
            "Created with Kriyavo",
          files: [file],
        });

        return;
      }

      await navigator.clipboard.writeText(
        window.location.href
      );

      window.alert(
        "Share link clipboard me copy ho gaya."
      );
    } catch (
      error: any
    ) {
      if (
        error?.name !==
        "AbortError"
      ) {
        window.alert(
          "Share complete nahi hua. Download button se file export karke share kar sakte ho."
        );
      }
    }
  };

  const saveProject = async () => {
    const c = canvas();
    if (!c) return;

    const projectPages = snapshotAllPages(c);
    const currentIndex = Math.min(
      Math.max(0, activePageIndexRef.current),
      projectPages.length - 1
    );
    const activePage = projectPages[currentIndex];

    commitPages(projectPages);

    const projectId = user
      ? getCurrentCloudDesignId(user.id)
      : crypto.randomUUID();

    const project: SavedProject = {
      id: projectId,
      name: projectName.trim() || "Untitled Design",
      format,
      background: activePage.background,
      design: activePage.design,
      pages: projectPages,
      activePageIndex: currentIndex,
      updatedAt: Date.now(),
    };

    const localProjects = loadProjects();
    const updatedLocal = [
      project,
      ...localProjects.filter((item) => item.id !== project.id),
    ];
    const updated = [project, ...projects.filter((item) => item.id !== project.id)];
    const didSave = saveProjects(updatedLocal);

    if (!didSave) {
      window.alert(
        "Project save nahi ho saka. Browser storage full ho sakta hai; heavy images ko compress karke try karo."
      );
      return;
    }

    setProjects(updated);

    if (user) {
      setCurrentCloudDesignId(user.id, project.id);
      await saveCloudProject(user.id, project);
      await refreshCloudProjects();
    }

    setSaved(true);
  };

  const loadProject = async (project: SavedProject) => {
    const c = canvas();
    if (!c) return;

    const projectPages: DesignPage[] = project.pages?.length
      ? project.pages
      : [
          {
            id: makePageId(),
            design: project.design,
            background: project.background,
          },
        ];
    const projectPageIndex = Math.min(
      Math.max(0, project.activePageIndex || 0),
      projectPages.length - 1
    );

    setFormat(project.format);
    setTemplateScope("format");
    setProjectName(project.name);
    if (user) setCurrentCloudDesignId(user.id, project.id);
    setSelected(null);
    setShowProjects(false);
    commitPages(projectPages);
    commitActivePageIndex(projectPageIndex);

    await loadDesignPage(projectPageIndex, projectPages, project.format);
    setShowPageManager(false);
    setSaved(true);
  };

  const deleteProject = (id: string) => {
    const localUpdated = loadProjects().filter((project) => project.id !== id);
    saveProjects(localUpdated);
    setProjects((current) => current.filter((project) => project.id !== id));

    if (user) {
      void deleteCloudProject(user.id, id);
    }
  };

  const selectLayer = (object: FabricObject) => {
    const c = canvas();
    if (!c) return;

    if (object.visible === false || object.selectable === false) return;

    c.setActiveObject(object);
    c.renderAll();
    setSelected(snapshotObject(object));
  };

  const toggleLayerVisibility = (object: FabricObject) => {
    const c = canvas();
    if (!c) return;

    const nextVisible = object.visible === false;
    object.set({ visible: nextVisible });

    if (!nextVisible && c.getActiveObject() === object) {
      c.discardActiveObject();
      setSelected(null);
    }

    c.renderAll();
    refreshObjects();
    saveHistory();
  };

  const toggleLayerLock = (object: FabricObject) => {
    const c = canvas();
    if (!c) return;

    const nextLocked = object.selectable !== false;

    object.set({
      selectable: !nextLocked,
      evented: !nextLocked,
      lockMovementX: nextLocked,
      lockMovementY: nextLocked,
      lockScalingX: nextLocked,
      lockScalingY: nextLocked,
      lockRotation: nextLocked,
    });

    if (nextLocked && c.getActiveObject() === object) {
      c.discardActiveObject();
      setSelected(null);
    }

    c.renderAll();
    refreshObjects();
    saveHistory();
  };

  const togglePanel = (panel: Exclude<EditorPanel, null>) => {
    setContextMenu(null);
    setActivePanel((current) => (current === panel ? null : panel));
  };

  return (
    <main className="h-[100dvh] overflow-hidden bg-[#f3f3f3] text-gray-900">
      <EditorHeader
        projectName={projectName}
        saved={saved}
        canUndo={historyState.undo}
        canRedo={historyState.redo}
        format={format}
        pageCount={Math.max(1, pages.length)}
        onProjectNameChange={(value) => {
          setProjectName(value);
          setSaved(false);
        }}
        onBack={() => history.back()}
        onProjects={() => setShowProjects(true)}
        onResize={() => {
          setContextMenu(null);
          setShowResize(true);
        }}
        onSave={saveProject}
        onUndo={() => void undo()}
        onRedo={() => void redo()}
        onShare={() => void shareDesign()}
        onDownload={() => {
          setContextMenu(null);
          setShowDownload(true);
        }}
      />

      <div className="relative flex h-[calc(100dvh-120px)] min-h-0 min-w-0 overflow-hidden md:h-[calc(100vh-100px)]">
        <LeftRail activePanel={activePanel} onTogglePanel={togglePanel} />

        <SidePanel
          activePanel={activePanel}
          format={format}
          templateScope={templateScope}
          background={background}
          objects={objects}
          selected={selected}
          cropMode={cropMode}
          brandKit={brandKit}
          resumeData={resumeData}
          resumeTheme={resumeTheme}
          onBrandKitChange={updateBrandKit}
          onResumeDataChange={updateResumeData}
          onResumeThemeChange={setResumeTheme}
          onBuildResume={buildStructuredResume}
          onResetResume={resetResumeData}
          onBrandLogoUpload={uploadBrandLogo}
          onAddBrandLogo={(logo) => void addBrandLogo(logo)}
          onRemoveBrandLogo={removeBrandLogo}
          onApplyBrandToDesign={applyBrandToDesign}
          onApplyBrandColorToSelected={applyBrandColorToSelected}
          onAddBrandHeading={() =>
            addBrandText(
              "YOUR BRAND HEADLINE",
              72,
              brandKit.headingFont,
              "bold"
            )
          }
          onAddBrandBody={() =>
            addBrandText(
              "Add your brand message here",
              30,
              brandKit.bodyFont
            )
          }
          onClose={() => {
            if (cropMode) {
              cancelInteractiveCrop();
            }
            setActivePanel(null);
          }}
          onFormatChange={changeFormat}
          onTemplate={loadTemplate}
          onAddHeading={() => addText("YOUR HEADLINE", 80, "bold")}
          onAddSubtitle={() => addText("Your subtitle", 42)}
          onAddBody={() => addText("Add your message here", 30)}
          onImageUpload={uploadImage}
          onBackgroundImageUpload={uploadBackgroundImage}
          onReplaceSelectedImage={replaceSelectedImage}
          onAddRectangle={addRectangle}
          onAddCircle={addCircle}
          onAddLine={addLine}
          onAddIcon={addIcon}
          onAddElement={addLibraryElement}
          onAddSmartFrame={(id) => void addSmartFrame(id)}
          onFrameImageUpload={uploadSmartFrameImage}
          onFrameFit={setSmartFrameFit}
          onFrameZoom={setSmartFrameZoom}
          onFramePanX={setSmartFramePanX}
          onFramePanY={setSmartFramePanY}
          onFrameBorderColor={setSmartFrameBorderColor}
          onFrameBorderWidth={setSmartFrameBorderWidth}
          onFrameRemoveImage={removeSmartFrameImage}
          onAddMockup={(id) => void addMockup(id)}
          onMockupImageUpload={uploadMockupImage}
          onMockupFit={setMockupFit}
          onMockupZoom={setMockupZoom}
          onMockupPanX={setMockupPanX}
          onMockupPanY={setMockupPanY}
          onMockupSurfaceColor={setMockupSurfaceColor}
          onMockupShadow={setMockupShadow}
          onMockupRemoveImage={removeMockupImage}
          onBackgroundChange={changeBackground}
          onSelectLayer={selectLayer}
          onToggleLayerVisibility={toggleLayerVisibility}
          onToggleLayerLock={toggleLayerLock}
          onClear={clearDesign}
          onImageAdjust={(changes) => rebuildImageFilters(changes)}
          onImagePreset={(preset) => rebuildImageFilters({ preset })}
          onImageCrop={updateImageCrop}
          onImageCropPreset={cropSelectedImagePreset}
          onImageCropReset={resetSelectedImageCrop}
          onRemoveImageBackground={(tolerance) =>
            void removePlainImageBackground(tolerance)
          }
          onRestoreImageBackground={() =>
            void restoreOriginalImage()
          }
          onStartCrop={startInteractiveCrop}
          onFinishCrop={finishInteractiveCrop}
          onCancelCrop={cancelInteractiveCrop}
          onRotateCrop={rotateCropImage}
          onSetImageAsBackground={setImageAsBackground}
          onUpdateSelected={updateSelected}
          onUnavailableTool={unavailableTool}
        />

        <div className="relative h-full min-h-0 min-w-0 flex-1 overflow-hidden">
          <ContextToolbar
            selected={selected}
            onUpdate={updateSelected}
            onDuplicate={() => void duplicateSelected()}
            onDelete={deleteSelected}
            onBringForward={bringForward}
            onSendBackward={sendBackward}
            onBringToFront={bringToFront}
            onSendToBack={sendToBack}
            onToggleLock={toggleSelectedLock}
            onToggleVisibility={toggleSelectedVisibility}
            onFlipHorizontal={flipHorizontal}
            onFlipVertical={flipVertical}
            onOpenPanel={(panel) => setActivePanel(panel)}
            onSetImageAsBackground={setImageAsBackground}
            onStartCrop={startInteractiveCrop}
            onToggleBullets={toggleBulletList}
            onOpenPosition={() => setShowPosition(true)}
            onGroup={groupSelected}
            onUngroup={ungroupSelected}
            onSelectAll={selectAllObjects}
            onUnavailableTool={unavailableTool}
          />

          <PositionPanel
            open={showPosition}
            selected={selected}
            onClose={() => setShowPosition(false)}
            onTransform={updateExactTransform}
            onAlign={alignSelectedToPage}
            onGroup={groupSelected}
            onUngroup={ungroupSelected}
            onSelectAll={selectAllObjects}
          />

          {cropMode && (
            <div className="pointer-events-none absolute left-1/2 top-20 z-30 -translate-x-1/2 rounded-full bg-black px-4 py-2 text-xs font-medium text-white shadow-lg">
              Crop mode · image drag karo · ratio choose karo · Done
            </div>
          )}

          <CanvasArea
            canvasRef={canvasElementRef}
            zoom={zoom}
            format={format}
            snapGuides={snapGuides}
            pages={pages}
            activePageIndex={activePageIndex}
            onZoomChange={setZoom}
            onSelectPage={selectDesignPage}
            onAddPageAfter={addDesignPageAfter}
            onDuplicatePage={duplicateDesignPageAt}
            onDeletePage={deleteDesignPageAt}
            onTogglePageHidden={toggleDesignPageHidden}
          />
        </div>
      </div>

      <DesktopPageBar
        pageCount={Math.max(1, pages.length)}
        activePageIndex={activePageIndex}
        zoom={zoom}
        showPages={showPageManager}
        onTogglePages={() => setShowPageManager((current) => !current)}
        onAddPage={addDesignPage}
        onDuplicatePage={duplicateDesignPage}
        onDeletePage={deleteDesignPage}
        onSelectPage={selectDesignPage}
        onZoomChange={setZoom}
      />

      {contextMenu && selected && (
        <RightClickMenu
          x={contextMenu.x}
          y={contextMenu.y}
          objectType={selected.type}
          locked={selected.selectable === false}
          onClose={() => setContextMenu(null)}
          onCopy={() => void copySelected()}
          onCopyStyle={copySelectedStyle}
          onPaste={() => void pasteClipboard()}
          onPasteStyle={pasteSelectedStyle}
          onDuplicate={() => {
            setContextMenu(null);
            void duplicateSelected();
          }}
          onDelete={() => {
            setContextMenu(null);
            deleteSelected();
          }}
          onBringToFront={() => {
            bringToFront();
            setContextMenu(null);
          }}
          onBringForward={() => {
            bringForward();
            setContextMenu(null);
          }}
          onSendBackward={() => {
            sendBackward();
            setContextMenu(null);
          }}
          onSendToBack={() => {
            sendToBack();
            setContextMenu(null);
          }}
          onAlign={alignSelectedToPage}
          onLock={() => {
            setContextMenu(null);
            toggleSelectedLock();
          }}
          onLink={addLinkToSelected}
          onAltText={addAltTextToSelected}
          onSetImageAsBackground={() => {
            setContextMenu(null);
            setImageAsBackground();
          }}
          onApplyColorToPage={applySelectedColorToPage}
          onDownloadSelection={downloadSelection}
          onInfo={showSelectedInfo}
          onUnavailable={unavailableTool}
        />
      )}

      <MobileToolbar
        onText={() => addText("YOUR HEADLINE", 70, "bold")}
        onUpload={uploadImage}
        onShape={addRectangle}
        onMockups={() => setActivePanel("mockups")}
        onDownload={() => setShowDownload(true)}
        onResize={() => setShowResize(true)}
        onShare={() => void shareDesign()}
        onSaveProject={saveProject}
        onTemplates={() => setActivePanel("templates")}
        onProjects={() => setShowProjects(true)}
        onOpenPanel={(panel) => setActivePanel(panel)}
      />

      <DownloadPanel
        open={showDownload}
        onClose={() =>
          setShowDownload(false)
        }
        onDownload={(type, multiplier) =>
          exportDesign(
            type,
            multiplier === 1
              ? 1
              : multiplier === 2
              ? 1.5
              : 2
          )
        }
      />

      <ResizePanel
        open={showResize}
        currentFormat={format}
        onClose={() => setShowResize(false)}
        onResize={(nextFormat, copyFirst) =>
          resizeDesign(nextFormat, copyFirst)
        }
        onCreateVariants={(formats) =>
          createResizeVariants(formats)
        }
      />

      <ProjectsModal
        open={showProjects}
        projects={projects}
        onClose={() => setShowProjects(false)}
        onLoad={(project) => void loadProject(project)}
        onDelete={deleteProject}
      />
    </main>
  );
}
