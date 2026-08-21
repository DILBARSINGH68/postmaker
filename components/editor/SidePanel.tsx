import { useEffect, useMemo, useState } from "react";
import type { FabricObject } from "fabric";

import MockupsPanel from "@/components/editor/MockupsPanel";
import BrandKitPanel from "@/components/editor/BrandKitPanel";
import ResumeBuilderPanel from "@/components/editor/ResumeBuilderPanel";
import SmartFramePanel from "@/components/editor/SmartFramePanel";

import type {
  EditorPanel,
  Format,
  ImagePreset,
  SelectedSnapshot,
  TemplateScope,
} from "@/types/editor";
import { FORMATS } from "@/lib/editor/formats";
import { ELEMENTS, ELEMENT_CATEGORIES, type ElementCategory } from "@/lib/editor/elements";
import type { MockupFit } from "@/lib/editor/mockups";
import type { BrandKit, BrandLogo } from "@/lib/editor/brandKit";
import type { ResumeData, ResumeTheme } from "@/lib/editor/resumeBuilder";
import type { SmartFrameFit } from "@/lib/editor/smartFrames";
import {
  TEMPLATE_CARDS,
  type TemplateCard,
  type TemplateType,
} from "@/lib/editor/templates";

type Props = {
  activePanel: EditorPanel;
  format: Format;
  templateScope: TemplateScope;
  background: string;
  objects: FabricObject[];
  selected: SelectedSnapshot | null;
  cropMode: boolean;
  brandKit: BrandKit;
  resumeData: ResumeData;
  resumeTheme: ResumeTheme;

  onClose: () => void;
  onBrandKitChange: (brandKit: BrandKit) => void;
  onResumeDataChange: (data: ResumeData) => void;
  onResumeThemeChange: (theme: ResumeTheme) => void;
  onBuildResume: () => void;
  onResetResume: () => void;
  onBrandLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddBrandLogo: (logo: BrandLogo) => void;
  onRemoveBrandLogo: (logoId: string) => void;
  onApplyBrandToDesign: () => void;
  onApplyBrandColorToSelected: (color: string) => void;
  onAddBrandHeading: () => void;
  onAddBrandBody: () => void;
  onFormatChange: (format: Format) => void;
  onTemplate: (type: TemplateType) => void;

  onAddHeading: () => void;
  onAddSubtitle: () => void;
  onAddBody: () => void;

  onImageUpload: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  onBackgroundImageUpload: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  onReplaceSelectedImage: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;

  onAddRectangle: () => void;
  onAddCircle: () => void;
  onAddLine: () => void;
  onAddIcon: (
    icon:
      | "star"
      | "heart"
      | "arrow"
      | "check"
      | "plus"
      | "bolt"
  ) => void;
  onAddElement: (id: string) => void;
  onAddSmartFrame: (id: string) => void;
  onFrameImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFrameFit: (fit: SmartFrameFit) => void;
  onFrameZoom: (value: number) => void;
  onFramePanX: (value: number) => void;
  onFramePanY: (value: number) => void;
  onFrameBorderColor: (value: string) => void;
  onFrameBorderWidth: (value: number) => void;
  onFrameRemoveImage: () => void;

  onAddMockup: (id: string) => void;
  onMockupImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMockupFit: (fit: MockupFit) => void;
  onMockupZoom: (value: number) => void;
  onMockupPanX: (value: number) => void;
  onMockupPanY: (value: number) => void;
  onMockupSurfaceColor: (value: string) => void;
  onMockupShadow: (value: number) => void;
  onMockupRemoveImage: () => void;

  onBackgroundChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;

  onSelectLayer: (object: FabricObject) => void;
  onToggleLayerVisibility: (
    object: FabricObject
  ) => void;
  onToggleLayerLock: (
    object: FabricObject
  ) => void;
  onClear: () => void;

  onImageAdjust: (changes: {
    brightness?: number;
    contrast?: number;
    saturation?: number;
    blur?: number;
  }) => void;
  onImagePreset: (preset: ImagePreset) => void;
  onImageCrop: (changes: {
    cropX?: number;
    cropY?: number;
  }) => void;
  onImageCropPreset: (aspect: number) => void;
  onImageCropReset: () => void;
  onRemoveImageBackground: (tolerance: number) => void;
  onRestoreImageBackground: () => void;
  onStartCrop: () => void;
  onFinishCrop: () => void;
  onCancelCrop: () => void;
  onRotateCrop: (angle: number) => void;
  onSetImageAsBackground: () => void;

  onUpdateSelected: (changes: any) => void;
  onUnavailableTool: (name: string) => void;
};

function layerName(
  object: FabricObject,
  index: number
) {
  const obj = object as any;

  if (obj.isMockup) {
    return obj.mockupName || `Mockup ${index + 1}`;
  }

  if (
    ["textbox", "text", "i-text"].includes(
      object.type || ""
    )
  ) {
    const text = String(
      obj.text || "Text"
    ).trim();

    return text
      ? text.slice(0, 28)
      : `Text ${index + 1}`;
  }

  if (object.type === "rect")
    return `Rectangle ${index + 1}`;

  if (object.type === "circle")
    return `Circle ${index + 1}`;

  if (object.type === "ellipse")
    return `Ellipse ${index + 1}`;

  if (object.type === "polygon")
    return `Shape ${index + 1}`;

  if (object.type === "group")
    return `Graphic ${index + 1}`;

  if (object.type === "line")
    return `Line ${index + 1}`;

  if (object.type === "path")
    return `Icon ${index + 1}`;

  if (object.type === "image")
    return `Image ${index + 1}`;

  return `${
    object.type || "Layer"
  } ${index + 1}`;
}

function RangeRow({
  label,
  min,
  max,
  step,
  value,
  onChange,
  suffix = "",
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  suffix?: string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-xs font-semibold text-gray-600">
          {label}
        </label>
        <span className="text-xs text-gray-400">
          {value}
          {suffix}
        </span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) =>
          onChange(
            Number(e.target.value)
          )
        }
        className="w-full"
      />
    </div>
  );
}


function templateRatio(formatName: string) {
  if (formatName === "Instagram Story") return "aspect-[9/16]";
  if (formatName === "Instagram Post (4:5)") return "aspect-[4/5]";
  if (formatName === "Festival Poster") return "aspect-[4/5]";
  if (formatName === "YouTube Thumbnail") return "aspect-video";
  if (formatName === "Facebook Post") return "aspect-[940/788]";
  if (formatName === "A4 Portrait") return "aspect-[210/297]";
  return "aspect-square";
}

function TemplateThumb({
  template,
}: {
  template: TemplateCard;
}) {
  const ratioClass = templateRatio(
    template.formatName
  );

  if (template.festival && template.image) {
    return (
      <div
        className={`relative mb-2 overflow-hidden rounded-lg border bg-white ${ratioClass}`}
      >
        <img
          src={template.image}
          alt={`${template.name} festival artwork`}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-x-2 bottom-2 rounded-lg bg-black/55 px-2 py-1 text-[9px] font-bold text-white backdrop-blur-sm">
          {template.region || "Indian Festival"}
        </div>
      </div>
    );
  }

  if (template.type.startsWith("flagship-") && template.kind === "social") {
    const variant = template.layout % 5;

    return (
      <div
        className={`relative mb-2 overflow-hidden rounded-lg border border-black/10 bg-white ${ratioClass}`}
        style={{ backgroundColor: template.bg }}
      >
        {template.image && (
          <img
            src={template.image}
            alt={`${template.name} flagship visual`}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background:
              variant === 0
                ? `linear-gradient(90deg, ${template.bg}f2 0%, ${template.bg}d8 48%, transparent 82%)`
                : variant === 1
                ? `linear-gradient(0deg, ${template.bg}f5 0%, ${template.bg}44 62%, transparent 100%)`
                : variant === 2
                ? `linear-gradient(135deg, ${template.bg}f0 0%, transparent 62%)`
                : variant === 3
                ? `linear-gradient(180deg, transparent 0%, ${template.bg}ee 78%)`
                : `linear-gradient(120deg, ${template.bg}ee 0%, ${template.bg}70 55%, transparent 100%)`,
          }}
        />
        <div className="absolute left-[7%] top-[8%] h-[4%] w-[26%] rounded-full" style={{ backgroundColor: template.accent }} />
        <div className="absolute left-[7%] top-[25%] h-[8%] w-[52%] rounded-sm" style={{ backgroundColor: template.fg }} />
        <div className="absolute left-[7%] top-[37%] h-[6%] w-[41%] rounded-sm" style={{ backgroundColor: template.fg, opacity: 0.88 }} />
        <div className="absolute bottom-[11%] left-[7%] h-[8%] w-[30%] rounded-full border border-white/20" style={{ backgroundColor: template.accent }} />
        <div className="absolute right-[7%] top-[8%] rounded-full bg-black/65 px-1.5 py-1 text-[7px] font-black uppercase tracking-[0.08em] text-white backdrop-blur-sm">
          Flagship
        </div>
      </div>
    );
  }

  if (template.kind === "resume") {
    const layout =
      template.layout % 6;

    return (
      <div
        className={`relative mb-2 overflow-hidden rounded-lg border bg-white ${ratioClass}`}
      >
        {layout === 0 && (
          <>
            <div
              className="absolute inset-y-0 left-0 w-[34%]"
              style={{
                backgroundColor:
                  template.accent,
              }}
            />
            <div className="absolute left-[41%] top-[9%] h-[5%] w-[46%] rounded bg-slate-900" />
            <div
              className="absolute left-[41%] top-[17%] h-[2%] w-[31%] rounded"
              style={{
                backgroundColor:
                  template.accent,
              }}
            />
            <div className="absolute left-[41%] top-[29%] h-[1.7%] w-[45%] rounded bg-slate-300" />
            <div className="absolute left-[41%] top-[34%] h-[1.7%] w-[39%] rounded bg-slate-200" />
            <div className="absolute left-[41%] top-[48%] h-[2%] w-[38%] rounded bg-slate-700" />
            <div className="absolute left-[41%] top-[55%] h-[1.5%] w-[47%] rounded bg-slate-200" />
            <div className="absolute left-[41%] top-[60%] h-[1.5%] w-[42%] rounded bg-slate-200" />
          </>
        )}

        {layout === 1 && (
          <>
            <div className="absolute inset-x-0 top-0 h-[18%] bg-slate-900" />
            <div
              className="absolute inset-x-0 top-[18%] h-[1.5%]"
              style={{
                backgroundColor:
                  template.accent,
              }}
            />
            <div className="absolute left-[8%] top-[27%] h-[2.5%] w-[45%] rounded bg-slate-900" />
            <div className="absolute left-[8%] top-[36%] h-[1.6%] w-[53%] rounded bg-slate-200" />
            <div className="absolute left-[8%] top-[43%] h-[1.6%] w-[47%] rounded bg-slate-200" />
            <div className="absolute bottom-[10%] right-[7%] top-[28%] w-[23%] rounded bg-slate-100" />
          </>
        )}

        {layout === 2 && (
          <>
            <div className="absolute left-[7%] top-[7%] h-[5%] w-[50%] rounded bg-slate-900" />
            <div
              className="absolute left-[7%] top-[20%] h-[1.4%] w-[86%]"
              style={{
                backgroundColor:
                  template.accent,
              }}
            />
            <div className="absolute left-[7%] top-[29%] h-[2%] w-[28%] rounded bg-slate-700" />
            <div className="absolute left-[40%] top-[29%] h-[2%] w-[28%] rounded bg-slate-700" />
            <div className="absolute left-[7%] top-[37%] h-[1.4%] w-[27%] rounded bg-slate-200" />
            <div className="absolute left-[40%] top-[37%] h-[1.4%] w-[44%] rounded bg-slate-200" />
            <div className="absolute left-[40%] top-[43%] h-[1.4%] w-[38%] rounded bg-slate-200" />
          </>
        )}

        {layout === 3 && (
          <>
            <div className="absolute left-[7%] top-[7%] h-[4%] w-[43%] rounded bg-slate-900" />
            <div
              className="absolute left-[7%] top-[14%] h-[1.4%] w-[86%]"
              style={{
                backgroundColor:
                  template.accent,
              }}
            />
            {[28, 46, 64].map(
              (top) => (
                <div
                  key={top}
                  className="absolute left-[7%] h-[1.5%] w-[82%] rounded bg-slate-200"
                  style={{
                    top: `${top}%`,
                  }}
                />
              )
            )}
          </>
        )}

        {layout === 4 && (
          <>
            <div
              className="absolute left-[5%] right-[5%] top-[4%] h-[20%] rounded-xl"
              style={{
                backgroundColor:
                  template.accent,
              }}
            />
            <div className="absolute left-[5%] top-[30%] h-[28%] w-[43%] rounded-lg bg-slate-100" />
            <div className="absolute right-[5%] top-[30%] h-[58%] w-[43%] rounded-lg bg-white shadow-sm ring-1 ring-slate-100" />
            <div className="absolute bottom-[7%] left-[5%] h-[24%] w-[43%] rounded-lg bg-slate-100" />
          </>
        )}

        {layout === 5 && (
          <>
            <div className="absolute inset-y-0 left-0 w-[42%] bg-slate-900" />
            <div className="absolute inset-y-0 right-0 w-[58%] bg-slate-800" />
            <div
              className="absolute left-[48%] top-[8%] h-[2%] w-[22%] rounded"
              style={{
                backgroundColor:
                  template.accent,
              }}
            />
            <div className="absolute left-[48%] top-[18%] h-[1.5%] w-[39%] rounded bg-slate-500" />
            <div className="absolute left-[48%] top-[23%] h-[1.5%] w-[34%] rounded bg-slate-600" />
          </>
        )}
      </div>
    );
  }

  const layout =
    template.layout % 3;

  return (
    <div
      className={`relative mb-2 overflow-hidden rounded-lg border border-black/5 ${ratioClass}`}
      style={{
        backgroundColor: template.bg,
      }}
    >
      {template.image && (
        <>
          <img
            src={template.image}
            alt={`${template.name} template visual`}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${template.bg}e6 0%, ${template.bg}88 46%, transparent 78%)`,
            }}
          />
        </>
      )}

      {layout === 0 && (
        <>
          <div
            className="absolute right-0 top-0 h-[44%] w-[42%] rounded-bl-[40%]"
            style={{
              backgroundColor:
                template.accent,
            }}
          />
          <div
            className="absolute left-[8%] top-[15%] h-[3%] w-[30%] rounded"
            style={{
              backgroundColor:
                template.accent,
            }}
          />
          <div
            className="absolute left-[8%] top-[29%] h-[8%] w-[55%] rounded"
            style={{
              backgroundColor:
                template.fg,
            }}
          />
          <div
            className="absolute left-[8%] top-[42%] h-[6%] w-[47%] rounded"
            style={{
              backgroundColor:
                template.fg,
              opacity: 0.8,
            }}
          />
          <div
            className="absolute bottom-[13%] left-[8%] h-[8%] w-[27%] rounded-full"
            style={{
              backgroundColor:
                template.accent,
            }}
          />
        </>
      )}

      {layout === 1 && (
        <>
          <div
            className="absolute inset-[7%] rounded-xl border-[3px]"
            style={{
              borderColor:
                template.accent,
            }}
          />
          <div
            className="absolute left-[18%] top-[26%] h-[8%] w-[64%] rounded"
            style={{
              backgroundColor:
                template.fg,
            }}
          />
          <div
            className="absolute left-[23%] top-[40%] h-[5%] w-[54%] rounded"
            style={{
              backgroundColor:
                template.fg,
              opacity: 0.75,
            }}
          />
          <div
            className="absolute left-[34%] top-[68%] h-[3%] w-[32%] rounded"
            style={{
              backgroundColor:
                template.accent,
            }}
          />
        </>
      )}

      {layout === 2 && (
        <>
          <div
            className="absolute bottom-0 left-0 h-[38%] w-full"
            style={{
              backgroundColor:
                template.accent,
            }}
          />
          <div className="absolute left-[8%] top-[8%] h-[38%] w-[36%] rounded-lg border border-black/10 bg-white/40" />
          <div
            className="absolute right-[8%] top-[16%] h-[7%] w-[38%] rounded"
            style={{
              backgroundColor:
                template.fg,
            }}
          />
          <div className="absolute bottom-[17%] left-[8%] h-[4%] w-[50%] rounded bg-white/80" />
        </>
      )}
    </div>
  );
}

export default function SidePanel(
  props: Props
) {
  const [search, setSearch] =
    useState("");

  const [
    elementSearch,
    setElementSearch,
  ] = useState("");

  const [
    elementCategory,
    setElementCategory,
  ] =
    useState<ElementCategory>(
      "All"
    );

  // Used by the local background remover controls in the image editor.
  // This state must live in SidePanel because the controls render here.
  const [
    backgroundTolerance,
    setBackgroundTolerance,
  ] = useState(58);

  const [
    templateView,
    setTemplateView,
  ] = useState<
    "all" |
    "favorites" |
    "recent"
  >("all");

  const [
    templateCategory,
    setTemplateCategory,
  ] =
    useState("All");

  const [
    favoriteTemplates,
    setFavoriteTemplates,
  ] = useState<string[]>(
    []
  );

  const [
    recentTemplates,
    setRecentTemplates,
  ] = useState<string[]>(
    []
  );

  useEffect(() => {
    if (
      props.activePanel ===
        "templates" ||
      props.activePanel ===
        "festival"
    ) {
      setTemplateCategory("All");
      setTemplateView("all");
      setSearch("");
    }
  }, [props.activePanel]);

  useEffect(() => {
    try {
      const favorites =
        JSON.parse(
          localStorage.getItem(
            "postmaker_template_favorites"
          ) ||
            "[]"
        );

      const recent =
        JSON.parse(
          localStorage.getItem(
            "postmaker_template_recent"
          ) ||
            "[]"
        );

      if (
        Array.isArray(
          favorites
        )
      ) {
        setFavoriteTemplates(
          favorites
        );
      }

      if (
        Array.isArray(
          recent
        )
      ) {
        setRecentTemplates(
          recent
        );
      }
    } catch {
      // Ignore corrupted local preference data.
    }
  }, []);

  const baseTemplates =
    useMemo(
      () => {
        if (
          props.activePanel ===
          "festival"
        ) {
          return TEMPLATE_CARDS.filter(
            (item) =>
              item.festival
          );
        }

        if (
          props.templateScope ===
          "all"
        ) {
          return TEMPLATE_CARDS.filter(
            (item) =>
              !item.festival
          );
        }

        return TEMPLATE_CARDS.filter(
          (item) =>
            item.formatName ===
            props.format.name
        );
      },
      [
        props.activePanel,
        props.templateScope,
        props.format.name,
      ]
    );

  const templateCategories =
    useMemo(
      () => [
        "All",
        ...Array.from(
          new Set(
            baseTemplates.map(
              (item) =>
                props.activePanel ===
                "festival"
                  ? item.region ||
                    "India"
                  : item.category
                      .split("•")
                      .pop()
                      ?.trim() ||
                    item.category
            )
          )
        ),
      ],
      [
        baseTemplates,
        props.activePanel,
      ]
    );

  const filteredTemplates =
    useMemo(() => {
      const q =
        search
          .trim()
          .toLowerCase();

      let templates = [
        ...baseTemplates,
      ];

      if (
        templateView ===
        "favorites"
      ) {
        templates =
          templates.filter(
            (item) =>
              favoriteTemplates.includes(
                item.type
              )
          );
      }

      if (
        templateView ===
        "recent"
      ) {
        const order =
          new Map(
            recentTemplates.map(
              (
                type,
                index
              ) => [
                type,
                index,
              ]
            )
          );

        templates =
          templates
            .filter(
              (item) =>
                order.has(
                  item.type
                )
            )
            .sort(
              (a, b) =>
                (order.get(
                  a.type
                ) ??
                  999) -
                (order.get(
                  b.type
                ) ??
                  999)
            );
      }

      if (
        templateCategory !==
        "All"
      ) {
        templates =
          templates.filter(
            (item) =>
              (props.activePanel ===
              "festival"
                ? item.region ||
                  "India"
                : item.category
                    .split("•")
                    .pop()
                    ?.trim() ||
                  item.category) ===
              templateCategory
          );
      }

      if (!q)
        return templates;

      return templates.filter(
        (item) =>
          item.name
            .toLowerCase()
            .includes(q) ||
          item.category
            .toLowerCase()
            .includes(q) ||
          item.formatName
            .toLowerCase()
            .includes(q)
      );
    }, [
      search,
      baseTemplates,
      templateView,
      templateCategory,
      favoriteTemplates,
      recentTemplates,
      props.activePanel,
    ]);

  const toggleTemplateFavorite = (
    type: string
  ) => {
    setFavoriteTemplates(
      (current) => {
        const next =
          current.includes(
            type
          )
            ? current.filter(
                (item) =>
                  item !==
                  type
              )
            : [
                type,
                ...current,
              ];

        localStorage.setItem(
          "postmaker_template_favorites",
          JSON.stringify(
            next
          )
        );

        return next;
      }
    );
  };

  const closeAfterInsertOnMobile = () => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      props.onClose();
    }
  };

  const insertAndClose = (action: () => void) => {
    action();
    closeAfterInsertOnMobile();
  };

  const useTemplate = (
    type: TemplateType
  ) => {
    setRecentTemplates(
      (current) => {
        const next = [
          type,
          ...current.filter(
            (item) =>
              item !== type
          ),
        ].slice(0, 20);

        localStorage.setItem(
          "postmaker_template_recent",
          JSON.stringify(
            next
          )
        );

        return next;
      }
    );

    props.onTemplate(type);
    closeAfterInsertOnMobile();
  };

  const filteredElements = useMemo(() => {
    const query = elementSearch.trim().toLowerCase();

    return ELEMENTS.filter((item) => {
      const categoryMatch =
        elementCategory === "All" || item.category === elementCategory;

      if (!categoryMatch) return false;
      if (!query) return true;

      return (
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.keywords.join(" ").toLowerCase().includes(query)
      );
    });
  }, [elementSearch, elementCategory]);

  if (!props.activePanel)
    return null;

  return (
    <aside
      className="fixed inset-x-0 bottom-[calc(58px_+_env(safe-area-inset-bottom))] z-40 flex h-[46dvh] min-h-[260px] max-h-[440px] flex-col overflow-hidden rounded-t-[24px] border-t bg-white shadow-[0_-14px_35px_rgba(15,23,42,0.16)] md:static md:z-auto md:h-full md:min-h-0 md:max-h-none md:w-[280px] md:shrink-0 md:rounded-none md:border-r md:border-t-0 md:shadow-none"
      style={{
        flex: "0 0 280px",
      }}
    >
      <div className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-gray-300 md:hidden" />
      <div className="z-10 flex shrink-0 items-center justify-between border-b bg-white px-3 py-2">
        <h2 className="text-[12px] font-semibold capitalize tracking-[-0.01em]">
          {props.activePanel ===
          "imageEdit"
            ? "Edit image"
            : props.activePanel ===
              "frameEdit"
            ? "Edit frame"
            : props.activePanel ===
              "textEffects"
            ? "Text effects"
            : props.activePanel}
        </h2>

        <button
          onClick={props.onClose}
          className="rounded-lg px-2.5 py-1.5 text-xs hover:bg-gray-100"
        >
          ✕
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3 pb-5 text-[12px]">
        {(props.activePanel ===
          "templates" ||
          props.activePanel ===
            "festival") && (
          <>
            <div className="rounded-2xl bg-gradient-to-br from-violet-50 via-white to-cyan-50 p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold">
                    {props.activePanel ===
                    "festival"
                      ? "Indian festival posts"
                      : "Discover templates"}
                  </div>

                  <div className="mt-1 text-[11px] text-gray-500">
                    {props.activePanel ===
                    "festival"
                      ? `${baseTemplates.length} festival designs with artwork`
                      : props.templateScope ===
                        "all"
                      ? "All design formats"
                      : props.format.name}
                  </div>
                </div>

                <div className="rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold text-violet-700 shadow-sm">
                  {filteredTemplates.length}
                </div>
              </div>

              <input
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder={
                  props.activePanel ===
                  "festival"
                    ? "Search Diwali, Holi, Onam, Eid, Bihu..."
                    : "Search templates, category or format"
                }
                className="mt-3 w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none focus:border-violet-500"
              />
            </div>

            <div className="mt-3 grid grid-cols-3 rounded-xl bg-gray-100 p-1">
              {(
                [
                  [
                    "all",
                    "All",
                  ],
                  [
                    "favorites",
                    `♥ ${favoriteTemplates.length}`,
                  ],
                  [
                    "recent",
                    "Recent",
                  ],
                ] as const
              ).map(
                ([
                  value,
                  label,
                ]) => (
                  <button
                    key={value}
                    onClick={() =>
                      setTemplateView(
                        value
                      )
                    }
                    className={`rounded-lg px-2 py-2 text-xs font-semibold ${
                      templateView ===
                      value
                        ? "bg-white shadow-sm"
                        : "text-gray-500"
                    }`}
                  >
                    {label}
                  </button>
                )
              )}
            </div>

            <div className="-mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-2">
              {templateCategories.map(
                (category) => (
                  <button
                    key={category}
                    onClick={() =>
                      setTemplateCategory(
                        category
                      )
                    }
                    className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium ${
                      templateCategory ===
                      category
                        ? "border-black bg-black text-white"
                        : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    {category}
                  </button>
                )
              )}
            </div>

            {filteredTemplates.length ? (
              <div className="mt-2 grid grid-cols-2 gap-2.5">
                {filteredTemplates.map(
                  (template) => {
                    const favorite =
                      favoriteTemplates.includes(
                        template.type
                      );

                    return (
                      <div
                        key={
                          template.type
                        }
                        className="group relative rounded-xl border bg-white p-1.5 transition hover:border-violet-300 hover:shadow-md"
                      >
                        {template.type.startsWith("flagship-") && (
                          <span className="pointer-events-none absolute left-2 top-2 z-20 rounded-full bg-gradient-to-r from-black via-violet-700 to-fuchsia-500 px-2 py-1 text-[8px] font-black uppercase tracking-[0.08em] text-white shadow">
                            Kriyavo Flagship
                          </span>
                        )}
                        {!template.type.startsWith("flagship-") && template.type.startsWith("premium-") && (
                          <span className="pointer-events-none absolute left-2 top-2 z-20 rounded-full bg-violet-600/90 px-2 py-1 text-[8px] font-bold uppercase tracking-[0.06em] text-white shadow-sm">
                            Premium
                          </span>
                        )}
                        <button
                          onClick={() =>
                            useTemplate(
                              template.type
                            )
                          }
                          className="block w-full text-left"
                        >
                          <TemplateThumb
                            template={
                              template
                            }
                          />

                          <div className="pr-7 text-xs font-semibold">
                            {
                              template.name
                            }
                          </div>

                          <div className="mt-1 text-[10px] text-gray-400">
                            {
                              template.category
                            }
                          </div>
                        </button>

                        <button
                          onClick={() =>
                            toggleTemplateFavorite(
                              template.type
                            )
                          }
                          className={`absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-full border text-sm transition ${
                            favorite
                              ? "border-rose-200 bg-rose-50 text-rose-500"
                              : "bg-white text-gray-400 hover:text-rose-500"
                          }`}
                          title={
                            favorite
                              ? "Remove from favorites"
                              : "Add to favorites"
                          }
                        >
                          {favorite
                            ? "♥"
                            : "♡"}
                        </button>
                      </div>
                    );
                  }
                )}
              </div>
            ) : (
              <div className="mt-4 rounded-xl border border-dashed p-8 text-center">
                <div className="text-sm font-semibold text-gray-600">
                  No templates here yet
                </div>

                <div className="mt-1 text-xs text-gray-400">
                  Search/filter change karo ya kisi template ko favorite karo.
                </div>
              </div>
            )}
          </>
        )}

        {(props.activePanel ===
          "frames" ||
          props.activePanel ===
            "frameEdit") && (
          <SmartFramePanel
            selected={props.selected}
            onAddFrame={(id) => insertAndClose(() => props.onAddSmartFrame(id))}
            onFrameImageUpload={props.onFrameImageUpload}
            onFrameFit={props.onFrameFit}
            onFrameZoom={props.onFrameZoom}
            onFramePanX={props.onFramePanX}
            onFramePanY={props.onFramePanY}
            onFrameBorderColor={props.onFrameBorderColor}
            onFrameBorderWidth={props.onFrameBorderWidth}
            onFrameRemoveImage={props.onFrameRemoveImage}
          />
        )}

        {props.activePanel ===
          "text" && (
          <div className="space-y-3">
            <button
              onClick={() => insertAndClose(props.onAddHeading)}
              className="w-full rounded-xl border p-4 text-left hover:bg-gray-50"
            >
              <div className="text-xl font-bold">
                Add a heading
              </div>
            </button>

            <button
              onClick={() => insertAndClose(props.onAddSubtitle)}
              className="w-full rounded-xl border p-4 text-left hover:bg-gray-50"
            >
              <div className="font-semibold">
                Add a subheading
              </div>
            </button>

            <button
              onClick={() => insertAndClose(props.onAddBody)}
              className="w-full rounded-xl border p-4 text-left hover:bg-gray-50"
            >
              <div className="text-sm">
                Add body text
              </div>
            </button>
          </div>
        )}

        {props.activePanel ===
          "uploads" && (
          <label className="block cursor-pointer rounded-2xl border border-dashed p-8 text-center hover:bg-gray-50">
            <div className="text-3xl">
              ↑
            </div>

            <div className="mt-3 font-semibold">
              Upload image
            </div>

            <div className="mt-1 text-xs text-gray-400">
              PNG, JPG, WEBP
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={(event) => {
                props.onImageUpload(event);
                closeAfterInsertOnMobile();
              }}
              className="hidden"
            />
          </label>
        )}

        {props.activePanel ===
          "elements" && (
          <>
            <div className="rounded-2xl bg-gradient-to-br from-violet-50 to-cyan-50 p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold">Elements & graphics</div>
                  <div className="mt-1 text-[11px] text-gray-500">
                    {ELEMENTS.length}+ editable vector elements
                  </div>
                </div>
                <div className="rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold text-violet-700 shadow-sm">
                  FREE
                </div>
              </div>

              <input
                value={elementSearch}
                onChange={(e) => setElementSearch(e.target.value)}
                placeholder="Search shapes, arrows, icons, stickers..."
                className="mt-3 w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none focus:border-violet-500"
              />
            </div>

            <div className="-mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-2">
              {ELEMENT_CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setElementCategory(category)}
                  className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium ${
                    elementCategory === category
                      ? "border-black bg-black text-white"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="mb-3 mt-2 flex items-center justify-between">
              <div className="text-xs font-semibold text-gray-600">
                {elementCategory === "All" ? "All elements" : elementCategory}
              </div>
              <div className="rounded-full bg-gray-100 px-2 py-1 text-[10px] text-gray-500">
                {filteredElements.length}
              </div>
            </div>

            {filteredElements.length ? (
              <div className="grid grid-cols-3 gap-2">
                {filteredElements.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => insertAndClose(() => props.onAddElement(item.id))}
                    className="group min-h-[92px] rounded-xl border bg-white p-2 text-center transition hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-md"
                    title={item.name}
                  >
                    <div className="flex h-11 items-center justify-center rounded-lg bg-gray-50 text-2xl transition group-hover:bg-violet-50">
                      {item.preview}
                    </div>
                    <div className="mt-2 line-clamp-2 text-[10px] font-semibold leading-3 text-gray-700">
                      {item.name}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed p-8 text-center text-sm text-gray-400">
                No matching elements.
              </div>
            )}
          </>
        )}

        {props.activePanel ===
          "mockups" && (
          <MockupsPanel
            selected={props.selected}
            onAddMockup={(id) => insertAndClose(() => props.onAddMockup(id))}
            onMockupImageUpload={props.onMockupImageUpload}
            onMockupFit={props.onMockupFit}
            onMockupZoom={props.onMockupZoom}
            onMockupPanX={props.onMockupPanX}
            onMockupPanY={props.onMockupPanY}
            onMockupSurfaceColor={props.onMockupSurfaceColor}
            onMockupShadow={props.onMockupShadow}
            onMockupRemoveImage={props.onMockupRemoveImage}
          />
        )}

        {props.activePanel ===
          "brand" && (
          <BrandKitPanel
            brandKit={props.brandKit}
            selected={props.selected}
            onChange={props.onBrandKitChange}
            onLogoUpload={props.onBrandLogoUpload}
            onAddLogo={(logo) => insertAndClose(() => props.onAddBrandLogo(logo))}
            onRemoveLogo={props.onRemoveBrandLogo}
            onApplyToDesign={props.onApplyBrandToDesign}
            onApplyColorToSelected={props.onApplyBrandColorToSelected}
            onAddBrandHeading={() => insertAndClose(props.onAddBrandHeading)}
            onAddBrandBody={() => insertAndClose(props.onAddBrandBody)}
          />
        )}

        {props.activePanel ===
          "resume" && (
          <ResumeBuilderPanel
            data={props.resumeData}
            theme={props.resumeTheme}
            onChange={props.onResumeDataChange}
            onThemeChange={props.onResumeThemeChange}
            onBuild={() => insertAndClose(props.onBuildResume)}
            onReset={props.onResetResume}
          />
        )}

        {props.activePanel ===
          "background" && (
          <>
            <div className="rounded-xl border p-4">
              <label className="mb-2 block text-xs font-semibold text-gray-500">
                Background color
              </label>

              <input
                type="color"
                value={
                  props.background
                }
                onChange={
                  props.onBackgroundChange
                }
                className="h-12 w-full cursor-pointer"
              />
            </div>

            <label className="mt-4 block cursor-pointer rounded-xl border border-dashed p-5 text-center hover:bg-gray-50">
              <div className="font-semibold">
                Upload background
              </div>
              <div className="mt-1 text-xs text-gray-400">
                Add an image and fit
                it to canvas
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={
                  props.onBackgroundImageUpload
                }
                className="hidden"
              />
            </label>

            <div className="mt-6">
              <div className="mb-2 text-xs font-semibold uppercase text-gray-400">
                Canvas size
              </div>

              <div className="space-y-2">
                {FORMATS.map(
                  (item) => (
                    <button
                      key={item.name}
                      onClick={() =>
                        props.onFormatChange(
                          item
                        )
                      }
                      className={`w-full rounded-xl border p-3 text-left ${
                        props.format
                          .name ===
                        item.name
                          ? "border-black bg-gray-50"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="text-sm font-medium">
                        {item.name}
                      </div>

                      <div className="text-xs text-gray-400">
                        {item.width} ×{" "}
                        {item.height}
                      </div>
                    </button>
                  )
                )}
              </div>
            </div>
          </>
        )}

        {props.activePanel ===
          "layers" && (
          <>
            <div className="space-y-2">
              {props.objects
                .length === 0 && (
                <p className="text-sm text-gray-400">
                  No elements yet.
                </p>
              )}

              {[...props.objects]
                .reverse()
                .map(
                  (
                    object,
                    reverseIndex
                  ) => {
                    const originalIndex =
                      props.objects
                        .length -
                      1 -
                      reverseIndex;

                    const visible =
                      object.visible !==
                      false;

                    const locked =
                      object.selectable ===
                      false;

                    return (
                      <div
                        key={`${object.type}-${originalIndex}`}
                        className="flex items-center gap-2 rounded-xl border p-2"
                      >
                        <button
                          onClick={() =>
                            props.onToggleLayerVisibility(
                              object
                            )
                          }
                          className="rounded-lg px-2 py-1 text-xs hover:bg-gray-100"
                        >
                          {visible
                            ? "👁"
                            : "◌"}
                        </button>

                        <button
                          onClick={() =>
                            props.onSelectLayer(
                              object
                            )
                          }
                          className="min-w-0 flex-1 truncate text-left text-sm"
                        >
                          {layerName(
                            object,
                            originalIndex
                          )}
                        </button>

                        <button
                          onClick={() =>
                            props.onToggleLayerLock(
                              object
                            )
                          }
                          className="rounded-lg px-2 py-1 text-xs hover:bg-gray-100"
                        >
                          {locked
                            ? "🔒"
                            : "🔓"}
                        </button>
                      </div>
                    );
                  }
                )}
            </div>

            <button
              onClick={props.onClear}
              className="mt-6 w-full rounded-xl border p-3 text-sm text-red-600 hover:bg-red-50"
            >
              Clear Design
            </button>
          </>
        )}

        {props.activePanel ===
          "imageEdit" && (
          <>
            {!props.selected ||
            ![
              "image",
              "fabricimage",
            ].includes(
              props.selected.type
            ) ? (
              <div className="rounded-xl border border-dashed p-6 text-center text-sm text-gray-400">
                Select an image on
                the canvas first.
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <div className="mb-3 text-xs font-semibold uppercase text-gray-400">
                    Image
                  </div>

                  <label className="block cursor-pointer rounded-xl border p-3 text-center text-sm hover:bg-gray-50">
                    Replace image

                    <input
                      type="file"
                      accept="image/*"
                      onChange={
                        props.onReplaceSelectedImage
                      }
                      className="hidden"
                    />
                  </label>

                  <button
                    onClick={
                      props.onSetImageAsBackground
                    }
                    className="mt-2 w-full rounded-xl border p-3 text-sm hover:bg-gray-50"
                  >
                    Set as background
                  </button>
                </div>

                <div>
                  <div className="mb-3 text-xs font-semibold uppercase text-gray-400">
                    Background remover
                  </div>

                  <div className="rounded-xl border bg-gray-50 p-3">
                    <div className="text-xs font-semibold text-gray-700">
                      Local background remover
                    </div>

                    <div className="mt-1 text-[11px] leading-5 text-gray-500">
                      Plain/solid backgrounds par best result deta hai. Processing browser me hoti hai — koi paid API nahi.
                    </div>

                    <div className="mt-3">
                      <RangeRow
                        label="Tolerance"
                        min={15}
                        max={140}
                        step={1}
                        value={backgroundTolerance}
                        onChange={setBackgroundTolerance}
                      />
                    </div>

                    <button
                      onClick={() =>
                        props.onRemoveImageBackground(
                          backgroundTolerance
                        )
                      }
                      className="mt-3 w-full rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white"
                    >
                      Remove background
                    </button>

                    {props.selected
                      .hasOriginalImage && (
                      <button
                        onClick={
                          props.onRestoreImageBackground
                        }
                        className="mt-2 w-full rounded-xl border px-4 py-3 text-sm font-semibold hover:bg-white"
                      >
                        Restore original
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <div className="mb-3 text-xs font-semibold uppercase text-gray-400">
                    Adjust
                  </div>

                  <div className="space-y-4">
                    <RangeRow
                      label="Brightness"
                      min={-1}
                      max={1}
                      step={0.05}
                      value={
                        props.selected
                          .imageBrightness ??
                        0
                      }
                      onChange={(
                        value
                      ) =>
                        props.onImageAdjust(
                          {
                            brightness:
                              value,
                          }
                        )
                      }
                    />

                    <RangeRow
                      label="Contrast"
                      min={-1}
                      max={1}
                      step={0.05}
                      value={
                        props.selected
                          .imageContrast ??
                        0
                      }
                      onChange={(
                        value
                      ) =>
                        props.onImageAdjust(
                          {
                            contrast:
                              value,
                          }
                        )
                      }
                    />

                    <RangeRow
                      label="Saturation"
                      min={-1}
                      max={1}
                      step={0.05}
                      value={
                        props.selected
                          .imageSaturation ??
                        0
                      }
                      onChange={(
                        value
                      ) =>
                        props.onImageAdjust(
                          {
                            saturation:
                              value,
                          }
                        )
                      }
                    />

                    <RangeRow
                      label="Blur"
                      min={0}
                      max={1}
                      step={0.05}
                      value={
                        props.selected
                          .imageBlur ??
                        0
                      }
                      onChange={(
                        value
                      ) =>
                        props.onImageAdjust(
                          {
                            blur: value,
                          }
                        )
                      }
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-3 text-xs font-semibold uppercase text-gray-400">
                    Filters
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {[
                      [
                        "none",
                        "Natural",
                      ],
                      [
                        "grayscale",
                        "B&W",
                      ],
                      [
                        "sepia",
                        "Warm",
                      ],
                      [
                        "invert",
                        "Invert",
                      ],
                    ].map(
                      ([
                        preset,
                        label,
                      ]) => (
                        <button
                          key={
                            preset
                          }
                          onClick={() =>
                            props.onImagePreset(
                              preset as ImagePreset
                            )
                          }
                          className={`rounded-xl border p-3 text-sm ${
                            props
                              .selected
                              ?.imagePreset ===
                            preset
                              ? "border-black bg-gray-50"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          {label}
                        </button>
                      )
                    )}
                  </div>
                </div>

                <div>
                  <div className="mb-3 text-xs font-semibold uppercase text-gray-400">
                    Crop
                  </div>

                  {!props.cropMode ? (
                    <button
                      onClick={props.onStartCrop}
                      className="w-full rounded-xl bg-black p-3 text-sm font-semibold text-white"
                    >
                      Start crop mode
                    </button>
                  ) : (
                    <div className="rounded-2xl border bg-gray-50 p-3">
                      <div className="text-sm font-semibold">
                        Crop mode active
                      </div>

                      <p className="mt-1 text-xs leading-5 text-gray-500">
                        Canvas par image drag karo. Frame wahi rahega, visible image andar move hogi.
                      </p>

                      <div className="mt-3 grid grid-cols-4 gap-2">
                        <button
                          onClick={() => props.onImageCropPreset(1)}
                          className="rounded-xl border bg-white p-2 text-xs"
                        >
                          1:1
                        </button>

                        <button
                          onClick={() => props.onImageCropPreset(4 / 5)}
                          className="rounded-xl border bg-white p-2 text-xs"
                        >
                          4:5
                        </button>

                        <button
                          onClick={() => props.onImageCropPreset(16 / 9)}
                          className="rounded-xl border bg-white p-2 text-xs"
                        >
                          16:9
                        </button>

                        <button
                          onClick={props.onImageCropReset}
                          className="rounded-xl border bg-white p-2 text-xs"
                        >
                          Reset
                        </button>
                      </div>

                      <div className="mt-4">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-xs font-semibold text-gray-600">
                            Rotate
                          </span>
                          <span className="text-xs text-gray-400">
                            {Math.round(props.selected?.angle ?? 0)}°
                          </span>
                        </div>

                        <input
                          type="range"
                          min="-180"
                          max="180"
                          step="1"
                          value={props.selected?.angle ?? 0}
                          onChange={(e) =>
                            props.onRotateCrop(Number(e.target.value))
                          }
                          className="w-full"
                        />
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <button
                          onClick={props.onCancelCrop}
                          className="rounded-xl border bg-white p-3 text-sm"
                        >
                          Cancel
                        </button>

                        <button
                          onClick={props.onFinishCrop}
                          className="rounded-xl bg-black p-3 text-sm font-semibold text-white"
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            )}
          </>
        )}

        {props.activePanel ===
          "textEffects" && (
          <>
            {!props.selected ||
            ![
              "textbox",
              "text",
              "i-text",
              "itext",
            ].includes(
              props.selected.type
            ) ? (
              <div className="rounded-xl border border-dashed p-6 text-center text-sm text-gray-400">
                Select text first.
              </div>
            ) : (
              <div className="space-y-5">
                <RangeRow
                  label="Letter spacing"
                  min={-100}
                  max={500}
                  step={10}
                  value={
                    props.selected
                      .charSpacing ?? 0
                  }
                  onChange={(
                    value
                  ) =>
                    props.onUpdateSelected(
                      {
                        charSpacing:
                          value,
                      }
                    )
                  }
                />

                <RangeRow
                  label="Line height"
                  min={0.8}
                  max={2}
                  step={0.05}
                  value={
                    props.selected
                      .lineHeight ??
                    1.16
                  }
                  onChange={(
                    value
                  ) =>
                    props.onUpdateSelected(
                      {
                        lineHeight:
                          value,
                      }
                    )
                  }
                />

                <div>
                  <label className="mb-2 block text-xs font-semibold text-gray-600">
                    Stroke color
                  </label>

                  <input
                    type="color"
                    value={
                      typeof props
                        .selected
                        .stroke ===
                      "string"
                        ? props
                            .selected
                            .stroke
                        : "#000000"
                    }
                    onChange={(e) =>
                      props.onUpdateSelected(
                        {
                          stroke:
                            e.target
                              .value,
                        }
                      )
                    }
                    className="h-10 w-full"
                  />
                </div>

                <RangeRow
                  label="Stroke width"
                  min={0}
                  max={20}
                  step={1}
                  value={
                    props.selected
                      .strokeWidth ?? 0
                  }
                  onChange={(
                    value
                  ) =>
                    props.onUpdateSelected(
                      {
                        strokeWidth:
                          value,
                      }
                    )
                  }
                />
              </div>
            )}
          </>
        )}
      </div>
    </aside>
  );
}
