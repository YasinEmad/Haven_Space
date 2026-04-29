'use client';

import { useEffect, useState } from 'react';
import ConfirmDialog from '@/components/ui/confirm-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import PropertyTable from './PropertyTable';
import PropertyForm from './PropertyForm';
import { Plus } from 'lucide-react';

interface PropertyManagementProps {
  isAddingNew?: boolean;
  onPropertyChange?: () => void;
}

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

export default function PropertyManagement({
  isAddingNew = false,
  onPropertyChange,
}: PropertyManagementProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(isAddingNew);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [propertyToDelete, setPropertyToDelete] = useState<{ id: string; title: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  // use "all" as the default so we never pass an empty string to SelectItem
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/properties');
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      if (Array.isArray(data)) {
        setProperties(data);
      } else {
        console.error('API returned non-array data:', data);
        setProperties([]);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (id: number) => {
    setEditingId(id.toString());
    setShowForm(true);
  };

  const handlePropertySubmitted = () => {
    setShowForm(false);
    setEditingId(null);
    fetchProperties();
    onPropertyChange?.();
  };

  const handleDelete = (id: number) => {
    const property = properties.find((p) => p.id === id);
    setPropertyToDelete({
      id: id.toString(),
      title: property?.title || 'this property',
    });
  };

  const handleConfirmDelete = async () => {
    if (!propertyToDelete) return;

    try {
      const res = await fetch(`/api/properties/${propertyToDelete.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchProperties();
        onPropertyChange?.();
      } else {
        alert('Failed to delete property');
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('Error deleting property');
    } finally {
      setPropertyToDelete(null);
    }
  };

  if (showForm) {
    return (
      <PropertyForm
        propertyId={editingId || undefined}
        onSuccess={handlePropertySubmitted}
        onCancel={() => {
          setShowForm(false);
          setEditingId(null);
        }}
      />
    );
  }

  const filteredProperties = Array.isArray(properties) ? properties.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.address.toLowerCase().includes(searchTerm.toLowerCase());

    // treat "all" as no filtering
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;

    return matchesSearch && matchesStatus;
  }) : [];

  return (
    <Card className="bg-[#231e1b]/50 border-[#231e1b]">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white">Properties</CardTitle>
        <Button onClick={handleAddNew} className="bg-[#231e1b] hover:bg-[#2e261f]">
          <Plus className="w-4 h-4 mr-2" />
          Add Property
        </Button>
      </CardHeader>

      <CardContent>
        {/* Filters */}
        <Card className="mb-6 bg-[#231e1b]/70 border-[#231e1b]">
          <CardHeader>
            <CardTitle className="text-white">Filters</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="Search by title, city, or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[#231e1b]/80 text-white border-white/20 placeholder:text-white/50"
              />

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="bg-[#231e1b]/80 text-white border-white/20">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Properties Table */}
        {loading ? (
          <div className="text-center py-8 text-white/70">Loading properties...</div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-8 text-white/70">
            {properties.length === 0 ? 'No properties yet. Create your first listing!' : 'No properties match your filters.'}
          </div>
        ) : (
          <>
            <PropertyTable
              properties={filteredProperties}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
            <ConfirmDialog
              open={Boolean(propertyToDelete)}
              onOpenChange={(open) => {
                if (!open) setPropertyToDelete(null);
              }}
              title="Delete property?"
              description={`This action cannot be undone. Delete “${propertyToDelete?.title}”?`}
              confirmLabel="Delete"
              cancelLabel="Cancel"
              onConfirm={handleConfirmDelete}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}
