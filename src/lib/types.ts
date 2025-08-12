export interface Contact {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Failed';
  description: string;
}

export interface Partner {
  id: string;
  name: string;
  logoUrl: string;
  category: 'Technology' | 'Reseller' | 'Service' | 'Consulting';
  status: 'Active' | 'Inactive' | 'Pending';
  overview: string;
  website: string;
  contacts: Contact[];
  transactions: Transaction[];
  joinDate: string;
}

export type WorkflowNode = {
  id: string;
  type: 'start' | 'end' | 'task' | 'decision';
  label: string;
  position: { x: number; y: number };
};

export type WorkflowEdge = {
  id: string;
  source: string;
  target: string;
  label?: string;
};

export type Workflow = {
  id: string;
  name: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
};
