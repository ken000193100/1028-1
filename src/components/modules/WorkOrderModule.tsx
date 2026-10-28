import React, { useState } from 'react';
import { WorkOrder, UserRole } from '../../types';
import { 
  ClipboardList, 
  UserCheck, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Wrench, 
  Cpu, 
  HardHat, 
  Building,
  Plus
} from 'lucide-react';

interface WorkOrderModuleProps {
  workOrders: WorkOrder[];
  setWorkOrders: React.Dispatch<React.SetStateAction<WorkOrder[]>>;
  currentRole: UserRole;
  onNavigateToTab: (tab: string) => void;
}

export const WorkOrderModule: React.FC<WorkOrderModuleProps> = ({
  workOrders,
  setWorkOrders,
  currentRole,
  onNavigateToTab
}) => {
  const [selectedWoId, setSelectedWoId] = useState<string>(workOrders[0]?.id || '');
  const selectedWo = workOrders.find(w => w.id === selectedWoId) || workOrders[0];

  const canUpdate = currentRole === 'site_manager' || currentRole === 'admin';

  const phases = [
    { key: 'material_prep', label: '1. 備料採購', desc: 'BOM 料件與外購品到位' },
    { key: 'workshop_assembly', label: '2. 車間組裝', desc: '機架焊接與刺輥安裝' },
    { key: 'factory_testing', label: '3. 廠內通電試車', desc: '全載開花與除塵測試' },
    { key: 'site_commissioning', label: '4. 客戶現場調試', desc: '就位試車與驗收結案' },
  ];

  const handleUpdatePhase = (woId: string, phase: any, progress: number) => {
    setWorkOrders(prev => prev.map(w => {
      if (w.id === woId) {
        return {
          ...w,
          currentPhase: phase,
          progressPercentage: progress
        };
      }
      return w;
    }));
  };

  return (
    <div className="space-y-6">
      {/* Module Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-800/60 p-4 rounded-xl border border-slate-700">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/40">
              F11 & F12 (P1)
            </span>
            <h1 className="text-xl font-bold text-white">訂單派工與機台組裝進度追蹤</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            報價核定成立訂單後自動建立工單，指派機構、電控及現場施工主管，追蹤「備料 → 組裝 → 廠內試車 → 現場安裝」4 階段。
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Work Order List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>執行中工單清單</span>
            <span className="text-[11px] text-teal-400">{workOrders.length} 筆生產工單</span>
          </div>

          <div className="space-y-2.5">
            {workOrders.map((wo) => {
              const isSelected = wo.id === selectedWo?.id;

              return (
                <div
                  key={wo.id}
                  onClick={() => setSelectedWoId(wo.id)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer text-left ${
                    isSelected
                      ? 'bg-slate-800 border-teal-500 shadow-md shadow-teal-500/10'
                      : 'bg-slate-850 border-slate-800 hover:bg-slate-800/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-bold text-teal-400">{wo.id}</span>
                    <span className="text-xs font-bold text-teal-300 font-mono">{wo.progressPercentage}%</span>
                  </div>

                  <div className="text-sm font-bold text-white">{wo.customerName}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{wo.machineName}</div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-900 rounded-full h-1.5 mt-2.5 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-teal-500 to-emerald-400 h-1.5 rounded-full"
                      style={{ width: `${wo.progressPercentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Work Order & 4-Stage Visual Tracker */}
        {selectedWo && (
          <div className="lg:col-span-8 bg-slate-800/50 border border-slate-700 rounded-xl p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-700/80 gap-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-sm font-bold text-teal-400 bg-teal-950/60 px-2.5 py-0.5 rounded border border-teal-500/30">
                    {selectedWo.id}
                  </span>
                  <h2 className="text-base font-bold text-white">{selectedWo.customerName}</h2>
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  生產標的：<strong>{selectedWo.machineName}</strong> ｜ 對應報價：{selectedWo.quotationId}
                </div>
              </div>

              <div className="text-right">
                <div className="text-[11px] text-slate-400">總體製造進度</div>
                <div className="text-xl font-black font-mono text-teal-400">{selectedWo.progressPercentage}%</div>
              </div>
            </div>

            {/* F11 Assignees Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-slate-850 p-3.5 rounded-xl border border-slate-700 flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/30">
                  <Wrench className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-400">機構負責人 (Mechanical)</div>
                  <div className="text-xs font-bold text-white mt-0.5">{selectedWo.mechanicalLead}</div>
                </div>
              </div>

              <div className="bg-slate-850 p-3.5 rounded-xl border border-slate-700 flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-400">電控負責人 (Electrical)</div>
                  <div className="text-xs font-bold text-white mt-0.5">{selectedWo.electricalLead}</div>
                </div>
              </div>

              <div className="bg-slate-850 p-3.5 rounded-xl border border-slate-700 flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  <HardHat className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-400">現場施工主管 (Site Lead)</div>
                  <div className="text-xs font-bold text-white mt-0.5">{selectedWo.siteLead}</div>
                </div>
              </div>
            </div>

            {/* F12: 4-Phase Progress Tracker */}
            <div className="bg-slate-850 p-5 rounded-xl border border-slate-700 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center">
                  <Clock className="w-4 h-4 mr-1.5 text-teal-400" />
                  組裝與施工 4 階段進度追蹤
                </h3>
                <span className="text-[11px] text-slate-400">
                  排程：{selectedWo.startDate} ~ 預計交機 {selectedWo.targetCompleteDate}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                {phases.map((ph, idx) => {
                  const isCurrent = selectedWo.currentPhase === ph.key;
                  const isPast = 
                    (selectedWo.currentPhase === 'workshop_assembly' && idx === 0) ||
                    (selectedWo.currentPhase === 'factory_testing' && idx <= 1) ||
                    (selectedWo.currentPhase === 'site_commissioning' && idx <= 2) ||
                    (selectedWo.currentPhase === 'completed');

                  return (
                    <div
                      key={ph.key}
                      className={`p-3.5 rounded-xl border flex flex-col justify-between ${
                        isCurrent
                          ? 'bg-teal-950/40 border-teal-500 shadow-md shadow-teal-500/10'
                          : isPast
                          ? 'bg-slate-900/90 border-emerald-500/30'
                          : 'bg-slate-900/40 border-slate-800'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-xs font-bold ${isCurrent ? 'text-teal-300' : isPast ? 'text-emerald-400' : 'text-slate-400'}`}>
                            {ph.label}
                          </span>
                          {isPast && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1">{ph.desc}</div>
                      </div>

                      {canUpdate && (
                        <div className="mt-4 pt-2 border-t border-slate-700/60">
                          <button
                            onClick={() => handleUpdatePhase(selectedWo.id, ph.key, (idx + 1) * 25)}
                            className={`w-full py-1 rounded text-[10px] font-semibold transition cursor-pointer ${
                              isCurrent
                                ? 'bg-teal-600 text-white cursor-default'
                                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                            }`}
                          >
                            {isCurrent ? '目前進行中' : '推進至此階段'}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Status notes */}
              <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 text-xs text-slate-300">
                <span className="text-slate-400">最新車間施工日誌：</span>
                <span className="ml-1 text-slate-200">{selectedWo.notes || '無異常備註。'}</span>
              </div>
            </div>

            {/* Next Step Link */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => onNavigateToTab('acceptance')}
                className="flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-indigo-600/20 transition cursor-pointer"
              >
                <span>前往「驗收結案履歷 (F13)」檢視現場試車數據</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
