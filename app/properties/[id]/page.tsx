'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Home, 
  Calendar, 
  MessageSquare,
  Share2,
  Loader2
} from 'lucide-react';
import LeadForm from '@/components/LeadForm';

interface Property {
  id: number;
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

export default function PropertyDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await fetch(`/api/properties/${id}`);
        if (!res.ok) throw new Error('Property not found');
        const data = await res.json();
        setProperty(data);
      } catch (err) {
        setError('Failed to load property details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'sold': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'pending': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default: return 'bg-white/10 text-white/70 border-white/20';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getCurrentUrl = () => {
    if (typeof window === 'undefined') return '';
    return window.location.href;
  };

  const getShareLink = (type: 'facebook' | 'whatsapp') => {
    const url = encodeURIComponent(getCurrentUrl());
    const text = encodeURIComponent(`${property?.title || 'Amazing property'} - ${property ? formatPrice(property.price) : ''}`);
    if (type === 'facebook') {
      return `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    }
    return `https://api.whatsapp.com/send?text=${text}%20${url}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1614] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-white/20 mx-auto" />
          <p className="text-white/40 animate-pulse">Fetching property details...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-[#1a1614] flex flex-col items-center justify-center px-4">
        <h1 className="text-2xl font-bold text-white mb-6">{error}</h1>
        <Link href="/">
          <Button className="bg-white text-black hover:bg-white/90">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Listings
          </Button>
        </Link>
      </div>
    );
  }

  const placeholderImage = '/placeholder-property.png';
  const imageUrl = property.imageUrls?.[selectedImageIndex] || placeholderImage;

  return (
    <div className="min-h-screen bg-[#1a1614] text-white">
      {/* Top Nav / Back Button */}
  

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-10">
          
          {/* LEFT COLUMN: Media & Description */}
          <div className="lg:col-span-2 space-y-8">
            {/* Main Image Stage */}
            <div className="space-y-4">
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-[#231e1b] shadow-2xl">
                <Image
                  src={imageUrl}
                  alt={property.title}
                  fill
                  className="object-cover transition-all duration-500"
                  priority
                />
                <div className="absolute top-4 left-4">
                  <Badge className={`${getStatusColor(property.status)} backdrop-blur-md px-3 py-1 text-sm border`}>
                    {property.status}
                  </Badge>
                </div>
              </div>

              {/* Thumbnail Ribbon */}
              {property.imageUrls && property.imageUrls.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                  {property.imageUrls.map((url, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImageIndex === index ? 'border-white scale-105 shadow-lg' : 'border-white/10 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <Image src={url} alt="Thumbnail" fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Property Overview Card */}
            <Card className="bg-[#231e1b] border-white/10 shadow-xl overflow-hidden">
              <CardContent className="p-8">
                <div className="mb-6">
                  <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">{property.title}</h1>
                  <div className="flex items-center text-white/60">
                    <MapPin className="w-4 h-4 mr-2 text-emerald-400" />
                    <span className="text-lg">{property.address}, {property.city}</span>
                  </div>

                  <div className="mt-4 flex gap-3">
                    <a
                      href={getShareLink('facebook')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
                    >
                      📘 Share on Facebook
                    </a>
                    <a
                      href={getShareLink('whatsapp')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-400"
                    >
                      💬 Share on WhatsApp .
                    </a>
                  </div>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y border-white/5 mb-8">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Bedrooms</p>
                    <div className="flex items-center gap-2">
                      <Bed className="w-5 h-5 text-white/80" />
                      <span className="text-xl font-semibold text-white">{property.bedrooms}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Bathrooms</p>
                    <div className="flex items-center gap-2">
                      <Bath className="w-5 h-5 text-white/80" />
                      <span className="text-xl font-semibold text-white">{property.bathrooms}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Square_Feet</p>
                    <div className="flex items-center gap-2">
                      <Square className="w-5 h-5 text-white/80" />
                      <span className="text-xl font-semibold text-white">{property.squareFeet.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Property Type</p>
                    <div className="flex items-center gap-2">
                      <Home className="w-5 h-5 text-white/80" />
                      <span className="text-xl font-semibold text-white capitalize">{property.propertyType}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-white">The Space</h2>
                  <p className="text-white/70 leading-relaxed text-lg whitespace-pre-line">
                    {property.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN: Action Sidebar */}
          <div className="space-y-6">
            <Card className="bg-[#231e1b] border-white/10 shadow-2xl sticky top-24 overflow-hidden">
              <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-500" />
              <CardContent className="p-8">
                <div className="mb-8">
                  <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Listed Price</p>
                  <p className="text-5xl font-black text-white tracking-tighter">
                    {formatPrice(property.price)}
                  </p>
                </div>

                <div className="space-y-4">
                  {/* lead capture dialog/form */}
                <LeadForm propertyId={property.id} trigger={
                  <Button className="w-full h-14 bg-white text-black hover:bg-white/90 text-md font-bold transition-transform active:scale-95">
                    <Calendar className="w-5 h-5 mr-2" />
                    Fill Your Details
                  </Button>
                } />
                 
                </div>

                <div className="mt-8 pt-8 border-t border-white/5 space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/40 uppercase tracking-wider text-[10px] font-bold">Property ID</span>
                    <span className="text-white/80 font-mono text-xs">{String(property.id).slice(-8).toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40 uppercase tracking-wider text-[10px] font-bold">Location</span>
                    <span className="text-white/80">{property.city}, {property.state}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Agent Teaser Card */}
            <Card className="bg-white/5 border-white/10 border-dashed">
               <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <Home className="text-emerald-400 w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Professional Listing</p>
                    <p className="text-xs text-white/40">Verified by Real Estate Group</p>
                  </div>
               </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}