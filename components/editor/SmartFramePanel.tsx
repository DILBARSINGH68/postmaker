"use client";

import {
  useMemo,
  useState,
} from "react";

import type {
  SelectedSnapshot,
} from "@/types/editor";
import {
  SMART_FRAME_CATEGORIES,
  SMART_FRAMES,
  type SmartFrameCategory,
  type SmartFrameFit,
} from "@/lib/editor/smartFrames";

type Props = {
  selected:
    | SelectedSnapshot
    | null;
  onAddFrame: (
    id: string
  ) => void;
  onFrameImageUpload: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  onFrameFit: (
    fit: SmartFrameFit
  ) => void;
  onFrameZoom: (
    value: number
  ) => void;
  onFramePanX: (
    value: number
  ) => void;
  onFramePanY: (
    value: number
  ) => void;
  onFrameBorderColor: (
    value: string
  ) => void;
  onFrameBorderWidth: (
    value: number
  ) => void;
  onFrameRemoveImage: () => void;
};

function Range({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (
    value: number
  ) => void;
}) {
  return (
    <label className="block">
      <div className="mb-2 flex items-center justify-between text-xs">
        <span className="font-semibold text-gray-600">
          {label}
        </span>

        <span className="text-gray-400">
          {value.toFixed(
            step < 1
              ? 2
              : 0
          )}
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
            Number(
              e.target.value
            )
          )
        }
        className="w-full"
      />
    </label>
  );
}

export default function SmartFramePanel(
  props: Props
) {
  const [
    search,
    setSearch,
  ] = useState("");

  const [
    category,
    setCategory,
  ] =
    useState<SmartFrameCategory>(
      "All"
    );

  const filtered =
    useMemo(() => {
      const q =
        search
          .trim()
          .toLowerCase();

      return SMART_FRAMES.filter(
        (item) => {
          if (
            category !==
              "All" &&
            item.category !==
              category
          ) {
            return false;
          }

          if (!q)
            return true;

          return (
            item.name
              .toLowerCase()
              .includes(q) ||
            item.category
              .toLowerCase()
              .includes(q) ||
            item.keywords
              .join(" ")
              .toLowerCase()
              .includes(q)
          );
        }
      );
    }, [
      search,
      category,
    ]);

  const active =
    Boolean(
      props.selected
        ?.isSmartFrame
    );

  return (
    <>
      <div className="rounded-2xl bg-gradient-to-br from-fuchsia-50 via-white to-cyan-50 p-3">
        <div className="text-sm font-bold">
          Smart Frames
        </div>

        <div className="mt-1 text-[11px] leading-5 text-gray-500">
          Frame add karo, photo upload karo, phir Fit / Fill / Zoom se crop control karo.
        </div>

        <input
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          placeholder="Search frames"
          className="mt-3 w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none focus:border-violet-500"
        />
      </div>

      <div className="-mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-2">
        {SMART_FRAME_CATEGORIES.map(
          (item) => (
            <button
              key={item}
              onClick={() =>
                setCategory(
                  item
                )
              }
              className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium ${
                category ===
                item
                  ? "border-black bg-black text-white"
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              {item}
            </button>
          )
        )}
      </div>

      <div className="mt-2 grid grid-cols-3 gap-2">
        {filtered.map(
          (item) => (
            <button
              key={
                item.id
              }
              onClick={() =>
                props.onAddFrame(
                  item.id
                )
              }
              className="rounded-xl border bg-white p-2 text-center hover:border-violet-400 hover:shadow-sm"
            >
              <div className="flex h-12 items-center justify-center rounded-lg bg-gray-50 text-2xl">
                {
                  item.preview
                }
              </div>

              <div className="mt-2 line-clamp-2 text-[10px] font-semibold">
                {
                  item.name
                }
              </div>
            </button>
          )
        )}
      </div>

      {active && (
        <div className="mt-5 border-t pt-5">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <div className="text-sm font-bold">
                Edit selected frame
              </div>

              <div className="mt-1 text-[11px] text-gray-400">
                {props.selected
                  ?.smartFrameName ||
                  "Smart frame"}
              </div>
            </div>

            <div className="rounded-full bg-violet-50 px-2 py-1 text-[10px] font-semibold text-violet-700">
              EDIT
            </div>
          </div>

          <label className="block cursor-pointer rounded-xl bg-violet-600 px-4 py-3 text-center text-sm font-bold text-white">
            {props.selected
              ?.smartFrameHasImage
              ? "Replace photo"
              : "Add photo"}

            <input
              type="file"
              accept="image/*"
              onChange={
                props.onFrameImageUpload
              }
              className="hidden"
            />
          </label>

          <div className="mt-3 grid grid-cols-2 gap-2">
            {(
              [
                "fill",
                "fit",
              ] as SmartFrameFit[]
            ).map(
              (fit) => (
                <button
                  key={fit}
                  onClick={() =>
                    props.onFrameFit(
                      fit
                    )
                  }
                  className={`rounded-xl border px-3 py-2 text-xs font-semibold capitalize ${
                    props.selected
                      ?.smartFrameFit ===
                    fit
                      ? "border-black bg-black text-white"
                      : "hover:bg-gray-50"
                  }`}
                >
                  {fit}
                </button>
              )
            )}
          </div>

          <div className="mt-4 space-y-4">
            <Range
              label="Zoom"
              min={0.5}
              max={3}
              step={0.05}
              value={
                props.selected
                  ?.smartFrameZoom ??
                1
              }
              onChange={
                props.onFrameZoom
              }
            />

            <Range
              label="Horizontal position"
              min={-1}
              max={1}
              step={0.05}
              value={
                props.selected
                  ?.smartFramePanX ??
                0
              }
              onChange={
                props.onFramePanX
              }
            />

            <Range
              label="Vertical position"
              min={-1}
              max={1}
              step={0.05}
              value={
                props.selected
                  ?.smartFramePanY ??
                0
              }
              onChange={
                props.onFramePanY
              }
            />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <label>
              <span className="mb-1 block text-xs font-semibold text-gray-600">
                Border
              </span>

              <input
                type="color"
                value={
                  props.selected
                    ?.smartFrameBorderColor ||
                  "#ffffff"
                }
                onChange={(e) =>
                  props.onFrameBorderColor(
                    e.target.value
                  )
                }
                className="h-10 w-full cursor-pointer rounded-lg border bg-white p-1"
              />
            </label>

            <label>
              <span className="mb-1 block text-xs font-semibold text-gray-600">
                Width
              </span>

              <input
                type="number"
                min="0"
                max="40"
                value={
                  props.selected
                    ?.smartFrameBorderWidth ??
                  6
                }
                onChange={(e) =>
                  props.onFrameBorderWidth(
                    Number(
                      e.target.value
                    )
                  )
                }
                className="w-full rounded-xl border px-3 py-2 text-sm"
              />
            </label>
          </div>

          {props.selected
            ?.smartFrameHasImage && (
            <button
              onClick={
                props.onFrameRemoveImage
              }
              className="mt-3 w-full rounded-xl border px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
            >
              Remove photo
            </button>
          )}
        </div>
      )}
    </>
  );
}
