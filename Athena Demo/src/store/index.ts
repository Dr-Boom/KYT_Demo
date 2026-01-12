import { create } from 'zustand';
import { Transaction, Case, Rule, Finding } from '@/types';
import { INITIAL_TRANSACTIONS, INITIAL_CASES, MOCK_RULES } from '@/data/mock-data';

interface AppState {
  transactions: Transaction[];
  cases: Case[];
  rules: Rule[];
  findingsByCaseId: Record<string, Finding[]>;
  
  // Actions
  addCase: (newCase: Case) => void;
  updateCaseStatus: (id: string, status: Case['status']) => void;
  updateCaseAssignee: (id: string, assignee: string | null) => void;
  updateTransactionStatus: (id: string, status: Transaction['status']) => void;
  addFinding: (caseId: string, content: string, author?: string) => void;
  deleteFinding: (caseId: string, findingId: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  transactions: INITIAL_TRANSACTIONS,
  cases: INITIAL_CASES,
  rules: MOCK_RULES,
  findingsByCaseId: {},
  
  addCase: (newCase) => set((state) => ({ cases: [newCase, ...state.cases] })),
  
  updateCaseStatus: (id, status) => set((state) => ({
    cases: state.cases.map((c) => c.id === id ? { ...c, status } : c)
  })),

  updateCaseAssignee: (id, assignee) => set((state) => ({
    cases: state.cases.map((c) => c.id === id ? { ...c, assignee } : c)
  })),
  
  updateTransactionStatus: (id, status) => set((state) => ({
    transactions: state.transactions.map((t) => t.id === id ? { ...t, status } : t)
  })),

  addFinding: (caseId, content, author = "HAONAN") =>
    set((state) => {
      const trimmed = content.trim()
      if (!trimmed) return state
      const id = `FND-${Math.random().toString(16).slice(2, 10)}`
      const createdAt = new Date().toISOString()
      const next: Finding = { id, caseId, author, content: trimmed, createdAt }
      const current = state.findingsByCaseId[caseId] ?? []
      return {
        findingsByCaseId: {
          ...state.findingsByCaseId,
          [caseId]: [next, ...current],
        },
      }
    }),

  deleteFinding: (caseId, findingId) =>
    set((state) => {
      const current = state.findingsByCaseId[caseId] ?? []
      return {
        findingsByCaseId: {
          ...state.findingsByCaseId,
          [caseId]: current.filter((f) => f.id !== findingId),
        },
      }
    }),
}));
