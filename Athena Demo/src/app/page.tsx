"use client"

import { useAppStore } from "@/store"
import { KpiCard } from "@/components/dashboard/KpiCard"
import { FilterBar } from "@/components/dashboard/FilterBar"
import { TransactionTable } from "@/components/dashboard/TransactionTable"
import { TransactionDrawer } from "@/components/dashboard/TransactionDrawer"
import { useState, useMemo } from "react"
import { Transaction } from "@/types"

export default function Dashboard() {
  const { transactions, rules } = useAppStore()
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  
  // Filter state
  const [filters, setFilters] = useState({
    chain: 'all',
    asset: 'all',
    risk: 'all',
    search: '',
  })

  // Derived Data
  const filteredData = useMemo(() => {
    return transactions.filter(t => {
      if (filters.chain !== 'all' && t.chain !== filters.chain) return false;
      if (filters.asset !== 'all' && t.asset !== filters.asset) return false;
      if (filters.risk !== 'all' && t.riskLevel !== filters.risk) return false;
      if (filters.search && !t.hash.toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    });
  }, [transactions, filters]);

  // KPI Calculations
  const riskDistribution = useMemo(() => {
    const counts = { HIGH: 0, MEDIUM: 0, LOW: 0, CRITICAL: 0 };
    filteredData.forEach(t => counts[t.riskLevel]++);
    return [
      { name: 'Critical', value: counts.CRITICAL, color: '#a855f7' }, // purple-500
      { name: 'High', value: counts.HIGH, color: '#ef4444' }, // red-500
      { name: 'Medium', value: counts.MEDIUM, color: '#f97316' }, // orange-500
      { name: 'Low', value: counts.LOW, color: '#22c55e' }, // green-500
    ].filter(d => d.value > 0);
  }, [filteredData]);

  const statusDistribution = useMemo(() => {
     const counts = { CLEARED: 0, ALERT: 0, CASE_OPEN: 0, BLOCKED: 0 };
     filteredData.forEach(t => counts[t.status]++);
     return [
        { name: 'Cleared', value: counts.CLEARED, color: '#22c55e' },
        { name: 'Alert', value: counts.ALERT, color: '#ef4444' },
        { name: 'Case', value: counts.CASE_OPEN, color: '#3b82f6' },
        { name: 'Blocked', value: counts.BLOCKED, color: '#64748b' },
     ].filter(d => d.value > 0);
  }, [filteredData]);

  const ruleTriggerStats = useMemo(() => {
     const counts: Record<string, number> = {};
     filteredData.forEach(t => {
        t.rulesTriggered.forEach(rId => {
           const ruleName = rules.find(r => r.id === rId)?.name || rId;
           counts[ruleName] = (counts[ruleName] || 0) + 1;
        });
     });
     
     return Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4)
        .map(([name, value], i) => ({
           name: name.length > 15 ? name.substring(0, 15) + '...' : name,
           value,
           color: ['#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef'][i] || '#cbd5e1'
        }));
  }, [filteredData, rules]);

  // Handlers
  const handleFilterChange = (newFilters: any) => {
     setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleKpiFilter = (type: string, value: string) => {
      // Mapping KPI clicks to filters could go here
      console.log("Filter by KPI:", type, value);
  };

  const handleExport = () => {
    const headers = ['Tx Hash', 'Chain', 'Asset', 'Amount', 'USD Value', 'Date', 'Risk Level', 'Status'];
    const csvContent = [
      headers.join(','),
      ...filteredData.map(t => [
        t.hash,
        t.chain,
        t.asset,
        t.amount,
        t.usdValue,
        t.timestamp,
        t.riskLevel,
        t.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'transactions_export.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
         <h1 className="text-2xl font-bold text-white tracking-tight">Transaction Monitoring</h1>
         <div className="text-sm text-slate-400">
            Showing <span className="text-brand-cyan font-mono font-bold">{filteredData.length}</span> transactions
         </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <KpiCard 
           title="Risk Distribution" 
           data={riskDistribution} 
           onFilter={(val) => handleFilterChange({ risk: val.toUpperCase() })} 
         />
         <KpiCard 
           title="Transaction Status" 
           data={statusDistribution} 
         />
         <KpiCard 
           title="Top Rules Triggered" 
           data={ruleTriggerStats} 
         />
         <KpiCard 
            title="Asset Volume"
            data={[
               { name: 'USDT', value: 45, color: '#26a17b' },
               { name: 'ETH', value: 30, color: '#627eea' },
               { name: 'BTC', value: 15, color: '#f7931a' },
               { name: 'Others', value: 10, color: '#94a3b8' },
            ]}
         />
      </div>

      <FilterBar 
         onSearch={(term) => handleFilterChange({ search: term })}
         onFilterChange={handleFilterChange}
         onClear={() => setFilters({ chain: 'all', asset: 'all', risk: 'all', search: '' })}
         onExport={handleExport}
      />

      <TransactionTable 
         data={filteredData} 
         onRowClick={setSelectedTransaction}
      />

      <TransactionDrawer 
         isOpen={!!selectedTransaction}
         onClose={() => setSelectedTransaction(null)}
         transaction={selectedTransaction}
         rules={rules}
      />
    </div>
  )
}

