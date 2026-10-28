import { AISearchResult } from '../types';

export async function queryAIKnowledgeBase(
  query: string,
  activeMachineId?: string,
  role?: string
): Promise<AISearchResult> {
  try {
    const res = await fetch('/api/gemini/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, activeMachineId, role }),
    });

    if (!res.ok) {
      throw new Error(`伺服器回應異常: ${res.statusText}`);
    }

    return await res.json();
  } catch (error: any) {
    console.error('AI Query failed:', error);
    throw error;
  }
}

export async function generateAIQuotationSummary(payload: {
  customerName: string;
  machineName: string;
  capacityKgHr: number;
  rawMaterialType: string;
  totalCost: number;
  finalPrice: number;
  marginRate: number;
  bomVersion: string;
}): Promise<{
  aiExecutiveSummary: string;
  aiTechnicalGuarantee: string;
  aiDeliveryNotice: string;
}> {
  try {
    const res = await fetch('/api/gemini/quote-summary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`AI 報價說明產生失敗: ${res.statusText}`);
    }

    return await res.json();
  } catch (error: any) {
    console.error('AI Quote Summary failed:', error);
    // Graceful fallback
    return {
      aiExecutiveSummary: `本報價方案專為「${payload.customerName}」之 ${payload.rawMaterialType} 開花回收規劃。採用 ${payload.machineName}，額定產能 ${payload.capacityKgHr} kg/hr。配置精密刺輥與旋風除塵，提供高性價比回收解決方案。`,
      aiTechnicalGuarantee: `1. 額定處理量承諾：穩定產出 ≥ ${payload.capacityKgHr} kg/hr。\n2. 金屬異物探測器 100% 反轉防護。\n3. 全機保固 12 個月。`,
      aiDeliveryNotice: `簽約後 60 天內交機，包含現場安裝、通電試車及人員操作維護培訓。`,
    };
  }
}
