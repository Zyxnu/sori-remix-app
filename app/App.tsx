
import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Plus,
  Trash2,
  LayoutDashboard,
  List,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Users,
  Building2,
  Package,
  AlignLeft,
  Maximize2,
  Minimize2,
  Info,
  ArrowRightLeft,
  Globe,
  Zap,
  Leaf,
  Heart,
  Pencil,
  FileText,
  AlignJustify,
  Upload,
  Calendar,
  MapPin,
  Target,
  Rocket,
  DollarSign,
  Loader2,
  AlertCircle,
  X,
  CheckCircle2,
  ClipboardList,
  Banknote
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  Category,
  OutputCategory,
  OutputSubCategory
} from './types';
import type {
  ProjectInput,
  ProjectOutput,
  ProjectSetupData,
  ActivityDetail,
  Stakeholder,
  Outcome,
  FinancialProxy,
  ImpactFactor,
  ImpactValue,
  SROIFinalResult
} from './types';
// import { analyzeSROI, parsePDFProposal, analyzeStakeholders, analyzeOutcomes, analyzeFinancialProxies, analyzeImpactFactors, analyzeImpactValue, calculateFinalSROI } from './services/geminiService';
import ReactMarkdown from 'react-markdown';
import { parseCSV } from './src/utils/csvParser';

// API Helper
const callGeminiAPI = async (actionType: string, data: any = {}) => {
  const res = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ actionType, data }),
  });
  if (!res.ok) {
    throw new Error('API Request Failed');
  }
  const resultData = await res.json();
  if (resultData.error) throw new Error(resultData.error);
  return resultData.result;
};

// Components
import Header from './src/components/Layout/Header';
import TabNavigation from './src/components/Layout/TabNavigation';
import SetupTab from './src/components/Tabs/SetupTab';
import StakeholdersTab from './src/components/Tabs/StakeholdersTab';
import OutcomesTab from './src/components/Tabs/OutcomesTab';
import FinancialsTab from './src/components/Tabs/FinancialsTab';
import ImpactTab from './src/components/Tabs/ImpactTab';
import ValuesTab from './src/components/Tabs/ValuesTab';
import DashboardTab from './src/components/Tabs/DashboardTab';
import AIReportTab from './src/components/Tabs/AIReportTab';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'setup' | 'stakeholders' | 'outcomes' | 'financials' | 'impact' | 'values' | 'dashboard' | 'ai'>('setup');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [setupData, setSetupData] = useState<ProjectSetupData>({
    name: '', period: '', location: '', type: '', motivation: '',
    expectedGoals: '', participants: '', staff: '', funds: '', humanResources: '',
    activities: []
  });

  const [userInputs, setUserInputs] = useState<ProjectInput[]>([]);
  const [userOutputs, setUserOutputs] = useState<ProjectOutput[]>([]);
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);
  const [outcomes, setOutcomes] = useState<Outcome[]>([]);
  const [financialProxies, setFinancialProxies] = useState<FinancialProxy[]>([]);
  const [impactFactors, setImpactFactors] = useState<ImpactFactor[]>([]);
  const [impactValues, setImpactValues] = useState<ImpactValue[]>([]);
  const [sroiResult, setSroiResult] = useState<SROIFinalResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [isAnalyzingStakeholders, setIsAnalyzingStakeholders] = useState(false);
  const [isAnalyzingOutcomes, setIsAnalyzingOutcomes] = useState(false);
  const [isAnalyzingFinancialProxies, setIsAnalyzingFinancialProxies] = useState(false);
  const [isAnalyzingImpactFactors, setIsAnalyzingImpactFactors] = useState(false);
  const [isAnalyzingImpactValues, setIsAnalyzingImpactValues] = useState(false);
  const [isCalculatingSROI, setIsCalculatingSROI] = useState(false);
  const [analysis, setAnalysis] = useState<string>("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else document.exitFullscreen();
  };

  const runAllAnalysis = async (
    parsedSetupData: ProjectSetupData,
    parsedInputs: ProjectInput[],
    parsedOutputs: ProjectOutput[]
  ) => {
    try {
      // Start AI Analysis in background
      setIsAnalyzing(true);
      const aiAnalysisPromise = callGeminiAPI("analyzeSROI", { inputs: parsedInputs, outputs: parsedOutputs }).then(res => {
        setAnalysis(res);
        setIsAnalyzing(false);
      }).catch(err => {
        console.error(err);
        setAnalysis("生成分析失敗。");
        setIsAnalyzing(false);
      });

      // 1 & 2: Stakeholders and Outcomes in parallel
      setIsAnalyzingStakeholders(true);
      setIsAnalyzingOutcomes(true);

      const [stakeholdersCsv, outcomesCsv] = await Promise.all([
        callGeminiAPI("analyzeStakeholders", { projectData: parsedSetupData }),
        callGeminiAPI("analyzeOutcomes", { projectData: parsedSetupData, inputs: parsedInputs, outputs: parsedOutputs })
      ]);

      const parsedStakeholders = parseCSV(stakeholdersCsv, parts => ({
        category: parts[0] || '',
        name: parts[1] || '',
        suggestion: parts[2] || '',
        reason: parts[3] || '',
        decision: parts[4] || '待確認'
      }));
      setStakeholders(parsedStakeholders);
      setIsAnalyzingStakeholders(false);

      const parsedOutcomes = parseCSV(outcomesCsv, parts => ({
        stakeholder: parts[0] || '',
        input: parts[1] || '',
        output: parts[2] || '',
        chain: parts[3] || '',
        outcome: parts[4] || '',
        decision: parts[5] || '待確認'
      }));
      setOutcomes(parsedOutcomes);
      setIsAnalyzingOutcomes(false);

      // 3 & 4: Financial Proxies and Impact Factors in parallel
      setIsAnalyzingFinancialProxies(true);
      setIsAnalyzingImpactFactors(true);

      const activeStakeholders = parsedStakeholders.filter(s => s.decision !== '排除');
      const activeOutcomes = parsedOutcomes.filter(o => o.decision !== '排除');

      let parsedFinancialProxies: FinancialProxy[] = [];
      let parsedImpactFactors: ImpactFactor[] = [];

      if (activeOutcomes.length > 0) {
        const [financialCsv, impactCsv] = await Promise.all([
          callGeminiAPI("analyzeFinancialProxies", { stakeholders: activeStakeholders, outcomes: activeOutcomes }),
          callGeminiAPI("analyzeImpactFactors", { stakeholders: activeStakeholders, outcomes: activeOutcomes })
        ]);

        parsedFinancialProxies = parseCSV(financialCsv, parts => ({
          stakeholder: parts[0] || '',
          outcome: parts[1] || '',
          proxy: parts[2] || '',
          pricing: parts[3] || ''
        }));
        setFinancialProxies(parsedFinancialProxies);

        parsedImpactFactors = parseCSV(impactCsv, parts => ({
          stakeholder: parts[0] || '',
          outcome: parts[1] || '',
          deadweight: parts[2] || '',
          displacement: parts[3] || '',
          attribution: parts[4] || '',
          dropOff: parts[5] || ''
        }));
        setImpactFactors(parsedImpactFactors);
      }
      setIsAnalyzingFinancialProxies(false);
      setIsAnalyzingImpactFactors(false);

      // 5. Impact Values
      setIsAnalyzingImpactValues(true);
      let parsedImpactValues: ImpactValue[] = [];
      if (parsedFinancialProxies.length > 0 && parsedImpactFactors.length > 0) {
        const valuesCsv = await callGeminiAPI("analyzeImpactValue", { financials: parsedFinancialProxies, impactFactors: parsedImpactFactors });
        parsedImpactValues = parseCSV(valuesCsv, parts => ({
          stakeholder: parts[0] || '',
          outcome: parts[1] || '',
          pricing: parts[2] || '',
          deadweight: parts[3] || '',
          displacement: parts[4] || '',
          attribution: parts[5] || '',
          dropOff: parts[6] || '',
          value: parts[7] || ''
        }));
        setImpactValues(parsedImpactValues);
      }
      setIsAnalyzingImpactValues(false);

      // 6. SROI Calculation
      setIsCalculatingSROI(true);
      const totalIn = parsedInputs.reduce((acc, curr) => acc + curr.totalValue, 0);
      const rawFunds = parsedSetupData.funds || totalIn;
      const funds = typeof rawFunds === 'string' ? (parseFloat(rawFunds.replace(/[^\d.]/g, '')) || 0) : rawFunds;

      const totalImpact = parsedImpactValues.reduce((sum, v) => {
        const numericValue = parseFloat(v.value.replace(/[^\d.]/g, '')) || 0;
        return sum + numericValue;
      }, 0);

      const discountRate = 0.012;
      const impactPresentValue = totalImpact / (1 + discountRate);
      const ratio = funds > 0 ? (impactPresentValue / funds).toFixed(2) : "0.00";

      const sroiCsv = await callGeminiAPI("calculateFinalSROI", { totalCost: funds.toString(), totalImpactValue: totalImpact.toString() });
      const sroiLines = sroiCsv.split('\n').filter((line: string) => line.trim() !== '');
      if (sroiLines.length > 1) {
        const parts = sroiLines[1].match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g)?.map((m: string) => m.replace(/^"|"$/g, '')) || [];
        setSroiResult({
          totalCost: `NT$ ${funds.toLocaleString()}`,
          totalImpactValue: `NT$ ${totalImpact.toLocaleString()}`,
          ratio: ratio,
          conclusion: parts[3] || `本專案每投入 1 元新台幣，將產生 ${ratio} 元新台幣之社會價值。`
        });
      } else {
        setSroiResult({
          totalCost: `NT$ ${funds.toLocaleString()}`,
          totalImpactValue: `NT$ ${totalImpact.toLocaleString()}`,
          ratio: ratio,
          conclusion: `本專案每投入 1 元新台幣，將產生 ${ratio} 元新台幣之社會價值。`
        });
      }
      setIsCalculatingSROI(false);

      await aiAnalysisPromise;

    } catch (error) {
      console.error("Auto Analysis Error:", error);
      setErrorMsg("自動生成過程中發生錯誤，請檢查網路狀態或重試。");
      setIsAnalyzingStakeholders(false);
      setIsAnalyzingOutcomes(false);
      setIsAnalyzingFinancialProxies(false);
      setIsAnalyzingImpactFactors(false);
      setIsAnalyzingImpactValues(false);
      setIsCalculatingSROI(false);
      setIsAnalyzing(false);
    }
  };

  const handleSetupDataChange = (key: keyof ProjectSetupData, value: any) => {
    setSetupData(prev => ({ ...prev, [key]: value }));
  };

  const handleUpdateInput = (id: string, updates: Partial<ProjectInput>) => {
    setUserInputs(prev => prev.map(item => {
      if (item.id === id) {
        const newItem = { ...item, ...updates };
        // Recalculate totalValue
        newItem.totalValue = (newItem.unitCost || 0) * (newItem.quantity || 1) * (newItem.hours || 1) * (newItem.days || 1);
        return newItem;
      }
      return item;
    }));
  };

  const handleRemoveInput = (id: string) => {
    setUserInputs(prev => prev.filter(item => item.id !== id));
  };

  const handleAddInput = () => {
    const newItem: ProjectInput = {
      id: `manual-in-${Date.now()}`,
      category: Category.Human,
      item: '新投入項',
      unitCost: 0,
      quantity: 1,
      hours: 1,
      days: 1,
      description: '',
      totalValue: 0
    };
    setUserInputs(prev => [...prev, newItem]);
  };

  const handleUpdateOutput = (id: string, updates: Partial<ProjectOutput>) => {
    setUserOutputs(prev => prev.map(item => {
      if (item.id === id) {
        const newItem = { ...item, ...updates };
        // Recalculate totalValue
        newItem.totalValue = (newItem.unitCost || 0) * (newItem.quantity || 1) * (newItem.param1 || 1) * (newItem.param2 || 1);
        return newItem;
      }
      return item;
    }));
  };

  const handleRemoveOutput = (id: string) => {
    setUserOutputs(prev => prev.filter(item => item.id !== id));
  };

  const handleAddOutput = () => {
    const newItem: ProjectOutput = {
      id: `manual-out-${Date.now()}`,
      category: OutputCategory.Direct,
      subCategory: OutputSubCategory.Activity,
      item: '新產出項',
      unitCost: 0,
      quantity: 1,
      param1: 1,
      param2: 1,
      description: '',
      totalValue: 0
    };
    setUserOutputs(prev => [...prev, newItem]);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.type !== 'application/pdf') {
      setErrorMsg("請上傳 PDF 格式計畫書。");
      return;
    }

    setErrorMsg(null);
    setIsParsing(true);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64String = (reader.result as string).split(',')[1];

        // 重置狀態
        setUserInputs([]);
        setUserOutputs([]);

        const data = await callGeminiAPI("parsePDFProposal", { base64Data: base64String, mimeType: file.type });

        if (data) {
          setSetupData(data.setup);

          // 填充 Inputs
          const parsedInputs: ProjectInput[] = (data.inputs || []).map((inp: any, idx: number) => ({
            id: `pdf-in-${Date.now()}-${idx}`,
            category: inp.category,
            item: inp.item,
            unitCost: Number(inp.unitCost) || 0,
            quantity: Number(inp.quantity) || 1,
            hours: Number(inp.hours) || 0,
            days: Number(inp.days) || 0,
            description: inp.description,
            totalValue: (Number(inp.unitCost) || 0) * (Number(inp.quantity) || 1) * (Number(inp.hours) || 1) * (Number(inp.days) || 1)
          }));
          setUserInputs(parsedInputs);

          // 填充 Outputs
          const parsedOutputs: ProjectOutput[] = (data.outputs || []).map((out: any, idx: number) => ({
            id: `pdf-out-${Date.now()}-${idx}`,
            category: out.subCategory === "社會效益" ? OutputCategory.Indirect : OutputCategory.Direct,
            subCategory: out.subCategory,
            item: out.item,
            unitCost: Number(out.unitCost) || 0,
            quantity: Number(out.quantity) || 1,
            param1: Number(out.param1) || 0,
            param2: Number(out.param2) || 0,
            description: out.description,
            totalValue: (Number(out.unitCost) || 0) * (Number(out.quantity) || 1) * (Number(out.param1) || 1) * (Number(out.param2) || 1)
          }));
          setUserOutputs(parsedOutputs);

          setIsParsing(false);
          window.scrollTo({ top: 800, behavior: 'smooth' });

          runAllAnalysis(data.setup, parsedInputs, parsedOutputs);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setErrorMsg("解析失敗，請確認檔案內容。");
      setIsParsing(false);
    }
  };

  const stats = useMemo(() => {
    const totalIn = userInputs.reduce((acc, curr) => acc + curr.totalValue, 0);
    const totalOut = userOutputs.reduce((acc, curr) => acc + curr.totalValue, 0);
    const sroi = totalIn > 0 ? Number((totalOut / totalIn).toFixed(2)) : 0;
    return { totalInvestment: totalIn, totalOutput: totalOut, sroiRatio: sroi, inputCount: userInputs.length, outputCount: userOutputs.length };
  }, [userInputs, userOutputs]);

  // Fix: Added triggerAIAnalysis function to handle consultant report generation.
  const triggerAIAnalysis = async () => {
    if (userInputs.length === 0 && userOutputs.length === 0) {
      setErrorMsg("請先輸入或透過 PDF 解析專案數據以進行分析。");
      return;
    }

    setErrorMsg(null);
    setIsAnalyzing(true);
    setActiveTab('ai');

    try {
      const result = await callGeminiAPI("analyzeSROI", { inputs: userInputs, outputs: userOutputs });
      setAnalysis(result);
    } catch (error) {
      console.error("AI Analysis Trigger Error:", error);
      setErrorMsg("生成顧問報告時發生錯誤，請檢查 API 金鑰或網路狀態。");
      setAnalysis("生成分析失敗。");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const triggerStakeholderAnalysis = async () => {
    if (!setupData.name && setupData.activities.length === 0) {
      setErrorMsg("請先解析 PDF 計畫書以獲取專案數據。");
      return;
    }

    setErrorMsg(null);
    setIsAnalyzingStakeholders(true);
    setActiveTab('stakeholders');

    try {
      const csvData = await callGeminiAPI("analyzeStakeholders", { projectData: setupData });
      const parsed = parseCSV(csvData, parts => ({
        category: parts[0] || '',
        name: parts[1] || '',
        suggestion: parts[2] || '',
        reason: parts[3] || '',
        decision: parts[4] || '待確認'
      }));
      setStakeholders(parsed);
    } catch (error) {
      console.error("Stakeholder Analysis Error:", error);
      setErrorMsg("分析利害關係人時發生錯誤。");
    } finally {
      setIsAnalyzingStakeholders(false);
    }
  };

  const handleStakeholderDecision = (index: number, decision: string) => {
    const updated = [...stakeholders];
    updated[index].decision = decision;
    setStakeholders(updated);
  };

  const handleOutcomeDecision = (index: number, decision: string) => {
    const updated = [...outcomes];
    updated[index].decision = decision;
    setOutcomes(updated);
  };

  const triggerOutcomeAnalysis = async () => {
    if (stakeholders.length === 0) {
      setErrorMsg("請先完成利害關係人盤點。");
      return;
    }
    setErrorMsg(null);
    setIsAnalyzingOutcomes(true);
    setActiveTab('outcomes');
    try {
      const csv = await callGeminiAPI("analyzeOutcomes", { projectData: setupData, inputs: userInputs, outputs: userOutputs });
      const parsed = parseCSV(csv, parts => ({
        stakeholder: parts[0] || '',
        input: parts[1] || '',
        output: parts[2] || '',
        chain: parts[3] || '',
        outcome: parts[4] || '',
        decision: parts[5] || '待確認'
      }));
      setOutcomes(parsed);
    } catch (error) {
      console.error(error);
      setErrorMsg("推導成果時發生錯誤。");
    } finally {
      setIsAnalyzingOutcomes(false);
    }
  };

  const triggerFinancialProxyAnalysis = async () => {
    if (outcomes.length === 0) {
      setErrorMsg("請先完成成果推導。");
      return;
    }
    setErrorMsg(null);
    setIsAnalyzingFinancialProxies(true);
    setActiveTab('financials');
    try {
      const activeStakeholders = stakeholders.filter(s => s.decision !== '排除');
      const activeOutcomes = outcomes.filter(o => o.decision !== '排除');
      const csv = await callGeminiAPI("analyzeFinancialProxies", { stakeholders: activeStakeholders, outcomes: activeOutcomes });
      const parsed = parseCSV(csv, parts => ({
        stakeholder: parts[0] || '',
        outcome: parts[1] || '',
        proxy: parts[2] || '',
        pricing: parts[3] || ''
      }));
      setFinancialProxies(parsed);
    } catch (error) {
      console.error(error);
      setErrorMsg("推導財務代理變數時發生錯誤。");
    } finally {
      setIsAnalyzingFinancialProxies(false);
    }
  };

  const triggerImpactFactorAnalysis = async () => {
    if (financialProxies.length === 0) {
      setErrorMsg("請先完成財務代理變數定價。");
      return;
    }
    setErrorMsg(null);
    setIsAnalyzingImpactFactors(true);
    setActiveTab('impact');
    try {
      const activeStakeholders = stakeholders.filter(s => s.decision !== '排除');
      const activeOutcomes = outcomes.filter(o => o.decision !== '排除');
      const csv = await callGeminiAPI("analyzeImpactFactors", { stakeholders: activeStakeholders, outcomes: activeOutcomes });
      const parsed = parseCSV(csv, parts => ({
        stakeholder: parts[0] || '',
        outcome: parts[1] || '',
        deadweight: parts[2] || '',
        displacement: parts[3] || '',
        attribution: parts[4] || '',
        dropOff: parts[5] || ''
      }));
      setImpactFactors(parsed);
    } catch (error) {
      console.error(error);
      setErrorMsg("評估影響力因子時發生錯誤。");
    } finally {
      setIsAnalyzingImpactFactors(false);
    }
  };

  const triggerImpactValueAnalysis = async () => {
    if (impactFactors.length === 0) {
      setErrorMsg("請先完成影響力因子評估。");
      return;
    }
    setErrorMsg(null);
    setIsAnalyzingImpactValues(true);
    setActiveTab('values');
    try {
      const csv = await callGeminiAPI("analyzeImpactValue", { financials: financialProxies, impactFactors: impactFactors });
      const parsed = parseCSV(csv, parts => ({
        stakeholder: parts[0] || '',
        outcome: parts[1] || '',
        pricing: parts[2] || '',
        deadweight: parts[3] || '',
        displacement: parts[4] || '',
        attribution: parts[5] || '',
        dropOff: parts[6] || '',
        value: parts[7] || ''
      }));
      setImpactValues(parsed);
    } catch (error) {
      console.error(error);
      setErrorMsg("計算影響價值時發生錯誤。");
    } finally {
      setIsAnalyzingImpactValues(false);
    }
  };

  const triggerSROICalculation = async () => {
    if (impactValues.length === 0) {
      setErrorMsg("請先完成影響價值計算。");
      return;
    }
    setErrorMsg(null);
    setIsCalculatingSROI(true);
    setActiveTab('dashboard');
    try {
      const totalIn = userInputs.reduce((acc, curr) => acc + curr.totalValue, 0);
      const rawFunds = setupData.funds || totalIn;
      const funds = typeof rawFunds === 'string' ? (parseFloat(rawFunds.replace(/[^\d.]/g, '')) || 0) : rawFunds;

      const totalImpact = impactValues.reduce((sum, v) => {
        const numericValue = parseFloat(v.value.replace(/[^\d.]/g, '')) || 0;
        return sum + numericValue;
      }, 0);

      // SROI = 影響現值 / 總投入成本
      // 假設一年期專案，折現率 1.2%
      const discountRate = 0.012;
      const impactPresentValue = totalImpact / (1 + discountRate);
      const ratio = funds > 0 ? (impactPresentValue / funds).toFixed(2) : "0.00";

      const sroiCsv = await callGeminiAPI("calculateFinalSROI", { totalCost: funds.toString(), totalImpactValue: totalImpact.toString() });
      const sroiLines = sroiCsv.split('\n').filter((line: string) => line.trim() !== '');
      if (sroiLines.length > 1) {
        const parts = sroiLines[1].match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g)?.map((m: string) => m.replace(/^"|"$/g, '')) || [];
        setSroiResult({
          totalCost: `NT$ ${funds.toLocaleString()}`,
          totalImpactValue: `NT$ ${totalImpact.toLocaleString()}`,
          ratio: ratio,
          conclusion: parts[3] || `本專案每投入 1 元新台幣，將產生 ${ratio} 元新台幣之社會價值。`
        });
      } else {
        setSroiResult({
          totalCost: `NT$ ${funds.toLocaleString()}`,
          totalImpactValue: `NT$ ${totalImpact.toLocaleString()}`,
          ratio: ratio,
          conclusion: `本專案每投入 1 元新台幣，將產生 ${ratio} 元新台幣之社會價值。`
        });
      }
    } catch (error) {
      console.error(error);
      setErrorMsg("計算 SROI 時發生錯誤。");
    } finally {
      setIsCalculatingSROI(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f7f9] text-gray-900 font-['Inter',_'Noto_Sans_TC'] overflow-x-hidden">
      <Header
        isFullscreen={isFullscreen}
        toggleFullscreen={toggleFullscreen}
        onTriggerAI={triggerAIAnalysis}
      />

      <main className="flex-grow max-w-[1600px] w-full mx-auto px-10 py-12 space-y-12">
        {errorMsg && (
          <div className="bg-red-50 border-l-8 border-red-500 p-8 rounded-2xl flex items-center justify-between animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center space-x-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
              <p className="text-2xl font-black text-red-700">{errorMsg}</p>
            </div>
            <button onClick={() => setErrorMsg(null)} className="text-red-400 hover:text-red-600">
              <X className="w-8 h-8" />
            </button>
          </div>
        )}

        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === 'setup' && (
          <SetupTab
            isParsing={isParsing}
            setupData={setupData}
            userInputs={userInputs}
            userOutputs={userOutputs}
            fileInputRef={fileInputRef}
            handleFileChange={handleFileChange}
            onUpdateSetup={handleSetupDataChange}
            onUpdateInput={handleUpdateInput}
            onRemoveInput={handleRemoveInput}
            onAddInput={handleAddInput}
            onUpdateOutput={handleUpdateOutput}
            onRemoveOutput={handleRemoveOutput}
            onAddOutput={handleAddOutput}
            onTriggerStakeholders={triggerStakeholderAnalysis}
            onTriggerOutcomes={triggerOutcomeAnalysis}
            onTriggerFinancials={triggerFinancialProxyAnalysis}
            onTriggerImpactFactors={triggerImpactFactorAnalysis}
            onTriggerImpactValues={triggerImpactValueAnalysis}
            onTriggerSROI={triggerSROICalculation}
            onGoToDashboard={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'stakeholders' && (
          <StakeholdersTab
            stakeholders={stakeholders}
            isAnalyzing={isAnalyzingStakeholders}
            onTriggerAnalysis={triggerStakeholderAnalysis}
            onDecision={handleStakeholderDecision}
            onNext={() => triggerOutcomeAnalysis()}
          />
        )}

        {activeTab === 'outcomes' && (
          <OutcomesTab
            outcomes={outcomes}
            isAnalyzing={isAnalyzingOutcomes}
            onTriggerAnalysis={triggerOutcomeAnalysis}
            onDecision={handleOutcomeDecision}
            onNext={() => triggerFinancialProxyAnalysis()}
          />
        )}

        {activeTab === 'financials' && (
          <FinancialsTab
            financialProxies={financialProxies}
            isAnalyzing={isAnalyzingFinancialProxies}
            onTriggerAnalysis={triggerFinancialProxyAnalysis}
            onNext={() => triggerImpactFactorAnalysis()}
          />
        )}

        {activeTab === 'impact' && (
          <ImpactTab
            impactFactors={impactFactors}
            isAnalyzing={isAnalyzingImpactFactors}
            onTriggerAnalysis={triggerImpactFactorAnalysis}
            onNext={() => triggerImpactValueAnalysis()}
          />
        )}

        {activeTab === 'values' && (
          <ValuesTab
            impactValues={impactValues}
            isAnalyzing={isAnalyzingImpactValues}
            onTriggerAnalysis={triggerImpactValueAnalysis}
            onNext={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardTab
            sroiResult={sroiResult}
            isCalculating={isCalculatingSROI}
            impactValues={impactValues}
            onTriggerSROI={triggerSROICalculation}
            onNext={() => setActiveTab('ai')}
            COLORS={COLORS}
          />
        )}

        {activeTab === 'ai' && (
          <AIReportTab
            analysis={analysis}
            isAnalyzing={isAnalyzing}
          />
        )}
      </main>

      <footer className="py-20 text-center text-gray-400 font-black text-xl bg-white border-t mt-auto">
        SROI 影響力數據實驗室 &copy; 2025 全方位社會投資報酬分析平台
      </footer>
    </div>
  );
};

export default App;
