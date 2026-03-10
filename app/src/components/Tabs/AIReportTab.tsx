import React from 'react';
import { Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface AIReportTabProps {
  isAnalyzing: boolean;
  analysis: string;
}

const AIReportTab: React.FC<AIReportTabProps> = ({ isAnalyzing, analysis }) => {
  return (
    <div className="bg-white rounded-[5rem] p-20 max-w-7xl mx-auto shadow-2xl">
      <div className="flex items-center space-x-10 mb-16 border-b-4 border-gray-50 pb-16">
        <Sparkles className="w-14 h-14 text-purple-600" />
        <h2 className="text-5xl font-black">SROI 永續顧問深度解析</h2>
      </div>
      {isAnalyzing ? (
        <div className="py-32 text-center text-3xl font-black">正在深度分析...</div>
      ) : (
        <div className="markdown-body prose prose-2xl max-w-none">
          <ReactMarkdown>{analysis}</ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default AIReportTab;
