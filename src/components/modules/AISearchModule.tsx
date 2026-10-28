import React, { useState } from 'react';
import { AISearchResult, UserRole, Machine } from '../../types';
import { queryAIKnowledgeBase } from '../../services/api';
import { 
  Sparkles, 
  Search, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  BookOpen, 
  ShieldCheck, 
  History, 
  Copy, 
  Check, 
  FileText,
  HelpCircle
} from 'lucide-react';

interface AISearchModuleProps {
  currentRole: UserRole;
  machines: Machine[];
  onNavigateToTab: (tab: string) => void;
}

export const AISearchModule: React.FC<AISearchModuleProps> = ({
  currentRole,
  machines,
  onNavigateToTab
}) => {
  const [query, setQuery] = useState('');
  const [selectedMachine, setSelectedMachine] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AISearchResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [historyQueries, setHistoryQueries] = useState<string[]>([
    '這台棉花回收機 (CR-500) 需要哪些主要零件與核定 BOM？',
    '找出與每小時處理 500 公斤需求相關的歷史機型與規格參數。',
    '開花分梳針輥採用何種針布齒密度？供應商單價為何？',
    '查詢 CR-999 超級旗艦開花機之 BOM（測試情境四：查無可靠資料防呆）'
  ]);

  const handleSearch = async (queryText?: string) => {
    const q = (queryText || query).trim();
    if (!q) return;

    setLoading(true);
    setResult(null);

    try {
      const activeMachine = selectedMachine === 'all' ? undefined : selectedMachine;
      const res = await queryAIKnowledgeBase(q, activeMachine, currentRole);
      setResult(res);

      if (!historyQueries.includes(q)) {
        setHistoryQueries(prev => [q, ...prev.slice(0, 5)]);
      }
    } catch (err: any) {
      console.error(err);
      setResult({
        query: q,
        answer: '連線查詢異常，請稍後重試。',
        sources: []
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Module Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-800/60 p-4 rounded-xl border border-slate-700">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 flex items-center">
              <Sparkles className="w-3.5 h-3.5 mr-1 text-indigo-400" /> F06 核心模組 (P0)
            </span>
            <h1 className="text-xl font-bold text-white">AI 智慧資料查詢與工程知識庫檢索</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            以自然語言或關鍵字搜尋機台、BOM 與歷史專案。系統自動標示資料來源及核定版本；查無資料時嚴格提示無法確認，絕不虛構！
          </p>
        </div>

        {/* Grounding guarantee badge */}
        <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>F06 嚴格防幻覺與來源引註驗收標準</span>
        </div>
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="space-y-2">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center">
          <History className="w-3.5 h-3.5 mr-1.5 text-teal-400" />
          規格書標準測試題目 (點擊立即實測)：
        </div>
        <div className="flex flex-wrap gap-2">
          {historyQueries.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuery(item);
                handleSearch(item);
              }}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-300 border border-slate-700/80 hover:border-indigo-500/60 transition cursor-pointer text-left"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input Box */}
      <div className="bg-slate-850 border border-slate-700 rounded-2xl p-4 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="w-full sm:w-48 shrink-0">
            <select
              value={selectedMachine}
              onChange={(e) => setSelectedMachine(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-200 font-semibold"
            >
              <option value="all">檢索範圍：全機型庫</option>
              {machines.map(m => (
                <option key={m.id} value={m.id}>針對機型：{m.id}</option>
              ))}
            </select>
          </div>

          <div className="relative w-full flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="輸入問題，例如：「這台棉花回收機需要哪些主要零件？」或「500 kg/hr 處理量之建議機型與工時」..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            onClick={() => handleSearch()}
            disabled={loading || !query.trim()}
            className={`flex items-center space-x-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold shadow-md transition cursor-pointer shrink-0 ${
              loading || !query.trim()
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
            }`}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>AI 檢索核算中...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>送出智慧查詢</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Result Display */}
      {result && (
        <div className="bg-slate-850 border border-slate-700 rounded-2xl p-6 space-y-6 shadow-2xl animate-in fade-in duration-200">
          {/* Top Result Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-700/80 gap-3">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <Sparkles className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">AI 工程智囊答覆</h3>
                <div className="text-xs text-slate-400">查詢主題：「{result.query}」</div>
              </div>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium transition cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">已複製全文</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>複製回覆</span>
                </>
              )}
            </button>
          </div>

          {/* Warning Message if unverified or no data (Scenario 4) */}
          {result.warningMessage && (
            <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/50 text-amber-200 text-xs flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <strong className="font-bold block text-sm">【F06 嚴格驗收條件：查無可靠資料提示】</strong>
                <span>{result.warningMessage}</span>
              </div>
            </div>
          )}

          {/* Answer Text */}
          <div className="prose prose-invert max-w-none text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap bg-slate-900/60 p-5 rounded-xl border border-slate-800 font-sans">
            {result.answer}
          </div>

          {/* Source Citations Section (Critical F06 Acceptance Requirement) */}
          <div className="space-y-3 pt-2">
            <div className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center">
              <BookOpen className="w-4 h-4 mr-1.5" />
              引註資料來源與版本 (Verified Sources & Versions)：
            </div>

            {result.sources.length === 0 ? (
              <div className="text-xs text-slate-500 italic bg-slate-900/40 p-3 rounded-lg border border-slate-800">
                本題無收錄之可靠核定來源，AI 已遵循驗收標準拒絕虛構任何料號或價格。
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.sources.map((src, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/80 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white flex items-center">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
                        {src.title}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-teal-950 text-teal-300 border border-teal-500/40">
                        {src.versionOrRef}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      來源分類：{src.type === 'bom_version' ? '核定工程 BOM 清單' : src.type === 'machine_spec' ? '機台規格書' : '供應商核定牌價'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
