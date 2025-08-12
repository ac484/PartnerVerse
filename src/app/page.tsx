'use client';

import { useState, type FC } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/layout/header';
import { PartnerList } from '@/components/partners/partner-list';
import { PartnerProfile } from '@/components/partners/partner-profile';
import { WorkflowBuilder } from '@/components/workflows/workflow-builder';
import { PartnerForm } from '@/components/partners/partner-form';
import type { Partner } from '@/lib/types';
import { partners as initialPartners } from '@/lib/data';
import { useToast } from "@/hooks/use-toast";

export type View = 'partners' | 'workflows';
export type Role = 'Admin' | 'Manager' | 'Viewer';

const HomePage: FC = () => {
  const [view, setView] = useState<View>('partners');
  const [partners, setPartners] = useState<Partner[]>(initialPartners);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [partnerToEdit, setPartnerToEdit] = useState<Partner | null>(null);
  const [userRole, setUserRole] = useState<Role>('Admin');
  const { toast } = useToast();

  const handleSelectPartner = (partner: Partner) => {
    setSelectedPartner(partner);
  };
  
  const handleBackToList = () => {
    setSelectedPartner(null);
  };

  const handleAddPartner = () => {
    setPartnerToEdit(null);
    setIsFormOpen(true);
  };
  
  const handleEditPartner = (partner: Partner) => {
    setPartnerToEdit(partner);
    setIsFormOpen(true);
  }

  const handleSavePartner = (partnerToSave: Partner) => {
    if (partnerToEdit) {
      setPartners(partners.map(p => p.id === partnerToSave.id ? partnerToSave : p));
      if(selectedPartner?.id === partnerToSave.id) {
          setSelectedPartner(partnerToSave);
      }
      toast({ title: "Partner Updated", description: `${partnerToSave.name} has been successfully updated.` });
    } else {
      const newPartner: Partner = { ...partnerToSave, id: `p${Date.now()}` };
      setPartners([newPartner, ...partners]);
      toast({ title: "Partner Added", description: `${newPartner.name} has been successfully added.` });
    }
    setIsFormOpen(false);
    setPartnerToEdit(null);
  };

  const renderView = () => {
    if (selectedPartner) {
        return <PartnerProfile partner={selectedPartner} onBack={handleBackToList} userRole={userRole} onEdit={handleEditPartner} />;
    }
    
    switch (view) {
      case 'workflows':
        return <WorkflowBuilder />;
      case 'partners':
      default:
        return <PartnerList partners={partners} onSelectPartner={handleSelectPartner} userRole={userRole} onAddPartner={handleAddPartner} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header 
        currentView={view} 
        onNavigate={setView} 
        userRole={userRole}
        onRoleChange={setUserRole}
        onAddPartner={handleAddPartner}
        isPartnerSelected={!!selectedPartner}
        onBack={handleBackToList}
      />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        {renderView()}
      </main>
      <PartnerForm 
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSave={handleSavePartner}
        partner={partnerToEdit}
      />
      <Toaster />
    </div>
  );
}

export default HomePage;
