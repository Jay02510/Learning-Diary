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

export const translations = {
  en: {
    dashboardTitle: "Learning Diary Hub",
    selectStudent: "Select Student",
    selectSubject: "Select Subject",
    uploadWork: "Upload Student Work (Photo/Worksheet)",
    selectTags: "Select Core Skills Focused (Max 3)",
    generateButton: "Generate Commentary & Save",
    loadingText: "AI Processing & Saving...",
    downloadBtn: "Download Monthly Diary (PDF)",
    commentaryHeader: "Teacher's Commentary Preview:",
    academyProfile: "Academy Profile Setup"
  },
  ko: {
    dashboardTitle: "러닝 다이어리 관리 센터",
    selectStudent: "학생 선택",
    selectSubject: "과목 선택",
    uploadWork: "학생 작품 업로드 (활동 사진/워크시트)",
    selectTags: "집중 학습 영역 선택 (최대 3개)",
    generateButton: "AI 코멘트 생성 및 저장",
    loadingText: "AI 분석 및 저장 중...",
    downloadBtn: "월간 러닝 다이어리 다운로드 (PDF)",
    commentaryHeader: "선생님 코멘트 미리보기:",
    academyProfile: "학원 프로필 설정"
  }
};

export type Language = 'en' | 'ko';
