// ─── Core domain types ───────────────────────────────────────────────────────

export interface KpiCard {
  title: string;
  value: string | number;
  delta?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: string;
}

export interface HeatMapCell {
  x: string;
  y: string;
  value: number;
  label?: string;
}

export interface LicenseContract {
  id: string;
  vendor: string;
  product: string;
  licensesTotal: number;
  licensesUsed: number;
  costPerLicense: number;
  currency: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'expiring' | 'expired';
  complianceScore: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  costCenter: string;
  licenseType: string;
  lastLogin: string | null;
  roles: string[];
  monthlyUsage: number;
  risk: 'low' | 'medium' | 'high';
}

export interface Role {
  id: string;
  name: string;
  description: string;
  tcodes: string[];
  userCount: number;
  avgMonthlyUsage: number;
  costPerUser: number;
  category: string;
}

export interface RoleRecommendation {
  userId: string;
  userName: string;
  currentRole: string;
  suggestedRole: string;
  matchScore: number;
  annualSavings: number;
  reason: string;
}

export interface LicenseRule {
  id: string;
  name: string;
  description: string;
  condition: string;
  action: string;
  priority: number;
  status: 'active' | 'draft' | 'disabled';
  lastRun: string | null;
  matchCount: number;
}

export interface ComplianceAlert {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  affectedUsers: number;
  detectedAt: string;
  category: string;
}

export interface SimulationScenario {
  id: string;
  name: string;
  type: 'add-users' | 'remove-users' | 'add-role' | 'remove-role' | 'downgrade';
  parameters: Record<string, unknown>;
  estimatedCostDelta: number;
  estimatedLicenseDelta: number;
  createdAt: string;
}

export interface ChargebackEntry {
  department: string;
  costCenter: string;
  region: string;
  licenseCount: number;
  monthlyCost: number;
  annualCost: number;
  licenseTypes: Record<string, number>;
}

export type NavSection = {
  label: string;
  icon: string;
  path: string;
  children?: { label: string; path: string }[];
};

// ─── Cross-System User Identity & SAP LAW ────────────────────────────────────

/** A user account that exists in one particular SAP/non-SAP system */
export interface SystemUserAccount {
  systemId: string;
  systemName: string;
  systemType: 'S4H' | 'ECC' | 'CRM' | 'BW' | 'GRC' | 'HR' | 'NON-SAP';
  userId: string;
  licenseType: string;
  licenseTypeRank: number;    // higher = more expensive (used to find LAW max)
  lastLogin: string | null;
  roles: string[];
  fueCost: number;            // FUE weight of this license
  annualCost: number;
}

/** A resolved "real person" who may have multiple accounts across systems */
export interface CrossSystemPerson {
  id: string;
  resolvedName: string;
  email: string;
  department: string;
  employeeId: string;
  accounts: SystemUserAccount[];
  matchConfidence: number;          // 0-100
  matchBasis: string[];             // e.g. ['email-domain', 'name-similarity', 'employee-id']
  /** SAP LAW rule: highest license type across all systems is charged for ALL */
  lawLicense: string;
  lawFueCost: number;
  lawAnnualCost: number;
  /** If we can consolidate / downgrade the highest system, potential saving */
  optimisedLicense: string | null;
  optimisedAnnualCost: number;
  annualSaving: number;
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  duplicateReason: string;          // why flagged as duplicate
}

/** Summary of LAW measurement across all systems */
export interface LawMeasurementSummary {
  systemId: string;
  systemName: string;
  systemType: string;
  totalUsers: number;
  professional: number;
  developer: number;
  limited: number;
  ess: number;
  test: number;
  lawContribution: number;   // FUE contributed to consolidated LAW count
}


/** SAP FUE weight per license type */
export interface FueWeight {
  licenseType: string;
  weight: number;           // e.g. 1.0 = 1 full FUE
  description: string;
  sapCategory: string;      // SAP official category name
  monthlyFee: number;       // USD per user per month
}

/** FUE consumption broken down by department */
export interface FueDepartmentBreakdown {
  department: string;
  professional: number;     // user count
  developer: number;
  limited: number;
  ess: number;              // Employee Self-Service
  test: number;
  totalFue: number;
  contractedFue: number;
  savingsOpportunity: number; // FUE that can be freed
}

/** Individual FUE reduction recommendation */
export interface FueRecommendation {
  id: string;
  userId: string;
  userName: string;
  department: string;
  currentLicense: string;
  currentFue: number;
  recommendedLicense: string;
  recommendedFue: number;
  fueSaving: number;
  annualCostSaving: number;
  confidence: number;       // 0-100
  reason: string;
}

/** FUE trend data point */
export interface FueTrendPoint {
  month: string;
  contracted: number;
  consumed: number;
  optimized: number;        // projected after optimizations
}
