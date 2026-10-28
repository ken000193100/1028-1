export type UserRole = 
  | 'customer_service' // 客服
  | 'sales'            // 業務
  | 'engineering'      // 工程
  | 'procurement'      // 採購
  | 'warehouse'        // 倉管
  | 'site_manager'     // 施工主管
  | 'admin';           // 主管/管理員

export interface RolePermission {
  role: UserRole;
  label: string;
  badgeColor: string;
  allowedActions: string[];
  restrictions: string[];
}

export interface Customer {
  id: string;
  companyName: string;
  taxId?: string;
  contactPerson: string;
  phone: string;
  email: string;
  factoryAddress: string;
  country: string;
  scale: string; // e.g. 中型紡織廠, 萬錠氣流紡廠, 國際無紡布代工
  historicalProjectsCount: number;
  createdAt: string;
}

export type RequirementStatus = 
  | 'draft'               // 草稿 (缺少資料)
  | 'pending_engineering' // 資料完整 - 待工程評估
  | 'engineering_approved'// 工程評估完成 (機型選定)
  | 'quote_drafting'      // 報價產生中
  | 'closed';             // 已結案/已成立訂單

export interface Requirement {
  id: string; // e.g. REQ-2026-001
  customerId: string;
  customerName: string;
  contactPerson: string;
  phone: string;
  // Mandatory fields
  rawMaterialType: string;       // 棉花原料種類 (紡織落棉、廢紗布料、開花落棉、牛仔布碎料、水刺無紡廢料等)
  capacityKgHr: number | null;   // 需求處理量 (kg/hr)
  workshopDimensions: string;    // 場地尺寸 (L x W x H)
  powerConditions: string;       // 電力條件 (e.g. 380V/50Hz/3相 100kW)
  budgetTwd: number | null;      // 預算 (TWD)
  targetDeliveryDate: string;    // 預計交機日期
  // Optional & tracking
  specialRequests?: string;      // 特殊工藝需求 (如防塵防爆、自動打包、除鐵磁選)
  attachments?: string[];
  status: RequirementStatus;
  selectedMachineId?: string;
  missingFields: string[];       // 系統自動標記的缺漏欄位
  isComplete: boolean;           // 必填是否100%完整
  createdAt: string;
  updatedAt: string;
}

export interface Machine {
  id: string; // e.g. CR-500
  name: string;
  modelSeries: string;
  ratedCapacityKgHr: number;     // 額定產能 (kg/hr)
  capacityRange: string;         // 400~600 kg/hr
  dimensions: string;            // 18.5m x 3.2m x 3.8m
  totalPowerKw: number;          // 78 kW
  voltageSpec: string;           // 380V 3P 50/60Hz
  targetMaterials: string[];     // 適合原料
  features: string[];
  standardAssemblyHours: number; // 標準組裝調試工時 (人時)
  standardElectricalHours: number; // 標準配盤電控工時 (人時)
  currentBomVersion: string;     // 最新 BOM 版本
  availableBomVersions: string[];// 歷史可用版本
  description: string;
  image?: string;
}

export interface Part {
  id: string;          // PRT-RL-4001
  partNumber: string;  // 料號
  name: string;        // 品名
  category: 'core_carding' | 'power_drive' | 'dust_exhaust' | 'electric_plc' | 'shredder_knife' | 'hydraulic_pack' | 'chassis_frame';
  specification: string; // 規格型號
  unit: string;        // 台、組、支、個、條、公尺
  stockQuantity: number;
  safetyStock: number;
  leadTimeDays: number;
}

export interface PartPrice {
  id: string;
  partNumber: string;
  supplier: string;
  unitPrice: number;    // 單價
  currency: 'TWD' | 'USD';
  quoteDate: string;    // 報價日期
  validUntil: string;   // 有效期限
  isExpired: boolean;   // 是否過期
  notes?: string;
}

export interface BOMItem {
  id: string;
  machineId: string;
  bomVersion: string;   // Rev B.2
  partNumber: string;
  partName: string;
  specification: string;
  unit: string;
  quantity: number;
  moduleGroup: string;  // e.g. 開纖刺輥組、粗撕碎機頭、脈衝集塵櫃、PLC集中電控
  unitPriceTwd: number;
  supplier: string;
  priceValidUntil: string;
  isPriceExpired: boolean;
  stockStatus: 'sufficient' | 'low' | 'out_of_stock';
  currentStock: number;
}

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface ApprovalRecord {
  id: string;
  quotationId: string;
  role: 'engineering' | 'procurement' | 'sales' | 'executive';
  approverName: string;
  status: ApprovalStatus;
  comment: string;
  timestamp: string;
}

export interface Quotation {
  id: string;               // QT-2026-008
  requirementId: string;
  customerId: string;
  customerName: string;
  machineId: string;
  machineName: string;
  bomVersion: string;
  version: string;          // v1.0, v1.1, v2.0
  isLatest: boolean;
  
  // Cost breakdown
  bomPartsCost: number;     // 材料零件成本
  laborAssemblyCost: number;// 組裝及配盤工時成本
  freightAndInstallCost: number; // 運輸及現場調試費用
  totalCost: number;        // 總製造成本
  
  marginRate: number;       // 利潤率 (e.g. 0.22 = 22%)
  calculatedPrice: number;  // 依公式計算建議售價 (totalCost / (1 - marginRate))
  discountRate: number;     // 折扣率 (0~0.2)
  finalQuotedPrice: number; // 最終正式報價金額 (TWD)
  currency: 'TWD' | 'USD';

  // Warnings & Checklist
  hasExpiredParts: boolean;
  expiredPartsCount: number;
  unconfirmedItems: string[];
  
  // AI summary & proposal text
  aiExecutiveSummary?: string;
  aiTechnicalGuarantee?: string;
  aiDeliveryNotice?: string;
  
  // Multi-party approval state
  engineeringApproved: boolean;
  procurementApproved: boolean;
  salesApproved: boolean;
  executiveApproved: boolean;
  isFullyApproved: boolean;
  isFormalSent: boolean;
  
  approvalHistory: ApprovalRecord[];
  
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface WorkOrder {
  id: string;             // WO-2026-101
  quotationId: string;
  customerId: string;
  customerName: string;
  machineId: string;
  machineName: string;
  mechanicalLead: string; // 機構負責人
  electricalLead: string; // 電控負責人
  siteLead: string;       // 現場施工主管
  startDate: string;
  targetCompleteDate: string;
  currentPhase: 'material_prep' | 'workshop_assembly' | 'factory_testing' | 'site_commissioning' | 'completed';
  progressPercentage: number;
  notes?: string;
}

export interface AcceptanceTest {
  id: string;
  workOrderId: string;
  machineName: string;
  testDate: string;
  ratedCapacityKgHr: number;
  measuredCapacityKgHr: number;
  fiberOpeningRate: number;    // 開花率 % (e.g. 98.5%)
  impurityRemovalRate: number; // 除雜率 % (e.g. 96.2%)
  powerConsumptionKw: number;
  noiseLevelDb: number;
  status: 'passed' | 'retest_required' | 'pending';
  checkpoints: {
    name: string;
    standard: string;
    result: 'pass' | 'fail';
  }[];
  inspector: string;
  customerRepresentative: string;
}

export interface KPIStats {
  averageQuotationHoursBefore: number; // 72 hrs
  averageQuotationHoursCurrent: number;// 24 hrs
  hoursReducedPercentage: number;      // 66.7%
  averagePartsQueryMinutesBefore: number; // 45 mins
  averagePartsQueryMinutesCurrent: number;// 4 mins
  queryMinutesReducedPercentage: number;  // 91.1%
  activeQuotationsCount: number;
  monthlyApprovedQuotesCount: number;
  conversionRate: number; // 68%
  onTimeDeliveryRate: number; // 98%
}

export interface AISearchResult {
  query: string;
  answer: string;
  sources: {
    title: string;
    type: 'machine_spec' | 'bom_version' | 'part_price' | 'historical_quote';
    versionOrRef: string;
    verified: boolean;
  }[];
  warningMessage?: string;
}
