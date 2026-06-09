export type Language = "en" | "ko";

export const translations = {
  en: {
    dashboardTitle: "Teacher Feedback Portal",
    selectStudent: "Select Student (학생 선택)",
    selectSubject: "Select Subject Module (학습 과목 선택)",
    uploadWork: "Student Learning Artifact (학생 활동 사진 / 워크시트)",
    selectTags: "Select Pedagogy & Goal Tags (교육 목적 태그 선택 - 최소 1개)",
    generateButton: "Generate & Save Portfolio (생성 및 저장)",
    loadingStates: [
      "Analyzing pedagogical tags...",
      "Drafting Teacher Commentary...",
      "Saving to Student Profile..."
    ],
    validationAlert: "All fields are required. Select a student, subject, image, and at least 1 tag.",
    tagWordAssociations: "Word Associations (단어 연상)",
    tagSegmentingDrills: "Segmenting Drills (분절 훈련)",
    tagConsonantDiagraphs: "Consonant Digraphs (자음 이중음)",
    tagSightWords: "Sight Words (기초 시각 단어)",
    tagPhoneticAwareness: "Phonetic Awareness (음소 인식)",
    tagActiveOralSpeech: "Active Oral Speech (적극적 구어 구사)",
    placeholderImage: "Click or drag/drop student's homework sheet to assign",
    successMsg: "Student growth commentary has been successfully generated and compiled to Supabase!",
  },
  ko: {
    dashboardTitle: "교사 러닝 다이어리 피드백 포털",
    selectStudent: "학생 선택",
    selectSubject: "학습 과목 선택",
    uploadWork: "학생 작품 업로드 (활동 사진/워크시트)",
    selectTags: "수업 목표 및 성취 태그 선택 (최소 1개 최대 3개)",
    generateButton: "AI 코멘트 생성 및 저장",
    loadingStates: [
      "교육적 태그 분석 중...",
      "선생님 영문 피드백 초안 작성 중...",
      "학생 프로필에 저장 중..."
    ],
    validationAlert: "모든 필드를 입력해야 합니다: 학생, 과목, 이미지 링크, 그리고 최소 1개의 태그를 선택하세요.",
    tagWordAssociations: "단어 연상 (Word Associations)",
    tagSegmentingDrills: "분절 훈련 (Segmenting Drills)",
    tagConsonantDiagraphs: "자음 이중음 (Consonant Digraphs)",
    tagSightWords: "기초 시각 단어 (Sight Words)",
    tagPhoneticAwareness: "음소 인식 (Phonetic Awareness)",
    tagActiveOralSpeech: "적극적 구어 구사 (Active Oral Speech)",
    placeholderImage: "마우스로 이미지 파일을 끌어놓거나 클릭하여 할당하세요",
    successMsg: "학생 발달 코멘트가 성공적으로 생성되어 Supabase 데이터베이스에 완벽하게 저장되었습니다!",
  }
};
