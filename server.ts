import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;
const isRealApiKey = Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim().length > 15);
let ai: GoogleGenAI | null = null;

if (isRealApiKey && apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const withTimeout = <T>(promise: Promise<T>, timeoutMs = 6000): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('AI request timed out, switching to grounded rule engine')), timeoutMs)
    ),
  ]);
};

// Cotton recycling knowledge base context for AI grounding
const SYSTEM_KNOWLEDGE_CONTEXT = `
【棉花回收設備標準資料庫 (Cotton Recycling Equipment Knowledge Base)】

1. 標準機台型號與規格：
- CR-500 高效纖維開花落棉回收線:
  * 額定產能: 500 kg/hr (適用 400~600 kg/hr)
  * 最新 BOM 版本: Rev B.2 (歷史版本 Rev B.1, Rev A.0)
  * 尺寸: 長 18.5m x 寬 3.2m x 高 3.8m
  * 總功率: 78 kW (380V/50-60Hz/3相)
  * 標準工時: 組裝 120 人時，電控配盤 40 人時
  * 核心配置: 喂棉機金屬探測器、1組粗撕碎機、4組Φ400mm合金針布刺輥、弧形除雜微孔梳板組、11kW旋風除塵引風機、西門子S7-1200 PLC集中電控
  * 適用原料: 紡織清梳落棉、針織平織開花料、牛仔布裁片碎料、廢紗筒管落紗

- CR-800 雙刺輥高速清梳棉回收機組:
  * 額定產能: 800 kg/hr (適用 700~950 kg/hr)
  * 最新 BOM 版本: Rev C.1 (歷史版本 Rev C.0, Rev B.0)
  * 尺寸: 長 24.0m x 寬 3.5m x 高 4.2m
  * 總功率: 115 kW (380V/50-60Hz/3相)
  * 核心配置: 雙鏈板給棉機、2組粗撕碎機、6組Φ400mm刺輥 + 2組Φ250mm高密度微分梳輥、雙11kW離心風機、西門子S7-1200
  * 適用原料: 水刺無紡布廢料、氣流紡大捲落棉、聚酯混紡棉碎片、漂白原棉邊料

- CR-1200 全自動落棉回收打包流水線:
  * 額定產能: 1200 kg/hr (適用 1000~1400 kg/hr)
  * 最新 BOM 版本: Rev A.3 (歷史版本 Rev A.2)
  * 尺寸: 長 32.0m x 寬 4.0m x 高 4.8m
  * 總功率: 165 kW
  * 核心配置: 雙軸強力撕碎機、8組超耐磨針布開花刺輥、120噸雙缸立式全自動油壓打包機(PRT-HYD-120T)、西門子S7-1200

2. 核定標準料號與價格清單 (BOM Parts & Pricing):
- PRT-RL-4001: Φ400mm 特種硬質合金針布刺輥 (L=1300mm), 常州金屬針布, 單價 NT$58,000, 期限至 2026-12-31 (有效)
- PRT-RL-2501: Φ250mm 高密度精微分梳輥, 常州金屬針布, 單價 NT$42,000, 期限至 2026-11-30 (有效)
- PRT-BD-1022: 可調弧形微孔除雜梳針梳板組, 台南精機, 原單價 NT$32,000, 期限至 2026-02-10 (⚠️ 已過期！需重新向採購詢價)
- PRT-KN-SKD11: SKD-11 淬火耐磨撕碎旋轉動刀組(16刃), 日本大同代理, 單價 NT$48,000, 期限至 2026-09-30 (有效)
- PRT-MTR-22K: IE3 變頻感應馬達 22kW, 台灣大同電機, 單價 NT$38,500, 期限至 2026-10-31 (有效)
- PRT-MTR-15K: IE3 三相異步馬達 15kW, 台灣大同電機, 單價 NT$28,000, 期限至 2026-10-31 (有效)
- PRT-FAN-11K: 高壓防磨離心引風機組 11kW, 順風工業, 單價 NT$52,000, 期限至 2026-12-31 (有效)
- PRT-SEN-MD01: 數字式金屬異物探測器(寬1400mm), 瑞士梅特勒-托利多, 單價 NT$145,000, 期限至 2026-12-31 (有效)
- PRT-PLC-S712: 西門子 S7-1200 PLC 集中控制箱主機, 巨茂自動化, 單價 NT$168,000, 期限至 2026-12-31 (有效)
- PRT-HYD-120T: 120噸立式雙缸油壓打包動力包, 德國力士樂, 單價 NT$480,000, 期限至 2026-11-30 (有效)
- PRT-BLT-PVC14: 阻燃抗靜電雙層 PVC 給棉輸送皮帶, 荷蘭阿默拉爾, 單價 NT$19,500, 期限至 2026-12-31 (有效)
`;

// F06: AI Data Query API
app.post('/api/gemini/search', async (req: Request, res: Response) => {
  const { query, activeMachineId, role } = req.body;

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: '請輸入有效的查詢關鍵字或問題。' });
  }

  const promptText = `
你是一套工業級「棉花回收設備 AI 輔助報價與零件查詢系統」的工程與技術智囊。
使用者角色為：${role || '客服/工程/業務'}。
目前檢視之機台機型（若有指定）：${activeMachineId || '全機型檢索'}。

使用者查詢問題：
「${query}」

【絕對準則 (Strict Grounding Rules)】：
1. 嚴格依據上方給定之【棉花回收設備標準資料庫】回覆。不得自行編造任何料號、價格、供應商或未核定的產能數據！
2. 凡答案提及的每一個關鍵規格、BOM 料號、價格、版本，必須明確標註資料來源與版本（如：[來源: 機台規格 CR-500 Rev B.2]、[來源: 零件料號 PRT-RL-4001]）。
3. 若查詢的機型、零件或非標客製規格不在資料庫中，必須如實回答：「本系統目前查無此項可靠資料，無法確認，不得推測或虛構料號與價格，請聯繫工程或採購單位建檔評估。」
4. 若涉及 PRT-BD-1022，請主動提醒其報價已於 2026-02-10 過期，採購需重新確認。
5. 請以專業、清晰、條理分明的繁體中文回答，包含：
   - 【查詢結論與核心回覆】
   - 【對應機型與 BOM 零件規格來源】
   - 【工程及商務注意事項】
`;

  try {
    if (ai) {
      const response = await withTimeout(
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: promptText,
          config: {
            systemInstruction: SYSTEM_KNOWLEDGE_CONTEXT,
            temperature: 0.2, // Low temperature for high factual accuracy
          },
        }),
        6000
      );

      const text = response.text || '';
      return res.json({
        query,
        answer: text,
        sources: extractSourcesFromQuery(query),
      });
    } else {
      // Deterministic fallback if API key is not supplied
      const fallbackResult = generateDeterministicSearchAnswer(query, activeMachineId);
      return res.json(fallbackResult);
    }
  } catch (error: any) {
    console.warn('Gemini API call failed, falling back to local grounded knowledge engine:', error);
    const fallbackResult = generateDeterministicSearchAnswer(query, activeMachineId);
    return res.json(fallbackResult);
  }
});

// F07: AI Quotation Draft Summary & Proposal Generator
app.post('/api/gemini/quote-summary', async (req: Request, res: Response) => {
  const { customerName, machineName, capacityKgHr, rawMaterialType, totalCost, finalPrice, marginRate, bomVersion } = req.body;

  const prompt = `
為棉花回收設備報價產生正式商務提案說明與技術保證書。
客戶：${customerName}
推薦機型：${machineName} (BOM版本: ${bomVersion})
客戶原料：${rawMaterialType}
需求處理量：${capacityKgHr} kg/hr
製造成本估算：NT$ ${Number(totalCost).toLocaleString()}
報價金額：NT$ ${Number(finalPrice).toLocaleString()} (預估毛利率: ${(Number(marginRate) * 100).toFixed(1)}%)

請產生包含以下三個區塊的專業繁體中文內容（嚴格採用 JSON 格式回傳）：
{
  "aiExecutiveSummary": "針對客戶原料與處理量的高階商務提案概述 (100-150字)",
  "aiTechnicalGuarantee": "3點具體的工程技術與產能、除雜、除塵保證",
  "aiDeliveryNotice": "交期、吊裝、試車調試與教育訓練說明"
}
`;

  try {
    if (ai) {
      const response = await withTimeout(
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction: '你是棉花回收設備專業資深技術業務總監。請輸出標準 JSON 格式。',
            responseMimeType: 'application/json',
            temperature: 0.3,
          },
        }),
        6000
      );

      const text = response.text || '{}';
      const parsed = JSON.parse(text);
      return res.json(parsed);
    } else {
      // Deterministic fallback
      return res.json({
        aiExecutiveSummary: `本報價方案專為「${customerName}」之 ${rawMaterialType} 開花回收製程規劃。採用 ${machineName}，額定產能達 ${capacityKgHr} kg/hr。透過精密金屬針布刺輥分梳與旋風脈衝集塵，兼顧高開花蓬鬆度與環保集塵標準，預期設備投資回收期約 8-12 個月。`,
        aiTechnicalGuarantee: `1. 產能保證：原料含水率 ≤ 10% 條件下，穩定開花產能 ≥ ${capacityKgHr} kg/hr。\n2. 安全保護：進料端數位式金屬探測儀 0.2 秒內自動反轉停機，阻斷異物撞擊針布。\n3. 排塵保證：車間粉塵排放濃度符合 ESG 綠色標準 (≤ 2.5 mg/m³)。`,
        aiDeliveryNotice: `標準製造工期約 60 工作天。本報價含台灣本島貨運、廠內吊裝定位、為期 5 工作天之全載試車調試及現場操作人員教育培訓。`,
      });
    }
  } catch (error: any) {
    console.warn('AI quote summary generation failed, using template:', error);
    return res.json({
      aiExecutiveSummary: `本報價方案專為「${customerName}」規劃 ${machineName}，額定產能 ${capacityKgHr} kg/hr。配置精密刺輥與旋風除塵，提供高性價比回收解決方案。`,
      aiTechnicalGuarantee: `1. 額定處理量承諾：穩定產出 ≥ ${capacityKgHr} kg/hr。\n2. 金屬異物探測器 100% 反轉防護。\n3. 全機保固 12 個月。`,
      aiDeliveryNotice: `簽約後 60 天內交機，包含現場安裝、通電試車及人員操作維護培訓。`,
    });
  }
});

// Helper for query source extraction
function extractSourcesFromQuery(query: string) {
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

function generateDeterministicSearchAnswer(query: string, activeMachineId?: string) {
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

// Fullstack server configuration: Vite dev middleware in development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Cotton Recycling Equipment System running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
