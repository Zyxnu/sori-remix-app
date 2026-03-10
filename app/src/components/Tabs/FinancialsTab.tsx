import React from 'react';
import { DollarSign, Sparkles, Loader2, ChevronRight } from 'lucide-react';
import { FinancialProxy } from '../../../types';

interface FinancialsTabProps {
  financialProxies: FinancialProxy[];
  isAnalyzing: boolean;
  onTriggerAnalysis: () => void;
  onNext: () => void;
}

const FinancialsTab: React.FC<FinancialsTabProps> = ({
  financialProxies,
  isAnalyzing,
  onTriggerAnalysis,
  onNext
}) => {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <section className="bg-white rounded-[4rem] border border-gray-200 shadow-2xl overflow-hidden">
        <div className="px-12 py-10 flex items-center justify-between text-white bg-amber-600">
          <div className="flex items-center space-x-6">
            <DollarSign className="w-12 h-12" />
            <div>
              <h2 className="text-4xl font-black">AI 成果貨幣化與財務定價</h2>
              <p className="text-xl font-bold opacity-80 mt-1">運用經濟學邏輯推導財務代理變數，並給予公信力的定價估算</p>
            </div>
          </div>
          {!isAnalyzing && (
            <button onClick={onTriggerAnalysis} className="bg-white text-amber-600 px-8 py-4 rounded-2xl font-black text-xl hover:bg-amber-50 transition-all flex items-center space-x-3">
              <Sparkles className="w-6 h-6" />
              <span>重新分析</span>
            </button>
          )}
        </div>
        
        {isAnalyzing ? (
          <div className="py-40 flex flex-col items-center justify-center space-y-8">
            <Loader2 className="w-20 h-20 text-amber-600 animate-spin" />
            <p className="text-3xl font-black text-gray-400">正在運用經濟學邏輯推導財務代理變數與定價...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left table-fixed min-w-[1200px]">
              <thead className="bg-gray-50 border-b-4 border-gray-100">
                <tr className="text-gray-800 text-xl font-black uppercase tracking-wide">
                  <th className="px-10 py-8 w-[15%]">利害關係人</th>
                  <th className="px-10 py-8 w-[25%]">成果</th>
                  <th className="px-10 py-8 w-[35%]">財務代理變數</th>
                  <th className="px-10 py-8 w-[25%]">定價 / 計算公式</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-gray-100">
                {financialProxies.map((f, idx) => (
                  <tr key={idx} className="hover:bg-amber-50/50 transition-colors text-xl font-bold">
                    <td className="px-10 py-8 text-2xl font-black text-gray-900">{f.stakeholder}</td>
                    <td className="px-10 py-8 text-indigo-700 leading-relaxed">{f.outcome}</td>
                    <td className="px-10 py-8 text-gray-700 leading-relaxed">
                      <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl italic">
                        {f.proxy}
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="text-emerald-700 font-black text-2xl bg-emerald-50 px-6 py-3 rounded-2xl inline-block">
                        {f.pricing}
                      </div>
                    </td>
                  </tr>
                ))}
                {financialProxies.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-32 text-center text-gray-400 text-2xl font-black">
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
        <button onClick={onNext} className="flex items-center space-x-8 bg-rose-600 text-white px-24 py-10 rounded-[3rem] text-4xl font-black hover:bg-rose-700 transition-all shadow-2xl">
          <span>下一步：評估影響力因子</span>
          <ChevronRight className="w-12 h-12" />
        </button>
      </div>
    </div>
  );
};

export default FinancialsTab;
