"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type { Format } from "@/types/editor";
import { FORMATS } from "@/lib/editor/formats";

type Category =
  | "suggested"
  | "social"
  | "print"
  | "presentation";

type Props = {
  open: boolean;
  currentFormat: Format;
  onClose: () => void;
  onResize: (
    format: Format,
    copyFirst: boolean
  ) => void;
  onCreateVariants: (
    formats: Format[]
  ) => Promise<void> | void;
};

const SUGGESTED = [
  "Festival Poster",
  "Instagram Story",
  "Instagram Post",
  "Instagram Post (4:5)",
  "Facebook Post",
  "YouTube Thumbnail",
  "LinkedIn Post",
];

const VARIANT_PRESETS = [
  "Instagram Post",
  "Instagram Post (4:5)",
  "Instagram Story",
  "Facebook Post",
  "YouTube Thumbnail",
  "LinkedIn Post",
];

function categoryOf(
  name: string
): Category {
  if (
    name.includes(
      "Instagram"
    ) ||
    name.includes(
      "YouTube"
    ) ||
    name.includes(
      "TikTok"
    ) ||
    name.includes(
      "WhatsApp"
    ) ||
    name.includes(
      "Facebook"
    ) ||
    name.includes(
      "Twitter"
    ) ||
    name.includes(
      "LinkedIn"
    ) ||
    name.includes(
      "Pinterest"
    ) ||
    name.includes(
      "Festival"
    )
  ) {
    return "social";
  }

  if (
    name.includes("A4") ||
    name.includes("Letter")
  ) {
    return "print";
  }

  return "presentation";
}

function Preview({
  format,
}: {
  format: Format;
}) {
  const ratio =
    format.width /
    format.height;

  const width =
    ratio >= 1
      ? 58
      : Math.max(
          30,
          58 * ratio
        );

  const height =
    ratio >= 1
      ? Math.max(
          30,
          58 / ratio
        )
      : 58;

  return (
    <div className="flex h-20 items-center justify-center rounded-xl bg-gray-100">
      <div
        className="rounded-md border-2 border-gray-300 bg-white shadow-sm"
        style={{
          width,
          height,
        }}
      />
    </div>
  );
}

function sameFormat(
  a: Format,
  b: Format
) {
  return (
    a.name === b.name &&
    a.width === b.width &&
    a.height === b.height
  );
}

export default function ResizePanel({
  open,
  currentFormat,
  onClose,
  onResize,
  onCreateVariants,
}: Props) {
  const [
    search,
    setSearch,
  ] = useState("");

  const [
    category,
    setCategory,
  ] =
    useState<Category>(
      "suggested"
    );

  const [
    selected,
    setSelected,
  ] =
    useState<Format | null>(
      null
    );

  const [
    customWidth,
    setCustomWidth,
  ] = useState(
    currentFormat.width
  );

  const [
    customHeight,
    setCustomHeight,
  ] = useState(
    currentFormat.height
  );

  const [
    mode,
    setMode,
  ] = useState<
    "single" | "variants"
  >("single");

  const [
    variantNames,
    setVariantNames,
  ] = useState<string[]>(
    []
  );

  const [
    generating,
    setGenerating,
  ] = useState(false);

  useEffect(() => {
    if (!open) return;

    setCustomWidth(
      currentFormat.width
    );

    setCustomHeight(
      currentFormat.height
    );

    setSelected(null);
    setVariantNames([]);
    setGenerating(false);
  }, [
    open,
    currentFormat,
  ]);

  const results =
    useMemo(() => {
      const q =
        search
          .trim()
          .toLowerCase();

      if (q) {
        return FORMATS.filter(
          (item) =>
            `${item.name} ${item.width} ${item.height}`
              .toLowerCase()
              .includes(q)
        );
      }

      if (
        category ===
        "suggested"
      ) {
        return SUGGESTED.map(
          (name) =>
            FORMATS.find(
              (item) =>
                item.name ===
                name
            )
        ).filter(
          Boolean
        ) as Format[];
      }

      return FORMATS.filter(
        (item) =>
          categoryOf(
            item.name
          ) === category
      );
    }, [
      category,
      search,
    ]);

  const variantOptions =
    useMemo(
      () =>
        VARIANT_PRESETS.map(
          (name) =>
            FORMATS.find(
              (item) =>
                item.name ===
                name
            )
        ).filter(
          (
            item
          ): item is Format =>
            Boolean(item) &&
            !sameFormat(
              item as Format,
              currentFormat
            )
        ),
      [currentFormat]
    );

  if (!open)
    return null;

  const chosen =
    selected ||
    ({
      name: "Custom size",
      width: Math.max(
        1,
        customWidth || 1
      ),
      height: Math.max(
        1,
        customHeight || 1
      ),
    } satisfies Format);

  const selectedVariants =
    variantOptions.filter(
      (item) =>
        variantNames.includes(
          item.name
        )
    );

  const toggleVariant = (
    name: string
  ) => {
    setVariantNames(
      (current) =>
        current.includes(
          name
        )
          ? current.filter(
              (item) =>
                item !==
                name
            )
          : [
              ...current,
              name,
            ]
    );
  };

  const chooseRecommended =
    () => {
      setVariantNames(
        variantOptions
          .slice(0, 5)
          .map(
            (item) =>
              item.name
          )
      );
    };

  const createVariants =
    async () => {
      if (
        !selectedVariants.length
      ) {
        return;
      }

      setGenerating(true);

      try {
        await onCreateVariants(
          selectedVariants
        );
      } finally {
        setGenerating(false);
      }
    };

  return (
    <>
      <button
        aria-label="Close resize"
        onClick={onClose}
        className="fixed inset-0 z-[80] cursor-default bg-black/10"
      />

      <section className="fixed inset-x-2 bottom-[calc(122px_+_env(safe-area-inset-bottom))] z-[90] flex max-h-[calc(100dvh_-_190px_-_env(safe-area-inset-bottom))] flex-col overflow-hidden rounded-2xl border bg-white shadow-2xl md:bottom-auto md:left-24 md:right-auto md:top-16 md:max-h-[calc(100vh-80px)] md:w-[420px]">
        <div className="border-b p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">
                Magic Resize
              </h2>

              <p className="mt-0.5 text-xs text-gray-400">
                Resize one design or create platform versions.
              </p>
            </div>

            <button
              onClick={
                onClose
              }
              className="rounded-lg px-3 py-2 hover:bg-gray-100"
            >
              ✕
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 rounded-xl bg-gray-100 p-1">
            <button
              onClick={() =>
                setMode(
                  "single"
                )
              }
              className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                mode ===
                "single"
                  ? "bg-white shadow-sm"
                  : "text-gray-500"
              }`}
            >
              Resize
            </button>

            <button
              onClick={() =>
                setMode(
                  "variants"
                )
              }
              className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                mode ===
                "variants"
                  ? "bg-white shadow-sm"
                  : "text-gray-500"
              }`}
            >
              Create versions
            </button>
          </div>

          {mode ===
            "single" && (
            <div className="mt-3 flex items-center gap-2 rounded-xl border px-3 py-2">
              <span className="text-gray-400">
                ⌕
              </span>

              <input
                value={
                  search
                }
                onChange={(
                  e
                ) =>
                  setSearch(
                    e.target
                      .value
                  )
                }
                placeholder="Search resize options"
                className="min-w-0 flex-1 text-sm outline-none"
              />
            </div>
          )}
        </div>

        {mode ===
        "single" ? (
          <>
            <div className="overflow-y-auto p-4">
              {!search && (
                <div className="mb-5 flex flex-wrap gap-2">
                  {[
                    [
                      "suggested",
                      "Suggested",
                    ],
                    [
                      "social",
                      "Social media",
                    ],
                    [
                      "print",
                      "Printables",
                    ],
                    [
                      "presentation",
                      "Presentations",
                    ],
                  ].map(
                    ([
                      value,
                      label,
                    ]) => (
                      <button
                        key={
                          value
                        }
                        onClick={() => {
                          setCategory(
                            value as Category
                          );

                          setSelected(
                            null
                          );
                        }}
                        className={`rounded-full border px-3 py-2 text-xs ${
                          category ===
                          value
                            ? "border-black bg-black text-white"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        {
                          label
                        }
                      </button>
                    )
                  )}
                </div>
              )}

              <div className="grid grid-cols-3 gap-3">
                {results.map(
                  (item) => (
                    <button
                      key={`${item.name}-${item.width}-${item.height}`}
                      onClick={() =>
                        setSelected(
                          item
                        )
                      }
                      className={`rounded-2xl border p-2 text-left transition ${
                        selected?.name ===
                        item.name
                          ? "border-violet-600 ring-1 ring-violet-600"
                          : "hover:border-gray-400"
                      }`}
                    >
                      <Preview
                        format={
                          item
                        }
                      />

                      <div className="mt-2 line-clamp-2 text-xs font-semibold">
                        {
                          item.name
                        }
                      </div>

                      <div className="mt-1 text-[10px] text-gray-400">
                        {
                          item.width
                        }{" "}
                        ×{" "}
                        {
                          item.height
                        }
                      </div>
                    </button>
                  )
                )}
              </div>

              <div className="my-5 border-t" />

              <div>
                <div className="mb-2 text-xs font-semibold uppercase text-gray-400">
                  Custom size
                </div>

                <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2">
                  <label>
                    <span className="mb-1 block text-xs text-gray-500">
                      Width
                    </span>

                    <input
                      type="number"
                      min="1"
                      max="10000"
                      value={
                        customWidth
                      }
                      onChange={(
                        e
                      ) => {
                        setCustomWidth(
                          Number(
                            e
                              .target
                              .value
                          )
                        );

                        setSelected(
                          null
                        );
                      }}
                      className="w-full rounded-xl border px-3 py-2 text-sm"
                    />
                  </label>

                  <span className="pb-2 text-gray-400">
                    ×
                  </span>

                  <label>
                    <span className="mb-1 block text-xs text-gray-500">
                      Height
                    </span>

                    <input
                      type="number"
                      min="1"
                      max="10000"
                      value={
                        customHeight
                      }
                      onChange={(
                        e
                      ) => {
                        setCustomHeight(
                          Number(
                            e
                              .target
                              .value
                          )
                        );

                        setSelected(
                          null
                        );
                      }}
                      className="w-full rounded-xl border px-3 py-2 text-sm"
                    />
                  </label>
                </div>

                <div className="mt-2 text-xs text-gray-400">
                  Current:{" "}
                  {
                    currentFormat.width
                  }{" "}
                  ×{" "}
                  {
                    currentFormat.height
                  }
                  px
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-violet-100 bg-violet-50 p-3">
                <div className="text-xs font-bold text-violet-800">
                  Smart reflow
                </div>

                <div className="mt-1 text-[11px] leading-5 text-violet-700">
                  Text, cards and decorative objects are kept inside the safe area when the aspect ratio changes.
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 border-t bg-white p-4">
              <button
                onClick={() =>
                  onResize(
                    chosen,
                    true
                  )
                }
                className="rounded-xl border px-4 py-3 text-sm font-semibold hover:bg-gray-50"
              >
                Copy & resize
              </button>

              <button
                onClick={() =>
                  onResize(
                    chosen,
                    false
                  )
                }
                className="rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white"
              >
                Resize
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="overflow-y-auto p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold">
                    Platform versions
                  </div>

                  <div className="mt-1 text-xs text-gray-400">
                    Current design stays unchanged.
                  </div>
                </div>

                <button
                  onClick={
                    chooseRecommended
                  }
                  className="rounded-lg border px-3 py-2 text-xs font-semibold hover:bg-gray-50"
                >
                  Select recommended
                </button>
              </div>

              <div className="mt-4 space-y-2">
                {variantOptions.map(
                  (item) => {
                    const checked =
                      variantNames.includes(
                        item.name
                      );

                    return (
                      <button
                        key={
                          item.name
                        }
                        onClick={() =>
                          toggleVariant(
                            item.name
                          )
                        }
                        className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left ${
                          checked
                            ? "border-violet-500 bg-violet-50"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <div
                          className={`flex h-5 w-5 items-center justify-center rounded border text-xs ${
                            checked
                              ? "border-violet-600 bg-violet-600 text-white"
                              : "bg-white"
                          }`}
                        >
                          {checked
                            ? "✓"
                            : ""}
                        </div>

                        <div className="flex min-w-0 flex-1 items-center gap-3">
                          <Preview
                            format={
                              item
                            }
                          />

                          <div>
                            <div className="text-sm font-semibold">
                              {
                                item.name
                              }
                            </div>

                            <div className="mt-1 text-xs text-gray-400">
                              {
                                item.width
                              }{" "}
                              ×{" "}
                              {
                                item.height
                              }
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  }
                )}
              </div>

              <div className="mt-4 rounded-xl bg-gray-50 p-3 text-xs leading-5 text-gray-500">
                Each version is saved as a separate project. Smart reflow keeps content inside the target page and adapts text widths for major aspect-ratio changes.
              </div>
            </div>

            <div className="border-t bg-white p-4">
              <button
                disabled={
                  generating ||
                  !selectedVariants.length
                }
                onClick={() =>
                  void createVariants()
                }
                className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-4 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                {generating
                  ? "Creating versions..."
                  : selectedVariants.length
                  ? `Create ${selectedVariants.length} version${selectedVariants.length === 1 ? "" : "s"}`
                  : "Choose formats"}
              </button>
            </div>
          </>
        )}
      </section>
    </>
  );
}
