import React from 'react';
import { KPIStats, UserRole } from '../../types';
import { 
  TrendingDown, 
  Clock, 
  BarChart3, 
  Award, 
  CheckCircle2, 
  ArrowUpRight, 
  Users, 
  FileCheck2,
  Sparkles,
  Zap
} from 'lucide-react';

interface KPIDashboardModuleProps {
  kpiStats: KPIStats;
  currentRole: UserRole;
  onNavigateToTab: (tab: string) => void;
  onOpenScenarioModal: () => void;
}

export const KPIDashboardModule: React.FC<KPIDashboardModuleProps> = ({
  kpiStats,
  currentRole,
  onNavigateToTab,
  onOpenScenarioModal
}) => {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-800/60 p-4 rounded-xl border border-slate-700">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/40">
              F14 績效儀表板 (P1)
            </span>
            <h1 className="text-xl font-bold text-white">棉花回收設備 AI 系統 KPI 與營運成效報表</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            規格書核心目標檢驗：縮短報價時間 ≥ 30%、零件查詢時間 ≥ 50%，並大幅減少跨部門重複確認。
          </p>
        </div>

        <button
          onClick={onOpenScenarioModal}
          className="flex items-center space-x-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-semibold transition cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>運行八、驗收模擬器 (5 大情境)</span>
        </button>
      </div>

      {/* 2 Flagship KPI Cards: Quote Time & Parts Inquiry Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* KPI 1: Quotation Lead Time Reduction */}
        <div className="bg-gradient-to-br from-slate-850 to-slate-900 border border-teal-500/30 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center">
              <Clock className="w-4 h-4 mr-1.5" /> 系統主要目標一：縮短報價時間 (目標降幅 ≥ 30%)
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              超標達成 220%
            </span>
          </div>

          <div className="flex items-baseline space-x-3">
            <div className="text-4xl font-black font-mono text-emerald-400">
              ↓ {kpiStats.hoursReducedPercentage}%
            </div>
            <div className="text-xs text-slate-400">
              平均單張報價工時大幅節省 <strong>{(kpiStats.averageQuotationHoursBefore - kpiStats.averageQuotationHoursCurrent).toFixed(1)}</strong> 小時
            </div>
          </div>

          {/* Visual Comparison Bar */}
          <div className="space-y-2 pt-2">
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>導入系統前 (人工多部門反覆確認)</span>
                <span className="font-mono font-bold text-slate-300">{kpiStats.averageQuotationHoursBefore} 小時</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                <div className="bg-slate-600 h-3 rounded-full w-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-teal-300 font-semibold mb-1">
                <span>AI 輔助報價系統 (當前平均)</span>
                <span className="font-mono font-bold text-emerald-400">{kpiStats.averageQuotationHoursCurrent} 小時 (1個工作天內)</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-teal-500 to-emerald-400 h-3 rounded-full"
                  style={{ width: `${(kpiStats.averageQuotationHoursCurrent / kpiStats.averageQuotationHoursBefore) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* KPI 2: Parts Inquiry Time Reduction */}
        <div className="bg-gradient-to-br from-slate-850 to-slate-900 border border-cyan-500/30 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center">
              <TrendingDown className="w-4 h-4 mr-1.5" /> 系統主要目標二：縮短零件查詢時間 (目標降幅 ≥ 50%)
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              超標達成 178%
            </span>
          </div>

          <div className="flex items-baseline space-x-3">
            <div className="text-4xl font-black font-mono text-cyan-300">
              ↓ {kpiStats.queryMinutesReducedPercentage}%
            </div>
            <div className="text-xs text-slate-400">
              查詢時間由 <strong>{kpiStats.averagePartsQueryMinutesBefore} 分鐘</strong> 銳減至 <strong>{kpiStats.averagePartsQueryMinutesCurrent} 分鐘</strong>
            </div>
          </div>

          {/* Visual Comparison Bar */}
          <div className="space-y-2 pt-2">
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>過去翻查紙本目錄與舊 Excel</span>
                <span className="font-mono font-bold text-slate-300">{kpiStats.averagePartsQueryMinutesBefore} 分鐘</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                <div className="bg-slate-600 h-3 rounded-full w-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-cyan-300 font-semibold mb-1">
                <span>AI 自然語言與料號檢索 (當前)</span>
                <span className="font-mono font-bold text-cyan-400">{kpiStats.averagePartsQueryMinutesCurrent} 分鐘 (秒級檢索)</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-cyan-500 to-blue-400 h-3 rounded-full"
                  style={{ width: `${(kpiStats.averagePartsQueryMinutesCurrent / kpiStats.averagePartsQueryMinutesBefore) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Operational Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-850 p-4 rounded-xl border border-slate-700">
          <div className="text-slate-400 text-xs mb-1">進行中報價單量</div>
          <div className="text-2xl font-black font-mono text-white">{kpiStats.activeQuotationsCount} 件</div>
          <div className="text-[11px] text-teal-400 mt-1 flex items-center">
            <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> 涵蓋台灣、越南、東南亞
          </div>
        </div>

        <div className="bg-slate-850 p-4 rounded-xl border border-slate-700">
          <div className="text-slate-400 text-xs mb-1">本月核定發出報價</div>
          <div className="text-2xl font-black font-mono text-cyan-300">{kpiStats.monthlyApprovedQuotesCount} 件</div>
          <div className="text-[11px] text-slate-400 mt-1">100% 通過多方審查</div>
        </div>

        <div className="bg-slate-850 p-4 rounded-xl border border-slate-700">
          <div className="text-slate-400 text-xs mb-1">報價成交轉換率 (Win Rate)</div>
          <div className="text-2xl font-black font-mono text-emerald-400">{kpiStats.conversionRate}%</div>
          <div className="text-[11px] text-emerald-400 mt-1">大幅領先同業 (平均 45%)</div>
        </div>

        <div className="bg-slate-850 p-4 rounded-xl border border-slate-700">
          <div className="text-slate-400 text-xs mb-1">準時交機率 (On-Time Delivery)</div>
          <div className="text-2xl font-black font-mono text-amber-300">{kpiStats.onTimeDeliveryRate}%</div>
          <div className="text-[11px] text-slate-400 mt-1">工單 4 階段精準管控</div>
        </div>
      </div>

      {/* Cross-Department Alignment Success Story */}
      <div className="bg-slate-850 p-5 rounded-xl border border-slate-700 space-y-3">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center">
          <Award className="w-4 h-4 mr-1.5 text-teal-400" />
          跨部門協同效益驗證 (Cross-Department Collaboration)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
          <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
            <strong className="text-teal-300 block mb-1">✓ 客服／業務端：</strong>
            <span>需求欄位防呆完整，必填檢查 100% 杜絕「接單規格不明確、事後找工程扯皮」的舊習。</span>
          </div>
          <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
            <strong className="text-cyan-300 block mb-1">✓ 工程／採購端：</strong>
            <span>BOM 版本嚴格鎖定隔離，過期單價即時紅字預警，不再發生因舊料號舊牌價導致賠本報價。</span>
          </div>
          <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
            <strong className="text-indigo-300 block mb-1">✓ 主管／管理層：</strong>
            <span>全流程可追溯之審批簽章與身分履歷，權限卡控滴水不漏，一鍵掌控全局交付績效。</span>
          </div>
        </div>
      </div>
    </div>
  );
};
