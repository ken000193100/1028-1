import React, { useState } from 'react';
import { Quotation, Requirement, Machine, BOMItem, UserRole, ApprovalRecord } from '../../types';
import { generateAIQuotationSummary } from '../../services/api';
import { 
  FileText, 
  DollarSign, 
  Calculator, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Send, 
  Printer, 
  Download, 
  History, 
  UserCheck, 
  Lock, 
  Unlock,
  ChevronRight,
  TrendingUp,
  Percent,
  Plus
} from 'lucide-react';

interface QuotationModuleProps {
  quotations: Quotation[];
  setQuotations: React.Dispatch<React.SetStateAction<Quotation[]>>;
  requirements: Requirement[];
  machines: Machine[];
  bomItems: BOMItem[];
  currentRole: UserRole;
  onNavigateToTab: (tab: string) => void;
  activeQuotationId?: string;
}

export const QuotationModule: React.FC<QuotationModuleProps> = ({
  quotations,
  setQuotations,
  requirements,
  machines,
  bomItems,
  currentRole,
  onNavigateToTab,
  activeQuotationId
}) => {
  const [selectedQuoteId, setSelectedQuoteId] = useState<string>(
    activeQuotationId || quotations[0]?.id || ''
  );
  const [showFormalModal, setShowFormalModal] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // Compare version state (F09)
  const [diffMode, setDiffMode] = useState(false);

  const selectedQuote = quotations.find(q => q.id === selectedQuoteId) || quotations[0];

  // Helper to re-evaluate approval status
  const canReviewEngineering = currentRole === 'engineering' || currentRole === 'admin';
  const canReviewProcurement = currentRole === 'procurement' || currentRole === 'admin';
  const canReviewSales = currentRole === 'sales' || currentRole === 'admin';
  const canApproveExecutive = currentRole === 'admin';

  // Handle Approvals
  const handleApproveStep = (role: 'engineering' | 'procurement' | 'sales' | 'executive') => {
    if (!selectedQuote) return;

    if (role === 'executive') {
      if (!selectedQuote.engineeringApproved || !selectedQuote.procurementApproved || !selectedQuote.salesApproved) {
        alert('【審核阻擋】：工程、採購與業務三方皆審核通過後，主管方可核准正式報價！');
        return;
      }
      if (selectedQuote.hasExpiredParts) {
        alert('【審核阻擋】：BOM 中尚有已過期之零件價格，採購尚未更新前，嚴禁主管核發正式報價！');
        return;
      }
    }

    const approverName = 
      role === 'engineering' ? '黃志明 (資深機械工程師)' :
      role === 'procurement' ? '周淑華 (採購主管)' :
      role === 'sales' ? '王大同 (業務部經理)' : '李國柱 (總經理)';

    const newRecord: ApprovalRecord = {
      id: `APP-${Date.now()}`,
      quotationId: selectedQuote.id,
      role: role,
      approverName: approverName,
      status: 'approved',
      comment: `${role.toUpperCase()} 查核無誤，核准通過。`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    setQuotations(prev => prev.map(q => {
      if (q.id === selectedQuote.id) {
        const eng = role === 'engineering' ? true : q.engineeringApproved;
        const proc = role === 'procurement' ? true : q.procurementApproved;
        const sls = role === 'sales' ? true : q.salesApproved;
        const exec = role === 'executive' ? true : q.executiveApproved;
        const isAll = eng && proc && sls && exec;

        return {
          ...q,
          engineeringApproved: eng,
          procurementApproved: proc,
          salesApproved: sls,
          executiveApproved: exec,
          isFullyApproved: isAll,
          approvalHistory: [...q.approvalHistory, newRecord]
        };
      }
      return q;
    }));
  };

  // Send formal quote to customer
  const handleSendFormal = () => {
    if (!selectedQuote.isFullyApproved) {
      alert('【發送阻擋】：未經主管最終批核之報價單，嚴格禁止對外發送！');
      return;
    }
    setQuotations(prev => prev.map(q => {
      if (q.id === selectedQuote.id) {
        return {
          ...q,
          isFormalSent: true
        };
      }
      return q;
    }));
    setShowFormalModal(true);
  };

  // Trigger AI Text generation
  const handleGenerateAIProposal = async () => {
    if (!selectedQuote) return;
    setIsAiGenerating(true);

    try {
      const machine = machines.find(m => m.id === selectedQuote.machineId);
      const req = requirements.find(r => r.id === selectedQuote.requirementId);

      const aiData = await generateAIQuotationSummary({
        customerName: selectedQuote.customerName,
        machineName: selectedQuote.machineName,
        capacityKgHr: req?.capacityKgHr || machine?.ratedCapacityKgHr || 500,
        rawMaterialType: req?.rawMaterialType || '紡織落棉與廢紗',
        totalCost: selectedQuote.totalCost,
        finalPrice: selectedQuote.finalQuotedPrice,
        marginRate: selectedQuote.marginRate,
        bomVersion: selectedQuote.bomVersion,
      });

      setQuotations(prev => prev.map(q => {
        if (q.id === selectedQuote.id) {
          return {
            ...q,
            aiExecutiveSummary: aiData.aiExecutiveSummary,
            aiTechnicalGuarantee: aiData.aiTechnicalGuarantee,
            aiDeliveryNotice: aiData.aiDeliveryNotice,
          };
        }
        return q;
      }));
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Module Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-800/60 p-4 rounded-xl border border-slate-700">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/40">
              F07, F08 (P0) & F09 (P1)
            </span>
            <h1 className="text-xl font-bold text-white">報價成本引擎、多方審核與版本管理</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            依核定 BOM 材料、組裝工時、運輸調試費及利潤率自動計算報價。工程、採購、業務及主管四方審批核准後，方可對外發送。
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {selectedQuote && (
            <button
              onClick={() => setShowFormalModal(true)}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/30 rounded-lg text-xs font-semibold transition cursor-pointer"
            >
              <Printer className="w-4 h-4 text-teal-400" />
              <span>預覽正式報價單 (合約格式)</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Quote List & Active Quote Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Quote List & Version Selector */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>報價單庫存 (點選檢視)</span>
            <span className="text-[11px] text-teal-400">{quotations.length} 份文件</span>
          </div>

          <div className="space-y-2.5">
            {quotations.map((q) => {
              const isSelected = q.id === selectedQuote?.id;

              return (
                <div
                  key={q.id}
                  onClick={() => setSelectedQuoteId(q.id)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer text-left ${
                    isSelected
                      ? 'bg-slate-800 border-teal-500 shadow-md shadow-teal-500/10'
                      : 'bg-slate-850 border-slate-800 hover:bg-slate-800/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-bold text-teal-400">{q.id}</span>
                    <span className="text-[10px] font-mono font-bold bg-slate-900 px-2 py-0.5 rounded text-cyan-300 border border-slate-700">
                      {q.version}
                    </span>
                  </div>

                  <div className="text-sm font-bold text-white">{q.customerName}</div>
                  <div className="text-xs text-slate-400 mt-1">{q.machineName}</div>

                  <div className="mt-2.5 pt-2 border-t border-slate-700/60 flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-teal-300">
                      NT$ {q.finalQuotedPrice.toLocaleString()}
                    </span>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                        q.isFormalSent
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/40'
                          : q.isFullyApproved
                          ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/40'
                          : 'bg-amber-500/10 text-amber-300 border-amber-500/40'
                      }`}
                    >
                      {q.isFormalSent ? '已正式發送客戶' : q.isFullyApproved ? '四方已核定' : '跨部門審核中'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Cost Breakdown Engine & Approval Workflow */}
        {selectedQuote && (
          <div className="lg:col-span-8 bg-slate-800/50 border border-slate-700 rounded-xl p-6 space-y-6">
            {/* Top Quote Info Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-700/80 gap-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-sm font-bold text-teal-400 bg-teal-950/60 px-2.5 py-0.5 rounded border border-teal-500/30">
                    {selectedQuote.id}
                  </span>
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                    版本 {selectedQuote.version}
                  </span>
                  <h2 className="text-base font-bold text-white">{selectedQuote.customerName}</h2>
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  核定機型：<strong>{selectedQuote.machineName}</strong> (BOM 版本: <strong>{selectedQuote.bomVersion}</strong>)
                </div>
              </div>

              {/* Status Indicator */}
              <div>
                {selectedQuote.isFullyApproved ? (
                  <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/40">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>四方審核全數核准</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/40">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>審核未齊全 (正式報價已鎖定)</span>
                  </span>
                )}
              </div>
            </div>

            {/* Expired Warning Banner (Scenario 3 proof) */}
            {selectedQuote.hasExpiredParts && (
              <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/50 text-rose-200 text-xs space-y-2">
                <div className="font-bold flex items-center text-sm text-rose-300">
                  <AlertTriangle className="w-4 h-4 mr-1.5 text-rose-400" />
                  【F05 / F08 零件價格過期示警 ＆ 主管核准阻擋】：
                </div>
                <p className="leading-relaxed text-slate-300">
                  本報價單之 BOM 中有 <strong>{selectedQuote.expiredPartsCount}</strong> 項零件之報價有效期已過期（未確認項目：{selectedQuote.unconfirmedItems.join('；')}）。採購部尚未重新確認價格前，<strong>系統嚴格阻擋主管最終核可</strong>。
                </p>
                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => onNavigateToTab('prices')}
                    className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded text-xs font-semibold transition cursor-pointer"
                  >
                    前往零件價格庫更新牌價 →
                  </button>
                </div>
              </div>
            )}

            {/* F07: Cost Breakdown Matrix */}
            <div className="bg-slate-850 p-5 rounded-xl border border-slate-700 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center">
                  <Calculator className="w-4 h-4 mr-1.5 text-teal-400" />
                  成本結構拆解樹狀明細 (Cost Breakdown)
                </h3>
                <span className="text-[11px] text-slate-400">固定公式：總成本 = 材料 + 工時 + 運載調試</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                  <div className="text-slate-400 mb-0.5">1. 核定材料零件成本</div>
                  <div className="font-mono font-bold text-sm text-white">
                    ${selectedQuote.bomPartsCost.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">依 {selectedQuote.bomVersion} 核定</div>
                </div>

                <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                  <div className="text-slate-400 mb-0.5">2. 製造組裝與電控工時</div>
                  <div className="font-mono font-bold text-sm text-cyan-300">
                    ${selectedQuote.laborAssemblyCost.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">標準 160 工時費率</div>
                </div>

                <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                  <div className="text-slate-400 mb-0.5">3. 運載吊裝與現場調試</div>
                  <div className="font-mono font-bold text-sm text-amber-300">
                    ${selectedQuote.freightAndInstallCost.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">含 5 日現場全載試車</div>
                </div>

                <div className="bg-teal-950/40 p-3 rounded-lg border border-teal-500/40">
                  <div className="text-teal-300 font-semibold mb-0.5">總製造成本 (Base Cost)</div>
                  <div className="font-mono font-black text-sm text-teal-200">
                    ${selectedQuote.totalCost.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-teal-400 mt-0.5">成本基線 100%</div>
                </div>
              </div>

              {/* Price Calculation Engine */}
              <div className="pt-2 border-t border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                <div className="flex items-center space-x-4">
                  <div>
                    <span className="text-slate-400">設定目標毛利率：</span>
                    <strong className="text-teal-300 font-mono font-bold ml-1">
                      {(selectedQuote.marginRate * 100).toFixed(0)}%
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400">專案授權折扣：</span>
                    <strong className="text-amber-300 font-mono font-bold ml-1">
                      {(selectedQuote.discountRate * 100).toFixed(0)}%
                    </strong>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[11px] text-slate-400">最終對外報價 (未稅 / TWD)</div>
                  <div className="text-xl font-black font-mono text-teal-400">
                    NT$ {selectedQuote.finalQuotedPrice.toLocaleString()} 元整
                  </div>
                </div>
              </div>
            </div>

            {/* AI Proposal Narrative Generator (F07 Requirement) */}
            <div className="bg-slate-850 p-5 rounded-xl border border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    AI 智慧報價提案與技術保證書自動整理
                  </h3>
                </div>

                <button
                  onClick={handleGenerateAIProposal}
                  disabled={isAiGenerating}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-indigo-600/20 transition cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isAiGenerating ? 'AI 生成整理中...' : '重新生成 AI 提案'}</span>
                </button>
              </div>

              <div className="space-y-2 text-xs text-slate-300 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                <div>
                  <strong className="text-indigo-300 block mb-1">【商務提案高階概述】：</strong>
                  <p className="leading-relaxed">{selectedQuote.aiExecutiveSummary || '尚未生成提案文字，請點選上方按鈕自動生成。'}</p>
                </div>
                <div className="pt-2 border-t border-slate-800">
                  <strong className="text-teal-300 block mb-1">【技術性能與產能保證承諾】：</strong>
                  <p className="leading-relaxed whitespace-pre-line">{selectedQuote.aiTechnicalGuarantee || '保證產能、除雜與防護安全承諾。'}</p>
                </div>
              </div>
            </div>

            {/* F08: Multi-Party Approval Workflow */}
            <div className="bg-slate-850 p-5 rounded-xl border border-slate-700 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center">
                  <UserCheck className="w-4 h-4 mr-1.5 text-teal-400" />
                  四方審核簽核流程 (Engineering, Procurement, Sales, Executive)
                </h3>
                <span className="text-[11px] text-slate-400">落實職責分離與權限卡控</span>
              </div>

              {/* 4 Approval Steps Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                {/* 1. Engineering */}
                <div className={`p-3.5 rounded-xl border flex flex-col justify-between ${
                  selectedQuote.engineeringApproved
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-900 border-slate-700 text-slate-400'
                }`}>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-white">1. 工程技術審核</span>
                      {selectedQuote.engineeringApproved && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    </div>
                    <div className="text-[11px] text-slate-400">核定機型與工藝參數</div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-700/60">
                    {selectedQuote.engineeringApproved ? (
                      <span className="text-[11px] font-semibold text-emerald-400">✓ 工程已核准</span>
                    ) : (
                      <button
                        onClick={() => handleApproveStep('engineering')}
                        disabled={!canReviewEngineering}
                        className={`w-full py-1 rounded text-[11px] font-semibold cursor-pointer ${
                          canReviewEngineering ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                        }`}
                      >
                        工程簽核
                      </button>
                    )}
                  </div>
                </div>

                {/* 2. Procurement */}
                <div className={`p-3.5 rounded-xl border flex flex-col justify-between ${
                  selectedQuote.procurementApproved
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-900 border-slate-700 text-slate-400'
                }`}>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-white">2. 採購成本審核</span>
                      {selectedQuote.procurementApproved && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    </div>
                    <div className="text-[11px] text-slate-400">零件價格與交期確認</div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-700/60">
                    {selectedQuote.procurementApproved ? (
                      <span className="text-[11px] font-semibold text-emerald-400">✓ 採購已核准</span>
                    ) : (
                      <button
                        onClick={() => handleApproveStep('procurement')}
                        disabled={!canReviewProcurement}
                        className={`w-full py-1 rounded text-[11px] font-semibold cursor-pointer ${
                          canReviewProcurement ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                        }`}
                      >
                        採購簽核
                      </button>
                    )}
                  </div>
                </div>

                {/* 3. Sales */}
                <div className={`p-3.5 rounded-xl border flex flex-col justify-between ${
                  selectedQuote.salesApproved
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-900 border-slate-700 text-slate-400'
                }`}>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-white">3. 業務毛利確認</span>
                      {selectedQuote.salesApproved && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    </div>
                    <div className="text-[11px] text-slate-400">利潤率與商務條款</div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-700/60">
                    {selectedQuote.salesApproved ? (
                      <span className="text-[11px] font-semibold text-emerald-400">✓ 業務已確認</span>
                    ) : (
                      <button
                        onClick={() => handleApproveStep('sales')}
                        disabled={!canReviewSales}
                        className={`w-full py-1 rounded text-[11px] font-semibold cursor-pointer ${
                          canReviewSales ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                        }`}
                      >
                        業務簽核
                      </button>
                    )}
                  </div>
                </div>

                {/* 4. Executive */}
                <div className={`p-3.5 rounded-xl border flex flex-col justify-between ${
                  selectedQuote.executiveApproved
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-900 border-slate-700 text-slate-400'
                }`}>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-white">4. 總經理 / 主管</span>
                      {selectedQuote.executiveApproved && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    </div>
                    <div className="text-[11px] text-slate-400">最高對外授權批核</div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-700/60">
                    {selectedQuote.executiveApproved ? (
                      <span className="text-[11px] font-semibold text-emerald-400">✓ 主管已核准</span>
                    ) : (
                      <button
                        onClick={() => handleApproveStep('executive')}
                        disabled={!canApproveExecutive || selectedQuote.hasExpiredParts}
                        className={`w-full py-1 rounded text-[11px] font-semibold cursor-pointer ${
                          canApproveExecutive && !selectedQuote.hasExpiredParts
                            ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-sm'
                            : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                        }`}
                        title={selectedQuote.hasExpiredParts ? 'BOM 存在過期料件，阻擋核准' : '總經理批核'}
                      >
                        主管批核
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Action: Send formal quote */}
              <div className="pt-3 border-t border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-slate-400">
                  {selectedQuote.isFullyApproved
                    ? '全體部門審核完畢！業務人員已被授權發送正式正式商業報價單。'
                    : '⚠️ 需完成全部門審批且無逾期料件，系統才會解鎖正式對外發送。'}
                </div>

                <button
                  onClick={handleSendFormal}
                  disabled={!selectedQuote.isFullyApproved}
                  className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-lg cursor-pointer ${
                    selectedQuote.isFullyApproved
                      ? 'bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white shadow-teal-600/30'
                      : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  <span>發送正式報價單 (Formal Quotation)</span>
                </button>
              </div>
            </div>

            {/* Approval History Log */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center">
                <History className="w-3.5 h-3.5 mr-1.5 text-teal-400" />
                審核簽核軌跡記錄 (Audit Trail)：
              </div>
              <div className="space-y-1.5">
                {selectedQuote.approvalHistory.map((rec) => (
                  <div key={rec.id} className="text-xs bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-white">{rec.approverName}</span>
                      <span className="text-slate-400 ml-2">{rec.comment}</span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500">{rec.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Formal Quotation Preview / Print Modal */}
      {showFormalModal && selectedQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-2xl w-full max-w-4xl shadow-2xl p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Print Header */}
            <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
              <div>
                <div className="text-2xl font-black tracking-tight text-slate-900">
                  台灣精密紡織機械工業股份有限公司
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  TAIWAN PRECISION TEXTILE MACHINERY CO., LTD. ｜ 營業統編：88992200
                </div>
                <div className="text-xs text-slate-500">
                  地址：台中市精密機械科技創新園區精科路100號 ｜ 電話：04-2350-9988
                </div>
              </div>

              <div className="text-right">
                <div className="text-xl font-black text-teal-800">正式商業報價單</div>
                <div className="font-mono text-xs font-bold text-slate-700">單號：{selectedQuote.id}</div>
                <div className="text-xs text-slate-600">版本：{selectedQuote.version}</div>
                <div className="text-xs text-slate-600">發行日期：{new Date().toISOString().split('T')[0]}</div>
              </div>
            </div>

            {/* Client & Machine Info */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <div className="font-bold text-slate-900 mb-1">【買方客戶資訊】：</div>
                <div>公司名稱：{selectedQuote.customerName}</div>
                <div>聯絡需求：{selectedQuote.requirementId}</div>
                <div>付款條件：簽約訂金 30%、廠內試車合格出廠 50%、現場驗收 20%</div>
              </div>

              <div>
                <div className="font-bold text-slate-900 mb-1">【指定標的設備】：</div>
                <div>機台型號：{selectedQuote.machineName}</div>
                <div>核定 BOM 版本：{selectedQuote.bomVersion}</div>
                <div>保固條款：全機原廠保固 12 個月 (含刺輥針布磨損檢測)</div>
              </div>
            </div>

            {/* Price Table */}
            <table className="w-full text-xs text-left border-collapse border border-slate-300">
              <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                <tr>
                  <th className="p-2.5 border border-slate-300">項目說明</th>
                  <th className="p-2.5 border border-slate-300">規格說明</th>
                  <th className="p-2.5 border border-slate-300 text-center">數量</th>
                  <th className="p-2.5 border border-slate-300 text-right">含稅單價 (TWD)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2.5 border border-slate-300 font-bold">{selectedQuote.machineName}</td>
                  <td className="p-2.5 border border-slate-300 text-slate-600">
                    整套落棉回收開花流水線（含喂棉金屬探測、粗撕碎機、合金刺輥分梳組、脈衝集塵系統、西門子 PLC 集中電控）
                  </td>
                  <td className="p-2.5 border border-slate-300 text-center font-bold">1 套</td>
                  <td className="p-2.5 border border-slate-300 text-right font-mono font-bold">
                    ${selectedQuote.finalQuotedPrice.toLocaleString()}
                  </td>
                </tr>
                <tr>
                  <td className="p-2.5 border border-slate-300 font-bold">現場吊裝與安裝調試</td>
                  <td className="p-2.5 border border-slate-300 text-slate-600">
                    含台灣本島貨運、廠內吊裝定位、5 工作天試車調試及操作人員培訓
                  </td>
                  <td className="p-2.5 border border-slate-300 text-center font-bold">1 式</td>
                  <td className="p-2.5 border border-slate-300 text-right font-mono text-emerald-700 font-bold">
                    包含於合約總價
                  </td>
                </tr>
              </tbody>
              <tfoot className="bg-slate-50 font-bold">
                <tr>
                  <td colSpan={3} className="p-2.5 border border-slate-300 text-right text-slate-700">
                    總報價金額 (新台幣 TWD)：
                  </td>
                  <td className="p-2.5 border border-slate-300 text-right font-mono text-base text-teal-800">
                    NT$ {selectedQuote.finalQuotedPrice.toLocaleString()} 元整
                  </td>
                </tr>
              </tfoot>
            </table>

            {/* AI Executive Summary and Technical Guarantee inside Formal Quote */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="font-bold text-slate-900">【工程性能保證及出機說明】：</div>
              <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                {selectedQuote.aiTechnicalGuarantee}
              </p>
              <p className="text-slate-600 leading-relaxed pt-1 border-t border-slate-200">
                {selectedQuote.aiDeliveryNotice}
              </p>
            </div>

            {/* Signature Stamps */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-300 text-xs">
              <div className="border border-slate-300 p-3 rounded-lg text-center relative h-28 flex flex-col justify-between">
                <div className="font-bold text-slate-700">工程技術核定章</div>
                <div className="text-[11px] text-emerald-700 font-semibold border-2 border-emerald-600 rounded-lg p-1 mx-4">
                  [工程部-黃志明 核准]
                </div>
                <div className="text-[10px] text-slate-400">已核定 BOM Rev B.2</div>
              </div>

              <div className="border border-slate-300 p-3 rounded-lg text-center relative h-28 flex flex-col justify-between">
                <div className="font-bold text-slate-700">採購成本簽章</div>
                <div className="text-[11px] text-emerald-700 font-semibold border-2 border-emerald-600 rounded-lg p-1 mx-4">
                  [採購處-周淑華 覆核]
                </div>
                <div className="text-[10px] text-slate-400">價格效期查核無誤</div>
              </div>

              <div className="border border-slate-300 p-3 rounded-lg text-center relative h-28 flex flex-col justify-between">
                <div className="font-bold text-slate-700">總經理授權正印</div>
                <div className="text-[11px] text-rose-700 font-semibold border-2 border-rose-600 rounded-lg p-1 mx-4">
                  [李國柱 准予發行]
                </div>
                <div className="text-[10px] text-slate-400">正本正式有效</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-200">
              <button
                onClick={() => setShowFormalModal(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-semibold cursor-pointer"
              >
                關閉預覽
              </button>

              <button
                onClick={() => {
                  window.print();
                }}
                className="flex items-center space-x-1.5 px-5 py-2.5 bg-teal-700 hover:bg-teal-600 text-white rounded-lg text-xs font-bold shadow-md cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>列印或下載 PDF 報價單</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
