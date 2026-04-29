'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import PropertyCard from './PropertyCard';
import { Empty, EmptyTitle, EmptyDescription } from '@/components/ui/empty';
import { Skeleton } from '@/components/ui/skeleton';

interface Property {
  id: number;
  title: string;
  description: string;
  price: number;
  address: string;
  city: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  propertyType: string;
  imageUrls: string[];
}

interface PropertyGridProps {
  searchCity: string;
  minPrice: string;
  maxPrice: string;
  propertyType: string;
  hasSearched: boolean;
  showAll?: boolean;
}

// 1. Realistic Skeleton Loader to match your PropertyCard
const PropertySkeleton = () => (
  <div className="bg-[#1a1614] rounded-2xl overflow-hidden border border-white/5 h-[450px]">
    <Skeleton className="h-72 w-full bg-white/5" />
    <div className="p-6 space-y-4">
      <Skeleton className="h-6 w-3/4 bg-white/5" />
      <Skeleton className="h-4 w-1/2 bg-white/5" />
      <div className="grid grid-cols-3 gap-2 py-2">
        <Skeleton className="h-12 bg-white/5 rounded-xl" />
        <Skeleton className="h-12 bg-white/5 rounded-xl" />
        <Skeleton className="h-12 bg-white/5 rounded-xl" />
      </div>
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="h-8 w-24 bg-white/5" />
        <Skeleton className="h-4 w-16 bg-white/5" />
      </div>
    </div>
  </div>
);

export default function PropertyGrid({
  searchCity,
  minPrice,
  maxPrice,
  propertyType,
  hasSearched,
  showAll = false,
}: PropertyGridProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({ status: 'available' });
        const shouldFetchAll = hasSearched || showAll;

        if (shouldFetchAll) {
          if (searchCity) params.append('city', searchCity);
          if (minPrice) params.append('minPrice', minPrice);
          if (maxPrice) params.append('maxPrice', maxPrice);
          if (propertyType) params.append('propertyType', propertyType);
        } else {
          params.append('_limit', '6');
        }

        const res = await fetch(`/api/properties?${params.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch properties');
        const data = await res.json();
        setProperties(data);
        setError('');
      } catch (err) {
        setError('We encountered an issue loading listings. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchCity, minPrice, maxPrice, propertyType, hasSearched, showAll]);

  // Loading State
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <PropertySkeleton key={i} />
        ))}
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-red-500/5 rounded-3xl border border-red-500/10">
        <p className="text-red-400 font-medium">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 text-sm text-white underline underline-offset-4"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  // Empty State
  if (properties.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-20"
      >
        <Empty
          className="bg-[#1a1614] border border-white/5 p-12 rounded-3xl"
        >
          <EmptyTitle>{hasSearched ? 'No matching retreats' : 'No properties yet'}</EmptyTitle>
          <EmptyDescription>
            {hasSearched
              ? 'Try widening your price range or exploring another city.'
              : 'Our curators are currently adding new exclusive listings.'
            }
          </EmptyDescription>
        </Empty>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Results Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {hasSearched ? 'Search Results' : 'Featured Residences'}
          </h2>
          <p className="text-gray-400 text-sm">
            {properties.length} {properties.length === 1 ? 'property' : 'properties'} found
          </p>
        </div>
      </div>

      {/* Grid with Framer Motion Stagger */}
      <motion.div 
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
          }
        }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {properties.map((property) => (
          <motion.div
            key={property.id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 }
            }}
          >
            <Link href={`/properties/${property.id}`} className="block">
              <PropertyCard property={property} />
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}