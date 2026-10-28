import React, { useState } from 'react';
import { AcceptanceTest, UserRole } from '../../types';
import { 
  FileCheck2, 
  CheckCircle2, 
  AlertTriangle, 
  Gauge, 
  Cpu, 
  Sparkles, 
  ShieldCheck, 
  Camera, 
  FileText,
  UserCheck
} from 'lucide-react';

interface AcceptanceModuleProps {
  acceptanceTests: AcceptanceTest[];
  currentRole: UserRole;
  onNavigateToTab: (tab: string) => void;
}

export const AcceptanceModule: React.FC<AcceptanceModuleProps> = ({
  acceptanceTests,
  currentRole,
  onNavigateToTab
}) => {
  const currentTest = acceptanceTests[0];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-800/60 p-4 rounded-xl border border-slate-700">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/40">
              F13 結案模組 (P1)
            </span>
            <h1 className="text-xl font-bold text-white">設備試車、驗收結案與數位履歷管理</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            保存全載實測產能、纖維開花率、除雜率、5 大安全驗收項目檢核及機台終身技術履歷。
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>驗收測試合格 (已結案)</span>
          </span>
        </div>
      </div>

      {/* Main Acceptance Summary Card */}
      {currentTest && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 space-y-6 shadow-xl">
          {/* Top banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-700/80 gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-sm font-bold text-teal-400 bg-teal-950/60 px-2.5 py-0.5 rounded border border-teal-500/30">
                  {currentTest.id}
                </span>
                <h2 className="text-base font-bold text-white">{currentTest.machineName}</h2>
              </div>
              <div className="text-xs text-slate-400 mt-1">
                對應工單：{currentTest.workOrderId} ｜ 試車驗收日期：{currentTest.testDate}
              </div>
            </div>

            <div className="text-xs text-slate-300 bg-slate-900/60 px-3.5 py-2 rounded-xl border border-slate-800">
              <div>品保查驗工程師：<strong className="text-white">{currentTest.inspector}</strong></div>
              <div>客戶授權簽收代表：<strong className="text-teal-300">{currentTest.customerRepresentative}</strong></div>
            </div>
          </div>

          {/* Test Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800">
              <div className="text-slate-400 text-xs mb-1">實測連續產能 (Capacity)</div>
              <div className="text-xl font-black font-mono text-emerald-400">
                {currentTest.measuredCapacityKgHr} <span className="text-xs font-normal text-slate-400">kg/hr</span>
              </div>
              <div className="text-[11px] text-emerald-400 mt-1">
                ✓ 達標 (額定: {currentTest.ratedCapacityKgHr} kg/hr)
              </div>
            </div>

            <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800">
              <div className="text-slate-400 text-xs mb-1">纖維開花蓬鬆率</div>
              <div className="text-xl font-black font-mono text-cyan-300">
                {currentTest.fiberOpeningRate}%
              </div>
              <div className="text-[11px] text-cyan-400 mt-1">
                ✓ 優於標準 (≥ 95.0%)
              </div>
            </div>

            <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800">
              <div className="text-slate-400 text-xs mb-1">雜質與塵屑排雜率</div>
              <div className="text-xl font-black font-mono text-teal-300">
                {currentTest.impurityRemovalRate}%
              </div>
              <div className="text-[11px] text-teal-400 mt-1">
                ✓ 弧形微孔梳板過濾合格
              </div>
            </div>

            <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800">
              <div className="text-slate-400 text-xs mb-1">實測滿載運轉耗電</div>
              <div className="text-xl font-black font-mono text-amber-300">
                {currentTest.powerConsumptionKw} <span className="text-xs font-normal text-slate-400">kW</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                噪音: {currentTest.noiseLevelDb} dB (符合法規)
              </div>
            </div>
          </div>

          {/* 5 Checkpoints */}
          <div className="bg-slate-850 p-5 rounded-xl border border-slate-700 space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center">
              <ShieldCheck className="w-4 h-4 mr-1.5 text-teal-400" />
              現場試車關鍵安全與工藝 Checkpoints 查驗表
            </h3>

            <div className="space-y-2">
              {currentTest.checkpoints.map((cp, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center space-x-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[11px]">
                      {idx + 1}
                    </span>
                    <div>
                      <span className="font-semibold text-white">{cp.name}</span>
                      <span className="text-slate-400 ml-2">合格基準：{cp.standard}</span>
                    </div>
                  </div>

                  <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                    查驗合格 (PASS)
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Equipment Digital Passport */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="font-bold text-white mb-0.5">數位設備身分履歷已建立 (Digital Passport)</div>
              <div className="text-slate-400">
                出廠編號：CR800-TW-2026-088 ｜ 全機保固起訖日：2026-04-15 ~ 2027-04-14 (12 個月)
              </div>
            </div>

            <button
              onClick={() => alert('已下載設備數位履歷與維護保養手冊 (PDF)。')}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition cursor-pointer"
            >
              下載設備履歷書
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
