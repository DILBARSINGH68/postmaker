"use client";

import { useEffect, useRef, useState, type ChangeEvent, type TouchEvent } from "react";

type Props = {
  x: number;
  y: number;
  objectType: string;
  locked: boolean;
  background?: boolean;
  onClose: () => void;
  onCopy: () => void;
  onCopyStyle: () => void;
  onPaste: () => void;
  onPasteStyle: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onBringToFront: () => void;
  onBringForward: () => void;
  onSendBackward: () => void;
  onSendToBack: () => void;
  onAlign: (
    value:
      | "left"
      | "center"
      | "right"
      | "top"
      | "middle"
      | "bottom"
  ) => void;
  onLock: () => void;
  onLink: () => void;
  onAltText: () => void;
  onSetImageAsBackground: () => void;
  onApplyColorToPage: () => void;
  onDownloadSelection: () => void;
  onInfo: () => void;
  onUnavailable: (name: string) => void;
  onBackgroundEdit?: () => void;
  onBackgroundDetach?: () => void;
  onBackgroundRemove?: () => void;
  onBackgroundReplace?: (event: ChangeEvent<HTMLInputElement>) => void;
};

function MenuButton({
  children,
  shortcut,
  onClick,
  danger = false,
}: {
  children: React.ReactNode;
  shortcut?: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center justify-between gap-5 rounded-lg px-3 py-2 text-left text-sm ${
        danger
          ? "text-red-600 hover:bg-red-50"
          : "hover:bg-gray-100"
      }`}
    >
      <span>{children}</span>
      {shortcut && (
        <span className="rounded-md bg-gray-100 px-2 py-1 text-[11px] text-gray-500">
          {shortcut}
        </span>
      )}
    </button>
  );
}

export default function RightClickMenu(props: Props) {
  const [submenu, setSubmenu] = useState<"layer" | "align" | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const touchActionRef = useRef<{
    x: number;
    y: number;
    target: HTMLElement | null;
  } | null>(null);

  const beginTouchAction = (event: TouchEvent<HTMLDivElement>) => {
    if (!isMobile || event.touches.length !== 1) {
      touchActionRef.current = null;
      return;
    }
    const touch = event.touches[0];
    touchActionRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      target: (event.target as HTMLElement).closest<HTMLElement>(
        'button, label'
      ),
    };
    event.stopPropagation();
  };

  const finishTouchAction = (event: TouchEvent<HTMLDivElement>) => {
    if (!isMobile) return;
    const start = touchActionRef.current;
    touchActionRef.current = null;
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

  useEffect(() => {
    const syncViewport = () => setIsMobile(window.innerWidth < 768);
    syncViewport();
    window.addEventListener("resize", syncViewport);
    return () => window.removeEventListener("resize", syncViewport);
  }, []);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-postmaker-context-menu]")) {
        props.onClose();
      }
    };

    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") props.onClose();
    };

    window.addEventListener("mousedown", close);
    window.addEventListener("keydown", esc);

    return () => {
      window.removeEventListener("mousedown", close);
      window.removeEventListener("keydown", esc);
    };
  }, [props]);

  const isImage = ["image", "fabricimage"].includes(
    props.objectType.toLowerCase()
  );

  return (
    <div
      data-postmaker-context-menu
      className={
        isMobile
          ? "fixed inset-x-2 bottom-[calc(66px_+_env(safe-area-inset-bottom))] z-[200] max-h-[72dvh] overflow-y-auto rounded-[24px] border bg-white p-2 pb-4 shadow-2xl touch-manipulation"
          : "fixed z-[200] w-72 max-h-[min(610px,calc(100vh-24px))] overflow-y-auto rounded-2xl border bg-white p-2 shadow-2xl"
      }
      style={
        isMobile
          ? undefined
          : {
              left: Math.max(8, Math.min(props.x, window.innerWidth - 300)),
              top: Math.max(8, Math.min(props.y, window.innerHeight - 610)),
            }
      }
      onContextMenu={(e) => e.preventDefault()}
      onTouchStartCapture={beginTouchAction}
      onTouchEndCapture={finishTouchAction}
    >
      {isMobile && (
        <div className="sticky top-0 z-10 mb-1 bg-white pb-1">
          <div className="mx-auto mt-1 h-1 w-10 rounded-full bg-slate-300" />
          <div className="mt-1 flex items-center justify-between px-2 py-2">
            <div>
              <div className="text-sm font-bold text-slate-900">More actions</div>
              <div className="text-[10px] text-slate-400">{props.background ? "Background image" : "Selected object"}</div>
            </div>
            <button
              type="button"
              onClick={props.onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs text-slate-600"
              aria-label="Close more actions"
            >
              ✕
            </button>
          </div>
          <div className="h-px bg-slate-100" />
        </div>
      )}

      {props.background ? (
        props.locked ? (
          <div className="p-1">
            <div className="mb-2 rounded-xl bg-amber-50 px-3 py-3">
              <div className="text-xs font-bold text-amber-800">🔒 Background locked</div>
              <div className="mt-1 text-[11px] leading-5 text-amber-700">
                Unlock the background before editing, replacing or removing it.
              </div>
            </div>
            <MenuButton onClick={props.onLock}>
              🔓 Unlock background
            </MenuButton>
          </div>
        ) : (
          <>
            <MenuButton onClick={() => props.onBackgroundEdit?.()}>
              ✥ Edit crop & zoom
            </MenuButton>
            <MenuButton onClick={props.onLock}>
              🔒 Lock background
            </MenuButton>
            <MenuButton onClick={() => props.onBackgroundDetach?.()}>
              ↗ Detach from background
            </MenuButton>
            <label className="flex w-full cursor-pointer items-center rounded-lg px-3 py-2 text-sm hover:bg-gray-100">
              ↻ Replace background image
              <input
                type="file"
                accept="image/*"
                onChange={(event) => props.onBackgroundReplace?.(event)}
                className="hidden"
              />
            </label>
            <div className="my-1 border-t" />
            <MenuButton onClick={() => props.onBackgroundRemove?.()} danger>
              🗑 Remove background image
            </MenuButton>
          </>
        )
      ) : props.locked ? (
        <div className="p-1">
          <div className="mb-2 rounded-xl bg-amber-50 px-3 py-3">
            <div className="text-xs font-bold text-amber-800">🔒 Locked</div>
            <div className="mt-1 text-[11px] leading-5 text-amber-700">
              Unlock this object to edit, move, resize, rotate or use other actions.
            </div>
          </div>
          <MenuButton onClick={props.onLock}>
            🔓 Unlock object
          </MenuButton>
        </div>
      ) : (
        <>
      <MenuButton onClick={props.onCopy} shortcut={isMobile ? undefined : "Ctrl+C"}>
        ⧉ Copy
      </MenuButton>

      <MenuButton onClick={props.onCopyStyle} shortcut={isMobile ? undefined : "Ctrl+Alt+C"}>
        🖌 Copy style
      </MenuButton>

      <MenuButton onClick={props.onPaste} shortcut={isMobile ? undefined : "Ctrl+V"}>
        📋 Paste
      </MenuButton>

      <MenuButton onClick={props.onPasteStyle}>
        🖌 Paste style
      </MenuButton>

      <MenuButton onClick={props.onDuplicate} shortcut={isMobile ? undefined : "Ctrl+D"}>
        ⧉ Duplicate
      </MenuButton>

      <MenuButton onClick={props.onDelete} shortcut={isMobile ? undefined : "Delete"} danger>
        🗑 Delete
      </MenuButton>

      <div className="my-1 border-t" />

      <button
        onClick={() =>
          setSubmenu((value) => (value === "layer" ? null : "layer"))
        }
        className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-gray-100"
      >
        <span>◈ Layer</span>
        <span>›</span>
      </button>

      {submenu === "layer" && (
        <div className="ml-4 space-y-1 border-l pl-2">
          <MenuButton onClick={props.onBringToFront}>Bring to front</MenuButton>
          <MenuButton onClick={props.onBringForward}>Bring forward</MenuButton>
          <MenuButton onClick={props.onSendBackward}>Send backward</MenuButton>
          <MenuButton onClick={props.onSendToBack}>Send to back</MenuButton>
        </div>
      )}

      <button
        onClick={() =>
          setSubmenu((value) => (value === "align" ? null : "align"))
        }
        className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-gray-100"
      >
        <span>☷ Align to page</span>
        <span>›</span>
      </button>

      {submenu === "align" && (
        <div className="ml-4 grid grid-cols-2 gap-1 border-l pl-2">
          {[
            ["left", "Left"],
            ["center", "Center"],
            ["right", "Right"],
            ["top", "Top"],
            ["middle", "Middle"],
            ["bottom", "Bottom"],
          ].map(([value, label]) => (
            <button
              key={value}
              onClick={() => props.onAlign(value as any)}
              className="rounded-lg px-2 py-2 text-left text-xs hover:bg-gray-100"
            >
              {label}
            </button>
          ))}
        </div>
      )}

      <div className="my-1 border-t" />



      <MenuButton onClick={props.onLock} shortcut={isMobile ? undefined : "Alt+Shift+L"}>
        🔒 Lock object
      </MenuButton>

      <MenuButton onClick={props.onLink} shortcut={isMobile ? undefined : "Ctrl+K"}>
        🔗 Link
      </MenuButton>


      <MenuButton onClick={props.onAltText}>
        ⓐ Alternative text
      </MenuButton>

      <div className="my-1 border-t" />

      {isImage && (
        <MenuButton onClick={props.onSetImageAsBackground}>
          ▨ Set image as background
        </MenuButton>
      )}

      <MenuButton onClick={props.onApplyColorToPage}>
        🎨 Apply color to page
      </MenuButton>

      <MenuButton onClick={props.onDownloadSelection}>
        ↓ Download selection
      </MenuButton>

      <MenuButton onClick={props.onInfo}>
        ⓘ Info
      </MenuButton>
        </>
      )}
    </div>
  );
}
