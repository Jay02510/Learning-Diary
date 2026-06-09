// src/components/PortfolioMockPdf.tsx
import React, { useState, useEffect } from "react";
import { WhiteLabelSchool, StudentProfile, SubjectModule, ArtifactItem } from "../types";
import { ChevronLeft, ChevronRight, FileText, Layout, Award, Settings, CheckCircle, Download } from "lucide-react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { MonthlyDiaryDocument } from "./pdf/MonthlyDiaryDocument";

interface PortfolioMockPdfProps {
  school: WhiteLabelSchool;
  student: StudentProfile;
  subjects: SubjectModule[];
  artifacts: ArtifactItem[];
}

export const PortfolioMockPdf: React.FC<PortfolioMockPdfProps> = ({
  school,
  student,
  subjects,
  artifacts,
}) => {
  const [activePageIndex, setActivePageIndex] = useState<number>(0);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Compile full database structure for the real PDF Document generator engine
  const reportData = {
    school: {
      name: school.name,
      logoUrl: school.logoUrl,
      brandColor: school.brandColor
    },
    student: {
      name: student.englishName || student.name
    },
    targetMonth: "June 2026",
    artifacts: artifacts.map((art) => {
      const matchSubject = subjects.find(s => s.id === art.subjectId);
      return {
        subject: matchSubject ? matchSubject.name : "ESL Lessons",
        imageUrl: art.imageUrl,
        ai_reflection: art.aiNarrative,
        tags: art.tags || []
      };
    })
  };

  // Group artifacts by subject and implement "INTELLIGENT SKIPPING" (zero artifacts = skip subject tab)
  const activeSubjectsWithWork = subjects.map((sub) => {
    const subArtifacts = artifacts.filter((art) => art.subjectId === sub.id);
    return {
      subject: sub,
      artifacts: subArtifacts,
    };
  }).filter((group) => group.artifacts.length > 0);

  // Growth tracker indices based on tags count
  const metrics = {
    vocabularySkills: calculateScoreByTags(artifacts, ["Vocabulary", "Words", "Lexicon"]),
    grammaticalAccuracy: calculateScoreByTags(artifacts, ["Grammar", "Syntax", "Structure"]),
    phonicsFluency: calculateScoreByTags(artifacts, ["Phonics", "Decoding", "Pronunciation"]),
    oralConfidence: calculateScoreByTags(artifacts, ["Speaking", "Fluency", "Discussion"]),
  };

  // Compile full pages: Cover (0), Evidence pages (1 to activeSubjectsWithWork.length), and Growth Tracker (last)
  const totalPages = 1 + activeSubjectsWithWork.length + 1;

  // Helper score calculator (matching Express API logic)
  function calculateScoreByTags(items: ArtifactItem[], keywords: string[]): number {
    if (items.length === 0) return 75;
    let matchCount = 0;
    let totalObjectives = 0;

    for (const item of items) {
      totalObjectives += item.tags.length;
      matchCount += item.tags.filter((tag) =>
        keywords.some((keyword) => tag.toLowerCase().includes(keyword.toLowerCase()))
      ).length;
    }

    if (totalObjectives === 0) return 80;
    const rawVal = matchCount / totalObjectives;
    const score = Math.round(75 + rawVal * 20);
    return Math.min(Math.max(score, 65), 98);
  }

  return (
    <div className="flex flex-col space-y-4" id="pdf-simulator-root">
      {/* Simulator Toolbar Controls */}
      <div className="flex items-center justify-between p-3.5 bg-white border border-black/5 text-[#1C1C1C] rounded-md shadow-xs animate-fadeIn" id="pdf-toolbar">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#2A435D]">PORTRAIT PORTFOLIO OVERVIEW</span>
          </div>

          {/* Dynamic PDF Generation & Export Link */}
          {isMounted ? (
            <PDFDownloadLink
              document={<MonthlyDiaryDocument reportData={reportData} />}
              fileName={`${student.englishName.replace(/[^a-zA-Z0-9]/g, "_")}_Monthly_Diary.pdf`}
            >
              {({ loading }) => (
                <button
                  disabled={loading}
                  className="flex items-center gap-1.5 py-1 px-3 text-[10px] font-bold text-white uppercase tracking-wider rounded-sm shadow-xs cursor-pointer hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50"
                  style={{ backgroundColor: school.brandColor }}
                  id="pdf-download-harness-btn"
                >
                  <Download className="w-3 h-3 text-white shrink-0" />
                  <span>{loading ? "Compiling PDF..." : "Render Real PDF"}</span>
                </button>
              )}
            </PDFDownloadLink>
          ) : (
            <button
              disabled
              className="flex items-center gap-1.5 py-1 px-3 text-[10px] font-bold text-stone-400 bg-stone-100 border border-black/5 uppercase tracking-wider rounded-sm"
            >
              <div className="w-2.5 h-2.5 border-2 border-stone-300 border-t-stone-500 rounded-full animate-spin shrink-0" />
              <span>Hooking PDF Engine...</span>
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-3" id="toolbar-pages-nav">
          <button
            onClick={() => setActivePageIndex(Math.max(0, activePageIndex - 1))}
            disabled={activePageIndex === 0}
            className="p-1 px-3 bg-[#FAF9F6] hover:bg-[#FAF9F6]/80 text-[10px] font-bold uppercase tracking-wider text-stone-600 disabled:opacity-50 border border-black/10 rounded-sm cursor-pointer transition-all"
          >
            Prev
          </button>
          <span className="text-[11px] font-mono text-stone-500 font-bold select-none">
            {activePageIndex + 1} / {totalPages}
          </span>
          <button
            onClick={() => setActivePageIndex(Math.min(totalPages - 1, activePageIndex + 1))}
            disabled={activePageIndex === totalPages - 1}
            className="p-1 px-3 bg-[#FAF9F6] hover:bg-[#FAF9F6]/80 text-[10px] font-bold uppercase tracking-wider text-stone-600 disabled:opacity-50 border border-black/10 rounded-sm cursor-pointer transition-all"
          >
            Next
          </button>
        </div>
      </div>

      {/* Portrait Multi-page visual layout container */}
      <div className="flex justify-center items-center p-6 bg-[#FAF9F6]/60 border border-black/5 rounded-md min-h-[580px] relative" id="pdf-container-view">
        
        {/* ==================== PAGE 0: COVER PAGE ==================== */}
        {activePageIndex === 0 && (
          <div
            className="w-full max-w-[420px] aspect-[1/1.4] bg-white rounded-md shadow-sm transition-all p-8 flex flex-col justify-between border-t-8 border-b border-x border-[#FAF9F6] relative"
            style={{ borderTopColor: school.brandColor }}
            id="pdf-page-cover"
          >
            {/* White label academic crest */}
            <div className="flex flex-col items-center text-center mt-6" id="cover-school-heading">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold bg-[#FAF9F6] border border-black/5 mb-3">
                {school.logoEmoji}
              </div>
              <span className="text-[10px] font-bold text-stone-800 uppercase tracking-[0.2em]">{school.name}</span>
              <span className="text-[8px] text-stone-400 uppercase tracking-widest font-bold mt-1">ESL SCHOLASTIC PORTFOLIO</span>
            </div>

            {/* Document Core Designation */}
            <div className="flex flex-col items-center text-center my-8" id="cover-title-brand">
              <span
                className="text-[8px] font-bold text-white px-3 py-1 rounded-sm uppercase tracking-widest mb-4"
                style={{ backgroundColor: school.brandColor }}
              >
                Monthly Progress
              </span>
              <h1 className="font-serif font-light text-stone-900 text-2xl tracking-normal leading-tight">
                Academic Portfolio
              </h1>
              <h2 className="font-sans font-medium text-stone-400 text-xs uppercase tracking-widest mt-1">
                Multi-Subject Diary
              </h2>
              <div className="w-10 h-[2px] mt-4" style={{ backgroundColor: school.brandColor }} />
            </div>

            {/* Student Metadata Tag Badge */}
            <div 
              className="bg-[#FAF9F6] border-l-2 p-4 rounded-sm"
              style={{ borderLeftColor: school.brandColor }}
              id="cover-student-subplate"
            >
              <table className="w-full text-left text-xs" id="metadata-cover-table">
                <tbody>
                  <tr>
                    <td className="text-[9px] font-bold text-stone-400 uppercase tracking-widest pb-1.5">Student:</td>
                    <td className="font-serif italic font-medium text-stone-850 pb-1.5 align-bottom pr-2">{student.englishName} ({student.name})</td>
                  </tr>
                  <tr>
                    <td className="text-[9px] font-bold text-stone-400 uppercase tracking-widest pb-1.5">Class:</td>
                    <td className="font-sans font-semibold text-stone-700 pb-1.5 align-bottom pr-2">{student.classId}</td>
                  </tr>
                  <tr>
                    <td className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Month:</td>
                    <td className="font-sans font-bold pb-1 align-bottom text-stone-750" style={{ color: school.brandColor }}>June 2026</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Cover Footer stamp info */}
            <div className="flex items-center justify-between border-t border-black/5 pt-4 text-[8px] font-mono text-stone-400" id="cover-stamp-row">
              <span>HAKWON PRINT NO: {school.id.split("-")[1]?.toUpperCase() || "B2A9"}</span>
              <span>{school.configuration.graderSignature}</span>
            </div>
          </div>
        )}

        {/* ==================== PAGES 1+: EVIDENCE PAGES ==================== */}
        {activePageIndex > 0 && activePageIndex <= activeSubjectsWithWork.length && (() => {
          const pageData = activeSubjectsWithWork[activePageIndex - 1];
          if (!pageData) return null;
          
          return (
            <div
              className="w-full max-w-[420px] aspect-[1/1.4] bg-white rounded-md shadow-sm transition-all p-7 flex flex-col justify-between border border-black/5 relative"
              id={`pdf-page-evidence-${activePageIndex}`}
            >
              <div>
                {/* PDF Header Stamp */}
                <div className="flex items-center justify-between pb-2 border-b border-black/5 mb-4" id="evidence-header-stamp">
                  <span className="text-[8px] font-bold text-stone-400 uppercase tracking-wider font-sans">{student.englishName.split(" ")[0]}'s Learning Portfolio</span>
                  <span className="text-[8px] font-bold uppercase tracking-wider" style={{ color: school.brandColor }}>June 2026 ESL Report</span>
                </div>

                {/* Subject Header banner */}
                <div
                  className="px-3.5 py-1.5 rounded-sm text-xs font-semibold uppercase flex items-center justify-between bg-stone-50 border border-black/5"
                  style={{ borderLeft: `3px solid ${school.brandColor}` }}
                  id="evidence-subject-banner"
                >
                  <span className="text-stone-850">Stream: {pageData.subject.name}</span>
                  <span className="text-[9px] text-stone-450 font-mono">({pageData.artifacts.length} tasks)</span>
                </div>

                {/* Map artifacts in the current aggregated stream */}
                <div className="mt-4 space-y-4 max-h-[360px] overflow-y-auto pr-1" id="evidence-artifacts-scrollbox">
                  {pageData.artifacts.map((artifact, i) => (
                    <div key={artifact.id} className="grid grid-cols-12 gap-3 pb-3 border-b border-black/5 last:border-b-0" id={`pdf-artifact-row-${artifact.id}`}>
                      {/* Left side: visual task image */}
                      <div className="col-span-5 relative aspect-square rounded-sm overflow-hidden border border-black/5 bg-[#FAF9F6]">
                        <img referrerPolicy="no-referrer" src={artifact.imageUrl} alt={artifact.imageAlt} className="absolute inset-0 w-full h-full object-cover" />
                        <div className="absolute inset-x-0 bottom-0 py-0.5 bg-black/60 text-[7px] text-center text-white truncate font-mono uppercase tracking-widest">
                          TASK {i + 1}
                        </div>
                      </div>

                      {/* Right side: pedagogical narrative and bullet comments */}
                      <div className="col-span-7 flex flex-col justify-between" id="artifact-report-narration">
                        <div>
                          {/* Predefined metric objectives badges mapping */}
                          <div className="flex flex-wrap gap-0.5 mb-1.5" id={`tags-badge-pdf-${artifact.id}`}>
                            {artifact.tags.map((tag) => (
                              <span key={tag} className="text-[7.5px] font-bold text-stone-500 bg-[#FAF9F6] px-1.5 py-0.2 rounded-sm border border-black/5 uppercase tracking-wider">
                                {tag}
                              </span>
                            ))}
                          </div>

                          {/* Raw teacher observation quotation notes */}
                          {artifact.teacherNotes && (
                            <div className="pl-1.5 border-l border-black/20 italic text-[8px] text-stone-400 leading-snug mb-1.5">
                              "{artifact.teacherNotes}"
                            </div>
                          )}

                          {/* Beautiful parent-ready academic comments */}
                          <p className="text-[10px] text-stone-605 leading-relaxed font-sans">
                            {artifact.aiNarrative}
                          </p>
                        </div>

                        {/* Signature verification */}
                        <div className="text-[7.5px] text-stone-400 font-mono flex items-center justify-between pt-1 mt-1.5 border-t border-black/5">
                          <span>GRADED: T. Andrew</span>
                          <span>STAMP APPROVED</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Page Numbering stamp */}
              <div className="flex justify-between items-center border-t border-black/5 pt-3 text-[8.5px] font-mono text-stone-400 mt-2" id="evidence-page-number-footer">
                <span>{school.name} Portfolio Builder</span>
                <span>Page {activePageIndex + 1}</span>
              </div>
            </div>
          );
        })()}

        {/* ==================== PAGE LAST: GROWTH TRACKER ==================== */}
        {activePageIndex === totalPages - 1 && (
          <div
            className="w-full max-w-[420px] aspect-[1/1.4] bg-white rounded-md shadow-sm transition-all p-7 flex flex-col justify-between border border-black/5 relative"
            id="pdf-page-tracker"
          >
            <div>
              {/* Header Stamp */}
              <div className="flex items-center justify-between pb-2 border-b border-black/5 mb-4" id="tracker-header-stamp">
                <span className="text-[8px] font-bold text-stone-400 uppercase tracking-wider font-sans">{student.englishName.split(" ")[0]}'s Learning Portfolio</span>
                <span className="text-[8px] font-bold uppercase tracking-wider" style={{ color: school.brandColor }}>June 2026 ESL Report</span>
              </div>

              {/* Tracker Heading */}
              <div
                className="px-3.5 py-1.5 rounded-sm text-xs font-semibold uppercase flex items-center bg-stone-50 border border-black/5"
                style={{ borderLeft: `3px solid ${school.brandColor}` }}
                id="tracker-title-banner"
              >
                <Award className="w-4 h-4 mr-1.5 text-stone-605" />
                <span>Core ESL Competency Benchmarks</span>
              </div>

              {/* Progress dynamic list styled with the dynamic school brandColor */}
              <div className="mt-6 space-y-4" id="tracker-competency-list">
                
                {/* Meter 1: Phonics */}
                <div>
                  <div className="flex justify-between items-center text-[10.5px] font-medium text-stone-705 leading-none mb-1.5">
                    <span className="font-sans">Phonics & Grapheme Processing</span>
                    <span className="font-bold font-mono" style={{ color: school.brandColor }}>{metrics.phonicsFluency}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#FAF9F6] rounded-full overflow-hidden border border-black/5">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${metrics.phonicsFluency}%`, backgroundColor: school.brandColor }}
                    />
                  </div>
                </div>

                {/* Meter 2: Grammatical Accuracy */}
                <div>
                  <div className="flex justify-between items-center text-[10.5px] font-medium text-stone-705 leading-none mb-1.5">
                    <span className="font-sans">Grammatical Accuracy & Paragraph Layout</span>
                    <span className="font-bold font-mono" style={{ color: school.brandColor }}>{metrics.grammaticalAccuracy}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#FAF9F6] rounded-full overflow-hidden border border-black/5">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${metrics.grammaticalAccuracy}%`, backgroundColor: school.brandColor }}
                    />
                  </div>
                </div>

                {/* Meter 3: Vocabulary Skills */}
                <div>
                  <div className="flex justify-between items-center text-[10.5px] font-medium text-stone-705 leading-none mb-1.5">
                    <span className="font-sans">Lexical Retrieval & Vocabulary Complexity</span>
                    <span className="font-bold font-mono" style={{ color: school.brandColor }}>{metrics.vocabularySkills}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#FAF9F6] rounded-full overflow-hidden border border-black/5">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${metrics.vocabularySkills}%`, backgroundColor: school.brandColor }}
                    />
                  </div>
                </div>

                {/* Meter 4: Speak Intonation */}
                <div>
                  <div className="flex justify-between items-center text-[10.5px] font-medium text-stone-705 leading-none mb-1.5">
                    <span className="font-sans">Conversational Fluency & Oral Intonation</span>
                    <span className="font-bold font-mono" style={{ color: school.brandColor }}>{metrics.oralConfidence}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#FAF9F6] rounded-full overflow-hidden border border-black/5">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${metrics.oralConfidence}%`, backgroundColor: school.brandColor }}
                    />
                  </div>
                </div>

              </div>

              {/* Analytical summary card below progress bar levels */}
              <div className="bg-[#FAF9F6] border border-black/5 p-4 rounded-sm mt-6 space-y-1.5" id="tracker-summary-card">
                <h4 className="text-[9px] uppercase tracking-widest font-bold text-stone-400">Curriculum Advisory Insights</h4>
                <p className="text-[11px] text-stone-500 leading-relaxed font-normal font-sans">
                  The metrics indicated above are compiled dynamically by monitoring tag metrics assigned on weekly anchor checkpoints. Accumulating target milestone selections automatically updates Leo's baseline indexes, ensuring elite parent communication feedback structures.
                </p>
              </div>
            </div>

            {/* Page Numbering stamp page last */}
            <div className="flex justify-between items-center border-t border-black/5 pt-3 text-[8.5px] font-mono text-stone-400" id="tracker-page-number-footer">
              <span>{school.name} Portfolio Builder</span>
              <span>Page {totalPages} (End of File)</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
