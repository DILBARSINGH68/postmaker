import type { Format } from "@/types/editor";

export type CanvasSize = {
  width: number;
  height: number;
  scaleToExport: number;
};

const MAX_EDITOR_SIDE = 1400;

export function getEditorCanvasSize(
  format: Format
): CanvasSize {
  const longest = Math.max(
    format.width,
    format.height
  );

  const editorScale = Math.min(
    1,
    MAX_EDITOR_SIDE / longest
  );

  const width = Math.max(
    1,
    Math.round(
      format.width * editorScale
    )
  );

  const height = Math.max(
    1,
    Math.round(
      format.height * editorScale
    )
  );

  return {
    width,
    height,
    scaleToExport:
      format.width / width,
  };
}
