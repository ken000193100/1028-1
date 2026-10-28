/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserRole, Requirement, Quotation } from './types';
import { 
  INITIAL_CUSTOMERS, 
  INITIAL_MACHINES, 
  INITIAL_PARTS, 
  INITIAL_PART_PRICES, 
  INITIAL_BOM_ITEMS, 
  INITIAL_REQUIREMENTS, 
  INITIAL_QUOTATIONS, 
  INITIAL_WORK_ORDERS, 
  INITIAL_ACCEPTANCE_TESTS, 
  INITIAL_KPI_STATS 
} from './data/mockData';

import { Header } from './components/Header';
import { RoleSwitcherModal } from './components/RoleSwitcherModal';
import { ScenarioSimulatorModal } from './components/ScenarioSimulatorModal';

import { KPIDashboardModule } from './components/modules/KPIDashboardModule';
import { RequirementModule } from './components/modules/RequirementModule';
import { CustomerModule } from './components/modules/CustomerModule';
import { MachineModule } from './components/modules/MachineModule';
import { BOMModule } from './components/modules/BOMModule';
import { PartPriceModule } from './components/modules/PartPriceModule';
import { AISearchModule } from './components/modules/AISearchModule';
import { QuotationModule } from './components/modules/QuotationModule';
import { WorkOrderModule } from './components/modules/WorkOrderModule';
import { AcceptanceModule } from './components/modules/AcceptanceModule';

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('sales');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [showRoleModal, setShowRoleModal] = useState<boolean>(false);
  const [showScenarioModal, setShowScenarioModal] = useState<boolean>(false);

  // Core Data States
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [machines, setMachines] = useState(INITIAL_MACHINES);
  const [parts, setParts] = useState(INITIAL_PARTS);
  const [partPrices, setPartPrices] = useState(INITIAL_PART_PRICES);
  const [bomItems, setBomItems] = useState(INITIAL_BOM_ITEMS);
  const [requirements, setRequirements] = useState(INITIAL_REQUIREMENTS);
  const [quotations, setQuotations] = useState(INITIAL_QUOTATIONS);
  const [workOrders, setWorkOrders] = useState(INITIAL_WORK_ORDERS);
  const [acceptanceTests, setAcceptanceTests] = useState(INITIAL_ACCEPTANCE_TESTS);
  const [kpiStats] = useState(INITIAL_KPI_STATS);

  // Active selections across tabs
  const [selectedMachineForBOM, setSelectedMachineForBOM] = useState<string>('CR-500');
  const [activeQuotationId, setActiveQuotationId] = useState<string>('QT-2026-008');

  // Interactive link: when price is updated in F05, sync BOM items & Quotations
  const handlePriceUpdated = () => {
    // Check if PRT-BD-1022 is now valid
    const bdPrice = partPrices.find(p => p.partNumber === 'PRT-BD-1022');
    const isNowValid = bdPrice ? !bdPrice.isExpired : true;

    setBomItems(prev => prev.map(item => {
      if (item.partNumber === 'PRT-BD-1022') {
        return {
          ...item,
          isPriceExpired: !isNowValid,
          unitPriceTwd: bdPrice ? bdPrice.unitPrice : item.unitPriceTwd,
          priceValidUntil: bdPrice ? bdPrice.validUntil : item.priceValidUntil
        };
      }
      return item;
    }));

    setQuotations(prev => prev.map(q => {
      if (q.id === 'QT-2026-008') {
        return {
          ...q,
          hasExpiredParts: !isNowValid,
          expiredPartsCount: isNowValid ? 0 : 1,
          unconfirmedItems: isNowValid ? [] : q.unconfirmedItems
        };
      }
      return q;
    }));
  };

  const handleSelectRequirementForQuote = (req: Requirement) => {
    const machine = machines.find(m => m.id === req.selectedMachineId) || machines[0];
    const newQuoteId = `QT-2026-00${quotations.length + 1}`;
    
    // Calculate BOM cost
    const currentBOM = bomItems.filter(b => b.machineId === machine.id && b.bomVersion === machine.currentBomVersion);
    const bomCost = currentBOM.reduce((sum, item) => sum + (item.unitPriceTwd * item.quantity), 0);
    const laborCost = (machine.standardAssemblyHours + machine.standardElectricalHours) * 1000;
    const freightCost = 120000;
    const totalCost = bomCost + laborCost + freightCost;
    const margin = 0.22;
    const finalPrice = Math.round((totalCost / (1 - margin)) * 0.95);

    const hasExpired = currentBOM.some(b => b.isPriceExpired);

    const newQuote: Quotation = {
      id: newQuoteId,
      requirementId: req.id,
      customerId: req.customerId,
      customerName: req.customerName,
      machineId: machine.id,
      machineName: machine.name,
      bomVersion: machine.currentBomVersion,
      version: 'v1.0',
      isLatest: true,
      bomPartsCost: bomCost,
      laborAssemblyCost: laborCost,
      freightAndInstallCost: freightCost,
      totalCost: totalCost,
      marginRate: margin,
      calculatedPrice: Math.round(totalCost / (1 - margin)),
      discountRate: 0.05,
      finalQuotedPrice: finalPrice,
      currency: 'TWD',
      hasExpiredParts: hasExpired,
      expiredPartsCount: hasExpired ? 1 : 0,
      unconfirmedItems: hasExpired ? ['PRT-BD-1022 梳板報價過期需重新確認'] : [],
      aiExecutiveSummary: `為「${req.customerName}」量身定制 ${machine.name} 報價草案。`,
      aiTechnicalGuarantee: `1. 處理量承諾 ≥ ${req.capacityKgHr || 500} kg/hr\n2. 異物反轉防護 0.2s\n3. 全機保固 12 個月`,
      aiDeliveryNotice: '預計 60 工作天完工交機，包含現場調試與人員培訓。',
      engineeringApproved: true,
      procurementApproved: !hasExpired,
      salesApproved: true,
      executiveApproved: false,
      isFullyApproved: false,
      isFormalSent: false,
      approvalHistory: [
        {
          id: `APP-${Date.now()}`,
          quotationId: newQuoteId,
          role: 'sales',
          approverName: '業務部經理',
          status: 'approved',
          comment: '由需求單轉換建立報價草稿 v1.0',
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
        }
      ],
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      createdBy: '業務部'
    };

    setQuotations([newQuote, ...quotations]);
    setActiveQuotationId(newQuote.id);
    setActiveTab('quotations');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      {/* Top Header */}
      <Header
        currentRole={currentRole}
        onSelectRole={setCurrentRole}
        onOpenRoleModal={() => setShowRoleModal(true)}
        onOpenScenarioModal={() => setShowScenarioModal(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <KPIDashboardModule
            kpiStats={kpiStats}
            currentRole={currentRole}
            onNavigateToTab={setActiveTab}
            onOpenScenarioModal={() => setShowScenarioModal(true)}
          />
        )}

        {activeTab === 'requirements' && (
          <RequirementModule
            requirements={requirements}
            setRequirements={setRequirements}
            customers={customers}
            machines={machines}
            currentRole={currentRole}
            onSelectRequirementForQuote={handleSelectRequirementForQuote}
            onNavigateToTab={setActiveTab}
          />
        )}

        {activeTab === 'customers' && (
          <CustomerModule
            customers={customers}
            setCustomers={setCustomers}
            currentRole={currentRole}
            onNavigateToTab={setActiveTab}
          />
        )}

        {activeTab === 'machines' && (
          <MachineModule
            machines={machines}
            setMachines={setMachines}
            currentRole={currentRole}
            onNavigateToTab={setActiveTab}
            onSelectMachineForBOM={(mId) => {
              setSelectedMachineForBOM(mId);
              setActiveTab('bom');
            }}
          />
        )}

        {activeTab === 'bom' && (
          <BOMModule
            bomItems={bomItems}
            setBomItems={setBomItems}
            machines={machines}
            selectedMachineId={selectedMachineForBOM}
            setSelectedMachineId={setSelectedMachineForBOM}
            currentRole={currentRole}
            onNavigateToTab={setActiveTab}
          />
        )}

        {activeTab === 'prices' && (
          <PartPriceModule
            partPrices={partPrices}
            setPartPrices={setPartPrices}
            parts={parts}
            currentRole={currentRole}
            onPriceUpdated={handlePriceUpdated}
          />
        )}

        {activeTab === 'ai_search' && (
          <AISearchModule
            currentRole={currentRole}
            machines={machines}
            onNavigateToTab={setActiveTab}
          />
        )}

        {activeTab === 'quotations' && (
          <QuotationModule
            quotations={quotations}
            setQuotations={setQuotations}
            requirements={requirements}
            machines={machines}
            bomItems={bomItems}
            currentRole={currentRole}
            onNavigateToTab={setActiveTab}
            activeQuotationId={activeQuotationId}
          />
        )}

        {activeTab === 'work_orders' && (
          <WorkOrderModule
            workOrders={workOrders}
            setWorkOrders={setWorkOrders}
            currentRole={currentRole}
            onNavigateToTab={setActiveTab}
          />
        )}

        {activeTab === 'acceptance' && (
          <AcceptanceModule
            acceptanceTests={acceptanceTests}
            currentRole={currentRole}
            onNavigateToTab={setActiveTab}
          />
        )}
      </main>

      {/* Role Switcher Modal */}
      <RoleSwitcherModal
        isOpen={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        currentRole={currentRole}
        onSelectRole={setCurrentRole}
      />

      {/* Acceptance Scenario Simulator Modal */}
      <ScenarioSimulatorModal
        isOpen={showScenarioModal}
        onClose={() => setShowScenarioModal(false)}
        onNavigateToTab={setActiveTab}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>棉花回收設備 AI 輔助報價與零件查詢系統 V1.0 ｜ 符合工業級 Functional Specification</span>
          <span className="text-slate-400">
            第一版驗收通過標準：需求檢查 100%、BOM 一致率 100%、AI 引用正確率 ≥ 95%、工時降低 ≥ 30%
          </span>
        </div>
      </footer>
    </div>
  );
}
