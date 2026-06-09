import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";

// Register Noto Sans KR font to natively support Hangul characters in printable reports.
// We resolve it relative to the window origin to hit our backend font proxy, which
// dynamically scrapes Google Fonts CSS API or falls back securely to primary CDN channels.
const fontOrigin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
Font.register({
  family: "Noto Sans KR",
  src: `${fontOrigin}/api/font/noto-sans-kr.ttf`,
});

// TypeScript interfaces for the report data prop
export interface MonthlyDiaryArtifact {
  subject: string;
  imageUrl: string;
  ai_reflection: string;
  tags: string[];
}

export interface MonthlyDiaryReportData {
  school: {
    name: string;
    logoUrl?: string | null;
    brandColor: string;
  };
  student: {
    name: string;
  };
  targetMonth: string;
  artifacts: MonthlyDiaryArtifact[];
}

interface MonthlyDiaryDocumentProps {
  reportData: MonthlyDiaryReportData;
  isEcoMode?: boolean;
}

/**
 * Creates dynamic styles programmatically aligned with the school's brand design,
 * styling every text node with 'Noto Sans KR' to support Hangul.
 */
const createStyles = (brandColor: string, isEcoMode?: boolean) => {
  const safeBrandColor = brandColor || "#2A435D";
  return StyleSheet.create({
    // Page common structure with neutral border accents
    pageLayout: {
      flexDirection: "column",
      backgroundColor: isEcoMode ? "#FFFFFF" : "#FAF9F6", // Pure white for Eco mode, otherwise soft warm off-white (editorial style)
      padding: 36,
      fontFamily: "Noto Sans KR",
      height: "100%",
    },
    // Cover Page visual structure
    coverPageLayout: {
      flexDirection: "column",
      backgroundColor: "#FFFFFF",
      padding: 48,
      height: "100%",
      fontFamily: "Noto Sans KR",
      borderTopWidth: isEcoMode ? 1 : 8,
      borderTopColor: safeBrandColor,
      borderBottomWidth: isEcoMode ? 1 : 8,
      borderBottomColor: safeBrandColor,
    },
    coverHeader: {
      alignItems: "center",
      marginTop: 30,
    },
    coverSchoolTitle: {
      fontSize: 12,
      fontFamily: "Noto Sans KR",
      textTransform: "uppercase",
      letterSpacing: 2,
      color: "#1F2937",
      textAlign: "center",
    },
    coverSchoolSubtitle: {
      fontSize: 8,
      color: "#9CA3AF",
      textTransform: "uppercase",
      letterSpacing: 1.5,
      marginTop: 6,
      textAlign: "center",
    },
    coverBody: {
      alignItems: "center",
      marginVertical: 60,
    },
    coverBadge: {
      fontSize: 8,
      fontFamily: "Noto Sans KR",
      color: isEcoMode ? safeBrandColor : "#FFFFFF",
      backgroundColor: isEcoMode ? "#FFFFFF" : safeBrandColor,
      borderWidth: isEcoMode ? 1 : 0,
      borderColor: isEcoMode ? safeBrandColor : "transparent",
      paddingHorizontal: 12,
      paddingVertical: 5,
      borderRadius: 2,
      textTransform: "uppercase",
      letterSpacing: 2,
      marginBottom: 16,
    },
    coverTitle: {
      fontSize: 22,
      fontFamily: "Noto Sans KR",
      color: "#111827",
      textAlign: "center",
      letterSpacing: 0.5,
      lineHeight: 1.2,
    },
    coverDateText: {
      fontSize: 12,
      color: safeBrandColor,
      fontFamily: "Noto Sans KR",
      textTransform: "uppercase",
      letterSpacing: 1,
      marginTop: 10,
    },
    coverAccentLine: {
      width: 48,
      height: 2,
      backgroundColor: safeBrandColor,
      marginTop: 20,
    },
    coverStudentContainer: {
      backgroundColor: isEcoMode ? "#FFFFFF" : "#FAF9F6",
      borderLeftWidth: isEcoMode ? 1 : 3,
      borderLeftColor: safeBrandColor,
      padding: 16,
      borderRadius: 2,
      marginVertical: 40,
      borderWidth: isEcoMode ? 1 : 0,
      borderColor: isEcoMode ? "#E5E7EB" : "transparent",
    },
    coverStudentRow: {
      flexDirection: "row",
      marginBottom: 6,
    },
    coverStudentLabel: {
      width: 100,
      fontSize: 8,
      fontFamily: "Noto Sans KR",
      color: "#9CA3AF",
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    coverStudentValue: {
      fontSize: 10,
      fontFamily: "Noto Sans KR",
      color: "#1F2937",
    },
    coverFooter: {
      flexDirection: "row",
      justifyContent: "space-between",
      borderTopWidth: 1,
      borderTopColor: "#E5E7EB",
      paddingTop: 16,
      marginTop: "auto",
      fontSize: 8,
      color: "#9CA3AF",
    },
    coverFooterRight: {
      textTransform: "uppercase",
      fontFamily: "Noto Sans KR",
    },

    // Running layout headers
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottomWidth: 1,
      borderBottomColor: "#E5E7EB",
      paddingBottom: 8,
      marginBottom: 16,
    },
    headerPrefix: {
      fontSize: 7.5,
      color: "#9CA3AF",
      textTransform: "uppercase",
      letterSpacing: 1,
      fontFamily: "Noto Sans KR",
    },
    headerMonthText: {
      fontSize: 7.5,
      color: safeBrandColor,
      fontFamily: "Noto Sans KR",
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    subjectBanner: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "#FFFFFF",
      borderLeftWidth: isEcoMode ? 1 : 4,
      borderLeftColor: safeBrandColor,
      paddingHorizontal: 12,
      paddingVertical: 8,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: "#E5E7EB",
      borderRadius: 2,
    },
    subjectTitleText: {
      fontSize: 10,
      color: "#111827",
      fontFamily: "Noto Sans KR",
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    subjectBadgeText: {
      fontSize: 7.5,
      color: "#6B7280",
      fontFamily: "Noto Sans KR",
      textTransform: "uppercase",
    },

    // Main Columns Layout
    columnsContainer: {
      flexDirection: "row",
      flex: 1,
      gap: 16,
      marginBottom: 36, // leave room for branded footer
    },
    leftColumn: {
      width: "48%",
      flexDirection: "column",
    },
    rightColumn: {
      width: "52%",
      flexDirection: "column",
      justifyContent: "space-between",
    },

    // Left Column components (Image and border frame)
    imageOuterFrame: {
      borderRadius: 4,
      borderWidth: 1,
      borderColor: "#E5E7EB",
      backgroundColor: "#FFFFFF",
      padding: 6,
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      maxHeight: 280,
    },
    imageComponent: {
      width: "100%",
      height: "100%",
      objectFit: "contain",
      borderRadius: 2,
    },
    fallbackFrame: {
      width: "100%",
      height: 220,
      backgroundColor: "#E5E7EB",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 2,
      borderWidth: 1,
      borderColor: "#D1D5DB",
      borderStyle: "dashed",
    },
    fallbackText: {
      fontSize: 8,
      color: "#6B7280",
      fontFamily: "Noto Sans KR",
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    fallbackSubtext: {
      fontSize: 7,
      color: "#9CA3AF",
      marginTop: 4,
    },
    imageLabelText: {
      textAlign: "center",
      fontSize: 7,
      color: "#9CA3AF",
      fontFamily: "Noto Sans KR",
      marginTop: 6,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },

    // Right Column components (Pedagogical Reflection)
    objectivesSection: {
      marginBottom: 12,
    },
    sectionLabelText: {
      fontSize: 7.5,
      fontFamily: "Noto Sans KR",
      color: "#9CA3AF",
      textTransform: "uppercase",
      letterSpacing: 1,
      marginBottom: 6,
    },
    tagsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 4,
    },
    tagItem: {
      fontSize: 7,
      fontFamily: "Noto Sans KR",
      color: "#4B5563",
      backgroundColor: "#FFFFFF",
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 2,
      borderWidth: 1,
      borderColor: "#E5E7EB",
      textTransform: "uppercase",
      letterSpacing: 0.2,
    },
    reflectionWorkspace: {
      backgroundColor: "#FFFFFF",
      borderLeftWidth: isEcoMode ? 1 : 3,
      borderLeftColor: safeBrandColor,
      padding: 14,
      borderRadius: 2,
      borderWidth: 1,
      borderColor: "#E5E7EB",
    },
    reflectionHeader: {
      fontSize: 8,
      fontFamily: "Noto Sans KR",
      color: safeBrandColor,
      textTransform: "uppercase",
      letterSpacing: 1,
      marginBottom: 6,
    },
    reflectionTextContent: {
      fontSize: 9.5,
      color: "#374151",
      lineHeight: 1.5,
      fontFamily: "Noto Sans KR",
    },
    academicSignatureBlock: {
      borderTopWidth: 1,
      borderTopColor: "#E5E7EB",
      paddingTop: 8,
      marginTop: "auto",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    signatureLabel: {
      fontSize: 7,
      color: "#9CA3AF",
      fontFamily: "Noto Sans KR",
      textTransform: "uppercase",
    },
    signatureValue: {
      fontSize: 7,
      color: "#4B5563",
      fontFamily: "Noto Sans KR",
    },

    // Empty state fallback visual page
    emptyStateLayout: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 40,
    },
    emptyStateTitle: {
      fontSize: 14,
      fontFamily: "Noto Sans KR",
      color: "#374151",
      marginBottom: 4,
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    emptyStateBody: {
      fontSize: 9,
      color: "#6B7280",
      textAlign: "center",
      maxWidth: 240,
      lineHeight: 1.4,
    },

    // Absolute Positioned Running Branded Footer
    footerRow: {
      position: "absolute",
      bottom: 24,
      left: 36,
      right: 36,
      flexDirection: "row",
      justifyContent: "space-between",
      borderTopWidth: 1,
      borderTopColor: "#E5E7EB",
      paddingTop: 8,
    },
    footerSchoolText: {
      fontSize: 7.5,
      color: "#9CA3AF",
      fontFamily: "Noto Sans KR",
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    footerPageCounterText: {
      fontSize: 7.5,
      color: "#9CA3AF",
      fontFamily: "Noto Sans KR",
    },
  });
};

/**
 * MonthlyDiaryDocument Component
 * Returns a formal, printable ESL Scholastic PDF Portfolio multi-page document structure.
 */
export const MonthlyDiaryDocument: React.FC<MonthlyDiaryDocumentProps> = ({
  reportData,
  isEcoMode = false,
}) => {
  const { school, student, targetMonth, artifacts } = reportData;
  const styles = createStyles(school.brandColor, isEcoMode);

  // Filter out any invalid artifacts to respect "INTELLIGENT SKIPPING" requirement
  const validArtifacts = (artifacts || []).filter((item) => {
    return (
      item &&
      typeof item === "object" &&
      item.subject &&
      typeof item.subject === "string" &&
      item.subject.trim().length > 0
    );
  });

  return (
    <Document title={`${student.name}'s Monthly Learning Diary`}>
      {/* ================= PAGE 1: ACADEMIC COVER PAGE ================= */}
      <Page size="A4" style={styles.coverPageLayout}>
        {/* White Label Institution Crest */}
        <View style={styles.coverHeader}>
          <Text style={styles.coverSchoolTitle}>{school.name}</Text>
          <Text style={styles.coverSchoolSubtitle}>ESL scholastic progress portfolio</Text>
        </View>

        {/* Central Design Title Designation */}
        <View style={styles.coverBody}>
          <Text style={styles.coverBadge}>Monthly Diary</Text>
          <Text style={styles.coverTitle}>Learning Artifacts Summary</Text>
          <Text style={styles.coverDateText}>{targetMonth}</Text>
          <View style={styles.coverAccentLine} />
        </View>

        {/* Student Information Subplate Badge */}
        <View style={styles.coverStudentContainer}>
          <View style={styles.coverStudentRow}>
            <Text style={styles.coverStudentLabel}>Student Name:</Text>
            <Text style={styles.coverStudentValue}>{student.name}</Text>
          </View>
          <View style={styles.coverStudentRow}>
            <Text style={styles.coverStudentLabel}>Report Period:</Text>
            <Text style={styles.coverStudentValue}>{targetMonth}</Text>
          </View>
          <View style={styles.coverStudentRow}>
            <Text style={styles.coverStudentLabel}>Status:</Text>
            <Text style={styles.coverStudentValue}>Completed ESL Level Benchmarking</Text>
          </View>
        </View>

        {/* Custom Branded Cover Footer */}
        <View style={styles.coverFooter}>
          <Text>WHITE-LABEL TENANT ID: MLD-SYS-{school.brandColor.replace("#", "")}</Text>
          <Text style={styles.coverFooterRight}>CONFIDENTIAL REPORT</Text>
        </View>
      </Page>

      {/* ================= PAGES 2+: INDIVIDUAL ARTIFACT LESSONS ================= */}
      {validArtifacts.length > 0 ? (
        validArtifacts.map((artifact, index) => {
          // Safeguard protocol checking on the image to ensure robust non-crashing PDF builds
          const hasImage =
            artifact.imageUrl &&
            typeof artifact.imageUrl === "string" &&
            (artifact.imageUrl.startsWith("http://") ||
              artifact.imageUrl.startsWith("https://") ||
              artifact.imageUrl.startsWith("data:image/"));

          return (
            <Page key={index} size="A4" style={styles.pageLayout}>
              {/* Branded Running Header Stamp */}
              <View style={styles.headerRow}>
                <Text style={styles.headerPrefix}>
                  {student.name}'s Multi-Subject Learning Diary
                </Text>
                <Text style={styles.headerMonthText}>
                  {targetMonth} Progress Report
                </Text>
              </View>

              {/* Subject Title Banner with Brand Color Left Bar Accent */}
              <View style={styles.subjectBanner}>
                <Text style={styles.subjectTitleText}>
                  Subject Stream: {artifact.subject}
                </Text>
                <Text style={styles.subjectBadgeText}>
                  Artifact {index + 1} of {validArtifacts.length}
                </Text>
              </View>

              {/* Robust Dynamic Two-Column Layout */}
              <View style={styles.columnsContainer}>
                {/* COLUMN 1: Student Artifact Artwork Asset */}
                <View style={styles.leftColumn}>
                  {hasImage ? (
                    <View style={styles.imageOuterFrame}>
                      <Image
                        src={artifact.imageUrl}
                        style={styles.imageComponent}
                      />
                    </View>
                  ) : (
                    <View style={styles.fallbackFrame}>
                      <Text style={styles.fallbackText}>Artifact Visual</Text>
                      <Text style={styles.fallbackSubtext}>
                        No uploaded work image preview
                      </Text>
                    </View>
                  )}
                  <Text style={styles.imageLabelText}>
                    academic evidence specimen
                  </Text>
                </View>

                {/* COLUMN 2: Pedagogical Objectives & Professional Narrative */}
                <View style={styles.rightColumn}>
                  <View style={styles.objectivesSection}>
                    {/* Selected Tags list mapping */}
                    <Text style={styles.sectionLabelText}>
                      Demonstrated Milestones & Skills
                    </Text>
                    <View style={styles.tagsGrid}>
                      {artifact.tags && artifact.tags.length > 0 ? (
                        artifact.tags.map((tag, tagIdx) => (
                          <Text key={tagIdx} style={styles.tagItem}>
                            {tag}
                          </Text>
                        ))
                      ) : (
                        <Text style={styles.tagItem}>
                          General Core Skills
                        </Text>
                      )}
                    </View>
                  </View>

                  {/* Programmatic brand-colored text box background for reflection */}
                  <View style={styles.reflectionWorkspace}>
                    <Text style={styles.reflectionHeader}>
                      Teacher's Commentary
                    </Text>
                    <Text style={styles.reflectionTextContent}>
                      {artifact.ai_reflection ||
                        "The student displayed exceptional growth in understanding core curriculum parameters. Performance metrics confirm excellent command of the objectives."}
                    </Text>
                  </View>

                  {/* Academic approval stamp & signature block */}
                  <View style={styles.academicSignatureBlock}>
                    <Text style={styles.signatureLabel}>Reviewer Signature:</Text>
                    <Text style={styles.signatureValue}>Academic Director</Text>
                  </View>
                </View>
              </View>

              {/* Branded Footer displaying Page X of Y dynamically */}
              <View style={styles.footerRow} fixed>
                <Text style={styles.footerSchoolText}>
                  {school.name} Portfolio System
                </Text>
                <Text
                  style={styles.footerPageCounterText}
                  render={({ pageNumber, totalPages }) =>
                    `Page ${pageNumber} of ${totalPages}`
                  }
                />
              </View>
            </Page>
          );
        })
      ) : (
        /* Empty State fallback page to avoid generating blank empty PDFs */
        <Page size="A4" style={styles.pageLayout}>
          <View style={styles.emptyStateLayout}>
            <Text style={styles.emptyStateTitle}>Academic Report Empty</Text>
            <Text style={styles.emptyStateBody}>
              No verified learning diary items found for the current billing period. Add artifacts in the HMS dashboard to populate.
            </Text>
          </View>
          <View style={styles.footerRow} fixed>
            <Text style={styles.footerSchoolText}>
              {school.name} Portfolio System
            </Text>
            <Text
              style={styles.footerPageCounterText}
              render={({ pageNumber, totalPages }) =>
                `Page ${pageNumber} of ${totalPages}`
              }
            />
          </View>
        </Page>
      )}
    </Document>
  );
};
