'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Home } from 'lucide-react';

interface Property {
  id: number;
  title: string;
  price: number;
  address: string;
  city: string;
  bedrooms: number;
  bathrooms: number;
  propertyType: string;
  status: string;
}

interface PropertyTableProps {
  properties: Property[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function PropertyTable({ properties, onEdit, onDelete }: PropertyTableProps) {
  
  // High-contrast, semantic colors for dark mode
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20';
      case 'sold':
        return 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20';
      case 'pending':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20';
      default:
        return 'bg-white/10 text-white/70 border-white/20 hover:bg-white/20';
    }
  };

  // Smarter currency formatting (e.g., $1.5M, $500K)
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 2,
    }).format(price);
  };

  if (!properties || properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 rounded-xl border border-white/10 bg-[#231e1b]/40 text-center">
        <Home className="w-12 h-12 text-white/20 mb-4" />
        <h3 className="text-lg font-semibold text-white mb-1">No properties found</h3>
        <p className="text-white/50 text-sm">Add a new property to get started.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/10 bg-[#231e1b]/40 overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full table-auto text-sm">
          <thead className="bg-[#231e1b] text-white/70 border-b border-white/10">
            <tr>
              <th className="text-left py-4 px-6 font-medium whitespace-nowrap">Title</th>
              <th className="text-left py-4 px-6 font-medium whitespace-nowrap">Location</th>
              <th className="text-left py-4 px-6 font-medium whitespace-nowrap">Price</th>
              <th className="text-left py-4 px-6 font-medium whitespace-nowrap">Beds / Baths</th>
              <th className="text-left py-4 px-6 font-medium whitespace-nowrap">Type</th>
              <th className="text-left py-4 px-6 font-medium whitespace-nowrap">Status</th>
              <th className="text-right py-4 px-6 font-medium whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {properties.map((property) => (
              <tr
                key={property.id}
                className="group transition-colors hover:bg-white/[0.03]"
              >
                <td className="py-4 px-6">
                  <p className="font-medium text-white line-clamp-1 max-w-[250px]">
                    {property.title}
                  </p>
                </td>
                <td className="py-4 px-6">
                  <p className="text-white/70">{property.city}</p>
                </td>
                <td className="py-4 px-6">
                  <p className="font-semibold text-white/90">
                    {formatPrice(property.price)}
                  </p>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-1 text-white/70">
                    <span className="font-medium text-white">{property.bedrooms}</span> bd
                    <span className="text-white/30 mx-1">•</span>
                    <span className="font-medium text-white">{property.bathrooms}</span> ba
                  </div>
                </td>
                <td className="py-4 px-6">
                  <p className="text-white/70 capitalize">{property.propertyType}</p>
                </td>
                <td className="py-4 px-6">
                  <Badge 
                    variant="outline" 
                    className={`capitalize font-medium border ${getStatusColor(property.status)}`}
                  >
                    {property.status}
                  </Badge>
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-white/50 hover:text-white hover:bg-white/10 rounded-full"
                      onClick={() => onEdit(property.id)}
                      title="Edit Property"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-white/50 hover:text-red-400 hover:bg-red-400/10 rounded-full"
                      onClick={() => onDelete(property.id)}
                      title="Delete Property"
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