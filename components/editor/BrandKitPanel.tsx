"use client";

import type { ChangeEvent } from "react";

import { FONTS } from "@/lib/editor/fonts";
import {
  BRAND_PRESETS,
  type BrandKit,
  type BrandLogo,
} from "@/lib/editor/brandKit";
import type { SelectedSnapshot } from "@/types/editor";

type Props = {
  brandKit: BrandKit;
  selected: SelectedSnapshot | null;
  onChange: (brandKit: BrandKit) => void;
  onLogoUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  onAddLogo: (logo: BrandLogo) => void;
  onRemoveLogo: (logoId: string) => void;
  onApplyToDesign: () => void;
  onApplyColorToSelected: (color: string) => void;
  onAddBrandHeading: () => void;
  onAddBrandBody: () => void;
};

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block rounded-xl border bg-white p-3">
      <span className="mb-2 block text-[11px] font-semibold uppercase tracking-wide text-gray-400">
        {label}
      </span>

      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-10 w-12 cursor-pointer rounded-lg border p-1"
        />

        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 rounded-lg border px-2 py-2 text-xs font-medium uppercase outline-none focus:border-violet-500"
        />
      </div>
    </label>
  );
}

export default function BrandKitPanel(props: Props) {
  const update = (changes: Partial<BrandKit>) => {
    props.onChange({
      ...props.brandKit,
      ...changes,
    });
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-gradient-to-br from-violet-600 via-fuchsia-500 to-cyan-400 p-4 text-white shadow-lg shadow-violet-100">
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/75">
          Brand Kit
        </div>
        <div className="mt-1 text-lg font-bold">
          Keep every design on-brand
        </div>
        <div className="mt-1 text-xs leading-5 text-white/80">
          Save your logo, palette and fonts. Apply them to any Kriyavo design in one click.
        </div>
      </div>

      <div>
        <label className="mb-2 block text-xs font-semibold text-gray-500">
          Brand name
        </label>
        <input
          value={props.brandKit.name}
          onChange={(event) => update({ name: event.target.value })}
          placeholder="My Brand"
          className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-violet-500"
        />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Quick palettes
          </div>
          <span className="text-[10px] text-gray-400">1 click</span>
        </div>

        <div className="space-y-2">
          {BRAND_PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() =>
                update({
                  primary: preset.primary,
                  secondary: preset.secondary,
                  accent: preset.accent,
                  background: preset.background,
                  text: preset.text,
                })
              }
              className="flex w-full items-center justify-between rounded-xl border p-2.5 text-left transition hover:border-violet-300 hover:bg-violet-50"
            >
              <span className="text-xs font-semibold text-gray-700">
                {preset.name}
              </span>
              <span className="flex gap-1">
                {[preset.primary, preset.secondary, preset.accent, preset.background].map((color, index) => (
                  <span
                    key={`${color}-${index}`}
                    className="h-5 w-5 rounded-full border border-black/10"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
          Brand colors
        </div>

        <div className="grid grid-cols-2 gap-2">
          <ColorField
            label="Primary"
            value={props.brandKit.primary}
            onChange={(primary) => update({ primary })}
          />
          <ColorField
            label="Secondary"
            value={props.brandKit.secondary}
            onChange={(secondary) => update({ secondary })}
          />
          <ColorField
            label="Accent"
            value={props.brandKit.accent}
            onChange={(accent) => update({ accent })}
          />
          <ColorField
            label="Background"
            value={props.brandKit.background}
            onChange={(background) => update({ background })}
          />
          <ColorField
            label="Text"
            value={props.brandKit.text}
            onChange={(text) => update({ text })}
          />
        </div>

        <div className="mt-3 grid grid-cols-5 gap-2">
          {[
            props.brandKit.primary,
            props.brandKit.secondary,
            props.brandKit.accent,
            props.brandKit.background,
            props.brandKit.text,
          ].map((color, index) => (
            <button
              key={`${color}-${index}`}
              onClick={() => props.onApplyColorToSelected(color)}
              disabled={!props.selected}
              title={props.selected ? "Apply to selected object" : "Select an object first"}
              className="group rounded-xl border bg-white p-2 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <span
                className="mx-auto block h-8 w-8 rounded-lg border border-black/10 transition group-hover:scale-105"
                style={{ backgroundColor: color }}
              />
            </button>
          ))}
        </div>

        <div className="mt-1 text-[10px] text-gray-400">
          Select any object, then click a swatch to recolor it.
        </div>
      </div>

      <div>
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
          Brand fonts
        </div>

        <div className="space-y-2 rounded-xl border bg-gray-50 p-3">
          <label className="block">
            <span className="mb-1 block text-[11px] font-semibold text-gray-500">
              Heading
            </span>
            <select
              value={props.brandKit.headingFont}
              onChange={(event) => update({ headingFont: event.target.value })}
              className="w-full rounded-lg border bg-white px-3 py-2 text-sm"
              style={{ fontFamily: props.brandKit.headingFont }}
            >
              {FONTS.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-[11px] font-semibold text-gray-500">
              Body
            </span>
            <select
              value={props.brandKit.bodyFont}
              onChange={(event) => update({ bodyFont: event.target.value })}
              className="w-full rounded-lg border bg-white px-3 py-2 text-sm"
              style={{ fontFamily: props.brandKit.bodyFont }}
            >
              {FONTS.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={props.onAddBrandHeading}
              className="rounded-lg border bg-white px-3 py-2 text-xs font-semibold hover:border-violet-300 hover:bg-violet-50"
            >
              + Brand heading
            </button>
            <button
              onClick={props.onAddBrandBody}
              className="rounded-lg border bg-white px-3 py-2 text-xs font-semibold hover:border-violet-300 hover:bg-violet-50"
            >
              + Brand body
            </button>
          </div>
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Logos
          </div>
          <span className="text-[10px] text-gray-400">
            {props.brandKit.logos.length}/4
          </span>
        </div>

        {props.brandKit.logos.length ? (
          <div className="grid grid-cols-2 gap-2">
            {props.brandKit.logos.map((logo) => (
              <div key={logo.id} className="rounded-xl border bg-white p-2">
                <button
                  onClick={() => props.onAddLogo(logo)}
                  className="flex h-20 w-full items-center justify-center overflow-hidden rounded-lg bg-gray-50 p-2"
                  title="Add logo to canvas"
                >
                  <img
                    src={logo.dataUrl}
                    alt={logo.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </button>

                <div className="mt-2 flex items-center justify-between gap-2">
                  <button
                    onClick={() => props.onAddLogo(logo)}
                    className="min-w-0 flex-1 truncate text-left text-[10px] font-semibold text-gray-700"
                  >
                    {logo.name}
                  </button>
                  <button
                    onClick={() => props.onRemoveLogo(logo.id)}
                    className="rounded-md px-1.5 py-1 text-[10px] text-red-500 hover:bg-red-50"
                    title="Remove logo"
                  >
                    âœ•
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed p-4 text-center text-xs text-gray-400">
            Upload your logo once, then reuse it in every design.
          </div>
        )}

        <label
          className={`mt-2 block cursor-pointer rounded-xl border border-dashed px-3 py-3 text-center text-xs font-semibold transition hover:border-violet-400 hover:bg-violet-50 ${
            props.brandKit.logos.length >= 4 ? "pointer-events-none opacity-40" : ""
          }`}
        >
          + Upload logo
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            onChange={props.onLogoUpload}
            className="hidden"
          />
        </label>
      </div>

      <div className="sticky bottom-0 -mx-4 border-t bg-white p-4">
        <button
          onClick={props.onApplyToDesign}
          className="w-full rounded-xl bg-black px-4 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-gray-800"
        >
          Apply brand to design
        </button>
        <p className="mt-2 text-center text-[10px] leading-4 text-gray-400">
          Keeps layout intact while updating palette and typography.
        </p>
      </div>
    </div>
  );
}
