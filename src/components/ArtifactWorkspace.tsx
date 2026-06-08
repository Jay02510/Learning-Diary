// src/components/ArtifactWorkspace.tsx
import React, { useState } from "react";
import { StudentProfile, SubjectModule, ArtifactItem } from "../types";
import { PRESET_STUDENTS, PRESET_SUBJECTS } from "../data";
import { PlusCircle, Sparkles, Image as ImageIcon, CheckCircle, Tag, Loader2, ArrowRight } from "lucide-react";

interface ArtifactWorkspaceProps {
  currentStudent: StudentProfile;
  onStudentChange: (student: StudentProfile) => void;
  subjects: SubjectModule[];
  artifacts: ArtifactItem[];
  onAddArtifact: (artifact: ArtifactItem) => void;
  onUpdateArtifact: (id: string, updated: Partial<ArtifactItem>) => void;
  brandColor: string;
}

export const ArtifactWorkspace: React.FC<ArtifactWorkspaceProps> = ({
  currentStudent,
  onStudentChange,
  subjects,
  artifacts,
  onAddArtifact,
  onUpdateArtifact,
  brandColor,
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("sub-phonics");
  
  // States for the Add Artifact Form
  const [newImage, setNewImage] = useState<string>("https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=600");
  const [newNotes, setNewNotes] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  // Generating states
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [genId, setGenId] = useState<string | null>(null); // tracks active generating artifact ID
  const [notesError, setNotesError] = useState<string>("");

  const activeSubject = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];
  const activeSubjectArtifacts = artifacts.filter((a) => a.subjectId === selectedSubjectId);

  // Suggested notes shortcuts to ease teacher typing demo
  const OBS_EXAMPLES = [
    "Scored perfectly on sight words spelling. Excellent verbal pace.",
    "Very focused during the writing drill. Corrected her own capital margins.",
    "Presented her slides loudly. Needs minor guidance maintaining eye contact with peers.",
    "Grasped main ideas quickly during reading review. Re-toggled short vowels correctly."
  ];

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleTriggerGenerator = async (artifactToUpdate: ArtifactItem) => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    setGenId(artifactToUpdate.id);
    setNotesError("");

    try {
      const response = await fetch("/api/generate-narrative", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teacherNotes: artifactToUpdate.teacherNotes,
          tags: artifactToUpdate.tags,
          studentName: currentStudent.englishName.split(" ")[0], // grab Leo/Chloe
          subjectName: activeSubject.name,
        }),
      });

      const data = await response.json();
      
      if (response.ok && data.narrative) {
        onUpdateArtifact(artifactToUpdate.id, { aiNarrative: data.narrative });
      } else {
        throw new Error(data.error || "Failed to generate narrative comment.");
      }
    } catch (err: any) {
      console.error("AI Narrative generation failure:", err);
      setNotesError(err.message || "Narrative compile failed. Check API configuration or key settings.");
      // Fallback response for graceful UI handling if Gemini key is not configured in workspace secrets yet
      onUpdateArtifact(artifactToUpdate.id, {
        aiNarrative: `[Curriculum Advisory Note] ${currentStudent.englishName.split(" ")[0]} exhibited positive growth metrics targeting the pedagogical focus ${activeSubject.name}. Exhibiting high proficiency across targets (${artifactToUpdate.tags.join(", ")}), the student demonstrates fluent phonetic recall. Continued guidance targets spelling word-endings in subsequent cycles.`
      });
    } finally {
      setIsGenerating(false);
      setGenId(null);
    }
  };

  const handleCreateArtifact = () => {
    const defaultText = `Drafted by Instructor Jenkins. Met primary benchmarks across targets. Ready for AI synthesis.`;
    const newArtifact: ArtifactItem = {
      id: `art-created-${Date.now()}`,
      subjectId: selectedSubjectId,
      imageUrl: newImage,
      imageAlt: "Student class photo Work",
      teacherNotes: newNotes || "Scored very high on class drill exercises.",
      aiNarrative: "Select 'AI Assist' to compile parent narratives dynamically.",
      tags: selectedTags.length > 0 ? selectedTags : [activeSubject.predefinedObjectives[0]],
      gradedBy: "Sarah Jenkins",
      createdAt: new Date().toISOString(),
    };

    onAddArtifact(newArtifact);
    
    // Clear form
    setNewNotes("");
    setSelectedTags([]);
  };

  return (
    <div className="bg-white rounded-md border border-black/5 shadow-xs p-6" id="artifact-workspace-card">
      {/* Student Profile Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-black/5 gap-4 mb-5" id="workspace-student-selector">
        <div>
          <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest leading-none mb-1">
            Active Student File
          </label>
          <div className="flex items-center gap-2 mt-1">
            <span className="font-serif font-medium text-stone-850 text-xl leading-tight">{currentStudent.englishName}</span>
            <span className="text-[9px] bg-[#FAF9F6] border border-black/5 px-2 py-0.5 rounded-sm text-stone-500 uppercase tracking-wider font-semibold font-sans">{currentStudent.classId}</span>
          </div>
        </div>
        <div className="flex gap-1.5" id="students-buttons-wrap">
          {PRESET_STUDENTS.map((st) => (
            <button
              key={st.id}
              id={`switch-st-${st.id}`}
              onClick={() => onStudentChange(st)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider select-none transition-all ${
                st.id === currentStudent.id
                  ? "bg-[#2A435D] text-white shadow-xs"
                  : "bg-[#FAF9F6] hover:bg-[#FAF9F6]/80 text-stone-605 border border-black/5 cursor-pointer"
              }`}
            >
              {st.englishName.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Subject Select Stream Tabs */}
      <div id="subject-tab-headers">
        <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-2.5">
          Pedagogical Streams
        </label>
        <div className="flex flex-wrap gap-1 border-b border-black/5 pb-2 mb-5" id="subject-tabs-container">
          {subjects.map((sub) => {
            const isSelected = sub.id === selectedSubjectId;
            const artifactCount = artifacts.filter((art) => art.subjectId === sub.id).length;
            
            return (
              <button
                key={sub.id}
                id={`tab-${sub.id}`}
                onClick={() => setSelectedSubjectId(sub.id)}
                className={`relative px-4 py-2.5 rounded-t-md text-xs font-semibold select-none transition-all flex items-center gap-1.5 border min-h-[36px] cursor-pointer ${
                  isSelected
                    ? "bg-white text-stone-900 border-black/10 border-b-transparent outline-hidden"
                    : "bg-[#FAF9F6] text-[#2A435D]/80 hover:bg-neutral-100 border-transparent hover:border-black/5"
                }`}
                style={isSelected ? { borderTopColor: brandColor, borderTopWidth: "2px" } : {}}
              >
                <span>{sub.name}</span>
                <span className={`w-4 h-4 text-[9px] rounded-full flex items-center justify-center font-bold font-mono transition-all ${
                  artifactCount > 0 ? "bg-[#2A435D]/10 text-[#2A435D]" : "bg-stone-100 text-stone-400"
                }`}>
                  {artifactCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Artifacts List for Active Subject with AI Compile Controls */}
      <div className="space-y-4" id="subject-artifacts-workspace">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-stone-850 text-sm font-medium leading-none mb-0">
            Active Artifacts for {activeSubject.name} <span className="font-mono font-medium text-stone-400">({activeSubjectArtifacts.length})</span>
          </h3>
          {activeSubjectArtifacts.length === 0 && (
            <span className="text-[10px] bg-red-50 text-red-600 px-2.5 py-0.5 rounded-sm border border-red-100 font-semibold uppercase tracking-wider">
              Skipped in PDF Layout
            </span>
          )}
        </div>

        {activeSubjectArtifacts.map((artifact) => {
          const isCurrentGen = isGenerating && genId === artifact.id;
          return (
            <div
              key={artifact.id}
              className="p-5 border border-black/5 hover:border-black/10 bg-[#FAF9F6]/20 hover:bg-[#FAF9F6]/40 rounded-md transition-all grid grid-cols-1 md:grid-cols-12 gap-5"
              id={`idx-art-${artifact.id}`}
            >
              {/* Left Column: visual asset thumbnail */}
              <div className="md:col-span-3 aspect-video md:aspect-square relative rounded-md border border-black/5 overflow-hidden bg-slate-100 self-start">
                <img referrerPolicy="no-referrer" src={artifact.imageUrl} alt={artifact.imageAlt} className="absolute inset-0 w-full h-full object-cover select-none" />
                <div className="absolute top-1.5 left-1.5 bg-[#2A435D] text-white text-[8px] font-bold tracking-widest px-2 py-0.5 rounded-sm font-sans uppercase">
                  ANCHOR TASK
                </div>
              </div>

              {/* Central Column: tags & notes editor */}
              <div className="md:col-span-5 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-1" id={`tags-badge-${artifact.id}`}>
                    {artifact.tags.map((tag) => (
                      <span key={tag} className="flex items-center gap-1 text-[9px] font-bold text-stone-605 bg-white border border-black/5 px-2 py-0.5 rounded-sm uppercase tracking-wider">
                        <Tag className="w-2.5 h-2.5 text-[#2A435D]" />
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="block text-[8px] uppercase tracking-widest text-[#2A435D] font-bold">
                      Teacher Observation Notes
                    </label>
                    <textarea
                      value={artifact.teacherNotes}
                      rows={2}
                      onChange={(e) => onUpdateArtifact(artifact.id, { teacherNotes: e.target.value })}
                      className="w-full bg-white text-xs border border-black/10 hover:border-black/20 rounded-md p-2.5 outline-hidden focus:ring-1 focus:ring-[#2A435D] text-stone-800 leading-normal"
                      placeholder="Type brief bullets or remarks..."
                    />
                  </div>
                </div>

                <div className="text-[10px] text-stone-400 font-sans tracking-wide uppercase font-bold flex items-center justify-between">
                  <span>T. Andrew Thompson</span>
                  <span>June 2026</span>
                </div>
              </div>

              {/* Right Column: AI narrative view & compilation trigger */}
              <div className="md:col-span-4 border-t md:border-t-0 md:border-l border-black/5 pt-4 md:pt-0 md:pl-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[8px] uppercase tracking-widest text-[#2A435D] font-bold flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 text-[#2A435D]" /> Parent Narrative
                    </span>
                    {artifact.aiNarrative.startsWith("[Curriculum") || artifact.aiNarrative.includes("Working diligently") ? (
                      <span className="text-[9px] text-[#2A435D] font-bold uppercase tracking-wider">Uncompiled</span>
                    ) : (
                      <span className="text-[9px] text-emerald-650 font-bold uppercase tracking-wider flex items-center gap-0.5">
                        <CheckCircle className="w-3 h-3" /> Compiled
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-600 leading-relaxed italic bg-[#FAF9F6] border border-black/5 p-3 rounded-md max-h-[140px] overflow-y-auto font-sans">
                    "{artifact.aiNarrative}"
                  </p>
                </div>

                <div className="mt-3">
                  <button
                    onClick={() => handleTriggerGenerator(artifact)}
                    disabled={isCurrentGen}
                    className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-850 disabled:bg-slate-400 rounded-sm cursor-pointer transition-all shadow-xs"
                    style={{ backgroundColor: brandColor }}
                  >
                    {isCurrentGen ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Writing Portfolio Narrative...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        AI Assist (Write Commentary)
                      </>
                    )}
                  </button>
                  {notesError && genId === artifact.id && (
                    <p className="text-[9px] text-red-500 font-medium mt-1 leading-tight">{notesError}. Loaded fallback narrative.</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Add New Milestone Work/Artifact form */}
        <div className="border border-dashed border-black/10 hover:border-black/20 rounded-md p-6 bg-white space-y-4" id="add-milestone-form-section">
          <div className="flex items-center gap-2 pb-3 border-b border-black/5">
            <PlusCircle className="w-4 h-4 text-[#2A435D]" />
            <h4 className="font-serif font-light text-stone-900 text-sm leading-none mb-0">Upload New Visual Anchor Task</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5" id="create-milestone-fields">
            {/* Choose preset educational image */}
            <div className="md:col-span-4" id="visual-selector">
              <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-1.5">
                Work Visual Illustration
              </label>
              <div className="grid grid-cols-2 gap-1.5" id="artifact-images-presets">
                {[
                  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=600", // phonics cards
                  "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=600", // creative journal
                  "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=600", // speaker slide
                  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600", // homework grade
                ].map((imgUrl, i) => {
                  const isChosen = newImage === imgUrl;
                  return (
                    <button
                      key={i}
                      id={`visual-choice-${i}`}
                      onClick={() => setNewImage(imgUrl)}
                      className={`relative aspect-video rounded-sm border overflow-hidden transition-all cursor-pointer ${
                        isChosen ? "border-black scale-95" : "border-black/5 hover:border-black/10"
                      }`}
                    >
                      <img referrerPolicy="no-referrer" src={imgUrl} className="absolute inset-0 w-full h-full object-cover" />
                      {isChosen && (
                        <div className="absolute inset-0 bg-slate-950/20 flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Teacher Notes & Suggested Presets */}
            <div className="md:col-span-5 space-y-3" id="obs-input-side">
              <div className="space-y-1">
                <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest">
                  Quick Observation Write-up
                </label>
                <textarea
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  rows={2}
                  className="w-full bg-[#FAF9F6] text-xs border border-black/10 hover:border-black/20 rounded-md p-2.5 outline-hidden focus:ring-1 focus:ring-[#2A435D] text-stone-850 leading-relaxed"
                  placeholder="Type rough bullets or click a preset below to test..."
                />
              </div>

              {/* One-click Observer presets */}
              <div className="space-y-1">
                <span className="block text-[8px] font-bold text-[#2A435D] uppercase tracking-widest">Suggested Teacher Inputs:</span>
                <div className="flex flex-wrap gap-1" id="shortcut-observation-wrap">
                  {OBS_EXAMPLES.map((ex, idx) => (
                    <button
                      key={idx}
                      id={`obs-shortcut-${idx}`}
                      onClick={() => setNewNotes(ex)}
                      className="text-[9px] py-1 px-1.5 bg-[#FAF9F6] border border-black/5 hover:border-black/10 rounded-sm text-stone-600 hover:text-stone-800 truncate max-w-[120px] transition-all cursor-pointer"
                      title={ex}
                    >
                      {ex}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Objectives Tags check lists */}
            <div className="md:col-span-3 space-y-1.5" id="objectives-tags-selector">
              <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest">
                Target Objective Tags
              </label>
              <div className="flex flex-col gap-1 max-h-[110px] overflow-y-auto border border-black/5 p-2 bg-[#FAF9F6] rounded-md" id="objectives-checklist-box">
                {activeSubject.predefinedObjectives.map((obj) => {
                  const isChecked = selectedTags.includes(obj);
                  return (
                    <button
                      key={obj}
                      id={`tag-opt-${obj.replace(/\s+/g, '-').toLowerCase()}`}
                      onClick={() => handleTagToggle(obj)}
                      className={`flex items-center gap-1.5 p-1 rounded-sm text-left transition-all cursor-pointer ${
                        isChecked ? "bg-white border border-black/5 font-semibold" : "hover:bg-white/50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        readOnly
                        className="rounded border-black/10 text-stone-900 w-3 h-3 shrink-0"
                      />
                      <span className="text-[10px] text-stone-605 truncate">{obj}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-black/5">
            <button
              onClick={handleCreateArtifact}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-850 rounded-sm transition-all shadow-xs shrink-0 cursor-pointer"
              style={{ backgroundColor: brandColor }}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Save Anchor Task (Simulate Aggregate)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
