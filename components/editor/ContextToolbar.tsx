import { FONTS } from "@/lib/editor/fonts";
import type {
  EditorPanel,
  SelectedSnapshot,
} from "@/types/editor";

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

  onOpenPanel: (
    panel: Exclude<
      EditorPanel,
      null
    >
  ) => void;

  onSetImageAsBackground: () => void;
  onStartCrop: () => void;
  onToggleBullets: () => void;
  onOpenPosition: () => void;
  onGroup: () => void;
  onUngroup: () => void;
  onSelectAll: () => void;
  onUnavailableTool: (
    name: string
  ) => void;
};

export default function ContextToolbar(
  props: Props
) {
  const selected = props.selected;

  if (!selected) return null;

  const type =
    selected.type.toLowerCase();

  const isText = [
    "textbox",
    "text",
    "i-text",
    "itext",
  ].includes(type);

  const isImage = [
    "image",
    "fabricimage",
  ].includes(type);

  const isMockup = Boolean(selected.isMockup);
  const isSmartFrame = Boolean(selected.isSmartFrame);
  const isMultiSelection = Boolean(selected.isMultiSelection);
  const isGroup = Boolean(selected.isGroup) && !isMockup && !isSmartFrame;

  const isShape = !isMockup && !isSmartFrame && [
    "rect",
    "rectangle",
    "circle",
    "ellipse",
    "polygon",
    "polyline",
    "line",
    "path",
    "group",
  ].includes(type);

  return (
    <div className="pointer-events-none absolute left-1/2 top-2 z-40 w-full -translate-x-1/2 px-2 md:top-3 md:w-auto md:px-3">
      <div className="pointer-events-auto mx-auto flex max-w-[calc(100vw-16px)] items-center gap-2 overflow-x-auto overscroll-x-contain rounded-2xl border bg-white px-3 py-2 shadow-xl md:max-w-[calc(100vw-100px)]">
        {isMultiSelection && (
          <span className="whitespace-nowrap rounded-lg bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700">
            {selected.selectionCount || 2} selected
          </span>
        )}

        {isText && (
          <>
            <select
              value={
                selected.fontFamily ||
                "Arial"
              }
              onChange={(e) =>
                props.onUpdate({
                  fontFamily:
                    e.target.value,
                })
              }
              className="w-32 rounded-lg border px-2 py-1.5 text-sm"
            >
              {FONTS.map(
                (font) => (
                  <option
                    key={font}
                    value={font}
                  >
                    {font}
                  </option>
                )
              )}
            </select>

            <div className="flex overflow-hidden rounded-lg border">
              <button
                onClick={() =>
                  props.onUpdate({
                    fontSize:
                      Math.max(
                        8,
                        (selected.fontSize ||
                          40) - 2
                      ),
                  })
                }
                className="px-2"
              >
                −
              </button>

              <input
                type="number"
                min="8"
                max="300"
                value={Math.round(
                  selected.fontSize ||
                    40
                )}
                onChange={(e) =>
                  props.onUpdate({
                    fontSize:
                      Number(
                        e.target
                          .value
                      ),
                  })
                }
                className="w-16 border-x px-1 py-1.5 text-center text-sm outline-none"
              />

              <button
                onClick={() =>
                  props.onUpdate({
                    fontSize:
                      Math.min(
                        300,
                        (selected.fontSize ||
                          40) + 2
                      ),
                  })
                }
                className="px-2"
              >
                +
              </button>
            </div>

            <input
              type="color"
              value={
                typeof selected.fill ===
                "string"
                  ? selected.fill
                  : "#111111"
              }
              onChange={(e) =>
                props.onUpdate({
                  fill: e.target.value,
                })
              }
              className="h-8 w-9 cursor-pointer rounded border"
              title="Text color"
            />

            <button
              onClick={() =>
                props.onUpdate({
                  fontWeight:
                    selected.fontWeight ===
                    "bold"
                      ? "normal"
                      : "bold",
                })
              }
              className={`rounded-lg border px-3 py-1.5 font-bold ${
                selected.fontWeight ===
                "bold"
                  ? "bg-black text-white"
                  : ""
              }`}
            >
              B
            </button>

            <button
              onClick={() =>
                props.onUpdate({
                  fontStyle:
                    selected.fontStyle ===
                    "italic"
                      ? "normal"
                      : "italic",
                })
              }
              className={`rounded-lg border px-3 py-1.5 italic ${
                selected.fontStyle ===
                "italic"
                  ? "bg-black text-white"
                  : ""
              }`}
            >
              I
            </button>

            <button
              onClick={() =>
                props.onUpdate({
                  underline:
                    !selected.underline,
                })
              }
              className={`rounded-lg border px-3 py-1.5 underline ${
                selected.underline
                  ? "bg-black text-white"
                  : ""
              }`}
            >
              U
            </button>

            <button
              onClick={() =>
                props.onUpdate({
                  linethrough:
                    !selected.linethrough,
                })
              }
              className={`rounded-lg border px-3 py-1.5 line-through ${
                selected.linethrough
                  ? "bg-black text-white"
                  : ""
              }`}
            >
              S
            </button>

            <button
              onClick={() =>
                props.onUpdate({
                  text: String(
                    selected.text || ""
                  ).toUpperCase(),
                })
              }
              className="rounded-lg border px-3 py-1.5 text-sm"
            >
              aA
            </button>

            <select
              value={
                selected.textAlign ||
                "left"
              }
              onChange={(e) =>
                props.onUpdate({
                  textAlign:
                    e.target.value,
                })
              }
              className="rounded-lg border px-2 py-1.5 text-sm"
            >
              <option value="left">
                Left
              </option>
              <option value="center">
                Center
              </option>
              <option value="right">
                Right
              </option>
              <option value="justify">
                Justify
              </option>
            </select>

            <button
              onClick={
                props.onToggleBullets
              }
              className="rounded-lg border px-3 py-1.5 text-sm"
              title="Bullets"
            >
              •☰
            </button>

            <button
              onClick={() =>
                props.onOpenPanel(
                  "textEffects"
                )
              }
              className="rounded-lg border px-3 py-1.5 text-sm"
            >
              Spacing
            </button>

            <button
              onClick={() =>
                props.onOpenPanel(
                  "textEffects"
                )
              }
              className="rounded-lg border px-3 py-1.5 text-sm"
            >
              Effects
            </button>

          </>
        )}

        {isSmartFrame && (
          <>
            <button
              onClick={() =>
                props.onOpenPanel(
                  "frameEdit"
                )
              }
              className="rounded-lg bg-violet-600 px-3 py-1.5 text-sm font-semibold text-white"
            >
              Edit frame
            </button>

            <button
              onClick={
                props.onFlipHorizontal
              }
              className="rounded-lg border px-3 py-1.5 text-sm"
            >
              Flip
            </button>
          </>
        )}

        {isMockup && (
          <>
            <button
              onClick={() => props.onOpenPanel("mockups")}
              className="rounded-lg bg-violet-600 px-3 py-1.5 text-sm font-semibold text-white"
            >
              Edit mockup
            </button>
            <button
              onClick={props.onFlipHorizontal}
              className="rounded-lg border px-3 py-1.5 text-sm"
            >
              Flip
            </button>
          </>
        )}

        {isImage && (
          <>
            <button
              onClick={() =>
                props.onOpenPanel(
                  "imageEdit"
                )
              }
              className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-semibold"
            >
              Edit image
            </button>



            <button
              onClick={props.onStartCrop}
              className="rounded-lg border px-3 py-1.5 text-sm"
            >
              Crop
            </button>

            <button
              onClick={
                props.onFlipHorizontal
              }
              className="rounded-lg border px-3 py-1.5 text-sm"
            >
              Flip
            </button>

            <button
              onClick={() =>
                props.onOpenPanel(
                  "imageEdit"
                )
              }
              className="rounded-lg border px-3 py-1.5 text-sm"
            >
              Effects
            </button>


            <button
              onClick={
                props.onSetImageAsBackground
              }
              className="rounded-lg border px-3 py-1.5 text-sm"
            >
              Set BG
            </button>
          </>
        )}

        {isShape && (
          <>
            <label className="flex items-center gap-2 rounded-lg border px-2 py-1.5 text-xs">
              Fill
              <input
                type="color"
                value={
                  typeof selected.fill ===
                  "string"
                    ? selected.fill
                    : "#111111"
                }
                onChange={(e) =>
                  props.onUpdate({
                    fill: e.target.value,
                  })
                }
                className="h-7 w-8"
              />
            </label>

            <label className="flex items-center gap-2 rounded-lg border px-2 py-1.5 text-xs">
              Border
              <input
                type="color"
                value={
                  typeof selected.stroke ===
                  "string"
                    ? selected.stroke
                    : "#111111"
                }
                onChange={(e) =>
                  props.onUpdate({
                    stroke:
                      e.target.value,
                  })
                }
                className="h-7 w-8"
              />
            </label>

            <input
              type="number"
              min="0"
              max="30"
              value={
                selected.strokeWidth ??
                0
              }
              onChange={(e) =>
                props.onUpdate({
                  strokeWidth:
                    Number(
                      e.target.value
                    ),
                })
              }
              className="w-16 rounded-lg border px-2 py-1.5 text-sm"
              title="Border width"
            />

            {[
              "rect",
              "rectangle",
            ].includes(type) && (
              <input
                type="number"
                min="0"
                max="200"
                value={
                  selected.rx ?? 0
                }
                onChange={(e) =>
                  props.onUpdate({
                    rx: Number(
                      e.target
                        .value
                    ),
                    ry: Number(
                      e.target
                        .value
                    ),
                  })
                }
                className="w-16 rounded-lg border px-2 py-1.5 text-sm"
                title="Corner radius"
              />
            )}

            <button
              onClick={
                props.onFlipHorizontal
              }
              className="rounded-lg border px-3 py-1.5 text-sm"
            >
              Flip
            </button>

          </>
        )}

        <label className="flex items-center gap-2 rounded-lg border px-2 py-1.5 text-xs">
          Opacity
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={
              selected.opacity ?? 1
            }
            onChange={(e) =>
              props.onUpdate({
                opacity: Number(
                  e.target.value
                ),
              })
            }
            className="w-20"
          />
        </label>

        {isMultiSelection && (
          <button
            onClick={props.onGroup}
            className="rounded-lg bg-black px-3 py-1.5 text-sm font-semibold text-white"
            title="Group selected objects (Ctrl/Cmd + G)"
          >
            Group
          </button>
        )}

        {isGroup && (
          <button
            onClick={props.onUngroup}
            className="rounded-lg bg-black px-3 py-1.5 text-sm font-semibold text-white"
            title="Ungroup (Ctrl/Cmd + Shift + G)"
          >
            Ungroup
          </button>
        )}

        <button
          onClick={props.onOpenPosition}
          className="rounded-lg border px-3 py-1.5 text-sm"
        >
          Position
        </button>

        <button
          onClick={props.onSelectAll}
          className="rounded-lg border px-3 py-1.5 text-sm"
          title="Select all (Ctrl/Cmd + A)"
        >
          Select all
        </button>

        <button
          onClick={
            props.onToggleLock
          }
          className="rounded-lg border px-3 py-1.5 text-sm"
        >
          {selected.selectable ===
          false
            ? "Unlock"
            : "Lock"}
        </button>

        <button
          onClick={
            props.onDuplicate
          }
          className="rounded-lg border px-3 py-1.5 text-sm"
        >
          Duplicate
        </button>

        <button
          onClick={props.onDelete}
          className="rounded-lg border px-3 py-1.5 text-sm text-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
