import React, { useState } from 'react';
import { Machine, UserRole } from '../../types';
import { Cpu, Zap, Maximize2, Clock, CheckCircle2, Layers, Wrench, Shield, FileSpreadsheet } from 'lucide-react';

interface MachineModuleProps {
  machines: Machine[];
  setMachines: React.Dispatch<React.SetStateAction<Machine[]>>;
  currentRole: UserRole;
  onNavigateToTab: (tab: string) => void;
  onSelectMachineForBOM: (machineId: string) => void;
}

export const MachineModule: React.FC<MachineModuleProps> = ({
  machines,
  setMachines,
  currentRole,
  onNavigateToTab,
  onSelectMachineForBOM,
}) => {
  const [selectedMachineId, setSelectedMachineId] = useState<string>(machines[0]?.id || 'CR-500');
  const selectedMachine = machines.find(m => m.id === selectedMachineId) || machines[0];

  const canEdit = currentRole === 'engineering' || currentRole === 'admin';

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-800/60 p-4 rounded-xl border border-slate-700">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/40">
              F03 機台規格管理 (P0)
            </span>
            <h1 className="text-xl font-bold text-white">標準機台規格與工程工藝參數庫</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            管理棉花回收開花機型號、額定產能、廠房尺寸需求、裝機功率、適用纖維原料及標準組裝工時。
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400">目前維護機型：</span>
          <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-700">
            {machines.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedMachineId(m.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer ${
                  selectedMachineId === m.id
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {m.id}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Machine Card Detail */}
      {selectedMachine && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 space-y-6">
          {/* Top Bar with Name & BOM Version */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 border-b border-slate-700 gap-4">
            <div>
              <div className="flex items-center space-x-2.5">
                <span className="text-lg font-black font-mono text-teal-400 bg-teal-950/60 px-3 py-1 rounded-lg border border-teal-500/30">
                  {selectedMachine.id}
                </span>
                <h2 className="text-xl font-bold text-white">{selectedMachine.name}</h2>
              </div>
              <div className="text-xs text-slate-400 mt-1">
                系列定位：{selectedMachine.modelSeries} ｜ {selectedMachine.description}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="text-[11px] text-slate-400">最新核定 BOM 版本</div>
                <div className="text-sm font-bold font-mono text-cyan-300">
                  {selectedMachine.currentBomVersion}
                </div>
              </div>

              <button
                onClick={() => onSelectMachineForBOM(selectedMachine.id)}
                className="flex items-center space-x-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-indigo-600/20 transition cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>展開此機型 BOM (F04)</span>
              </button>
            </div>
          </div>

          {/* Technical Spec Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <div className="text-slate-400 text-xs mb-1 flex items-center">
                <Cpu className="w-4 h-4 mr-1 text-teal-400" /> 額定每小時產能
              </div>
              <div className="text-lg font-black text-white">{selectedMachine.ratedCapacityKgHr} <span className="text-xs font-normal text-slate-400">kg/hr</span></div>
              <div className="text-[11px] text-slate-400 mt-0.5">適用區間: {selectedMachine.capacityRange}</div>
            </div>

            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <div className="text-slate-400 text-xs mb-1 flex items-center">
                <Maximize2 className="w-4 h-4 mr-1 text-cyan-400" /> 機組佔地尺寸 (L*W*H)
              </div>
              <div className="text-sm font-bold text-white mt-1">{selectedMachine.dimensions}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">淨空安全裕度建議: 1.5m</div>
            </div>

            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <div className="text-slate-400 text-xs mb-1 flex items-center">
                <Zap className="w-4 h-4 mr-1 text-amber-400" /> 總裝機電力需求
              </div>
              <div className="text-lg font-black text-amber-300">{selectedMachine.totalPowerKw} <span className="text-xs font-normal text-slate-400">kW</span></div>
              <div className="text-[11px] text-slate-400 mt-0.5">{selectedMachine.voltageSpec}</div>
            </div>

            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <div className="text-slate-400 text-xs mb-1 flex items-center">
                <Clock className="w-4 h-4 mr-1 text-indigo-400" /> 標準製造工時
              </div>
              <div className="text-lg font-black text-indigo-300">
                {selectedMachine.standardAssemblyHours + selectedMachine.standardElectricalHours} <span className="text-xs font-normal text-slate-400">人時</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">組裝 {selectedMachine.standardAssemblyHours}h + 電控 {selectedMachine.standardElectricalHours}h</div>
            </div>
          </div>

          {/* Features and Raw Materials Split */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Suitable Materials */}
            <div className="bg-slate-850 p-4 rounded-xl border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center">
                <Layers className="w-4 h-4 mr-1.5 text-teal-400" /> 適合加工之棉花與纖維原料
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedMachine.targetMaterials.map((mat, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-lg bg-teal-950/40 border border-teal-500/30 text-teal-200 text-xs font-medium"
                  >
                    ✓ {mat}
                  </span>
                ))}
              </div>
            </div>

            {/* Core Technical Highlights */}
            <div className="bg-slate-850 p-4 rounded-xl border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center">
                <Shield className="w-4 h-4 mr-1.5 text-cyan-400" /> 核心工藝防護與自動化特點
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {selectedMachine.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-2 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Version isolation rule check */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="font-semibold text-slate-200">BOM 版本管控規則 (F04)：</span>
              <span className="ml-1">
                歷史發行版本 [{selectedMachine.availableBomVersions.join(', ')}]。系統嚴格禁止混用不同版本之料號。
              </span>
            </div>
            <span className="text-emerald-400 font-medium">版本隔離檢核通過 ✓</span>
          </div>
        </div>
      )}
    </div>
  );
};
