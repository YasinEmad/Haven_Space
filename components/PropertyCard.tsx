'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bed, Bath, Square, MapPin, Share2, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming you have a cn utility for Tailwind

interface PropertyCardProps {
  property: {
    id: number;
    title: string;
    price: number;
    address: string;
    city: string;
    bedrooms: number;
    bathrooms: number;
    squareFeet: number;
    propertyType: string;
    imageUrls: string[];
  };
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const placeholderImage = '/placeholder-property.png';
  const imageUrl = property.imageUrls?.[0] || placeholderImage;

  return (
    <Card className="group relative overflow-hidden bg-[#1a1614] border-gray-800 rounded-2xl transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:-translate-y-2">
      {/* Image Section */}
      <div className="relative h-72 w-full overflow-hidden">
        <Image
          src={imageUrl}
          alt={property.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = placeholderImage;
          }}
        />
        
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1614] via-transparent to-transparent opacity-80" />
        
        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          <Badge className="bg-black/40 backdrop-blur-md text-white border-white/20 px-3 py-1.5 capitalize font-medium tracking-wide">
            {property.propertyType}
          </Badge>
        </div>

        {/* Floating Price Tag for Visual Interest */}
        <div className="absolute bottom-4 left-4">
           <p className="text-2xl font-bold text-white tracking-tight">
            ${(property.price / 1000000).toFixed(2)}M
          </p>
        </div>
      </div>

      {/* Content Section */}
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-xl text-white leading-tight line-clamp-1 group-hover:text-green-400 transition-colors">
            {property.title}
          </h3>
        </div>

        <div className="flex items-center text-gray-400 mb-6">
          <MapPin className="w-4 h-4 mr-1.5 text-green-500" />
          <span className="text-sm font-medium truncate">
            {property.city}, {property.address}
          </span>
        </div>

        {/* Specs Grid with subtle background */}
        <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-white/5 border border-white/5 mb-6">
          <div className="flex flex-col items-center justify-center border-r border-white/10">
            <div className="flex items-center gap-1.5 mb-1">
              <Bed className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-bold text-white">{property.bedrooms}</span>
            </div>
            <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Beds</p>
          </div>
          
          <div className="flex flex-col items-center justify-center border-r border-white/10">
            <div className="flex items-center gap-1.5 mb-1">
              <Bath className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-bold text-white">{property.bathrooms}</span>
            </div>
            <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Baths</p>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-1.5 mb-1">
              <Square className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-bold text-white">{(property.squareFeet / 1000).toFixed(1)}k</span>
            </div>
            <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Sq Ft</p>
          </div>
        </div>

        {/* Footer Action */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
            Featured Listing
          </span>
          <button className="flex items-center gap-1 text-sm font-bold text-green-400 group-hover:underline">
            View Details
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}