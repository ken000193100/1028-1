# 棉花回收設備 AI 輔助報價系統

React、Vite 與 Express 全端應用，提供機台、BOM、零件價格、報價與 AI 輔助查詢。

## 本機啟動

使用 Node.js 22.12 以上版本與 pnpm。

```sh
pnpm install
pnpm dev
```

開啟 http://localhost:3000。若該埠已使用，可設定 PORT 環境變數。

Gemini 功能可將 `.env.example` 複製為 `.env` 並填入 `GEMINI_API_KEY`。未提供有效金鑰時，查詢使用內建規則回應。請勿提交 `.env` 或金鑰。

## 驗證與正式執行

```sh
pnpm lint
pnpm build
```

建置完成後，設定 `NODE_ENV=production` 再執行 `pnpm start`。PowerShell 範例：

```powershell
$env:NODE_ENV = 'production'
pnpm start
```

目前業務資料使用前端示範資料及記憶體狀態，重新整理後會重設，未連接持久化資料庫。

## GitHub Pages

GitHub Pages 發布網址：https://ken000193100.github.io/1028-1/

倉庫 Settings → Pages → Source 設為 **GitHub Actions**。推送至 main 後，`.github/workflows/pages.yml` 會執行型別檢查、編譯前端，再發布 dist，不能直接發布含 `/src/main.tsx` 的原始 index.html。

Pages 建置會設定 `GITHUB_PAGES=true`，使用 `/1028-1/` 資源路徑。Pages 只支援靜態網站，查詢與報價說明使用內建規則及示範資料，不會呼叫 Express 或 Gemini；Gemini 金鑰僅用於本機或可執行後端的主機，請勿放進前端。
