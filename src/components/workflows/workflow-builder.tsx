'use client';

import { useState, type FC } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { sampleWorkflow } from '@/lib/data';
import type { WorkflowNode, WorkflowEdge } from '@/lib/types';
import { ArrowRight,GitBranch, CheckCircle, XCircle, PlayCircle, StopCircle, Bot, Workflow } from 'lucide-react';
import { OptimizationAssistant } from './optimization-assistant';

const nodeIcons = {
  start: <PlayCircle className="h-5 w-5 mr-2 text-green-500" />,
  end: <StopCircle className="h-5 w-5 mr-2 text-red-500" />,
  task: <CheckCircle className="h-5 w-5 mr-2 text-blue-500" />,
  decision: <GitBranch className="h-5 w-5 mr-2 text-yellow-500" />,
};

const Node: FC<{ node: WorkflowNode }> = ({ node }) => (
  <div
    className="absolute bg-card border rounded-lg shadow-md p-3 flex items-center cursor-pointer hover:shadow-xl hover:border-primary transition-all"
    style={{ left: node.position.x, top: node.position.y, width: 200 }}
  >
    {nodeIcons[node.type]}
    <span className="font-medium">{node.label}</span>
  </div>
);

const Edge: FC<{ edge: WorkflowEdge; nodes: WorkflowNode[] }> = ({ edge, nodes }) => {
  const sourceNode = nodes.find(n => n.id === edge.source);
  const targetNode = nodes.find(n => n.id === edge.target);

  if (!sourceNode || !targetNode) return null;

  const startX = sourceNode.position.x + 200;
  const startY = sourceNode.position.y + 28;
  const endX = targetNode.position.x;
  const endY = targetNode.position.y + 28;
  const midX = startX + (endX - startX) / 2;
  const midY = startY + (endY - startY) / 2;

  return (
    <g>
      <path
        d={`M ${startX} ${startY} L ${endX} ${endY}`}
        stroke="hsl(var(--border))"
        strokeWidth="2"
        fill="none"
        markerEnd="url(#arrowhead)"
      />
      {edge.label && (
        <foreignObject x={midX-30} y={midY-20} width="60" height="40">
            <div className="bg-background px-2 py-1 text-xs rounded-md border text-center text-muted-foreground">
                {edge.label}
            </div>
        </foreignObject>
      )}
    </g>
  );
};


export const WorkflowBuilder: FC = () => {
    const [workflow] = useState(sampleWorkflow);
    
    const nodeTypes = [
        { type: 'task', label: 'Task', icon: <CheckCircle className="h-5 w-5 mr-2 text-blue-500" /> },
        { type: 'decision', label: 'Decision', icon: <GitBranch className="h-5 w-5 mr-2 text-yellow-500" /> },
        { type: 'start', label: 'Start Point', icon: <PlayCircle className="h-5 w-5 mr-2 text-green-500" /> },
        { type: 'end', label: 'End Point', icon: <StopCircle className="h-5 w-5 mr-2 text-red-500" /> },
    ];

  return (
    <div className="space-y-6">
       <div>
            <h2 className="text-3xl font-bold tracking-tight">Workflow Management</h2>
            <p className="text-muted-foreground">Design, visualize, and optimize partner transaction processes.</p>
        </div>
      <Tabs defaultValue="builder">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="builder"><Workflow className="mr-2 h-4 w-4"/>Visual Workflow Builder</TabsTrigger>
          <TabsTrigger value="optimizer"><Bot className="mr-2 h-4 w-4" />AI Optimization Assistant</TabsTrigger>
        </TabsList>
        <TabsContent value="builder">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Workflow Nodes</CardTitle>
                            <CardDescription>Drag nodes onto the canvas to build your workflow.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {nodeTypes.map(node => (
                                <div key={node.type} className="border rounded-lg p-3 flex items-center cursor-grab bg-card hover:shadow-md transition-shadow">
                                    {node.icon} {node.label}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>{workflow.name}</CardTitle>
                            <CardDescription>Visual representation of the workflow process.</CardDescription>
                        </CardHeader>
                        <CardContent>
                        <div className="relative w-full h-[500px] bg-muted/30 rounded-lg border-2 border-dashed overflow-auto">
                            <svg width="1000" height="600" className="absolute top-0 left-0">
                                <defs>
                                <marker
                                    id="arrowhead"
                                    markerWidth="10"
                                    markerHeight="7"
                                    refX="0"
                                    refY="3.5"
                                    orient="auto"
                                >
                                    <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--border))" />
                                </marker>
                                </defs>
                                {workflow.edges.map(edge => <Edge key={edge.id} edge={edge} nodes={workflow.nodes} />)}
                            </svg>
                            {workflow.nodes.map(node => <Node key={node.id} node={node} />)}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </TabsContent>
        <TabsContent value="optimizer">
          <OptimizationAssistant />
        </TabsContent>
      </Tabs>
    </div>
  );
};
