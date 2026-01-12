"use client"

import { useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from '@/components/ui/button';
import { Filter, Maximize, Target, Camera } from 'lucide-react';

// Custom Node Styling (placeholder for simplicity, can be expanded)
const initialNodes = [
  { id: 'origin', position: { x: 50, y: 250 }, data: { label: 'Origin' }, style: { background: '#000', color: '#fff', border: '1px solid #333', borderRadius: '50%', width: 60, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' } },
  { id: 'tx1', position: { x: 250, y: 250 }, data: { label: 'Tx 1' }, style: { background: '#9333ea', color: '#fff', border: 'none', borderRadius: '4px', width: 40, height: 20 } },
  { id: 'hop1_1', position: { x: 450, y: 150 }, data: { label: 'Exchange A' }, style: { background: '#1e293b', color: '#94a3b8', border: '1px solid #334155' } },
  { id: 'hop1_2', position: { x: 450, y: 350 }, data: { label: 'Wallet B' }, style: { background: '#1e293b', color: '#94a3b8', border: '1px solid #334155' } },
  { id: 'hop2_1', position: { x: 650, y: 100 }, data: { label: 'High Risk' }, style: { background: '#ef4444', color: '#fff', border: 'none' } },
  { id: 'hop2_2', position: { x: 650, y: 200 }, data: { label: 'DeFi Pool' }, style: { background: '#3b82f6', color: '#fff', border: 'none' } },
  { id: 'hop2_3', position: { x: 650, y: 400 }, data: { label: 'Mixer' }, style: { background: '#a855f7', color: '#fff', border: 'none' } },
];

const initialEdges = [
  { id: 'e1', source: 'origin', target: 'tx1', animated: true, style: { stroke: '#9333ea' } },
  { id: 'e2', source: 'tx1', target: 'hop1_1', label: '50%', style: { stroke: '#475569' } },
  { id: 'e3', source: 'tx1', target: 'hop1_2', label: '50%', style: { stroke: '#475569' } },
  { id: 'e4', source: 'hop1_1', target: 'hop2_1', style: { stroke: '#ef4444' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#ef4444' } },
  { id: 'e5', source: 'hop1_1', target: 'hop2_2', style: { stroke: '#3b82f6' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' } },
  { id: 'e6', source: 'hop1_2', target: 'hop2_3', style: { stroke: '#a855f7' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#a855f7' } },
];

export function InvestigationGraph() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="h-[500px] w-full bg-slate-950 rounded-lg border border-slate-800 relative overflow-hidden group">
      
      {/* Graph Toolbar Overlay */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-lg border border-slate-800 backdrop-blur-sm">
         <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white" title="Fit to Screen">
            <Maximize className="w-4 h-4" />
         </Button>
         <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white" title="Select Mode">
            <Target className="w-4 h-4" />
         </Button>
         <div className="w-px h-4 bg-slate-700 mx-1"></div>
         <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white" title="Export Image">
            <Camera className="w-4 h-4" />
         </Button>
         <Button variant="brand" size="sm" className="h-8 text-xs gap-2 ml-2">
            <Filter className="w-3 h-3" />
            Filter
         </Button>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        className="bg-slate-950"
        minZoom={0.5}
        maxZoom={2}
      >
        <Background color="#334155" gap={20} size={1} />
        <Controls className="bg-slate-900 border-slate-800 fill-slate-400 text-slate-400" />
      </ReactFlow>

      <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
         <span className="text-[10px] text-slate-600 bg-slate-950/50 px-3 py-1 rounded-full border border-slate-900 backdrop-blur-sm">
            Note - Use touchpad if your mouse click is not working
         </span>
      </div>
    </div>
  );
}

