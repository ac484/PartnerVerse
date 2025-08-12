'use client';

import type { FC } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Logo } from '@/components/icons/logo';
import { ArrowLeft, ChevronsUpDown, Plus, User, Workflow } from 'lucide-react';
import type { View, Role } from '@/app/page';

interface HeaderProps {
  currentView: View;
  onNavigate: (view: View) => void;
  userRole: Role;
  onRoleChange: (role: Role) => void;
  onAddPartner: () => void;
  isPartnerSelected: boolean;
  onBack: () => void;
}

export const Header: FC<HeaderProps> = ({ currentView, onNavigate, userRole, onRoleChange, onAddPartner, isPartnerSelected, onBack }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-card shadow-sm">
      <div className="container flex h-16 items-center px-4 sm:px-6 md:px-8">
        <div className="flex items-center gap-2">
          {isPartnerSelected ? (
            <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          ) : (
            <Logo className="h-6 w-6 text-primary" />
          )}
          <h1 className="text-xl font-bold tracking-tight text-foreground">PartnerVerse</h1>
        </div>
        
        {!isPartnerSelected && (
           <nav className="ml-10 hidden items-center space-x-1 md:flex">
             <Button variant={currentView === 'partners' ? 'secondary' : 'ghost'} onClick={() => onNavigate('partners')} className="px-4">
               <User className="mr-2 h-4 w-4"/>
               Partners
             </Button>
             <Button variant={currentView === 'workflows' ? 'secondary' : 'ghost'} onClick={() => onNavigate('workflows')} className="px-4">
               <Workflow className="mr-2 h-4 w-4"/>
               Workflows
             </Button>
           </nav>
        )}

        <div className="ml-auto flex items-center space-x-4">
          {userRole === 'Admin' && !isPartnerSelected && (
            <Button onClick={onAddPartner} className="hidden sm:flex bg-accent hover:bg-accent/90">
              <Plus className="mr-2 h-4 w-4" />
              New Partner
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src="https://placehold.co/40x40.png" alt="User" data-ai-hint="avatar user" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <span className='hidden md:inline'>{userRole}</span>
                <ChevronsUpDown className="h-4 w-4 opacity-50"/>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Switch Role</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={userRole} onValueChange={(value) => onRoleChange(value as Role)}>
                <DropdownMenuRadioItem value="Admin">Admin</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Manager">Manager</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Viewer">Viewer</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
