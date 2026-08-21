"use client";

import { useState, type ReactNode } from "react";
import { FONTS } from "@/lib/editor/fonts";
import type { EditorPanel, SelectedSnapshot } from "@/types/editor";

type Props = {
  selected: SelectedSnapshot | null;
  onUpdate: (changes: any) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onBringForward: () => void;
  onSendBackward: () => void;
  onBringToFront: () => void;
  onSendToBack: () => void;
  onToggleLock: () => void;
  onToggleVisibility: () => void;
  onFlipHorizontal: () => void;
  onFlipVertical: () => void;
  onOpenPanel: (panel: Exclude<EditorPanel, null>) => void;
  onSetImageAsBackground: () => void;
  onStartCrop: () => void;
  onCornerRadiusChange: (value: number) => void;
  onToggleBullets: () => void;
  onOpenPosition: () => void;
  onGroup: () => void;
  onUngroup: () => void;
  onSelectAll: () => void;
  onUnavailableTool: (name: string) => void;
};

type MobileSheet =
  | "edit"
  | "font"
  | "size"
  | "color"
  | "style"
  | "align"
  | "fill"
  | "border"
  | "corners"
  | "opacity"
  | "position"
  | "more"
  | null;

function MobileTool({ label, icon, onClick }: { label: string; icon: ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-w-[60px] shrink-0 flex-col items-center justify-center gap-1 rounded-xl px-1 py-1 text-[9px] font-medium leading-[10px] text-gray-800 active:bg-gray-100"
      title={label}
      aria-label={label}
    >
      <span className="flex h-5 items-center justify-center text-[18px] leading-none">{icon}</span>
      <span className="max-w-[58px] truncate">{label}</span>
    </button>
  );
}

function SheetButton({ active, children, onClick }: { active?: boolean; children: ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-10 rounded-xl border px-3 py-2 text-xs font-semibold ${active ? "border-gray-950 bg-gray-950 text-white" : "bg-white text-gray-700"}`}
    >
      {children}
    </button>
  );
}

export default function ContextToolbar(props: Props) {
  const selected = props.selected;
  const [mobileSheet, setMobileSheet] = useState<MobileSheet>(null);

  if (!selected) return null;

  const type = selected.type.toLowerCase();
  const isText = ["textbox", "text", "i-text", "itext"].includes(type);
  const isImage = ["image", "fabricimage"].includes(type);
  const isMockup = Boolean(selected.isMockup);
  const isSmartFrame = Boolean(selected.isSmartFrame);
  const isMultiSelection = Boolean(selected.isMultiSelection);
  const isGroup = Boolean(selected.isGroup) && !isMockup && !isSmartFrame;
  const isShape = !isMockup && !isSmartFrame && ["rect", "rectangle", "circle", "ellipse", "polygon", "polyline", "line", "path", "group"].includes(type);

  const textColor = typeof selected.fill === "string" ? selected.fill : "#111111";
  const shapeFill = typeof selected.fill === "string" ? selected.fill : "#111111";
  const shapeStroke = typeof selected.stroke === "string" ? selected.stroke : "#111111";
  const canRoundCorners =
    (isImage && !isMockup && !isSmartFrame) ||
    ["rect", "rectangle"].includes(type);
  const cornerRadius = Math.max(
    0,
    Number(selected.cornerRadius ?? selected.rx ?? 0)
  );

  const closeSheet = () => setMobileSheet(null);
  const openEditorPanel = (panel: Exclude<EditorPanel, null>) => {
    closeSheet();
    props.onOpenPanel(panel);
  };

  const sheetTitle: Record<Exclude<MobileSheet, null>, string> = {
    edit: "Edit text",
    font: "Font",
    size: "Font size",
    color: "Color",
    style: "Text style",
    align: "Alignment",
    fill: "Fill color",
    border: "Border",
    corners: "Corners",
    opacity: "Transparency",
    position: "Position",
    more: "More",
  };

  const renderMobileSheet = () => {
    if (!mobileSheet) return null;

    return (
      <div className="fixed inset-x-0 bottom-[calc(58px_+_env(safe-area-inset-bottom))] z-[84] h-[42dvh] min-h-[220px] max-h-[390px] overflow-hidden rounded-t-[24px] border-t bg-white shadow-[0_-14px_35px_rgba(15,23,42,0.16)] md:hidden">
        <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-gray-300" />
        <div className="flex h-11 items-center justify-between border-b px-4">
          <div className="text-[13px] font-semibold">{sheetTitle[mobileSheet]}</div>
          <button type="button" onClick={closeSheet} className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs" aria-label="Close tool">✕</button>
        </div>

        <div className="h-[calc(100%-52px)] overflow-y-auto p-4 pb-6">
          {mobileSheet === "edit" && isText && (
            <textarea
              value={String(selected.text || "")}
              onChange={(event) => props.onUpdate({ text: event.target.value })}
              className="min-h-28 w-full resize-none rounded-xl border px-3 py-3 text-sm outline-none focus:border-violet-500"
              placeholder="Edit text"
              autoFocus
            />
          )}

          {mobileSheet === "font" && isText && (
            <div className="space-y-3">
              <select
                value={selected.fontFamily || "Arial"}
                onChange={(event) => props.onUpdate({ fontFamily: event.target.value })}
                className="w-full rounded-xl border bg-white px-3 py-3 text-sm outline-none focus:border-violet-500"
              >
                {FONTS.map((font) => <option key={font} value={font}>{font}</option>)}
              </select>
              <div className="grid grid-cols-2 gap-2">
                {FONTS.slice(0, 10).map((font) => (
                  <button key={font} type="button" onClick={() => props.onUpdate({ fontFamily: font })} className={`rounded-xl border p-3 text-left text-xs ${selected.fontFamily === font ? "border-violet-500 bg-violet-50" : "bg-white"}`} style={{ fontFamily: font }}>
                    {font}
                  </button>
                ))}
              </div>
            </div>
          )}

          {mobileSheet === "size" && isText && (
            <div className="space-y-5">
              <div className="flex items-center justify-center gap-3">
                <button type="button" onClick={() => props.onUpdate({ fontSize: Math.max(8, (selected.fontSize || 40) - 2) })} className="h-11 w-11 rounded-full border text-xl">−</button>
                <input type="number" min="8" max="300" value={Math.round(selected.fontSize || 40)} onChange={(e) => props.onUpdate({ fontSize: Number(e.target.value) })} className="h-11 w-24 rounded-xl border text-center text-base font-semibold outline-none" />
                <button type="button" onClick={() => props.onUpdate({ fontSize: Math.min(300, (selected.fontSize || 40) + 2) })} className="h-11 w-11 rounded-full border text-xl">+</button>
              </div>
              <input type="range" min="8" max="180" step="1" value={Math.min(180, selected.fontSize || 40)} onChange={(e) => props.onUpdate({ fontSize: Number(e.target.value) })} className="w-full" />
            </div>
          )}

          {mobileSheet === "color" && isText && (
            <div className="space-y-4">
              <label className="flex items-center gap-3 rounded-xl border p-3">
                <input type="color" value={textColor} onChange={(e) => props.onUpdate({ fill: e.target.value })} className="h-11 w-14 rounded-lg border-0 bg-transparent" />
                <div><div className="text-xs font-semibold">Text color</div><div className="mt-1 text-[11px] uppercase text-gray-400">{textColor}</div></div>
              </label>
              <div className="grid grid-cols-8 gap-2">
                {["#111111", "#ffffff", "#6d28d9", "#2563eb", "#0891b2", "#059669", "#eab308", "#ef4444", "#ec4899", "#f97316", "#64748b", "#0f172a", "#7c3aed", "#14b8a6", "#f59e0b", "#be123c"].map((color) => (
                  <button key={color} type="button" onClick={() => props.onUpdate({ fill: color })} className={`aspect-square rounded-full border shadow-sm ${textColor.toLowerCase() === color ? "ring-2 ring-violet-500 ring-offset-2" : ""}`} style={{ backgroundColor: color }} aria-label={`Use ${color}`} />
                ))}
              </div>
            </div>
          )}

          {mobileSheet === "style" && isText && (
            <div className="grid grid-cols-3 gap-2">
              <SheetButton active={selected.fontWeight === "bold"} onClick={() => props.onUpdate({ fontWeight: selected.fontWeight === "bold" ? "normal" : "bold" })}>Bold</SheetButton>
              <SheetButton active={selected.fontStyle === "italic"} onClick={() => props.onUpdate({ fontStyle: selected.fontStyle === "italic" ? "normal" : "italic" })}>Italic</SheetButton>
              <SheetButton active={Boolean(selected.underline)} onClick={() => props.onUpdate({ underline: !selected.underline })}>Underline</SheetButton>
              <SheetButton active={Boolean(selected.linethrough)} onClick={() => props.onUpdate({ linethrough: !selected.linethrough })}>Strike</SheetButton>
              <SheetButton onClick={() => props.onUpdate({ text: String(selected.text || "").toUpperCase() })}>UPPERCASE</SheetButton>
              <SheetButton onClick={props.onToggleBullets}>Bullets</SheetButton>
            </div>
          )}

          {mobileSheet === "align" && isText && (
            <div className="grid grid-cols-2 gap-2">
              {["left", "center", "right", "justify"].map((align) => (
                <SheetButton key={align} active={(selected.textAlign || "left") === align} onClick={() => props.onUpdate({ textAlign: align })}>{align[0].toUpperCase() + align.slice(1)}</SheetButton>
              ))}
              <button type="button" onClick={() => openEditorPanel("textEffects")} className="col-span-2 mt-1 rounded-xl bg-violet-600 px-3 py-3 text-xs font-semibold text-white">Spacing & text effects</button>
            </div>
          )}

          {mobileSheet === "fill" && isShape && (
            <div className="space-y-4">
              <label className="flex items-center gap-3 rounded-xl border p-3">
                <input type="color" value={shapeFill} onChange={(e) => props.onUpdate({ fill: e.target.value })} className="h-11 w-14" />
                <span className="text-xs font-semibold uppercase">{shapeFill}</span>
              </label>
            </div>
          )}

          {mobileSheet === "border" && isShape && (
            <div className="space-y-4">
              <label className="flex items-center gap-3 rounded-xl border p-3">
                <input type="color" value={shapeStroke} onChange={(e) => props.onUpdate({ stroke: e.target.value })} className="h-11 w-14" />
                <span className="text-xs font-semibold uppercase">{shapeStroke}</span>
              </label>
              <label className="block text-xs font-semibold text-gray-600">Border width
                <input type="range" min="0" max="30" value={selected.strokeWidth ?? 0} onChange={(e) => props.onUpdate({ strokeWidth: Number(e.target.value) })} className="mt-2 w-full" />
              </label>
              {["rect", "rectangle"].includes(type) && (
                <label className="block text-xs font-semibold text-gray-600">Corner radius
                  <input type="range" min="0" max="200" value={selected.rx ?? 0} onChange={(e) => props.onUpdate({ rx: Number(e.target.value), ry: Number(e.target.value) })} className="mt-2 w-full" />
                </label>
              )}
            </div>
          )}

          {mobileSheet === "corners" && canRoundCorners && (
            <div className="space-y-5">
              <div className="grid grid-cols-4 gap-2">
                {[0, 8, 16, 24, 32, 48, 96].map((radius) => (
                  <SheetButton
                    key={radius}
                    active={Math.round(cornerRadius) === radius}
                    onClick={() => props.onCornerRadiusChange(radius)}
                  >
                    {radius === 0 ? "Square" : radius}
                  </SheetButton>
                ))}
                <SheetButton
                  active={cornerRadius >= 180}
                  onClick={() => props.onCornerRadiusChange(240)}
                >
                  Round
                </SheetButton>
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between text-xs font-semibold text-gray-600">
                  <span>Corner rounding</span>
                  <span>{Math.round(cornerRadius)} px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="240"
                  step="1"
                  value={Math.min(240, cornerRadius)}
                  onChange={(event) =>
                    props.onCornerRadiusChange(Number(event.target.value))
                  }
                  className="w-full"
                />
              </div>
              <div className="rounded-xl bg-gray-50 p-3 text-[11px] leading-5 text-gray-500">
                Non-destructive rounding. Image crop, replace, undo/redo and autosave keep the corner value.
              </div>
            </div>
          )}

          {mobileSheet === "opacity" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-semibold"><span>Transparency</span><span>{Math.round((selected.opacity ?? 1) * 100)}%</span></div>
              <input type="range" min="0" max="1" step="0.01" value={selected.opacity ?? 1} onChange={(e) => props.onUpdate({ opacity: Number(e.target.value) })} className="w-full" />
            </div>
          )}

          {mobileSheet === "position" && (
            <div className="grid grid-cols-2 gap-2">
              <SheetButton onClick={props.onBringToFront}>To front</SheetButton>
              <SheetButton onClick={props.onBringForward}>Forward</SheetButton>
              <SheetButton onClick={props.onSendBackward}>Backward</SheetButton>
              <SheetButton onClick={props.onSendToBack}>To back</SheetButton>
              <button type="button" onClick={() => { closeSheet(); props.onOpenPosition(); }} className="col-span-2 rounded-xl bg-gray-950 px-3 py-3 text-xs font-semibold text-white">Precise position & size</button>
            </div>
          )}

          {mobileSheet === "more" && (
            <div className="grid grid-cols-3 gap-2">
              {isMultiSelection && <SheetButton onClick={props.onGroup}>Group</SheetButton>}
              {isGroup && <SheetButton onClick={props.onUngroup}>Ungroup</SheetButton>}
              <SheetButton onClick={props.onToggleLock}>{selected.selectable === false ? "Unlock" : "Lock"}</SheetButton>
              <SheetButton onClick={props.onToggleVisibility}>Visibility</SheetButton>
              <SheetButton onClick={props.onDuplicate}>Duplicate</SheetButton>
              <SheetButton onClick={props.onSelectAll}>Select all</SheetButton>
              <SheetButton onClick={props.onFlipHorizontal}>Flip H</SheetButton>
              <SheetButton onClick={props.onFlipVertical}>Flip V</SheetButton>
              <button type="button" onClick={props.onDelete} className="min-h-10 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">Delete</button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Mobile: the contextual toolbar replaces the normal footer bar. */}
      <div className="fixed inset-x-0 bottom-0 z-[82] border-t border-gray-200 bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-6px_22px_rgba(15,23,42,0.10)] md:hidden">
        {renderMobileSheet()}
        <div className="flex h-[58px] items-center overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {isText && (
            <>
              <MobileTool label="Edit" icon="⌨" onClick={() => setMobileSheet("edit")} />
              <MobileTool label="Font" icon={<span className="font-serif">Ff</span>} onClick={() => setMobileSheet("font")} />
              <MobileTool label="Size" icon="Aa" onClick={() => setMobileSheet("size")} />
              <MobileTool label="Color" icon={<span className="relative font-bold">A<span className="absolute -bottom-1 left-0 h-0.5 w-full rounded bg-gradient-to-r from-red-500 via-yellow-400 to-blue-500" /></span>} onClick={() => setMobileSheet("color")} />
              <MobileTool label="Style" icon="B" onClick={() => setMobileSheet("style")} />
              <MobileTool label="Align" icon="☰" onClick={() => setMobileSheet("align")} />
              <MobileTool label="Effects" icon="✦" onClick={() => openEditorPanel("textEffects")} />
              <MobileTool label="Position" icon="✥" onClick={() => setMobileSheet("position")} />
              <MobileTool label="More" icon="•••" onClick={() => setMobileSheet("more")} />
            </>
          )}

          {isImage && !isMockup && !isSmartFrame && (
            <>
              <MobileTool label="Edit" icon="✎" onClick={() => openEditorPanel("imageEdit")} />
              <MobileTool label="Crop" icon="⌗" onClick={() => { closeSheet(); props.onStartCrop(); }} />
              <MobileTool label="Effects" icon="✦" onClick={() => openEditorPanel("imageEdit")} />
              <MobileTool label="Corners" icon={<span className="h-4 w-5 rounded-md border-2 border-current" />} onClick={() => setMobileSheet("corners")} />
              <MobileTool label="Opacity" icon="◐" onClick={() => setMobileSheet("opacity")} />
              <MobileTool label="Position" icon="✥" onClick={() => setMobileSheet("position")} />
              <MobileTool label="Set BG" icon="▣" onClick={props.onSetImageAsBackground} />
              <MobileTool label="More" icon="•••" onClick={() => setMobileSheet("more")} />
            </>
          )}

          {isSmartFrame && (
            <>
              <MobileTool label="Edit frame" icon="▧" onClick={() => openEditorPanel("frameEdit")} />
              <MobileTool label="Opacity" icon="◐" onClick={() => setMobileSheet("opacity")} />
              <MobileTool label="Position" icon="✥" onClick={() => setMobileSheet("position")} />
              <MobileTool label="More" icon="•••" onClick={() => setMobileSheet("more")} />
            </>
          )}

          {isMockup && (
            <>
              <MobileTool label="Edit mockup" icon="▣" onClick={() => openEditorPanel("mockups")} />
              <MobileTool label="Opacity" icon="◐" onClick={() => setMobileSheet("opacity")} />
              <MobileTool label="Position" icon="✥" onClick={() => setMobileSheet("position")} />
              <MobileTool label="More" icon="•••" onClick={() => setMobileSheet("more")} />
            </>
          )}

          {isShape && !isImage && (
            <>
              <MobileTool label="Fill" icon={<span className="h-4 w-4 rounded border" style={{ backgroundColor: shapeFill }} />} onClick={() => setMobileSheet("fill")} />
              <MobileTool label="Border" icon="□" onClick={() => setMobileSheet("border")} />
              {["rect", "rectangle"].includes(type) && (
                <MobileTool label="Corners" icon={<span className="h-4 w-5 rounded-md border-2 border-current" />} onClick={() => setMobileSheet("corners")} />
              )}
              <MobileTool label="Opacity" icon="◐" onClick={() => setMobileSheet("opacity")} />
              <MobileTool label="Position" icon="✥" onClick={() => setMobileSheet("position")} />
              <MobileTool label="More" icon="•••" onClick={() => setMobileSheet("more")} />
            </>
          )}

          {!isText && !isImage && !isShape && !isMockup && !isSmartFrame && (
            <>
              <MobileTool label="Opacity" icon="◐" onClick={() => setMobileSheet("opacity")} />
              <MobileTool label="Position" icon="✥" onClick={() => setMobileSheet("position")} />
              <MobileTool label="More" icon="•••" onClick={() => setMobileSheet("more")} />
            </>
          )}
        </div>
      </div>

      {/* Desktop: preserve the full existing toolbar, just compact the visual scale. */}
      <div className="pointer-events-none absolute left-1/2 top-3 z-40 hidden w-auto -translate-x-1/2 px-3 md:block">
        <div className="pointer-events-auto mx-auto flex max-w-[calc(100vw-100px)] items-center gap-1.5 overflow-x-auto rounded-xl border bg-white px-2.5 py-1.5 text-[11px] shadow-lg">
          {isMultiSelection && <span className="whitespace-nowrap rounded-lg bg-violet-50 px-2.5 py-1.5 text-[11px] font-semibold text-violet-700">{selected.selectionCount || 2} selected</span>}

          {isText && (
            <>
              <select value={selected.fontFamily || "Arial"} onChange={(e) => props.onUpdate({ fontFamily: e.target.value })} className="w-28 rounded-lg border px-2 py-1.5 text-xs">
                {FONTS.map((font) => <option key={font} value={font}>{font}</option>)}
              </select>
              <div className="flex overflow-hidden rounded-lg border">
                <button onClick={() => props.onUpdate({ fontSize: Math.max(8, (selected.fontSize || 40) - 2) })} className="px-2">−</button>
                <input type="number" min="8" max="300" value={Math.round(selected.fontSize || 40)} onChange={(e) => props.onUpdate({ fontSize: Number(e.target.value) })} className="w-14 border-x px-1 py-1.5 text-center text-xs outline-none" />
                <button onClick={() => props.onUpdate({ fontSize: Math.min(300, (selected.fontSize || 40) + 2) })} className="px-2">+</button>
              </div>
              <input type="color" value={textColor} onChange={(e) => props.onUpdate({ fill: e.target.value })} className="h-7 w-8 cursor-pointer rounded border" title="Text color" />
              <button onClick={() => props.onUpdate({ fontWeight: selected.fontWeight === "bold" ? "normal" : "bold" })} className={`rounded-lg border px-2.5 py-1.5 font-bold ${selected.fontWeight === "bold" ? "bg-black text-white" : ""}`}>B</button>
              <button onClick={() => props.onUpdate({ fontStyle: selected.fontStyle === "italic" ? "normal" : "italic" })} className={`rounded-lg border px-2.5 py-1.5 italic ${selected.fontStyle === "italic" ? "bg-black text-white" : ""}`}>I</button>
              <button onClick={() => props.onUpdate({ underline: !selected.underline })} className={`rounded-lg border px-2.5 py-1.5 underline ${selected.underline ? "bg-black text-white" : ""}`}>U</button>
              <button onClick={() => props.onUpdate({ linethrough: !selected.linethrough })} className={`rounded-lg border px-2.5 py-1.5 line-through ${selected.linethrough ? "bg-black text-white" : ""}`}>S</button>
              <button onClick={() => props.onUpdate({ text: String(selected.text || "").toUpperCase() })} className="rounded-lg border px-2.5 py-1.5">aA</button>
              <select value={selected.textAlign || "left"} onChange={(e) => props.onUpdate({ textAlign: e.target.value })} className="rounded-lg border px-2 py-1.5 text-xs">
                <option value="left">Left</option><option value="center">Center</option><option value="right">Right</option><option value="justify">Justify</option>
              </select>
              <button onClick={props.onToggleBullets} className="rounded-lg border px-2.5 py-1.5" title="Bullets">•☰</button>
              <button onClick={() => props.onOpenPanel("textEffects")} className="rounded-lg border px-2.5 py-1.5">Spacing</button>
              <button onClick={() => props.onOpenPanel("textEffects")} className="rounded-lg border px-2.5 py-1.5">Effects</button>
            </>
          )}

          {isSmartFrame && <><button onClick={() => props.onOpenPanel("frameEdit")} className="rounded-lg bg-violet-600 px-2.5 py-1.5 font-semibold text-white">Edit frame</button><button onClick={props.onFlipHorizontal} className="rounded-lg border px-2.5 py-1.5">Flip</button></>}
          {isMockup && <><button onClick={() => props.onOpenPanel("mockups")} className="rounded-lg bg-violet-600 px-2.5 py-1.5 font-semibold text-white">Edit mockup</button><button onClick={props.onFlipHorizontal} className="rounded-lg border px-2.5 py-1.5">Flip</button></>}

          {isImage && (
            <>
              <button onClick={() => props.onOpenPanel("imageEdit")} className="rounded-lg bg-gray-100 px-2.5 py-1.5 font-semibold">Edit image</button>
              <button onClick={props.onStartCrop} className="rounded-lg border px-2.5 py-1.5">Crop</button>
              <button onClick={props.onFlipHorizontal} className="rounded-lg border px-2.5 py-1.5">Flip</button>
              <button onClick={() => props.onOpenPanel("imageEdit")} className="rounded-lg border px-2.5 py-1.5">Effects</button>
              <label className="flex items-center gap-1.5 rounded-lg border px-2 py-1 text-[11px]" title="Corner rounding">
                Corners
                <input
                  type="number"
                  min="0"
                  max="240"
                  value={Math.round(cornerRadius)}
                  onChange={(e) => props.onCornerRadiusChange(Number(e.target.value))}
                  className="w-11 bg-transparent text-center text-xs outline-none"
                />
              </label>
              <button onClick={props.onSetImageAsBackground} className="rounded-lg border px-2.5 py-1.5">Set BG</button>
            </>
          )}

          {isShape && (
            <>
              <label className="flex items-center gap-1.5 rounded-lg border px-2 py-1 text-[11px]">Fill<input type="color" value={shapeFill} onChange={(e) => props.onUpdate({ fill: e.target.value })} className="h-6 w-7" /></label>
              <label className="flex items-center gap-1.5 rounded-lg border px-2 py-1 text-[11px]">Border<input type="color" value={shapeStroke} onChange={(e) => props.onUpdate({ stroke: e.target.value })} className="h-6 w-7" /></label>
              <input type="number" min="0" max="30" value={selected.strokeWidth ?? 0} onChange={(e) => props.onUpdate({ strokeWidth: Number(e.target.value) })} className="w-14 rounded-lg border px-2 py-1.5 text-xs" title="Border width" />
              {["rect", "rectangle"].includes(type) && (
                <label className="flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px]" title="Corner rounding">
                  Corners
                  <input
                    type="number"
                    min="0"
                    max="240"
                    value={Math.round(cornerRadius)}
                    onChange={(e) => props.onCornerRadiusChange(Number(e.target.value))}
                    className="w-11 bg-transparent text-center text-xs outline-none"
                  />
                </label>
              )}
              <button onClick={props.onFlipHorizontal} className="rounded-lg border px-2.5 py-1.5">Flip</button>
            </>
          )}

          <label className="flex items-center gap-1.5 rounded-lg border px-2 py-1 text-[11px]">Opacity<input type="range" min="0" max="1" step="0.01" value={selected.opacity ?? 1} onChange={(e) => props.onUpdate({ opacity: Number(e.target.value) })} className="w-16" /></label>
          {isMultiSelection && <button onClick={props.onGroup} className="rounded-lg bg-black px-2.5 py-1.5 font-semibold text-white">Group</button>}
          {isGroup && <button onClick={props.onUngroup} className="rounded-lg bg-black px-2.5 py-1.5 font-semibold text-white">Ungroup</button>}
          <button onClick={props.onOpenPosition} className="rounded-lg border px-2.5 py-1.5">Position</button>
          <button onClick={props.onSelectAll} className="rounded-lg border px-2.5 py-1.5" title="Select all">Select all</button>
          <button onClick={props.onToggleLock} className="rounded-lg border px-2.5 py-1.5">{selected.selectable === false ? "Unlock" : "Lock"}</button>
          <button onClick={props.onDuplicate} className="rounded-lg border px-2.5 py-1.5">Duplicate</button>
          <button onClick={props.onDelete} className="rounded-lg border px-2.5 py-1.5 text-red-600">Delete</button>
        </div>
      </div>
    </>
  );
}
