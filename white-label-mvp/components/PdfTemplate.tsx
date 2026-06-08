// white-label-mvp/components/PdfTemplate.tsx
// White-Label Configuration Engine & PDF Compilation layout.
// Built primarily for `@react-pdf/renderer` to compile multi-subject artifacts,
// dynamically inject custom brand coloring, insert school seals, and format page budgets safely.

import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// Register custom Korean-compatible fonts for academic rendering if needed.
// These typically match Noto Sans Web fonts or local system mappings in production.
Font.register({
  family: "Inter",
  src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf",
});

interface ArtifactPayload {
  id: string;
  imageUrl: string;
  teacherNotes: string;
  aiNarrative: string;
  tags: string[];
  gradedBy: string;
  createdAt: string;
}

interface SubjectPortfolio {
  subjectId: string;
  subjectName: string;
  learningObjectives: string[];
  artifacts: ArtifactPayload[];
}

interface PdfTemplateProps {
  brandColor: string; // Dynamic Hex color string (e.g. "#8B0000" or "#1E3A8A")
  logoUrl: string | null; // Dynamic school logo link parsed from UploadThing
  schoolName: string; // Dynamic school title string
  studentName: string; // Target student name (e.g., "Jin-Woo Kim")
  classroomName: string; // Classroom details (e.g., "Level 2Phonics")
  monthName: string; // Portolio Monthly Indicator
  timeline: SubjectPortfolio[]; // Collection of multi-subject aggregated active artifacts
  growthIndices: {
    vocabularySkills: number;
    grammaticalAccuracy: number;
    phonicsFluency: number;
    oralConfidence: number;
  };
}

/**
 * Main White-Label PDF Builder React Component compiling into standard print buffers.
 */
export const PdfTemplate: React.FC<PdfTemplateProps> = ({
  brandColor = "#1E3A8A",
  logoUrl,
  schoolName = "Global Prep ESL",
  studentName,
  classroomName,
  monthName,
  timeline,
  growthIndices,
}) => {
  // We dynamically generate the styles to inject school brand colors directly!
  const styles = StyleSheet.create({
    page: {
      fontFamily: "Inter",
      backgroundColor: "#FFFFFF",
      padding: 40,
      fontSize: 10,
      color: "#334155",
    },
    // COVER PAGE STYLING
    coverContainer: {
      flex: 1,
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 50,
      border: `8px solid ${brandColor}`, // Dynamic white-label frame
      borderRadius: 12,
    },
    schoolHeader: {
      alignItems: "center",
      marginTop: 20,
    },
    schoolLogo: {
      width: 80,
      height: 80,
      objectFit: "contain",
      marginBottom: 10,
    },
    schoolText: {
      fontSize: 14,
      fontWeight: "bold",
      color: "#1E293B",
      letterSpacing: 1.5,
    },
    titleSection: {
      alignItems: "center",
      marginVertical: 40,
    },
    badge: {
      backgroundColor: brandColor, // Applied Dynamic Brand Color
      color: "#FFFFFF",
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 20,
      fontSize: 8,
      letterSpacing: 2,
      marginBottom: 15,
      textTransform: "uppercase",
    },
    mainTitle: {
      fontSize: 32,
      fontWeight: "bold",
      color: "#0F172A",
      textAlign: "center",
    },
    subTitle: {
      fontSize: 16,
      color: "#64748B",
      marginTop: 5,
    },
    studentCard: {
      width: "80%",
      backgroundColor: "#F8FAFC",
      borderLeft: `5px solid ${brandColor}`, // Highlight strip
      padding: 15,
      borderRadius: 4,
      marginVertical: 30,
    },
    studentGrid: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginVertical: 4,
    },
    gridLabel: {
      color: "#64748B",
      fontSize: 8,
      textTransform: "uppercase",
    },
    gridValue: {
      fontWeight: "bold",
      color: "#1E293B",
      fontSize: 11,
    },
    footerLine: {
      borderTop: `1px solid #E2E8F0`,
      width: "80%",
      paddingTop: 15,
      alignItems: "center",
    },
    footerText: {
      fontSize: 8,
      color: "#94A3B8",
    },

    // SUBJECT EVIDENCE PAGES STYLING
    headerBlock: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: `2px solid ${brandColor}`,
      paddingBottom: 10,
      marginBottom: 20,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#0F172A",
    },
    headerMonth: {
      fontSize: 10,
      color: brandColor,
      fontWeight: "bold",
    },
    subjectHeader: {
      fontSize: 14,
      fontWeight: "bold",
      color: "#1E293B",
      backgroundColor: "#F1F5F9",
      padding: 6,
      borderRadius: 4,
      marginBottom: 12,
      borderLeft: `3px solid ${brandColor}`,
    },
    artifactGrid: {
      flexDirection: "row",
      marginBottom: 25,
      gap: 15,
    },
    artifactImageWrapper: {
      width: "45%",
      border: "1px solid #E2E8F0",
      borderRadius: 6,
      padding: 6,
      backgroundColor: "#F8FAFC",
    },
    artifactImage: {
      width: "100%",
      height: 160,
      objectFit: "cover",
      borderRadius: 4,
    },
    artifactContent: {
      width: "55%",
      justifyContent: "space-between",
    },
    tagContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 4,
      marginBottom: 8,
    },
    tagMeta: {
      backgroundColor: "#EEF2F6",
      color: "#475569",
      fontSize: 7,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 3,
      fontWeight: "medium",
    },
    teacherNotesQuote: {
      fontSize: 8,
      fontStyle: "italic",
      color: "#64748B",
      borderLeft: "2px solid #CBD5E1",
      paddingLeft: 8,
      marginVertical: 6,
    },
    narrativeText: {
      fontSize: 9.5,
      lineHeight: 1.4,
      color: "#334155",
      marginTop: 6,
    },
    metadataLine: {
      fontSize: 8,
      color: "#94A3B8",
      marginTop: 8,
      alignSelf: "flex-end",
    },

    // GROWTH TRACKER PAGE STYLING
    trackerGrid: {
      marginVertical: 20,
      gap: 15,
    },
    trackerRow: {
      marginBottom: 10,
    },
    metricLabelSec: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 4,
    },
    metricLabel: {
      fontSize: 11,
      fontWeight: "bold",
      color: "#1E293B",
    },
    metricPct: {
      fontSize: 11,
      fontWeight: "bold",
      color: brandColor,
    },
    barBg: {
      height: 12,
      backgroundColor: "#E2E8F0",
      borderRadius: 6,
      position: "relative",
      overflow: "hidden",
    },
    barFill: {
      height: "100%",
      backgroundColor: brandColor, // Applied Dynamic Brand Color
      borderRadius: 6,
    },
    academicInsights: {
      backgroundColor: "#F8FAFC",
      border: "1px dashed #E2E8F0",
      padding: 15,
      borderRadius: 6,
      marginTop: 20,
    },
    insightTitle: {
      fontSize: 12,
      fontWeight: "bold",
      color: "#0F172A",
      marginBottom: 5,
    },
    insightBody: {
      fontSize: 9,
      lineHeight: 1.4,
      color: "#475569",
    }
  });

  return (
    <Document>
      {/* ==================== PAGE 1: COVER PAGE ==================== */}
      <Page size="A4" style={styles.page}>
        <View style={styles.coverContainer}>
          {/* Logo Section */}
          <View style={styles.schoolHeader}>
            {logoUrl ? (
              <Image src={logoUrl} style={styles.schoolLogo} />
            ) : (
              <View style={[styles.schoolLogo, { backgroundColor: brandColor, borderRadius: 40 }]} />
            )}
            <Text style={styles.schoolText}>{schoolName}</Text>
          </View>

          {/* Core App Display Cover */}
          <View style={styles.titleSection}>
            <Text style={styles.badge}>Monthly Progress Report</Text>
            <Text style={styles.mainTitle}>Multi-Subject Learning Diary</Text>
            <Text style={styles.subTitle}>Pedagogical Portfolio</Text>
          </View>

          {/* Student White-label descriptive Metadata Card */}
          <View style={styles.studentCard}>
            <View style={styles.studentGrid}>
              <Text style={styles.gridLabel}>Student Name</Text>
              <Text style={styles.gridValue}>{studentName}</Text>
            </View>
            <View style={styles.studentGrid}>
              <Text style={styles.gridLabel}>Class Division</Text>
              <Text style={styles.gridValue}>{classroomName}</Text>
            </View>
            <View style={styles.studentGrid}>
              <Text style={styles.gridLabel}>Reporting Month</Text>
              <Text style={styles.gridValue}>{monthName}</Text>
            </View>
          </View>

          {/* Cover Footer */}
          <View style={styles.footerLine}>
            <Text style={styles.footerText}>
              Hakwon Management System (HMS) • Curated Autonomy Core Engine v1.0
            </Text>
          </View>
        </View>
      </Page>

      {/* ==================== PAGES 2+: STUDENT SUBJECT EVIDENCE (Aggregated streams) ==================== */}
      {/* 
        This dynamically aggregates the student's active subjects. If a subject is skipped 
        (has zero artifacts), the `@react-pdf/renderer` renderer completely skips it, 
        ensuring zero layout disruption or placeholder overhead.
      */}
      {timeline.map((subjectPort) => (
        <Page size="A4" key={subjectPort.subjectId} style={styles.page}>
          {/* Repeatable Running Header */}
          <View style={styles.headerBlock}>
            <Text style={styles.headerTitle}>{studentName}'s Portfolio</Text>
            <Text style={styles.headerMonth}>{monthName} ESL Record</Text>
          </View>

          {/* Subject Stream Label */}
          <Text style={styles.subjectHeader}>
            Subject Focus: {subjectPort.subjectName}
          </Text>

          {/* Map through anchor tasks for this specific subject */}
          {subjectPort.artifacts.map((artifact, idx) => (
            <View key={artifact.id} style={styles.artifactGrid}>
              {/* Evidence Box Column 1: Visual Artifact (Milestone image) */}
              <View style={styles.artifactImageWrapper}>
                <Image src={artifact.imageUrl} style={styles.artifactImage} />
              </View>

              {/* Narratives Column 2: Teacher annotations, Tag bundles, AI Narrative text */}
              <View style={styles.artifactContent}>
                <View>
                  <Text style={{ fontSize: 9, fontWeight: "bold", color: "#64748B", marginBottom: 4 }}>
                    Anchor Task {idx + 1} Metadata
                  </Text>
                  
                  {/* Applied Tag Badges */}
                  <View style={styles.tagContainer}>
                    {artifact.tags.map((tag) => (
                      <Text key={tag} style={styles.tagMeta}>
                        {tag}
                      </Text>
                    ))}
                  </View>

                  {/* Manual teacher observation notes */}
                  {artifact.teacherNotes && (
                    <View>
                      <Text style={{ fontSize: 7, color: "#94A3B8", textTransform: "uppercase", marginTop: 4 }}>
                        Observer Raw Notes (Translated context)
                      </Text>
                      <Text style={styles.teacherNotesQuote}>
                        "{artifact.teacherNotes}"
                      </Text>
                    </View>
                  )}

                  {/* Orchestrated AI Narrative for parents */}
                  <Text style={{ fontSize: 8, color: brandColor, fontWeight: "bold", textTransform: "uppercase", marginTop: 6, letterSpacing: 0.5 }}>
                    Pedagogical Evaluation (AI-Assisted Narrative)
                  </Text>
                  <Text style={styles.narrativeText}>
                    {artifact.aiNarrative}
                  </Text>
                </View>

                {/* Sub-footer signature row */}
                <Text style={styles.metadataLine}>
                  Assessed by T. {artifact.gradedBy} on {new Date(artifact.createdAt).toLocaleDateString()}
                </Text>
              </View>
            </View>
          ))}
        </Page>
      ))}

      {/* ==================== PAGE N: CORE ESL GROWTH TRACKER ==================== */}
      <Page size="A4" style={styles.page}>
        <View style={styles.headerBlock}>
          <Text style={styles.headerTitle}>{studentName}'s Metrics</Text>
          <Text style={styles.headerMonth}>{monthName} Growth Tracker</Text>
        </View>

        <Text style={styles.subjectHeader}>
          Holistic Proficiency Benchmarking (ESL Core Skillsets)
        </Text>

        <View style={styles.trackerGrid}>
          {/* Row 1: Phonics & Reading Fluency */}
          <View style={styles.trackerRow}>
            <View style={styles.metricLabelSec}>
              <Text style={styles.metricLabel}>Phonics Processing & Grapheme Decoding</Text>
              <Text style={styles.metricPct}>{growthIndices.phonicsFluency}%</Text>
            </View>
            <View style={styles.barBg}>
              <View style={[styles.barFill, { width: `${growthIndices.phonicsFluency}%` }]} />
            </View>
          </View>

          {/* Row 2: Grammatical Accuracy */}
          <View style={styles.trackerRow}>
            <View style={styles.metricLabelSec}>
              <Text style={styles.metricLabel}>Grammatical Accuracy & Active Composition</Text>
              <Text style={styles.metricPct}>{growthIndices.grammaticalAccuracy}%</Text>
            </View>
            <View style={styles.barBg}>
              <View style={[styles.barFill, { width: `${growthIndices.grammaticalAccuracy}%` }]} />
            </View>
          </View>

          {/* Row 3: Vocabulary & Lexical Retrieval */}
          <View style={styles.trackerRow}>
            <View style={styles.metricLabelSec}>
              <Text style={styles.metricLabel}>Vocabulary Expansion & Semantic Contextualization</Text>
              <Text style={styles.metricPct}>{growthIndices.vocabularySkills}%</Text>
            </View>
            <View style={styles.barBg}>
              <View style={[styles.barFill, { width: `${growthIndices.vocabularySkills}%` }]} />
            </View>
          </View>

          {/* Row 4: Oral Intonation & Pronunciation Confidence */}
          <View style={styles.trackerRow}>
            <View style={styles.metricLabelSec}>
              <Text style={styles.metricLabel}>Conversational Fluency & Pragmatic Intonation</Text>
              <Text style={styles.metricPct}>{growthIndices.oralConfidence}%</Text>
            </View>
            <View style={styles.barBg}>
              <View style={[styles.barFill, { width: `${growthIndices.oralConfidence}%` }]} />
            </View>
          </View>
        </View>

        {/* Dynamic White-Label signature or certificate summary box */}
        <View style={styles.academicInsights}>
          <Text style={styles.insightTitle}>Primary Architectural Notes</Text>
          <Text style={styles.insightBody}>
            This Growth Tracker page dynamically indexes the frequency of pedagogical objectives recorded inside weekly portfolio streams. Accumulating higher volumes of target tag assignments (e.g., active vocabulary selections) influences corresponding proficiency indexes. This dynamic pipeline provides private ESL academies and tutors with the high-fidelity representation they need for parent portfolios, eliminating high administrative teacher burnout.
          </Text>
        </View>
      </Page>
    </Document>
  );
};
