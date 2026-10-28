import type { AISearchResult } from '../types';

export function extractSourcesFromQuery(query: string) {
  const sources = [];
  const q = query.toLowerCase();
  if (q.includes('cr-500') || q.includes('500')) {
    sources.push({
      title: 'CR-500 高效纖維開花落棉回收線 技術規格書',
      type: 'machine_spec' as const,
      versionOrRef: 'CR-500 Rev B.2',
      verified: true,
    });
    sources.push({
      title: 'CR-500 最新核定工程 BOM 清單',
      type: 'bom_version' as const,
      versionOrRef: 'Rev B.2 (2026-03)',
      verified: true,
    });
  }
  if (q.includes('cr-800') || q.includes('800')) {
    sources.push({
      title: 'CR-800 雙刺輥高速清梳棉回收機組 規格書',
      type: 'machine_spec' as const,
      versionOrRef: 'CR-800 Rev C.1',
      verified: true,
    });
  }
  if (q.includes('cr-1200') || q.includes('1200') || q.includes('打包')) {
    sources.push({
      title: 'CR-1200 全自動落棉打包流水線 規格書',
      type: 'machine_spec' as const,
      versionOrRef: 'CR-1200 Rev A.3',
      verified: true,
    });
    sources.push({
      title: 'PRT-HYD-120T 120噸立式雙缸油壓打包動力包',
      type: 'part_price' as const,
      versionOrRef: '力士樂 Rexroth 台灣',
      verified: true,
    });
  }
  if (q.includes('刺輥') || q.includes('針布') || q.includes('4001')) {
    sources.push({
      title: 'PRT-RL-4001 Φ400mm 特種硬質合金針布刺輥',
      type: 'part_price' as const,
      versionOrRef: '常州金屬針布 (有效至2026-12-31)',
      verified: true,
    });
  }
  if (q.includes('梳板') || q.includes('除雜') || q.includes('1022')) {
    sources.push({
      title: 'PRT-BD-1022 可調弧形微孔除雜梳板組',
      type: 'part_price' as const,
      versionOrRef: '台南精機 (⚠️ 2026-02-10 已逾期)',
      verified: false,
    });
  }
  if (sources.length === 0) {
    sources.push({
      title: '棉花回收設備標準機種總規格庫',
      type: 'machine_spec' as const,
      versionOrRef: '標準庫 V1.0',
      verified: true,
    });
  }
  return sources;
}

export function generateDeterministicSearchAnswer(query: string, activeMachineId?: string): AISearchResult {
  const q = query.toLowerCase();

  // Test scenario 4: AI cannot find reliable BOM or unknown model
  if (q.includes('cr-999') || q.includes('未知') || q.includes('非標未核定') || q.includes('找不到') || q.includes('不存在')) {
    return {
      query,
      answer: `【系統查無核定資料通知】\n\n依據 F06 驗收標準，本系統目前查無此機型或規格之核定 BOM 與零件資料。沒有可靠資料時提示無法確認，嚴禁系統自行編造料號、價格或產能。\n\n建議處置流程：\n1. 請業務先建立「客戶特殊需求單 (F02)」。\n2. 轉交工程部門進行客製化非標設計評估。\n3. 由工程部於「機台規格管理 (F03)」與「BOM 管理 (F04)」完成新版本審批建檔後，方可進入報價計算。`,
      sources: [],
      warningMessage: '查無核定資料：系統已依防呆準則阻斷虛構推測。',
    };
  }

  if (q.includes('主要零件') || q.includes('有哪些零件') || q.includes('bom')) {
    const machine = activeMachineId || 'CR-500';
    return {
      query,
      answer: `【${machine} 主要構成零件與核定 BOM 查詢】\n\n經比對最新核定版本（以 CR-500 為例對應 Rev B.2），主要核心零件包括：\n\n1. 【開纖分梳核心】：\n   - 料號 PRT-RL-4001: Φ400mm 特種硬質合金針布刺輥 (數量: 4支)，單價 NT$58,000 [來源: 常州金屬針布，效期至 2026-12-31]\n   - 料號 PRT-BD-1022: 可調弧形微孔除雜梳針梳板組 (數量: 4組)，原單價 NT$32,000 [來源: 台南精機，⚠️ 注意: 報價已於 2026-02-10 逾期，採購需重新確認]\n\n2. 【初級撕碎與給棉機構】：\n   - 料號 PRT-KN-SKD11: SKD-11 淬火耐磨撕碎旋轉動刀組 (數量: 1套)，單價 NT$48,000 [來源: 日本大同代理]\n   - 料號 PRT-BLT-PVC14: 阻燃抗靜電雙層 PVC 輸送帶 (數量: 2條)，單價 NT$19,500 [來源: 荷蘭阿默拉爾]\n\n3. 【動力與電控安全】：\n   - 料號 PRT-MTR-22K: IE3 超高效 22kW 變頻馬達 (數量: 2台)，單價 NT$38,500 [來源: 台灣大同電機]\n   - 料號 PRT-SEN-MD01: 數位式金屬異物探測器 (數量: 1組)，單價 NT$145,000 [來源: 瑞士梅特勒-托利多]\n   - 料號 PRT-PLC-S712: 西門子 S7-1200 集中電控主機 (數量: 1套)，單價 NT$168,000 [來源: 巨茂自動化]\n\n【採購注意事項】：BOM 中 PRT-BD-1022 價格已過期，正式報價前需採購主管重新詢價覆核。`,
      sources: extractSourcesFromQuery(query),
    };
  }

  if (q.includes('500') || q.includes('處理 500') || q.includes('500 公斤')) {
    return {
      query,
      answer: `【每小時處理 500 公斤需求之機種推薦與歷史數據】\n\n推薦機型：CR-500 高效纖維開花落棉回收線 [來源: 機台規格庫 CR-500]\n\n1. 【額定產能】：500 kg/hr（工作適應區間 400 ~ 600 kg/hr）\n2. 【最新 BOM 版本】：Rev B.2（歷史版本包括 Rev B.1 與 Rev A.0，嚴禁跨版本混用）\n3. 【場地與動力門檻】：廠房需求 長 18.5m x 寬 3.2m x 高 3.8m；總裝機功率 78 kW (380V/50-60Hz)\n4. 【歷史專案實績】：\n   - 遠東精密紡織 (REQ-2026-001 / QT-2026-008)，處理針織邊角料與清梳落棉，實測開花率 98.2%、排雜率 96.5%\n5. 【製造成本基線】：BOM 材料成本約 NT$ 818,000 + 組裝電控工時約 NT$ 160,000 + 運費調試 NT$ 120,000，建議售價區間約 NT$ 1,300,000 ~ 1,450,000。`,
      sources: extractSourcesFromQuery(query),
    };
  }

  if (q.includes('針布') || q.includes('刺輥') || q.includes('針輥') || q.includes('開纖')) {
    return {
      query,
      answer: `【開花針輥與針布規格選型】\n\n依據工程庫核定：\n- 標準初開花單元：採用 PRT-RL-4001 (Φ400x1300mm 特種硬質合金鋼針布，齒密度 96齒/dm²)，具備高衝擊韌性，耐受廢布拉扯。\n- 精密微分梳單元 (如 CR-800 搭載)：配置 PRT-RL-2501 (Φ250x1300mm，120齒/dm² 高密度針布)，有效分解微小棉結與未開花紗段，提升纖維蓬鬆度。\n- 供應商與單價：常州金屬針布精密工業，單價分別為 NT$ 58,000 與 NT$ 42,000，報價效期均至 2026 年底。`,
      sources: extractSourcesFromQuery(query),
    };
  }

  // General fallback
  return {
    query,
    answer: `【棉花回收設備 AI 查詢回覆】\n\n根據目前系統收錄之機台規格庫 (CR-500, CR-800, CR-1200) 與核定 BOM 清單：\n\n- CR-500 (產能 500 kg/hr, BOM Rev B.2, 功率 78 kW, 適用落棉與針織邊角料)\n- CR-800 (產能 800 kg/hr, BOM Rev C.1, 功率 115 kW, 適用無紡布與大捲落棉)\n- CR-1200 (產能 1200 kg/hr, BOM Rev A.3, 功率 165 kW, 附120T液壓打包機)\n\n所有零件價格皆由採購維護，若零件標註過期（如 PRT-BD-1022），系統將自動啟動警告並阻擋未經審核之正式報價發送。`,
    sources: extractSourcesFromQuery(query),
  };
}
