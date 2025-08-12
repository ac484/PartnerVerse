import type { Partner, Workflow } from './types';

export const partners: Partner[] = [
  {
    id: 'p1',
    name: 'Innovate Inc.',
    logoUrl: 'https://placehold.co/100x100.png',
    category: 'Subcontractor',
    status: 'Active',
    overview: 'A leading provider of cloud-based solutions, Innovate Inc. specializes in scalable infrastructure and AI-driven analytics. They are a key partner for our enterprise-level projects.',
    website: 'innovate.com',
    joinDate: '2022-01-15',
    contacts: [
      { id: 'c1', name: 'Alice Johnson', role: 'CEO', email: 'alice@innovate.com', phone: '123-456-7890' },
      { id: 'c2', name: 'Bob Williams', role: 'CTO', email: 'bob@innovate.com', phone: '123-456-7891' },
    ],
    transactions: [
      { id: 't1', date: '2023-10-05', amount: 50000, status: 'Completed', description: 'Q3 Services Rendered' },
      { id: 't2', date: '2023-11-12', amount: 25000, status: 'Pending', description: 'Project Alpha Kickoff' },
       { id: 't3', date: '2023-12-20', amount: 7500, status: 'Failed', description: 'Annual Subscription' },
    ],
    performanceReviews: [
        { id: 'pr1', date: '2023-09-15', rating: 5, notes: 'Excellent work on the foundation phase. Finished ahead of schedule.', reviewer: 'Admin' }
    ],
    complianceDocuments: [
        { id: 'cd1', name: 'Liability Insurance', status: 'Valid', expiryDate: '2025-01-01', fileUrl: '#' }
    ],
    contracts: [
        { id: 'co1', title: 'Main Project Contract', startDate: '2023-01-01', endDate: '2024-01-01', status: 'Active', fileUrl: '#' }
    ]
  },
  {
    id: 'p2',
    name: 'Synergy Solutions',
    logoUrl: 'https://placehold.co/100x100.png',
    category: 'Supplier',
    status: 'Active',
    overview: 'Global consulting firm focusing on digital transformation and business process optimization. Their expertise helps streamline our joint ventures.',
    website: 'synergysolutions.com',
    joinDate: '2021-03-22',
    contacts: [
      { id: 'c3', name: 'Charles Davis', role: 'Managing Partner', email: 'charles.d@synergy.com', phone: '234-567-8901' },
    ],
    transactions: [
      { id: 't4', date: '2023-11-20', amount: 120000, status: 'Completed', description: 'Strategy Workshop' },
    ],
    performanceReviews: [],
    complianceDocuments: [],
    contracts: []
  },
  {
    id: 'p3',
    name: 'Quantum Resellers',
    logoUrl: 'https://placehold.co/100x100.png',
    category: 'Equipment',
    status: 'Inactive',
    overview: 'A value-added reseller with a wide distribution network across North America. Currently inactive pending contract renewal.',
    website: 'quantumresellers.com',
    joinDate: '2020-08-10',
    contacts: [
      { id: 'c4', name: 'Diana Miller', role: 'Sales Director', email: 'diana.m@quantum.com', phone: '345-678-9012' },
    ],
    transactions: [
      { id: 't5', date: '2023-01-15', amount: 85000, status: 'Completed', description: 'Hardware Distribution' },
    ],
    performanceReviews: [],
    complianceDocuments: [],
    contracts: []
  },
  {
    id: 'p4',
    name: 'NextGen Services',
    logoUrl: 'https://placehold.co/100x100.png',
    category: 'Service',
    status: 'Pending',
    overview: 'A prospective partner specializing in managed IT services and customer support. Currently in the onboarding process.',
    website: 'nextgenservices.net',
    joinDate: '2024-02-01',
    contacts: [
      { id: 'c5', name: 'Ethan Harris', role: 'Operations Head', email: 'ethan.h@nextgen.net', phone: '456-789-0123' },
    ],
    transactions: [],
    performanceReviews: [],
    complianceDocuments: [],
    contracts: []
  },
];

export const sampleWorkflow: Workflow = {
    id: 'wf-1',
    name: 'Standard Partner Onboarding',
    nodes: [
        { id: 'n1', type: 'start', label: 'Start', position: { x: 50, y: 200 } },
        { id: 'n2', type: 'task', label: 'Initial Contact', position: { x: 250, y: 200 } },
        { id: 'n3', type: 'decision', label: 'KYC Check', position: { x: 450, y: 200 } },
        { id: 'n4', type: 'task', label: 'Send Welcome Kit', position: { x: 650, y: 100 } },
        { id: 'n5', type: 'task', label: 'Schedule Onboarding Call', position: { x: 650, y: 300 } },
        { id: 'n6', type: 'end', label: 'End', position: { x: 850, y: 200 } },
    ],
    edges: [
        { id: 'e1-2', source: 'n1', target: 'n2' },
        { id: 'e2-3', source: 'n2', target: 'n3' },
        { id: 'e3-4', source: 'n3', target: 'n4', label: 'Pass' },
        { id: 'e3-5', source: 'n3', target: 'n5', label: 'Fail' },
        { id: 'e4-6', source: 'n4', target: 'n6' },
        { id: 'e5-6', source: 'n5', target: 'n6' },
    ],
};
