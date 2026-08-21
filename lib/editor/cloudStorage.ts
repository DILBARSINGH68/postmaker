import { getSupabase } from "@/lib/auth/supabase";
import type { SavedProject } from "@/types/editor";

type CloudDesignRow = {
  id: string;
  user_id: string;
  title: string | null;
  format: SavedProject["format"] | null;
  design_data: string | null;
  pages: SavedProject["pages"] | null;
  background: string | null;
  active_page_index: number | null;
  updated_at: string | null;
};

const CURRENT_DESIGN_KEY = "postmaker-current-cloud-design";

function currentKey(userId: string) {
  return `${CURRENT_DESIGN_KEY}:${userId}`;
}

export function getCurrentCloudDesignId(userId: string) {
  if (typeof window === "undefined") return crypto.randomUUID();

  const key = currentKey(userId);
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;

  const id = crypto.randomUUID();
  window.localStorage.setItem(key, id);
  return id;
}

export function setCurrentCloudDesignId(userId: string, id: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(currentKey(userId), id);
}

export function resetCurrentCloudDesignId(userId: string) {
  const id = crypto.randomUUID();
  setCurrentCloudDesignId(userId, id);
  return id;
}

function rowToProject(row: CloudDesignRow): SavedProject | null {
  if (!row.id || !row.format || !row.design_data) return null;

  return {
    id: row.id,
    name: row.title || "Untitled Design",
    format: row.format,
    background: row.background || "#ffffff",
    design: row.design_data,
    pages: Array.isArray(row.pages) ? row.pages : undefined,
    activePageIndex: Math.max(0, Number(row.active_page_index || 0)),
    updatedAt: row.updated_at ? new Date(row.updated_at).getTime() : Date.now(),
  };
}

export function mergeProjectLists(
  localProjects: SavedProject[],
  cloudProjects: SavedProject[]
) {
  const merged = new Map<string, SavedProject>();

  for (const project of localProjects) merged.set(project.id, project);
  for (const project of cloudProjects) {
    const local = merged.get(project.id);
    if (!local || project.updatedAt >= local.updatedAt) {
      merged.set(project.id, project);
    }
  }

  return Array.from(merged.values()).sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function listCloudProjects(userId: string): Promise<SavedProject[]> {
  const supabase = getSupabase();
  if (!supabase || !userId) return [];

  const { data, error } = await supabase
    .from("designs")
    .select(
      "id,user_id,title,format,design_data,pages,background,active_page_index,updated_at"
    )
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) {
    console.warn("Kriyavo cloud projects load failed:", error.message);
    return [];
  }

  return ((data || []) as CloudDesignRow[])
    .map(rowToProject)
    .filter((project): project is SavedProject => Boolean(project));
}

export async function saveCloudProject(userId: string, project: SavedProject) {
  const supabase = getSupabase();
  if (!supabase || !userId) return false;

  const { error } = await supabase.from("designs").upsert(
    {
      id: project.id,
      user_id: userId,
      title: project.name || "Untitled Design",
      format: project.format,
      design_data: project.design,
      pages: project.pages || null,
      background: project.background || "#ffffff",
      active_page_index: Math.max(0, project.activePageIndex || 0),
      updated_at: new Date(project.updatedAt || Date.now()).toISOString(),
    },
    { onConflict: "id" }
  );

  if (error) {
    console.warn("Kriyavo cloud save failed:", error.message);
    return false;
  }

  return true;
}

export async function deleteCloudProject(userId: string, id: string) {
  const supabase = getSupabase();
  if (!supabase || !userId || !id) return false;

  const { error } = await supabase
    .from("designs")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    console.warn("Kriyavo cloud delete failed:", error.message);
    return false;
  }

  return true;
}
