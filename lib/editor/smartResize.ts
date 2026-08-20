import type {
  Canvas,
  FabricObject,
} from "fabric";

type ReflowOptions = {
  padding?: number;
};

const clamp = (
  value: number,
  min: number,
  max: number
) => Math.max(min, Math.min(max, value));

function visualBounds(
  object: FabricObject
) {
  const bounds =
    object.getBoundingRect();

  return {
    left: bounds.left,
    top: bounds.top,
    width: Math.max(
      1,
      bounds.width
    ),
    height: Math.max(
      1,
      bounds.height
    ),
  };
}

function isTextbox(
  object: FabricObject
) {
  const type = String(
    object.type ||
      object.constructor?.name ||
      ""
  ).toLowerCase();

  return (
    type === "textbox" ||
    type === "text-box"
  );
}

function isDecorativeBand(
  coverageX: number,
  coverageY: number
) {
  return (
    (coverageX > 0.78 &&
      coverageY < 0.42) ||
    (coverageY > 0.78 &&
      coverageX < 0.42)
  );
}

function resizeTextboxWidth(
  object: FabricObject,
  targetWidth: number,
  coverageX: number,
  scaleFactor: number
) {
  if (!isTextbox(object))
    return;

  const text =
    object as any;

  const currentWidth =
    Number(
      text.width || 0
    );

  const currentScaleX =
    Math.abs(
      Number(
        text.scaleX || 1
      )
    );

  if (
    !currentWidth ||
    !currentScaleX
  ) {
    return;
  }

  const desiredVisualWidth =
    clamp(
      coverageX *
        targetWidth,
      targetWidth * 0.18,
      targetWidth * 0.86
    );

  const nextScaleX =
    currentScaleX *
    scaleFactor;

  text.set({
    width:
      desiredVisualWidth /
      Math.max(
        0.0001,
        nextScaleX
      ),
  });

  if (
    typeof text.initDimensions ===
    "function"
  ) {
    text.initDimensions();
  }
}

export function smartReflowCanvas(
  canvas: Canvas,
  targetWidth: number,
  targetHeight: number,
  options: ReflowOptions = {}
) {
  const sourceWidth =
    canvas.getWidth();

  const sourceHeight =
    canvas.getHeight();

  if (
    sourceWidth <= 0 ||
    sourceHeight <= 0 ||
    targetWidth <= 0 ||
    targetHeight <= 0
  ) {
    return;
  }

  const ratioX =
    targetWidth /
    sourceWidth;

  const ratioY =
    targetHeight /
    sourceHeight;

  const uniformScale =
    Math.min(
      ratioX,
      ratioY
    );

  const sourceAspect =
    sourceWidth /
    sourceHeight;

  const targetAspect =
    targetWidth /
    targetHeight;

  const orientationFlip =
    (sourceAspect >= 1.1 &&
      targetAspect <= 0.9) ||
    (sourceAspect <= 0.9 &&
      targetAspect >= 1.1);

  const padding =
    options.padding ??
    Math.max(
      18,
      Math.min(
        targetWidth,
        targetHeight
      ) * 0.045
    );

  const objects = [
    ...canvas.getObjects(),
  ];

  objects.forEach(
    (object) => {
      object.setCoords();

      const bounds =
        visualBounds(
          object
        );

      const center =
        object.getCenterPoint();

      const coverageX =
        bounds.width /
        sourceWidth;

      const coverageY =
        bounds.height /
        sourceHeight;

      const fullBleed =
        coverageX > 0.78 &&
        coverageY > 0.78;

      const band =
        isDecorativeBand(
          coverageX,
          coverageY
        );

      const relativeX =
        clamp(
          center.x /
            sourceWidth,
          0,
          1
        );

      const relativeY =
        clamp(
          center.y /
            sourceHeight,
          0,
          1
        );

      if (fullBleed) {
        object.set({
          scaleX:
            (object.scaleX ||
              1) *
            ratioX,
          scaleY:
            (object.scaleY ||
              1) *
            ratioY,
        });

        object.setPositionByOrigin(
          {
            x:
              targetWidth /
              2,
            y:
              targetHeight /
              2,
          } as any,
          "center",
          "center"
        );

        object.setCoords();
        return;
      }

      if (band) {
        const horizontal =
          coverageX >
          coverageY;

        object.set({
          scaleX:
            (object.scaleX ||
              1) *
            (horizontal
              ? ratioX
              : uniformScale),
          scaleY:
            (object.scaleY ||
              1) *
            (horizontal
              ? uniformScale
              : ratioY),
        });

        const nextCenterX =
          horizontal
            ? targetWidth /
              2
            : relativeX *
              targetWidth;

        const nextCenterY =
          horizontal
            ? relativeY *
              targetHeight
            : targetHeight /
              2;

        object.setPositionByOrigin(
          {
            x: nextCenterX,
            y: nextCenterY,
          } as any,
          "center",
          "center"
        );

        object.setCoords();
        return;
      }

      object.set({
        scaleX:
          (object.scaleX ||
            1) *
          uniformScale,
        scaleY:
          (object.scaleY ||
            1) *
          uniformScale,
      });

      resizeTextboxWidth(
        object,
        targetWidth,
        coverageX,
        uniformScale
      );

      let nextX =
        relativeX *
        targetWidth;

      let nextY =
        relativeY *
        targetHeight;

      // When converting a wide design to a vertical one (or vice versa),
      // pull content a little toward the safe center. This prevents
      // left/right headline blocks from being clipped while preserving
      // their original hierarchy.
      if (
        orientationFlip
      ) {
        nextX =
          targetWidth *
          (0.5 +
            (relativeX -
              0.5) *
              0.68);

        nextY =
          targetHeight *
          (0.5 +
            (relativeY -
              0.5) *
              0.82);
      }

      const updatedBounds =
        visualBounds(
          object
        );

      const halfWidth =
        Math.min(
          updatedBounds.width /
            2,
          Math.max(
            1,
            targetWidth /
              2 -
              padding
          )
        );

      const halfHeight =
        Math.min(
          updatedBounds.height /
            2,
          Math.max(
            1,
            targetHeight /
              2 -
              padding
          )
        );

      nextX = clamp(
        nextX,
        padding +
          halfWidth,
        targetWidth -
          padding -
          halfWidth
      );

      nextY = clamp(
        nextY,
        padding +
          halfHeight,
        targetHeight -
          padding -
          halfHeight
      );

      object.setPositionByOrigin(
        {
          x: nextX,
          y: nextY,
        } as any,
        "center",
        "center"
      );

      object.setCoords();
    }
  );

  canvas.setDimensions(
    {
      width:
        targetWidth,
      height:
        targetHeight,
    },
    {
      cssOnly: false,
      backstoreOnly: false,
    } as any
  );

  canvas.setViewportTransform(
    [1, 0, 0, 1, 0, 0]
  );

  canvas.calcOffset();
  canvas.requestRenderAll();
}
