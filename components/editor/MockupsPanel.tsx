import { useMemo, useState } from "react";

import {
  MOCKUPS,
  MOCKUP_CATEGORIES,
  type MockupCategory,
  type MockupFit,
} from "@/lib/editor/mockups";
import type { SelectedSnapshot } from "@/types/editor";

type Props = {
  selected: SelectedSnapshot | null;
  onAddMockup: (id: string) => void;
  onMockupImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMockupFit: (fit: MockupFit) => void;
  onMockupZoom: (value: number) => void;
  onMockupPanX: (value: number) => void;
  onMockupPanY: (value: number) => void;
  onMockupSurfaceColor: (value: string) => void;
  onMockupShadow: (value: number) => void;
  onMockupRemoveImage: () => void;
};

function Preview({ kind, theme }: { kind: string; theme: string }) {
  const dark = theme === "dark";
  const frame = dark ? "bg-slate-900" : "bg-slate-300";

  if (kind === "phone" || kind === "social-story") {
    return <div className={`h-20 w-10 rounded-xl p-1 ${frame}`}><div className="h-full w-full rounded-lg bg-white" /></div>;
  }

  if (kind === "tablet") {
    return <div className={`h-14 w-20 rounded-lg p-1 ${frame}`}><div className="h-full w-full rounded bg-white" /></div>;
  }

  if (kind === "laptop") {
    return <div className="flex flex-col items-center"><div className={`h-12 w-20 rounded-md p-1 ${frame}`}><div className="h-full w-full bg-white" /></div><div className="h-1.5 w-24 rounded-full bg-slate-400" /></div>;
  }

  if (kind === "desktop" || kind === "browser" || kind === "youtube" || kind === "billboard") {
    return <div className="flex flex-col items-center"><div className={`h-12 w-20 rounded-md p-1 ${frame}`}><div className="h-full w-full bg-white" /></div><div className="mt-1 h-3 w-1.5 bg-slate-400" /></div>;
  }

  if (kind === "watch") {
    return <div className={`h-16 w-10 rounded-xl border-[5px] ${dark ? "border-slate-900" : "border-slate-300"} bg-white`} />;
  }

  if (["paper", "poster", "book", "magazine", "sign"].includes(kind)) {
    return <div className="h-20 w-14 border bg-white shadow-sm" />;
  }

  if (kind === "card" || kind === "social-post") {
    return <div className="h-12 w-20 rounded-lg border bg-white shadow-sm" />;
  }

  if (kind === "tshirt") return <div className="text-4xl">👕</div>;
  if (kind === "hoodie") return <div className="text-4xl">🧥</div>;
  if (kind === "mug") return <div className="text-4xl">☕</div>;
  if (kind === "tote" || kind === "bag") return <div className="text-4xl">🛍️</div>;
  if (kind === "box") return <div className="text-4xl">📦</div>;
  if (["pouch", "bottle", "jar", "can", "tube"].includes(kind)) return <div className="text-4xl">🏷️</div>;

  return <div className="h-14 w-16 rounded-lg border bg-white" />;
}

function Range({ label, min, max, step, value, onChange, suffix = "" }: { label: string; min: number; max: number; step: number; value: number; onChange: (value: number) => void; suffix?: string }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs">
        <span className="font-semibold text-gray-600">{label}</span>
        <span className="text-gray-400">{value.toFixed(step < 1 ? 2 : 0)}{suffix}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full" />
    </div>
  );
}

export default function MockupsPanel(props: Props) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<MockupCategory>("All");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return MOCKUPS.filter((item) => {
      if (category !== "All" && item.category !== category) return false;
      if (!q) return true;
      return item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q) || item.keywords.join(" ").toLowerCase().includes(q);
    });
  }, [search, category]);

  const isSelected = Boolean(props.selected?.isMockup);
  const fit: MockupFit = props.selected?.mockupFit === "fit" ? "fit" : "fill";
  const zoom = Number(props.selected?.mockupZoom ?? 1);
  const panX = Number(props.selected?.mockupPanX ?? 0);
  const panY = Number(props.selected?.mockupPanY ?? 0);
  const shadow = Number(props.selected?.mockupShadow ?? 0.28);
  const surface = props.selected?.mockupSurfaceColor || "#f8fafc";

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-gradient-to-br from-violet-50 via-white to-cyan-50 p-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-bold">Smart Mockups</div>
            <div className="mt-1 text-[11px] text-gray-500">{MOCKUPS.length} editable device, print, brand & packaging scenes</div>
          </div>
          <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold text-violet-700 shadow-sm">FREE</span>
        </div>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search phone, laptop, t-shirt, box..." className="mt-3 w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none focus:border-violet-500" />
      </div>

      {isSelected && (
        <div className="rounded-2xl border border-violet-200 bg-violet-50/60 p-3">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <div className="text-sm font-bold">Selected mockup</div>
              <div className="text-[11px] text-gray-500">{props.selected?.mockupName || "Mockup"}</div>
            </div>
            <span className="rounded-full bg-violet-600 px-2 py-1 text-[10px] font-bold text-white">EDIT</span>
          </div>

          <label className="block cursor-pointer rounded-xl bg-black px-3 py-2.5 text-center text-sm font-semibold text-white hover:bg-gray-800">
            {props.selected?.mockupHasImage ? "Replace image" : "Add image"}
            <input type="file" accept="image/*" onChange={props.onMockupImageUpload} className="hidden" />
          </label>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <button onClick={() => props.onMockupFit("fill")} className={`rounded-xl border px-3 py-2 text-sm ${fit === "fill" ? "border-black bg-black text-white" : "bg-white"}`}>Fill</button>
            <button onClick={() => props.onMockupFit("fit")} className={`rounded-xl border px-3 py-2 text-sm ${fit === "fit" ? "border-black bg-black text-white" : "bg-white"}`}>Fit</button>
          </div>

          <div className="mt-4 space-y-4">
            <Range label="Image zoom" min={fit === "fill" ? 1 : 0.5} max={2.5} step={0.05} value={zoom} onChange={props.onMockupZoom} suffix="×" />
            <Range label="Image position X" min={-1} max={1} step={0.05} value={panX} onChange={props.onMockupPanX} />
            <Range label="Image position Y" min={-1} max={1} step={0.05} value={panY} onChange={props.onMockupPanY} />
            <Range label="Shadow" min={0} max={0.6} step={0.02} value={shadow} onChange={props.onMockupShadow} />
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-xs font-semibold text-gray-600">Surface / frame color</label>
            <input type="color" value={surface} onChange={(e) => props.onMockupSurfaceColor(e.target.value)} className="h-10 w-full cursor-pointer rounded-lg border bg-white" />
          </div>

          {props.selected?.mockupHasImage && (
            <button onClick={props.onMockupRemoveImage} className="mt-3 w-full rounded-xl border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50">Remove image</button>
          )}
        </div>
      )}

      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2">
        {MOCKUP_CATEGORIES.map((item) => (
          <button key={item} onClick={() => setCategory(item)} className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium ${category === item ? "border-black bg-black text-white" : "bg-white hover:bg-gray-50"}`}>{item}</button>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-600">{category === "All" ? "All mockups" : category}</span>
        <span className="rounded-full bg-gray-100 px-2 py-1 text-[10px] text-gray-500">{filtered.length}</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {filtered.map((item) => (
          <button key={item.id} onClick={() => props.onAddMockup(item.id)} className="group rounded-xl border bg-white p-2 text-left transition hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-md">
            <div className="flex h-24 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-gray-50 to-gray-100">
              <Preview kind={item.kind} theme={item.theme} />
            </div>
            <div className="mt-2 line-clamp-1 text-[11px] font-semibold text-gray-800">{item.name}</div>
            <div className="mt-0.5 text-[10px] text-gray-400">{item.category}</div>
          </button>
        ))}
      </div>

      {!filtered.length && <div className="rounded-xl border border-dashed p-8 text-center text-sm text-gray-400">No matching mockups.</div>}
    </div>
  );
}
