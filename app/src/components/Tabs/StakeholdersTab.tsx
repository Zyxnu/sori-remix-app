import React from 'react';
import { Users, Sparkles, Loader2, ChevronRight } from 'lucide-react';
import { Stakeholder } from '../../../types';

interface StakeholdersTabProps {
  stakeholders: Stakeholder[];
  isAnalyzing: boolean;
  onTriggerAnalysis: () => void;
  onDecision: (index: number, decision: string) => void;
  onNext: () => void;
}

const StakeholdersTab: React.FC<StakeholdersTabProps> = ({
  stakeholders,
  isAnalyzing,
  onTriggerAnalysis,
  onDecision,
  onNext
}) => {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <section className="bg-white rounded-[4rem] border border-gray-200 shadow-2xl overflow-hidden">
        <div className="px-12 py-10 flex items-center justify-between text-white bg-indigo-600">
          <div className="flex items-center space-x-6">
            <Users className="w-12 h-12" />
            <div>
              <h2 className="text-4xl font-black">AI 利害關係人智慧盤點</h2>
              <p className="text-xl font-bold opacity-80 mt-1">自動識別直接與間接利害關係人，並分析其社會影響力</p>
            </div>
          </div>
          {!isAnalyzing && (
            <button onClick={onTriggerAnalysis} className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-black text-xl hover:bg-indigo-50 transition-all flex items-center space-x-3">
              <Sparkles className="w-6 h-6" />
              <span>重新分析</span>
            </button>
          )}
        </div>
        
        {isAnalyzing ? (
          <div className="py-40 flex flex-col items-center justify-center space-y-8">
            <Loader2 className="w-20 h-20 text-indigo-600 animate-spin" />
            <p className="text-3xl font-black text-gray-400">正在深度掃描計畫書並發想間接關係人...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left table-fixed min-w-[1200px]">
              <thead className="bg-gray-50 border-b-4 border-gray-100">
                <tr className="text-gray-800 text-xl font-black uppercase tracking-wide">
                  <th className="px-10 py-8 w-[12%]">類別</th>
                  <th className="px-10 py-8 w-[18%]">利害關係人</th>
                  <th className="px-10 py-8 w-[30%]">系統判斷建議</th>
                  <th className="px-10 py-8 w-[25%]">理由</th>
                  <th className="px-10 py-8 text-center w-[15%]">使用者決策</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-gray-100">
                {stakeholders.map((s, idx) => (
                  <tr key={idx} className="hover:bg-indigo-50/50 transition-colors text-xl font-bold">
                    <td className="px-10 py-8">
                      <span className={`px-4 py-2 rounded-xl text-lg font-black ${s.category === '直接' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {s.category}
                      </span>
                    </td>
                    <td className="px-10 py-8 text-2xl font-black text-gray-900">{s.name}</td>
                    <td className="px-10 py-8 text-indigo-700 leading-relaxed">{s.suggestion}</td>
                    <td className="px-10 py-8 text-gray-500 text-lg leading-relaxed">{s.reason}</td>
                    <td className="px-10 py-8 text-center">
                      {s.decision === '待確認' ? (
                        <div className="flex flex-col space-y-2">
                          <button 
                            onClick={() => onDecision(idx, '納入分析')}
                            className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-lg font-black hover:bg-emerald-700 transition-all"
                          >
                            納入分析
                          </button>
                          <button 
                            onClick={() => onDecision(idx, '排除')}
                            className="bg-gray-200 text-gray-600 px-4 py-2 rounded-xl text-lg font-black hover:bg-gray-300 transition-all"
                          >
                            排除
                          </button>
                        </div>
                      ) : (
                        <span className={`px-4 py-2 rounded-xl text-lg font-black ${s.decision === '納入分析' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
                          {s.decision}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                {stakeholders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-32 text-center text-gray-400 text-2xl font-black">
                      尚未進行分析，請點擊上方按鈕開始
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
      
      <div className="flex justify-center">
        <button onClick={onNext} className="flex items-center space-x-8 bg-purple-600 text-white px-24 py-10 rounded-[3rem] text-4xl font-black hover:bg-purple-700 transition-all shadow-2xl">
          <span>下一步：推導事件鏈與成果</span>
          <ChevronRight className="w-12 h-12" />
        </button>
      </div>
    </div>
  );
};

export default StakeholdersTab;
