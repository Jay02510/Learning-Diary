import React from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { MonthlyDiaryDocument, MonthlyDiaryReportData } from "./MonthlyDiaryDocument";
import { Download } from "lucide-react";

interface LazyPDFLinkProps {
  reportData: MonthlyDiaryReportData;
  isEcoMode: boolean;
  school: { brandColor: string };
  student: { englishName: string };
  language: "en" | "ko";
  translations: any;
}

export const LazyPDFLink: React.FC<LazyPDFLinkProps> = ({
  reportData,
  isEcoMode,
  school,
  student,
  language,
  translations,
}) => {
  return (
    <PDFDownloadLink
      document={<MonthlyDiaryDocument reportData={reportData} isEcoMode={isEcoMode} />}
      fileName={`${student.englishName.replace(/[^a-zA-Z0-9]/g, "_")}_Monthly_Diary.pdf`}
    >
      {({ loading }) => (
        <button
          disabled={loading}
          className="flex items-center gap-1.5 py-1.5 px-3 text-[10px] font-bold text-white uppercase tracking-wider rounded-sm shadow-xs cursor-pointer hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 animate-fadeIn"
          style={{ backgroundColor: school.brandColor }}
          id="pdf-download-harness-btn"
        >
          <Download className="w-3 h-3 text-white shrink-0" />
          <span>{loading ? "Compiling PDF..." : translations[language]?.downloadBtn || "Download PDF"}</span>
        </button>
      )}
    </PDFDownloadLink>
  );
};

export default LazyPDFLink;
