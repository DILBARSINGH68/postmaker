"use client";

import { useEffect, useMemo, useRef, useState, type RefObject, type TouchEvent } from "react";
import { StaticCanvas } from "fabric";

import type { DesignPage, Format } from "@/types/editor";
import { getEditorCanvasSize } from "@/lib/editor/canvasSize";

export type SnapGuides = {
  vertical: number[];
  horizontal: number[];
};

type Props = {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  zoom: number;
  format: Format;
  snapGuides: SnapGuides;
  pages: DesignPage[];
  activePageIndex: number;
  onZoomChange: (zoom: number) => void;
  onSelectPage: (index: number) => void;
  onAddPageAfter: (index: number) => void;
  onDuplicatePage: (index: number) => void;
  onDeletePage: (index: number) => void;
  onTogglePageHidden: (index: number) => void;
};

type PreviewProps = {
  page: DesignPage;
  width: number;
  height: number;
};

const PAGE_HEADER_HEIGHT = 40;
const PAGE_FOOTER_HEIGHT = 52;
const PAGE_GAP = 28;

function EyeIcon({ hidden }: { hidden: boolean }) {
  return hidden ? (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 3l18 18" />
      <path d="M10.6 10.7a2 2 0 0 0 2.7 2.7" />
      <path d="M9.9 4.3A10.8 10.8 0 0 1 12 4c5.4 0 9 5 9 8a8.5 8.5 0 0 1-2.2 3.8" />
      <path d="M6.2 6.2C4.1 7.7 3 10 3 12c0 3 3.6 8 9 8 1.5 0 2.9-.4 4.1-1" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M2.8 12s3.5-7 9.2-7 9.2 7 9.2 7-3.5 7-9.2 7-9.2-7-9.2-7Z" />
      <circle cx="12" cy="12" r="2.6" />
    </svg>
  );
}

function DuplicateIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="8" y="8" width="11" height="11" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 7h16" />
      <path d="M9 7V4h6v3" />
      <path d="M7 7l1 13h8l1-13" />
      <path d="M10 11v5M14 11v5" />
    </svg>
  );
}

function AddPageIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 3h9l3 3v15H6z" />
      <path d="M15 3v4h4" />
      <path d="M12 10v6M9 13h6" />
    </svg>
  );
}

function StoredPagePreview(props: PreviewProps) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let previewCanvas: StaticCanvas | null = null;

    const renderPreview = async () => {
      const sourceWidth = Math.max(1, Number(props.page.width || props.width));
      const sourceHeight = Math.max(1, Number(props.page.height || props.height));
      const element = document.createElement("canvas");

      previewCanvas = new StaticCanvas(element, {
        width: sourceWidth,
        height: sourceHeight,
        backgroundColor: props.page.background || "#ffffff",
        enableRetinaScaling: false,
        renderOnAddRemove: false,
      } as any);

      try {
        await previewCanvas.loadFromJSON(JSON.parse(props.page.design));
        previewCanvas.backgroundColor = props.page.background || "#ffffff";
        previewCanvas.requestRenderAll();

        const longestSide = Math.max(sourceWidth, sourceHeight);
        const multiplier = Math.min(1, 720 / Math.max(1, longestSide));
        const nextSrc = previewCanvas.toDataURL({
          format: "png",
          multiplier,
        } as any);

        if (!cancelled) {
          setSrc(nextSrc);
        }
      } catch {
        if (!cancelled) {
          setSrc(null);
        }
      } finally {
        if (previewCanvas) {
          void previewCanvas.dispose();
          previewCanvas = null;
        }
      }
    };

    void renderPreview();

    return () => {
      cancelled = true;
      if (previewCanvas) {
        void previewCanvas.dispose();
      }
    };
  }, [props.page.design, props.page.background, props.page.width, props.page.height, props.width, props.height]);

  if (!src) {
    return <div className="h-full w-full animate-pulse bg-white" />;
  }

  return (
    <img
      src={src}
      alt="Page preview"
      draggable={false}
      className="h-full w-full select-none object-fill"
    />
  );
}

export default function CanvasArea(props: Props) {
  const editorSize = getEditorCanvasSize(props.format);
  const scale = props.zoom / 100;
  const sectionRef = useRef<HTMLElement | null>(null);
  const pinchRef = useRef<{ distance: number; zoom: number } | null>(null);

  const getTouchDistance = (event: TouchEvent<HTMLElement>) => {
    const first = event.touches[0];
    const second = event.touches[1];
    if (!first || !second) return 0;
    return Math.hypot(second.clientX - first.clientX, second.clientY - first.clientY);
  };

  const handleTouchStart = (event: TouchEvent<HTMLElement>) => {
    if (event.touches.length !== 2) return;
    const distance = getTouchDistance(event);
    if (!distance) return;
    pinchRef.current = { distance, zoom: props.zoom };
    if (event.cancelable) event.preventDefault();
  };

  const handleTouchMove = (event: TouchEvent<HTMLElement>) => {
    if (event.touches.length !== 2 || !pinchRef.current) return;
    const distance = getTouchDistance(event);
    if (!distance) return;
    const nextZoom = Math.round(
      Math.min(180, Math.max(18, pinchRef.current.zoom * (distance / pinchRef.current.distance)))
    );
    props.onZoomChange(nextZoom);
    if (event.cancelable) event.preventDefault();
  };

  const handleTouchEnd = (event: TouchEvent<HTMLElement>) => {
    if (event.touches.length < 2) pinchRef.current = null;
  };

  const displayWidth = Math.max(1, Math.round(editorSize.width * scale));
  const displayHeight = Math.max(1, Math.round(editorSize.height * scale));
  const guideThickness = Math.max(1, 1 / Math.max(scale, 0.01));

  const pageItems = useMemo<(DesignPage | null)[]>(() => {
    return props.pages.length ? props.pages : [null];
  }, [props.pages]);

  const pageCount = Math.max(1, pageItems.length);
  const activePageIndex = Math.min(Math.max(0, props.activePageIndex), pageCount - 1);
  const pageBlockHeight = PAGE_HEADER_HEIGHT + displayHeight + PAGE_FOOTER_HEIGHT;
  const activeCanvasTop =
    activePageIndex * (pageBlockHeight + PAGE_GAP) + PAGE_HEADER_HEIGHT;

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    const timer = window.setTimeout(() => {
      const target = root.querySelector<HTMLElement>(
        `[data-page-slot="${activePageIndex}"]`
      );
      target?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }, 20);

    return () => window.clearTimeout(timer);
  }, [activePageIndex, pageCount]);

  return (
    <section
      ref={sectionRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      className="relative h-full min-h-0 min-w-0 flex-1 overflow-auto overscroll-contain bg-[#ececec] touch-pan-x touch-pan-y"
    >
      <div className="flex h-max min-h-full w-max min-w-full justify-center p-3 pb-28 pt-4 sm:p-4 sm:pb-32 sm:pt-6 md:p-10 md:pb-20 md:pt-12">
        <div
          className="relative shrink-0"
          style={{
            width: displayWidth,
            height: pageCount * pageBlockHeight + Math.max(0, pageCount - 1) * PAGE_GAP,
          }}
        >
          {pageItems.map((page, index) => {
            const isActive = index === activePageIndex;
            const hidden = Boolean(page?.hidden);

            return (
              <div
                key={page?.id || `page-slot-${index}`}
                data-page-slot={index}
                className="absolute left-0 w-full"
                style={{
                  top: index * (pageBlockHeight + PAGE_GAP),
                  height: pageBlockHeight,
                }}
              >
                <div
                  className="flex items-center justify-between gap-3 text-sm text-gray-700"
                  style={{ height: PAGE_HEADER_HEIGHT }}
                >
                  <div className="flex min-w-0 items-center gap-2 font-semibold">
                    <span>Page {index + 1}</span>
                    {hidden && (
                      <span className="rounded-full bg-gray-200 px-2 py-0.5 text-[10px] font-semibold text-gray-600">
                        Hidden
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 rounded-lg bg-[#ececec]/90 p-1">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        props.onTogglePageHidden(index);
                      }}
                      className="rounded-md p-1.5 hover:bg-white"
                      title={hidden ? "Unhide page" : "Hide page"}
                      aria-label={hidden ? "Unhide page" : "Hide page"}
                    >
                      <EyeIcon hidden={hidden} />
                    </button>

                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        props.onDuplicatePage(index);
                      }}
                      className="rounded-md p-1.5 hover:bg-white"
                      title="Duplicate page"
                      aria-label="Duplicate page"
                    >
                      <DuplicateIcon />
                    </button>

                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        props.onDeletePage(index);
                      }}
                      disabled={pageCount <= 1}
                      className="rounded-md p-1.5 hover:bg-white disabled:cursor-not-allowed disabled:opacity-30"
                      title="Delete page"
                      aria-label="Delete page"
                    >
                      <TrashIcon />
                    </button>

                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        props.onAddPageAfter(index);
                      }}
                      className="rounded-md p-1.5 hover:bg-white"
                      title="Add new page below"
                      aria-label="Add new page below"
                    >
                      <AddPageIcon />
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!isActive) props.onSelectPage(index);
                  }}
                  className={`relative block overflow-hidden bg-white text-left shadow-2xl outline-none transition ${
                    isActive
                      ? "cursor-default ring-2 ring-violet-500"
                      : "cursor-pointer hover:ring-2 hover:ring-violet-300"
                  }`}
                  style={{
                    width: displayWidth,
                    height: displayHeight,
                  }}
                  title={isActive ? `Page ${index + 1}` : `Edit page ${index + 1}`}
                >
                  {!isActive && page && (
                    <StoredPagePreview page={page} width={editorSize.width} height={editorSize.height} />
                  )}

                  {isActive && <div className="h-full w-full bg-white" />}

                  {!isActive && hidden && (
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white/45">
                      <span className="rounded-full bg-gray-900/80 px-3 py-1.5 text-xs font-semibold text-white shadow">
                        Hidden from multi-page export
                      </span>
                    </div>
                  )}
                </button>

                <div
                  className="flex items-center justify-center"
                  style={{ height: PAGE_FOOTER_HEIGHT }}
                >
                  <button
                    type="button"
                    onClick={() => props.onAddPageAfter(index)}
                    className="w-full rounded-lg border border-gray-400 bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm hover:border-violet-500 hover:bg-violet-50"
                  >
                    + Add page
                  </button>
                </div>
              </div>
            );
          })}

          <div
            className="pointer-events-none absolute left-0 z-20"
            style={{
              top: activeCanvasTop,
              width: displayWidth,
              height: displayHeight,
            }}
          >
            <div
              className="pointer-events-auto absolute left-0 top-0 overflow-visible"
              style={{
                width: editorSize.width,
                height: editorSize.height,
                transform: `scale(${scale})`,
                transformOrigin: "top left",
              }}
            >
              <canvas ref={props.canvasRef} />

              <div className="pointer-events-none absolute inset-0 z-40 overflow-hidden">
                {props.snapGuides.vertical.map((x, index) => (
                  <div
                    key={`v-${index}-${x}`}
                    className="absolute bottom-0 top-0 bg-fuchsia-500 shadow-[0_0_0_0.5px_rgba(255,255,255,0.8)]"
                    style={{
                      left: x,
                      width: guideThickness,
                    }}
                  />
                ))}

                {props.snapGuides.horizontal.map((y, index) => (
                  <div
                    key={`h-${index}-${y}`}
                    className="absolute left-0 right-0 bg-fuchsia-500 shadow-[0_0_0_0.5px_rgba(255,255,255,0.8)]"
                    style={{
                      top: y,
                      height: guideThickness,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="sticky bottom-[calc(72px_+_env(safe-area-inset-bottom))] left-1/2 z-30 mx-auto flex w-fit -translate-x-1/2 items-center gap-1 rounded-full border bg-white/95 px-2 py-1 text-xs shadow-lg backdrop-blur sm:hidden">
        <button
          onClick={() => props.onZoomChange(Math.max(18, props.zoom - 8))}
          className="px-2"
        >
          −
        </button>

        <span
          className="min-w-11 rounded-full px-1.5 py-1 text-center text-[11px] font-semibold"
          title="Pinch with two fingers to zoom"
        >
          {props.zoom}%
        </span>

        <button
          onClick={() => props.onZoomChange(Math.min(180, props.zoom + 8))}
          className="px-2"
        >
          +
        </button>
      </div>
    </section>
  );
}
