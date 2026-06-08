// white-label-mvp/components/MonthlyDiaryPDF.tsx
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

// Register professional editorial fonts for the generated PDF outputs
Font.register({
  family: "Inter",
  src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZ9hNDg.ttf",
  fontWeight: "normal",
});

Font.register({
  family: "Inter Bold",
  src: "https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7W0Q5mrw.ttf",
  fontWeight: "bold",
});

// Structural TypeScript Interfaces matching the system specs
export interface MonthlyDiaryPDFSubject {
  name: string;
  imageUrl: string;
  reflection: string;
  tags: string[];
}

export interface MonthlyDiaryPDFProps {
  reportData: {
    schoolName: string;
    logoUrl?: string;
    brandColor: string; // Dynamic hex brand styling
    studentName: string;
    month: string;
    subjects: MonthlyDiaryPDFSubject[];
  };
}

/**
 * =========================================================================
 *                   MODULAR INDIVIDUAL SUBJECT RENDERING
 * =========================================================================
 * Renders a full A4-budgeted page strictly dedicated to a single stream.
 * Isolating layout blocks inside dynamic @react-pdf tags ensures layout safety.
 */
const SubjectSection: React.FC<{
  subject: MonthlyDiaryPDFSubject;
  brandColor: string;
  schoolName: string;
  studentName: string;
  monthString: string;
  styles: any;
}> = ({ subject, brandColor, schoolName, studentName, monthString, styles }) => {
  return (
    <Page size="A4" style={styles.page}>
      {/* Running Document Header */}
      <View style={styles.headerBlock}>
        <Text style={styles.headerLeftText}>{studentName}'s Portfolio</Text>
        <Text style={[styles.headerRightText, { color: brandColor }]}>
          {monthString} Milestone Activity
        </Text>
      </View>

      {/* Subject Focus Badge Title */}
      <View style={[styles.subjectBanner, { borderLeftColor: brandColor }]}>
        <Text style={[styles.subjectTitleLabel, { color: brandColor }]}>
          Subject FOCUS: {subject.name}
        </Text>
      </View>

      <View style={styles.artifactContainer}>
        {/* Left Side: Visual anchor worksheet artwork */}
        <View style={styles.imageColumn}>
          {subject.imageUrl ? (
            <Image src={subject.imageUrl} style={styles.artifactImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.placeholderLabel}>Milestone Proof Under Review</Text>
            </View>
          )}
          <Text style={styles.taskLabel}>Anchor Task Achievement Proof</Text>
        </View>

        {/* Right Side: Pedatgogical tags and AI narrative comments */}
        <View style={styles.narrativeColumn}>
          {/* Predefined progress objectives tags row */}
          <View style={styles.tagsRow}>
            {subject.tags.map((tag, idx) => (
              <Text key={`${tag}-${idx}`} style={styles.tagBadge}>
                {tag}
              </Text>
            ))}
          </View>

          {/* Core educational summary description */}
          <View style={styles.reflectionCard}>
            <Text style={styles.sectionHeading}>Academic Insight & Narrative</Text>
            <Text style={styles.reflectionParagraph}>
              {subject.reflection}
            </Text>
          </View>

          {/* Formal signature stamp line */}
          <View style={styles.graderRow}>
            <Text style={styles.graderLabel}>Assessing Educator:</Text>
            <Text style={styles.graderValue}>Hakwon Editorial Panel</Text>
          </View>
        </View>
      </View>

      {/* Elegant Footer containing the dynamic page numbers */}
      <View style={styles.footerBlock}>
        <Text style={styles.footerSchoolName}>{schoolName} ESL Portfolio</Text>
        <Text
          style={styles.pageNumberLabel}
          render={({ pageNumber, totalPages }) =>
            `Page ${pageNumber} of ${totalPages}`
          }
          fixed
        />
      </View>
    </Page>
  );
};

/**
 * =========================================================================
 *                  MAIN PDF DOCUMENT DEFINITION & CONTAINER
 * =========================================================================
 */
export const MonthlyDiaryPDF: React.FC<MonthlyDiaryPDFProps> = ({
  reportData,
}) => {
  const {
    schoolName,
    logoUrl,
    brandColor = "#2A435D",
    studentName,
    month,
    subjects = [],
  } = reportData;

  /**
   * 1. 🛑 INTELLIGENT SKIPPING LOGIC:
   * Filter out any subjects that are completely empty or lack essential
   * markers (e.g. valid name, text reflection, or image URL).
   * This guarantees we have ZERO orphan headings or blank layouts inside
   * the compiled output PDF file.
   */
  const validSubjects = subjects.filter(
    (subj) =>
      subj.name &&
      subj.name.trim().length > 0 &&
      subj.reflection &&
      subj.reflection.trim().length > 0 &&
      subj.imageUrl &&
      subj.imageUrl.trim().length > 0
  );

  /**
   * 2. CUSTOM STYLING BLOCK:
   * We generate dynamic styles inside standard StyleSheet properties making use of
   * the configured school brandColor hex string passed in via Props.
   */
  const styles = StyleSheet.create({
    page: {
      fontFamily: "Inter",
      backgroundColor: "#FAF9F6", // High-end book material tone
      padding: 40,
      fontSize: 10,
      color: "#1C1C1C",
      flexDirection: "column",
    },
    // ==================== COVER PAGE SPECIFIC ====================
    coverContainer: {
      flex: 1,
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 50,
      borderTopWidth: 8,
      borderTopColor: brandColor,
      borderTopStyle: "solid",
      borderBottomWidth: 1,
      borderBottomColor: "#EFECE7",
      borderLeftWidth: 1,
      borderLeftColor: "#EFECE7",
      borderRightWidth: 1,
      borderRightColor: "#EFECE7",
      borderRadius: 4,
      backgroundColor: "#FFFFFF",
    },
    coverHeader: {
      alignItems: "center",
      marginTop: 20,
    },
    coverLogo: {
      width: 70,
      height: 70,
      objectFit: "contain",
      marginBottom: 10,
    },
    coverSchoolName: {
      fontSize: 10,
      fontFamily: "Inter Bold",
      letterSpacing: 2,
      textTransform: "uppercase",
      color: "#2A435D",
    },
    coverSchoolSub: {
      fontSize: 8,
      color: "#6B7280",
      letterSpacing: 1,
      marginTop: 2,
    },
    coverTitleBlock: {
      alignItems: "center",
      marginVertical: 40,
    },
    coverBadge: {
      color: "#FFFFFF",
      backgroundColor: brandColor,
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 1,
      fontSize: 8,
      fontFamily: "Inter Bold",
      letterSpacing: 2,
      textTransform: "uppercase",
      marginBottom: 15,
    },
    coverMainTitle: {
      fontSize: 26,
      fontFamily: "Inter Bold",
      color: "#111827",
      letterSpacing: -0.5,
    },
    coverSubTitle: {
      fontSize: 11,
      color: "#4B5563",
      marginTop: 4,
      letterSpacing: 1,
      textTransform: "uppercase",
    },
    coverDivider: {
      width: 40,
      height: 2,
      backgroundColor: brandColor,
      marginTop: 15,
    },
    coverMetaCard: {
      width: "80%",
      backgroundColor: "#FAF9F6",
      borderLeftWidth: 3,
      borderLeftColor: brandColor,
      padding: 15,
      borderRadius: 2,
    },
    metaRow: {
      flexDirection: "row",
      marginBottom: 6,
    },
    metaLabel: {
      width: 80,
      fontSize: 8,
      fontFamily: "Inter Bold",
      color: "#6B7280",
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    metaValue: {
      fontSize: 10,
      color: "#1F2937",
    },
    coverFooter: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "80%",
      borderTopWidth: 1,
      borderTopColor: "#EFECE7",
      paddingTop: 15,
    },
    coverFooterText: {
      fontSize: 8,
      color: "#9CA3AF",
    },
    // ==================== SUBJECT TIMELINE PAGE ====================
    headerBlock: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottomWidth: 1,
      borderBottomColor: "#EFECE7",
      paddingBottom: 8,
      marginBottom: 20,
    },
    headerLeftText: {
      fontSize: 8,
      color: "#9CA3AF",
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    headerRightText: {
      fontSize: 8,
      fontFamily: "Inter Bold",
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    subjectBanner: {
      backgroundColor: "#FFFFFF",
      borderLeftWidth: 4,
      paddingVertical: 8,
      paddingHorizontal: 12,
      marginBottom: 20,
      borderRadius: 2,
      borderWidth: 1,
      borderColor: "#EFECE7",
    },
    subjectTitleLabel: {
      fontSize: 12,
      fontFamily: "Inter Bold",
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    artifactContainer: {
      flexDirection: "row",
      gap: 20,
      flex: 1,
    },
    imageColumn: {
      width: "45%",
      flexDirection: "column",
    },
    artifactImage: {
      width: "100%",
      height: 240,
      objectFit: "cover",
      borderRadius: 4,
      borderWidth: 1,
      borderColor: "#EFECE7",
    },
    imagePlaceholder: {
      width: "100%",
      height: 240,
      backgroundColor: "#EFECE7",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 4,
    },
    placeholderLabel: {
      fontSize: 8,
      color: "#9CA3AF",
      textTransform: "uppercase",
    },
    taskLabel: {
      marginTop: 8,
      fontSize: 7,
      color: "#9CA3AF",
      textTransform: "uppercase",
      letterSpacing: 0.5,
      textAlign: "center",
    },
    narrativeColumn: {
      width: "55%",
      flexDirection: "column",
    },
    tagsRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 4,
      marginBottom: 15,
    },
    tagBadge: {
      backgroundColor: "#FFFFFF",
      color: "#4B5563",
      fontSize: 7,
      fontFamily: "Inter Bold",
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 2,
      borderWidth: 1,
      borderColor: "#EFECE7",
      textTransform: "uppercase",
    },
    reflectionCard: {
      backgroundColor: "#FFFFFF",
      borderWidth: 1,
      borderColor: "#EFECE7",
      borderRadius: 4,
      padding: 15,
      marginBottom: 15,
    },
    sectionHeading: {
      fontSize: 8,
      fontFamily: "Inter Bold",
      color: brandColor,
      textTransform: "uppercase",
      letterSpacing: 1,
      marginBottom: 8,
    },
    reflectionParagraph: {
      fontSize: 9.5,
      color: "#374151",
      lineHeight: 1.5,
    },
    graderRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: "auto",
      paddingTop: 10,
      borderTopWidth: 1,
      borderTopColor: "#EFECE7",
    },
    graderLabel: {
      fontSize: 8,
      color: "#9CA3AF",
      marginRight: 4,
    },
    graderValue: {
      fontSize: 8,
      fontFamily: "Inter Bold",
      color: "#4B5563",
    },
    footerBlock: {
      flexDirection: "row",
      justifyContent: "space-between",
      borderTopWidth: 1,
      borderTopColor: "#EFECE7",
      paddingTop: 8,
      marginTop: 20,
    },
    footerSchoolName: {
      fontSize: 7,
      color: "#9CA3AF",
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    pageNumberLabel: {
      fontSize: 7,
      color: "#9CA3AF",
    },
  });

  return (
    <Document>
      {/* =========================================================================
       *                           PAGE 1: ARCHIVAL COVER PAGE
       * =========================================================================
       * Renders the master white-label cover page with the academy banner logo
       * and targeted student files details.
       */}
      <Page size="A4" style={styles.page}>
        <View style={styles.coverContainer}>
          {/* Logo Brand Header Block */}
          <View style={styles.coverHeader}>
            {logoUrl && <Image src={logoUrl} style={styles.coverLogo} />}
            <Text style={styles.coverSchoolName}>{schoolName}</Text>
            <Text style={styles.coverSchoolSub}>PRIMARY LANGUAGE ACADEMY</Text>
          </View>

          {/* Central Report Designation Title */}
          <View style={styles.coverTitleBlock}>
            <Text style={styles.coverBadge}>Monthly Progress</Text>
            <Text style={styles.coverMainTitle}>Student Portfolio</Text>
            <Text style={styles.coverSubTitle}>Aesthetic Learning Diary</Text>
            <View style={styles.coverDivider} />
          </View>

          {/* Metadata Table Card Plate */}
          <View style={styles.coverMetaCard}>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Student:</Text>
              <Text style={styles.metaValue}>{studentName}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Academic Cycle:</Text>
              <Text style={styles.metaValue}>{month}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Ecosystem Status:</Text>
              <Text style={styles.metaValue}>Multi-Subject Verified</Text>
            </View>
          </View>

          {/* Institutional Signature stamp block */}
          <View style={styles.coverFooter}>
            <Text style={styles.coverFooterText}>White-Label Generation Engine</Text>
            <Text style={styles.coverFooterText}>Hakwon Portfolio Suite v1.5</Text>
          </View>
        </View>
      </Page>

      {/* =========================================================================
       *                      PAGES 2+: DYNAMIC SUBJECT SECTIONS
       * =========================================================================
       * Maps over active, validated subjects only. If there are no valid subjects 
       * (due to skipping logic filtering out incomplete artifacts), none render.
       */}
      {validSubjects.map((sub, index) => (
        <SubjectSection
          key={`${sub.name}-${index}`}
          subject={sub}
          brandColor={brandColor}
          schoolName={schoolName}
          studentName={studentName}
          monthString={month}
          styles={styles}
        />
      ))}
    </Document>
  );
};
