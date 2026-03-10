import React from 'react';
import { FileText, Users, ArrowRightLeft, DollarSign, Target, Banknote, LayoutDashboard, Sparkles } from 'lucide-react';

interface TabNavigationProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'setup', label: '0. 計畫解析', icon: <FileText /> },
    { id: 'stakeholders', label: '1. 利害關係人', icon: <Users /> },
    { id: 'outcomes', label: '2. 成果推導', icon: <ArrowRightLeft /> },
    { id: 'financials', label: '3. 財務定價', icon: <DollarSign /> },
    { id: 'impact', label: '4. 影響力因子', icon: <Target /> },
    { id: 'values', label: '5. 影響價值', icon: <Banknote /> },
    { id: 'dashboard', label: '6. 影響力看板', icon: <LayoutDashboard /> },
    { id: 'ai', label: '7. 顧問報告', icon: <Sparkles /> }
  ];

  return (
    <nav className="flex space-x-5 bg-gray-200/50 p-3 rounded-[3rem] w-fit shadow-inner">
      {tabs.map((tab) => (
        <button 
          key={tab.id} 
          onClick={() => setActiveTab(tab.id)} 
          className={`flex items-center space-x-4 px-10 py-6 rounded-[2.5rem] text-2xl font-black transition-all ${
            activeTab === tab.id 
              ? 'bg-white shadow-2xl text-indigo-700 scale-105' 
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          {tab.icon}
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default TabNavigation;
