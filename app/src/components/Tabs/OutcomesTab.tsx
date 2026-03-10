import React from 'react';
import { ArrowRightLeft, Sparkles, Loader2, ChevronRight } from 'lucide-react';
import { Outcome } from '../../../types';

interface OutcomesTabProps {
  outcomes: Outcome[];
  isAnalyzing: boolean;
  onTriggerAnalysis: () => void;
  onDecision: (index: number, decision: string) => void;
  onNext: () => void;
}

const OutcomesTab: React.FC<OutcomesTabProps> = ({
  outcomes,
  isAnalyzing,
  onTriggerAnalysis,
  onDecision,
  onNext
}) => {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <section className="bg-white rounded-[4rem] border border-gray-200 shadow-2xl overflow-hidden">
        <div className="px-12 py-10 flex items-center justify-between text-white bg-purple-600">
          <div className="flex items-center space-x-6">
            <ArrowRightLeft className="w-12 h-12" />
            <div>
              <h2 className="text-4xl font-black">AI 事件鏈與成果深度推導</h2>
              <p className="text-xl font-bold opacity-80 mt-1">運用嚴謹邏輯推導從產出到成果的變化過程，並識別潛在間接影響</p>
            </div>
          </div>
          {!isAnalyzing && (
            <button onClick={onTriggerAnalysis} className="bg-white text-purple-600 px-8 py-4 rounded-2xl font-black text-xl hover:bg-purple-50 transition-all flex items-center space-x-3">
              <Sparkles className="w-6 h-6" />
              <span>重新分析</span>
            </button>
          )}
        </div>
        
        {isAnalyzing ? (
          <div className="py-40 flex flex-col items-center justify-center space-y-8">
            <Loader2 className="w-20 h-20 text-purple-600 animate-spin" />
            <p className="text-3xl font-black text-gray-400">正在運用嚴謹邏輯推導事件鏈並定義成果...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left table-fixed min-w-[1400px]">
              <thead className="bg-gray-50 border-b-4 border-gray-100">
                <tr className="text-gray-800 text-xl font-black uppercase tracking-wide">
                  <th className="px-10 py-8 w-[10%]">對象</th>
                  <th className="px-10 py-8 w-[15%]">投入</th>
                  <th className="px-10 py-8 w-[15%]">產出</th>
                  <th className="px-10 py-8 w-[25%]">推導事件鏈</th>
                  <th className="px-10 py-8 w-[20%]">定義成果</th>
                  <th className="px-10 py-8 text-center w-[15%]">使用者決策</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-gray-100">
                {outcomes.map((o, idx) => (
                  <tr key={idx} className="hover:bg-purple-50/50 transition-colors text-xl font-bold">
                    <td className="px-10 py-8 text-2xl font-black text-gray-900">{o.stakeholder}</td>
                    <td className="px-10 py-8 text-gray-600 text-lg">{o.input}</td>
                    <td className="px-10 py-8 text-gray-600 text-lg">{o.output}</td>
                    <td className="px-10 py-8">
                      <div className="flex items-center flex-wrap gap-2 text-indigo-700">
                        {o.chain.split('->').map((step, i, arr) => (
                          <React.Fragment key={i}>
                            <span className="bg-indigo-50 px-3 py-1 rounded-lg">{step.trim()}</span>
                            {i < arr.length - 1 && <ChevronRight className="w-5 h-5 text-gray-300" />}
                          </React.Fragment>
                        ))}
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="text-purple-800 leading-relaxed font-black">{o.outcome}</div>
                    </td>
                    <td className="px-10 py-8 text-center">
                      {o.decision === '待確認' ? (
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
                        <span className={`px-4 py-2 rounded-xl text-lg font-black ${o.decision === '納入分析' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
                          {o.decision}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                {outcomes.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-32 text-center text-gray-400 text-2xl font-black">
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
        <button onClick={onNext} className="flex items-center space-x-8 bg-amber-600 text-white px-24 py-10 rounded-[3rem] text-4xl font-black hover:bg-amber-700 transition-all shadow-2xl">
          <span>下一步：推導財務代理與定價</span>
          <ChevronRight className="w-12 h-12" />
        </button>
      </div>
    </div>
  );
};

export default OutcomesTab;
