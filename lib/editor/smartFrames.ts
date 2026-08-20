import {
  Circle,
  Ellipse,
  FabricImage,
  Group,
  Polygon,
  Rect,
  Shadow,
  Textbox,
  type Canvas,
  type FabricObject,
} from "fabric";

export type SmartFrameFit =
  | "fill"
  | "fit";

export type SmartFrameCategory =
  | "All"
  | "Basic"
  | "Social"
  | "Photo"
  | "Device";

export type SmartFrameDefinition = {
  id: string;
  name: string;
  category: Exclude<
    SmartFrameCategory,
    "All"
  >;
  kind:
    | "square"
    | "rounded"
    | "circle"
    | "ellipse"
    | "portrait"
    | "landscape"
    | "polaroid"
    | "story"
    | "phone"
    | "diamond";
  preview: string;
  keywords: string[];
};

export type SmartFrameState = {
  fit: SmartFrameFit;
  zoom: number;
  panX: number;
  panY: number;
  borderColor: string;
  borderWidth: number;
};

type Slot = {
  x: number;
  y: number;
  width: number;
  height: number;
  radius?: number;
};

type Geometry = {
  width: number;
  height: number;
  slot: Slot;
  under: FabricObject[];
  over: FabricObject[];
};

const DEFAULT_STATE: SmartFrameState = {
  fit: "fill",
  zoom: 1,
  panX: 0,
  panY: 0,
  borderColor: "#ffffff",
  borderWidth: 6,
};

export const SMART_FRAMES: SmartFrameDefinition[] = [
  {
    id: "smart-square",
    name: "Square",
    category: "Basic",
    kind: "square",
    preview: "□",
    keywords: ["square", "photo", "frame"],
  },
  {
    id: "smart-rounded",
    name: "Rounded",
    category: "Basic",
    kind: "rounded",
    preview: "▢",
    keywords: ["rounded", "photo", "frame"],
  },
  {
    id: "smart-circle",
    name: "Circle",
    category: "Basic",
    kind: "circle",
    preview: "○",
    keywords: ["circle", "avatar", "profile"],
  },
  {
    id: "smart-ellipse",
    name: "Ellipse",
    category: "Basic",
    kind: "ellipse",
    preview: "⬭",
    keywords: ["ellipse", "oval", "photo"],
  },
  {
    id: "smart-diamond",
    name: "Diamond",
    category: "Basic",
    kind: "diamond",
    preview: "◇",
    keywords: ["diamond", "rhombus", "photo"],
  },
  {
    id: "smart-portrait",
    name: "Portrait",
    category: "Photo",
    kind: "portrait",
    preview: "▯",
    keywords: ["portrait", "photo", "vertical"],
  },
  {
    id: "smart-landscape",
    name: "Landscape",
    category: "Photo",
    kind: "landscape",
    preview: "▭",
    keywords: ["landscape", "photo", "wide"],
  },
  {
    id: "smart-polaroid",
    name: "Polaroid",
    category: "Photo",
    kind: "polaroid",
    preview: "▱",
    keywords: ["polaroid", "instant", "photo"],
  },
  {
    id: "smart-story",
    name: "Story",
    category: "Social",
    kind: "story",
    preview: "▯",
    keywords: ["story", "reel", "vertical", "social"],
  },
  {
    id: "smart-post",
    name: "Social Post",
    category: "Social",
    kind: "square",
    preview: "▦",
    keywords: ["instagram", "post", "social"],
  },
  {
    id: "smart-phone",
    name: "Phone Screen",
    category: "Device",
    kind: "phone",
    preview: "▯",
    keywords: ["phone", "screen", "mobile"],
  },
  {
    id: "smart-profile",
    name: "Profile Photo",
    category: "Social",
    kind: "circle",
    preview: "◉",
    keywords: ["profile", "avatar", "social"],
  },
];

export const SMART_FRAME_CATEGORIES: SmartFrameCategory[] = [
  "All",
  "Basic",
  "Social",
  "Photo",
  "Device",
];

function role<T extends FabricObject>(
  object: T,
  name: string
) {
  (object as any).smartFrameRole =
    name;

  object.set({
    selectable: false,
    evented: false,
  });

  return object;
}

function geometry(
  def: SmartFrameDefinition,
  state: SmartFrameState
): Geometry {
  const border =
    state.borderColor;

  const borderWidth =
    Math.max(
      0,
      state.borderWidth
    );

  const under: FabricObject[] =
    [];
  const over: FabricObject[] =
    [];

  const shadow =
    new Shadow({
      color:
        "rgba(15,23,42,.18)",
      blur: 18,
      offsetX: 0,
      offsetY: 8,
    });

  if (
    def.kind ===
    "circle"
  ) {
    const width = 420;
    const height = 420;
    const slot = {
      x: 30,
      y: 30,
      width: 360,
      height: 360,
      radius: 180,
    };

    under.push(
      role(
        new Circle({
          left: slot.x,
          top: slot.y,
          radius:
            slot.width /
            2,
          fill:
            "#edf1f6",
          shadow,
        }),
        "surface"
      )
    );

    over.push(
      role(
        new Circle({
          left: slot.x,
          top: slot.y,
          radius:
            slot.width /
            2,
          fill:
            "transparent",
          stroke: border,
          strokeWidth:
            borderWidth,
        }),
        "border"
      )
    );

    return {
      width,
      height,
      slot,
      under,
      over,
    };
  }

  if (
    def.kind ===
    "ellipse"
  ) {
    const width = 500;
    const height = 360;
    const slot = {
      x: 30,
      y: 30,
      width: 440,
      height: 300,
    };

    under.push(
      role(
        new Ellipse({
          left: slot.x,
          top: slot.y,
          rx:
            slot.width /
            2,
          ry:
            slot.height /
            2,
          fill:
            "#edf1f6",
          shadow,
        }),
        "surface"
      )
    );

    over.push(
      role(
        new Ellipse({
          left: slot.x,
          top: slot.y,
          rx:
            slot.width /
            2,
          ry:
            slot.height /
            2,
          fill:
            "transparent",
          stroke: border,
          strokeWidth:
            borderWidth,
        }),
        "border"
      )
    );

    return {
      width,
      height,
      slot,
      under,
      over,
    };
  }

  if (
    def.kind ===
    "portrait"
  ) {
    const width = 360;
    const height = 500;
    const slot = {
      x: 24,
      y: 24,
      width: 312,
      height: 452,
      radius: 18,
    };

    under.push(
      role(
        new Rect({
          left: slot.x,
          top: slot.y,
          width: slot.width,
          height: slot.height,
          rx: 18,
          ry: 18,
          fill:
            "#edf1f6",
          shadow,
        }),
        "surface"
      )
    );

    over.push(
      role(
        new Rect({
          left: slot.x,
          top: slot.y,
          width: slot.width,
          height: slot.height,
          rx: 18,
          ry: 18,
          fill:
            "transparent",
          stroke: border,
          strokeWidth:
            borderWidth,
        }),
        "border"
      )
    );

    return {
      width,
      height,
      slot,
      under,
      over,
    };
  }

  if (
    def.kind ===
    "story"
  ) {
    const width = 330;
    const height = 560;
    const slot = {
      x: 22,
      y: 22,
      width: 286,
      height: 516,
      radius: 26,
    };

    under.push(
      role(
        new Rect({
          left: slot.x,
          top: slot.y,
          width: slot.width,
          height: slot.height,
          rx: 26,
          ry: 26,
          fill:
            "#edf1f6",
          shadow,
        }),
        "surface"
      )
    );

    over.push(
      role(
        new Rect({
          left: slot.x,
          top: slot.y,
          width: slot.width,
          height: slot.height,
          rx: 26,
          ry: 26,
          fill:
            "transparent",
          stroke: border,
          strokeWidth:
            borderWidth,
        }),
        "border"
      )
    );

    return {
      width,
      height,
      slot,
      under,
      over,
    };
  }

  if (
    def.kind ===
    "phone"
  ) {
    const width = 340;
    const height = 610;
    const slot = {
      x: 34,
      y: 50,
      width: 272,
      height: 510,
      radius: 32,
    };

    under.push(
      role(
        new Rect({
          left: 16,
          top: 16,
          width: 308,
          height: 578,
          rx: 42,
          ry: 42,
          fill:
            "#111827",
          shadow,
        }),
        "phone"
      ),
      role(
        new Rect({
          left: slot.x,
          top: slot.y,
          width: slot.width,
          height: slot.height,
          rx: 32,
          ry: 32,
          fill:
            "#edf1f6",
        }),
        "surface"
      )
    );

    over.push(
      role(
        new Rect({
          left: 125,
          top: 27,
          width: 90,
          height: 12,
          rx: 6,
          ry: 6,
          fill:
            "#000000",
        }),
        "detail"
      ),
      role(
        new Rect({
          left: slot.x,
          top: slot.y,
          width: slot.width,
          height: slot.height,
          rx: 32,
          ry: 32,
          fill:
            "transparent",
          stroke: border,
          strokeWidth:
            borderWidth,
        }),
        "border"
      )
    );

    return {
      width,
      height,
      slot,
      under,
      over,
    };
  }

  if (
    def.kind ===
    "polaroid"
  ) {
    const width = 430;
    const height = 520;
    const slot = {
      x: 34,
      y: 34,
      width: 362,
      height: 360,
      radius: 6,
    };

    under.push(
      role(
        new Rect({
          left: 8,
          top: 8,
          width: 414,
          height: 504,
          rx: 8,
          ry: 8,
          fill:
            "#ffffff",
          shadow,
        }),
        "paper"
      ),
      role(
        new Rect({
          left: slot.x,
          top: slot.y,
          width: slot.width,
          height: slot.height,
          fill:
            "#edf1f6",
        }),
        "surface"
      )
    );

    over.push(
      role(
        new Textbox(
          "YOUR CAPTION",
          {
            left: 34,
            top: 430,
            width: 362,
            fontSize: 22,
            textAlign:
              "center",
            fill:
              "#64748b",
            fontFamily:
              "Arial",
          }
        ),
        "detail"
      ),
      role(
        new Rect({
          left: slot.x,
          top: slot.y,
          width: slot.width,
          height: slot.height,
          fill:
            "transparent",
          stroke: border,
          strokeWidth:
            borderWidth,
        }),
        "border"
      )
    );

    return {
      width,
      height,
      slot,
      under,
      over,
    };
  }

  if (
    def.kind ===
    "landscape"
  ) {
    const width = 540;
    const height = 360;
    const slot = {
      x: 24,
      y: 24,
      width: 492,
      height: 312,
      radius: 18,
    };

    under.push(
      role(
        new Rect({
          left: slot.x,
          top: slot.y,
          width: slot.width,
          height: slot.height,
          rx: 18,
          ry: 18,
          fill:
            "#edf1f6",
          shadow,
        }),
        "surface"
      )
    );

    over.push(
      role(
        new Rect({
          left: slot.x,
          top: slot.y,
          width: slot.width,
          height: slot.height,
          rx: 18,
          ry: 18,
          fill:
            "transparent",
          stroke: border,
          strokeWidth:
            borderWidth,
        }),
        "border"
      )
    );

    return {
      width,
      height,
      slot,
      under,
      over,
    };
  }

  if (
    def.kind ===
    "diamond"
  ) {
    const width = 440;
    const height = 440;
    const slot = {
      x: 40,
      y: 40,
      width: 360,
      height: 360,
    };

    const points = [
      {
        x: 180,
        y: 0,
      },
      {
        x: 360,
        y: 180,
      },
      {
        x: 180,
        y: 360,
      },
      {
        x: 0,
        y: 180,
      },
    ];

    under.push(
      role(
        new Polygon(
          points,
          {
            left: slot.x,
            top: slot.y,
            fill:
              "#edf1f6",
            shadow,
          }
        ),
        "surface"
      )
    );

    over.push(
      role(
        new Polygon(
          points,
          {
            left: slot.x,
            top: slot.y,
            fill:
              "transparent",
            stroke: border,
            strokeWidth:
              borderWidth,
          }
        ),
        "border"
      )
    );

    return {
      width,
      height,
      slot,
      under,
      over,
    };
  }

  const width = 440;
  const height = 440;
  const rounded =
    def.kind ===
    "rounded";

  const slot = {
    x: 30,
    y: 30,
    width: 380,
    height: 380,
    radius:
      rounded
        ? 42
        : 0,
  };

  under.push(
    role(
      new Rect({
        left: slot.x,
        top: slot.y,
        width: slot.width,
        height: slot.height,
        rx:
          slot.radius ||
          0,
        ry:
          slot.radius ||
          0,
        fill:
          "#edf1f6",
        shadow,
      }),
      "surface"
    )
  );

  over.push(
    role(
      new Rect({
        left: slot.x,
        top: slot.y,
        width: slot.width,
        height: slot.height,
        rx:
          slot.radius ||
          0,
        ry:
          slot.radius ||
          0,
        fill:
          "transparent",
        stroke: border,
        strokeWidth:
          borderWidth,
      }),
      "border"
    )
  );

  return {
    width,
    height,
    slot,
    under,
    over,
  };
}

function applyClip(
  image: FabricImage,
  def: SmartFrameDefinition,
  slot: Slot,
  renderedScale: number
) {
  const width =
    image.width || 1;

  const height =
    image.height || 1;

  if (
    def.kind ===
      "circle"
  ) {
    image.clipPath =
      new Circle({
        radius:
          Math.min(
            width,
            height
          ) / 2,
        originX:
          "center",
        originY:
          "center",
      });

    return;
  }

  if (
    def.kind ===
      "ellipse"
  ) {
    image.clipPath =
      new Ellipse({
        rx:
          width / 2,
        ry:
          height / 2,
        originX:
          "center",
        originY:
          "center",
      });

    return;
  }

  if (
    def.kind ===
      "diamond"
  ) {
    image.clipPath =
      new Polygon(
        [
          {
            x:
              width /
              2,
            y: 0,
          },
          {
            x: width,
            y:
              height /
              2,
          },
          {
            x:
              width /
              2,
            y: height,
          },
          {
            x: 0,
            y:
              height /
              2,
          },
        ],
        {
          originX:
            "center",
          originY:
            "center",
        }
      );

    return;
  }

  const radius =
    (slot.radius ||
      0) /
    Math.max(
      0.0001,
      renderedScale
    );

  image.clipPath =
    new Rect({
      width,
      height,
      rx: radius,
      ry: radius,
      originX:
        "center",
      originY:
        "center",
    });
}

async function frameImage(
  src: string,
  def: SmartFrameDefinition,
  slot: Slot,
  state: SmartFrameState
) {
  const image =
    await FabricImage.fromURL(
      src
    );

  const sourceW =
    Math.max(
      1,
      image.width ||
        1
    );

  const sourceH =
    Math.max(
      1,
      image.height ||
        1
    );

  (image as any).smartFrameRole =
    "image";

  image.set({
    selectable: false,
    evented: false,
  });

  if (
    state.fit === "fit"
  ) {
    const scale =
      Math.min(
        slot.width /
          sourceW,
        slot.height /
          sourceH
      ) *
      Math.max(
        0.25,
        state.zoom
      );

    const shownW =
      sourceW * scale;

    const shownH =
      sourceH * scale;

    const freeX =
      Math.max(
        0,
        slot.width -
          shownW
      );

    const freeY =
      Math.max(
        0,
        slot.height -
          shownH
      );

    image.set({
      left:
        slot.x +
        freeX / 2 +
        state.panX *
          freeX *
          0.5,
      top:
        slot.y +
        freeY / 2 +
        state.panY *
          freeY *
          0.5,
      width: sourceW,
      height: sourceH,
      cropX: 0,
      cropY: 0,
      scaleX: scale,
      scaleY: scale,
    });

    applyClip(
      image,
      def,
      slot,
      scale
    );

    return image;
  }

  const baseScale =
    Math.max(
      slot.width /
        sourceW,
      slot.height /
        sourceH
    );

  const scale =
    baseScale *
    Math.max(
      1,
      state.zoom
    );

  const cropW =
    Math.min(
      sourceW,
      slot.width /
        scale
    );

  const cropH =
    Math.min(
      sourceH,
      slot.height /
        scale
    );

  const maxCropX =
    Math.max(
      0,
      sourceW -
        cropW
    );

  const maxCropY =
    Math.max(
      0,
      sourceH -
        cropH
    );

  const cropX =
    maxCropX *
    (0.5 +
      Math.max(
        -1,
        Math.min(
          1,
          state.panX
        )
      ) *
        0.5);

  const cropY =
    maxCropY *
    (0.5 +
      Math.max(
        -1,
        Math.min(
          1,
          state.panY
        )
      ) *
        0.5);

  image.set({
    left: slot.x,
    top: slot.y,
    width: cropW,
    height: cropH,
    cropX,
    cropY,
    scaleX: scale,
    scaleY: scale,
  });

  applyClip(
    image,
    def,
    slot,
    scale
  );

  return image;
}

function placeholder(
  slot: Slot
) {
  return [
    role(
      new Rect({
        left: slot.x,
        top: slot.y,
        width:
          slot.width,
        height:
          slot.height,
        rx:
          slot.radius ||
          0,
        ry:
          slot.radius ||
          0,
        fill:
          "#eef2f7",
        stroke:
          "#cbd5e1",
        strokeWidth: 2,
        strokeDashArray:
          [10, 8],
      }),
      "placeholder"
    ),
    role(
      new Textbox(
        "DROP / ADD PHOTO",
        {
          left:
            slot.x,
          top:
            slot.y +
            slot.height /
              2 -
            10,
          width:
            slot.width,
          fontSize: 18,
          textAlign:
            "center",
          fill:
            "#64748b",
          fontWeight:
            "bold",
          charSpacing: 40,
        }
      ),
      "placeholder"
    ),
  ];
}

export async function createSmartFrameGroup(
  id: string,
  imageSrc?: string,
  partial?: Partial<SmartFrameState>
) {
  const def =
    SMART_FRAMES.find(
      (item) =>
        item.id === id
    );

  if (!def) {
    throw new Error(
      `Unknown smart frame: ${id}`
    );
  }

  const state = {
    ...DEFAULT_STATE,
    ...partial,
  };

  const geo =
    geometry(
      def,
      state
    );

  const objects: FabricObject[] =
    [...geo.under];

  if (imageSrc) {
    objects.push(
      await frameImage(
        imageSrc,
        def,
        geo.slot,
        state
      )
    );
  } else {
    objects.push(
      ...placeholder(
        geo.slot
      )
    );
  }

  objects.push(
    ...geo.over
  );

  const group =
    new Group(
      objects,
      {
        objectCaching:
          false,
        subTargetCheck:
          false,
      }
    );

  (group as any).isSmartFrame =
    true;
  (group as any).smartFrameId =
    id;
  (group as any).smartFrameName =
    def.name;
  (group as any).smartFrameFit =
    state.fit;
  (group as any).smartFrameZoom =
    state.zoom;
  (group as any).smartFramePanX =
    state.panX;
  (group as any).smartFramePanY =
    state.panY;
  (group as any).smartFrameBorderColor =
    state.borderColor;
  (group as any).smartFrameBorderWidth =
    state.borderWidth;

  return group;
}

export function isSmartFrameObject(
  object:
    | FabricObject
    | null
    | undefined
) {
  return Boolean(
    object &&
      object.type ===
        "group" &&
      (object as any)
        .isSmartFrame ===
        true
  );
}

export function getSmartFrameImageSource(
  object:
    | FabricObject
    | null
    | undefined
) {
  if (
    !isSmartFrameObject(
      object
    )
  ) {
    return null;
  }

  const group =
    object as Group;

  const child =
    group
      .getObjects()
      .find(
        (item: any) =>
          item.smartFrameRole ===
          "image"
      );

  if (!child)
    return null;

  const image =
    child as FabricImage;

  return typeof (
    image as any
  ).getSrc ===
    "function"
    ? (
        image as any
      ).getSrc()
    : (image as any)
        .src ||
        null;
}

export function getSmartFrameState(
  object: FabricObject
): SmartFrameState {
  return {
    fit:
      (object as any)
        .smartFrameFit ===
      "fit"
        ? "fit"
        : "fill",
    zoom: Number(
      (object as any)
        .smartFrameZoom ??
        1
    ),
    panX: Number(
      (object as any)
        .smartFramePanX ??
        0
    ),
    panY: Number(
      (object as any)
        .smartFramePanY ??
        0
    ),
    borderColor:
      String(
        (object as any)
          .smartFrameBorderColor ||
          "#ffffff"
      ),
    borderWidth:
      Number(
        (object as any)
          .smartFrameBorderWidth ??
          6
      ),
  };
}

function copyTransform(
  from: FabricObject,
  to: FabricObject
) {
  to.set({
    left: from.left,
    top: from.top,
    scaleX:
      from.scaleX,
    scaleY:
      from.scaleY,
    angle: from.angle,
    skewX: from.skewX,
    skewY: from.skewY,
    flipX: from.flipX,
    flipY: from.flipY,
    opacity: from.opacity,
    selectable:
      from.selectable,
    evented:
      from.evented,
    visible:
      from.visible,
    lockMovementX:
      from.lockMovementX,
    lockMovementY:
      from.lockMovementY,
    lockScalingX:
      from.lockScalingX,
    lockScalingY:
      from.lockScalingY,
    lockRotation:
      from.lockRotation,
  });
}

export async function rebuildSmartFrame(
  canvas: Canvas,
  current: FabricObject,
  changes: Partial<SmartFrameState>,
  imageSrcOverride?:
    | string
    | null
) {
  if (
    !isSmartFrameObject(
      current
    )
  ) {
    return null;
  }

  const id =
    String(
      (current as any)
        .smartFrameId ||
        ""
    );

  const state = {
    ...getSmartFrameState(
      current
    ),
    ...changes,
  };

  const currentSrc =
    getSmartFrameImageSource(
      current
    );

  const src =
    imageSrcOverride ===
    undefined
      ? currentSrc
      : imageSrcOverride;

  const index =
    canvas
      .getObjects()
      .indexOf(
        current
      );

  const replacement =
    await createSmartFrameGroup(
      id,
      src ||
        undefined,
      state
    );

  copyTransform(
    current,
    replacement
  );

  canvas.remove(
    current
  );

  canvas.add(
    replacement
  );

  const currentIndex =
    canvas
      .getObjects()
      .indexOf(
        replacement
      );

  for (
    let i =
      currentIndex;
    i > index;
    i--
  ) {
    canvas.sendObjectBackwards(
      replacement
    );
  }

  canvas.setActiveObject(
    replacement
  );

  canvas.requestRenderAll();

  return replacement;
}
