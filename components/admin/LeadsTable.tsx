'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, MessageSquare } from 'lucide-react';

interface Lead {
  id: number;
  property?: {
    id: number;
    title: string;
    city: string;
  };
  name: string;
  phone?: string;
  email?: string;
  notes?: string;
  createdAt: string;
}

interface LeadsTableProps {
  leads: Lead[];
  onDelete: (id: string) => void;
}

export default function LeadsTable({ leads, onDelete }: LeadsTableProps) {
  if (!leads || leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 rounded-xl border border-white/10 bg-[#231e1b]/40 text-center">
        <MessageSquare className="w-12 h-12 text-white/20 mb-4" />
        <h3 className="text-lg font-semibold text-white mb-1">No leads yet</h3>
        <p className="text-white/50 text-sm">Leads submitted by visitors will appear here.</p>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString();
  };

  return (
    <div className="rounded-xl border border-white/10 bg-[#231e1b]/40 overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full table-auto text-sm">
          <thead className="bg-[#231e1b] text-white/70 border-b border-white/10">
            <tr>
              <th className="text-left py-4 px-6 font-medium whitespace-nowrap">Property</th>
              <th className="text-left py-4 px-6 font-medium whitespace-nowrap">Name</th>
              <th className="text-left py-4 px-6 font-medium whitespace-nowrap">Contact</th>
              <th className="text-left py-4 px-6 font-medium whitespace-nowrap">Email</th>
              <th className="text-left py-4 px-6 font-medium whitespace-nowrap">Notes</th>
              <th className="text-left py-4 px-6 font-medium whitespace-nowrap">Submitted</th>
              <th className="text-right py-4 px-6 font-medium whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {leads.map((lead) => (
              <tr key={lead.id} className="group transition-colors hover:bg-white/[0.03]">
                <td className="py-4 px-6">
                  <p className="font-medium text-white line-clamp-1 max-w-[200px]">
                    {lead.property ? lead.property.title : 'General Inquiry'}
                  </p>
                  <p className="text-xs text-white/50">{lead.property?.city || ''}</p>
                </td>
                <td className="py-4 px-6">
                  <p className="text-white/90">{lead.name}</p>
                </td>
                <td className="py-4 px-6">
                  <p className="text-white/90">{lead.phone || '—'}</p>
                </td>
                <td className="py-4 px-6">
                  <p className="text-white/90 break-all">{lead.email || '—'}</p>
                </td>
                <td className="py-4 px-6">
                  <p className="text-white/70 line-clamp-2 max-w-[200px]">{lead.notes || '—'}</p>
                </td>
                <td className="py-4 px-6">
                  <p className="text-white/70">{formatDate(lead.createdAt)}</p>
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-white/50 hover:text-red-400 hover:bg-red-400/10 rounded-full"
                      onClick={() => onDelete(lead.id.toString())}
                      title="Delete Lead"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
