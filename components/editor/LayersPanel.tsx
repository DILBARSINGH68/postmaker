import type { FabricObject } from "fabric";

type Props = {
  objects: FabricObject[];
  onSelect: (object: FabricObject) => void;
  onToggleVisibility: (object: FabricObject) => void;
  onToggleLock: (object: FabricObject) => void;
  onClear: () => void;
};

function layerName(object: FabricObject, index: number) {
  const obj = object as any;
  if (["textbox", "text", "i-text"].includes(object.type || "")) {
    const text = String(obj.text || "Text").trim();
    return text ? text.slice(0, 26) : `Text ${index + 1}`;
  }
  if (object.type === "rect") return `Rectangle ${index + 1}`;
  if (object.type === "circle") return `Circle ${index + 1}`;
  if (object.type === "line") return `Line ${index + 1}`;
  if (object.type === "image") return `Image ${index + 1}`;
  return `${object.type || "Layer"} ${index + 1}`;
}

export default function LayersPanel(props: Props) {
  return (
    <div>
      <h2 className="font-semibold">Layers</h2>

      <div className="mt-4 space-y-2">
        {props.objects.length === 0 && (
          <p className="text-sm text-gray-400">No elements yet.</p>
        )}

        {[...props.objects].reverse().map((object, reverseIndex) => {
          const originalIndex = props.objects.length - 1 - reverseIndex;
          const locked = object.selectable === false;
          const visible = object.visible !== false;

          return (
            <div
              key={`${object.type}-${originalIndex}`}
              className="flex items-center gap-2 rounded-lg border p-2"
            >
              <button
                onClick={() => props.onToggleVisibility(object)}
                className="rounded-md px-2 py-1 text-xs hover:bg-gray-100"
              >
                {visible ? "👁" : "◌"}
              </button>

              <button
                onClick={() => props.onSelect(object)}
                className="min-w-0 flex-1 truncate text-left text-sm"
              >
                {layerName(object, originalIndex)}
              </button>

              <button
                onClick={() => props.onToggleLock(object)}
                className="rounded-md px-2 py-1 text-xs hover:bg-gray-100"
              >
                {locked ? "🔒" : "🔓"}
              </button>
            </div>
          );
        })}
      </div>

      <button
        onClick={props.onClear}
        className="mt-6 w-full rounded-xl border p-3 text-sm"
      >
        Clear Design
      </button>
    </div>
  );
}
