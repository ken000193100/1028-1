import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Search, 
  FileCheck2, 
  PlayCircle, 
  ArrowRight, 
  ShieldAlert,
  Sparkles,
  Info,
  X
} from 'lucide-react';

interface ScenarioSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab: (tab: string) => void;
}

export const ScenarioSimulatorModal: React.FC<ScenarioSimulatorModalProps> = ({
  isOpen,
  onClose,
  onNavigateToTab,
}) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<number>(1);

  if (!isOpen) return null;

  const scenarios = [
    {
      id: 1,
      title: '情境一：需求資料完整',
      subtitle: '可進入工程評估',
      status: 'pass',
      icon: CheckCircle2,
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      expectedBehavior: '客服已提供產能 (500 kg/hr)、原料種類 (紡織落棉)、場地 (25m x 8m x 5.5m)、電力 (380V/60Hz/3相) 等必要資料。系統檢查必填欄位 100% 齊全，自動生成 REQ-2026-001，並解鎖「送交工程評估」按鈕。',
      targetModule: 'requirements',
      targetLabel: '前往「客戶需求確認 (F02)」查看 REQ-2026-001',
      validationCriteria: '必填欄位檢查正確率 100%，符合 F02 驗收條件。'
    },
    {
      id: 2,
      title: '情境二：缺少場地或產能資訊',
      subtitle: '系統標示缺漏並防呆阻擋',
      status: 'warning',
      icon: AlertTriangle,
      badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      expectedBehavior: '以台南興國無紡科技 (REQ-2026-003) 為例，未填寫場地尺寸與需求處理量。系統即時以紅色警示框標記缺漏項，狀態維持「草稿 (缺少資料)」，並強制停用「送交工程評估」功能，避免工程師徒勞無功。',
      targetModule: 'requirements',
      targetLabel: '前往「客戶需求確認 (F02)」查看缺少欄位的 REQ-2026-003',
      validationCriteria: '缺少必填資料時，系統標示缺漏；資料完整後才可送交工程評估。'
    },
    {
      id: 3,
      title: '情境三：零件價格已過期',
      subtitle: '標記警告並提示採購重新詢價',
      status: 'danger',
      icon: AlertTriangle,
      badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
      expectedBehavior: '核對 CR-500 BOM 清單，發現料號「PRT-BD-1022 可調弧形微孔除雜梳針梳板組」之報價有效期為 2026-02-10（已逾期）。系統自動在 BOM 與報價單中標注「⚠️ 價格已過期」，採購審核維持 Pending，主管端正式發送報價按鈕強制鎖定。',
      targetModule: 'quotations',
      targetLabel: '前往「報價審核 (F08)」查看 QT-2026-008 之過期料件警示',
      validationCriteria: '零件單價過期即時示警，未經採購重詢覆核前不得發布正式報價。'
    },
    {
      id: 4,
      title: '情境四：AI 找不到可靠 BOM',
      subtitle: '提示無法確認，嚴禁虛構編造',
      status: 'info',
      icon: Search,
      badgeColor: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
      expectedBehavior: '當使用者或業務詢問未收錄的「CR-999 超級回收機」或非標準自訂零件時，AI 檢索模組依據規格書 F06 驗收規範，明確提示「查無核定可靠資料，無法確認」，並給出資料來源註記，絕不幻覺自行編造料號、價格或產能。',
      targetModule: 'ai_search',
      targetLabel: '前往「AI 資料查詢 (F06)」實測未知機型檢索',
      validationCriteria: '每項關鍵答案顯示來源；沒有可靠資料時提示無法確認，不得自行編造。'
    },
    {
      id: 5,
      title: '情境五：報價已完成並審核',
      subtitle: '多方授權後發送正式對外報價',
      status: 'pass',
      icon: FileCheck2,
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      expectedBehavior: '宏遠興業二林廠 (QT-2026-005) 經工程、採購、業務及總經理全體審核通過，審核狀態轉為「已核定」，系統解鎖「發送正式報價」與「轉建立工單 (F11)」功能，並可直接預覽、列印與下載正式帶印章與防偽條碼之合約級報價單。',
      targetModule: 'quotations',
      targetLabel: '前往「報價模組」檢視已核准之 QT-2026-005 與正式報價單輸出',
      validationCriteria: '四方授權完成才可正式對外發送，自動銜接工單與派工管理。'
    }
  ];

  const currentScenario = scenarios.find(s => s.id === selectedScenarioId) || scenarios[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-800/80">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <PlayCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">八、功能規格書 功能驗收模擬器 (Interactive Acceptance Simulator)</h2>
              <p className="text-xs text-slate-400">點擊切換測試情境，驗證第一版 MVP 系統在各關鍵節點的防呆、檢查與 AI 嚴謹處理機制</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left: Scenarios Selector */}
          <div className="md:col-span-5 space-y-2">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              選擇測試情境 (5 大驗收情境)：
            </div>
            {scenarios.map((sc) => {
              const Icon = sc.icon;
              const isSelected = selectedScenarioId === sc.id;

              return (
                <button
                  key={sc.id}
                  onClick={() => setSelectedScenarioId(sc.id)}
                  className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800 border-teal-500 shadow-md shadow-teal-500/10'
                      : 'bg-slate-850 border-slate-800 hover:bg-slate-800/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-1.5 rounded-lg border ${sc.badgeColor}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className={`text-xs font-bold ${isSelected ? 'text-teal-300' : 'text-slate-200'}`}>
                        {sc.title}
                      </div>
                      <div className="text-[11px] text-slate-400">{sc.subtitle}</div>
                    </div>
                  </div>
                  {isSelected && <ArrowRight className="w-4 h-4 text-teal-400" />}
                </button>
              );
            })}
          </div>

          {/* Right: Detailed Simulation Analysis */}
          <div className="md:col-span-7 bg-slate-800/50 border border-slate-700/80 rounded-xl p-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${currentScenario.badgeColor}`}>
                  {currentScenario.title}
                </span>
                <span className="text-xs text-slate-400 flex items-center">
                  <Info className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  規格書第八節標準測試案
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white mb-1">
                  系統預期處理機制：{currentScenario.subtitle}
                </h3>
                <p className="text-xs leading-relaxed text-slate-300 bg-slate-900/60 p-3.5 rounded-lg border border-slate-800">
                  {currentScenario.expectedBehavior}
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="text-xs font-semibold text-teal-400 flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> 驗收條件檢核標準 (Acceptance Criteria)：
                </div>
                <div className="text-xs text-slate-300 pl-4 border-l-2 border-teal-500/40">
                  {currentScenario.validationCriteria}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-700 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                可立即切換至對應模組進行現場操作驗證
              </span>
              <button
                onClick={() => {
                  onNavigateToTab(currentScenario.targetModule);
                  onClose();
                }}
                className="flex items-center space-x-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold transition shadow-md shadow-teal-600/20 cursor-pointer"
              >
                <span>{currentScenario.targetLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-800/80 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
          <span>第一版驗收目標：需求檢查正確率 100%、BOM 一致率 100%、AI 來源引用正確率 ≥ 95%、工時降低 ≥ 30%。</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-medium transition cursor-pointer"
          >
            關閉視窗
          </button>
        </div>
      </div>
    </div>
  );
};
