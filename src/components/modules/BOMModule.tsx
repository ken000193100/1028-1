import React, { useState } from 'react';
import { BOMItem, Machine, UserRole } from '../../types';
import { 
  FileSpreadsheet, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  Download, 
  Upload, 
  Package, 
  Layers, 
  Tag, 
  DollarSign, 
  Filter,
  AlertCircle
} from 'lucide-react';

interface BOMModuleProps {
  bomItems: BOMItem[];
  setBomItems: React.Dispatch<React.SetStateAction<BOMItem[]>>;
  machines: Machine[];
  selectedMachineId: string;
  setSelectedMachineId: (id: string) => void;
  currentRole: UserRole;
  onNavigateToTab: (tab: string) => void;
}

export const BOMModule: React.FC<BOMModuleProps> = ({
  bomItems,
  setBomItems,
  machines,
  selectedMachineId,
  setSelectedMachineId,
  currentRole,
  onNavigateToTab
}) => {
  const currentMachine = machines.find(m => m.id === selectedMachineId) || machines[0];
  const [selectedVersion, setSelectedVersion] = useState<string>(currentMachine?.currentBomVersion || 'Rev B.2');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [moduleFilter, setModuleFilter] = useState<string>('all');
  const [showImportNotice, setShowImportNotice] = useState<boolean>(false);

  // Sync version if machine changes
  React.useEffect(() => {
    if (currentMachine) {
      setSelectedVersion(currentMachine.currentBomVersion);
    }
  }, [selectedMachineId]);

  // Strict version filter: Do NOT mix different versions!
  const currentBOMItems = bomItems.filter(item => 
    item.machineId === selectedMachineId && 
    item.bomVersion === selectedVersion
  );

  const filteredItems = currentBOMItems.filter(item => {
    const matchesSearch = 
      item.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.partName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.moduleGroup.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesModule = moduleFilter === 'all' || item.moduleGroup === moduleFilter;
    return matchesSearch && matchesModule;
  });

  // Calculate total material cost of this BOM version
  const totalBOMCost = currentBOMItems.reduce((acc, item) => acc + (item.unitPriceTwd * item.quantity), 0);
  const expiredItems = currentBOMItems.filter(item => item.isPriceExpired);
  const lowStockItems = currentBOMItems.filter(item => item.currentStock < item.quantity);

  const uniqueModules = Array.from(new Set(currentBOMItems.map(item => item.moduleGroup)));

  // Excel export simulation
  const handleExportCSV = () => {
    const headers = ['機型', 'BOM版本', '模組分組', '零件料號', '品名', '規格', '單位', '數量', '單價(TWD)', '小計(TWD)', '供應商', '報價效期', '過期狀態', '庫存狀態'];
    const rows = currentBOMItems.map(item => [
      item.machineId,
      item.bomVersion,
      item.moduleGroup,
      item.partNumber,
      `"${item.partName}"`,
      `"${item.specification}"`,
      item.unit,
      item.quantity,
      item.unitPriceTwd,
      item.unitPriceTwd * item.quantity,
      `"${item.supplier}"`,
      item.priceValidUntil,
      item.isPriceExpired ? '⚠️ 價格已逾期' : '有效',
      item.stockStatus
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `BOM_${selectedMachineId}_${selectedVersion}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSimulateImport = () => {
    setShowImportNotice(true);
    setTimeout(() => setShowImportNotice(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Title Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-800/60 p-4 rounded-xl border border-slate-700">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/40">
              F04 (P0) & F10 (P1)
            </span>
            <h1 className="text-xl font-bold text-white">BOM 零件展開、成本總表與庫存缺料檢核</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            依機型展開核定 BOM 清單、查詢料號與版本差異。落實嚴格版本隔離（不得混用不同版本）與價格過期警示。
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-teal-400" />
            <span>匯出 BOM (CSV)</span>
          </button>

          <button
            onClick={handleSimulateImport}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-teal-600/20 transition cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>匯入 Excel BOM</span>
          </button>
        </div>
      </div>

      {showImportNotice && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-500/50 rounded-xl text-emerald-200 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Excel BOM 解析匯入驗證成功！共核對 9 項料件，版本號自動鎖定為 {selectedVersion}，無混用衝突。</span>
          </div>
          <button onClick={() => setShowImportNotice(false)} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
        </div>
      )}

      {/* Control bar: Machine selection & Strict BOM version selector */}
      <div className="bg-slate-850 p-4 rounded-xl border border-slate-700 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
        {/* Machine selector */}
        <div className="sm:col-span-4 flex items-center space-x-2">
          <span className="text-xs text-slate-400 whitespace-nowrap">選擇機台型號：</span>
          <select
            value={selectedMachineId}
            onChange={(e) => setSelectedMachineId(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs font-bold text-teal-300 w-full"
          >
            {machines.map(m => (
              <option key={m.id} value={m.id}>{m.id} - {m.name}</option>
            ))}
          </select>
        </div>

        {/* Version selector with strict isolation */}
        <div className="sm:col-span-4 flex items-center space-x-2">
          <span className="text-xs text-slate-400 whitespace-nowrap">BOM 版本：</span>
          <select
            value={selectedVersion}
            onChange={(e) => setSelectedVersion(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs font-mono font-bold text-cyan-300 w-full"
          >
            {currentMachine?.availableBomVersions.map(v => (
              <option key={v} value={v}>
                {v} {v === currentMachine.currentBomVersion ? ' (★ 最新核定版)' : ' (歷史版本)'}
              </option>
            ))}
          </select>
        </div>

        {/* Total Cost rollup */}
        <div className="sm:col-span-4 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
          <div className="text-left">
            <div className="text-[10px] text-slate-400">核定 BOM 材料總成本</div>
            <div className="text-base font-black font-mono text-teal-400">
              NT$ {totalBOMCost.toLocaleString()}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-slate-400">料件項數</div>
            <div className="text-xs font-bold text-slate-200">{currentBOMItems.length} 項</div>
          </div>
        </div>
      </div>

      {/* Warning Bar if any expired parts or low inventory */}
      {expiredItems.length > 0 && (
        <div className="p-3.5 bg-rose-950/30 border border-rose-500/40 rounded-xl text-rose-200 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>
              <strong>【F05 價格逾期警告】</strong>：此 BOM 版本中包含 <strong>{expiredItems.length}</strong> 項零件價格已過期（如 {expiredItems.map(i => i.partNumber).join(', ')}）。請採購主管至「零件價格詢價 (F05)」更新有效報價，否則正式報價單將無法發出！
            </span>
          </div>
          <button
            onClick={() => onNavigateToTab('prices')}
            className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded text-[11px] font-semibold whitespace-nowrap ml-3 cursor-pointer"
          >
            前往採購更新
          </button>
        </div>
      )}

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400">模組過濾：</span>
          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="bg-slate-850 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200"
          >
            <option value="all">全機所有模組 ({currentBOMItems.length})</option>
            {uniqueModules.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="搜尋料號、品名、供應商..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
          />
        </div>
      </div>

      {/* BOM Table */}
      <div className="bg-slate-850 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-3.5 font-semibold">模組分組</th>
                <th className="py-3 px-3.5 font-semibold">零件料號 (Part No.)</th>
                <th className="py-3 px-3.5 font-semibold">品名與技術規格</th>
                <th className="py-3 px-3.5 font-semibold text-center">單位</th>
                <th className="py-3 px-3.5 font-semibold text-right">用量</th>
                <th className="py-3 px-3.5 font-semibold text-right">核定單價 (TWD)</th>
                <th className="py-3 px-3.5 font-semibold text-right">小計成本 (TWD)</th>
                <th className="py-3 px-3.5 font-semibold">特約供應商</th>
                <th className="py-3 px-3.5 font-semibold text-center">報價效期 / 狀態</th>
                <th className="py-3 px-3.5 font-semibold text-center">庫存 (F10)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-500">
                    此機型與版本 ({selectedVersion}) 無符合搜尋條件之料件項目。
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const subtotal = item.unitPriceTwd * item.quantity;

                  return (
                    <tr 
                      key={item.id} 
                      className={`hover:bg-slate-800/50 transition ${item.isPriceExpired ? 'bg-rose-950/15' : ''}`}
                    >
                      <td className="py-3 px-3.5 font-medium text-slate-400">
                        <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[11px] text-slate-300">
                          {item.moduleGroup}
                        </span>
                      </td>

                      <td className="py-3 px-3.5 font-mono font-bold text-teal-400">
                        {item.partNumber}
                      </td>

                      <td className="py-3 px-3.5 max-w-xs">
                        <div className="font-semibold text-white">{item.partName}</div>
                        <div className="text-[11px] text-slate-400 truncate">{item.specification}</div>
                      </td>

                      <td className="py-3 px-3.5 text-center text-slate-400">
                        {item.unit}
                      </td>

                      <td className="py-3 px-3.5 text-right font-bold text-white font-mono">
                        {item.quantity}
                      </td>

                      <td className="py-3 px-3.5 text-right font-mono text-slate-200">
                        ${item.unitPriceTwd.toLocaleString()}
                      </td>

                      <td className="py-3 px-3.5 text-right font-mono font-bold text-teal-300">
                        ${subtotal.toLocaleString()}
                      </td>

                      <td className="py-3 px-3.5 text-slate-300">
                        {item.supplier}
                      </td>

                      <td className="py-3 px-3.5 text-center">
                        {item.isPriceExpired ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 inline-flex items-center">
                            <AlertTriangle className="w-3 h-3 mr-1" /> 已逾期 ({item.priceValidUntil})
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                            至 {item.priceValidUntil}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3.5 text-center">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                          現存 {item.currentStock} {item.unit}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
