"use client";

type Props = {
  pageCount: number;
  activePageIndex: number;
  zoom: number;
  showPages: boolean;
  onTogglePages: () => void;
  onAddPage: () => void;
  onDuplicatePage: () => void;
  onDeletePage: () => void;
  onSelectPage: (index: number) => void;
  onZoomChange: (zoom: number) => void;
};

export default function DesktopPageBar(props: Props) {
  const pageCount = Math.max(1, props.pageCount);
  const activePageIndex = Math.min(
    Math.max(0, props.activePageIndex),
    pageCount - 1
  );

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // Fullscreen can be blocked by browser policy; editor remains usable.
    }
  };

  return (
    <div className="relative hidden h-11 shrink-0 items-center justify-between border-t bg-white px-3 text-sm text-gray-700 md:flex">
      {props.showPages && (
        <div className="absolute bottom-11 left-0 right-0 z-40 border-t border-gray-200 bg-[#f7f7f8] px-4 py-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)]">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {Array.from({ length: pageCount }).map((_, index) => (
              <button
                key={index}
                onClick={() => props.onSelectPage(index)}
                className={`group flex min-w-[88px] flex-col items-center gap-1 rounded-xl border p-2 transition ${
                  index === activePageIndex
                    ? "border-violet-500 bg-white ring-2 ring-violet-100"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div
                  className={`flex h-12 w-16 items-center justify-center rounded-md border text-xs font-bold ${
                    index === activePageIndex
                      ? "border-violet-300 bg-violet-50 text-violet-700"
                      : "border-gray-200 bg-gray-50 text-gray-500"
                  }`}
                >
                  {index + 1}
                </div>
                <span className="text-[11px] font-medium text-gray-600">
                  Page {index + 1}
                </span>
              </button>
            ))}

            <button
              onClick={props.onAddPage}
              className="flex min-w-[88px] flex-col items-center gap-1 rounded-xl border border-dashed border-gray-300 bg-white p-2 hover:border-violet-400 hover:bg-violet-50"
            >
              <div className="flex h-12 w-16 items-center justify-center rounded-md border border-dashed border-gray-300 text-2xl text-gray-500">
                +
              </div>
              <span className="text-[11px] font-semibold text-gray-600">
                Add page
              </span>
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-1">
        <button
          onClick={props.onTogglePages}
          className={`rounded-lg px-3 py-1.5 font-medium hover:bg-gray-100 ${
            props.showPages ? "bg-gray-100" : ""
          }`}
          title="Show all pages"
        >
          ▤ Pages {activePageIndex + 1}/{pageCount}
        </button>

        <button
          onClick={props.onAddPage}
          className="rounded-lg px-3 py-1.5 font-semibold hover:bg-gray-100"
          title="Add a blank page after the current page"
        >
          + Add page
        </button>

        <button
          onClick={props.onDuplicatePage}
          className="rounded-lg px-2.5 py-1.5 hover:bg-gray-100"
          title="Duplicate current page"
        >
          ⧉
        </button>

        <button
          onClick={props.onDeletePage}
          disabled={pageCount <= 1}
          className="rounded-lg px-2.5 py-1.5 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
          title="Delete current page"
        >
          🗑
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => props.onZoomChange(Math.max(25, props.zoom - 10))}
          className="rounded-md px-2 py-1 hover:bg-gray-100"
          title="Zoom out"
        >
          −
        </button>

        <input
          aria-label="Canvas zoom"
          type="range"
          min="25"
          max="110"
          step="1"
          value={props.zoom}
          onChange={(event) => props.onZoomChange(Number(event.target.value))}
          className="w-28"
        />

        <button
          onClick={() => props.onZoomChange(Math.min(110, props.zoom + 10))}
          className="rounded-md px-2 py-1 hover:bg-gray-100"
          title="Zoom in"
        >
          +
        </button>

        <button
          onClick={() => props.onZoomChange(57)}
          className="min-w-[48px] rounded-md px-2 py-1 text-center font-medium hover:bg-gray-100"
          title="Reset zoom"
        >
          {props.zoom}%
        </button>

        <button
          onClick={props.onTogglePages}
          className="rounded-md px-2 py-1 hover:bg-gray-100"
          title="Page overview"
        >
          ▦
        </button>

        <button
          onClick={() => void toggleFullscreen()}
          className="rounded-md px-2 py-1 hover:bg-gray-100"
          title="Fullscreen"
        >
          ⛶
        </button>
      </div>
    </div>
  );
}
