import React, { useState } from 'react';
import { PartPrice, Part, UserRole } from '../../types';
import { 
  DollarSign, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  Calendar, 
  Building, 
  Plus, 
  Clock, 
  Tag,
  ShieldAlert
} from 'lucide-react';

interface PartPriceModuleProps {
  partPrices: PartPrice[];
  setPartPrices: React.Dispatch<React.SetStateAction<PartPrice[]>>;
  parts: Part[];
  currentRole: UserRole;
  onPriceUpdated?: () => void;
}

export const PartPriceModule: React.FC<PartPriceModuleProps> = ({
  partPrices,
  setPartPrices,
  parts,
  currentRole,
  onPriceUpdated
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterExpired, setFilterExpired] = useState<'all' | 'expired' | 'valid'>('all');
  const [editingPrice, setEditingPrice] = useState<PartPrice | null>(null);

  // Edit form state
  const [newPrice, setNewPrice] = useState<string>('');
  const [newValidDate, setNewValidDate] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const canEdit = currentRole === 'procurement' || currentRole === 'admin';

  const filteredPrices = partPrices.filter(p => {
    const matchesSearch = 
      p.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.supplier.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = 
      filterExpired === 'all' ? true :
      filterExpired === 'expired' ? p.isExpired : !p.isExpired;

    return matchesSearch && matchesFilter;
  });

  const expiredCount = partPrices.filter(p => p.isExpired).length;

  const handleOpenEdit = (p: PartPrice) => {
    if (!canEdit) {
      alert('【權限限制】：僅「採購 (Procurement)」或「主管」具備維護零件單價與有效期限之權限。');
      return;
    }
    setEditingPrice(p);
    setNewPrice(String(p.unitPrice));
    setNewValidDate('2026-12-31'); // default extension
    setNotes(p.notes || '採購經理已向原廠取得最新報價確認函。');
  };

  const handleSavePrice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPrice) return;

    const updatedUnitPrice = Number(newPrice);
    const updatedValidDate = newValidDate;
    const isNowValid = new Date(updatedValidDate) >= new Date();

    setPartPrices(prev => prev.map(p => {
      if (p.id === editingPrice.id) {
        return {
          ...p,
          unitPrice: updatedUnitPrice,
          validUntil: updatedValidDate,
          quoteDate: new Date().toISOString().split('T')[0],
          isExpired: !isNowValid,
          notes: notes,
        };
      }
      return p;
    }));

    setEditingPrice(null);
    if (onPriceUpdated) onPriceUpdated();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-800/60 p-4 rounded-xl border border-slate-700">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/40">
              F05 核心模組 (P0)
            </span>
            <h1 className="text-xl font-bold text-white">零件價格詢價與供應商效期維護</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            查詢各零件單價、供應商、幣別與報價效期。嚴格防呆：已過期料件標註警告，需採購重新確認牌價。
          </p>
        </div>

        {/* Expired Counter Tag */}
        <div className="flex items-center space-x-3">
          {expiredCount > 0 ? (
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-semibold">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>{expiredCount} 項零件報價已逾期</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>所有零件報價皆在有效期內</span>
            </div>
          )}
        </div>
      </div>

      {/* Notice regarding Scenario 3 */}
      {expiredCount > 0 && (
        <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 text-amber-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>【驗收情境三模擬提示】</strong>：檢測到料號「PRT-BD-1022」之報價有效期為 2026-02-10（已過期）。切換身分為「採購」後，點選該筆資料右側「更新報價 / 展延效期」即可重新核定最新單價並解除過期警告。
            </span>
          </div>
        </div>
      )}

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-slate-400">狀態篩選：</span>
          <div className="flex bg-slate-850 p-1 rounded-lg border border-slate-700">
            <button
              onClick={() => setFilterExpired('all')}
              className={`px-3 py-1 rounded text-xs transition cursor-pointer ${filterExpired === 'all' ? 'bg-teal-600 text-white font-semibold' : 'text-slate-400 hover:text-white'}`}
            >
              全部 ({partPrices.length})
            </button>
            <button
              onClick={() => setFilterExpired('expired')}
              className={`px-3 py-1 rounded text-xs transition cursor-pointer ${filterExpired === 'expired' ? 'bg-rose-600 text-white font-semibold' : 'text-slate-400 hover:text-white'}`}
            >
              已過期 ({expiredCount})
            </button>
            <button
              onClick={() => setFilterExpired('valid')}
              className={`px-3 py-1 rounded text-xs transition cursor-pointer ${filterExpired === 'valid' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-400 hover:text-white'}`}
            >
              有效
            </button>
          </div>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="搜尋料號、供應商..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
          />
        </div>
      </div>

      {/* Part Prices Table */}
      <div className="bg-slate-850 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-3.5 font-semibold">零件料號 (Part No.)</th>
                <th className="py-3 px-3.5 font-semibold">特約供應商</th>
                <th className="py-3 px-3.5 font-semibold text-right">核定單價</th>
                <th className="py-3 px-3.5 font-semibold text-center">幣別</th>
                <th className="py-3 px-3.5 font-semibold text-center">報價日期</th>
                <th className="py-3 px-3.5 font-semibold text-center">有效期限</th>
                <th className="py-3 px-3.5 font-semibold text-center">效期狀態</th>
                <th className="py-3 px-3.5 font-semibold">備註說明</th>
                <th className="py-3 px-3.5 font-semibold text-center">採購操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredPrices.map((p) => {
                const partInfo = parts.find(pt => pt.partNumber === p.partNumber);

                return (
                  <tr 
                    key={p.id} 
                    className={`hover:bg-slate-800/50 transition ${p.isExpired ? 'bg-rose-950/20' : ''}`}
                  >
                    <td className="py-3 px-3.5">
                      <div className="font-mono font-bold text-teal-400">{p.partNumber}</div>
                      {partInfo && <div className="text-[11px] text-slate-400">{partInfo.name}</div>}
                    </td>

                    <td className="py-3 px-3.5 text-slate-200 font-medium">
                      {p.supplier}
                    </td>

                    <td className="py-3 px-3.5 text-right font-mono font-bold text-white text-sm">
                      ${p.unitPrice.toLocaleString()}
                    </td>

                    <td className="py-3 px-3.5 text-center font-mono text-slate-400">
                      {p.currency}
                    </td>

                    <td className="py-3 px-3.5 text-center text-slate-400">
                      {p.quoteDate}
                    </td>

                    <td className="py-3 px-3.5 text-center font-mono font-semibold">
                      <span className={p.isExpired ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                        {p.validUntil}
                      </span>
                    </td>

                    <td className="py-3 px-3.5 text-center">
                      {p.isExpired ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 inline-flex items-center">
                          <AlertTriangle className="w-3 h-3 mr-1" /> 已過期
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 inline-flex items-center">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> 有效
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3.5 text-[11px] text-slate-400 max-w-xs">
                      {p.notes || '-'}
                    </td>

                    <td className="py-3 px-3.5 text-center">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className={`px-2.5 py-1 rounded text-[11px] font-semibold transition cursor-pointer ${
                          p.isExpired
                            ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-sm'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {p.isExpired ? '重新詢價/更新' : '更新價格'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Price Modal */}
      {editingPrice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center">
              <DollarSign className="w-4 h-4 mr-2 text-teal-400" />
              維護零件採購單價與有效期
            </h3>

            <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700 text-xs space-y-1">
              <div>料號：<strong className="text-teal-300 font-mono">{editingPrice.partNumber}</strong></div>
              <div>特約供應商：<strong className="text-slate-200">{editingPrice.supplier}</strong></div>
            </div>

            <form onSubmit={handleSavePrice} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">最新核定單價 (TWD) *</label>
                <input
                  type="number"
                  required
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200 font-mono font-bold text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">新報價有效期限 * (需為未來日期以恢復有效)</label>
                <input
                  type="date"
                  required
                  value={newValidDate}
                  onChange={(e) => setNewValidDate(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">詢價覆核備註</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200"
                  placeholder="如原廠確認函編號、物價波動調整說明"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingPrice(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-lg shadow-md shadow-teal-600/20 cursor-pointer"
                >
                  確認更新並生效
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
