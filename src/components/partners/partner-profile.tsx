'use client';

import type { FC } from 'react';
import Image from 'next/image';
import type { Partner } from '@/lib/types';
import type { Role } from '@/app/page';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Globe, Edit, Users, DollarSign, Calendar } from 'lucide-react';

interface PartnerProfileProps {
  partner: Partner;
  onBack: () => void;
  userRole: Role;
  onEdit: (partner: Partner) => void;
}

export const PartnerProfile: FC<PartnerProfileProps> = ({ partner, userRole, onEdit }) => {
    const statusBadgeVariant = (status: Partner['status']) => {
        switch (status) {
        case 'Active': return 'default';
        case 'Inactive': return 'secondary';
        case 'Pending': return 'outline';
        default: return 'default';
        }
    };
    
    const transactionStatusColor = (status: 'Completed' | 'Pending' | 'Failed') => {
        switch (status) {
            case 'Completed': return 'text-green-600';
            case 'Pending': return 'text-yellow-600';
            case 'Failed': return 'text-red-600';
        }
    }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col md:flex-row gap-6 items-start">
            <Image src={partner.logoUrl} alt={`${partner.name} logo`} width={80} height={80} className="rounded-lg border" data-ai-hint="logo company" />
            <div className='flex-1'>
                <div className='flex justify-between items-start'>
                    <CardTitle className="text-3xl font-bold">{partner.name}</CardTitle>
                    {userRole !== 'Viewer' && <Button variant="outline" onClick={() => onEdit(partner)}><Edit className="mr-2 h-4 w-4" /> Edit Partner</Button>}
                </div>
                <div className="flex items-center gap-4 mt-2 text-muted-foreground text-sm">
                    <Badge variant={statusBadgeVariant(partner.status)} className="text-sm">{partner.status}</Badge>
                    <span>|</span>
                    <span>{partner.category}</span>
                    <span>|</span>
                    <a href={`https://${partner.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary">
                        <Globe className="h-4 w-4" /> {partner.website}
                    </a>
                    <span>|</span>
                     <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" /> Joined on {new Date(partner.joinDate).toLocaleDateString()}
                    </span>
                </div>
            </div>
        </CardHeader>
      </Card>
      
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="contacts"><Users className="mr-2 h-4 w-4" />Contacts</TabsTrigger>
          <TabsTrigger value="transactions"><DollarSign className="mr-2 h-4 w-4" />Transactions</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Card>
            <CardContent className="p-6">
                <p className='text-foreground'>{partner.overview}</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="contacts">
          <Card>
            <CardHeader>
              <CardTitle>Associated Contacts</CardTitle>
              <CardDescription>Key points of contact for {partner.name}.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {partner.contacts.map(contact => (
                            <TableRow key={contact.id}>
                                <TableCell className="font-medium">{contact.name}</TableCell>
                                <TableCell>{contact.role}</TableCell>
                                <TableCell><a href={`mailto:${contact.email}`} className="text-primary hover:underline">{contact.email}</a></TableCell>
                                <TableCell>{contact.phone}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="transactions">
           <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Financial records associated with {partner.name}.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {partner.transactions.map(tx => (
                            <TableRow key={tx.id}>
                                <TableCell>{new Date(tx.date).toLocaleDateString()}</TableCell>
                                <TableCell className="font-medium">{tx.description}</TableCell>
                                <TableCell className={transactionStatusColor(tx.status)}>{tx.status}</TableCell>
                                <TableCell className="text-right">${tx.amount.toLocaleString()}</TableCell>
                            </TableRow>
                        ))}
                         {partner.transactions.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center h-24">No transactions found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
