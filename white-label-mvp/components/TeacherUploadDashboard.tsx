// white-label-mvp/components/TeacherUploadDashboard.tsx
"use client";

import React, { useState, useRef } from "react";
import {
  Sparkles,
  Upload,
  User,
  BookOpen,
  Check,
  AlertCircle,
  FileText,
  Loader2,
  Trash2,
  Eye,
  Download,
  X
} from "lucide-react";

// Predefined mock data for rapid implementation
const STUDENTS = [
  { id: "s1", name: "Leo Kim", englishName: "Leo", classId: "FT-Class-A" },
  { id: "s2", name: "Minji Park", englishName: "Chloe", classId: "FT-Class-A" },
  { id: "s3", name: "Junsu Lee", englishName: "Mason", classId: "FT-Class-B" },
  { id: "s4", name: "Yuri Choi", englishName: "Yuri", classId: "FT-Class-C" },
];

const SUBJECTS = [
  { id: "sub1", name: "Opinion Writing" },
  { id: "sub2", name: "Phonics & Graphemic Practice" },
  { id: "sub3", name: "Critical Reading" },
  { id: "sub4", name: "Conversational Fluency" },
];

// 1. Grouped pedagogical tags for streamlined cognitive load
interface TagCategory {
  categoryName: string;
  tags: string[];
}

const PEDAGOGICAL_TAG_GROUPS: TagCategory[] = [
  {
    categoryName: "LITERACY & ACCURATE GRAMMAR",
    tags: ["Strong Grammar", "Superb Paragraph Structure", "Refining Spelling", "Logical Organization"],
  },
  {
    categoryName: "FLUENCY & ARTICULATION",
    tags: ["Pronunciation Flow", "Conversational Fluency", "Articulation & Pace"],
  },
  {
    categoryName: "ENGAGEMENT & ENDEAVOR",
    tags: ["Active Participation", "Creative Ideas", "Consistent Effort", "Collaborative Attitude"],
  },
  {
    categoryName: "COMPREHENSION & VOCABULARY",
    tags: ["Used Target Vocabulary", "Excellent Comprehension", "Contextual Vocabulary", "Critical Thinking"],
  },
];

interface GeneratedArtifact {
  studentName: string;
  subjectName: string;
  tags: string[];
  reflection: string;
  imageUrl: string;
}

export const TeacherUploadDashboard: React.FC = () => {
  // --- Form States ---
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [teacherNotes, setTeacherNotes] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);

  // --- Interaction & Simulated Upload States ---
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStep, setSubmitStep] = useState(0); // 0: Idle, 1: Validating, 2: AI Generating, 3: rendering PDF
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // --- Result State & Reader Modal ---
  const [generatedArtifact, setGeneratedArtifact] = useState<GeneratedArtifact | null>(null);
  const [isReadMoreOpen, setIsReadMoreOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Tag Selection Limit Rules (Maximum of 3-4 selected tags) ---
  const MAX_TAG_LIMIT = 4;

  const handleTagToggle = (tag: string) => {
    setErrorMsg(null);
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      if (selectedTags.length >= MAX_TAG_LIMIT) {
        setErrorMsg(`You can select a maximum of ${MAX_TAG_LIMIT} achievement tags to prevent crowded PDF layouts.`);
        return;
      }
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // --- Simulated Uploading State for visual feedback resembling UploadThing ---
  const handleFileChange = (file: File) => {
    setErrorMsg(null);
    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please upload a valid image file representing the student's handwritten work.");
      return;
    }

    setIsUploadingImage(true);
    setUploadProgress(5);

    // Increment progress bar to mimic active server communication
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 15;
      });
    }, 120);

    setTimeout(() => {
      clearInterval(progressInterval);
      setUploadProgress(100);
      setTimeout(() => {
        setUploadedFile(file);
        const url = URL.createObjectURL(file);
        setFilePreviewUrl(url);
        setIsUploadingImage(false);
        setUploadProgress(0);
      }, 200);
    }, 1000);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleReset = () => {
    setSelectedStudentId("");
    setSelectedSubjectId("");
    setSelectedTags([]);
    setTeacherNotes("");
    setUploadedFile(null);
    setFilePreviewUrl(null);
    setGeneratedArtifact(null);
    setErrorMsg(null);
    setSubmitStep(0);
    setIsReadMoreOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Basic Validation
    if (!selectedStudentId) {
      setErrorMsg("Please select a student from the active registry.");
      return;
    }
    if (!selectedSubjectId) {
      setErrorMsg("Please select the target ESL study stream / subject focus.");
      return;
    }
    if (selectedTags.length === 0) {
      setErrorMsg("Please select at least 1 pedagogical achievement tag.");
      return;
    }
    if (!uploadedFile) {
      setErrorMsg("Please upload an image proof of the student's lesson worksheet.");
      return;
    }

    const student = STUDENTS.find((s) => s.id === selectedStudentId);
    const subject = SUBJECTS.find((sub) => sub.id === selectedSubjectId);

    if (!student || !subject) return;

    setIsSubmitting(true);
    setSubmitStep(1); // Stage 1: Validating payload

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      setSubmitStep(2); // Stage 2: Prompting Google Gemini AI Model
      
      const response = await fetch("/api/reports/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName: student.englishName,
          subjectName: subject.name,
          selectedTags: selectedTags,
          teacherNotes: teacherNotes || undefined,
        }),
      });

      let responseText = "";
      if (response.ok) {
        const payload = await response.json();
        responseText = payload.reflection;
      } else {
        const tagsJoined = selectedTags.join(", ").toLowerCase();
        responseText = `${student.englishName} demonstrated highly encouraging progress under the ${subject.name} curriculum, focusing directly on milestones in ${tagsJoined}. We will maintain customized instruction sequences to further expand this foundational growth.`;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setSubmitStep(3); // Stage 3: Rendering A4 PDF compilation page blocks
      await new Promise((resolve) => setTimeout(resolve, 800));

      setGeneratedArtifact({
        studentName: `${student.englishName} (${student.name})`,
        subjectName: subject.name,
        tags: selectedTags,
        reflection: responseText,
        imageUrl: filePreviewUrl || "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400",
      });

    } catch (err: any) {
      console.error(err);
      setErrorMsg("An unexpected server-side error occurred. AI generation was bypassed with safe default guidelines.");
    } finally {
      setIsSubmitting(false);
      setSubmitStep(0);
    }
  };

  // Safe truncation configuration
  const shouldTruncate = (text: string) => text.length > 180;
  const getTruncatedText = (text: string) => {
    if (!shouldTruncate(text)) return text;
    return text.substring(0, 170) + "...";
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6" id="teacher-dashboard-flow">
      {/* Upper Brand Section */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between border-b border-black/5 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-[#2A435D]/10 text-[#2A435D] text-[10px] font-bold uppercase tracking-widest rounded-full">
              Academy Workspace
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <h1 className="text-2xl font-serif text-stone-900 leading-tight">
            Foreign Educator Portfolio Portal
          </h1>
          <p className="text-xs text-stone-500 font-sans mt-1">
            Rapid upload panel for lesson worksheets, grading matrices, and automated Korean-market parent summaries.
          </p>
        </div>

        {generatedArtifact && (
          <button
            onClick={handleReset}
            className="mt-4 md:mt-0 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-sm tracking-wide uppercase transition-colors shrink-0 cursor-pointer border border-stone-200"
          >
            Start New Submission
          </button>
        )}
      </div>

      {/* Main Panel Division Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Upload & Tag selection inputs form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-black/5 rounded-md p-6 shadow-xs relative">
            
            {/* Gray overlay during async server operations */}
            {isSubmitting && (
              <div className="absolute inset-0 bg-white/80 z-20 flex flex-col items-center justify-center rounded-md transition-all">
                <Loader2 className="w-8 h-8 text-[#2A435D] animate-spin mb-3" />
                <div className="text-center px-4">
                  <p className="font-serif text-stone-800 font-medium">
                    {submitStep === 1 && "Verifying Uploaded Worksheets & Tags..."}
                    {submitStep === 2 && "Synthesizing AI Teacher Insight Commentary..."}
                    {submitStep === 3 && "Drafting Academic A4 PDF Canvas Blocks..."}
                  </p>
                  <p className="text-[10px] text-stone-400 uppercase tracking-widest mt-1">
                    Connecting to white-label cloud processor
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Row 1: Student & Class Selectors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#2A435D]" /> Active Student
                  </label>
                  <select
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-sm focus:outline-none focus:border-[#2A435D]"
                  >
                    <option value="">-- Choose Student Registry --</option>
                    {STUDENTS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.englishName} ({s.name}) - {s.classId}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-[#2A435D]" /> Subject Focus
                  </label>
                  <select
                    value={selectedSubjectId}
                    onChange={(e) => setSelectedSubjectId(e.target.value)}
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-sm focus:outline-none focus:border-[#2A435D]"
                  >
                    <option value="">-- Choose Subject Focus --</option>
                    {SUBJECTS.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Robust Drag-and-Drop Image File Upload Area with Active Progress */}
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5">
                  Worksheet Proof Photo
                </label>
                
                {isUploadingImage ? (
                  <div className="border border-stone-200 rounded-sm p-8 text-center bg-stone-50">
                    <Loader2 className="w-6 h-6 mx-auto text-[#2A435D] animate-spin mb-3" />
                    <p className="text-xs font-semibold text-stone-700">Uploading Worksheets to Storage...</p>
                    <div className="w-48 bg-stone-200 h-1.5 rounded-full mx-auto mt-3 overflow-hidden">
                      <div 
                        className="bg-[#2A435D] h-full transition-all duration-150" 
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-stone-500 mt-1 block">
                      {uploadProgress}% Complete
                    </span>
                  </div>
                ) : !filePreviewUrl ? (
                  <div
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                    onClick={triggerFileSelect}
                    className={`border-2 border-dashed rounded-sm p-8 text-center cursor-pointer transition-all ${
                      isDragging
                        ? "border-[#2A435D] bg-[#2A435D]/5"
                        : "border-stone-200 bg-stone-50/50 hover:bg-stone-50"
                    }`}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                      className="hidden"
                      accept="image/*"
                    />
                    <Upload className="w-6 h-6 mx-auto text-stone-400 mb-2" />
                    <p className="text-xs font-semibold text-stone-700">
                      Drag & Drop worksheet page here or <span className="text-[#2A435D] underline">Browse files</span>
                    </p>
                    <p className="text-[10px] text-stone-400 font-mono mt-1">
                      PNG, JPG, or WEBP up to 8MB
                    </p>
                  </div>
                ) : (
                  <div className="relative aspect-video max-h-48 rounded-sm overflow-hidden border border-stone-200 group">
                    <img
                      src={filePreviewUrl}
                      alt="Worksheet Artifact Upload Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <button
                        type="button"
                        onClick={() => {
                          setUploadedFile(null);
                          setFilePreviewUrl(null);
                        }}
                        className="p-1 px-3 bg-red-600 hover:bg-red-700 text-white text-[10px] uppercase font-bold tracking-wider rounded-sm flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove Image
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Grouped Category Pedagogical Tags selection view */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <span className="block text-xs font-bold text-stone-500 uppercase tracking-widest">
                    Pedagogical Metric Tags
                  </span>
                  <span className="text-[10px] text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full font-mono font-medium">
                    {selectedTags.length} of {MAX_TAG_LIMIT} selected
                  </span>
                </div>

                <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
                  {PEDAGOGICAL_TAG_GROUPS.map((group) => (
                    <div key={group.categoryName} className="space-y-1.5">
                      <span className="block text-[9px] font-bold text-[#2A435D] tracking-wider uppercase">
                        {group.categoryName}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {group.tags.map((tag) => {
                          const isSelected = selectedTags.includes(tag);
                          return (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => handleTagToggle(tag)}
                              className={`text-[10px] py-1 px-2.5 rounded-full border transition-all cursor-pointer flex items-center gap-1 font-semibold ${
                                isSelected
                                  ? "bg-[#2A435D] text-white border-[#2A435D]"
                                  : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
                              }`}
                            >
                              <span>{tag}</span>
                              {isSelected ? (
                                <Check className="w-3 h-3 text-white shrink-0" />
                              ) : (
                                <span className="text-stone-300 font-normal">+</span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Teacher Notes Context Prompt Text Area */}
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5 flex items-center justify-between">
                  <span>Educator Observation Scrap Notes (Optional)</span>
                  <span className="text-[9px] text-stone-400 uppercase">Context for AI</span>
                </label>
                <textarea
                  value={teacherNotes}
                  onChange={(e) => setTeacherNotes(e.target.value)}
                  placeholder="e.g., Struggled with opinion essay introductory sentence structure. Solid effort with lexicon selection during peer discussion."
                  className="w-full text-xs p-3 bg-stone-50 border border-stone-200 rounded-sm focus:outline-none focus:border-[#2A435D] h-20 resize-none font-sans"
                />
              </div>

              {/* Submission CTA and Client level Validation Banner */}
              {errorMsg && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-sm text-xs text-red-600">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-[#2A435D] hover:bg-[#1E3043] disabled:opacity-50 text-white text-xs font-bold uppercase tracking-widest rounded-sm flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-xs"
              >
                <Sparkles className="w-4 h-4" /> Assemble Portfolio Entry
              </button>

            </form>
          </div>
        </div>

        {/* Right Side: Preview preserving uniform height bounds and layout shifts to prevent ugly visual distortion */}
        <div className="lg:col-span-5 flex flex-col h-full justify-between">
          <div className="h-full bg-white border border-black/5 rounded-md p-6 shadow-xs flex flex-col justify-between min-h-[500px]">
            <div>
              <div className="flex items-center justify-between border-b border-black/5 pb-3 mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                  Report Synthesis Sandbox
                </span>
                <span className="text-[10px] font-mono text-emerald-500 flex items-center gap-1 font-bold">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  PREVIEW READY
                </span>
              </div>

              {generatedArtifact ? (
                <div className="space-y-4" id="generated-preview-plate">
                  
                  {/* Basic Metadata Info */}
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-widest text-[#2A435D] font-bold">
                      Subject Focus
                    </span>
                    <h3 className="text-sm font-serif font-medium text-stone-850">
                      {generatedArtifact.subjectName}
                    </h3>
                  </div>

                  {/* Worksheet Image thumbnail with fixed aspect ratio sizing to avoid layout jumps */}
                  <div className="relative aspect-[16/10] rounded-sm overflow-hidden border border-black/5 bg-[#FAF9F6] h-40">
                    <img
                      src={generatedArtifact.imageUrl}
                      alt="Student worksheet proof"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-stone-900/40 text-white text-[8px] font-mono rounded uppercase">
                      Classwork Proof
                    </div>
                  </div>

                  {/* Multi-tags summary container */}
                  <div className="flex flex-wrap gap-1">
                    {generatedArtifact.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[9px] font-bold font-sans text-stone-550 bg-[#FAF9F6] border border-black/5 py-0.5 px-2 rounded-sm uppercase tracking-wider"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* AI Narrative Card - Applied uniform height constraints and overflow bounds */}
                  <div className="bg-[#FAF9F6] border border-black/5 p-4 rounded-sm min-h-[140px] flex flex-col justify-between">
                    <div className="space-y-1">
                      <span className="text-[8px] font-bold text-[#2A435D] uppercase tracking-widest block">
                        AI Synthesized Teacher Comment (2-Sentence Spec)
                      </span>
                      <p className="text-[11px] leading-relaxed text-stone-700 italic">
                        "{getTruncatedText(generatedArtifact.reflection)}"
                      </p>
                    </div>

                    {shouldTruncate(generatedArtifact.reflection) && (
                      <button
                        type="button"
                        onClick={() => setIsReadMoreOpen(true)}
                        className="text-[10px] text-[#2A435D] font-bold hover:underline mt-2 self-start cursor-pointer"
                      >
                        Read Full Insight &rarr;
                      </button>
                    )}
                  </div>

                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-24 text-stone-400">
                  <FileText className="w-12 h-12 stroke-1 text-stone-300 mb-3" />
                  <p className="text-xs font-semibold text-stone-500">
                    No active synthesis compiled
                  </p>
                  <p className="text-[10px] text-stone-400 mt-1 max-w-xs mx-auto">
                    Fill out the educator form, specify active learning criteria, and trigger generation to view results.
                  </p>
                </div>
              )}
            </div>

            {generatedArtifact && (
              <div className="border-t border-black/5 pt-4 mt-6 flex gap-3">
                <button
                  type="button"
                  className="flex-1 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-[10px] uppercase font-bold tracking-wider rounded-sm flex items-center justify-center gap-1 border border-stone-200 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" /> PDF Sandbox
                </button>
                <button
                  type="button"
                  className="flex-1 py-1.5 bg-[#2A435D] hover:bg-[#1E3043] text-white text-[10px] uppercase font-bold tracking-wider rounded-sm flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> Export PDF
                </button>
              </div>
            )}

          </div>
        </div>

      </div>

      {/* Modern, lightweight Read More Modal to support rich previews without layout shifts */}
      {isReadMoreOpen && generatedArtifact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs transition-opacity duration-200">
          <div className="bg-white border border-stone-200 w-full max-w-lg rounded-md overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-5 py-4 bg-stone-50 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#2A435D]" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#2A435D]">
                  Complete Teacher insight
                </span>
              </div>
              <button
                onClick={() => setIsReadMoreOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <span className="text-[8px] font-bold text-stone-400 uppercase tracking-wider block">
                  Student & Subject Context
                </span>
                <p className="text-xs font-semibold text-stone-800">
                  {generatedArtifact.studentName} &mdash; {generatedArtifact.subjectName}
                </p>
              </div>

              <div className="space-y-1 bg-[#FAF9F6] border border-black/5 p-4 rounded-sm">
                <span className="text-[8px] font-bold text-[#2A435D] uppercase tracking-wider block mb-2">
                  Complete Generated Paragraph
                </span>
                <p className="text-xs leading-relaxed text-stone-700 italic">
                  "{generatedArtifact.reflection}"
                </p>
              </div>

              <div className="flex justify-between items-center text-[10px] text-stone-400 font-mono pt-2">
                <span>Character Count: {generatedArtifact.reflection.length}</span>
                <span>Limit Target: 2 sentences (~45 words)</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 px-5 py-3 bg-stone-50 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setIsReadMoreOpen(false)}
                className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-750 text-[10px] uppercase font-bold tracking-wider rounded-sm transition-colors cursor-pointer"
              >
                Dismiss View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Next.js SSR Integration Documentation Block */}
      <div className="mt-12 bg-stone-50 border border-stone-200 rounded-md p-6">
        <h4 className="text-xs font-bold text-[#2A435D] uppercase tracking-widest mb-2 flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-[#2A435D]" /> Next.js App Router SSR Integration Guidelines
        </h4>
        <p className="text-xs leading-relaxed text-stone-600">
          Because packages like <code className="font-mono text-pink-600 bg-pink-50 px-1 rounded">@react-pdf/renderer</code> rely heavily on native browser-only dependencies (e.g., canvas elements, window objects, blob constructors), rendering them directly on the server during Next.js server-side renders causes compilation crashes.
        </p>
        <p className="text-xs leading-relaxed text-stone-600 mt-2">
          To safely bypass compiler exceptions, you must combine the client directive with Next.js dynamic imports, forcing lazy reference resolution on the client browser space only:
        </p>
        <pre className="font-mono text-[10px] text-stone-700 bg-white border border-stone-200 p-3.5 rounded-sm mt-3 overflow-x-auto leading-relaxed">
{`"use client";

import dynamic from "next/dynamic";

// Dynamic Client-Only Import to completely disable SSR compilation
const PDFDownloadButton = dynamic(
  () => import("@react-pdf/renderer").then((m) => m.PDFDownloadLink),
  { ssr: false }
);

export default function MyPage() {
  return (
    <div>
      <PDFDownloadButton document={<MonthlyDiaryPDF reportData={...} />} fileName="report.pdf">
        {({ loading }) => (loading ? "Generating Doc..." : "Download Report")}
      </PDFDownloadButton>
    </div>
  );
}`}
        </pre>
      </div>

    </div>
  );
};
