import React, { useState } from 'react';
import { Customer, UserRole } from '../../types';
import { Building2, Search, Plus, MapPin, Phone, Mail, FileText, Globe, Edit2 } from 'lucide-react';

interface CustomerModuleProps {
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  currentRole: UserRole;
  onNavigateToTab: (tab: string) => void;
}

export const CustomerModule: React.FC<CustomerModuleProps> = ({
  customers,
  setCustomers,
  currentRole,
  onNavigateToTab
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const [formData, setFormData] = useState<Partial<Customer>>({
    companyName: '',
    taxId: '',
    contactPerson: '',
    phone: '',
    email: '',
    factoryAddress: '',
    country: '台灣 (Taiwan)',
    scale: '中型紡紗回收廠',
  });

  const canEdit = currentRole === 'sales' || currentRole === 'customer_service' || currentRole === 'admin';

  const filtered = customers.filter(c => 
    c.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.factoryAddress.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCustomer) {
      setCustomers(prev => prev.map(c => c.id === editingCustomer.id ? { ...c, ...formData } as Customer : c));
      setEditingCustomer(null);
    } else {
      const newCust: Customer = {
        id: `CUST-00${customers.length + 1}`,
        companyName: formData.companyName || '新紡織股份有限公司',
        taxId: formData.taxId || '',
        contactPerson: formData.contactPerson || '',
        phone: formData.phone || '',
        email: formData.email || '',
        factoryAddress: formData.factoryAddress || '',
        country: formData.country || '台灣 (Taiwan)',
        scale: formData.scale || '中型再生纖維廠',
        historicalProjectsCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setCustomers([...customers, newCust]);
    }
    setShowAddModal(false);
  };

  const openEdit = (c: Customer) => {
    setEditingCustomer(c);
    setFormData(c);
    setShowAddModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Module Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-800/60 p-4 rounded-xl border border-slate-700">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/40">
              F01 客戶資料管理 (P0)
            </span>
            <h1 className="text-xl font-bold text-white">客戶與工廠廠址資料維護</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            維護紡織回收廠、氣流紡紗廠、無紡布代工廠基本資料、聯絡管道及歷史成交履歷。
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="搜尋公司名、聯絡人、廠址..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 w-56 sm:w-64 focus:outline-none focus:border-teal-500"
            />
          </div>

          {canEdit && (
            <button
              onClick={() => {
                setEditingCustomer(null);
                setFormData({
                  companyName: '',
                  taxId: '',
                  contactPerson: '',
                  phone: '',
                  email: '',
                  factoryAddress: '',
                  country: '台灣 (Taiwan)',
                  scale: '中型再生纖維廠',
                });
                setShowAddModal(true);
              }}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-teal-600/20 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>新增客戶</span>
            </button>
          )}
        </div>
      </div>

      {/* Customer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((c) => (
          <div key={c.id} className="bg-slate-800/50 border border-slate-700/80 rounded-xl p-5 hover:border-slate-600 transition space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold text-teal-400 bg-teal-950/40 px-2 py-0.5 rounded border border-teal-500/30">
                    {c.id}
                  </span>
                  <h3 className="font-bold text-white text-base">{c.companyName}</h3>
                </div>
                {c.taxId && <div className="text-xs text-slate-400 mt-1">統一編號 / 稅號：{c.taxId}</div>}
              </div>

              {canEdit && (
                <button
                  onClick={() => openEdit(c)}
                  className="p-1.5 text-slate-400 hover:text-teal-300 hover:bg-slate-700 rounded-lg transition cursor-pointer"
                  title="編輯資料"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300 pt-2 border-t border-slate-700/60">
              <div className="flex items-center space-x-1.5">
                <span className="text-slate-400">聯絡窗口：</span>
                <span className="font-semibold text-white">{c.contactPerson}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{c.phone}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{c.email}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <span>{c.country}</span>
              </div>
            </div>

            <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 text-xs space-y-1">
              <div className="flex items-center space-x-1.5 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>工廠地址：{c.factoryAddress}</span>
              </div>
              <div className="text-[11px] text-slate-400 pl-5">
                產能規模：{c.scale} ｜ 累計成交專案：<strong className="text-teal-300">{c.historicalProjectsCount}</strong> 案
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center">
              <Building2 className="w-4 h-4 mr-2 text-teal-400" />
              {editingCustomer ? '編輯客戶工廠資料' : '新增客戶資料'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">客戶公司全名 *</label>
                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200"
                  placeholder="例如：東南亞紡織精機股份有限公司"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">統編 / 稅號</label>
                  <input
                    type="text"
                    value={formData.taxId}
                    onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200"
                    placeholder="8碼統編"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">主要聯絡人 *</label>
                  <input
                    type="text"
                    required
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200"
                    placeholder="姓名與職稱"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">電話 *</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200"
                    placeholder="04-XXXX-XXXX"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">電子信箱 *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200"
                    placeholder="contact@factory.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">工廠廠址 *</label>
                <input
                  type="text"
                  required
                  value={formData.factoryAddress}
                  onChange={(e) => setFormData({ ...formData, factoryAddress: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200"
                  placeholder="廠房安裝實際地址"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">廠區規模與描述</label>
                <input
                  type="text"
                  value={formData.scale}
                  onChange={(e) => setFormData({ ...formData, scale: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200"
                  placeholder="如：年處理量 5000 噸牛仔布碎料"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-lg shadow-md shadow-teal-600/20 cursor-pointer"
                >
                  {editingCustomer ? '儲存修改' : '建立客戶'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
