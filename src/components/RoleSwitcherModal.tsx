import React from 'react';
import { UserRole } from '../types';
import { ROLE_PERMISSIONS } from '../data/mockData';
import { ShieldCheck, X, Check, AlertOctagon, User } from 'lucide-react';

interface RoleSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
}

export const RoleSwitcherModal: React.FC<RoleSwitcherModalProps> = ({
  isOpen,
  onClose,
  currentRole,
  onSelectRole,
}) => {
  if (!isOpen) return null;

  const roles = Object.keys(ROLE_PERMISSIONS) as UserRole[];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-800/60">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-teal-400" />
            <h2 className="text-lg font-bold text-white">五、系統使用者角色與權限切換 (Role Switcher)</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <p className="text-sm text-slate-300">
            本系統依據功能規格書第五節定義 7 類角色權限矩陣。切換身分可即時驗證各角色在需求建檔、規格核定、成本維護與審核發布的權限防護：
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {roles.map((roleKey) => {
              const info = ROLE_PERMISSIONS[roleKey];
              const isCurrent = currentRole === roleKey;

              return (
                <div
                  key={roleKey}
                  onClick={() => {
                    onSelectRole(roleKey);
                    onClose();
                  }}
                  className={`p-4 rounded-xl border transition cursor-pointer text-left relative flex flex-col justify-between ${
                    isCurrent
                      ? 'bg-teal-950/40 border-teal-500 shadow-lg shadow-teal-500/10'
                      : 'bg-slate-800/60 border-slate-700/80 hover:bg-slate-800 hover:border-slate-600'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm text-white flex items-center">
                        <User className="w-4 h-4 mr-1.5 text-teal-400" />
                        {info.label}
                      </span>
                      {isCurrent && (
                        <span className="flex items-center text-[11px] font-semibold text-teal-300 bg-teal-500/20 px-2 py-0.5 rounded-full border border-teal-500/40">
                          <Check className="w-3 h-3 mr-1" /> 當前使用中
                        </span>
                      )}
                    </div>

                    {/* Permissions */}
                    <div className="space-y-1.5 text-xs mt-3">
                      <div className="text-emerald-400 font-medium">✓ 可操作功能：</div>
                      <ul className="list-disc list-inside text-slate-300 space-y-0.5 pl-1">
                        {info.allowedActions.map((action, idx) => (
                          <li key={idx}>{action}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Restrictions */}
                    <div className="space-y-1 text-xs mt-3">
                      <div className="text-rose-400 font-medium flex items-center">
                        <AlertOctagon className="w-3 h-3 mr-1" /> 操作限制：
                      </div>
                      <ul className="list-disc list-inside text-slate-400 space-y-0.5 pl-1">
                        {info.restrictions.map((restr, idx) => (
                          <li key={idx}>{restr}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-700/50 flex justify-end">
                    <button
                      className={`text-xs px-3 py-1 rounded-md font-medium transition ${
                        isCurrent
                          ? 'bg-teal-600 text-white cursor-default'
                          : 'bg-slate-700 text-slate-200 hover:bg-teal-700 hover:text-white'
                      }`}
                    >
                      {isCurrent ? '已選定' : '切換為此角色'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-800/80 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
          <span>切換角色後，系統各模組的按鈕狀態、送審權限及警告提示將即時聯動。</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-medium transition cursor-pointer"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
};
