import React, { useRef, useState } from 'react';
import { Sparkles, Download, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface AIReportTabProps {
  isAnalyzing: boolean;
  analysis: string;
}

const AIReportTab: React.FC<AIReportTabProps> = ({ isAnalyzing, analysis }) => {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const handleDownloadPdf = async () => {
    const element = reportRef.current;
    if (!element || typeof window === 'undefined') return;
    setIsExportingPdf(true);
    try {
      const { default: html2pdf } = await import('html2pdf.js');
      await html2pdf()
        .set({
          margin: [16, 16, 16, 16],
          filename: `SROI顧問報告_${new Date().toISOString().slice(0, 10)}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        })
        .from(element)
        .save();
    } catch (err) {
      console.error('PDF 匯出失敗:', err);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const hasReport = !isAnalyzing && analysis.trim().length > 0;

  return (
    <div className="bg-white rounded-[5rem] p-20 max-w-7xl mx-auto shadow-2xl">
      <div className="flex items-center justify-between mb-16 border-b-4 border-gray-50 pb-16">
        <div className="flex items-center space-x-10">
          <Sparkles className="w-14 h-14 text-purple-600" />
          <h2 className="text-5xl font-black">SROI 永續顧問深度解析</h2>
        </div>
        {hasReport && (
          <button
            onClick={handleDownloadPdf}
            disabled={isExportingPdf}
            className="flex items-center space-x-3 bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-lg"
          >
            {isExportingPdf ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>產生 PDF 中...</span>
              </>
            ) : (
              <>
                <Download className="w-6 h-6" />
                <span>下載 PDF</span>
              </>
            )}
          </button>
        )}
      </div>
      <div ref={reportRef}>
        {isAnalyzing ? (
          <div className="py-40 flex flex-col items-center justify-center space-y-8">
            <Loader2 className="w-20 h-20 text-purple-600 animate-spin" />
            <p className="text-3xl font-black text-gray-400">正在深度分析專案數據並生成顧問報告...</p>
          </div>
        ) : (
          <div className="markdown-body prose prose-2xl max-w-none">
            <ReactMarkdown>{analysis}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIReportTab;
