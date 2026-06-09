import React, { useState } from "react";
import { Sparkles, CheckCircle2, AlertCircle, Image as ImageIcon, Database, ArrowRight } from "lucide-react";

interface UploadFormProps {
  studentId: string;
  studentName: string;
  subject: string;
  imageUrl: string; // Obtained from your UploadThing response component
  selectedTags: string[];
  targetMonth: string; // e.g., "2026-06"
}

export const ArtifactUploadForm: React.FC<UploadFormProps> = ({
  studentId,
  studentName,
  subject,
  imageUrl,
  selectedTags,
  targetMonth
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedArtifact, setSavedArtifact] = useState<any>(null);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmitReport = async () => {
    setIsSubmitting(true);
    setStatusMessage(null);
    try {
      const response = await fetch("/api/artifacts/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId,
          studentName,
          subject,
          imageUrl,
          tags: selectedTags,
          targetMonth,
          teacherId: null // Populate if using authentication state
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setSavedArtifact(result.data);
        setStatusMessage({
          type: "success",
          text: "Artifact successfully processed by Gemini AI and committed to Supabase!"
        });
      } else {
        setStatusMessage({
          type: "error",
          text: `Pipeline Error: ${result.message || "Failed to commit record."}`
        });
      }
    } catch (err: any) {
      console.error("Network interface error:", err);
      setStatusMessage({
        type: "error",
        text: `Network Error: ${err.message || "Could not connect to service API."}`
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-md border border-black/5 p-6 shadow-xs text-[#1C1C1C] space-y-4" id="artifact-upload-form-card">
      <div className="flex items-center gap-2 pb-3 border-b border-black/5">
        <Database className="w-4 h-4 text-slate-800" />
        <h3 className="text-[10px] font-bold font-sans uppercase tracking-[0.2em] text-slate-800">
          Supabase + Gemini Pipeline
        </h3>
      </div>

      <div className="space-y-3">
        <div className="space-y-1">
          <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest leading-none">
            Selected Student
          </label>
          <p className="text-xs font-serif font-medium text-stone-850">{studentName}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest leading-none">
              Stream/Subject
            </label>
            <p className="text-xs font-mono font-semibold text-[#2A435D]">{subject}</p>
          </div>
          <div className="space-y-1">
            <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest leading-none">
              Billing Period
            </label>
            <p className="text-xs font-mono text-stone-705 font-medium">{targetMonth}</p>
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest leading-none">
            Selected Pedagogical Objectives
          </label>
          <div className="flex flex-wrap gap-1 mt-1">
            {selectedTags && selectedTags.length > 0 ? (
              selectedTags.map((tag) => (
                <span
                  key={tag}
                  className="text-[8px] font-bold text-stone-605 bg-stone-50 border border-black/5 px-1.5 py-0.5 rounded-sm uppercase tracking-wide"
                >
                  {tag}
                </span>
              ))
            ) : (
              <span className="text-[10px] text-stone-400 font-sans italic">No objectives selected</span>
            )}
          </div>
        </div>
      </div>
      
      {/* Visual Workspace Image Preview */}
      {imageUrl ? (
        <div className="relative aspect-video rounded-md border border-black/5 overflow-hidden bg-[#FAF9F6] flex items-center justify-center">
          <img
            referrerPolicy="no-referrer"
            src={imageUrl}
            alt="Student Work Preview"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-sm text-[8px] font-mono text-white tracking-widest uppercase">
            Active Asset
          </div>
        </div>
      ) : (
        <div className="aspect-video rounded-md border border-dashed border-black/10 bg-[#FAF9F6] flex flex-col items-center justify-center text-center p-4">
          <ImageIcon className="w-5 h-5 text-stone-450 mb-1" />
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">No Work image available</span>
        </div>
      )}

      {/* API Submission Status Banner */}
      {statusMessage && (
        <div
          className={`p-3 rounded-md border text-xs flex items-start gap-2 ${
            statusMessage.type === "success"
              ? "bg-emerald-50/50 text-emerald-800 border-emerald-100"
              : "bg-amber-50/50 text-amber-800 border-amber-100"
          }`}
          id="pipeline-status-banner"
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          )}
          <span className="leading-relaxed font-sans font-medium">{statusMessage.text}</span>
        </div>
      )}

      {/* Trigger Button */}
      <button
        onClick={handleSubmitReport}
        disabled={isSubmitting || !imageUrl}
        className={`w-full py-2.5 px-4 rounded-md text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer ${
          isSubmitting
            ? "bg-stone-400 cursor-not-allowed"
            : "bg-slate-800 hover:bg-slate-850 active:scale-[0.98]"
        }`}
        id="commit-pipeline-btn"
      >
        {isSubmitting ? (
          <>
            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            AI Processing & Saving to DB...
          </>
        ) : (
          <>
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Generate Reflection & Commit Entry
          </>
        )}
      </button>

      {/* Display computed reflection entry committed to Supabase */}
      {savedArtifact && (
        <div className="p-3.5 bg-stone-50 border border-black/5 rounded-md text-xs space-y-1.5 animate-fadeIn" id="saved-artifact-view">
          <div className="flex items-center justify-between text-[9px] font-bold text-[#2A435D] uppercase tracking-wider">
            <span>Supabase Saved Copy</span>
            <span>Record ID: {savedArtifact.id || "Saved"}</span>
          </div>
          <p className="font-sans italic text-stone-705 leading-relaxed bg-white border border-black/5 p-2.5 rounded-sm">
            "{savedArtifact.ai_reflection}"
          </p>
        </div>
      )}
    </div>
  );
};
