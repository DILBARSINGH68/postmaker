type Props = {
  projectName: string;
  saved: boolean;
  canUndo: boolean;
  canRedo: boolean;
  onProjectNameChange: (value: string) => void;
  onBack: () => void;
  onProjects: () => void;
  onResize: () => void;
  onSave: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onShare: () => void;
  onDownload: () => void;
};

export default function EditorHeader(props: Props) {
  return (
    <header className="relative z-50 flex h-14 shrink-0 items-center justify-between border-b bg-white px-2 md:px-4">
      <div className="flex min-w-0 items-center gap-1.5 md:gap-3">
        <button
          onClick={props.onBack}
          className="rounded-lg px-2 py-2 hover:bg-gray-100 md:px-3"
          title="Back"
        >
          ←
        </button>

        <div className="hidden sm:block">
          <div className="font-semibold">
            PostMaker
          </div>
          <div className="text-[9px] font-medium text-violet-500">
            Edit Tools Fixed
          </div>
        </div>

        <input
          value={props.projectName}
          onChange={(e) =>
            props.onProjectNameChange(
              e.target.value
            )
          }
          className="w-24 min-w-0 rounded-lg border px-2 py-2 text-xs outline-none focus:border-black sm:w-40 sm:px-3 sm:text-sm md:w-60"
          aria-label="Project name"
        />

        <span className="hidden text-xs text-gray-400 md:inline">
          {props.saved
            ? "Saved"
            : "Saving..."}
        </span>
      </div>

      <div className="flex items-center gap-1 md:gap-2">
        <button
          onClick={props.onResize}
          className="hidden rounded-lg border px-3 py-2 text-sm font-medium hover:bg-gray-50 sm:block"
        >
          Resize
        </button>

        <button
          onClick={props.onProjects}
          className="hidden rounded-lg border px-3 py-2 text-sm md:block"
        >
          Projects
        </button>

        <button
          onClick={props.onSave}
          className="hidden rounded-lg border px-3 py-2 text-sm sm:block"
        >
          Save
        </button>

        <button
          onClick={props.onUndo}
          disabled={!props.canUndo}
          className="rounded-lg border px-3 py-2 disabled:opacity-30"
          title="Undo"
        >
          ↶
        </button>

        <button
          onClick={props.onRedo}
          disabled={!props.canRedo}
          className="rounded-lg border px-3 py-2 disabled:opacity-30"
          title="Redo"
        >
          ↷
        </button>

        <button
          onClick={props.onShare}
          className="hidden rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-gray-50 md:block"
        >
          Share
        </button>

        <button
          onClick={props.onDownload}
          className="rounded-lg bg-black px-2.5 py-2 text-xs font-semibold text-white hover:bg-gray-800 sm:px-4 sm:text-sm"
        >
          Download
        </button>
      </div>
    </header>
  );
}
