// src/types.ts
// Shared TypeScript types for the Multi-Subject Learning Diary UI & Sandbox.

export interface WhiteLabelSchool {
  id: string;
  name: string;
  logoUrl: string | null;
  brandColor: string;
  logoEmoji: string; // fallback visual representation
  configuration: {
    graderSignature: string;
    targetAgeGroup: string;
    currencySymbol: string;
  };
}

export interface TeacherProfile {
  id: string;
  name: string;
  email: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  englishName: string;
  classId: string;
}

export interface SubjectModule {
  id: string;
  name: string;
  predefinedObjectives: string[];
}

export interface ArtifactItem {
  id: string;
  subjectId: string;
  imageUrl: string;
  imageAlt: string;
  teacherNotes: string;
  aiNarrative: string;
  tags: string[];
  gradedBy: string;
  createdAt: string;
}

export interface MonthlyReportPreview {
  meta: {
    reportGeneratedAt: string;
    targetMonth: string;
    schoolName: string;
    schoolBrandColor: string;
    schoolLogoUrl: string | null;
    schoolLogoEmoji: string;
    classroomName: string;
  };
  student: {
    id: string;
    name: string;
    englishName: string;
  };
  timeline: {
    subjectId: string;
    subjectName: string;
    learningObjectives: string[];
    artifacts: ArtifactItem[];
  }[];
  growthIndices: {
    vocabularySkills: number;
    grammaticalAccuracy: number;
    phonicsFluency: number;
    oralConfidence: number;
  };
}
