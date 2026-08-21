import type { DesignPage, Format, SavedProject } from "@/types/editor";

const PROJECTS_KEY = "postmaker-projects";
const DESIGN_KEY = "postmaker-design";
const FORMAT_KEY = "postmaker-format";
const BACKGROUND_KEY = "postmaker-background";
const AUTOSAVE_MODE_KEY = "postmaker-autosave-mode";
const PAGES_KEY = "postmaker-pages";
const ACTIVE_PAGE_KEY = "postmaker-active-page";

const DB_NAME = "postmaker-editor";
const DB_VERSION = 1;
const STORE_NAME = "kv";
const IDB_DESIGN_KEY = "autosave-design";
const IDB_PAGES_KEY = "autosave-pages";

// Keep localStorage comfortably below the browser quota because image data URLs
// can make Fabric JSON several megabytes. Large designs are stored in IndexedDB.
const LOCAL_DESIGN_LIMIT = 900_000;

function isBrowser() {
  return typeof window !== "undefined";
}

function openDatabase(): Promise<IDBDatabase | null> {
  if (!isBrowser() || !("indexedDB" in window)) {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    try {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
      request.onblocked = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

async function idbSet(key: string, value: string) {
  const db = await openDatabase();
  if (!db) return false;

  return new Promise<boolean>((resolve) => {
    try {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      transaction.objectStore(STORE_NAME).put(value, key);
      transaction.oncomplete = () => {
        db.close();
        resolve(true);
      };
      transaction.onerror = () => {
        db.close();
        resolve(false);
      };
      transaction.onabort = () => {
        db.close();
        resolve(false);
      };
    } catch {
      db.close();
      resolve(false);
    }
  });
}

async function idbGet(key: string) {
  const db = await openDatabase();
  if (!db) return null;

  return new Promise<string | null>((resolve) => {
    try {
      const transaction = db.transaction(STORE_NAME, "readonly");
      const request = transaction.objectStore(STORE_NAME).get(key);

      request.onsuccess = () => {
        const value = request.result;
        db.close();
        resolve(typeof value === "string" ? value : null);
      };

      request.onerror = () => {
        db.close();
        resolve(null);
      };
    } catch {
      db.close();
      resolve(null);
    }
  });
}

async function idbDelete(key: string) {
  const db = await openDatabase();
  if (!db) return;

  await new Promise<void>((resolve) => {
    try {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      transaction.objectStore(STORE_NAME).delete(key);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => resolve();
      transaction.onabort = () => resolve();
    } catch {
      resolve();
    }
  });

  db.close();
}

function safeSet(key: string, value: string) {
  if (!isBrowser()) return false;

  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function safeRemove(key: string) {
  if (!isBrowser()) return;

  try {
    localStorage.removeItem(key);
  } catch {
    // Storage can be unavailable in private/restricted browser contexts.
  }
}

export function loadProjects(): SavedProject[] {
  if (!isBrowser()) return [];

  try {
    return JSON.parse(localStorage.getItem(PROJECTS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveProjects(projects: SavedProject[]) {
  if (!isBrowser()) return false;

  // Project saving must never crash the editor when browser storage is full.
  try {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
    return true;
  } catch {
    return false;
  }
}

async function saveAutosavePages(
  pages: DesignPage[] | undefined,
  activePageIndex: number | undefined
) {
  if (!isBrowser() || !pages?.length) return;

  const serialized = JSON.stringify(pages);
  safeSet(ACTIVE_PAGE_KEY, String(Math.max(0, activePageIndex ?? 0)));

  // Normal template/page JSON should be committed synchronously first.
  // This makes refresh reliable even if the user refreshes immediately after
  // an edit, while large image-heavy projects still fall back to IndexedDB.
  if (serialized.length <= LOCAL_DESIGN_LIMIT) {
    const localSaved = safeSet(PAGES_KEY, serialized);

    if (localSaved) {
      void idbDelete(IDB_PAGES_KEY);
      return;
    }
  }

  safeRemove(PAGES_KEY);
  const indexedSaved = await idbSet(IDB_PAGES_KEY, serialized);

  if (indexedSaved) return;

  // Last fallback for browsers where IndexedDB is unavailable.
  safeSet(PAGES_KEY, serialized);
}

export async function saveAutosave(
  design: string,
  format: Format,
  background: string,
  pages?: DesignPage[],
  activePageIndex?: number
) {
  if (!isBrowser()) return false;

  // Metadata is tiny. Failure here is non-fatal and is handled below.
  safeSet(FORMAT_KEY, JSON.stringify(format));
  safeSet(BACKGROUND_KEY, background);

  if (design.length <= LOCAL_DESIGN_LIMIT) {
    const localSaved = safeSet(DESIGN_KEY, design);

    if (localSaved) {
      safeSet(AUTOSAVE_MODE_KEY, "local");
      void idbDelete(IDB_DESIGN_KEY);
      await saveAutosavePages(pages, activePageIndex);
      return true;
    }
  }

  // The existing huge local autosave is often what consumes the entire
  // localStorage quota. Remove it before falling back to IndexedDB.
  safeRemove(DESIGN_KEY);

  const indexedSaved = await idbSet(IDB_DESIGN_KEY, design);

  if (indexedSaved) {
    safeSet(AUTOSAVE_MODE_KEY, "indexeddb");
    await saveAutosavePages(pages, activePageIndex);
    return true;
  }

  // Final fallback: try localStorage once more. This may succeed in browsers
  // with a larger quota, but any failure stays contained inside safeSet.
  const fallbackSaved = safeSet(DESIGN_KEY, design);
  safeSet(AUTOSAVE_MODE_KEY, fallbackSaved ? "local" : "disabled");
  await saveAutosavePages(pages, activePageIndex);
  return fallbackSaved;
}

export async function loadAutosave() {
  if (!isBrowser()) return null;

  let format: Format | null = null;

  try {
    const raw = localStorage.getItem(FORMAT_KEY);
    format = raw ? JSON.parse(raw) : null;
  } catch {
    format = null;
  }

  let design: string | null = null;

  try {
    design = localStorage.getItem(DESIGN_KEY);
  } catch {
    design = null;
  }

  if (!design) {
    design = await idbGet(IDB_DESIGN_KEY);
  }

  if (!design) return null;

  let background = "#ffffff";

  try {
    background = localStorage.getItem(BACKGROUND_KEY) || "#ffffff";
  } catch {
    background = "#ffffff";
  }

  let pages: DesignPage[] | undefined;

  try {
    const localPages = localStorage.getItem(PAGES_KEY);
    const rawPages = localPages || (await idbGet(IDB_PAGES_KEY));

    if (rawPages) {
      const parsed = JSON.parse(rawPages);
      if (Array.isArray(parsed) && parsed.length) {
        pages = parsed;
      }
    }
  } catch {
    pages = undefined;
  }

  let activePageIndex = 0;

  try {
    activePageIndex = Math.max(
      0,
      Number(localStorage.getItem(ACTIVE_PAGE_KEY) || 0) || 0
    );
  } catch {
    activePageIndex = 0;
  }

  return {
    design,
    format,
    background,
    pages,
    activePageIndex,
  };
}
