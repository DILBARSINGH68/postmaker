import { FONTS } from "@/lib/editor/fonts";

type Props = {
  selected: any;
  updateSelected: (changes: any) => void;
  duplicateSelected: () => void;
  deleteSelected: () => void;
  bringForward: () => void;
  sendBackward: () => void;
  bringToFront: () => void;
  sendToBack: () => void;
  toggleSelectedLock: () => void;
  toggleSelectedVisibility: () => void;
  flipHorizontal: () => void;
  flipVertical: () => void;
};

export default function PropertiesPanel(props: Props) {
  const selected = props.selected;

  const selectedType = String(
    selected?.type || selected?.constructor?.name || ""
  ).toLowerCase();

  const isText = ["textbox", "text", "i-text", "itext"].includes(
    selectedType
  );

  const isShape = ["rect", "rectangle", "circle", "line"].includes(
    selectedType
  );

  const isImage = ["image", "fabricimage"].includes(selectedType);
  const locked = selected?.selectable === false;
  const visible = selected?.visible !== false;

  const textColor =
    typeof selected?.fill === "string" ? selected.fill : "#111111";

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Properties</h2>

        <span className="rounded-full bg-gray-100 px-2 py-1 text-xs">
          {selectedType || "object"}
        </span>
      </div>

      {isText && (
        <>
          <div>
            <label className="mb-2 block text-xs font-semibold text-gray-500">
              Text
            </label>

            <textarea
              value={selected.text || ""}
              onChange={(e) =>
                props.updateSelected({
                  text: e.target.value,
                })
              }
              rows={3}
              className="w-full rounded-xl border p-3 text-sm outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold text-gray-500">
              Font
            </label>

            <select
              value={selected.fontFamily || "Arial"}
              onChange={(e) =>
                props.updateSelected({
                  fontFamily: e.target.value,
                })
              }
              className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:border-black"
            >
              {FONTS.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="mb-2 block text-xs font-semibold text-gray-500">
                Font Size
              </label>

              <input
                type="number"
                min="8"
                max="300"
                value={Math.round(selected.fontSize || 40)}
                onChange={(e) =>
                  props.updateSelected({
                    fontSize: Number(e.target.value),
                  })
                }
                className="w-full rounded-xl border px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold text-gray-500">
                Text Color
              </label>

              <input
                type="color"
                value={textColor}
                onChange={(e) =>
                  props.updateSelected({
                    fill: e.target.value,
                  })
                }
                className="h-10 w-full cursor-pointer rounded-lg border"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold text-gray-500">
              Style
            </label>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() =>
                  props.updateSelected({
                    fontWeight:
                      selected.fontWeight === "bold" ? "normal" : "bold",
                  })
                }
                className={`rounded-xl border p-2 font-bold ${
                  selected.fontWeight === "bold"
                    ? "bg-black text-white"
                    : "hover:bg-gray-50"
                }`}
              >
                B
              </button>

              <button
                onClick={() =>
                  props.updateSelected({
                    fontStyle:
                      selected.fontStyle === "italic" ? "normal" : "italic",
                  })
                }
                className={`rounded-xl border p-2 italic ${
                  selected.fontStyle === "italic"
                    ? "bg-black text-white"
                    : "hover:bg-gray-50"
                }`}
              >
                I
              </button>

              <button
                onClick={() =>
                  props.updateSelected({
                    underline: !selected.underline,
                  })
                }
                className={`rounded-xl border p-2 underline ${
                  selected.underline
                    ? "bg-black text-white"
                    : "hover:bg-gray-50"
                }`}
              >
                U
              </button>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold text-gray-500">
              Alignment
            </label>

            <div className="grid grid-cols-3 gap-2">
              {[
                ["left", "Left"],
                ["center", "Center"],
                ["right", "Right"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  onClick={() =>
                    props.updateSelected({
                      textAlign: value,
                    })
                  }
                  className={`rounded-xl border p-2 text-xs ${
                    selected.textAlign === value
                      ? "bg-black text-white"
                      : "hover:bg-gray-50"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-500">
                Letter Spacing
              </label>
              <span className="text-xs text-gray-400">
                {selected.charSpacing ?? 0}
              </span>
            </div>

            <input
              type="range"
              min="-100"
              max="500"
              step="10"
              value={selected.charSpacing ?? 0}
              onChange={(e) =>
                props.updateSelected({
                  charSpacing: Number(e.target.value),
                })
              }
              className="w-full"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-500">
                Line Height
              </label>
              <span className="text-xs text-gray-400">
                {(selected.lineHeight ?? 1.16).toFixed(2)}
              </span>
            </div>

            <input
              type="range"
              min="0.8"
              max="2"
              step="0.05"
              value={selected.lineHeight ?? 1.16}
              onChange={(e) =>
                props.updateSelected({
                  lineHeight: Number(e.target.value),
                })
              }
              className="w-full"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold text-gray-500">
              Text Transform
            </label>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() =>
                  props.updateSelected({
                    text: String(selected.text || "").toUpperCase(),
                  })
                }
                className="rounded-xl border p-2 text-xs hover:bg-gray-50"
              >
                UPPERCASE
              </button>

              <button
                onClick={() =>
                  props.updateSelected({
                    text: String(selected.text || "").toLowerCase(),
                  })
                }
                className="rounded-xl border p-2 text-xs hover:bg-gray-50"
              >
                lowercase
              </button>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold text-gray-500">
              Text Stroke
            </label>

            <div className="grid grid-cols-2 gap-2">
              <input
                type="color"
                value={
                  typeof selected.stroke === "string"
                    ? selected.stroke
                    : "#000000"
                }
                onChange={(e) =>
                  props.updateSelected({
                    stroke: e.target.value,
                  })
                }
                className="h-10 w-full cursor-pointer rounded-lg border"
              />

              <input
                type="number"
                min="0"
                max="20"
                value={selected.strokeWidth ?? 0}
                onChange={(e) =>
                  props.updateSelected({
                    strokeWidth: Number(e.target.value),
                  })
                }
                className="w-full rounded-xl border px-3 py-2 text-sm"
              />
            </div>
          </div>
        </>
      )}

      {isShape && (
        <>
          <div>
            <label className="mb-2 block text-xs font-semibold text-gray-500">
              Fill
            </label>

            <input
              type="color"
              value={
                typeof selected.fill === "string"
                  ? selected.fill
                  : "#111111"
              }
              onChange={(e) =>
                props.updateSelected({
                  fill: e.target.value,
                })
              }
              className="h-10 w-full cursor-pointer rounded-lg border"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold text-gray-500">
              Border
            </label>

            <div className="grid grid-cols-2 gap-2">
              <input
                type="color"
                value={
                  typeof selected.stroke === "string"
                    ? selected.stroke
                    : "#111111"
                }
                onChange={(e) =>
                  props.updateSelected({
                    stroke: e.target.value,
                  })
                }
                className="h-10 w-full cursor-pointer rounded-lg border"
              />

              <input
                type="number"
                min="0"
                max="20"
                value={selected.strokeWidth ?? 0}
                onChange={(e) =>
                  props.updateSelected({
                    strokeWidth: Number(e.target.value),
                  })
                }
                className="w-full rounded-xl border px-3 py-2 text-sm"
              />
            </div>
          </div>

          {["rect", "rectangle"].includes(selectedType) && (
            <div>
              <label className="mb-2 block text-xs font-semibold text-gray-500">
                Corner Radius
              </label>

              <input
                type="range"
                min="0"
                max="100"
                value={selected.rx ?? 0}
                onChange={(e) =>
                  props.updateSelected({
                    rx: Number(e.target.value),
                    ry: Number(e.target.value),
                  })
                }
                className="w-full"
              />
            </div>
          )}
        </>
      )}

      {isImage && (
        <div>
          <label className="mb-2 block text-xs font-semibold text-gray-500">
            Image
          </label>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={props.flipHorizontal}
              className="rounded-xl border p-2 text-xs hover:bg-gray-50"
            >
              Flip Horizontal
            </button>

            <button
              onClick={props.flipVertical}
              className="rounded-xl border p-2 text-xs hover:bg-gray-50"
            >
              Flip Vertical
            </button>
          </div>
        </div>
      )}

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-xs font-semibold text-gray-500">
            Opacity
          </label>

          <span className="text-xs text-gray-400">
            {Math.round((selected.opacity ?? 1) * 100)}%
          </span>
        </div>

        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={selected.opacity ?? 1}
          onChange={(e) =>
            props.updateSelected({
              opacity: Number(e.target.value),
            })
          }
          className="w-full"
        />
      </div>

      <div className="border-t pt-5">
        <p className="mb-3 text-xs font-semibold uppercase text-gray-400">
          Position
        </p>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={props.bringToFront}
            className="rounded-xl border p-2 text-xs hover:bg-gray-50"
          >
            To Front
          </button>

          <button
            onClick={props.sendToBack}
            className="rounded-xl border p-2 text-xs hover:bg-gray-50"
          >
            To Back
          </button>

          <button
            onClick={props.bringForward}
            className="rounded-xl border p-2 text-xs hover:bg-gray-50"
          >
            Forward
          </button>

          <button
            onClick={props.sendBackward}
            className="rounded-xl border p-2 text-xs hover:bg-gray-50"
          >
            Backward
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={props.toggleSelectedVisibility}
          className="rounded-xl border p-2 text-xs hover:bg-gray-50"
        >
          {visible ? "Hide" : "Show"}
        </button>

        <button
          onClick={props.toggleSelectedLock}
          className="rounded-xl border p-2 text-xs hover:bg-gray-50"
        >
          {locked ? "Unlock" : "Lock"}
        </button>
      </div>

      <button
        onClick={props.duplicateSelected}
        className="w-full rounded-xl border p-3 text-sm hover:bg-gray-50"
      >
        ⧉ Duplicate
      </button>

      <button
        onClick={props.deleteSelected}
        className="w-full rounded-xl border border-red-200 p-3 text-sm text-red-600 hover:bg-red-50"
      >
        ðŸ—‘ Delete
      </button>
    </div>
  );
}
