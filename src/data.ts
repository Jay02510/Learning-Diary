// src/data.ts
// Sandbox preset data for the Korean ESL academy markets.

import { WhiteLabelSchool, StudentProfile, SubjectModule, ArtifactItem } from "./types";

export const PRESET_SCHOOLS: WhiteLabelSchool[] = [
  {
    id: "school-seoul-prep",
    name: "Seoul International Prep Academy",
    logoUrl: null,
    brandColor: "#7F1D1D", // Burgundy Crimson
    logoEmoji: "🏰",
    configuration: {
      graderSignature: "Director H. J. Yang",
      targetAgeGroup: "Elementary (G1-G6)",
      currencySymbol: "₩",
    },
  },
  {
    id: "school-maple-kids",
    name: "Maple Bilingual Immersion Center",
    logoUrl: null,
    brandColor: "#0D9488", // Teal Ocean
    logoEmoji: "🍁",
    configuration: {
      graderSignature: "Lead Mentor Chloe Miller",
      targetAgeGroup: "Kindergarten & Lower Prim",
      currencySymbol: "₩",
    },
  },
  {
    id: "school-gyeonggi-prep",
    name: "Elite Scholar Academics Gyeonggi",
    logoUrl: null,
    brandColor: "#1E3A8A", // Royal Navy Blue
    logoEmoji: "🎖️",
    configuration: {
      graderSignature: "Dean Benjamin Vance",
      targetAgeGroup: "Middle School Prep (G5-G9)",
      currencySymbol: "₩",
    },
  },
];

export const PRESET_STUDENTS: StudentProfile[] = [
  {
    id: "student-jinwoo",
    name: "김진우",
    englishName: "Jin-Woo Kim (Leo)",
    classId: "Phonics Core Tier 2A",
  },
  {
    id: "student-seoyeon",
    name: "박서연",
    englishName: "Seo-Yeon Park (Chloe)",
    classId: "Creative Literacy Level 3",
  },
  {
    id: "student-yejun",
    name: "최예준",
    englishName: "Ye-Jun Choi (Ian)",
    classId: "Socratic Debate Honors",
  },
];

export const PRESET_SUBJECTS: SubjectModule[] = [
  {
    id: "sub-phonics",
    name: "Phonics Foundational",
    predefinedObjectives: [
      "Short-o Graphemes",
      "Consonant Blend Speed",
      "CVC Spelled Structures",
      "Syllabic Voweling",
      "Sight Word Automation",
    ],
  },
  {
    id: "sub-creative-writing",
    name: "Creative Essay Writing",
    predefinedObjectives: [
      "Punctuation Boundary",
      "Noun-Verb Concordance",
      "Modifier Placement",
      "Expressive Metaphor",
      "Adverbial Context",
    ],
  },
  {
    id: "sub-public-speaking",
    name: "Speech & Presentation",
    predefinedObjectives: [
      "Vocal Projection Rate",
      "Consonant Intonation",
      "Audience Eye Engagement",
      "Dynamic Rhetoric",
      "Oral Pitch Inflection",
    ],
  },
  {
    id: "sub-reading-comprehension",
    name: "Reading Comprehension",
    predefinedObjectives: [
      "Literal Recall Efficiency",
      "Inferential Character Analysis",
      "Chronological Sequence",
      "New Lexicon Deductions",
      "Main Idea Synthesizing",
    ],
  },
];

// High-fidelity starter artifacts simulating months of curated curriculum progress
export const INITIAL_ARTIFACTS: ArtifactItem[] = [
  {
    id: "art-phonics-1",
    subjectId: "sub-phonics",
    imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=600",
    imageAlt: "Phonics worksheet",
    teacherNotes: "Jin-Woo demonstrated near-perfect decoding of the short-o flashcards. Scored 18/20 on spelling test with high speed.",
    aiNarrative: "Leaps in phonetic automation were demonstrated by Leo this month. Leo practiced identifying target short-vowel sounds under CVC (Consonant-Vowel-Consonant) blends, resolving phonics matching grids with minimal adult scaffolding. Our focuses will remain targeting word-ending spelling blends to secure continuous written confidence.",
    tags: ["Short-o Graphemes", "CVC Spelled Structures", "Sight Word Automation"],
    gradedBy: "Sarah Jenkins",
    createdAt: "2026-06-03T10:00:00Z",
  },
  {
    id: "art-writing-1",
    subjectId: "sub-creative-writing",
    imageUrl: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=600",
    imageAlt: "Creative essay journal",
    teacherNotes: "Excellent grammar in the animal world paragraph! Capitalization borders and periods are fully consistent. Good details.",
    aiNarrative: "Leo expressed extraordinary creativity writing detailed accounts of rainforest ecosystems! He displayed solid syntax construction, maintaining strict capitalization limits and period placements throughout. We have introduced transitional sentence sequencing to link sequential claims smoothly.",
    tags: ["Punctuation Boundary", "Noun-Verb Concordance", "Expressive Metaphor"],
    gradedBy: "Andrew Thompson",
    createdAt: "2026-06-05T14:30:00Z",
  },
  {
    id: "art-speech-1",
    subjectId: "sub-public-speaking",
    imageUrl: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=600",
    imageAlt: "Student presenting with slide board",
    teacherNotes: "Extremely loud projection! Proudly shared his presentation. Eyes were a bit focused on the slides; minor posture guidance next.",
    aiNarrative: "Leo presented his weekend outline with magnificent vocal presence! During the question-and-answer exchange, his articulation was superb, selecting newly acquired vocabulary accurately. Our priority next period is sustaining strong shoulder postures and continuous audience sweep patterns.",
    tags: ["Vocal Projection Rate", "Audience Eye Engagement", "Consonant Intonation"],
    gradedBy: "Andrew Thompson",
    createdAt: "2026-06-08T09:15:00Z",
  },
];
