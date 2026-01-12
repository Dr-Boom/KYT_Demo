"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { cn } from "@/lib/utils"

interface KpiCardProps {
  title: string
  data: { name: string; value: number; color: string }[]
  total?: number
  onFilter?: (name: string) => void
}

export function KpiCard({ title, data, total, onFilter }: KpiCardProps) {
  const totalValue = total || data.reduce((acc, curr) => acc + curr.value, 0)

  return (
    <Card className="border-slate-800 bg-slate-900/40 hover:bg-slate-900/60 transition-all cursor-pointer group backdrop-blur-md shadow-[0_4px_20px_-10px_rgba(0,0,0,0.5)]">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-slate-400 uppercase tracking-wider">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between p-4 pt-0">
        <div className="h-[120px] w-[120px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={35}
                outerRadius={50}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                    className="stroke-transparent outline-none transition-all duration-300 hover:opacity-80"
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', fontSize: '12px' }}
                itemStyle={{ color: '#fff' }}
                formatter={(value: number) => [`${value}`, 'Count']}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
             <span className="text-2xl font-bold text-white group-hover:scale-110 transition-transform duration-300">{totalValue}</span>
          </div>
        </div>
        
        <div className="flex flex-col gap-2 text-xs flex-1 ml-4">
          {data.map((item, i) => (
             <div 
               key={i} 
               className="flex items-center justify-between group/row hover:bg-white/5 p-1 rounded cursor-pointer"
               onClick={(e) => {
                 e.stopPropagation();
                 onFilter?.(item.name);
               }}
             >
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full shadow-[0_0_8px]" style={{ backgroundColor: item.color, boxShadow: `0 0 5px ${item.color}` }}></div>
                 <span className="text-slate-400 group-hover/row:text-white transition-colors">{item.name}</span>
               </div>
               <span className="font-mono font-medium text-slate-300">{Math.round((item.value / totalValue) * 100)}%</span>
             </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

