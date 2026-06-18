import type { LicenseContract, User, Role, RoleRecommendation, LicenseRule, ComplianceAlert, SimulationScenario, ChargebackEntry, HeatMapCell, FueWeight, FueDepartmentBreakdown, FueRecommendation, FueTrendPoint, CrossSystemPerson, LawMeasurementSummary } from '../types';

// ─── KPIs ────────────────────────────────────────────────────────────────────
export const kpiData = {
  totalLicenses: 4800,
  consumed: 3420,
  available: 1380,
  complianceScore: 87,
  potentialSavings: 482000,
  contractsNearExpiry: 5,
  highRiskUsers: 43,
  indirectUsageRisk: 12,
};

// ─── License Consumption Heat Map (Department × License Type) ─────────────────
export const consumptionHeatMap: HeatMapCell[] = [
  { x: 'Finance', y: 'Professional', value: 92, label: '92%' },
  { x: 'Finance', y: 'Developer', value: 34, label: '34%' },
  { x: 'Finance', y: 'Limited', value: 78, label: '78%' },
  { x: 'Finance', y: 'Test', value: 15, label: '15%' },
  { x: 'HR', y: 'Professional', value: 60, label: '60%' },
  { x: 'HR', y: 'Developer', value: 10, label: '10%' },
  { x: 'HR', y: 'Limited', value: 88, label: '88%' },
  { x: 'HR', y: 'Test', value: 5, label: '5%' },
  { x: 'Logistics', y: 'Professional', value: 75, label: '75%' },
  { x: 'Logistics', y: 'Developer', value: 50, label: '50%' },
  { x: 'Logistics', y: 'Limited', value: 65, label: '65%' },
  { x: 'Logistics', y: 'Test', value: 40, label: '40%' },
  { x: 'Sales', y: 'Professional', value: 45, label: '45%' },
  { x: 'Sales', y: 'Developer', value: 8, label: '8%' },
  { x: 'Sales', y: 'Limited', value: 95, label: '95%' },
  { x: 'Sales', y: 'Test', value: 2, label: '2%' },
  { x: 'IT', y: 'Professional', value: 80, label: '80%' },
  { x: 'IT', y: 'Developer', value: 95, label: '95%' },
  { x: 'IT', y: 'Limited', value: 30, label: '30%' },
  { x: 'IT', y: 'Test', value: 70, label: '70%' },
  { x: 'Legal', y: 'Professional', value: 55, label: '55%' },
  { x: 'Legal', y: 'Developer', value: 5, label: '5%' },
  { x: 'Legal', y: 'Limited', value: 70, label: '70%' },
  { x: 'Legal', y: 'Test', value: 0, label: '0%' },
];

// ─── Cost Allocation Heat Map (Department × Month) ────────────────────────────
export const costHeatMap: HeatMapCell[] = [
  { x: 'Jan', y: 'Finance', value: 42000 },
  { x: 'Feb', y: 'Finance', value: 44000 },
  { x: 'Mar', y: 'Finance', value: 41000 },
  { x: 'Apr', y: 'Finance', value: 47000 },
  { x: 'May', y: 'Finance', value: 49000 },
  { x: 'Jun', y: 'Finance', value: 45000 },
  { x: 'Jan', y: 'IT', value: 63000 },
  { x: 'Feb', y: 'IT', value: 65000 },
  { x: 'Mar', y: 'IT', value: 61000 },
  { x: 'Apr', y: 'IT', value: 68000 },
  { x: 'May', y: 'IT', value: 70000 },
  { x: 'Jun', y: 'IT', value: 66000 },
  { x: 'Jan', y: 'HR', value: 18000 },
  { x: 'Feb', y: 'HR', value: 17000 },
  { x: 'Mar', y: 'HR', value: 19000 },
  { x: 'Apr', y: 'HR', value: 20000 },
  { x: 'May', y: 'HR', value: 18500 },
  { x: 'Jun', y: 'HR', value: 21000 },
  { x: 'Jan', y: 'Sales', value: 28000 },
  { x: 'Feb', y: 'Sales', value: 31000 },
  { x: 'Mar', y: 'Sales', value: 29000 },
  { x: 'Apr', y: 'Sales', value: 33000 },
  { x: 'May', y: 'Sales', value: 35000 },
  { x: 'Jun', y: 'Sales', value: 32000 },
  { x: 'Jan', y: 'Logistics', value: 22000 },
  { x: 'Feb', y: 'Logistics', value: 23000 },
  { x: 'Mar', y: 'Logistics', value: 21000 },
  { x: 'Apr', y: 'Logistics', value: 25000 },
  { x: 'May', y: 'Logistics', value: 24000 },
  { x: 'Jun', y: 'Logistics', value: 26000 },
];

// ─── Savings Opportunity Heat Map ─────────────────────────────────────────────
export const savingsHeatMap: HeatMapCell[] = [
  { x: 'Finance', y: 'Dormant Users', value: 45000 },
  { x: 'Finance', y: 'Over-licensed', value: 32000 },
  { x: 'Finance', y: 'Role Downgrade', value: 18000 },
  { x: 'IT', y: 'Dormant Users', value: 12000 },
  { x: 'IT', y: 'Over-licensed', value: 55000 },
  { x: 'IT', y: 'Role Downgrade', value: 40000 },
  { x: 'HR', y: 'Dormant Users', value: 22000 },
  { x: 'HR', y: 'Over-licensed', value: 8000 },
  { x: 'HR', y: 'Role Downgrade', value: 6000 },
  { x: 'Sales', y: 'Dormant Users', value: 38000 },
  { x: 'Sales', y: 'Over-licensed', value: 14000 },
  { x: 'Sales', y: 'Role Downgrade', value: 9000 },
  { x: 'Logistics', y: 'Dormant Users', value: 28000 },
  { x: 'Logistics', y: 'Over-licensed', value: 19000 },
  { x: 'Logistics', y: 'Role Downgrade', value: 11000 },
  { x: 'Legal', y: 'Dormant Users', value: 17000 },
  { x: 'Legal', y: 'Over-licensed', value: 7000 },
  { x: 'Legal', y: 'Role Downgrade', value: 4000 },
];

// ─── Contracts ────────────────────────────────────────────────────────────────
export const contracts: LicenseContract[] = [
  { id: 'C001', vendor: 'SAP', product: 'SAP ERP Professional', licensesTotal: 1200, licensesUsed: 1050, costPerLicense: 800, currency: 'USD', startDate: '2023-01-01', endDate: '2026-12-31', status: 'active', complianceScore: 88 },
  { id: 'C002', vendor: 'SAP', product: 'SAP Developer', licensesTotal: 300, licensesUsed: 285, costPerLicense: 1400, currency: 'USD', startDate: '2023-01-01', endDate: '2026-09-30', status: 'expiring', complianceScore: 95 },
  { id: 'C003', vendor: 'Microsoft', product: 'M365 E3', licensesTotal: 2000, licensesUsed: 1750, costPerLicense: 36, currency: 'USD', startDate: '2024-06-01', endDate: '2026-08-15', status: 'expiring', complianceScore: 87 },
  { id: 'C004', vendor: 'Salesforce', product: 'Sales Cloud Enterprise', licensesTotal: 500, licensesUsed: 320, costPerLicense: 150, currency: 'USD', startDate: '2022-03-01', endDate: '2027-02-28', status: 'active', complianceScore: 64 },
  { id: 'C005', vendor: 'ServiceNow', product: 'ITSM Pro', licensesTotal: 200, licensesUsed: 195, costPerLicense: 220, currency: 'USD', startDate: '2025-01-01', endDate: '2027-12-31', status: 'active', complianceScore: 97 },
  { id: 'C006', vendor: 'Oracle', product: 'HCM Cloud', licensesTotal: 400, licensesUsed: 180, costPerLicense: 480, currency: 'USD', startDate: '2021-07-01', endDate: '2026-06-30', status: 'expiring', complianceScore: 45 },
];

// ─── Users ────────────────────────────────────────────────────────────────────
export const users: User[] = [
  { id: 'U001', name: 'Alice Johnson', email: 'alice.j@corp.com', department: 'Finance', costCenter: 'CC-100', licenseType: 'Professional', lastLogin: '2024-01-15', roles: ['SAP_FI_POWER', 'SAP_CO_DISPLAY'], monthlyUsage: 2, risk: 'high' },
  { id: 'U002', name: 'Bob Martinez', email: 'bob.m@corp.com', department: 'IT', costCenter: 'CC-200', licenseType: 'Developer', lastLogin: '2026-06-17', roles: ['SAP_BASIS_ADMIN', 'SAP_ABAP_DEV'], monthlyUsage: 98, risk: 'low' },
  { id: 'U003', name: 'Carol Wu', email: 'carol.w@corp.com', department: 'HR', costCenter: 'CC-300', licenseType: 'Professional', lastLogin: null, roles: ['SAP_HR_MANAGER'], monthlyUsage: 0, risk: 'high' },
  { id: 'U004', name: 'David Kim', email: 'david.k@corp.com', department: 'Sales', costCenter: 'CC-400', licenseType: 'Professional', lastLogin: '2026-05-20', roles: ['SAP_SD_FULL'], monthlyUsage: 45, risk: 'low' },
  { id: 'U005', name: 'Eva Patel', email: 'eva.p@corp.com', department: 'Finance', costCenter: 'CC-100', licenseType: 'Professional', lastLogin: '2025-10-01', roles: ['SAP_FI_POWER', 'SAP_FI_DISPLAY', 'SAP_CO_FULL'], monthlyUsage: 8, risk: 'medium' },
  { id: 'U006', name: 'Frank Brown', email: 'frank.b@corp.com', department: 'Logistics', costCenter: 'CC-500', licenseType: 'Limited', lastLogin: '2026-06-15', roles: ['SAP_MM_DISPLAY'], monthlyUsage: 22, risk: 'low' },
  { id: 'U007', name: 'Grace Lee', email: 'grace.l@corp.com', department: 'Legal', costCenter: 'CC-600', licenseType: 'Professional', lastLogin: '2025-08-12', roles: ['SAP_FI_DISPLAY'], monthlyUsage: 3, risk: 'high' },
  { id: 'U008', name: 'Hank Torres', email: 'hank.t@corp.com', department: 'IT', costCenter: 'CC-200', licenseType: 'Developer', lastLogin: '2026-06-18', roles: ['SAP_ABAP_DEV', 'SAP_BASIS_ADMIN', 'SAP_PI_DEV'], monthlyUsage: 100, risk: 'low' },
];

// ─── Roles ────────────────────────────────────────────────────────────────────
export const roles: Role[] = [
  { id: 'R001', name: 'SAP_FI_POWER', description: 'Finance Power User', tcodes: ['FB01','FB50','F-02','FBL3N'], userCount: 145, avgMonthlyUsage: 62, costPerUser: 800, category: 'Finance' },
  { id: 'R002', name: 'SAP_FI_DISPLAY', description: 'Finance Display Only', tcodes: ['FB03','FBL3N','FBL5N'], userCount: 230, avgMonthlyUsage: 18, costPerUser: 300, category: 'Finance' },
  { id: 'R003', name: 'SAP_ABAP_DEV', description: 'ABAP Developer', tcodes: ['SE38','SE80','SM30','ST05'], userCount: 80, avgMonthlyUsage: 95, costPerUser: 1400, category: 'IT' },
  { id: 'R004', name: 'SAP_SD_FULL', description: 'Sales & Distribution Full', tcodes: ['VA01','VA02','VL01N','VF01'], userCount: 320, avgMonthlyUsage: 55, costPerUser: 800, category: 'Sales' },
  { id: 'R005', name: 'SAP_MM_DISPLAY', description: 'MM Read-only', tcodes: ['ME23N','MM03','MIGO'], userCount: 410, avgMonthlyUsage: 20, costPerUser: 300, category: 'Logistics' },
  { id: 'R006', name: 'SAP_HR_MANAGER', description: 'HR Manager', tcodes: ['PA40','PA30','PY30'], userCount: 65, avgMonthlyUsage: 42, costPerUser: 800, category: 'HR' },
  { id: 'R007', name: 'SAP_CO_FULL', description: 'Controlling Full Access', tcodes: ['KS01','KE51','CK11N'], userCount: 90, avgMonthlyUsage: 38, costPerUser: 800, category: 'Finance' },
  { id: 'R008', name: 'SAP_BASIS_ADMIN', description: 'Basis Administrator', tcodes: ['SM21','AL11','STMS','RZ10'], userCount: 25, avgMonthlyUsage: 88, costPerUser: 1400, category: 'IT' },
];

// ─── Role Recommendations ─────────────────────────────────────────────────────
export const roleRecommendations: RoleRecommendation[] = [
  { userId: 'U001', userName: 'Alice Johnson', currentRole: 'SAP_FI_POWER', suggestedRole: 'SAP_FI_DISPLAY', matchScore: 94, annualSavings: 6000, reason: 'User only uses display transactions. 94% TCode overlap with display role.' },
  { userId: 'U005', userName: 'Eva Patel', currentRole: 'SAP_FI_POWER', suggestedRole: 'SAP_FI_DISPLAY', matchScore: 89, annualSavings: 6000, reason: 'Low monthly usage (8 sessions). Display access sufficient.' },
  { userId: 'U007', userName: 'Grace Lee', currentRole: 'SAP_FI_DISPLAY', suggestedRole: 'SAP_FI_DISPLAY', matchScore: 100, annualSavings: 0, reason: 'Already on optimal role.' },
  { userId: 'U003', userName: 'Carol Wu', currentRole: 'SAP_HR_MANAGER', suggestedRole: 'SAP_HR_MANAGER', matchScore: 100, annualSavings: 0, reason: 'Dormant — recommend license removal.' },
];

// ─── License Rules ────────────────────────────────────────────────────────────
export const licenseRules: LicenseRule[] = [
  { id: 'LR001', name: 'Finance AP Manager → Professional', description: 'Assign Professional for AP Managers in Finance', condition: 'Department = Finance AND Role = AP_MANAGER', action: 'Assign Professional License', priority: 1, status: 'active', lastRun: '2026-06-17', matchCount: 38 },
  { id: 'LR002', name: 'Developer Role → Developer License', description: 'Auto-assign Developer license for ABAP/Java roles', condition: 'Role CONTAINS "DEV" OR Role CONTAINS "ABAP"', action: 'Assign Developer License', priority: 2, status: 'active', lastRun: '2026-06-17', matchCount: 80 },
  { id: 'LR003', name: 'Display-only → Limited License', description: 'Downgrade users with only display roles to Limited', condition: 'ALL Roles ENDSWITH "_DISPLAY"', action: 'Assign Limited License', priority: 3, status: 'active', lastRun: '2026-06-10', matchCount: 215 },
  { id: 'LR004', name: 'Inactive 180+ days → Flag for Removal', description: 'Flag users inactive for 180+ days', condition: 'LastLogin < TODAY - 180 DAYS', action: 'Set Status = Flagged', priority: 4, status: 'active', lastRun: '2026-06-17', matchCount: 127 },
  { id: 'LR005', name: 'Test System Users → Test License', description: 'Assign Test license for non-prod systems', condition: 'SystemType = TEST', action: 'Assign Test License', priority: 5, status: 'draft', lastRun: null, matchCount: 0 },
];

// ─── Compliance Alerts ────────────────────────────────────────────────────────
export const complianceAlerts: ComplianceAlert[] = [
  { id: 'CA001', severity: 'critical', title: 'Contract Over-usage', description: 'SAP Developer contract at 95% — 15 licenses from breach', affectedUsers: 15, detectedAt: '2026-06-18', category: 'Contract' },
  { id: 'CA002', severity: 'high', title: 'Dormant Licensed Users', description: '127 users inactive >180 days hold active Professional licenses', affectedUsers: 127, detectedAt: '2026-06-17', category: 'User' },
  { id: 'CA003', severity: 'high', title: 'Indirect Access Risk', description: '12 third-party integrations accessing SAP without proper license classification', affectedUsers: 12, detectedAt: '2026-06-15', category: 'Indirect Access' },
  { id: 'CA004', severity: 'medium', title: 'Contract Expiring Soon', description: 'M365 E3 contract expires in 58 days', affectedUsers: 2000, detectedAt: '2026-06-18', category: 'Contract' },
  { id: 'CA005', severity: 'medium', title: 'Oracle HCM Under-utilization', description: 'Oracle HCM used at only 45% — 220 unused licenses', affectedUsers: 220, detectedAt: '2026-06-16', category: 'Contract' },
  { id: 'CA006', severity: 'low', title: 'Role Overlap Detected', description: '34 users have redundant roles with identical TCode coverage', affectedUsers: 34, detectedAt: '2026-06-14', category: 'Role' },
];

// ─── Simulation Scenarios ─────────────────────────────────────────────────────
export const simulationScenarios: SimulationScenario[] = [
  { id: 'S001', name: 'Hire 500 new Finance users', type: 'add-users', parameters: { count: 500, department: 'Finance', licenseType: 'Professional' }, estimatedCostDelta: 480000, estimatedLicenseDelta: 500, createdAt: '2026-06-10' },
  { id: 'S002', name: 'Remove dormant 127 users', type: 'remove-users', parameters: { count: 127, filter: 'inactive-180' }, estimatedCostDelta: -145000, estimatedLicenseDelta: -127, createdAt: '2026-06-12' },
  { id: 'S003', name: 'Downgrade 300 display-only users', type: 'downgrade', parameters: { count: 300, from: 'Professional', to: 'Limited' }, estimatedCostDelta: -150000, estimatedLicenseDelta: 0, createdAt: '2026-06-14' },
  { id: 'S004', name: 'Remove SAP_CO_FULL from Sales', type: 'remove-role', parameters: { role: 'SAP_CO_FULL', department: 'Sales' }, estimatedCostDelta: -38400, estimatedLicenseDelta: -48, createdAt: '2026-06-15' },
];

// ─── Chargeback ───────────────────────────────────────────────────────────────
export const chargebackData: ChargebackEntry[] = [
  { department: 'Finance', costCenter: 'CC-100', region: 'EMEA', licenseCount: 420, monthlyCost: 47000, annualCost: 564000, licenseTypes: { Professional: 280, Developer: 20, Limited: 120 } },
  { department: 'IT', costCenter: 'CC-200', region: 'Global', licenseCount: 310, monthlyCost: 66000, annualCost: 792000, licenseTypes: { Professional: 150, Developer: 130, Limited: 30 } },
  { department: 'HR', costCenter: 'CC-300', region: 'EMEA', licenseCount: 185, monthlyCost: 19000, annualCost: 228000, licenseTypes: { Professional: 65, Developer: 0, Limited: 120 } },
  { department: 'Sales', costCenter: 'CC-400', region: 'Americas', licenseCount: 520, monthlyCost: 33000, annualCost: 396000, licenseTypes: { Professional: 320, Developer: 0, Limited: 200 } },
  { department: 'Logistics', costCenter: 'CC-500', region: 'APAC', licenseCount: 440, monthlyCost: 24000, annualCost: 288000, licenseTypes: { Professional: 80, Developer: 10, Limited: 350 } },
  { department: 'Legal', costCenter: 'CC-600', region: 'EMEA', licenseCount: 95, monthlyCost: 10000, annualCost: 120000, licenseTypes: { Professional: 55, Developer: 0, Limited: 40 } },
];

// ─── Usage Trend (last 6 months) ──────────────────────────────────────────────
export const usageTrend = [
  { month: 'Jan', professional: 1080, developer: 270, limited: 1820, test: 190 },
  { month: 'Feb', professional: 1100, developer: 275, limited: 1840, test: 185 },
  { month: 'Mar', professional: 1090, developer: 280, limited: 1870, test: 180 },
  { month: 'Apr', professional: 1150, developer: 282, limited: 1890, test: 175 },
  { month: 'May', professional: 1200, developer: 285, limited: 1910, test: 170 },
  { month: 'Jun', professional: 1050, developer: 285, limited: 1920, test: 165 },
];

// ─── FUE — SAP Full User Equivalent ──────────────────────────────────────────
// SAP FUE weights are defined in SAP's Global License Audit Methodology (GLAM).
// Each license category consumes a fraction of one "Full User Equivalent".
// The contracted FUE cap must not be exceeded; over-usage triggers audit fees.

export const fueWeights: FueWeight[] = [
  {
    licenseType: 'Professional',
    weight: 1.00,
    sapCategory: 'SAP S/4HANA Professional User',
    description: 'Full access to all SAP application functionality. Highest FUE cost.',
    monthlyFee: 150,
  },
  {
    licenseType: 'Developer',
    weight: 1.00,
    sapCategory: 'SAP Developer',
    description: 'Full development & customisation access. Same FUE weight as Professional.',
    monthlyFee: 160,
  },
  {
    licenseType: 'Advanced',
    weight: 1.00,
    sapCategory: 'SAP S/4HANA Advanced User',
    description: 'Access to selected functional areas beyond core transactions.',
    monthlyFee: 130,
  },
  {
    licenseType: 'Core',
    weight: 0.50,
    sapCategory: 'SAP S/4HANA Core User',
    description: 'Restricted to core transactions in a single functional area.',
    monthlyFee: 75,
  },
  {
    licenseType: 'Limited',
    weight: 0.33,
    sapCategory: 'SAP Limited Professional User',
    description: 'Read/display access or narrow functional scope.',
    monthlyFee: 50,
  },
  {
    licenseType: 'ESS',
    weight: 0.10,
    sapCategory: 'SAP Employee Self-Service',
    description: 'Self-service HR/payroll access only. Very low FUE cost.',
    monthlyFee: 15,
  },
  {
    licenseType: 'Test',
    weight: 0.01,
    sapCategory: 'SAP Test User',
    description: 'Non-productive systems only. Negligible FUE consumption.',
    monthlyFee: 2,
  },
];

// Lookup helper
export const fueWeightMap: Record<string, number> = Object.fromEntries(
  fueWeights.map(w => [w.licenseType, w.weight])
);

export const fueDepartmentData: FueDepartmentBreakdown[] = [
  { department: 'Finance',   professional: 280, developer: 20,  limited: 120, ess: 60,  test: 10, totalFue: 366.8, contractedFue: 380, savingsOpportunity: 42.6 },
  { department: 'IT',        professional: 150, developer: 130, limited: 30,  ess: 10,  test: 40, totalFue: 292.7, contractedFue: 300, savingsOpportunity: 28.0 },
  { department: 'HR',        professional: 65,  developer: 0,   limited: 120, ess: 200, test: 5,  totalFue: 124.7, contractedFue: 130, savingsOpportunity: 18.3 },
  { department: 'Sales',     professional: 320, developer: 0,   limited: 200, ess: 80,  test: 8,  totalFue: 394.0, contractedFue: 400, savingsOpportunity: 55.2 },
  { department: 'Logistics', professional: 80,  developer: 10,  limited: 350, ess: 120, test: 15, totalFue: 225.9, contractedFue: 240, savingsOpportunity: 31.4 },
  { department: 'Legal',     professional: 55,  developer: 0,   limited: 40,  ess: 20,  test: 2,  totalFue: 70.2,  contractedFue: 80,  savingsOpportunity: 9.8 },
];

// Computed: total FUE contracted vs consumed
export const fueSummary = {
  contracted: fueDepartmentData.reduce((s, d) => s + d.contractedFue, 0),
  consumed: fueDepartmentData.reduce((s, d) => s + d.totalFue, 0),
  savingsOpportunity: fueDepartmentData.reduce((s, d) => s + d.savingsOpportunity, 0),
  complianceRisk: fueDepartmentData.filter(d => d.totalFue / d.contractedFue > 0.95).length,
};

export const fueRecommendations: FueRecommendation[] = [
  {
    id: 'FR001', userId: 'U001', userName: 'Alice Johnson', department: 'Finance',
    currentLicense: 'Professional', currentFue: 1.00,
    recommendedLicense: 'Limited', recommendedFue: 0.33,
    fueSaving: 0.67, annualCostSaving: 1200,
    confidence: 96,
    reason: 'Only display TCodes used in last 12 months (FB03, FBL3N). No write activity detected.',
  },
  {
    id: 'FR002', userId: 'U003', userName: 'Carol Wu', department: 'HR',
    currentLicense: 'Professional', currentFue: 1.00,
    recommendedLicense: 'ESS', recommendedFue: 0.10,
    fueSaving: 0.90, annualCostSaving: 1620,
    confidence: 100,
    reason: 'User has never logged in. ESS assigned only for payslip access per HR policy.',
  },
  {
    id: 'FR003', userId: 'U005', userName: 'Eva Patel', department: 'Finance',
    currentLicense: 'Professional', currentFue: 1.00,
    recommendedLicense: 'Core', recommendedFue: 0.50,
    fueSaving: 0.50, annualCostSaving: 900,
    confidence: 82,
    reason: 'Only FI module transactions used (<10 sessions/month). Core license covers required TCodes.',
  },
  {
    id: 'FR004', userId: 'U007', userName: 'Grace Lee', department: 'Legal',
    currentLicense: 'Professional', currentFue: 1.00,
    recommendedLicense: 'Limited', recommendedFue: 0.33,
    fueSaving: 0.67, annualCostSaving: 1200,
    confidence: 91,
    reason: 'Read-only access to FI documents only. Display role sufficient.',
  },
  {
    id: 'FR005', userId: 'U004', userName: 'David Kim', department: 'Sales',
    currentLicense: 'Professional', currentFue: 1.00,
    recommendedLicense: 'Core', recommendedFue: 0.50,
    fueSaving: 0.50, annualCostSaving: 900,
    confidence: 74,
    reason: 'SD module only. Core license covers VA01, VA02, VF01 scope.',
  },
];

export const fueTrend: FueTrendPoint[] = [
  { month: 'Jan', contracted: 1530, consumed: 1465, optimized: 1320 },
  { month: 'Feb', contracted: 1530, consumed: 1472, optimized: 1295 },
  { month: 'Mar', contracted: 1530, consumed: 1480, optimized: 1275 },
  { month: 'Apr', contracted: 1530, consumed: 1490, optimized: 1260 },
  { month: 'May', contracted: 1530, consumed: 1500, optimized: 1245 },
  { month: 'Jun', contracted: 1530, consumed: 1474, optimized: 1229 },
];

// ─── Cross-System Identity & SAP LAW ─────────────────────────────────────────
// SAP LAW (License Administration Workbench) consolidates user measurements
// across all connected systems. The HIGHEST license type found for a person
// across ALL systems is what SAP charges — even if the user only needs that
// license in one system. Identifying and fixing these cross-system uplifts
// is one of the highest-ROI optimisation actions.

export const crossSystemPersons: CrossSystemPerson[] = [
  {
    id: 'CSP001',
    resolvedName: 'Vineet Gupta',
    email: 'vineet.gupta@corp.com',
    department: 'Finance',
    employeeId: 'EMP-1042',
    matchConfidence: 97,
    matchBasis: ['email-domain', 'name-similarity', 'employee-id'],
    lawLicense: 'Professional',
    lawFueCost: 1.00,
    lawAnnualCost: 1800,
    optimisedLicense: 'Limited',
    optimisedAnnualCost: 600,
    annualSaving: 1200,
    riskLevel: 'high',
    duplicateReason: 'Same person detected as "vgupta" in S4H_PRD and "vineetg" in ECC_PRD. LAW charges Professional for both systems.',
    accounts: [
      { systemId: 'S4H_PRD', systemName: 'S/4HANA Production', systemType: 'S4H', userId: 'vgupta', licenseType: 'Professional', licenseTypeRank: 5, lastLogin: '2026-06-15', roles: ['SAP_FI_POWER', 'SAP_CO_DISPLAY'], fueCost: 1.00, annualCost: 1800 },
      { systemId: 'ECC_PRD', systemName: 'ECC 6.0 Production', systemType: 'ECC', userId: 'vineetg', licenseType: 'Limited', licenseTypeRank: 3, lastLogin: '2026-04-10', roles: ['SAP_FI_DISPLAY'], fueCost: 0.33, annualCost: 600 },
      { systemId: 'BW_PRD',  systemName: 'BW/4HANA Production', systemType: 'BW', userId: 'vgupta', licenseType: 'Limited', licenseTypeRank: 3, lastLogin: '2025-12-01', roles: ['BW_REPORTER'], fueCost: 0.33, annualCost: 600 },
    ],
  },
  {
    id: 'CSP002',
    resolvedName: 'Anjali Sharma',
    email: 'anjali.sharma@corp.com',
    department: 'HR',
    employeeId: 'EMP-2087',
    matchConfidence: 94,
    matchBasis: ['email-domain', 'name-similarity'],
    lawLicense: 'Developer',
    lawFueCost: 1.00,
    lawAnnualCost: 1920,
    optimisedLicense: 'Professional',
    optimisedAnnualCost: 1800,
    annualSaving: 120,
    riskLevel: 'medium',
    duplicateReason: '"asharma" in GRC_PRD has Developer license (needed for GRC config) but "anjalis" in HR_PRD only needs Professional. LAW forces Developer rate for HR system.',
    accounts: [
      { systemId: 'HR_PRD',  systemName: 'SAP HCM Production', systemType: 'HR',  userId: 'anjalis',  licenseType: 'Professional', licenseTypeRank: 5, lastLogin: '2026-06-17', roles: ['SAP_HR_MANAGER', 'SAP_PA_FULL'], fueCost: 1.00, annualCost: 1800 },
      { systemId: 'GRC_PRD', systemName: 'SAP GRC Production',  systemType: 'GRC', userId: 'asharma',  licenseType: 'Developer',    licenseTypeRank: 6, lastLogin: '2026-01-20', roles: ['GRC_CONFIG', 'GRC_ADMIN'],    fueCost: 1.00, annualCost: 1920 },
    ],
  },
  {
    id: 'CSP003',
    resolvedName: 'Raj Mehta',
    email: 'raj.mehta@corp.com',
    department: 'IT',
    employeeId: 'EMP-0315',
    matchConfidence: 99,
    matchBasis: ['employee-id', 'email-exact'],
    lawLicense: 'Developer',
    lawFueCost: 1.00,
    lawAnnualCost: 1920,
    optimisedLicense: null,
    optimisedAnnualCost: 1920,
    annualSaving: 0,
    riskLevel: 'low',
    duplicateReason: '"rmehta" in S4H_PRD and "rajm" in ECC_PRD confirmed same person. Developer required in both — no saving available but consolidation reduces audit risk.',
    accounts: [
      { systemId: 'S4H_PRD', systemName: 'S/4HANA Production', systemType: 'S4H', userId: 'rmehta', licenseType: 'Developer', licenseTypeRank: 6, lastLogin: '2026-06-18', roles: ['SAP_ABAP_DEV', 'SAP_BASIS_ADMIN'], fueCost: 1.00, annualCost: 1920 },
      { systemId: 'ECC_PRD', systemName: 'ECC 6.0 Production', systemType: 'ECC', userId: 'rajm',   licenseType: 'Developer', licenseTypeRank: 6, lastLogin: '2026-06-10', roles: ['SAP_ABAP_DEV'],                   fueCost: 1.00, annualCost: 1920 },
      { systemId: 'BW_PRD',  systemName: 'BW/4HANA Production', systemType: 'BW', userId: 'rmehta', licenseType: 'Limited',   licenseTypeRank: 3, lastLogin: '2026-03-15', roles: ['BW_DEVELOPER'],                  fueCost: 0.33, annualCost: 600  },
    ],
  },
  {
    id: 'CSP004',
    resolvedName: 'Priya Nair',
    email: 'priya.nair@corp.com',
    department: 'Sales',
    employeeId: 'EMP-3204',
    matchConfidence: 88,
    matchBasis: ['name-similarity', 'department-match'],
    lawLicense: 'Professional',
    lawFueCost: 1.00,
    lawAnnualCost: 1800,
    optimisedLicense: 'Limited',
    optimisedAnnualCost: 600,
    annualSaving: 1200,
    riskLevel: 'high',
    duplicateReason: '"pnair" in CRM_PRD (Professional) vs "priya.n" in S4H_PRD (Limited). CRM Professional license causes LAW uplift for S/4HANA. CRM access no longer required per manager confirmation.',
    accounts: [
      { systemId: 'CRM_PRD', systemName: 'SAP CRM Production',  systemType: 'CRM', userId: 'pnair',   licenseType: 'Professional', licenseTypeRank: 5, lastLogin: '2025-09-12', roles: ['CRM_SALES_FULL'],  fueCost: 1.00, annualCost: 1800 },
      { systemId: 'S4H_PRD', systemName: 'S/4HANA Production',  systemType: 'S4H', userId: 'priya.n', licenseType: 'Limited',      licenseTypeRank: 3, lastLogin: '2026-06-01', roles: ['SAP_SD_DISPLAY'], fueCost: 0.33, annualCost: 600  },
    ],
  },
  {
    id: 'CSP005',
    resolvedName: 'Thomas Weber',
    email: 'thomas.weber@corp.com',
    department: 'Logistics',
    employeeId: 'EMP-4411',
    matchConfidence: 91,
    matchBasis: ['email-domain', 'name-similarity'],
    lawLicense: 'Professional',
    lawFueCost: 1.00,
    lawAnnualCost: 1800,
    optimisedLicense: 'Core',
    optimisedAnnualCost: 900,
    annualSaving: 900,
    riskLevel: 'high',
    duplicateReason: '"tweber" in ECC_PRD (Professional/MM) vs "t.weber" in S4H_PRD (Limited). ECC MM Professional exceeds actual need — Core license covers all used TCodes.',
    accounts: [
      { systemId: 'ECC_PRD', systemName: 'ECC 6.0 Production',  systemType: 'ECC', userId: 'tweber',  licenseType: 'Professional', licenseTypeRank: 5, lastLogin: '2026-05-20', roles: ['SAP_MM_FULL', 'SAP_WM_FULL'], fueCost: 1.00, annualCost: 1800 },
      { systemId: 'S4H_PRD', systemName: 'S/4HANA Production',  systemType: 'S4H', userId: 't.weber', licenseType: 'Limited',      licenseTypeRank: 3, lastLogin: '2026-06-12', roles: ['SAP_MM_DISPLAY'],             fueCost: 0.33, annualCost: 600  },
    ],
  },
  {
    id: 'CSP006',
    resolvedName: 'Fatima Al-Hassan',
    email: 'fatima.alhassan@corp.com',
    department: 'Finance',
    employeeId: 'EMP-5529',
    matchConfidence: 85,
    matchBasis: ['name-similarity', 'department-match'],
    lawLicense: 'Professional',
    lawFueCost: 1.00,
    lawAnnualCost: 1800,
    optimisedLicense: 'ESS',
    optimisedAnnualCost: 180,
    annualSaving: 1620,
    riskLevel: 'critical',
    duplicateReason: '"falhassan" in S4H_PRD never logged in (dormant). "f.alhassan" in HR_PRD is ESS-only. LAW charges Professional for both. Removing S4H account saves max cost.',
    accounts: [
      { systemId: 'S4H_PRD', systemName: 'S/4HANA Production', systemType: 'S4H', userId: 'falhassan', licenseType: 'Professional', licenseTypeRank: 5, lastLogin: null,         roles: ['SAP_FI_POWER'],    fueCost: 1.00, annualCost: 1800 },
      { systemId: 'HR_PRD',  systemName: 'SAP HCM Production', systemType: 'HR',  userId: 'f.alhassan', licenseType: 'ESS',          licenseTypeRank: 1, lastLogin: '2026-06-01', roles: ['HR_ESS_PAYSLIP'], fueCost: 0.10, annualCost: 180  },
    ],
  },
];

export const lawMeasurementSummary: LawMeasurementSummary[] = [
  { systemId: 'S4H_PRD', systemName: 'S/4HANA Production', systemType: 'S4H', totalUsers: 1240, professional: 820, developer: 120, limited: 240, ess: 50, test: 10, lawContribution: 1023.7 },
  { systemId: 'ECC_PRD', systemName: 'ECC 6.0 Production', systemType: 'ECC', totalUsers: 980,  professional: 560, developer: 80,  limited: 300, ess: 30, test: 10, lawContribution: 745.9  },
  { systemId: 'BW_PRD',  systemName: 'BW/4HANA Production', systemType: 'BW', totalUsers: 420,  professional: 80,  developer: 40,  limited: 280, ess: 10, test: 10, lawContribution: 165.2  },
  { systemId: 'CRM_PRD', systemName: 'SAP CRM Production', systemType: 'CRM', totalUsers: 310,  professional: 200, developer: 10,  limited: 90,  ess: 5,  test: 5,  lawContribution: 239.8  },
  { systemId: 'GRC_PRD', systemName: 'SAP GRC Production', systemType: 'GRC', totalUsers: 145,  professional: 30,  developer: 95,  limited: 15,  ess: 0,  test: 5,  lawContribution: 129.0  },
  { systemId: 'HR_PRD',  systemName: 'SAP HCM Production', systemType: 'HR',  totalUsers: 880,  professional: 110, developer: 0,   limited: 280, ess: 480, test: 10, lawContribution: 249.8  },
];

// Derived: unique persons with LAW uplift (cross-system mismatch)
export const lawUpliftPersons = crossSystemPersons.filter(p =>
  p.accounts.some(a => a.licenseTypeRank < Math.max(...p.accounts.map(x => x.licenseTypeRank)))
);
export const totalLawSavings = crossSystemPersons.reduce((s, p) => s + p.annualSaving, 0);

