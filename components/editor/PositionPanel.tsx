"use client";

import { useEffect, useState } from "react";
import type { SelectedSnapshot } from "@/types/editor";

type TransformChanges = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  angle?: number;
};

type Align =
  | "left"
  | "center"
  | "right"
  | "top"
  | "middle"
  | "bottom";

type Props = {
  open: boolean;
  selected: SelectedSnapshot | null;
  onClose: () => void;
  onTransform: (changes: TransformChanges) => void;
  onAlign: (align: Align) => void;
  onGroup: () => void;
  onUngroup: () => void;
  onSelectAll: () => void;
};

const clampNumber = (value: number, fallback: number) =>
  Number.isFinite(value) ? value : fallback;

export default function PositionPanel(props: Props) {
  const [lockRatio, setLockRatio] = useState(true);

  const selected = props.selected;

  useEffect(() => {
    if (!props.open) setLockRatio(true);
  }, [props.open]);

  if (!props.open || !selected) return null;

  const x = Math.round(selected.left ?? 0);
  const y = Math.round(selected.top ?? 0);
  const width = Math.max(1, Math.round(selected.width ?? 1));
  const height = Math.max(1, Math.round(selected.height ?? 1));
  const angle = Math.round(selected.angle ?? 0);

  const updateWidth = (next: number) => {
    const safe = Math.max(1, clampNumber(next, width));

    if (!lockRatio || width <= 0) {
      props.onTransform({ width: safe });
      return;
    }

    props.onTransform({
      width: safe,
      height: Math.max(1, (height * safe) / width),
    });
  };

  const updateHeight = (next: number) => {
    const safe = Math.max(1, clampNumber(next, height));

    if (!lockRatio || height <= 0) {
      props.onTransform({ height: safe });
      return;
    }

    props.onTransform({
      height: safe,
      width: Math.max(1, (width * safe) / height),
    });
  };

  return (
    <section className="fixed inset-x-2 bottom-[calc(122px_+_env(safe-area-inset-bottom))] z-50 max-h-[calc(100dvh_-_190px_-_env(safe-area-inset-bottom))] overflow-y-auto rounded-2xl border bg-white shadow-2xl md:absolute md:bottom-auto md:left-auto md:right-4 md:top-16 md:max-h-[calc(100vh-80px)] md:w-[310px]">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div>
          <div className="font-semibold">Position & size</div>
          <div className="mt-0.5 text-[11px] text-gray-400">
            {selected.isMultiSelection
              ? `${selected.selectionCount || 2} objects selected`
              : selected.isGroup
              ? "Grouped object"
              : "Exact canvas coordinates"}
          </div>
        </div>

        <button
          onClick={props.onClose}
          className="rounded-lg px-3 py-2 text-sm hover:bg-gray-100"
          aria-label="Close position panel"
        >
          ✕
        </button>
      </div>

      <div className="space-y-5 p-4">
        <div>
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Position
          </div>
          <div className="grid grid-cols-2 gap-2">
            <NumberField
              label="X"
              value={x}
              onChange={(value) => props.onTransform({ x: value })}
            />
            <NumberField
              label="Y"
              value={y}
              onChange={(value) => props.onTransform({ y: value })}
            />
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Size
            </div>
            <button
              onClick={() => setLockRatio((current) => !current)}
              className={`rounded-lg border px-2 py-1 text-[11px] font-semibold ${
                lockRatio
                  ? "border-violet-500 bg-violet-50 text-violet-700"
                  : "text-gray-500"
              }`}
              title="Lock aspect ratio"
            >
              {lockRatio ? "🔒 Ratio" : "🔓 Ratio"}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <NumberField label="W" value={width} min={1} onChange={updateWidth} />
            <NumberField label="H" value={height} min={1} onChange={updateHeight} />
          </div>
        </div>

        <div>
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Rotation
          </div>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="-180"
              max="180"
              step="1"
              value={angle}
              onChange={(e) =>
                props.onTransform({ angle: Number(e.target.value) })
              }
              className="min-w-0 flex-1"
            />
            <div className="w-20">
              <NumberField
                label="°"
                value={angle}
                min={-360}
                max={360}
                onChange={(value) => props.onTransform({ angle: value })}
              />
            </div>
          </div>
        </div>

        <div>
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Align to page
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Action label="Left" onClick={() => props.onAlign("left")} />
            <Action label="Center" onClick={() => props.onAlign("center")} />
            <Action label="Right" onClick={() => props.onAlign("right")} />
            <Action label="Top" onClick={() => props.onAlign("top")} />
            <Action label="Middle" onClick={() => props.onAlign("middle")} />
            <Action label="Bottom" onClick={() => props.onAlign("bottom")} />
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Selection
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Action label="Select all" onClick={props.onSelectAll} />

            {selected.isMultiSelection ? (
              <button
                onClick={props.onGroup}
                className="rounded-xl bg-black px-3 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
              >
                Group
              </button>
            ) : selected.isGroup && !selected.isMockup ? (
              <button
                onClick={props.onUngroup}
                className="rounded-xl bg-black px-3 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
              >
                Ungroup
              </button>
            ) : (
              <div className="rounded-xl border border-dashed px-3 py-2.5 text-center text-xs text-gray-400">
                Shift + click for multi-select
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl bg-gray-50 px-3 py-2 text-[11px] leading-5 text-gray-500">
          Arrow keys: 1 px · Shift + Arrow: 10 px · Ctrl/Cmd + G: Group · Ctrl/Cmd + Shift + G: Ungroup
        </div>
      </div>
    </section>
  );
}

function NumberField({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="flex items-center gap-2 rounded-xl border bg-white px-3 py-2">
      <span className="w-4 text-xs font-semibold text-gray-400">{label}</span>
      <input
        type="number"
        value={Number.isFinite(value) ? value : 0}
        min={min}
        max={max}
        step="1"
        onChange={(e) => onChange(Number(e.target.value))}
        className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none"
      />
    </label>
  );
}

function Action({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-xl border px-3 py-2.5 text-sm font-medium hover:bg-gray-50"
    >
      {label}
    </button>
  );
}
