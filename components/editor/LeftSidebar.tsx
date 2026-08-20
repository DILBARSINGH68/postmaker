import { useMemo, useState } from "react";
import type { Format } from "@/types/editor";
import { FORMATS } from "@/lib/editor/formats";
import { TEMPLATE_CARDS, type TemplateType } from "@/lib/editor/templates";

type Tab = "templates" | "text" | "uploads" | "elements" | "background";

type Props = {
  format: Format;
  background: string;
  onFormatChange: (format: Format) => void;
  onTemplate: (type: TemplateType) => void;
  onAddHeading: () => void;
  onAddSubtitle: () => void;
  onAddBody: () => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddRectangle: () => void;
  onAddCircle: () => void;
  onAddLine: () => void;
  onBackgroundChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function LeftSidebar(props: Props) {
  const [tab, setTab] = useState<Tab>("templates");
  const [search, setSearch] = useState("");

  const filteredTemplates = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return TEMPLATE_CARDS;
    return TEMPLATE_CARDS.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <aside
      className="flex shrink-0 border-r bg-white"
      style={{ width: 320, flex: "0 0 320px" }}
    >
      <div
        className="shrink-0 border-r p-2"
        style={{ width: 84, flex: "0 0 84px" }}
      >
        {[
          ["templates", "▦", "Templates"],
          ["text", "T", "Text"],
          ["uploads", "↑", "Uploads"],
          ["elements", "◫", "Elements"],
          ["background", "◐", "Background"],
        ].map(([value, icon, label]) => (
          <button
            key={value}
            onClick={() => setTab(value as Tab)}
            className={`mb-1 w-full rounded-xl px-2 py-3 text-center text-xs ${
              tab === value ? "bg-black text-white" : "hover:bg-gray-100"
            }`}
          >
            <div className="text-lg">{icon}</div>
            <div className="mt-1">{label}</div>
          </button>
        ))}
      </div>

      <div
        className="min-w-0 flex-1 overflow-y-auto p-4"
        style={{ width: 236 }}
      >
        {tab === "templates" && (
          <>
            <h2 className="font-semibold">Templates</h2>

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search templates"
              className="mt-3 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:border-black"
            />

            <div className="mt-4 grid grid-cols-2 gap-2">
              {filteredTemplates.map((template) => (
                <button
                  key={template.type}
                  onClick={() => props.onTemplate(template.type)}
                  className="rounded-xl border p-2 text-left hover:bg-gray-50"
                >
                  <div className={`mb-2 aspect-square rounded-lg ${template.previewClass}`} />
                  <div className="text-xs font-semibold">{template.name}</div>
                  <div className="text-[10px] text-gray-400">{template.category}</div>
                </button>
              ))}
            </div>
          </>
        )}

        {tab === "text" && (
          <>
            <h2 className="font-semibold">Text</h2>

            <div className="mt-4 space-y-2">
              <button
                onClick={props.onAddHeading}
                className="w-full rounded-xl border p-4 text-left hover:bg-gray-50"
              >
                <div className="text-xl font-bold">Add a heading</div>
              </button>

              <button
                onClick={props.onAddSubtitle}
                className="w-full rounded-xl border p-4 text-left hover:bg-gray-50"
              >
                <div className="font-semibold">Add a subheading</div>
              </button>

              <button
                onClick={props.onAddBody}
                className="w-full rounded-xl border p-4 text-left hover:bg-gray-50"
              >
                <div className="text-sm">Add body text</div>
              </button>
            </div>
          </>
        )}

        {tab === "uploads" && (
          <>
            <h2 className="font-semibold">Uploads</h2>

            <label className="mt-4 block cursor-pointer rounded-2xl border border-dashed p-6 text-center hover:bg-gray-50">
              <div className="text-2xl">↑</div>
              <div className="mt-2 font-semibold">Upload image</div>
              <div className="mt-1 text-xs text-gray-400">PNG, JPG, WEBP</div>

              <input
                type="file"
                accept="image/*"
                onChange={props.onImageUpload}
                className="hidden"
              />
            </label>
          </>
        )}

        {tab === "elements" && (
          <>
            <h2 className="font-semibold">Elements</h2>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                onClick={props.onAddRectangle}
                className="rounded-xl border p-4 hover:bg-gray-50"
              >
                ▰
                <div className="mt-2 text-xs">Rectangle</div>
              </button>

              <button
                onClick={props.onAddCircle}
                className="rounded-xl border p-4 hover:bg-gray-50"
              >
                ●
                <div className="mt-2 text-xs">Circle</div>
              </button>

              <button
                onClick={props.onAddLine}
                className="rounded-xl border p-4 hover:bg-gray-50"
              >
                ━
                <div className="mt-2 text-xs">Line</div>
              </button>
            </div>
          </>
        )}

        {tab === "background" && (
          <>
            <h2 className="font-semibold">Background</h2>

            <div className="mt-4 rounded-xl border p-4">
              <input
                type="color"
                value={props.background}
                onChange={props.onBackgroundChange}
                className="h-12 w-full cursor-pointer"
              />

              <div className="mt-2 text-xs text-gray-400">
                {props.background.toUpperCase()}
              </div>
            </div>

            <h3 className="mt-6 text-xs font-semibold uppercase text-gray-400">
              Size
            </h3>

            <div className="mt-2 space-y-2">
              {FORMATS.map((item) => (
                <button
                  key={item.name}
                  onClick={() => props.onFormatChange(item)}
                  className={`w-full rounded-xl border p-3 text-left ${
                    props.format.name === item.name
                      ? "border-black bg-gray-50"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="text-sm font-medium">{item.name}</div>
                  <div className="text-xs text-gray-400">
                    {item.width} × {item.height}
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
