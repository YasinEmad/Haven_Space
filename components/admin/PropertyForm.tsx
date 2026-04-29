'use client';

import { useEffect, useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertCircle, X, Plus, Trash2, Image as ImageIcon } from 'lucide-react';

interface PropertyFormProps {
  propertyId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

interface PropertyData {
  title: string;
  description: string;
  price: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  propertyType: string;
  status: string;
  imageUrls: string[];
}

const emptyProperty: PropertyData = {
  title: '',
  description: '',
  price: 0,
  address: '',
  city: '',
  state: '',
  zipCode: '',
  bedrooms: 0,
  bathrooms: 0,
  squareFeet: 0,
  propertyType: 'house',
  status: 'available',
  imageUrls: [],
};

export default function PropertyForm({
  propertyId,
  onSuccess,
  onCancel,
}: PropertyFormProps) {
  const [property, setProperty] = useState<PropertyData>(emptyProperty);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (propertyId) {
      fetchProperty();
    }
  }, [propertyId]);

  const fetchProperty = async () => {
    try {
      const res = await fetch(`/api/properties/${propertyId}`);
      if (res.ok) {
        const data = await res.json();
        setProperty(data);
      }
    } catch (err) {
      setError('Failed to load property');
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    // Only convert specific numeric fields to numbers
    const numericFields = ['price', 'bedrooms', 'bathrooms', 'squareFeet'];
    
    setProperty((prev) => ({
      ...prev,
      [name]: numericFields.includes(name) && !isNaN(Number(value)) && value !== '' 
        ? Number(value) 
        : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setProperty((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddImage = () => {
    if (imageUrl.trim()) {
      setProperty((prev) => ({
        ...prev,
        imageUrls: [...prev.imageUrls, imageUrl],
      }));
      setImageUrl('');
    }
  };

  const handleUploadImages = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setError('');
    setUploading(true);

    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => formData.append('images', file));

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      setProperty((prev) => ({
        ...prev,
        imageUrls: [...prev.imageUrls, ...(data.urls || [])],
      }));
    } catch (err: any) {
      setError(err.message || 'Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setProperty((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const method = propertyId ? 'PUT' : 'POST';
      const url = propertyId ? `/api/properties/${propertyId}` : '/api/properties';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(property),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save property');
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Helper component for labels
  const Label = ({ children, required }: { children: React.ReactNode, required?: boolean }) => (
    <label className="block text-sm font-medium text-white/90 mb-1.5">
      {children} {required && <span className="text-red-400">*</span>}
    </label>
  );

  return (
    <Card className="bg-[#231e1b] border-white/10 shadow-xl max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between border-b border-white/10 pb-4">
        <CardTitle className="text-xl text-white">
          {propertyId ? 'Edit Property' : 'Add New Property'}
        </CardTitle>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onCancel} 
          className="text-white/70 hover:text-white hover:bg-white/10 rounded-full"
        >
          <X className="w-5 h-5" />
        </Button>
      </CardHeader>

      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex gap-3 items-start">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-200">{error}</p>
            </div>
          )}

          {/* Section 1: Basic Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white/80 border-b border-white/10 pb-2">Basic Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-1">
                <Label required>Title</Label>
                <Input
                  name="title"
                  value={property.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Modern Downtown Loft"
                  className="bg-black/20 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-white/30"
                  required
                />
              </div>

              <div className="md:col-span-1">
                <Label required>Price ($)</Label>
                <Input
                  name="price"
                  type="number"
                  value={property.price || ''}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="bg-black/20 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-white/30"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <Label required>Description</Label>
                <textarea
                  name="description"
                  value={property.description}
                  onChange={handleInputChange}
                  placeholder="Describe the property's best features..."
                  className="w-full px-3 py-2 border border-white/10 bg-black/20 text-white placeholder:text-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-white/30 min-h-[120px] resize-y"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 2: Location */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white/80 border-b border-white/10 pb-2">Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="md:col-span-3">
                <Label required>Address</Label>
                <Input
                  name="address"
                  value={property.address}
                  onChange={handleInputChange}
                  placeholder="Street address"
                  className="bg-black/20 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-white/30"
                  required
                />
              </div>

              <div>
                <Label required>City</Label>
                <Input
                  name="city"
                  value={property.city}
                  onChange={handleInputChange}
                  placeholder="City"
                  className="bg-black/20 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-white/30"
                  required
                />
              </div>

              <div>
                <Label required>State</Label>
                <Input
                  name="state"
                  value={property.state}
                  onChange={handleInputChange}
                  placeholder="State"
                  className="bg-black/20 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-white/30"
                  required
                />
              </div>

              <div>
                <Label required>Zip Code</Label>
                <Input
                  name="zipCode"
                  value={property.zipCode}
                  onChange={handleInputChange}
                  placeholder="Zip code"
                  className="bg-black/20 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-white/30"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 3: Property Specs */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white/80 border-b border-white/10 pb-2">Property Specs</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
              <div>
                <Label required>Bedrooms</Label>
                <Input
                  name="bedrooms"
                  type="number"
                  value={property.bedrooms || ''}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="bg-black/20 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-white/30"
                  required
                />
              </div>

              <div>
                <Label required>Bathrooms</Label>
                <Input
                  name="bathrooms"
                  type="number"
                  value={property.bathrooms || ''}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="bg-black/20 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-white/30"
                  required
                />
              </div>

              <div>
                <Label required>Sq Ft</Label>
                <Input
                  name="squareFeet"
                  type="number"
                  value={property.squareFeet || ''}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="bg-black/20 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-white/30"
                  required
                />
              </div>

              <div>
                <Label required>Type</Label>
                <Select
                  value={property.propertyType}
                  onValueChange={(value) => handleSelectChange('propertyType', value)}
                >
                  <SelectTrigger className="bg-black/20 text-white border-white/10 focus:ring-white/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#2a2421] border-white/10 text-white">
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="condo">Condo</SelectItem>
                    <SelectItem value="townhouse">Townhouse</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="penthouse">Penthouse</SelectItem>
                    <SelectItem value="studio">Studio</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="land">Land</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Status</Label>
                <Select
                  value={property.status}
                  onValueChange={(value) => handleSelectChange('status', value)}
                >
                  <SelectTrigger className="bg-black/20 text-white border-white/10 focus:ring-white/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#2a2421] border-white/10 text-white">
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="sold">Sold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Section 4: Media */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white/80 border-b border-white/10 pb-2">Media</h3>

            <div>
              <Label>Upload Images</Label>
              <div className="flex items-center gap-3 mb-2">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleUploadImages(e.target.files)}
                  disabled={uploading}
                  className="text-sm text-white file:bg-white/10 file:text-white file:border-white/10 file:px-3 file:py-2 file:rounded-md file:border file:border-white/10 bg-black/20 rounded-md"
                />
                {uploading && (
                  <span className="text-sm text-white/60">Uploading...</span>
                )}
              </div>
              <p className="text-xs text-white/40 mb-4">
                Select one or more images to upload. Uploaded images will be stored in Cloudinary and saved as URLs.
              </p>

              <Label>Image URLs</Label>
              <div className="flex gap-3 mb-4">
                <Input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Paste image URL here..."
                  className="flex-1 bg-black/20 text-white border-white/10 placeholder:text-white/30 focus-visible:ring-white/30"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddImage();
                    }
                  }}
                />
                <Button 
                  type="button" 
                  onClick={handleAddImage} 
                  className="bg-white/10 text-white hover:bg-white/20 border border-white/10"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Image
                </Button>
              </div>

              {property.imageUrls.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {property.imageUrls.map((url, index) => (
                    <div key={index} className="relative group rounded-lg overflow-hidden border border-white/10 aspect-video bg-black/40">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.jpg'; // Ensure you have a placeholder.jpg in your public folder
                        }}
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          type="button"
                          size="icon"
                          variant="destructive"
                          className="w-8 h-8 rounded-full"
                          onClick={() => handleRemoveImage(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border-2 border-dashed border-white/10 rounded-lg p-8 flex flex-col items-center justify-center text-white/30 bg-black/10">
                  <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                  <p className="text-sm">No images added yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/10">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={onCancel} 
              disabled={loading} 
              className="text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-white text-black hover:bg-gray-200 font-semibold px-6"
            >
              {loading ? 'Saving...' : propertyId ? 'Save Changes' : 'Create Property'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}