import {
  FabricImage,
  Line,
  Rect,
  Textbox,
  type Canvas,
} from "fabric";

export type ResumeTheme =
  | "modern"
  | "executive"
  | "minimal";

export type ResumeExperience = {
  id: string;
  role: string;
  company: string;
  dates: string;
  bullets: string;
};

export type ResumeEducation = {
  id: string;
  degree: string;
  school: string;
  dates: string;
  details: string;
};

export type ResumeProject = {
  id: string;
  name: string;
  description: string;
};

export type ResumeSectionId =
  | "summary"
  | "experience"
  | "skills"
  | "education"
  | "projects";

export type ResumeSectionLabels = Record<ResumeSectionId, string>;
export type ResumeSectionVisibility = Record<ResumeSectionId, boolean>;

export type ResumeData = {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  summary: string;
  skills: string;
  experiences: ResumeExperience[];
  educations: ResumeEducation[];
  projects: ResumeProject[];
  accent: string;
  photoDataUrl: string;
  showPhoto: boolean;
  sectionOrder: ResumeSectionId[];
  sectionLabels: ResumeSectionLabels;
  sectionVisibility: ResumeSectionVisibility;
};

export const DEFAULT_RESUME_DATA: ResumeData = {
  name: "Aarav Sharma",
  title: "Product Designer",
  email: "aarav@email.com",
  phone: "+91 98765 43210",
  location: "New Delhi, India",
  website: "portfolio.com",
  summary:
    "Product designer focused on clear interfaces, useful systems and thoughtful visual craft. Experienced in turning complex requirements into simple, polished digital experiences.",
  skills:
    "Product Design, UI/UX, Figma, Prototyping, Design Systems, Research",
  experiences: [
    {
      id: "exp-1",
      role: "Senior Product Designer",
      company: "North Studio",
      dates: "2022 – Present",
      bullets:
        "Led end-to-end product design for web and mobile experiences.\nBuilt reusable design systems that improved consistency and delivery speed.\nPartnered with product and engineering teams from discovery through launch.",
    },
  ],
  educations: [
    {
      id: "edu-1",
      degree: "Bachelor of Design",
      school: "Design Institute",
      dates: "2018 – 2022",
      details: "",
    },
  ],
  projects: [
    {
      id: "project-1",
      name: "PostMaker",
      description: "Creator design platform",
    },
    {
      id: "project-2",
      name: "Analytics Dashboard",
      description: "Reporting experience",
    },
  ],
  accent: "#7c3aed",
  photoDataUrl: "",
  showPhoto: false,
  sectionOrder: [
    "summary",
    "experience",
    "skills",
    "education",
    "projects",
  ],
  sectionLabels: {
    summary: "Profile",
    experience: "Experience",
    skills: "Skills",
    education: "Education",
    projects: "Projects",
  },
  sectionVisibility: {
    summary: true,
    experience: true,
    skills: true,
    education: true,
    projects: true,
  },
};

const STORAGE_KEY = "postmaker_resume_builder_v1";

const safeString = (value: unknown, fallback = "") =>
  typeof value === "string" ? value : fallback;

const isSectionId = (value: unknown): value is ResumeSectionId =>
  ["summary", "experience", "skills", "education", "projects"].includes(
    String(value)
  );

const normalizeOrder = (value: unknown): ResumeSectionId[] => {
  const supplied = Array.isArray(value)
    ? value.filter(isSectionId)
    : [];
  const unique = Array.from(new Set(supplied));
  const missing = DEFAULT_RESUME_DATA.sectionOrder.filter(
    (section) => !unique.includes(section)
  );
  return [...unique, ...missing];
};

function migrateResumeData(raw: any): ResumeData {
  const experiences: ResumeExperience[] = Array.isArray(raw?.experiences)
    ? raw.experiences.map((item: any, index: number) => ({
        id: safeString(item?.id, `exp-${index + 1}`),
        role: safeString(item?.role),
        company: safeString(item?.company),
        dates: safeString(item?.dates),
        bullets: safeString(item?.bullets),
      }))
    : [
        {
          id: "exp-1",
          role: safeString(
            raw?.experienceTitle,
            DEFAULT_RESUME_DATA.experiences[0].role
          ),
          company: safeString(
            raw?.experienceCompany,
            DEFAULT_RESUME_DATA.experiences[0].company
          ),
          dates: safeString(
            raw?.experienceDates,
            DEFAULT_RESUME_DATA.experiences[0].dates
          ),
          bullets: safeString(
            raw?.experienceBullets,
            DEFAULT_RESUME_DATA.experiences[0].bullets
          ),
        },
      ];

  const educations: ResumeEducation[] = Array.isArray(raw?.educations)
    ? raw.educations.map((item: any, index: number) => ({
        id: safeString(item?.id, `edu-${index + 1}`),
        degree: safeString(item?.degree),
        school: safeString(item?.school),
        dates: safeString(item?.dates),
        details: safeString(item?.details),
      }))
    : [
        {
          id: "edu-1",
          degree: safeString(
            raw?.educationDegree,
            DEFAULT_RESUME_DATA.educations[0].degree
          ),
          school: safeString(
            raw?.educationSchool,
            DEFAULT_RESUME_DATA.educations[0].school
          ),
          dates: safeString(
            raw?.educationDates,
            DEFAULT_RESUME_DATA.educations[0].dates
          ),
          details: "",
        },
      ];

  const projects: ResumeProject[] = Array.isArray(raw?.projects)
    ? raw.projects.map((item: any, index: number) => ({
        id: safeString(item?.id, `project-${index + 1}`),
        name: safeString(item?.name),
        description: safeString(item?.description),
      }))
    : safeString(raw?.projects)
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line, index) => {
          const [name, ...rest] = line.split(/\s+[—-]\s+/);
          return {
            id: `project-${index + 1}`,
            name: name || line,
            description: rest.join(" — "),
          };
        });

  return {
    name: safeString(raw?.name, DEFAULT_RESUME_DATA.name),
    title: safeString(raw?.title, DEFAULT_RESUME_DATA.title),
    email: safeString(raw?.email, DEFAULT_RESUME_DATA.email),
    phone: safeString(raw?.phone, DEFAULT_RESUME_DATA.phone),
    location: safeString(raw?.location, DEFAULT_RESUME_DATA.location),
    website: safeString(raw?.website, DEFAULT_RESUME_DATA.website),
    summary: safeString(raw?.summary, DEFAULT_RESUME_DATA.summary),
    skills: safeString(raw?.skills, DEFAULT_RESUME_DATA.skills),
    experiences,
    educations,
    projects,
    accent: safeString(raw?.accent, DEFAULT_RESUME_DATA.accent),
    photoDataUrl: safeString(raw?.photoDataUrl),
    showPhoto:
      typeof raw?.showPhoto === "boolean"
        ? raw.showPhoto
        : Boolean(raw?.photoDataUrl),
    sectionOrder: normalizeOrder(raw?.sectionOrder),
    sectionLabels: {
      ...DEFAULT_RESUME_DATA.sectionLabels,
      ...(raw?.sectionLabels || {}),
    },
    sectionVisibility: {
      ...DEFAULT_RESUME_DATA.sectionVisibility,
      ...(raw?.sectionVisibility || {}),
    },
  };
}

export function loadResumeData() {
  if (typeof window === "undefined") {
    return DEFAULT_RESUME_DATA;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_RESUME_DATA;
    return migrateResumeData(JSON.parse(raw));
  } catch {
    return DEFAULT_RESUME_DATA;
  }
}

export function saveResumeData(data: ResumeData) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function addText(
  canvas: Canvas,
  text: string,
  options: {
    left: number;
    top: number;
    width: number;
    fontSize: number;
    fill: string;
    fontWeight?: "normal" | "bold";
    fontFamily?: string;
    lineHeight?: number;
    textAlign?: "left" | "center" | "right";
    charSpacing?: number;
  }
) {
  const obj = new Textbox(text, {
    left: options.left,
    top: options.top,
    width: options.width,
    fontSize: options.fontSize,
    fill: options.fill,
    fontWeight: options.fontWeight || "normal",
    fontFamily: options.fontFamily || "Arial",
    lineHeight: options.lineHeight || 1.25,
    textAlign: options.textAlign || "left",
    charSpacing: options.charSpacing || 0,
    editable: true,
    padding: 2,
    splitByGrapheme: false,
    originX: "left",
    originY: "top",
  });

  canvas.add(obj);
  obj.setCoords();
  return obj;
}

function objectBottom(obj: Textbox) {
  return (obj.top || 0) + obj.getScaledHeight();
}

function bullets(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => (line.startsWith("•") ? line : `• ${line}`))
    .join("\n");
}

function visible(data: ResumeData, section: ResumeSectionId) {
  return data.sectionVisibility[section] !== false;
}

function label(data: ResumeData, section: ResumeSectionId) {
  return data.sectionLabels[section]?.trim() ||
    DEFAULT_RESUME_DATA.sectionLabels[section];
}

function contentDensity(data: ResumeData) {
  const score =
    data.summary.length +
    data.skills.length +
    data.experiences.reduce(
      (sum, item) =>
        sum + item.role.length + item.company.length + item.bullets.length,
      0
    ) +
    data.educations.reduce(
      (sum, item) =>
        sum + item.degree.length + item.school.length + item.details.length,
      0
    ) +
    data.projects.reduce(
      (sum, item) => sum + item.name.length + item.description.length,
      0
    );

  if (score > 2200) return 0.76;
  if (score > 1700) return 0.82;
  if (score > 1250) return 0.88;
  if (score > 900) return 0.94;
  return 1;
}

async function addPhoto(
  canvas: Canvas,
  src: string,
  x: number,
  y: number,
  size: number,
  borderColor: string,
  borderWidth: number
) {
  if (!src) return;

  try {
    canvas.add(
      new Rect({
        left: x - borderWidth,
        top: y - borderWidth,
        width: size + borderWidth * 2,
        height: size + borderWidth * 2,
        fill: borderColor,
        rx: size * 0.08,
        ry: size * 0.08,
        selectable: false,
        evented: false,
      })
    );

    const image = await FabricImage.fromURL(src);
    const sourceW = Math.max(1, image.width || 1);
    const sourceH = Math.max(1, image.height || 1);
    const cropSize = Math.min(sourceW, sourceH);

    image.set({
      left: x,
      top: y,
      width: cropSize,
      height: cropSize,
      cropX: Math.max(0, (sourceW - cropSize) / 2),
      cropY: Math.max(0, (sourceH - cropSize) / 2),
      scaleX: size / cropSize,
      scaleY: size / cropSize,
      originX: "left",
      originY: "top",
    });

    image.setCoords();
    canvas.add(image);
  } catch {
    // Resume still builds even if the optional photo cannot be decoded.
  }
}

type FlowStyle = {
  x: number;
  width: number;
  ink: string;
  muted: string;
  accent: string;
  body: number;
  small: number;
  section: number;
  gap: number;
};

function addSectionTitle(
  canvas: Canvas,
  title: string,
  y: number,
  style: FlowStyle,
  line = true
) {
  const heading = addText(canvas, title.toUpperCase(), {
    left: style.x,
    top: y,
    width: style.width,
    fontSize: style.section,
    fill: style.ink,
    fontWeight: "bold",
    charSpacing: 40,
  });

  let next = objectBottom(heading) + style.gap * 0.45;

  if (line) {
    canvas.add(
      new Rect({
        left: style.x,
        top: next,
        width: style.width,
        height: Math.max(2, style.section * 0.07),
        fill: style.accent,
      })
    );
    next += style.gap * 0.8;
  }

  return next;
}

function addSummarySection(
  canvas: Canvas,
  data: ResumeData,
  y: number,
  style: FlowStyle
) {
  y = addSectionTitle(canvas, label(data, "summary"), y, style);
  const body = addText(canvas, data.summary, {
    left: style.x,
    top: y,
    width: style.width,
    fontSize: style.body,
    fill: style.muted,
    lineHeight: 1.34,
  });
  return objectBottom(body) + style.gap;
}

function addExperienceSection(
  canvas: Canvas,
  data: ResumeData,
  y: number,
  style: FlowStyle
) {
  y = addSectionTitle(canvas, label(data, "experience"), y, style);

  data.experiences.forEach((item, index) => {
    const title = addText(canvas, item.role || "Role", {
      left: style.x,
      top: y,
      width: style.width * 0.68,
      fontSize: style.body * 1.15,
      fill: style.ink,
      fontWeight: "bold",
    });

    const meta = [item.company, item.dates].filter(Boolean).join(" • ");
    if (meta) {
      addText(canvas, meta, {
        left: style.x + style.width * 0.68,
        top: y + style.body * 0.1,
        width: style.width * 0.32,
        fontSize: style.small,
        fill: style.accent,
        fontWeight: "bold",
        textAlign: "right",
      });
    }

    y = objectBottom(title) + style.gap * 0.38;

    if (item.bullets.trim()) {
      const detail = addText(canvas, bullets(item.bullets), {
        left: style.x,
        top: y,
        width: style.width,
        fontSize: style.body,
        fill: style.muted,
        lineHeight: 1.34,
      });
      y = objectBottom(detail) + style.gap * 0.72;
    }

    if (index < data.experiences.length - 1) {
      y += style.gap * 0.2;
    }
  });

  return y + style.gap * 0.3;
}

function addSkillsSection(
  canvas: Canvas,
  data: ResumeData,
  y: number,
  style: FlowStyle
) {
  y = addSectionTitle(canvas, label(data, "skills"), y, style);
  const skillText = data.skills
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .join("  •  ");
  const body = addText(canvas, skillText, {
    left: style.x,
    top: y,
    width: style.width,
    fontSize: style.body,
    fill: style.muted,
    lineHeight: 1.4,
  });
  return objectBottom(body) + style.gap;
}

function addEducationSection(
  canvas: Canvas,
  data: ResumeData,
  y: number,
  style: FlowStyle
) {
  y = addSectionTitle(canvas, label(data, "education"), y, style);

  data.educations.forEach((item, index) => {
    const title = addText(canvas, item.degree || "Degree", {
      left: style.x,
      top: y,
      width: style.width * 0.68,
      fontSize: style.body * 1.08,
      fill: style.ink,
      fontWeight: "bold",
    });

    addText(canvas, item.dates, {
      left: style.x + style.width * 0.7,
      top: y,
      width: style.width * 0.30,
      fontSize: style.small,
      fill: style.accent,
      fontWeight: "bold",
      textAlign: "right",
    });

    y = objectBottom(title) + style.gap * 0.25;

    const meta = [item.school, item.details].filter(Boolean).join(" • ");
    if (meta) {
      const detail = addText(canvas, meta, {
        left: style.x,
        top: y,
        width: style.width,
        fontSize: style.small,
        fill: style.muted,
        lineHeight: 1.35,
      });
      y = objectBottom(detail) + style.gap * 0.65;
    }

    if (index < data.educations.length - 1) y += style.gap * 0.15;
  });

  return y + style.gap * 0.3;
}

function addProjectsSection(
  canvas: Canvas,
  data: ResumeData,
  y: number,
  style: FlowStyle
) {
  y = addSectionTitle(canvas, label(data, "projects"), y, style);

  data.projects.forEach((item) => {
    const line = [item.name, item.description].filter(Boolean).join(" — ");
    if (!line) return;
    const obj = addText(canvas, `• ${line}`, {
      left: style.x,
      top: y,
      width: style.width,
      fontSize: style.body,
      fill: style.muted,
      lineHeight: 1.35,
    });
    y = objectBottom(obj) + style.gap * 0.35;
  });

  return y + style.gap * 0.45;
}

function addOrderedSections(
  canvas: Canvas,
  data: ResumeData,
  startY: number,
  style: FlowStyle,
  skip: ResumeSectionId[] = []
) {
  let y = startY;

  data.sectionOrder.forEach((section) => {
    if (skip.includes(section) || !visible(data, section)) return;

    if (section === "summary") y = addSummarySection(canvas, data, y, style);
    if (section === "experience") y = addExperienceSection(canvas, data, y, style);
    if (section === "skills") y = addSkillsSection(canvas, data, y, style);
    if (section === "education") y = addEducationSection(canvas, data, y, style);
    if (section === "projects") y = addProjectsSection(canvas, data, y, style);
  });

  return y;
}

async function renderModern(canvas: Canvas, data: ResumeData) {
  const w = canvas.getWidth();
  const h = canvas.getHeight();
  const density = contentDensity(data);
  const accent = data.accent;
  const ink = "#172033";
  const muted = "#475569";
  const sidebar = w * 0.31;
  const sidePad = w * 0.045;
  const mainX = w * 0.38;
  const mainW = w * 0.54;
  const body = w * 0.014 * density;
  const small = w * 0.012 * density;
  const section = w * 0.019 * density;
  const gap = w * 0.012 * density;

  canvas.backgroundColor = "#ffffff";
  canvas.add(
    new Rect({ left: 0, top: 0, width: sidebar, height: h, fill: accent })
  );

  let sidebarY = h * 0.07;
  if (data.showPhoto && data.photoDataUrl) {
    const photoSize = sidebar * 0.52;
    await addPhoto(
      canvas,
      data.photoDataUrl,
      sidePad,
      sidebarY,
      photoSize,
      "#ffffff",
      Math.max(5, w * 0.003)
    );
    sidebarY += photoSize + h * 0.035;
  }

  addText(canvas, "CONTACT", {
    left: sidePad,
    top: sidebarY,
    width: sidebar - sidePad * 2,
    fontSize: section,
    fill: "#ffffff",
    fontWeight: "bold",
  });

  addText(
    canvas,
    [data.email, data.phone, data.location, data.website]
      .filter(Boolean)
      .join("\n"),
    {
      left: sidePad,
      top: sidebarY + section * 2.1,
      width: sidebar - sidePad * 2,
      fontSize: small,
      fill: "#ffffff",
      lineHeight: 1.55,
    }
  );

  if (visible(data, "skills")) {
    const skillY = Math.max(sidebarY + h * 0.22, h * 0.36);
    addText(canvas, label(data, "skills").toUpperCase(), {
      left: sidePad,
      top: skillY,
      width: sidebar - sidePad * 2,
      fontSize: section,
      fill: "#ffffff",
      fontWeight: "bold",
    });
    addText(
      canvas,
      data.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean)
        .map((skill) => `• ${skill}`)
        .join("\n"),
      {
        left: sidePad,
        top: skillY + section * 2.1,
        width: sidebar - sidePad * 2,
        fontSize: small,
        fill: "#ffffff",
        lineHeight: 1.48,
      }
    );
  }

  addText(canvas, data.name, {
    left: mainX,
    top: h * 0.055,
    width: mainW,
    fontSize: w * 0.052 * density,
    fill: ink,
    fontWeight: "bold",
    fontFamily: "Georgia",
    lineHeight: 1,
  });

  addText(canvas, data.title.toUpperCase(), {
    left: mainX,
    top: h * 0.12,
    width: mainW,
    fontSize: w * 0.018 * density,
    fill: accent,
    fontWeight: "bold",
    charSpacing: 65,
  });

  addOrderedSections(
    canvas,
    data,
    h * 0.205,
    {
      x: mainX,
      width: mainW,
      ink,
      muted,
      accent,
      body,
      small,
      section,
      gap,
    },
    ["skills"]
  );
}

async function renderExecutive(canvas: Canvas, data: ResumeData) {
  const w = canvas.getWidth();
  const h = canvas.getHeight();
  const density = contentDensity(data);
  const accent = data.accent;
  const ink = "#111827";
  const muted = "#475569";
  const pad = w * 0.07;
  const fullW = w * 0.86;
  const body = w * 0.014 * density;
  const small = w * 0.012 * density;
  const section = w * 0.019 * density;
  const gap = w * 0.012 * density;

  canvas.backgroundColor = "#fbfbfa";
  canvas.add(
    new Rect({ left: 0, top: 0, width: w, height: h * 0.17, fill: ink })
  );
  canvas.add(
    new Rect({
      left: 0,
      top: h * 0.17,
      width: w,
      height: h * 0.007,
      fill: accent,
    })
  );

  const photoSpace = data.showPhoto && data.photoDataUrl ? w * 0.18 : 0;
  addText(canvas, data.name, {
    left: pad,
    top: h * 0.04,
    width: fullW - photoSpace,
    fontSize: w * 0.054 * density,
    fill: "#ffffff",
    fontWeight: "bold",
    fontFamily: "Georgia",
  });
  addText(canvas, data.title.toUpperCase(), {
    left: pad,
    top: h * 0.108,
    width: fullW - photoSpace,
    fontSize: w * 0.017 * density,
    fill: accent,
    fontWeight: "bold",
    charSpacing: 60,
  });
  addText(
    canvas,
    [data.email, data.phone, data.location, data.website]
      .filter(Boolean)
      .join(" • "),
    {
      left: pad,
      top: h * 0.142,
      width: fullW - photoSpace,
      fontSize: small,
      fill: "#d1d5db",
    }
  );

  if (data.showPhoto && data.photoDataUrl) {
    const size = w * 0.11;
    await addPhoto(
      canvas,
      data.photoDataUrl,
      w - pad - size,
      h * 0.028,
      size,
      accent,
      Math.max(5, w * 0.003)
    );
  }

  addOrderedSections(canvas, data, h * 0.225, {
    x: pad,
    width: fullW,
    ink,
    muted,
    accent,
    body,
    small,
    section,
    gap,
  });
}

async function renderMinimal(canvas: Canvas, data: ResumeData) {
  const w = canvas.getWidth();
  const h = canvas.getHeight();
  const density = contentDensity(data);
  const accent = data.accent;
  const ink = "#111827";
  const muted = "#475569";
  const pad = w * 0.075;
  const width = w * 0.85;
  const body = w * 0.014 * density;
  const small = w * 0.012 * density;
  const section = w * 0.019 * density;
  const gap = w * 0.012 * density;
  const photoSpace = data.showPhoto && data.photoDataUrl ? w * 0.16 : 0;

  canvas.backgroundColor = "#ffffff";

  addText(canvas, data.name, {
    left: pad,
    top: h * 0.045,
    width: width - photoSpace,
    fontSize: w * 0.055 * density,
    fill: ink,
    fontWeight: "bold",
  });
  addText(canvas, data.title.toUpperCase(), {
    left: pad,
    top: h * 0.112,
    width: width - photoSpace,
    fontSize: w * 0.018 * density,
    fill: accent,
    fontWeight: "bold",
    charSpacing: 60,
  });
  addText(
    canvas,
    [data.email, data.phone, data.location, data.website]
      .filter(Boolean)
      .join(" • "),
    {
      left: pad,
      top: h * 0.147,
      width: width - photoSpace,
      fontSize: small,
      fill: muted,
    }
  );

  if (data.showPhoto && data.photoDataUrl) {
    const size = w * 0.115;
    await addPhoto(
      canvas,
      data.photoDataUrl,
      w - pad - size,
      h * 0.038,
      size,
      accent,
      Math.max(4, w * 0.0025)
    );
  }

  canvas.add(
    new Line([pad, h * 0.18, w - pad, h * 0.18], {
      stroke: accent,
      strokeWidth: w * 0.004,
    })
  );

  addOrderedSections(canvas, data, h * 0.225, {
    x: pad,
    width,
    ink,
    muted,
    accent,
    body,
    small,
    section,
    gap,
  });
}

export async function buildResumeFromData(
  canvas: Canvas,
  data: ResumeData,
  theme: ResumeTheme
) {
  canvas.clear();

  if (theme === "executive") {
    await renderExecutive(canvas, data);
  } else if (theme === "minimal") {
    await renderMinimal(canvas, data);
  } else {
    await renderModern(canvas, data);
  }

  canvas.discardActiveObject();
  canvas.calcOffset();
  canvas.requestRenderAll();
}
