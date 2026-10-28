import React from 'react';
import { UserRole } from '../types';
import { ROLE_PERMISSIONS } from '../data/mockData';
import { 
  ShieldCheck, 
  Layers, 
  Cpu, 
  PlayCircle, 
  TrendingDown, 
  Clock, 
  ChevronDown,
  Sparkles,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface HeaderProps {
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  onOpenRoleModal: () => void;
  onOpenScenarioModal: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onOpenRoleModal,
  onOpenScenarioModal,
  activeTab,
  setActiveTab
}) => {
  const currentRoleInfo = ROLE_PERMISSIONS[currentRole];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-lg">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & System Name */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-teal-500 to-emerald-400 flex items-center justify-center shadow-md shadow-teal-500/20">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-slate-100">
                  棉花回收設備 AI 輔助報價與零件查詢系統
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  V1.0
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                整合需求評估、BOM展開、零件詢價、AI檢索、報價多方審核與派工履歷
              </p>
            </div>
          </div>

          {/* KPI Mini Badges & Role Controls */}
          <div className="flex items-center space-x-3">
            {/* KPI Improvement highlight */}
            <div className="hidden lg:flex items-center space-x-2 bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-lg text-xs">
              <div className="flex items-center text-emerald-400 font-medium">
                <Clock className="w-3.5 h-3.5 mr-1" />
                報價工時 <span className="font-bold ml-1 text-white">↓66%</span>
              </div>
              <span className="text-slate-600">|</span>
              <div className="flex items-center text-cyan-400 font-medium">
                <TrendingDown className="w-3.5 h-3.5 mr-1" />
                零件查詢 <span className="font-bold ml-1 text-white">↓89%</span>
              </div>
            </div>

            {/* Acceptance Scenario Simulator Button */}
            <button
              onClick={onOpenScenarioModal}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-300 border border-amber-500/40 text-xs font-medium transition cursor-pointer"
              title="執行功能規格書「第八章 功能驗收模擬」5大情境"
            >
              <PlayCircle className="w-4 h-4 text-amber-400" />
              <span>驗收情境模擬</span>
            </button>

            {/* Current Role Switcher */}
            <button
              onClick={onOpenRoleModal}
              className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer text-slate-200"
            >
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <div className="text-left hidden md:block">
                <div className="text-[10px] text-slate-400">當前身分權限</div>
                <div className="font-semibold text-teal-300">{currentRoleInfo.label.split(' ')[0]}</div>
              </div>
              <span className="md:hidden font-semibold text-teal-300">{currentRoleInfo.label.split(' ')[0]}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-slate-900/90 border-t border-slate-800/80 px-4 sm:px-6 lg:px-8 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto flex space-x-1 py-1 text-xs font-medium">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-2 rounded-md transition whitespace-nowrap cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-teal-500/20 text-teal-300 font-semibold border-b-2 border-teal-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            總覽 & KPI (F14)
          </button>
          <button
            onClick={() => setActiveTab('requirements')}
            className={`px-3 py-2 rounded-md transition whitespace-nowrap cursor-pointer ${
              activeTab === 'requirements'
                ? 'bg-teal-500/20 text-teal-300 font-semibold border-b-2 border-teal-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            客戶需求確認 (F02)
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            className={`px-3 py-2 rounded-md transition whitespace-nowrap cursor-pointer ${
              activeTab === 'customers'
                ? 'bg-teal-500/20 text-teal-300 font-semibold border-b-2 border-teal-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            客戶資料 (F01)
          </button>
          <button
            onClick={() => setActiveTab('machines')}
            className={`px-3 py-2 rounded-md transition whitespace-nowrap cursor-pointer ${
              activeTab === 'machines'
                ? 'bg-teal-500/20 text-teal-300 font-semibold border-b-2 border-teal-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            機台規格 (F03)
          </button>
          <button
            onClick={() => setActiveTab('bom')}
            className={`px-3 py-2 rounded-md transition whitespace-nowrap cursor-pointer ${
              activeTab === 'bom'
                ? 'bg-teal-500/20 text-teal-300 font-semibold border-b-2 border-teal-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            BOM零件 & 缺料 (F04/F10)
          </button>
          <button
            onClick={() => setActiveTab('prices')}
            className={`px-3 py-2 rounded-md transition whitespace-nowrap cursor-pointer ${
              activeTab === 'prices'
                ? 'bg-teal-500/20 text-teal-300 font-semibold border-b-2 border-teal-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            零件價格詢價 (F05)
          </button>
          <button
            onClick={() => setActiveTab('ai_search')}
            className={`px-3 py-2 rounded-md transition whitespace-nowrap cursor-pointer flex items-center space-x-1 ${
              activeTab === 'ai_search'
                ? 'bg-indigo-500/20 text-indigo-300 font-semibold border-b-2 border-indigo-400'
                : 'text-indigo-400 hover:text-indigo-200 hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI 資料查詢 (F06)</span>
          </button>
          <button
            onClick={() => setActiveTab('quotations')}
            className={`px-3 py-2 rounded-md transition whitespace-nowrap cursor-pointer ${
              activeTab === 'quotations'
                ? 'bg-teal-500/20 text-teal-300 font-semibold border-b-2 border-teal-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            報價草稿 & 多方審核 (F07/F08/F09)
          </button>
          <button
            onClick={() => setActiveTab('work_orders')}
            className={`px-3 py-2 rounded-md transition whitespace-nowrap cursor-pointer ${
              activeTab === 'work_orders'
                ? 'bg-teal-500/20 text-teal-300 font-semibold border-b-2 border-teal-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            工單與組裝進度 (F11/F12)
          </button>
          <button
            onClick={() => setActiveTab('acceptance')}
            className={`px-3 py-2 rounded-md transition whitespace-nowrap cursor-pointer ${
              activeTab === 'acceptance'
                ? 'bg-teal-500/20 text-teal-300 font-semibold border-b-2 border-teal-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            驗收試車結案 (F13)
          </button>
        </div>
      </div>
    </header>
  );
};
