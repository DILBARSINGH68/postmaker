"use client";

import { useState } from "react";

export type DownloadType =
  | "png"
  | "jpeg"
  | "pdf"
  | "svg";

type Props = {
  open: boolean;
  onClose: () => void;
  onDownload: (
    type: DownloadType,
    multiplier: number
  ) => void;
};

const TYPES: {
  type: DownloadType;
  label: string;
  note: string;
  badge?: string;
}[] = [
  {
    type: "png",
    label: "PNG",
    note: "Best for social posts, graphics and transparency",
    badge: "Recommended",
  },
  {
    type: "jpeg",
    label: "JPG",
    note: "Smaller file, best for sharing photos",
  },
  {
    type: "pdf",
    label: "PDF",
    note: "PDF download for resumes/documents; multi-page designs export all pages",
    badge: "Resume",
  },
  {
    type: "svg",
    label: "SVG",
    note: "Vector export for supported design elements",
  },
];

export default function DownloadPanel(
  props: Props
) {
  const [type, setType] =
    useState<DownloadType>("png");
  const [multiplier, setMultiplier] =
    useState(2);

  if (!props.open) return null;

  return (
    <>
      <button
        aria-label="Close download panel"
        className="fixed inset-0 z-[80] cursor-default bg-black/5"
        onClick={props.onClose}
      />

      <section className="fixed inset-x-2 bottom-[calc(122px_+_env(safe-area-inset-bottom))] z-[90] max-h-[calc(100dvh_-_190px_-_env(safe-area-inset-bottom))] overflow-y-auto rounded-2xl border bg-white shadow-2xl md:bottom-auto md:left-auto md:right-4 md:top-16 md:max-h-[calc(100vh-80px)] md:w-[360px]">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div>
            <h2 className="font-bold">
              Download design
            </h2>
            <p className="mt-0.5 text-xs text-gray-400">
              Choose the file format you need
            </p>
          </div>

          <button
            onClick={props.onClose}
            className="rounded-lg px-3 py-2 hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        <div className="p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            File type
          </div>

          <div className="mt-3 space-y-2">
            {TYPES.map((item) => (
              <button
                key={item.type}
                onClick={() =>
                  setType(item.type)
                }
                className={`flex w-full items-start justify-between rounded-xl border p-3 text-left transition ${
                  type === item.type
                    ? "border-violet-500 bg-violet-50 ring-1 ring-violet-500"
                    : "hover:bg-gray-50"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">
                      {item.label}
                    </span>

                    {item.badge && (
                      <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-semibold text-violet-700">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  <div className="mt-1 text-xs leading-5 text-gray-400">
                    {item.note}
                  </div>
                </div>

                <span
                  className={`mt-1 flex h-5 w-5 items-center justify-center rounded-full border text-xs ${
                    type === item.type
                      ? "border-violet-600 bg-violet-600 text-white"
                      : ""
                  }`}
                >
                  {type === item.type
                    ? "✓"
                    : ""}
                </span>
              </button>
            ))}
          </div>

          {(type === "png" ||
            type === "jpeg") && (
            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Export quality
                </span>

                <span className="text-xs font-semibold text-gray-600">
                  {multiplier}×
                </span>
              </div>

              <input
                type="range"
                min="1"
                max="3"
                step="1"
                value={multiplier}
                onChange={(e) =>
                  setMultiplier(
                    Number(e.target.value)
                  )
                }
                className="w-full"
              />

              <div className="mt-1 flex justify-between text-[10px] text-gray-400">
                <span>Smaller</span>
                <span>High quality</span>
              </div>
            </div>
          )}
        </div>

        <div className="border-t p-4">
          <button
            onClick={() =>
              props.onDownload(
                type,
                multiplier
              )
            }
            className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-violet-100"
          >
            Download {type === "jpeg"
              ? "JPG"
              : type.toUpperCase()}
          </button>
        </div>
      </section>
    </>
  );
}
