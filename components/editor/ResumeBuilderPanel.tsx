"use client";

import type {
  ResumeData,
  ResumeEducation,
  ResumeExperience,
  ResumeProject,
  ResumeSectionId,
  ResumeTheme,
} from "@/lib/editor/resumeBuilder";

type Props = {
  data: ResumeData;
  theme: ResumeTheme;
  onChange: (data: ResumeData) => void;
  onThemeChange: (theme: ResumeTheme) => void;
  onBuild: () => void;
  onReset: () => void;
};

function Field({
  label,
  value,
  onChange,
  multiline = false,
  rows = 3,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-gray-600">
        {label}
      </span>

      {multiline ? (
        <textarea
          value={value}
          rows={rows}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="w-full resize-y rounded-xl border px-3 py-2 text-sm outline-none focus:border-violet-500"
        />
      ) : (
        <input
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:border-violet-500"
        />
      )}
    </label>
  );
}

function SmallButton({
  children,
  onClick,
  disabled = false,
  title,
  danger = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  title?: string;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`rounded-lg border px-2 py-1 text-[11px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-35 ${
        danger
          ? "border-red-100 text-red-600 hover:bg-red-50"
          : "bg-white text-gray-600 hover:bg-gray-50"
      }`}
    >
      {children}
    </button>
  );
}

const uid = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const SECTION_NAMES: Record<ResumeSectionId, string> = {
  summary: "Summary",
  experience: "Experience",
  skills: "Skills",
  education: "Education",
  projects: "Projects",
};

export default function ResumeBuilderPanel(props: Props) {
  const change = (patch: Partial<ResumeData>) => {
    props.onChange({
      ...props.data,
      ...patch,
    });
  };

  const contentScore =
    props.data.summary.length +
    props.data.skills.length +
    props.data.experiences.reduce(
      (sum, item) => sum + item.role.length + item.company.length + item.bullets.length,
      0
    ) +
    props.data.educations.reduce(
      (sum, item) => sum + item.degree.length + item.school.length + item.details.length,
      0
    ) +
    props.data.projects.reduce(
      (sum, item) => sum + item.name.length + item.description.length,
      0
    );

  const dense = contentScore > 1500;

  const updateExperience = (id: string, patch: Partial<ResumeExperience>) => {
    change({
      experiences: props.data.experiences.map((item) =>
        item.id === id ? { ...item, ...patch } : item
      ),
    });
  };

  const updateEducation = (id: string, patch: Partial<ResumeEducation>) => {
    change({
      educations: props.data.educations.map((item) =>
        item.id === id ? { ...item, ...patch } : item
      ),
    });
  };

  const updateProject = (id: string, patch: Partial<ResumeProject>) => {
    change({
      projects: props.data.projects.map((item) =>
        item.id === id ? { ...item, ...patch } : item
      ),
    });
  };

  const moveItem = <T extends { id: string }>(
    items: T[],
    id: string,
    direction: -1 | 1
  ) => {
    const index = items.findIndex((item) => item.id === id);
    const nextIndex = index + direction;
    if (index < 0 || nextIndex < 0 || nextIndex >= items.length) return items;
    const next = [...items];
    [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
    return next;
  };

  const moveSection = (section: ResumeSectionId, direction: -1 | 1) => {
    const order = props.data.sectionOrder;
    const index = order.indexOf(section);
    const nextIndex = index + direction;
    if (index < 0 || nextIndex < 0 || nextIndex >= order.length) return;
    const next = [...order];
    [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
    change({ sectionOrder: next });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      window.alert("Resume photo ke liye image file select karo.");
      return;
    }

    if (file.size > 2.5 * 1024 * 1024) {
      window.alert("Photo 2.5 MB se chhoti rakho taaki browser save stable rahe.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") return;
      change({ photoDataUrl: reader.result, showPhoto: true });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <div className="rounded-2xl bg-gradient-to-br from-violet-50 via-white to-cyan-50 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm font-bold">Smart Resume Builder Pro</div>
            <div className="mt-1 text-[11px] leading-5 text-gray-500">
              Multiple jobs, education, projects, custom sections aur optional photo. Build ke baad canvas par har object editable rahega.
            </div>
          </div>
          <span className="rounded-full bg-white px-2 py-1 text-[10px] font-bold text-violet-600 shadow-sm">
            A4
          </span>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          {(
            [
              ["modern", "Modern"],
              ["executive", "Executive"],
              ["minimal", "ATS"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => props.onThemeChange(value)}
              className={`rounded-xl border px-2 py-2 text-xs font-semibold ${
                props.theme === value
                  ? "border-violet-600 bg-violet-600 text-white"
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 space-y-5">
        <section>
          <div className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-400">
            Personal
          </div>

          <div className="space-y-3">
            <Field
              label="Full name"
              value={props.data.name}
              onChange={(name) => change({ name })}
            />
            <Field
              label="Professional title"
              value={props.data.title}
              onChange={(title) => change({ title })}
            />

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <Field
                label="Email"
                value={props.data.email}
                onChange={(email) => change({ email })}
              />
              <Field
                label="Phone"
                value={props.data.phone}
                onChange={(phone) => change({ phone })}
              />
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <Field
                label="Location"
                value={props.data.location}
                onChange={(location) => change({ location })}
              />
              <Field
                label="Website"
                value={props.data.website}
                onChange={(website) => change({ website })}
              />
            </div>

            <div className="grid grid-cols-[1fr_auto] gap-3 rounded-xl border p-3">
              <div className="min-w-0">
                <div className="text-xs font-semibold text-gray-700">Profile photo</div>
                <div className="mt-1 text-[10px] leading-4 text-gray-400">
                  Optional. ATS resume ke liye off rakh sakte ho.
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <label className="cursor-pointer rounded-lg border bg-white px-3 py-1.5 text-[11px] font-semibold hover:bg-gray-50">
                    {props.data.photoDataUrl ? "Replace photo" : "Upload photo"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoUpload}
                    />
                  </label>
                  {props.data.photoDataUrl && (
                    <>
                      <SmallButton
                        onClick={() => change({ showPhoto: !props.data.showPhoto })}
                      >
                        {props.data.showPhoto ? "Hide" : "Show"}
                      </SmallButton>
                      <SmallButton
                        danger
                        onClick={() => change({ photoDataUrl: "", showPhoto: false })}
                      >
                        Remove
                      </SmallButton>
                    </>
                  )}
                </div>
              </div>

              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border bg-gray-50 text-xl text-gray-300">
                {props.data.photoDataUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={props.data.photoDataUrl}
                    alt="Resume profile preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  "👤"
                )}
              </div>
            </div>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-gray-600">
                Accent color
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={props.data.accent}
                  onChange={(e) => change({ accent: e.target.value })}
                  className="h-10 w-14 cursor-pointer rounded-lg border bg-white p-1"
                />
                <input
                  value={props.data.accent}
                  onChange={(e) => change({ accent: e.target.value })}
                  className="min-w-0 flex-1 rounded-xl border px-3 py-2 text-sm"
                />
              </div>
            </label>
          </div>
        </section>

        <section className="border-t pt-4">
          <div className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-400">
            Profile
          </div>
          <Field
            label="Professional summary"
            value={props.data.summary}
            onChange={(summary) => change({ summary })}
            multiline
            rows={5}
          />
          <div className="mt-3">
            <Field
              label="Skills (comma separated)"
              value={props.data.skills}
              onChange={(skills) => change({ skills })}
              multiline
              rows={3}
            />
          </div>
        </section>

        <section className="border-t pt-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="text-xs font-bold uppercase tracking-wide text-gray-400">
              Experience
            </div>
            <SmallButton
              onClick={() =>
                change({
                  experiences: [
                    ...props.data.experiences,
                    {
                      id: uid("exp"),
                      role: "New Role",
                      company: "Company",
                      dates: "2024 – Present",
                      bullets: "Add your achievement here.",
                    },
                  ],
                })
              }
            >
              + Add job
            </SmallButton>
          </div>

          <div className="space-y-3">
            {props.data.experiences.length === 0 && (
              <div className="rounded-xl border border-dashed p-4 text-center text-xs text-gray-400">
                No experience added. Fresher resume ke liye section hide bhi kar sakte ho.
              </div>
            )}

            {props.data.experiences.map((item, index) => (
              <div key={item.id} className="rounded-xl border bg-gray-50/60 p-3">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <div className="text-xs font-bold text-gray-700">Job {index + 1}</div>
                  <div className="flex gap-1">
                    <SmallButton
                      title="Move up"
                      disabled={index === 0}
                      onClick={() =>
                        change({
                          experiences: moveItem(props.data.experiences, item.id, -1),
                        })
                      }
                    >
                      ↑
                    </SmallButton>
                    <SmallButton
                      title="Move down"
                      disabled={index === props.data.experiences.length - 1}
                      onClick={() =>
                        change({
                          experiences: moveItem(props.data.experiences, item.id, 1),
                        })
                      }
                    >
                      ↓
                    </SmallButton>
                    <SmallButton
                      danger
                      onClick={() =>
                        change({
                          experiences: props.data.experiences.filter(
                            (entry) => entry.id !== item.id
                          ),
                        })
                      }
                    >
                      Remove
                    </SmallButton>
                  </div>
                </div>

                <div className="space-y-3">
                  <Field
                    label="Role"
                    value={item.role}
                    onChange={(role) => updateExperience(item.id, { role })}
                  />
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <Field
                      label="Company"
                      value={item.company}
                      onChange={(company) => updateExperience(item.id, { company })}
                    />
                    <Field
                      label="Dates"
                      value={item.dates}
                      onChange={(dates) => updateExperience(item.id, { dates })}
                    />
                  </div>
                  <Field
                    label="Achievements — one per line"
                    value={item.bullets}
                    onChange={(bullets) => updateExperience(item.id, { bullets })}
                    multiline
                    rows={5}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t pt-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="text-xs font-bold uppercase tracking-wide text-gray-400">
              Education
            </div>
            <SmallButton
              onClick={() =>
                change({
                  educations: [
                    ...props.data.educations,
                    {
                      id: uid("edu"),
                      degree: "Degree / Course",
                      school: "Institute",
                      dates: "2020 – 2024",
                      details: "",
                    },
                  ],
                })
              }
            >
              + Add education
            </SmallButton>
          </div>

          <div className="space-y-3">
            {props.data.educations.map((item, index) => (
              <div key={item.id} className="rounded-xl border bg-gray-50/60 p-3">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <div className="text-xs font-bold text-gray-700">
                    Education {index + 1}
                  </div>
                  <div className="flex gap-1">
                    <SmallButton
                      disabled={index === 0}
                      onClick={() =>
                        change({
                          educations: moveItem(props.data.educations, item.id, -1),
                        })
                      }
                    >
                      ↑
                    </SmallButton>
                    <SmallButton
                      disabled={index === props.data.educations.length - 1}
                      onClick={() =>
                        change({
                          educations: moveItem(props.data.educations, item.id, 1),
                        })
                      }
                    >
                      ↓
                    </SmallButton>
                    <SmallButton
                      danger
                      onClick={() =>
                        change({
                          educations: props.data.educations.filter(
                            (entry) => entry.id !== item.id
                          ),
                        })
                      }
                    >
                      Remove
                    </SmallButton>
                  </div>
                </div>

                <div className="space-y-3">
                  <Field
                    label="Degree / course"
                    value={item.degree}
                    onChange={(degree) => updateEducation(item.id, { degree })}
                  />
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <Field
                      label="School / institute"
                      value={item.school}
                      onChange={(school) => updateEducation(item.id, { school })}
                    />
                    <Field
                      label="Dates"
                      value={item.dates}
                      onChange={(dates) => updateEducation(item.id, { dates })}
                    />
                  </div>
                  <Field
                    label="Optional details"
                    value={item.details}
                    onChange={(details) => updateEducation(item.id, { details })}
                    multiline
                    rows={2}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t pt-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="text-xs font-bold uppercase tracking-wide text-gray-400">
              Projects
            </div>
            <SmallButton
              onClick={() =>
                change({
                  projects: [
                    ...props.data.projects,
                    {
                      id: uid("project"),
                      name: "Project name",
                      description: "Short result or description",
                    },
                  ],
                })
              }
            >
              + Add project
            </SmallButton>
          </div>

          <div className="space-y-3">
            {props.data.projects.map((item, index) => (
              <div key={item.id} className="rounded-xl border bg-gray-50/60 p-3">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <div className="text-xs font-bold text-gray-700">
                    Project {index + 1}
                  </div>
                  <div className="flex gap-1">
                    <SmallButton
                      disabled={index === 0}
                      onClick={() =>
                        change({
                          projects: moveItem(props.data.projects, item.id, -1),
                        })
                      }
                    >
                      ↑
                    </SmallButton>
                    <SmallButton
                      disabled={index === props.data.projects.length - 1}
                      onClick={() =>
                        change({
                          projects: moveItem(props.data.projects, item.id, 1),
                        })
                      }
                    >
                      ↓
                    </SmallButton>
                    <SmallButton
                      danger
                      onClick={() =>
                        change({
                          projects: props.data.projects.filter(
                            (entry) => entry.id !== item.id
                          ),
                        })
                      }
                    >
                      Remove
                    </SmallButton>
                  </div>
                </div>
                <div className="space-y-3">
                  <Field
                    label="Project name"
                    value={item.name}
                    onChange={(name) => updateProject(item.id, { name })}
                  />
                  <Field
                    label="Description / result"
                    value={item.description}
                    onChange={(description) => updateProject(item.id, { description })}
                    multiline
                    rows={2}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t pt-4">
          <div className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-400">
            Section manager
          </div>
          <div className="mb-3 text-[10px] leading-4 text-gray-400">
            Section title rename, hide/show aur order change karo. Modern theme mein Skills sidebar mein rehta hai; baaki order follow hota hai.
          </div>

          <div className="space-y-2">
            {props.data.sectionOrder.map((section, index) => (
              <div key={section} className="rounded-xl border p-2.5">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      change({
                        sectionVisibility: {
                          ...props.data.sectionVisibility,
                          [section]: !props.data.sectionVisibility[section],
                        },
                      })
                    }
                    className={`h-8 min-w-12 rounded-lg border px-2 text-[10px] font-bold ${
                      props.data.sectionVisibility[section]
                        ? "border-violet-200 bg-violet-50 text-violet-700"
                        : "bg-gray-50 text-gray-400"
                    }`}
                  >
                    {props.data.sectionVisibility[section] ? "ON" : "OFF"}
                  </button>

                  <input
                    value={props.data.sectionLabels[section]}
                    aria-label={`${SECTION_NAMES[section]} section title`}
                    onChange={(e) =>
                      change({
                        sectionLabels: {
                          ...props.data.sectionLabels,
                          [section]: e.target.value,
                        },
                      })
                    }
                    className="min-w-0 flex-1 rounded-lg border px-2.5 py-1.5 text-xs font-semibold outline-none focus:border-violet-500"
                  />

                  <div className="flex gap-1">
                    <SmallButton
                      disabled={index === 0}
                      onClick={() => moveSection(section, -1)}
                    >
                      ↑
                    </SmallButton>
                    <SmallButton
                      disabled={index === props.data.sectionOrder.length - 1}
                      onClick={() => moveSection(section, 1)}
                    >
                      ↓
                    </SmallButton>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {dense && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-800">
            One-page warning: content kaafi dense hai. Builder font ko compact karega, lekin final PDF se pehle canvas par bottom area check kar lena.
          </div>
        )}

        <button
          type="button"
          onClick={props.onBuild}
          className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-violet-100"
        >
          Build / Update Resume
        </button>

        <button
          type="button"
          onClick={props.onReset}
          className="w-full rounded-xl border px-4 py-3 text-sm font-semibold hover:bg-gray-50"
        >
          Reset sample content
        </button>

        <div className="pb-2 text-center text-[10px] leading-4 text-gray-400">
          Resume data aur optional photo browser mein locally save hote hain.
        </div>
      </div>
    </div>
  );
}
