import { 
  Customer, 
  Requirement, 
  Machine, 
  Part, 
  PartPrice, 
  BOMItem, 
  Quotation, 
  WorkOrder, 
  AcceptanceTest, 
  KPIStats, 
  RolePermission 
} from '../types';

export const ROLE_PERMISSIONS: Record<string, RolePermission> = {
  customer_service: {
    role: 'customer_service',
    label: '客服 (Customer Service)',
    badgeColor: 'bg-sky-50 text-sky-700 border-sky-300',
    allowedActions: ['建立客戶需求 (F02)', '查詢機台規格 (F03)', '案件進度查詢 (F11)', 'AI 資料查詢 (F06)'],
    restrictions: ['不可修改成本計算規則', '不可發送或核准報價', '不可編輯工程 BOM']
  },
  sales: {
    role: 'sales',
    label: '業務 (Sales)',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-300',
    allowedActions: ['客戶資料管理 (F01)', '建立報價草稿 (F07)', '調整折扣與利潤率', '查看報價版本差異 (F09)', '發送已核准之正式報價'],
    restrictions: ['不可自行更改工程核定規格', '未經主管核准不可發送正式報價', '不可修改 BOM 料件']
  },
  engineering: {
    role: 'engineering',
    label: '工程 (Engineering)',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-300',
    allowedActions: ['評估客戶需求規格', '管理機台規格 (F03)', '維護與展開 BOM (F04)', '審核報價機台規格 (F08)', '驗收試車記錄 (F13)'],
    restrictions: ['不可直接發布正式對外報價', '不可擅自調整財務利潤率']
  },
  procurement: {
    role: 'procurement',
    label: '採購 (Procurement)',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-300',
    allowedActions: ['維護零件單價 (F05)', '管理供應商與有效期限', '審核報價材料成本 (F08)', '庫存缺料查詢 (F10)', '發起零件重新詢價'],
    restrictions: ['不可修改工程 BOM 結構與料號', '不可變動客戶報價售價']
  },
  warehouse: {
    role: 'warehouse',
    label: '倉管 (Warehouse)',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-300',
    allowedActions: ['查詢零件庫存與現量 (F10)', '備料狀態登記', '查看工作單領料狀態'],
    restrictions: ['不可修改成本計算規則', '不可審核報價單']
  },
  site_manager: {
    role: 'site_manager',
    label: '施工主管 (Site Manager)',
    badgeColor: 'bg-orange-50 text-orange-700 border-orange-300',
    allowedActions: ['派工及工單進度管理 (F11)', '回報組裝與調試進度 (F12)', '現場試車紀錄驗收 (F13)'],
    restrictions: ['不可修改已核准之報價金額與規格', '不可更動 BOM 零件定義']
  },
  admin: {
    role: 'admin',
    label: '主管 / 管理員 (Executive)',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-300',
    allowedActions: ['最高報價批核權限 (F08)', '跨部門審核流覆核', '檢視 KPI 管理報表 (F14)', '全系統所有功能調閱與配置'],
    restrictions: ['需依公司核決權限如實簽核']
  }
};

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'CUST-001',
    companyName: '遠東精密紡織股份有限公司',
    taxId: '23489102',
    contactPerson: '林建宏 廠長',
    phone: '04-2359-1188',
    email: 'jhlin@fec-textile.com.tw',
    factoryAddress: '台中市西屯區工業區一路88號',
    country: '台灣 (Taiwan)',
    scale: '大型綜合紡紗廠 (年處理棉廢料 8,000 噸)',
    historicalProjectsCount: 3,
    createdAt: '2025-08-12'
  },
  {
    id: 'CUST-002',
    companyName: '宏遠興業彰化二林廠',
    taxId: '54891230',
    contactPerson: '陳美玲 採購專理',
    phone: '04-896-5522',
    email: 'mlchen@everest-tex.com',
    factoryAddress: '彰化縣二林鎮中科園區綠能路12號',
    country: '台灣 (Taiwan)',
    scale: '高端環保回收纖維開花廠',
    historicalProjectsCount: 2,
    createdAt: '2025-11-04'
  },
  {
    id: 'CUST-003',
    companyName: '越南興南紡織責任有限公司 (Hung Nam Textile)',
    taxId: 'VN-03129845',
    contactPerson: '阮文雄 副總經理',
    phone: '+84-274-388-6621',
    email: 'hung.nguyen@hungnamtex.vn',
    factoryAddress: 'VSIP II Industrial Park, Binh Duong, Vietnam',
    country: '越南 (Vietnam)',
    scale: '跨國牛仔布及氣流紡再生棉基地',
    historicalProjectsCount: 1,
    createdAt: '2026-01-15'
  },
  {
    id: 'CUST-004',
    companyName: '台南興國無紡科技股份有限公司',
    taxId: '78234910',
    contactPerson: '張國良 總工程師',
    phone: '06-599-3366',
    email: 'klchang@hsingkuo-nonwoven.com.tw',
    factoryAddress: '台南市新市區台南科學園區南科三路5號',
    country: '台灣 (Taiwan)',
    scale: '水刺不織布邊角料專用再生產線',
    historicalProjectsCount: 0,
    createdAt: '2026-03-20'
  }
];

export const INITIAL_MACHINES: Machine[] = [
  {
    id: 'CR-500',
    name: 'CR-500 高效纖維開花落棉回收線',
    modelSeries: '標準系列 (Standard Opening Line)',
    ratedCapacityKgHr: 500,
    capacityRange: '400 ~ 600 kg/hr',
    dimensions: '長 18.5m x 寬 3.2m x 高 3.8m',
    totalPowerKw: 78,
    voltageSpec: '380V / 50-60Hz / 3相 (可定製440V)',
    targetMaterials: ['紡織清梳落棉', '針織平織開花料', '牛仔布裁片碎料', '廢紗筒管落紗'],
    features: [
      '重型金屬探測喂棉台，毫秒級防護異物停機',
      '1 組粗撕碎機 + 4 組精密開纖分梳刺輥單元',
      '微孔弧形除雜梳板，排雜率最高達 96%',
      '旋風脈衝集塵系統，廠房粉塵濃度符合 ESG 標準 (< 2.5 mg/m³)'
    ],
    standardAssemblyHours: 120,
    standardElectricalHours: 40,
    currentBomVersion: 'Rev B.2',
    availableBomVersions: ['Rev B.2', 'Rev B.1', 'Rev A.0'],
    description: '專為中小型紡織廠與成衣廢布處理設計，兼具高開花膨鬆度與低纖維損傷率，投資回收週期約 8~12 個月。'
  },
  {
    id: 'CR-800',
    name: 'CR-800 雙刺輥高速清梳棉回收機組',
    modelSeries: '重型高速系列 (Heavy Duty High-Speed)',
    ratedCapacityKgHr: 800,
    capacityRange: '700 ~ 950 kg/hr',
    dimensions: '長 24.0m x 3.5m x 4.2m',
    totalPowerKw: 115,
    voltageSpec: '380V / 50-60Hz / 3相',
    targetMaterials: ['水刺無紡布廢料', '氣流紡大捲落棉', '聚酯混紡棉碎片', '漂白原棉邊料'],
    features: [
      '雙鏈板重型自動連續供棉機',
      '2 組初級強力撕碎機 + 6 組微針刺輥高速梳理單元',
      '變頻無級調節纖維牽伸比，可自選纖維長度保留模式',
      '短絨氣流分離排雜機構，開花纖維蓬鬆度提升 25%'
    ],
    standardAssemblyHours: 160,
    standardElectricalHours: 50,
    currentBomVersion: 'Rev C.1',
    availableBomVersions: ['Rev C.1', 'Rev C.0', 'Rev B.0'],
    description: '針對高產能規模化回收廠打造，連續運轉穩定性達 99.2%，支援無人化給料與集中排塵。'
  },
  {
    id: 'CR-1200',
    name: 'CR-1200 全自動落棉回收打包流水線',
    modelSeries: '旗艦無人化流水線 (Full-Auto Packaging Line)',
    ratedCapacityKgHr: 1200,
    capacityRange: '1000 ~ 1400 kg/hr',
    dimensions: '長 32.0m x 寬 4.0m x 高 4.8m',
    totalPowerKw: 165,
    voltageSpec: '380V / 50-60Hz / 3相',
    targetMaterials: ['大宗棉紗廢棉', '成衣裁切邊角布', '高雜質回收廢棉絮', '厚重帆布與混紡廢料'],
    features: [
      '多道除鐵磁選與超音波密度均勻給棉系統',
      '雙軸強力撕碎機 + 8 組合金齒條超耐磨開纖刺輥',
      '整合 120 噸雙缸立式全自動油壓打包機，自動套袋捆紮',
      '西門子 S7-1500 PLC 與 15 吋觸控 SCADA 工業聯控雲端遠端診斷'
    ],
    standardAssemblyHours: 220,
    standardElectricalHours: 65,
    currentBomVersion: 'Rev A.3',
    availableBomVersions: ['Rev A.3', 'Rev A.2'],
    description: '一站式開花、除雜、除塵、秤重與自動壓縮打包，產出符合國際標準 200kg 再生棉包。'
  }
];

export const INITIAL_PARTS: Part[] = [
  {
    id: 'PRT-RL-4001',
    partNumber: 'PRT-RL-4001',
    name: 'Φ400mm 特種硬質合金針布刺輥 (L=1300mm)',
    category: 'core_carding',
    specification: 'Φ400x1300mm / 45#鋼鍛造軸心 / 高碳合金鋼針布 96齒/dm²',
    unit: '支',
    stockQuantity: 18,
    safetyStock: 6,
    leadTimeDays: 14
  },
  {
    id: 'PRT-RL-2501',
    partNumber: 'PRT-RL-2501',
    name: 'Φ250mm 高密度精微分梳輥',
    category: 'core_carding',
    specification: 'Φ250x1300mm / 表面鍍硬鉻 / 120齒/dm²',
    unit: '支',
    stockQuantity: 12,
    safetyStock: 4,
    leadTimeDays: 12
  },
  {
    id: 'PRT-BD-1022',
    partNumber: 'PRT-BD-1022',
    name: '可調弧形微孔除雜梳針梳板組 (含安裝支架)',
    category: 'core_carding',
    specification: 'SUS304不銹鋼微孔排塵 / 梳齒間距 2.5mm / 角度 0-30° 可調',
    unit: '組',
    stockQuantity: 8,
    safetyStock: 4,
    leadTimeDays: 18
  },
  {
    id: 'PRT-KN-SKD11',
    partNumber: 'PRT-KN-SKD11',
    name: 'SKD-11 淬火耐磨撕碎旋轉動刀組 (16刃/套)',
    category: 'shredder_knife',
    specification: 'SKD-11日本鋼材 / 真空熱處理 HRC 58-60 / 尺寸 180x80x25mm',
    unit: '套',
    stockQuantity: 14,
    safetyStock: 5,
    leadTimeDays: 10
  },
  {
    id: 'PRT-MTR-22K',
    partNumber: 'PRT-MTR-22K',
    name: 'IE3 超高效變頻專用三相感應馬達 22kW',
    category: 'power_drive',
    specification: '22kW 4P 380V 50Hz B3臥式安裝 / 絕緣等級 F / IP55',
    unit: '台',
    stockQuantity: 6,
    safetyStock: 2,
    leadTimeDays: 20
  },
  {
    id: 'PRT-MTR-15K',
    partNumber: 'PRT-MTR-15K',
    name: 'IE3 超高效三相異步馬達 15kW',
    category: 'power_drive',
    specification: '15kW 4P 380V 50Hz / 鑄鐵機座 / IP55',
    unit: '台',
    stockQuantity: 9,
    safetyStock: 3,
    leadTimeDays: 15
  },
  {
    id: 'PRT-FAN-11K',
    partNumber: 'PRT-FAN-11K',
    name: '高壓防磨離心引風機組 (含耐磨消音風管)',
    category: 'dust_exhaust',
    specification: '11kW / 風量 8500 m³/h / 全壓 3200 Pa / 葉輪耐磨噴塗',
    unit: '組',
    stockQuantity: 5,
    safetyStock: 2,
    leadTimeDays: 21
  },
  {
    id: 'PRT-SEN-MD01',
    partNumber: 'PRT-SEN-MD01',
    name: '高靈敏度數字式金屬異物探測器 (喂棉通道專用)',
    category: 'electric_plc',
    specification: '有效感應寬度 1400mm / 檢測 Fe≥1.0mm, Non-Fe≥1.5mm / 聲光自動反轉',
    unit: '組',
    stockQuantity: 7,
    safetyStock: 2,
    leadTimeDays: 25
  },
  {
    id: 'PRT-PLC-S712',
    partNumber: 'PRT-PLC-S712',
    name: '西門子 S7-1200 PLC 集中控制箱主機 (含擴充模組)',
    category: 'electric_plc',
    specification: 'CPU 1214C DC/DC/DC + 16DI/16DO + 4AI/2AO + 10吋觸控人機 KTP1000',
    unit: '套',
    stockQuantity: 4,
    safetyStock: 2,
    leadTimeDays: 30
  },
  {
    id: 'PRT-HYD-120T',
    partNumber: 'PRT-HYD-120T',
    name: '120噸立式雙缸油壓打包動力包與液壓閥組',
    category: 'hydraulic_pack',
    specification: '雙主缸徑 Φ250mm / 行程 1800mm / 泵站壓力 25 MPa / 比例伺服閥控',
    unit: '套',
    stockQuantity: 2,
    safetyStock: 1,
    leadTimeDays: 35
  },
  {
    id: 'PRT-BLT-PVC14',
    partNumber: 'PRT-BLT-PVC14',
    name: '阻燃抗靜電雙層導向 PVC 給棉輸送皮帶',
    category: 'power_drive',
    specification: '寬 1350mm x 厚 4.5mm x 周長 12m / 表面菱形防滑花紋 / 阻燃級',
    unit: '條',
    stockQuantity: 15,
    safetyStock: 4,
    leadTimeDays: 7
  }
];

export const INITIAL_PART_PRICES: PartPrice[] = [
  {
    id: 'PRC-001',
    partNumber: 'PRT-RL-4001',
    supplier: '常州金屬針布精密工業股份有限公司',
    unitPrice: 58000,
    currency: 'TWD',
    quoteDate: '2026-03-01',
    validUntil: '2026-12-31',
    isExpired: false,
    notes: '年度特約供應商，保固期 18 個月'
  },
  {
    id: 'PRC-002',
    partNumber: 'PRT-RL-2501',
    supplier: '常州金屬針布精密工業股份有限公司',
    unitPrice: 42000,
    currency: 'TWD',
    quoteDate: '2026-02-15',
    validUntil: '2026-11-30',
    isExpired: false,
    notes: '高密度分梳輥'
  },
  {
    id: 'PRC-003',
    partNumber: 'PRT-BD-1022',
    supplier: '台南精機特種金屬加工所',
    unitPrice: 32000,
    currency: 'TWD',
    // INTENTIONALLY EXPIRED for Scenario 3 testing & Procurement verification
    quoteDate: '2025-08-10',
    validUntil: '2026-02-10',
    isExpired: true,
    notes: '原報價有效期已逾期！原料不銹鋼漲價，需採購重新詢價確認最新牌價。'
  },
  {
    id: 'PRC-004',
    partNumber: 'PRT-KN-SKD11',
    supplier: '日本大同特殊鋼特約代理 (台灣富山金屬)',
    unitPrice: 48000,
    currency: 'TWD',
    quoteDate: '2026-01-20',
    validUntil: '2026-09-30',
    isExpired: false,
    notes: '真品附原廠熱處理與材質證明報告'
  },
  {
    id: 'PRC-005',
    partNumber: 'PRT-MTR-22K',
    supplier: '台灣大同電機特約經銷商',
    unitPrice: 38500,
    currency: 'TWD',
    quoteDate: '2026-02-01',
    validUntil: '2026-10-31',
    isExpired: false,
    notes: 'IE3 能效標準'
  },
  {
    id: 'PRC-006',
    partNumber: 'PRT-MTR-15K',
    supplier: '台灣大同電機特約經銷商',
    unitPrice: 28000,
    currency: 'TWD',
    quoteDate: '2026-02-01',
    validUntil: '2026-10-31',
    isExpired: false,
    notes: 'IE3 鑄鐵馬達'
  },
  {
    id: 'PRC-007',
    partNumber: 'PRT-FAN-11K',
    supplier: '順風工業通風設備有限公司',
    unitPrice: 52000,
    currency: 'TWD',
    quoteDate: '2026-03-10',
    validUntil: '2026-12-31',
    isExpired: false,
    notes: '含出風口消音靜壓箱'
  },
  {
    id: 'PRC-008',
    partNumber: 'PRT-SEN-MD01',
    supplier: '瑞士梅特勒-托利多 (Mettler Toledo) 台灣分公司',
    unitPrice: 145000,
    currency: 'TWD',
    quoteDate: '2026-01-10',
    validUntil: '2026-12-31',
    isExpired: false,
    notes: '進口專用數位感測模組，含CE防護認證'
  },
  {
    id: 'PRC-009',
    partNumber: 'PRT-PLC-S712',
    supplier: '西門子台灣官方授權系統整合商 (巨茂自動化)',
    unitPrice: 168000,
    currency: 'TWD',
    quoteDate: '2026-02-28',
    validUntil: '2026-12-31',
    isExpired: false,
    notes: '包含客製化配電盤體、布線及西門子 PLC 邏輯程式燒錄'
  },
  {
    id: 'PRC-010',
    partNumber: 'PRT-HYD-120T',
    supplier: '德國力士樂 (Rexroth) 台灣油壓系統工程',
    unitPrice: 480000,
    currency: 'TWD',
    quoteDate: '2026-03-05',
    validUntil: '2026-11-30',
    isExpired: false,
    notes: 'CR-1200 旗艦型打包機構專用'
  },
  {
    id: 'PRC-011',
    partNumber: 'PRT-BLT-PVC14',
    supplier: '荷蘭阿默拉爾 (Ammeraal Beltech) 台灣辦事處',
    unitPrice: 19500,
    currency: 'TWD',
    quoteDate: '2026-01-15',
    validUntil: '2026-12-31',
    isExpired: false,
    notes: '抗靜電阻燃表面'
  }
];

export const INITIAL_BOM_ITEMS: BOMItem[] = [
  // CR-500 Rev B.2 (Current latest)
  {
    id: 'BOM-500-B2-01',
    machineId: 'CR-500',
    bomVersion: 'Rev B.2',
    partNumber: 'PRT-RL-4001',
    partName: 'Φ400mm 特種硬質合金針布刺輥',
    specification: 'Φ400x1300mm / 45#鋼鍛造軸心 / 96齒',
    unit: '支',
    quantity: 4,
    moduleGroup: '開纖刺輥單元',
    unitPriceTwd: 58000,
    supplier: '常州金屬針布精密工業',
    priceValidUntil: '2026-12-31',
    isPriceExpired: false,
    stockStatus: 'sufficient',
    currentStock: 18
  },
  {
    id: 'BOM-500-B2-02',
    machineId: 'CR-500',
    bomVersion: 'Rev B.2',
    partNumber: 'PRT-BD-1022',
    partName: '可調弧形微孔除雜梳針梳板組',
    specification: 'SUS304不銹鋼微孔排塵 / 梳齒間距 2.5mm',
    unit: '組',
    quantity: 4,
    moduleGroup: '除雜機構',
    unitPriceTwd: 32000,
    supplier: '台南精機特種金屬加工所',
    priceValidUntil: '2026-02-10',
    isPriceExpired: true, // EXPIRED FLAG
    stockStatus: 'sufficient',
    currentStock: 8
  },
  {
    id: 'BOM-500-B2-03',
    machineId: 'CR-500',
    bomVersion: 'Rev B.2',
    partNumber: 'PRT-KN-SKD11',
    partName: 'SKD-11 淬火耐磨撕碎旋轉動刀組',
    specification: 'SKD-11 / HRC 58-60 / 180x80x25mm',
    unit: '套',
    quantity: 1,
    moduleGroup: '粗撕碎機頭',
    unitPriceTwd: 48000,
    supplier: '日本大同特殊鋼特約代理',
    priceValidUntil: '2026-09-30',
    isPriceExpired: false,
    stockStatus: 'sufficient',
    currentStock: 14
  },
  {
    id: 'BOM-500-B2-04',
    machineId: 'CR-500',
    bomVersion: 'Rev B.2',
    partNumber: 'PRT-MTR-22K',
    partName: 'IE3 超高效變頻專用三相感應馬達 22kW',
    specification: '22kW 4P 380V 50Hz B3臥式',
    unit: '台',
    quantity: 2,
    moduleGroup: '主傳動系統',
    unitPriceTwd: 38500,
    supplier: '台灣大同電機特約經銷商',
    priceValidUntil: '2026-10-31',
    isPriceExpired: false,
    stockStatus: 'sufficient',
    currentStock: 6
  },
  {
    id: 'BOM-500-B2-05',
    machineId: 'CR-500',
    bomVersion: 'Rev B.2',
    partNumber: 'PRT-MTR-15K',
    partName: 'IE3 超高效三相異步馬達 15kW',
    specification: '15kW 4P 380V 50Hz',
    unit: '台',
    quantity: 2,
    moduleGroup: '輔助傳動系統',
    unitPriceTwd: 28000,
    supplier: '台灣大同電機特約經銷商',
    priceValidUntil: '2026-10-31',
    isPriceExpired: false,
    stockStatus: 'sufficient',
    currentStock: 9
  },
  {
    id: 'BOM-500-B2-06',
    machineId: 'CR-500',
    bomVersion: 'Rev B.2',
    partNumber: 'PRT-FAN-11K',
    partName: '高壓防磨離心引風機組',
    specification: '11kW / 風量 8500 m³/h',
    unit: '組',
    quantity: 1,
    moduleGroup: '風送除塵系統',
    unitPriceTwd: 52000,
    supplier: '順風工業通風設備',
    priceValidUntil: '2026-12-31',
    isPriceExpired: false,
    stockStatus: 'sufficient',
    currentStock: 5
  },
  {
    id: 'BOM-500-B2-07',
    machineId: 'CR-500',
    bomVersion: 'Rev B.2',
    partNumber: 'PRT-SEN-MD01',
    partName: '高靈敏度數字式金屬異物探測器',
    specification: '有效寬度 1400mm / 聲光反轉',
    unit: '組',
    quantity: 1,
    moduleGroup: '進料安全防護',
    unitPriceTwd: 145000,
    supplier: '瑞士梅特勒-托利多台灣',
    priceValidUntil: '2026-12-31',
    isPriceExpired: false,
    stockStatus: 'sufficient',
    currentStock: 7
  },
  {
    id: 'BOM-500-B2-08',
    machineId: 'CR-500',
    bomVersion: 'Rev B.2',
    partNumber: 'PRT-PLC-S712',
    partName: '西門子 S7-1200 PLC 集中控制箱主機',
    specification: 'CPU 1214C + 10吋彩色觸控 KTP1000',
    unit: '套',
    quantity: 1,
    moduleGroup: '自動電控系統',
    unitPriceTwd: 168000,
    supplier: '巨茂自動化 (西門子)',
    priceValidUntil: '2026-12-31',
    isPriceExpired: false,
    stockStatus: 'sufficient',
    currentStock: 4
  },
  {
    id: 'BOM-500-B2-09',
    machineId: 'CR-500',
    bomVersion: 'Rev B.2',
    partNumber: 'PRT-BLT-PVC14',
    partName: '阻燃抗靜電雙層導向 PVC 給棉輸送皮帶',
    specification: '寬 1350mm x 厚 4.5mm x 12m',
    unit: '條',
    quantity: 2,
    moduleGroup: '連續給棉機構',
    unitPriceTwd: 19500,
    supplier: '荷蘭阿默拉爾台灣',
    priceValidUntil: '2026-12-31',
    isPriceExpired: false,
    stockStatus: 'sufficient',
    currentStock: 15
  },

  // CR-500 Rev B.1 (Older version with older carding roller specs)
  {
    id: 'BOM-500-B1-01',
    machineId: 'CR-500',
    bomVersion: 'Rev B.1',
    partNumber: 'PRT-RL-4001',
    partName: 'Φ400mm 特種硬質合金針布刺輥',
    specification: 'Φ400x1300mm / 45#鋼鍛造軸心 / 96齒',
    unit: '支',
    quantity: 4,
    moduleGroup: '開纖刺輥單元',
    unitPriceTwd: 58000,
    supplier: '常州金屬針布精密工業',
    priceValidUntil: '2026-12-31',
    isPriceExpired: false,
    stockStatus: 'sufficient',
    currentStock: 18
  },
  {
    id: 'BOM-500-B1-02',
    machineId: 'CR-500',
    bomVersion: 'Rev B.1',
    partNumber: 'PRT-BD-1022',
    partName: '可調弧形微孔除雜梳針梳板組',
    specification: 'SUS304不銹鋼微孔排塵 / 梳齒間距 2.5mm',
    unit: '組',
    quantity: 3, // B.1 only had 3 combs
    moduleGroup: '除雜機構',
    unitPriceTwd: 32000,
    supplier: '台南精機特種金屬加工所',
    priceValidUntil: '2026-02-10',
    isPriceExpired: true,
    stockStatus: 'sufficient',
    currentStock: 8
  },
  {
    id: 'BOM-500-B1-03',
    machineId: 'CR-500',
    bomVersion: 'Rev B.1',
    partNumber: 'PRT-MTR-22K',
    partName: 'IE3 超高效變頻專用三相感應馬達 22kW',
    specification: '22kW 4P 380V 50Hz B3臥式',
    unit: '台',
    quantity: 2,
    moduleGroup: '主傳動系統',
    unitPriceTwd: 38500,
    supplier: '台灣大同電機特約經銷商',
    priceValidUntil: '2026-10-31',
    isPriceExpired: false,
    stockStatus: 'sufficient',
    currentStock: 6
  },

  // CR-800 Rev C.1
  {
    id: 'BOM-800-C1-01',
    machineId: 'CR-800',
    bomVersion: 'Rev C.1',
    partNumber: 'PRT-RL-4001',
    partName: 'Φ400mm 特種硬質合金針布刺輥',
    specification: 'Φ400x1300mm / 45#鋼鍛造軸心 / 96齒',
    unit: '支',
    quantity: 6,
    moduleGroup: '高階分梳刺輥單元',
    unitPriceTwd: 58000,
    supplier: '常州金屬針布精密工業',
    priceValidUntil: '2026-12-31',
    isPriceExpired: false,
    stockStatus: 'sufficient',
    currentStock: 18
  },
  {
    id: 'BOM-800-C1-02',
    machineId: 'CR-800',
    bomVersion: 'Rev C.1',
    partNumber: 'PRT-RL-2501',
    partName: 'Φ250mm 高密度精微分梳輥',
    specification: 'Φ250x1300mm / 120齒',
    unit: '支',
    quantity: 2,
    moduleGroup: '精梳微分纖維機構',
    unitPriceTwd: 42000,
    supplier: '常州金屬針布精密工業',
    priceValidUntil: '2026-11-30',
    isPriceExpired: false,
    stockStatus: 'sufficient',
    currentStock: 12
  },
  {
    id: 'BOM-800-C1-03',
    machineId: 'CR-800',
    bomVersion: 'Rev C.1',
    partNumber: 'PRT-KN-SKD11',
    partName: 'SKD-11 淬火耐磨撕碎旋轉動刀組',
    specification: 'SKD-11 / HRC 58-60 / 180x80x25mm',
    unit: '套',
    quantity: 2,
    moduleGroup: '雙初級撕碎機頭',
    unitPriceTwd: 48000,
    supplier: '日本大同特殊鋼特約代理',
    priceValidUntil: '2026-09-30',
    isPriceExpired: false,
    stockStatus: 'sufficient',
    currentStock: 14
  },
  {
    id: 'BOM-800-C1-04',
    machineId: 'CR-800',
    bomVersion: 'Rev C.1',
    partNumber: 'PRT-MTR-22K',
    partName: 'IE3 超高效變頻專用三相感應馬達 22kW',
    specification: '22kW 4P 380V 50Hz B3臥式',
    unit: '台',
    quantity: 3,
    moduleGroup: '大扭力主動力',
    unitPriceTwd: 38500,
    supplier: '台灣大同電機特約經銷商',
    priceValidUntil: '2026-10-31',
    isPriceExpired: false,
    stockStatus: 'sufficient',
    currentStock: 6
  },
  {
    id: 'BOM-800-C1-05',
    machineId: 'CR-800',
    bomVersion: 'Rev C.1',
    partNumber: 'PRT-FAN-11K',
    partName: '高壓防磨離心引風機組',
    specification: '11kW / 風量 8500 m³/h',
    unit: '組',
    quantity: 2,
    moduleGroup: '雙旋風風送除塵',
    unitPriceTwd: 52000,
    supplier: '順風工業通風設備',
    priceValidUntil: '2026-12-31',
    isPriceExpired: false,
    stockStatus: 'sufficient',
    currentStock: 5
  },
  {
    id: 'BOM-800-C1-06',
    machineId: 'CR-800',
    bomVersion: 'Rev C.1',
    partNumber: 'PRT-SEN-MD01',
    partName: '高靈敏度數字式金屬異物探測器',
    specification: '有效寬度 1400mm / 聲光反轉',
    unit: '組',
    quantity: 1,
    moduleGroup: '進料安全防護',
    unitPriceTwd: 145000,
    supplier: '瑞士梅特勒-托利多台灣',
    priceValidUntil: '2026-12-31',
    isPriceExpired: false,
    stockStatus: 'sufficient',
    currentStock: 7
  },
  {
    id: 'BOM-800-C1-07',
    machineId: 'CR-800',
    bomVersion: 'Rev C.1',
    partNumber: 'PRT-PLC-S712',
    partName: '西門子 S7-1200 PLC 集中控制箱主機',
    specification: 'CPU 1214C + 10吋觸控人機',
    unit: '套',
    quantity: 1,
    moduleGroup: '自動電控系統',
    unitPriceTwd: 168000,
    supplier: '巨茂自動化 (西門子)',
    priceValidUntil: '2026-12-31',
    isPriceExpired: false,
    stockStatus: 'sufficient',
    currentStock: 4
  },

  // CR-1200 Rev A.3 (Includes Hydraulic 120T Pack)
  {
    id: 'BOM-1200-A3-01',
    machineId: 'CR-1200',
    bomVersion: 'Rev A.3',
    partNumber: 'PRT-RL-4001',
    partName: 'Φ400mm 特種硬質合金針布刺輥',
    specification: 'Φ400x1300mm / 96齒',
    unit: '支',
    quantity: 8,
    moduleGroup: '8組超高密度刺輥組',
    unitPriceTwd: 58000,
    supplier: '常州金屬針布精密工業',
    priceValidUntil: '2026-12-31',
    isPriceExpired: false,
    stockStatus: 'sufficient',
    currentStock: 18
  },
  {
    id: 'BOM-1200-A3-02',
    machineId: 'CR-1200',
    bomVersion: 'Rev A.3',
    partNumber: 'PRT-HYD-120T',
    partName: '120噸立式雙缸油壓打包動力包與液壓閥組',
    specification: '雙缸 Φ250mm / 壓力 25 MPa',
    unit: '套',
    quantity: 1,
    moduleGroup: '120T全自動打包機構',
    unitPriceTwd: 480000,
    supplier: '德國力士樂 (Rexroth) 台灣',
    priceValidUntil: '2026-11-30',
    isPriceExpired: false,
    stockStatus: 'sufficient',
    currentStock: 2
  },
  {
    id: 'BOM-1200-A3-03',
    machineId: 'CR-1200',
    bomVersion: 'Rev A.3',
    partNumber: 'PRT-MTR-22K',
    partName: 'IE3 超高效變頻專用三相感應馬達 22kW',
    specification: '22kW 4P 380V 50Hz B3臥式',
    unit: '台',
    quantity: 4,
    moduleGroup: '強勁主動力馬達陣列',
    unitPriceTwd: 38500,
    supplier: '台灣大同電機特約經銷商',
    priceValidUntil: '2026-10-31',
    isPriceExpired: false,
    stockStatus: 'sufficient',
    currentStock: 6
  },
  {
    id: 'BOM-1200-A3-04',
    machineId: 'CR-1200',
    bomVersion: 'Rev A.3',
    partNumber: 'PRT-PLC-S712',
    partName: '西門子 S7-1200 PLC 集中控制箱主機',
    specification: 'CPU 1214C + 10吋彩色觸控 KTP1000',
    unit: '套',
    quantity: 1,
    moduleGroup: '自動電控系統',
    unitPriceTwd: 168000,
    supplier: '巨茂自動化 (西門子)',
    priceValidUntil: '2026-12-31',
    isPriceExpired: false,
    stockStatus: 'sufficient',
    currentStock: 4
  }
];

export const INITIAL_REQUIREMENTS: Requirement[] = [
  {
    id: 'REQ-2026-001',
    customerId: 'CUST-001',
    customerName: '遠東精密紡織股份有限公司',
    contactPerson: '林建宏 廠長',
    phone: '04-2359-1188',
    rawMaterialType: '紡織精梳/普梳落棉及筒管廢紗',
    capacityKgHr: 500,
    workshopDimensions: '長 25m x 寬 8m x 高 5.5m',
    powerConditions: '380V / 60Hz / 3相 / 變壓器備量 150kVA',
    budgetTwd: 2200000,
    targetDeliveryDate: '2026-08-30',
    specialRequests: '需配備高靈敏度金屬探測防護；排塵需低於 2.5mg/m³ 符合綠色工廠驗收標準。',
    status: 'pending_engineering',
    selectedMachineId: 'CR-500',
    missingFields: [],
    isComplete: true,
    createdAt: '2026-04-10',
    updatedAt: '2026-04-10'
  },
  {
    id: 'REQ-2026-002',
    customerId: 'CUST-002',
    customerName: '宏遠興業彰化二林廠',
    contactPerson: '陳美玲 採購專理',
    phone: '04-896-5522',
    rawMaterialType: '水刺不織布邊角料與聚酯混紡棉碎塊',
    capacityKgHr: 800,
    workshopDimensions: '長 30m x 寬 10m x 高 6.0m',
    powerConditions: '380V / 60Hz / 3相 / 變壓器備量 200kVA',
    budgetTwd: 3200000,
    targetDeliveryDate: '2026-09-15',
    specialRequests: '需雙撕碎機初開花，並提升蓬鬆度，要求纖維長度保留率 ≥ 75%。',
    status: 'quote_drafting',
    selectedMachineId: 'CR-800',
    missingFields: [],
    isComplete: true,
    createdAt: '2026-04-12',
    updatedAt: '2026-04-14'
  },
  {
    id: 'REQ-2026-003',
    customerId: 'CUST-004',
    customerName: '台南興國無紡科技股份有限公司',
    contactPerson: '張國良 總工程師',
    phone: '06-599-3366',
    // Missing required workshopDimensions and capacityKgHr to demonstrate F02 validation & Scenario 2
    rawMaterialType: '水刺無紡廢料',
    capacityKgHr: null,
    workshopDimensions: '',
    powerConditions: '380V / 60Hz / 3相',
    budgetTwd: 1800000,
    targetDeliveryDate: '2026-11-20',
    specialRequests: '廠房正在擴建二期中，尚未確定擺放機台的具體長寬高淨空。',
    status: 'draft',
    missingFields: ['需求處理量 (kg/hr)', '場地尺寸 (L x W x H)'],
    isComplete: false,
    createdAt: '2026-04-18',
    updatedAt: '2026-04-18'
  }
];

export const INITIAL_QUOTATIONS: Quotation[] = [
  {
    id: 'QT-2026-008',
    requirementId: 'REQ-2026-001',
    customerId: 'CUST-001',
    customerName: '遠東精密紡織股份有限公司',
    machineId: 'CR-500',
    machineName: 'CR-500 高效纖維開花落棉回收線',
    bomVersion: 'Rev B.2',
    version: 'v1.1',
    isLatest: true,
    
    // Cost breakdown
    bomPartsCost: 818000, // Sum of Rev B.2 BOM items
    laborAssemblyCost: 160000, // 120 assembly hrs * $1,000 + 40 electrical hrs * $1,000
    freightAndInstallCost: 120000, // Inland transport & 5 days on-site commissioning
    totalCost: 1098000,
    
    marginRate: 0.22, // 22% target margin
    calculatedPrice: 1407692, // 1098000 / (1 - 0.22)
    discountRate: 0.05, // 5% negotiated partner discount
    finalQuotedPrice: 1338000,
    currency: 'TWD',
    
    hasExpiredParts: true,
    expiredPartsCount: 1, // PRT-BD-1022 expired
    unconfirmedItems: ['PRT-BD-1022 弧形梳板價格已逾期，採購需重新確認台南精機最新報價'],
    
    aiExecutiveSummary: '本報價方案專為「遠東精密紡織股份有限公司」落棉與廢紗回收產線量身定制。配置 CR-500 標準機組，額定產能 500 kg/hr。透過 4 組特種硬質合金針布刺輥分梳與旋風脈衝集塵，在確保極佳纖維鬆弛度與 96% 除雜率的同時，維持工廠車間潔淨。標準交期約 60 天。',
    aiTechnicalGuarantee: '1. 額定處理量承諾：棉廢料水分含量 ≤ 10% 時，穩定產出 ≥ 500 kg/hr。\n2. 異物保護保證：金屬探測器 0.2 秒內連動反轉給料，防止異物進入打壞刺輥針布。\n3. 除塵保證：出口廢氣粉塵濃度 ≤ 2.5 mg/m³，符合環保標準。',
    aiDeliveryNotice: '報價包含台灣本島廠區吊裝就位、基礎線路連線、為期 5 工作天之試車調試與操作人員教育訓練（2班次）。',
    
    engineeringApproved: true,
    procurementApproved: false, // Waiting because of expired part
    salesApproved: true,
    executiveApproved: false,
    isFullyApproved: false,
    isFormalSent: false,
    
    approvalHistory: [
      {
        id: 'APP-001',
        quotationId: 'QT-2026-008',
        role: 'engineering',
        approverName: '黃志明 (資深機械工程師)',
        status: 'approved',
        comment: '核對 CR-500 Rev B.2 規格與遠東廠區 25m*8m 廠房相容，電力條件充足，技術審核通過。',
        timestamp: '2026-04-11 14:20'
      },
      {
        id: 'APP-002',
        quotationId: 'QT-2026-008',
        role: 'sales',
        approverName: '王大同 (業務部經理)',
        status: 'approved',
        comment: '客戶為長年優質夥伴，給予 5% 企業專案折扣，最終毛利預估 19.8%，符合銷售底限。',
        timestamp: '2026-04-11 16:45'
      },
      {
        id: 'APP-003',
        quotationId: 'QT-2026-008',
        role: 'procurement',
        approverName: '周淑華 (採購主管)',
        status: 'pending',
        comment: '⚠️ 注意：PRT-BD-1022 除雜梳針梳板報價已逾期，正在向供應商索取最新不銹鋼調價單，確認前暫緩核准。',
        timestamp: '2026-04-12 09:15'
      }
    ],
    createdAt: '2026-04-11',
    updatedAt: '2026-04-12',
    createdBy: '王大同 (業務專員)'
  },
  {
    id: 'QT-2026-005',
    requirementId: 'REQ-2025-089',
    customerId: 'CUST-002',
    customerName: '宏遠興業彰化二林廠',
    machineId: 'CR-800',
    machineName: 'CR-800 雙刺輥高速清梳棉回收機組',
    bomVersion: 'Rev C.1',
    version: 'v2.0',
    isLatest: true,
    
    bomPartsCost: 1256000,
    laborAssemblyCost: 210000,
    freightAndInstallCost: 180000,
    totalCost: 1646000,
    
    marginRate: 0.25,
    calculatedPrice: 2194666,
    discountRate: 0.02,
    finalQuotedPrice: 2150000,
    currency: 'TWD',
    
    hasExpiredParts: false,
    expiredPartsCount: 0,
    unconfirmedItems: [],
    
    aiExecutiveSummary: '針對宏遠興業二林廠之水刺不織布邊料處理需求，採購 CR-800 高速雙刺輥機型。經多方審批通過，已取得正式認證與合約簽署。',
    aiTechnicalGuarantee: '保證 800 kg/hr 連續運轉，纖維長度保留率 ≥ 75%，配備西門子 S7-1200 數位監控。',
    aiDeliveryNotice: '預計 75 工作天完工交機，含 1 年全機保固與消耗品更換培訓。',
    
    engineeringApproved: true,
    procurementApproved: true,
    salesApproved: true,
    executiveApproved: true,
    isFullyApproved: true,
    isFormalSent: true, // Formally Approved & Sent!
    
    approvalHistory: [
      {
        id: 'APP-010',
        quotationId: 'QT-2026-005',
        role: 'engineering',
        approverName: '黃志明 (工程師)',
        status: 'approved',
        comment: 'BOM Rev C.1 規格核定無誤。',
        timestamp: '2026-02-05 10:00'
      },
      {
        id: 'APP-011',
        quotationId: 'QT-2026-005',
        role: 'procurement',
        approverName: '周淑華 (採購主管)',
        status: 'approved',
        comment: '所有零件報價皆在有效期內，交期可配合。',
        timestamp: '2026-02-06 11:30'
      },
      {
        id: 'APP-012',
        quotationId: 'QT-2026-005',
        role: 'sales',
        approverName: '王大同 (業務經理)',
        status: 'approved',
        comment: '售價 2,150,000 元整，條件合宜。',
        timestamp: '2026-02-06 14:00'
      },
      {
        id: 'APP-013',
        quotationId: 'QT-2026-005',
        role: 'executive',
        approverName: '李國柱 (總經理)',
        status: 'approved',
        comment: '准予發送正式商務報價單，建立工單。',
        timestamp: '2026-02-07 09:00'
      }
    ],
    createdAt: '2026-02-04',
    updatedAt: '2026-02-07',
    createdBy: '王大同 (業務經理)'
  }
];

export const INITIAL_WORK_ORDERS: WorkOrder[] = [
  {
    id: 'WO-2026-101',
    quotationId: 'QT-2026-005',
    customerId: 'CUST-002',
    customerName: '宏遠興業彰化二林廠',
    machineId: 'CR-800',
    machineName: 'CR-800 雙刺輥高速清梳棉回收機組',
    mechanicalLead: '張振興 (機構組長)',
    electricalLead: '劉永全 (電控工程師)',
    siteLead: '郭文斌 (現場施工副理)',
    startDate: '2026-02-15',
    targetCompleteDate: '2026-05-15',
    currentPhase: 'factory_testing', // 備料 -> 組裝 -> 廠內試車 -> 現場安裝
    progressPercentage: 75,
    notes: '廠內通電運轉試車中，已連續開花測試 12 小時無跳脫，下一階段安排出廠包裝。'
  },
  {
    id: 'WO-2026-102',
    quotationId: 'QT-2026-002',
    customerId: 'CUST-003',
    customerName: '越南興南紡織責任有限公司',
    machineId: 'CR-1200',
    machineName: 'CR-1200 全自動落棉回收打包流水線',
    mechanicalLead: '張振興 (機構組長)',
    electricalLead: '劉永全 (電控工程師)',
    siteLead: '郭文斌 (現場施工副理)',
    startDate: '2026-03-01',
    targetCompleteDate: '2026-06-30',
    currentPhase: 'workshop_assembly',
    progressPercentage: 45,
    notes: '機架焊接完成，刺輥與液壓打包缸定位中。'
  }
];

export const INITIAL_ACCEPTANCE_TESTS: AcceptanceTest[] = [
  {
    id: 'ACC-2026-01',
    workOrderId: 'WO-2026-101',
    machineName: 'CR-800 雙刺輥高速清梳棉回收機組',
    testDate: '2026-04-15',
    ratedCapacityKgHr: 800,
    measuredCapacityKgHr: 835, // Passed: >800
    fiberOpeningRate: 98.2,     // 98.2%
    impurityRemovalRate: 96.5,  // 96.5%
    powerConsumptionKw: 104.2,  // Under 115 kW
    noiseLevelDb: 79.5,         // Under 85 dB
    status: 'passed',
    checkpoints: [
      { name: '急停與安全光幕反應時間', standard: '< 150 ms', result: 'pass' },
      { name: '金屬異物檢測自動反轉退料', standard: '100% 成功阻斷鐵件', result: 'pass' },
      { name: '各軸承溫升試驗 (連續4hr)', standard: '溫升 < 35°C 且無異音', result: 'pass' },
      { name: '除塵風道負壓監測', standard: '負壓 ≥ 2800 Pa', result: 'pass' },
      { name: '成品開花纖維蓬鬆度', standard: '膨脹比 ≥ 4.2 倍', result: 'pass' }
    ],
    inspector: '黃志明 (資深品保工程師)',
    customerRepresentative: '陳美玲 (宏遠專理)'
  }
];

export const INITIAL_KPI_STATS: KPIStats = {
  averageQuotationHoursBefore: 72,   // 過去平均 72 小時
  averageQuotationHoursCurrent: 24.5,// 現今 24.5 小時
  hoursReducedPercentage: 66.0,      // 降低 66% (目標 > 30%)
  averagePartsQueryMinutesBefore: 45,// 過去 45 分鐘
  averagePartsQueryMinutesCurrent: 4.8,// 現今 4.8 分鐘
  queryMinutesReducedPercentage: 89.3,// 降低 89.3% (目標 > 50%)
  activeQuotationsCount: 14,
  monthlyApprovedQuotesCount: 8,
  conversionRate: 68.5,
  onTimeDeliveryRate: 98.2
};
