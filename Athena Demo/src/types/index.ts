export type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW' | 'CRITICAL';
export type CaseStatus = 'New' | 'Recommended Changes' | 'True Hit' | 'False Hit';
export type CasePriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type EntityType = 'INDIVIDUAL' | 'CORPORATE' | 'EXCHANGE' | 'DEFI' | 'MIXER' | 'WALLET' | 'HIGH_RISK_ORG';
export type CaseType = 'FIAT' | 'CRYPTO';

export interface Rule {
  id: string;
  name: string;
  category: string;
  severity: RiskLevel;
  description: string;
}

export interface Entity {
  id: string;
  type: EntityType;
  subtype?: string; // e.g., 'CEX', 'DEX', 'Sanctioned'
  name: string;
  riskScore: number;
}

export interface Alert {
  id: string;
  title: string;
  policyCategory: string;
  direction: 'Incoming' | 'Outgoing';
  status: 'Open' | 'In Progress' | 'Closed' | 'Unassigned' | 'New';
  assignee: string | null;
  riskLevel: RiskLevel;
  createdAt: string;
  sourceOfFunds?: string;
}

export interface Finding {
  id: string;
  caseId: string;
  author: string;
  content: string;
  createdAt: string; // ISO date
}

export interface Transaction {
  id: string;
  hash: string;
  chain: 'BTC' | 'ETH' | 'TRX' | 'SOL' | 'BSC';
  asset: 'BTC' | 'ETH' | 'USDT' | 'USDC';
  amount: number;
  usdValue: number;
  feeNative: number;
  feeUsd: number;
  timestamp: string; // ISO date
  dateAdded: string;
  lastScreenedAt: string;
  riskLevel: RiskLevel;
  riskScore: number; // 0-100
  originator: Entity;
  beneficiary: Entity;
  rulesTriggered: string[]; // Rule IDs
  status: 'CLEARED' | 'ALERT' | 'CASE_OPEN' | 'BLOCKED';
  openAlertsCount: number;
  alerts?: Alert[];
}

export interface Case {
  id: string;
  type: CaseType;
  status: CaseStatus;
  priority: CasePriority;
  bucket: string; // e.g., "Money Laundering", "Sanctions"
  assignee: string | null;
  createdDate: string;
  ageing: number; // days
  alertCount: number;
  customerName: string;
  customerId: string;
  description: string;
  // Specific fields for Crypto Cases
  txHash?: string;
  chain?: 'BTC' | 'ETH' | 'TRX' | 'SOL' | 'BSC';
  policy?: string;
  ruleName?: string;
  riskLevel?: RiskLevel;
  linkedTxIds?: string[];
  notes?: string[];
}
