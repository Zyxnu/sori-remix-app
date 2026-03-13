import React from 'react';
import { Sparkles, LayoutDashboard, RotateCcw } from 'lucide-react';

interface HeaderProps {
  onTriggerAI: () => void;
  onReset: () => void;
  isSetupComplete: boolean;
}

const Header: React.FC<HeaderProps> = ({ onTriggerAI, onReset, isSetupComplete }) => {
  return (
    <header className="bg-white border-b border-gray-100 px-10 py-8 flex items-center justify-between sticky top-0 z-50 backdrop-blur-md bg-white/90">
      <div className="flex items-center space-x-6">
        <div className="bg-indigo-600 p-4 rounded-[1.5rem] shadow-lg shadow-indigo-200">
          <LayoutDashboard className="w-10 h-10 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter">SROI 投入管理系統 <span className="text-indigo-600">v2.0</span></h1>
          <p className="text-lg font-bold text-gray-400 uppercase tracking-widest">Social Return on Investment Management</p>
        </div>
      </div>
      <div className="flex items-center space-x-6">
        <button onClick={onReset} className="bg-gray-100 text-gray-700 px-8 py-5 rounded-2xl font-black text-xl flex items-center space-x-3 hover:bg-gray-200 transition-all" title="清除所有資料並重新開始">
          <RotateCcw className="w-6 h-6" />
          <span>重新開始</span>
        </button>
        <button
          onClick={onTriggerAI}
          disabled={!isSetupComplete}
          title={!isSetupComplete ? '請先完成 Tab 0 計畫解析' : undefined}
          className={`px-10 py-5 rounded-2xl font-black text-2xl flex items-center space-x-4 shadow-xl transition-all ${
            isSetupComplete
              ? 'bg-indigo-600 text-white hover:bg-indigo-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-60'
          }`}
        >
          <Sparkles className="w-8 h-8" />
          <span>生成顧問報告</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
