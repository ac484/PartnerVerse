'use client';

import { useState, useMemo, type FC } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Partner } from '@/lib/types';
import type { Role } from '@/app/page';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';

interface PartnerListProps {
  partners: Partner[];
  onSelectPartner: (partner: Partner) => void;
  userRole: Role;
  onAddPartner: () => void;
}

export const PartnerList: FC<PartnerListProps> = ({ partners, onSelectPartner, userRole, onAddPartner }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const filteredPartners = useMemo(() => {
    return partners.filter(partner => {
      const searchMatch = partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          partner.overview.toLowerCase().includes(searchTerm.toLowerCase());
      const statusMatch = statusFilter === 'All' || partner.status === statusFilter;
      const categoryMatch = categoryFilter === 'All' || partner.category === categoryFilter;
      return searchMatch && statusMatch && categoryMatch;
    });
  }, [partners, searchTerm, statusFilter, categoryFilter]);
  
  const statusBadgeVariant = (status: Partner['status']) => {
    switch (status) {
      case 'Active': return 'default';
      case 'Inactive': return 'secondary';
      case 'Pending': return 'outline';
      default: return 'default';
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">Partners</h2>
            <p className="text-muted-foreground">View and manage your business relationships.</p>
        </div>
        {userRole === 'Admin' && (
            <Button onClick={onAddPartner} className="sm:hidden w-full bg-accent hover:bg-accent/90">
              <Plus className="mr-2 h-4 w-4" />
              New Partner
            </Button>
          )}
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Search partners..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="md:col-span-1"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger><SelectValue placeholder="Filter by status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger><SelectValue placeholder="Filter by category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                <SelectItem value="Technology">Technology</SelectItem>
                <SelectItem value="Reseller">Reseller</SelectItem>
                <SelectItem value="Service">Service</SelectItem>
                <SelectItem value="Consulting">Consulting</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPartners.map(partner => (
          <Card 
            key={partner.id} 
            onClick={() => onSelectPartner(partner)} 
            className="cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all duration-200"
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                  <div className='flex items-center gap-4'>
                    <Image src={partner.logoUrl} alt={`${partner.name} logo`} width={48} height={48} className="rounded-md" data-ai-hint="logo company" />
                    <div>
                        <CardTitle className="text-xl">{partner.name}</CardTitle>
                        <CardDescription>{partner.category}</CardDescription>
                    </div>
                  </div>
                <Badge variant={statusBadgeVariant(partner.status)}>{partner.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-3">{partner.overview}</p>
            </CardContent>
          </Card>
        ))}
      </div>
       {filteredPartners.length === 0 && (
          <div className="text-center col-span-full py-16">
            <p className="text-muted-foreground">No partners found. Try adjusting your filters.</p>
          </div>
        )}
    </div>
  );
};
