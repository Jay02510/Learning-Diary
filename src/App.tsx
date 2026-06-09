/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { WhiteLabelSchool, StudentProfile, ArtifactItem } from "./types";
import { PRESET_SCHOOLS, PRESET_STUDENTS, PRESET_SUBJECTS, INITIAL_ARTIFACTS } from "./data";
import { BrandingControl } from "./components/BrandingControl";
import { ArtifactWorkspace } from "./components/ArtifactWorkspace";
import { PortfolioMockPdf } from "./components/PortfolioMockPdf";
import { TechnicalCodeViewer } from "./components/TechnicalCodeViewer";
import { ArtifactUploadForm } from "./components/ArtifactUploadForm";
import { GraduationCap, Sparkles, Database, FileText, CheckCircle, Smartphone, MapPin, Printer } from "lucide-react";

export default function App() {
  const [selectedSchool, setSelectedSchool] = useState<WhiteLabelSchool>(PRESET_SCHOOLS[0]);
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile>(PRESET_STUDENTS[0]);
  const [artifacts, setArtifacts] = useState<ArtifactItem[]>(INITIAL_ARTIFACTS);

  // Dynamic hander to update branding name customizer
  const handleCustomNameChange = (name: string) => {
    setSelectedSchool((prev) => ({
      ...prev,
      name: name,
    }));
  };

  // Dynamic brand color hex picker
  const handleCustomColorChange = (color: string) => {
    setSelectedSchool((prev) => ({
      ...prev,
      brandColor: color,
    }));
  };

  // Handle student artifacts selection updates
  const handleAddArtifact = (newArt: ArtifactItem) => {
    setArtifacts((prev) => [newArt, ...prev]);
  };

  const handleUpdateArtifact = (id: string, updatedFields: Partial<ArtifactItem>) => {
    setArtifacts((prev) =>
      prev.map((art) => (art.id === id ? { ...art, ...updatedFields } : art))
    );
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1C1C1C] flex flex-col font-sans select-none" id="applet-viewport">
      
      {/* Dynamic Styled Page Header */}
      <header className="bg-white border-b border-black/5 text-[#1C1C1C] shrink-0 relative overflow-hidden" id="dashboard-navbar">
        {/* Subtle background visual pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#2a435d_1px,transparent_1px)] [background-size:24px_24px] opacity-5" />
        
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#2A435D] rounded-full flex items-center justify-center">
                <span className="text-white font-sans font-bold text-xs">G</span>
              </div>
              <h2 className="font-sans uppercase tracking-[0.2em] text-[10px] font-bold text-[#2A435D] mb-0 leading-none">ESL Scholastic Network</h2>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <h1 className="font-serif font-light text-2xl sm:text-3xl tracking-tight text-neutral-800 mb-0" id="app-logo-title">
                Monthly Progress Portfolio
              </h1>
              <span className="text-[9px] bg-[#2A435D]/5 text-[#2A435D] font-mono font-bold px-2 py-0.5 rounded-sm border border-[#2A435D]/10">
                Tenant Portal
              </span>
            </div>
            <p className="text-xs text-stone-500 font-sans tracking-wide mb-0">
              Autonomous portfolio builder for South Korean private language centers (Hakwons)
            </p>
          </div>

          {/* Active Configuration metadata stamps */}
          <div className="flex flex-wrap gap-2 items-center" id="header-stamps-group">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-[#FAF9F6] border border-black/5 rounded-sm text-xs text-[#1C1C1C]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-650 animate-pulse" />
              <span className="font-sans font-medium text-stone-600">Server Proxy Active</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-[#2A435D]/5 border border-[#2A435D]/10 rounded-sm text-xs text-[#2A435D]">
              <Sparkles className="w-3.5 h-3.5 text-[#2A435D]" />
              <span className="font-sans font-semibold">Gemini Elite v1.5</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Sandbox Grid Workspace */}
      <main className="grow max-w-7xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8" id="dashboard-layout">
        
        {/* LEFT COLUMN: BRANDING AND ADMIN MODULES (col-span-4) */}
        <section className="lg:col-span-4 space-y-6 flex flex-col" id="dashboard-left-column">
          <BrandingControl
            currentSchool={selectedSchool}
            onSchoolChange={setSelectedSchool}
            onCustomColorChange={handleCustomColorChange}
            onCustomNameChange={handleCustomNameChange}
          />

          {/* Live system telemetry card */}
          <div className="bg-white rounded-md p-6 border border-black/5 text-[#1C1C1C] space-y-4 shadow-xs grow flex flex-col justify-between" id="system-telemetry-banner">
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-black/5">
                <Database className="w-4 h-4 text-[#2A435D]" />
                <h3 className="text-[10px] font-bold font-sans uppercase tracking-[0.2em] text-[#2A435D]">Tenant DB Profile Status</h3>
              </div>
              <div className="space-y-2 text-xs" id="telemetry-info-table">
                <div className="flex justify-between border-b border-black/5 pb-1.5">
                  <span className="text-stone-400">School ID:</span>
                  <span className="font-mono text-stone-800 font-semibold">{selectedSchool.id.split("-")[2]?.toUpperCase() || "7E9D"}</span>
                </div>
                <div className="flex justify-between border-b border-black/5 pb-1.5">
                  <span className="text-stone-400">Color Selector:</span>
                  <span className="font-mono text-stone-800 font-semibold tracking-wider uppercase" style={{ color: selectedSchool.brandColor }}>{selectedSchool.brandColor}</span>
                </div>
                <div className="flex justify-between border-b border-black/5 pb-1.5">
                  <span className="text-stone-400">Grader Signature:</span>
                  <span className="font-serif italic font-medium text-stone-850">{selectedSchool.configuration.graderSignature}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Active Subjects:</span>
                  <span className="font-mono text-stone-800 font-medium">4 Registered Streams</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#FAF9F6] border border-black/5 rounded-sm space-y-1.5 mt-4" id="delivery-info">
              <h4 className="text-[10px] font-bold text-[#2A435D] uppercase tracking-widest flex items-center gap-1">
                <Printer className="w-3.5 h-3.5 text-[#2A435D]" /> Print-Ready Compile Guarantee
              </h4>
              <p className="text-[11px] text-stone-500 leading-relaxed font-sans font-normal">
                Hakwon centers compile these reports monthly. The output compiles directly via <code className="font-mono text-[10px] bg-white px-1 border border-black/5 text-[#2A435D]">@react-pdf/renderer</code>. Any subjects omitting visual artifacts are automatically bypassed from the compiled PDF boundaries safely without breaking page-budget margins.
              </p>
            </div>
          </div>

          <ArtifactUploadForm
            studentId={selectedStudent.id}
            studentName={selectedStudent.englishName}
            subject="Phonics & Blend Mastery"
            imageUrl="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=600"
            selectedTags={["Word Associations", "Segmenting Drills", "Consonant Diagraphs"]}
            targetMonth="2026-06"
          />
        </section>

        {/* RIGHT COLUMN: ACTION PORTAL INTERFACES (col-span-8) */}
        <section className="lg:col-span-8 space-y-6" id="dashboard-right-column">
          {/* Portfolio Aggregator workspace */}
          <ArtifactWorkspace
            currentStudent={selectedStudent}
            onStudentChange={setSelectedStudent}
            subjects={PRESET_SUBJECTS}
            artifacts={artifacts}
            onAddArtifact={handleAddArtifact}
            onUpdateArtifact={handleUpdateArtifact}
            brandColor={selectedSchool.brandColor}
          />

          {/* Double column layout at bottom: Live Portrait preview & relational blueprints */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8" id="visuals-blueprints-split">
            {/* Live mockup print simulator */}
            <div id="mock-preview-panel">
              <h3 className="font-sans font-bold text-stone-500 text-[10px] uppercase tracking-[0.2em] mb-3 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#2A435D]" />
                Live White-Label Preview Card
              </h3>
              <PortfolioMockPdf
                school={selectedSchool}
                student={selectedStudent}
                subjects={PRESET_SUBJECTS}
                artifacts={artifacts}
              />
            </div>

            {/* Developer architectural code blueprint tabs */}
            <div id="technical-explorer-panel">
              <h3 className="font-sans font-bold text-stone-500 text-[10px] uppercase tracking-[0.2em] mb-3 flex items-center gap-1.5">
                <Database className="w-4 h-4 text-[#2A435D]" />
                Technical MVP Deliverables Browser
              </h3>
              <TechnicalCodeViewer />
            </div>
          </div>
        </section>
      </main>

      {/* Simple Professional Negative-space Footer */}
      <footer className="bg-white border-t border-black/5 mt-auto shrink-0 py-8" id="applet-footer">
        <div className="max-w-7xl mx-auto px-4 text-center sm:px-6 lg:px-8 space-y-2" id="footer-text-group">
          <p className="text-xs font-mono text-stone-400">
            © 2026 Multi-Subject Learning Diary Solution. Built with Serverless Next.js, Prisma ORM, and Google Gemini.
          </p>
          <div className="flex justify-center items-center gap-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest" id="dev-credit-rails">
            <span>Hakwon Management System (HMS) Core v1.0</span>
            <span>•</span>
            <span>Parent Portfolio Generation Engine Active</span>
            <span>•</span>
            <span>White-Label Tenant Mapping OK</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
