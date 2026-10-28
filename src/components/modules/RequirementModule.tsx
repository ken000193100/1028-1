import React, { useState } from 'react';
import { Requirement, Customer, Machine, UserRole } from '../../types';
import { 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  ArrowRight, 
  Building2, 
  Calendar, 
  Zap, 
  Maximize2, 
  DollarSign, 
  Send,
  Eye,
  Check,
  AlertCircle
} from 'lucide-react';

interface RequirementModuleProps {
  requirements: Requirement[];
  setRequirements: React.Dispatch<React.SetStateAction<Requirement[]>>;
  customers: Customer[];
  machines: Machine[];
  currentRole: UserRole;
  onSelectRequirementForQuote: (req: Requirement) => void;
  onNavigateToTab: (tab: string) => void;
}

export const RequirementModule: React.FC<RequirementModuleProps> = ({
  requirements,
  setRequirements,
  customers,
  machines,
  currentRole,
  onSelectRequirementForQuote,
  onNavigateToTab
}) => {
  const [selectedReqId, setSelectedReqId] = useState<string>(requirements[0]?.id || '');
  const [showNewModal, setShowNewModal] = useState<boolean>(false);

  // Form state for creating new requirement
  const [formData, setFormData] = useState({
    customerId: customers[0]?.id || '',
    contactPerson: '張組長',
    phone: '04-2359-8800',
    rawMaterialType: '紡織清梳落棉與廢紗',
    capacityKgHr: '500',
    workshopDimensions: '長 20m x 寬 6m x 高 4.5m',
    powerConditions: '380V / 60Hz / 3相 / 100kW',
    budgetTwd: '2500000',
    targetDeliveryDate: '2026-10-31',
    specialRequests: '需配備高感度金屬探測器，預防異物損壞開纖刺輥。'
  });

  const selectedReq = requirements.find(r => r.id === selectedReqId) || requirements[0];

  const canEdit = currentRole === 'customer_service' || currentRole === 'sales' || currentRole === 'admin';
  const canEvaluate = currentRole === 'engineering' || currentRole === 'admin';

  // Helper to validate completeness
  const checkMissing = (data: any) => {
    const missing: string[] = [];
    if (!data.customerId) missing.push('客戶名稱');
    if (!data.contactPerson) missing.push('聯絡人');
    if (!data.rawMaterialType) missing.push('棉花原料種類');
    if (!data.capacityKgHr || Number(data.capacityKgHr) <= 0) missing.push('需求處理量 (kg/hr)');
    if (!data.workshopDimensions || data.workshopDimensions.trim() === '') missing.push('場地尺寸 (L x W x H)');
    if (!data.powerConditions || data.powerConditions.trim() === '') missing.push('電力條件 (V/Hz/相)');
    if (!data.budgetTwd || Number(data.budgetTwd) <= 0) missing.push('預算 (TWD)');
    if (!data.targetDeliveryDate) missing.push('預計交機日期');
    return missing;
  };

  const handleCreateRequirement = (e: React.FormEvent) => {
    e.preventDefault();
    const customer = customers.find(c => c.id === formData.customerId) || customers[0];
    const missing = checkMissing(formData);
    const isComplete = missing.length === 0;

    const newReq: Requirement = {
      id: `REQ-2026-00${requirements.length + 1}`,
      customerId: formData.customerId,
      customerName: customer.companyName,
      contactPerson: formData.contactPerson,
      phone: formData.phone,
      rawMaterialType: formData.rawMaterialType,
      capacityKgHr: formData.capacityKgHr ? Number(formData.capacityKgHr) : null,
      workshopDimensions: formData.workshopDimensions,
      powerConditions: formData.powerConditions,
      budgetTwd: formData.budgetTwd ? Number(formData.budgetTwd) : null,
      targetDeliveryDate: formData.targetDeliveryDate,
      specialRequests: formData.specialRequests,
      status: isComplete ? 'pending_engineering' : 'draft',
      missingFields: missing,
      isComplete: isComplete,
      selectedMachineId: Number(formData.capacityKgHr) >= 1000 ? 'CR-1200' : Number(formData.capacityKgHr) >= 700 ? 'CR-800' : 'CR-500',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    setRequirements([newReq, ...requirements]);
    setSelectedReqId(newReq.id);
    setShowNewModal(false);
  };

  const handleSendToEngineering = (reqId: string) => {
    setRequirements(prev => prev.map(r => {
      if (r.id === reqId) {
        if (!r.isComplete) {
          alert('【阻擋送審】：此需求單尚缺少必填資料，不得送交工程評估！請先補齊缺少項目。');
          return r;
        }
        return {
          ...r,
          status: 'pending_engineering',
          updatedAt: new Date().toISOString().split('T')[0]
        };
      }
      return r;
    }));
  };

  const handleEngineeringApprove = (reqId: string, machineId: string) => {
    setRequirements(prev => prev.map(r => {
      if (r.id === reqId) {
        return {
          ...r,
          status: 'engineering_approved',
          selectedMachineId: machineId,
          updatedAt: new Date().toISOString().split('T')[0]
        };
      }
      return r;
    }));
  };

  return (
    <div className="space-y-6">
      {/* Module Title & Role Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-800/60 p-4 rounded-xl border border-slate-700">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/40">
              F02 核心模組 (P0)
            </span>
            <h1 className="text-xl font-bold text-white">客戶需求確認管理</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            輸入產能、原料、場地、預算及電力條件。系統落實「必填檢查阻擋」與「資料完整後送交工程評估」。
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          {canEdit && (
            <button
              onClick={() => setShowNewModal(true)}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-teal-600/20 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>建立新客戶需求單</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: List on Left, Detail & Validation on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Requirements List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>需求單清單 (點選切換檢視)</span>
            <span className="text-[11px] text-teal-400">{requirements.length} 筆案件</span>
          </div>

          <div className="space-y-2.5">
            {requirements.map((req) => {
              const isSelected = req.id === selectedReq?.id;

              return (
                <div
                  key={req.id}
                  onClick={() => setSelectedReqId(req.id)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer text-left ${
                    isSelected
                      ? 'bg-slate-800 border-teal-500 shadow-md shadow-teal-500/10'
                      : 'bg-slate-850 border-slate-800 hover:bg-slate-800/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs font-bold text-teal-400">{req.id}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                        req.isComplete
                          ? req.status === 'engineering_approved'
                            ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
                            : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                          : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                      }`}
                    >
                      {req.isComplete ? (req.status === 'engineering_approved' ? '工程已核定機型' : '資料完整-待評估') : '草稿 (缺少必填)'}
                    </span>
                  </div>

                  <div className="text-sm font-bold text-slate-200">{req.customerName}</div>
                  <div className="text-xs text-slate-400 mt-1 flex items-center justify-between">
                    <span>處理量: {req.capacityKgHr ? `${req.capacityKgHr} kg/hr` : '未提供(缺)'}</span>
                    <span>預算: {req.budgetTwd ? `NT$ ${(req.budgetTwd / 10000).toFixed(0)}萬` : '未提供'}</span>
                  </div>

                  {/* Missing warning if any */}
                  {!req.isComplete && (
                    <div className="mt-2 text-[11px] text-rose-300 bg-rose-950/40 border border-rose-900/60 px-2 py-1 rounded flex items-center">
                      <AlertTriangle className="w-3 h-3 mr-1 text-rose-400 shrink-0" />
                      <span>缺漏：{req.missingFields.join('、')}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Inspection & Validation */}
        {selectedReq && (
          <div className="lg:col-span-7 bg-slate-800/50 border border-slate-700 rounded-xl p-5 space-y-5">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-700/80 gap-2">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    {selectedReq.id}
                  </span>
                  <h2 className="text-base font-bold text-white">{selectedReq.customerName}</h2>
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  聯絡人：{selectedReq.contactPerson} ｜ 電話：{selectedReq.phone} ｜ 建檔日：{selectedReq.createdAt}
                </div>
              </div>

              {/* Status Badge */}
              <div>
                {selectedReq.isComplete ? (
                  <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>必填檢查 100% 齊全</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/30">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>資料缺漏 (阻擋送審)</span>
                  </span>
                )}
              </div>
            </div>

            {/* Validation Notification Banner (Scenario 1 & 2 proof) */}
            {!selectedReq.isComplete ? (
              <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/40 text-rose-200 text-xs space-y-2">
                <div className="font-bold flex items-center text-sm text-rose-300">
                  <AlertCircle className="w-4 h-4 mr-1.5 text-rose-400" />
                  【F02 必填資料未完整 系統防呆警示】：
                </div>
                <p className="leading-relaxed text-slate-300">
                  依據功能規格書 F02 驗收條件：「缺少必填資料時，系統標示缺漏；資料完整後才可送交工程評估。」目前檢測到以下必填項目尚未齊全：
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedReq.missingFields.map((field, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded bg-rose-500/20 border border-rose-500/40 text-rose-300 font-semibold">
                      ✕ 缺漏：{field}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>所有 8 項必要規格已全部驗證無誤，可直接送交工程部進行機台選型與功率核算。</span>
                </div>
              </div>
            )}

            {/* Field Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div className={`p-3 rounded-lg border ${selectedReq.rawMaterialType ? 'bg-slate-800/80 border-slate-700' : 'bg-rose-950/20 border-rose-500/50'}`}>
                <div className="text-slate-400 mb-1">棉花原料種類 (必填)</div>
                <div className="font-semibold text-slate-100">{selectedReq.rawMaterialType || '【未填寫】'}</div>
              </div>

              <div className={`p-3 rounded-lg border ${selectedReq.capacityKgHr ? 'bg-slate-800/80 border-slate-700' : 'bg-rose-950/20 border-rose-500/50'}`}>
                <div className="text-slate-400 mb-1">需求處理量 (必填)</div>
                <div className="font-semibold text-slate-100">
                  {selectedReq.capacityKgHr ? `${selectedReq.capacityKgHr} kg/hr` : '【未填寫 - 缺少】'}
                </div>
              </div>

              <div className={`p-3 rounded-lg border ${selectedReq.workshopDimensions ? 'bg-slate-800/80 border-slate-700' : 'bg-rose-950/20 border-rose-500/50'}`}>
                <div className="text-slate-400 mb-1 flex items-center">
                  <Maximize2 className="w-3.5 h-3.5 mr-1 text-slate-400" /> 場地尺寸 L*W*H (必填)
                </div>
                <div className="font-semibold text-slate-100">
                  {selectedReq.workshopDimensions || '【未填寫 - 缺少場地資訊】'}
                </div>
              </div>

              <div className={`p-3 rounded-lg border ${selectedReq.powerConditions ? 'bg-slate-800/80 border-slate-700' : 'bg-rose-950/20 border-rose-500/50'}`}>
                <div className="text-slate-400 mb-1 flex items-center">
                  <Zap className="w-3.5 h-3.5 mr-1 text-slate-400" /> 電力條件 V/Hz/kW (必填)
                </div>
                <div className="font-semibold text-slate-100">{selectedReq.powerConditions || '【未填寫】'}</div>
              </div>

              <div className={`p-3 rounded-lg border ${selectedReq.budgetTwd ? 'bg-slate-800/80 border-slate-700' : 'bg-rose-950/20 border-rose-500/50'}`}>
                <div className="text-slate-400 mb-1 flex items-center">
                  <DollarSign className="w-3.5 h-3.5 mr-1 text-slate-400" /> 客戶預算 (必填)
                </div>
                <div className="font-semibold text-slate-100">
                  {selectedReq.budgetTwd ? `NT$ ${selectedReq.budgetTwd.toLocaleString()} 元` : '【未提供】'}
                </div>
              </div>

              <div className={`p-3 rounded-lg border ${selectedReq.targetDeliveryDate ? 'bg-slate-800/80 border-slate-700' : 'bg-rose-950/20 border-rose-500/50'}`}>
                <div className="text-slate-400 mb-1 flex items-center">
                  <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" /> 預計交機日期 (必填)
                </div>
                <div className="font-semibold text-slate-100">{selectedReq.targetDeliveryDate || '【未填寫】'}</div>
              </div>
            </div>

            {/* Special Request */}
            <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700 text-xs">
              <div className="text-slate-400 mb-1">特殊工藝需求與備註：</div>
              <div className="text-slate-200">{selectedReq.specialRequests || '無特定備註'}</div>
            </div>

            {/* Engineering Evaluation Section */}
            <div className="p-4 rounded-xl bg-slate-850 border border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">工程選型核准區塊 (Engineering Evaluation)</span>
                {selectedReq.selectedMachineId && (
                  <span className="text-xs text-teal-400 font-semibold">
                    推薦機型：{selectedReq.selectedMachineId}
                  </span>
                )}
              </div>

              {selectedReq.status === 'engineering_approved' ? (
                <div className="p-3 rounded-lg bg-indigo-950/40 border border-indigo-500/40 text-xs text-indigo-200 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                    <span>工程部門已核准選型為 <strong>{selectedReq.selectedMachineId}</strong>，可立即產生報價草稿 (F07)。</span>
                  </div>
                  <button
                    onClick={() => onSelectRequirementForQuote(selectedReq)}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
                  >
                    進入報價計算 (F07)
                  </button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                  <div className="text-xs text-slate-400">
                    {selectedReq.isComplete
                      ? '資料完整度 100%。可指派工程人員進行規格評估並選定標準機型。'
                      : '⚠️ 缺少必填資料，系統已鎖定工程評估按鈕，請先補充資料。'}
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    {/* Action 1: Customer Service / Sales send to engineering */}
                    <button
                      onClick={() => handleSendToEngineering(selectedReq.id)}
                      disabled={!selectedReq.isComplete}
                      className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                        selectedReq.isComplete
                          ? 'bg-teal-600 hover:bg-teal-500 text-white shadow-md shadow-teal-600/20'
                          : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>送交工程評估</span>
                    </button>

                    {/* Action 2: Engineering approve model */}
                    {canEvaluate && selectedReq.isComplete && (
                      <button
                        onClick={() => handleEngineeringApprove(selectedReq.id, selectedReq.capacityKgHr && selectedReq.capacityKgHr >= 800 ? 'CR-800' : 'CR-500')}
                        className="flex items-center space-x-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>工程核定機型</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* New Requirement Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center">
                <FileText className="w-4 h-4 mr-2 text-teal-400" />
                新增客戶需求確認單 (F02)
              </h3>
              <button onClick={() => setShowNewModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRequirement} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">客戶公司 *</label>
                  <select
                    value={formData.customerId}
                    onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200"
                  >
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>{c.companyName}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">現場聯絡人 *</label>
                  <input
                    type="text"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200"
                    placeholder="姓名與職稱"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">棉花原料種類 * (如落棉、邊角布、廢紗)</label>
                  <input
                    type="text"
                    value={formData.rawMaterialType}
                    onChange={(e) => setFormData({ ...formData, rawMaterialType: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200"
                    placeholder="例如：紡織清梳落棉、牛仔布碎料"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">需求處理量 (kg/hr) *</label>
                  <input
                    type="number"
                    value={formData.capacityKgHr}
                    onChange={(e) => setFormData({ ...formData, capacityKgHr: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200"
                    placeholder="例如：500 或 800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">場地尺寸 (L x W x H) *</label>
                  <input
                    type="text"
                    value={formData.workshopDimensions}
                    onChange={(e) => setFormData({ ...formData, workshopDimensions: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200"
                    placeholder="例如：長 25m x 寬 8m x 高 5.5m"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">電力條件 (V/Hz/kW) *</label>
                  <input
                    type="text"
                    value={formData.powerConditions}
                    onChange={(e) => setFormData({ ...formData, powerConditions: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200"
                    placeholder="例如：380V / 60Hz / 3相 / 120kW"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">預算 (TWD) *</label>
                  <input
                    type="number"
                    value={formData.budgetTwd}
                    onChange={(e) => setFormData({ ...formData, budgetTwd: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200"
                    placeholder="例如：2500000"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">預計交機日期 *</label>
                  <input
                    type="date"
                    value={formData.targetDeliveryDate}
                    onChange={(e) => setFormData({ ...formData, targetDeliveryDate: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">特殊工藝需求 / 備註</label>
                <textarea
                  rows={2}
                  value={formData.specialRequests}
                  onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200"
                  placeholder="如除鐵磁選、防爆防塵集塵、自動打包等"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-lg shadow-md shadow-teal-600/20 cursor-pointer"
                >
                  儲存並執行必填檢查
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
