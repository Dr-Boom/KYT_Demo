import { Transaction, Case, Rule, Entity, RiskLevel, CaseStatus, CasePriority, CaseType, Alert } from '@/types';

// Constants
const CHAINS = ['BTC', 'ETH', 'TRX', 'SOL', 'BSC'] as const;
const ASSETS = ['BTC', 'ETH', 'USDT', 'USDC'] as const;
const RISKS: RiskLevel[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
const STATUSES = ['CLEARED', 'ALERT', 'CASE_OPEN', 'BLOCKED'] as const;
const CASE_STATUSES: CaseStatus[] = ['New', 'Recommended Changes', 'True Hit', 'False Hit'];
const CASE_PRIORITIES: CasePriority[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
const BUCKETS = ['AML', 'Sanctions', 'Fraud', 'Darknet', 'Ransomware', 'High Value'];
const ASSIGNEES = ['Alice Chen', 'Bob Smith', 'Charlie Kim', 'Diana Prince', 'Evan Wright', null];
const POLICIES = ['Travel Rule', 'Sanctions Screening', 'High Risk Jurisdiction', 'Large Transaction'];

// Rules
export const MOCK_RULES: Rule[] = [
  { id: 'R-001', name: 'High Value Transaction', category: 'Velocity', severity: 'MEDIUM', description: 'Transaction value exceeds threshold' },
  { id: 'R-002', name: 'Sanctioned Entity Interaction', category: 'Sanctions', severity: 'CRITICAL', description: 'Direct interaction with sanctioned wallet' },
  { id: 'R-003', name: 'Structuring / Smurfing', category: 'Pattern', severity: 'HIGH', description: 'Multiple transactions just below reporting threshold' },
  { id: 'R-004', name: 'Darknet Market Exposure', category: 'Exposure', severity: 'HIGH', description: 'Exposure to known darknet market cluster' },
  { id: 'R-005', name: 'Mixer Usage', category: 'Obfuscation', severity: 'HIGH', description: 'Funds from Tornado Cash or similar mixer' },
  { id: 'R-006', name: 'New Account High Velocity', category: 'Velocity', severity: 'MEDIUM', description: 'New account engaging in rapid transactions' },
];

// Seeded Random Number Generator
class SeededRandom {
    private seed: number;
    constructor(seed: number) {
        this.seed = seed;
    }
    // Linear Congruential Generator
    next() {
        this.seed = (this.seed * 9301 + 49297) % 233280;
        return this.seed / 233280;
    }
}

const rng = new SeededRandom(123456789);

// Helper functions using seeded RNG
const seededRandom = () => rng.next();
const getRandomInt = (min: number, max: number) => Math.floor(seededRandom() * (max - min + 1)) + min;
const getRandomChoice = <T>(arr: readonly T[] | T[]) => arr[Math.floor(seededRandom() * arr.length)];
const getRandomDate = (start: Date, end: Date) => new Date(start.getTime() + seededRandom() * (end.getTime() - start.getTime())).toISOString();

const generateHash = (len: number = 64) => {
  const chars = '0123456789abcdef';
  return '0x' + Array(len).fill(0).map(() => chars[Math.floor(seededRandom() * chars.length)]).join('');
};

const generateWalletAddress = () => {
  const roll = seededRandom()
  // EVM-style 0x address (most common in crypto compliance UIs)
  if (roll < 0.6) {
    const hex = '0123456789abcdef'
    return (
      '0x' +
      Array(40)
        .fill(0)
        .map(() => hex[Math.floor(seededRandom() * hex.length)])
        .join('')
    )
  }
  // TRON-style base58-ish address (starts with T)
  if (roll < 0.8) {
    const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
    return (
      'T' +
      Array(33)
        .fill(0)
        .map(() => chars[Math.floor(seededRandom() * chars.length)])
        .join('')
    )
  }
  // BTC bech32-ish (lowercase)
  const bech = '023456789acdefghjklmnpqrstuvwxyz'
  return (
    'bc1' +
    Array(39)
      .fill(0)
      .map(() => bech[Math.floor(seededRandom() * bech.length)])
      .join('')
  )
}

const generateEntity = (type: 'Originator' | 'Beneficiary'): Entity => {
  const types = ['INDIVIDUAL', 'CORPORATE', 'EXCHANGE', 'DEFI'] as const;
  const entityType = getRandomChoice(types);
  return {
    id: generateWalletAddress(),
    type: entityType,
    name: `${type} ${getRandomInt(1, 100)}`,
    riskScore: getRandomInt(0, 100),
  };
};

const generateAlerts = (count: number): Alert[] => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `${getRandomInt(10000000, 99999999)}`,
    title: getRandomChoice(['Indirect High Risk Activity', 'Sanctioned Entity Exposure', 'Darknet Interaction', 'Structuring']),
    policyCategory: getRandomChoice(['Source of Funds', 'Sanctions', 'AML']),
    direction: seededRandom() > 0.5 ? 'Incoming' : 'Outgoing',
    status: getRandomChoice(['Open', 'In Progress', 'Closed', 'Unassigned', 'New']),
    assignee: getRandomChoice(ASSIGNEES),
    riskLevel: getRandomChoice(RISKS),
    createdAt: getRandomDate(new Date('2023-10-01'), new Date()),
    sourceOfFunds: getRandomChoice(['Exchange', 'DeFi', 'Unknown', 'Mixer']),
  }));
};

export const generateTransactions = (count: number): Transaction[] => {
  return Array.from({ length: count }).map((_, i) => {
    const amount = seededRandom() * 10000;
    const asset = getRandomChoice(ASSETS);
    // Simple USD conversion approximation
    const usdValue = asset === 'BTC' ? amount * 40000 : asset === 'ETH' ? amount * 2200 : amount;
    
    // Risk distribution skew
    const riskRoll = seededRandom();
    let riskLevel: RiskLevel = 'LOW';
    if (riskRoll > 0.95) riskLevel = 'CRITICAL';
    else if (riskRoll > 0.85) riskLevel = 'HIGH';
    else if (riskRoll > 0.65) riskLevel = 'MEDIUM';

    const rulesTriggered = [];
    if (riskLevel !== 'LOW') {
      const numRules = getRandomInt(1, 3);
      for (let j = 0; j < numRules; j++) {
        rulesTriggered.push(getRandomChoice(MOCK_RULES).id);
      }
    }
    
    const alertsCount = riskLevel !== 'LOW' ? getRandomInt(1, 5) : 0;

    return {
      id: `TX-${getRandomInt(10000, 99999)}`,
      hash: generateHash(),
      chain: getRandomChoice(CHAINS),
      asset,
      amount: parseFloat(amount.toFixed(4)),
      usdValue: parseFloat(usdValue.toFixed(2)),
      feeNative: parseFloat((seededRandom() * 0.01).toFixed(6)),
      feeUsd: parseFloat((seededRandom() * 5).toFixed(2)),
      timestamp: getRandomDate(new Date('2023-01-01'), new Date()),
      dateAdded: getRandomDate(new Date('2023-01-01'), new Date()),
      lastScreenedAt: getRandomDate(new Date('2023-10-01'), new Date()),
      riskLevel,
      riskScore: riskLevel === 'CRITICAL' ? getRandomInt(90, 100) : riskLevel === 'HIGH' ? getRandomInt(70, 89) : riskLevel === 'MEDIUM' ? getRandomInt(40, 69) : getRandomInt(0, 39),
      originator: generateEntity('Originator'),
      beneficiary: generateEntity('Beneficiary'),
      rulesTriggered: [...new Set(rulesTriggered)], // Unique rules
      status: riskLevel === 'CRITICAL' || riskLevel === 'HIGH' ? 'ALERT' : 'CLEARED',
      openAlertsCount: alertsCount,
      alerts: alertsCount > 0 ? generateAlerts(alertsCount) : [],
    };
  });
};

export const generateCases = (count: number): Case[] => {
  return Array.from({ length: count }).map((_, i) => {
    const created = new Date(getRandomDate(new Date('2023-08-01'), new Date()));
    const now = new Date();
    const ageing = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
    const type: CaseType = seededRandom() > 0.5 ? 'CRYPTO' : 'FIAT';
    
    // Crypto specific fields
    const cryptoFields = type === 'CRYPTO' ? {
      txHash: generateHash(),
      chain: getRandomChoice(CHAINS),
      policy: getRandomChoice(POLICIES),
      ruleName: getRandomChoice(MOCK_RULES).name,
      riskLevel: getRandomChoice(RISKS)
    } : {};

    return {
      id: `CASE-${getRandomInt(1000, 9999)}`,
      type,
      status:
        // Default should be "New" (no decision yet). Occasionally pre-seed a decision for demo variety.
        seededRandom() > 0.85
          ? getRandomChoice(['Recommended Changes', 'True Hit', 'False Hit'])
          : 'New',
      priority: getRandomChoice(CASE_PRIORITIES),
      bucket: getRandomChoice(BUCKETS),
      assignee: getRandomChoice(ASSIGNEES),
      createdDate: created.toISOString(),
      ageing,
      alertCount: getRandomInt(1, 10),
      customerName: `Customer ${getRandomInt(100, 999)}`,
      customerId: `CUST-${getRandomInt(10000, 99999)}`,
      description: 'Suspicious pattern detected in multiple transactions.',
      linkedTxIds: type === 'CRYPTO' ? [generateHash()] : [],
      notes: [],
      ...cryptoFields
    };
  });
};

// Generate initial state
export const INITIAL_TRANSACTIONS = generateTransactions(300);
export const INITIAL_CASES = generateCases(50);
