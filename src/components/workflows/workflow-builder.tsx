'use client';

import { useState, type FC, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { sampleWorkflow } from '@/lib/data';
import type { Workflow, WorkflowNode, WorkflowEdge } from '@/lib/types';
import { ArrowRight,GitBranch, CheckCircle, XCircle, PlayCircle, StopCircle, Bot, Workflow as WorkflowIcon, PlusCircle, Save, Trash2, Pencil } from 'lucide-react';
import { OptimizationAssistant } from './optimization-assistant';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { Skeleton } from '../ui/skeleton';
import { useToast } from '@/hooks/use-toast';

const nodeIcons = {
  start: <PlayCircle className="h-5 w-5 mr-2 text-green-500" />,
  end: <StopCircle className="h-5 w-5 mr-2 text-red-500" />,
  task: <CheckCircle className="h-5 w-5 mr-2 text-blue-500" />,
  decision: <GitBranch className="h-5 w-5 mr-2 text-yellow-500" />,
};

const Node: FC<{ node: WorkflowNode; onSelect: (node: WorkflowNode) => void; }> = ({ node, onSelect }) => (
  <div
    className="absolute bg-card border rounded-lg shadow-md p-3 flex items-center group cursor-pointer hover:shadow-xl hover:border-primary transition-all"
    style={{ left: node.position.x, top: node.position.y, width: 200 }}
    onClick={() => onSelect(node)}
  >
    {nodeIcons[node.type]}
    <span className="font-medium flex-1">{node.label}</span>
    <Pencil className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
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
    const [workflows, setWorkflows] = useState<Workflow[]>([]);
    const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [nodeToEdit, setNodeToEdit] = useState<WorkflowNode | null>(null);
    const [isNodeFormOpen, setIsNodeFormOpen] = useState(false);
    const { toast } = useToast();

    const fetchWorkflows = useCallback(async () => {
      setIsLoading(true);
      const workflowsCollection = collection(db, 'workflows');
      const workflowSnapshot = await getDocs(workflowsCollection);
      const workflowList = workflowSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Workflow[];
      setWorkflows(workflowList);
      if(workflowList.length > 0) {
        setSelectedWorkflow(workflowList[0]);
      }
      setIsLoading(false);
    }, []);

    useEffect(() => {
      fetchWorkflows();
    }, [fetchWorkflows]);
    
    const handleSelectWorkflow = (workflowId: string) => {
        const workflow = workflows.find(w => w.id === workflowId);
        setSelectedWorkflow(workflow || null);
    }

    const handleSaveWorkflow = async () => {
        if(!selectedWorkflow || !selectedWorkflow.id) return;
        try {
            const workflowRef = doc(db, 'workflows', selectedWorkflow.id);
            await setDoc(workflowRef, {name: selectedWorkflow.name, nodes: selectedWorkflow.nodes, edges: selectedWorkflow.edges}, { merge: true });
            toast({ title: "Workflow Saved", description: `Workflow "${selectedWorkflow.name}" has been updated.` });
        } catch (error) {
            console.error("Error saving workflow: ", error);
            toast({ title: "Error", description: "Failed to save workflow.", variant: "destructive" });
        }
    }

    const handleNewWorkflow = async () => {
        const newWorkflow: Omit<Workflow, 'id'> = {
            name: `New Workflow ${workflows.length + 1}`,
            nodes: [
                { id: 'n1', type: 'start', label: 'Start', position: { x: 50, y: 200 } },
                { id: 'n2', type: 'end', label: 'End', position: { x: 450, y: 200 } },
            ],
            edges: [
                 { id: 'e1-2', source: 'n1', target: 'n2' },
            ]
        };
        try {
            const docRef = await addDoc(collection(db, 'workflows'), newWorkflow);
            const newWorkflowWithId = { ...newWorkflow, id: docRef.id };
            setWorkflows([...workflows, newWorkflowWithId]);
            setSelectedWorkflow(newWorkflowWithId);
            toast({ title: "Workflow Created", description: `Successfully created "${newWorkflow.name}".`});
        } catch(error) {
            console.error("Error creating new workflow: ", error);
            toast({ title: "Error", description: "Failed to create workflow.", variant: "destructive" });
        }
    }
    
    const handleSelectNodeToEdit = (node: WorkflowNode) => {
        setNodeToEdit(node);
        setIsNodeFormOpen(true);
    }

    const handleUpdateNodeLabel = (newLabel: string) => {
        if (!selectedWorkflow || !nodeToEdit) return;

        const updatedNodes = selectedWorkflow.nodes.map(n => 
            n.id === nodeToEdit.id ? { ...n, label: newLabel } : n
        );
        setSelectedWorkflow({ ...selectedWorkflow, nodes: updatedNodes });
        setIsNodeFormOpen(false);
        setNodeToEdit(null);
    }

    const nodeTypes = [
        { type: 'task', label: 'Task', icon: <CheckCircle className="h-5 w-5 mr-2 text-blue-500" /> },
        { type: 'decision', label: 'Decision', icon: <GitBranch className="h-5 w-5 mr-2 text-yellow-500" /> },
    ];

    const handleAddNode = () => {
      if (!selectedWorkflow) return;
      const newNodeId = `n${selectedWorkflow.nodes.length + 1}`;
      const newNode: WorkflowNode = {
        id: newNodeId,
        type: 'task',
        label: 'New Task',
        position: { x: 100, y: 100 + selectedWorkflow.nodes.length * 20 }
      };
      const updatedNodes = [...selectedWorkflow.nodes, newNode];
      setSelectedWorkflow({...selectedWorkflow, nodes: updatedNodes});
    }

  return (
    <div className="space-y-6">
       <div>
            <h2 className="text-3xl font-bold tracking-tight">Workflow Management</h2>
            <p className="text-muted-foreground">Design, visualize, and optimize partner transaction processes.</p>
        </div>
      <Tabs defaultValue="builder">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="builder"><WorkflowIcon className="mr-2 h-4 w-4"/>Visual Workflow Builder</TabsTrigger>
          <TabsTrigger value="optimizer"><Bot className="mr-2 h-4 w-4" />AI Optimization Assistant</TabsTrigger>
        </TabsList>
        <TabsContent value="builder">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Workflows</CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-4'>
                            {isLoading ? <Skeleton className="h-10 w-full" /> : (
                                <Select onValueChange={handleSelectWorkflow} value={selectedWorkflow?.id}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a workflow" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {workflows.map(w => <SelectItem key={w.id} value={w.id!}>{w.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            )}
                            <Button className='w-full' onClick={handleNewWorkflow} disabled={isLoading}><PlusCircle className='mr-2 h-4 w-4' /> New Workflow</Button>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Controls</CardTitle>
                            <CardDescription>Add elements to your workflow.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {nodeTypes.map(node => (
                                <Button key={node.type} variant="outline" className="w-full justify-start" onClick={handleAddNode}>
                                    {node.icon} {node.label}
                                </Button>
                            ))}
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-3">
                    <Card>
                        <CardHeader>
                             {isLoading ? <Skeleton className="h-8 w-1/2" /> : (
                               <div className="flex justify-between items-center">
                                 <CardTitle>{selectedWorkflow?.name || "No Workflow Selected"}</CardTitle>
                                 <Button onClick={handleSaveWorkflow} disabled={!selectedWorkflow}>
                                     <Save className="mr-2 h-4 w-4" /> Save Changes
                                 </Button>
                               </div>
                            )}
                            <CardDescription>Visual representation of the workflow process.</CardDescription>
                        </CardHeader>
                        <CardContent>
                        <div className="relative w-full h-[600px] bg-muted/30 rounded-lg border-2 border-dashed overflow-auto">
                            {isLoading ? <div className='flex items-center justify-center h-full'><p>Loading workflows...</p></div> : (
                               <>
                                {selectedWorkflow ? (
                                    <>
                                    <svg width="1200" height="800" className="absolute top-0 left-0">
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
                                        {selectedWorkflow.edges.map(edge => <Edge key={edge.id} edge={edge} nodes={selectedWorkflow.nodes} />)}
                                    </svg>
                                    {selectedWorkflow.nodes.map(node => <Node key={node.id} node={node} onSelect={handleSelectNodeToEdit}/>)}
                                    </>
                                ) : (
                                    <div className='flex items-center justify-center h-full'>
                                        <div className='text-center text-muted-foreground'>
                                            <WorkflowIcon className="mx-auto h-12 w-12" />
                                            <p className='mt-4'>No workflow selected.</p>
                                            <p className='text-sm'>Create a new workflow or select one to begin.</p>
                                        </div>
                                    </div>
                                )}
                               </>
                            )}
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
      
      <Dialog open={isNodeFormOpen} onOpenChange={setIsNodeFormOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Edit Node</DialogTitle>
                <DialogDescription>Update the details for this workflow node.</DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const label = formData.get('label') as string;
                handleUpdateNodeLabel(label);
            }}>
                <div className='space-y-4 py-4'>
                    <div className='space-y-2'>
                        <Label htmlFor="node-label">Label</Label>
                        <Input id="node-label" name="label" defaultValue={nodeToEdit?.label} />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsNodeFormOpen(false)}>Cancel</Button>
                    <Button type="submit">Save Changes</Button>
                </DialogFooter>
            </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
