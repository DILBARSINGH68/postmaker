"use client";

import { useEffect, useMemo, useRef, useState, type ChangeEvent, type RefObject, type TouchEvent } from "react";
import { StaticCanvas } from "fabric";

import type { DesignPage, Format, SelectedSnapshot } from "@/types/editor";
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
  selected: SelectedSnapshot | null;
  quickActionsEnabled: boolean;
  backgroundSelected: boolean;
  backgroundEditing: boolean;
  backgroundLocked: boolean;
  backgroundZoom: number;
  onBackgroundToggleLock: () => void;
  onBackgroundDone: () => void;
  onBackgroundCancel: () => void;
  onBackgroundReset: () => void;
  onBackgroundZoomChange: (value: number) => void;
  onBackgroundDetach: () => void;
  onBackgroundRemove: () => void;
  onBackgroundReplace: (event: ChangeEvent<HTMLInputElement>) => void;
  onWorkspaceMarqueeSelect: (rect: { left: number; top: number; width: number; height: number }) => void;
  onDeleteSelected: () => void;
  onUnlockSelected: () => void;
  onOpenSelectedMore: (position: { x: number; y: number }) => void;
  onSelectedPinchStart: () => boolean;
  onSelectedPinchScale: (factor: number) => void;
  onSelectedPinchEnd: () => void;
  onDeselect: () => void;
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
  const workspacePointerRef = useRef<{
    pointerId: number;
    x: number;
    y: number;
  } | null>(null);
  const touchWorkspaceTapRef = useRef<{
    pointerId: number;
    x: number;
    y: number;
  } | null>(null);
  const [workspaceMarquee, setWorkspaceMarquee] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);
  const [backgroundMoreOpen, setBackgroundMoreOpen] = useState(false);
  const [objectPinching, setObjectPinching] = useState(false);
  const pinchRef = useRef<{
    distance: number;
    zoom: number;
    mode: "canvas" | "object";
  } | null>(null);
  const controlTouchRef = useRef<{
    x: number;
    y: number;
    target: HTMLElement | null;
  } | null>(null);

  const beginControlTouch = (event: TouchEvent<HTMLElement>) => {
    if (event.touches.length !== 1) {
      controlTouchRef.current = null;
      return;
    }

    const touch = event.touches[0];
    const target = (event.target as HTMLElement).closest<HTMLElement>(
      'button, label'
    );
    controlTouchRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      target,
    };
    event.stopPropagation();
  };

  const finishControlTouch = (event: TouchEvent<HTMLElement>) => {
    const start = controlTouchRef.current;
    controlTouchRef.current = null;
    const touch = event.changedTouches[0];
    if (!start || !touch || !start.target) return;

    const distance = Math.hypot(
      touch.clientX - start.x,
      touch.clientY - start.y
    );
    if (distance > 12) return;

    const endTarget = (event.target as HTMLElement).closest<HTMLElement>(
      'button, label'
    );
    if (endTarget !== start.target) return;

    if (event.cancelable) event.preventDefault();
    event.stopPropagation();
    start.target.click();
  };

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

    // Canva-style mobile rule: while a normal object is selected, a two-finger
    // gesture anywhere in the editor scales that selected object. Canvas zoom
    // is reserved for the no-selection state.
    const selectedObjectGesture =
      Boolean(props.selected) &&
      props.selected?.selectable !== false &&
      !props.backgroundSelected &&
      !props.backgroundEditing;

    if (selectedObjectGesture) {
      const started = props.onSelectedPinchStart();
      if (!started) {
        pinchRef.current = null;
        if (event.cancelable) event.preventDefault();
        return;
      }

      pinchRef.current = {
        distance,
        zoom: props.zoom,
        mode: "object",
      };
      setObjectPinching(true);
      if (event.cancelable) event.preventDefault();
      return;
    }

    pinchRef.current = {
      distance,
      zoom: props.zoom,
      mode: "canvas",
    };
    if (event.cancelable) event.preventDefault();
  };

  const handleTouchMove = (event: TouchEvent<HTMLElement>) => {
    if (event.touches.length !== 2 || !pinchRef.current) return;
    const distance = getTouchDistance(event);
    if (!distance) return;

    if (pinchRef.current.mode === "object") {
      const factor = distance / Math.max(1, pinchRef.current.distance);
      props.onSelectedPinchScale(factor);
      if (event.cancelable) event.preventDefault();
      return;
    }

    const nextZoom = Math.round(
      Math.min(
        180,
        Math.max(
          18,
          pinchRef.current.zoom * (distance / pinchRef.current.distance)
        )
      )
    );
    props.onZoomChange(nextZoom);
    if (event.cancelable) event.preventDefault();
  };

  const handleTouchEnd = (event: TouchEvent<HTMLElement>) => {
    if (event.touches.length >= 2) return;

    if (pinchRef.current?.mode === "object") {
      props.onSelectedPinchEnd();
      setObjectPinching(false);
    }
    pinchRef.current = null;
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

  const quickActionPosition = useMemo(() => {
    const selection = props.selected;
    if (!selection || !props.quickActionsEnabled || objectPinching) return null;

    const left = Number(selection.left ?? 0);
    const top = Number(selection.top ?? 0);
    const width = Math.max(1, Number(selection.width ?? 1));
    const height = Math.max(1, Number(selection.height ?? 1));

    const centerX = (left + width / 2) * scale;
    const selectionTop = top * scale;
    const selectionBottom = (top + height) * scale;
    const safeCenterX = Math.min(
      Math.max(52, centerX),
      Math.max(52, displayWidth - 52)
    );

    const placeBelow = selectionTop < 54;
    const topPx = placeBelow ? selectionBottom + 10 : selectionTop - 48;

    return {
      left: safeCenterX,
      top: topPx,
    };
  }, [
    props.selected,
    props.quickActionsEnabled,
    objectPinching,
    scale,
    displayWidth,
  ]);

  useEffect(() => {
    if (!props.backgroundSelected || props.backgroundEditing) {
      setBackgroundMoreOpen(false);
    }
  }, [props.backgroundSelected, props.backgroundEditing]);

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
      onPointerDown={(event) => {
        const target = event.target as HTMLElement;

        if (event.pointerType === "touch") {
          workspacePointerRef.current = null;
          setWorkspaceMarquee(null);

          if (target.closest('[data-kriyavo-canvas-interactive="true"]')) {
            touchWorkspaceTapRef.current = null;
            return;
          }

          touchWorkspaceTapRef.current = {
            pointerId: event.pointerId,
            x: event.clientX,
            y: event.clientY,
          };
          return;
        }

        touchWorkspaceTapRef.current = null;

        if (
          event.pointerType !== "mouse" ||
          event.button !== 0 ||
          target.closest('[data-kriyavo-canvas-interactive="true"]')
        ) {
          workspacePointerRef.current = null;
          setWorkspaceMarquee(null);
          return;
        }

        workspacePointerRef.current = {
          pointerId: event.pointerId,
          x: event.clientX,
          y: event.clientY,
        };
        event.currentTarget.setPointerCapture?.(event.pointerId);
      }}
      onPointerMove={(event) => {
        const start = workspacePointerRef.current;
        if (!start || start.pointerId !== event.pointerId) return;

        const distance = Math.hypot(event.clientX - start.x, event.clientY - start.y);
        if (distance <= 6) return;

        setWorkspaceMarquee({
          left: Math.min(start.x, event.clientX),
          top: Math.min(start.y, event.clientY),
          width: Math.abs(event.clientX - start.x),
          height: Math.abs(event.clientY - start.y),
        });
      }}
      onPointerUp={(event) => {
        if (event.pointerType === "touch") {
          const touchStart = touchWorkspaceTapRef.current;
          touchWorkspaceTapRef.current = null;

          if (!touchStart || touchStart.pointerId !== event.pointerId) return;

          const touchDistance = Math.hypot(
            event.clientX - touchStart.x,
            event.clientY - touchStart.y
          );

          if (touchDistance <= 10 && !pinchRef.current) {
            props.onDeselect();
          }
          return;
        }

        const start = workspacePointerRef.current;
        workspacePointerRef.current = null;
        const marquee = workspaceMarquee;
        setWorkspaceMarquee(null);
        event.currentTarget.releasePointerCapture?.(event.pointerId);
        if (!start || start.pointerId !== event.pointerId) return;

        const distance = Math.hypot(event.clientX - start.x, event.clientY - start.y);
        if (distance <= 6) {
          props.onDeselect();
          return;
        }

        const activeCanvas = sectionRef.current?.querySelector<HTMLElement>(
          '[data-kriyavo-active-canvas="true"]'
        );
        if (!activeCanvas) return;

        const canvasRect = activeCanvas.getBoundingClientRect();
        const selection = marquee || {
          left: Math.min(start.x, event.clientX),
          top: Math.min(start.y, event.clientY),
          width: Math.abs(event.clientX - start.x),
          height: Math.abs(event.clientY - start.y),
        };
        const right = Math.min(selection.left + selection.width, canvasRect.right);
        const bottom = Math.min(selection.top + selection.height, canvasRect.bottom);
        const left = Math.max(selection.left, canvasRect.left);
        const top = Math.max(selection.top, canvasRect.top);

        if (right <= left || bottom <= top) return;

        props.onWorkspaceMarqueeSelect({
          left: (left - canvasRect.left) / scale,
          top: (top - canvasRect.top) / scale,
          width: (right - left) / scale,
          height: (bottom - top) / scale,
        });
      }}
      onPointerCancel={() => {
        workspacePointerRef.current = null;
        touchWorkspaceTapRef.current = null;
        setWorkspaceMarquee(null);
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      className="relative h-full min-h-0 min-w-0 flex-1 overflow-auto overscroll-contain bg-[#ececec] touch-pan-x touch-pan-y"
    >
      {workspaceMarquee && (
        <div
          className="pointer-events-none fixed z-[240] border border-violet-500 bg-violet-400/10 shadow-[0_0_0_1px_rgba(255,255,255,0.7)_inset]"
          style={workspaceMarquee}
          aria-hidden="true"
        />
      )}

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
              data-kriyavo-canvas-interactive="true"
              data-kriyavo-active-canvas="true"
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

            {props.backgroundSelected && (
              <>
                {!props.backgroundEditing ? (
                  <div
                    data-kriyavo-canvas-interactive="true"
                    className="pointer-events-auto absolute left-1/2 z-[68] flex -translate-x-1/2 items-center gap-1 rounded-2xl touch-manipulation border border-slate-200 bg-white/95 p-1 shadow-[0_12px_34px_rgba(15,23,42,0.18)] backdrop-blur"
                    style={{ top: activeCanvasTop + 10 }}
                    role="toolbar"
                    aria-label={props.backgroundLocked ? "Background locked" : "Background image quick actions"}
                    onPointerDown={(event) => event.stopPropagation()}
                    onTouchStartCapture={beginControlTouch}
                    onTouchEndCapture={finishControlTouch}
                  >
                    {props.backgroundLocked ? (
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setBackgroundMoreOpen(false);
                          props.onBackgroundToggleLock();
                        }}
                        className="flex h-10 min-w-10 items-center justify-center rounded-xl bg-amber-50 px-3 text-lg text-amber-800 transition hover:bg-amber-100 active:scale-95"
                        title="Locked — click to unlock"
                        aria-label="Unlock background"
                      >
                        🔒
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            setBackgroundMoreOpen(false);
                            props.onBackgroundRemove();
                          }}
                          className="flex h-9 w-10 items-center justify-center rounded-xl text-slate-700 transition hover:bg-rose-50 hover:text-rose-600 active:scale-95"
                          title="Remove background image"
                          aria-label="Remove background image"
                        >
                          <TrashIcon />
                        </button>

                        <div className="h-6 w-px bg-slate-200" />

                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            setBackgroundMoreOpen((open) => !open);
                          }}
                          className="flex h-9 w-10 items-center justify-center rounded-xl text-slate-700 transition hover:bg-slate-100 active:scale-95"
                          title="More background actions"
                          aria-label="More background actions"
                          aria-expanded={backgroundMoreOpen}
                        >
                          <span className="translate-y-[-1px] text-[20px] font-black tracking-[2px] leading-none">•••</span>
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  <div
                    data-kriyavo-canvas-interactive="true"
                    className="pointer-events-auto absolute left-1/2 z-[68] w-[min(94vw,620px)] -translate-x-1/2 rounded-2xl border border-slate-200 bg-white/97 p-2 shadow-[0_14px_40px_rgba(15,23,42,0.20)] backdrop-blur"
                    style={{ top: activeCanvasTop + 10 }}
                    role="toolbar"
                    aria-label="Background crop and zoom"
                    onPointerDown={(event) => event.stopPropagation()}
                    onTouchStartCapture={beginControlTouch}
                    onTouchEndCapture={finishControlTouch}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="shrink-0 text-[11px] font-bold text-slate-700">Zoom {Math.round(props.backgroundZoom)}%</span>
                        <input
                          type="range"
                          min="100"
                          max="300"
                          step="1"
                          value={props.backgroundZoom}
                          onChange={(event) => props.onBackgroundZoomChange(Number(event.target.value))}
                          className="min-w-0 flex-1 accent-violet-600"
                          aria-label="Background zoom"
                        />
                      </div>
                      <div className="flex flex-wrap items-center justify-center gap-1.5">
                        <span className="mr-1 text-[10px] text-slate-500">Drag image to reposition</span>
                        <button type="button" onClick={props.onBackgroundReset} className="rounded-xl border px-3 py-2 text-[11px] font-semibold">Reset</button>
                        <button type="button" onClick={props.onBackgroundCancel} className="rounded-xl border px-3 py-2 text-[11px] font-semibold">Cancel</button>
                        <button type="button" onClick={props.onBackgroundDone} className="rounded-xl bg-violet-600 px-4 py-2 text-[11px] font-bold text-white">Done</button>
                      </div>
                    </div>
                  </div>
                )}

                {backgroundMoreOpen && !props.backgroundEditing && (
                  <>
                    <div
                      data-kriyavo-canvas-interactive="true"
                      className="pointer-events-auto absolute left-1/2 z-[190] hidden w-72 -translate-x-1/2 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl md:block"
                      style={{ top: activeCanvasTop + 58 }}
                      onPointerDown={(event) => event.stopPropagation()}
                      onTouchStartCapture={beginControlTouch}
                      onTouchEndCapture={finishControlTouch}
                    >
                      <div className="flex items-start justify-between gap-3 px-3 py-2">
                        <div>
                          <div className="text-xs font-bold text-slate-900">Background image</div>
                          <div className="mt-0.5 text-[10px] text-slate-400">Single click selects only · double-click opens crop</div>
                        </div>
                        <span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold ${props.backgroundLocked ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-700"}`}>
                          {props.backgroundLocked ? "🔒 Locked" : "🔓 Unlocked"}
                        </span>
                      </div>
                      {props.backgroundLocked ? (
                        <button
                          type="button"
                          onClick={() => {
                            setBackgroundMoreOpen(false);
                            props.onBackgroundToggleLock();
                          }}
                          className="flex w-full items-center rounded-xl bg-amber-50 px-3 py-3 text-left text-sm font-bold text-amber-800 hover:bg-amber-100"
                        >
                          🔓 Unlock background
                        </button>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setBackgroundMoreOpen(false);
                              props.onBackgroundToggleLock();
                            }}
                            className="flex w-full items-center rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50"
                          >
                            🔒 Lock background
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setBackgroundMoreOpen(false);
                              props.onBackgroundDetach();
                            }}
                            className="flex w-full items-center rounded-xl px-3 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50"
                          >
                            Detach from background
                          </button>
                          <label className="flex w-full cursor-pointer items-center rounded-xl px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
                            Replace image
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(event) => {
                                setBackgroundMoreOpen(false);
                                props.onBackgroundReplace(event);
                              }}
                              className="hidden"
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              setBackgroundMoreOpen(false);
                              props.onBackgroundRemove();
                            }}
                            className="flex w-full items-center rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-rose-600 hover:bg-rose-50"
                          >
                            Remove background image
                          </button>
                        </>
                      )}
                    </div>

                    <div
                      data-kriyavo-canvas-interactive="true"
                      className="pointer-events-auto fixed inset-x-2 bottom-[calc(66px_+_env(safe-area-inset-bottom))] z-[210] max-h-[70dvh] overflow-y-auto rounded-[24px] border bg-white p-2 pb-4 shadow-2xl md:hidden touch-manipulation"
                      onPointerDown={(event) => event.stopPropagation()}
                      onTouchStartCapture={beginControlTouch}
                      onTouchEndCapture={finishControlTouch}
                    >
                      <div className="mx-auto mt-1 h-1 w-10 rounded-full bg-slate-300" />
                      <div className="flex items-center justify-between px-3 py-3">
                        <div>
                          <div className="text-sm font-bold text-slate-900">Background image</div>
                          <div className="text-[10px] text-slate-400">{props.backgroundLocked ? "Unlock to crop and zoom" : "Double-tap the canvas to crop and zoom"}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setBackgroundMoreOpen(false)}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs"
                          aria-label="Close background actions"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="h-px bg-slate-100" />
                      <div className="px-3 py-3">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${props.backgroundLocked ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-700"}`}>
                          {props.backgroundLocked ? "🔒 Locked" : "🔓 Unlocked"}
                        </span>
                      </div>
                      {props.backgroundLocked ? (
                        <button
                          type="button"
                          onClick={() => {
                            setBackgroundMoreOpen(false);
                            props.onBackgroundToggleLock();
                          }}
                          className="flex w-full items-center rounded-xl bg-amber-50 px-3 py-3 text-left text-sm font-bold text-amber-800 active:bg-amber-100"
                        >
                          🔓 Unlock background
                        </button>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setBackgroundMoreOpen(false);
                              props.onBackgroundToggleLock();
                            }}
                            className="flex w-full items-center rounded-xl px-3 py-3 text-left text-sm font-semibold text-slate-700 active:bg-slate-50"
                          >
                            🔒 Lock background
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setBackgroundMoreOpen(false);
                              props.onBackgroundDetach();
                            }}
                            className="flex w-full items-center rounded-xl px-3 py-3 text-left text-sm text-slate-700 active:bg-slate-50"
                          >
                            Detach from background
                          </button>
                          <label className="flex w-full cursor-pointer items-center rounded-xl px-3 py-3 text-sm text-slate-700 active:bg-slate-50">
                            Replace image
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(event) => {
                                setBackgroundMoreOpen(false);
                                props.onBackgroundReplace(event);
                              }}
                              className="hidden"
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              setBackgroundMoreOpen(false);
                              props.onBackgroundRemove();
                            }}
                            className="flex w-full items-center rounded-xl px-3 py-3 text-left text-sm font-semibold text-rose-600 active:bg-rose-50"
                          >
                            Remove background image
                          </button>
                        </>
                      )}
                    </div>
                  </>
                )}
              </>
            )}

            {quickActionPosition && (
              <div
                data-kriyavo-canvas-interactive="true"
                className="pointer-events-auto absolute z-[65] flex -translate-x-1/2 items-center gap-1 rounded-2xl touch-manipulation border border-slate-200 bg-white/95 p-1 shadow-[0_12px_34px_rgba(15,23,42,0.18)] backdrop-blur"
                style={{
                  left: quickActionPosition.left,
                  top: quickActionPosition.top,
                }}
                role="toolbar"
                aria-label={props.selected?.selectable === false ? "Selected object locked" : "Selected object quick actions"}
                onPointerDown={(event) => event.stopPropagation()}
                onTouchStartCapture={beginControlTouch}
                onTouchEndCapture={finishControlTouch}
              >
                {props.selected?.selectable === false ? (
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      props.onUnlockSelected();
                    }}
                    className="flex h-10 min-w-10 items-center justify-center rounded-xl bg-amber-50 px-3 text-lg text-amber-800 transition hover:bg-amber-100 active:scale-95"
                    title="Locked — click to unlock"
                    aria-label="Unlock selected object"
                  >
                    🔒
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        props.onDeleteSelected();
                      }}
                      className="flex h-9 w-10 items-center justify-center rounded-xl text-slate-700 transition hover:bg-rose-50 hover:text-rose-600 active:scale-95"
                      title="Delete selected object"
                      aria-label="Delete selected object"
                    >
                      <svg viewBox="0 0 24 24" className="h-[19px] w-[19px]" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M4 7h16" />
                        <path d="M9 7V4h6v3" />
                        <path d="M7 7l1 13h8l1-13" />
                        <path d="M10 11v5M14 11v5" />
                      </svg>
                    </button>

                    <div className="h-6 w-px bg-slate-200" />

                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        const rect = event.currentTarget.getBoundingClientRect();
                        props.onOpenSelectedMore({
                          x: rect.left + rect.width / 2,
                          y: rect.bottom + 6,
                        });
                      }}
                      className="flex h-9 w-10 items-center justify-center rounded-xl text-slate-700 transition hover:bg-slate-100 active:scale-95"
                      title="More actions"
                      aria-label="More actions"
                    >
                      <span className="translate-y-[-1px] text-[20px] font-black tracking-[2px] leading-none">•••</span>
                    </button>
                  </>
                )}
              </div>
            )}
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
