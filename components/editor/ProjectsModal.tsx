import type { SavedProject } from "@/types/editor";

type Props = {
  open: boolean;
  projects: SavedProject[];
  onClose: () => void;
  onLoad: (project: SavedProject) => void;
  onDelete: (id: string) => void;
};

export default function ProjectsModal(props: Props) {
  if (!props.open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 p-2 pb-[calc(8px_+_env(safe-area-inset-bottom))] md:items-center md:p-4">
      <div className="max-h-[88dvh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-4 shadow-2xl md:max-h-[80vh] md:p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">My Projects</h2>
            <p className="text-sm text-gray-400">Saved in this browser</p>
          </div>

          <button
            onClick={props.onClose}
            className="rounded-lg border px-3 py-2"
          >
            ✕
          </button>
        </div>

        {props.projects.length === 0 ? (
          <div className="rounded-xl border border-dashed p-10 text-center text-sm text-gray-400">
            No saved projects yet.
          </div>
        ) : (
          <div className="space-y-3">
            {props.projects.map((project) => (
              <div
                key={project.id}
                className="flex items-center gap-3 rounded-xl border p-4"
              >
                <button
                  onClick={() => props.onLoad(project)}
                  className="min-w-0 flex-1 text-left"
                >
                  <div className="truncate font-semibold">{project.name}</div>
                  <div className="mt-1 text-xs text-gray-400">
                    {project.format.name} · {project.format.width} ×{" "}
                    {project.format.height}
                  </div>
                </button>

                <button
                  onClick={() => props.onDelete(project.id)}
                  className="rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
