// src/components/BrandingControl.tsx
import React from "react";
import { WhiteLabelSchool } from "../types";
import { PRESET_SCHOOLS } from "../data";
import { SwatchBook, Palette, Sparkles, Laptop } from "lucide-react";

interface BrandingControlProps {
  currentSchool: WhiteLabelSchool;
  onSchoolChange: (school: WhiteLabelSchool) => void;
  onCustomColorChange: (color: string) => void;
  onCustomNameChange: (name: string) => void;
}

export const BrandingControl: React.FC<BrandingControlProps> = ({
  currentSchool,
  onSchoolChange,
  onCustomColorChange,
  onCustomNameChange,
}) => {
  const COLOR_SWATCHES = [
    { name: "Burgundy Prep", color: "#7F1D1D" },
    { name: "Teal Bilingual", color: "#0D9488" },
    { name: "Royal Scholar", color: "#1E3A8A" },
    { name: "Forest Academy", color: "#15803D" },
    { name: "Sleek Charcoal", color: "#374151" },
    { name: "Warm Amber", color: "#B45309" },
  ];

  return (
    <div className="bg-white rounded-md border border-black/5 shadow-xs p-6" id="branding-control-card">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-black/5">
        <div className="p-2 bg-[#FAF9F6] rounded-full text-[#2A435D]">
          <SwatchBook className="w-4 h-4" id="swatch-icon" />
        </div>
        <div>
          <h2 className="font-serif font-light text-stone-900 text-lg leading-tight" id="branding-title">1. White-Label Admin Engine</h2>
          <p className="text-[10px] text-stone-400 font-sans uppercase tracking-wider mb-0" id="branding-subtitle">Configure hakwon-specific tenant styles</p>
        </div>
      </div>

      <div className="space-y-5" id="branding-form">
        {/* School Preset Selector */}
        <div id="preset-school-selector">
          <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-2.5">
            Select Academy Tenant Profile
          </label>
          <div className="grid grid-cols-1 gap-2" id="school-grid">
            {PRESET_SCHOOLS.map((school) => {
              const isSelected = school.id === currentSchool.id;
              return (
                <button
                  key={school.id}
                  id={`btn-${school.id}`}
                  onClick={() => onSchoolChange(school)}
                  className={`flex items-center justify-between p-3 rounded-md border text-left transition-all ${
                    isSelected
                      ? "border-black/30 bg-[#FAF9F6] shadow-xs"
                      : "border-black/5 hover:border-black/10 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl shrink-0">{school.logoEmoji}</span>
                    <div>
                      <div className="text-xs font-semibold text-stone-800">{school.name}</div>
                      <div className="text-[10px] text-stone-400 font-sans uppercase tracking-wider mt-0.5">Target: {school.configuration.targetAgeGroup}</div>
                    </div>
                  </div>
                  <div
                    className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                    style={{ backgroundColor: school.brandColor }}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* School Name Customizer */}
        <div id="school-name-customizer">
          <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-2">
            Academy Display Name
          </label>
          <input
            type="text"
            id="school-name-input"
            value={currentSchool.name}
            onChange={(e) => onCustomNameChange(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-black/10 bg-[#FAF9F6]/50 hover:bg-[#FAF9F6] focus:bg-white rounded-md focus:outline-hidden focus:ring-1 focus:ring-[#2A435D] text-stone-850 font-medium"
            placeholder="Type academy brand name..."
          />
        </div>

        {/* Dynamic Brand Color Picker */}
        <div id="brand-color-customizer">
          <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-2">
            Dynamically Injected Brand Color
          </label>
          <div className="flex flex-col gap-3" id="color-picker-grid">
            <div className="grid grid-cols-3 gap-1.5" id="swatches-row">
              {COLOR_SWATCHES.map((swatch) => (
                <button
                  key={swatch.name}
                  id={`swatch-${swatch.name.replace(/\s+/g, '-').toLowerCase()}`}
                  onClick={() => onCustomColorChange(swatch.color)}
                  className={`flex flex-col items-center justify-center p-2 rounded-md border text-center transition-all ${
                    currentSchool.brandColor.toLowerCase() === swatch.color.toLowerCase()
                      ? "border-black/30 bg-[#FAF9F6] font-semibold"
                      : "border-black/5 hover:border-black/10 bg-white"
                  }`}
                >
                  <div className="w-4 h-4 rounded-full mb-1 border border-black/5" style={{ backgroundColor: swatch.color }} />
                  <span className="text-[10px] text-stone-500 font-sans tracking-wide select-none">{swatch.name.split(" ")[0]}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 p-3 bg-[#FAF9F6] border border-black/5 rounded-md" id="custom-color-picker-section">
              <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-black/10 shadow-xs shrink-0">
                <input
                  type="color"
                  id="hex-color-picker"
                  value={currentSchool.brandColor}
                  onChange={(e) => onCustomColorChange(e.target.value)}
                  className="absolute inset-0 w-12 h-12 -translate-x-2 -translate-y-2 cursor-pointer"
                />
              </div>
              <div className="grow">
                <div className="text-[10px] uppercase font-bold tracking-wider text-stone-600">Custom Brand Color (HEX)</div>
                <div className="text-xs text-stone-400 font-mono tracking-wider uppercase mt-0.5">{currentSchool.brandColor}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Curated Autonomy Explainer Block */}
        <div className="p-4 bg-[#FAF9F6] border border-black/5 rounded-md space-y-2" id="autonomy-explainer">
          <div className="flex items-center gap-1.5 text-xs font-bold font-sans uppercase tracking-wider text-[#2A435D]">
            <Sparkles className="w-3.5 h-3.5 text-[#2A435D]" />
            Curated Autonomy Principle
          </div>
          <p className="text-[11px] text-stone-500 leading-relaxed font-sans font-normal">
            Instead of requiring busy teachers to write full report card stories, they select standardized structural tags (phonological progress triggers) and write a few raw notes. Our integrated **Gemini narrative writer** does the typing heavy-lifting, styling output beautifully under the academy logo, color theme, and customized configuration settings!
          </p>
        </div>
      </div>
    </div>
  );
};
