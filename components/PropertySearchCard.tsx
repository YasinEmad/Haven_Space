'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, MapPin, DollarSign, Home, ChevronDown } from 'lucide-react';

interface PropertySearchCardProps {
  onSearch: () => void;
  searchCity: string;
  setSearchCity: (city: string) => void;
  minPrice: string;
  setMinPrice: (price: string) => void;
  maxPrice: string;
  setMaxPrice: (price: string) => void;
  propertyType: string;
  setPropertyType: (type: string) => void;
}

const PROPERTY_TYPES = [
  { value: 'all',        label: 'All Types'   },
  { value: 'house',      label: 'House'       },
  { value: 'apartment',  label: 'Apartment'   },
  { value: 'condo',      label: 'Condo'       },
  { value: 'townhouse',  label: 'Townhouse'   },
  { value: 'villa',      label: 'Villa'       },
  { value: 'penthouse',  label: 'Penthouse'   },
  { value: 'studio',     label: 'Studio'      },
  { value: 'commercial', label: 'Commercial'  },
  { value: 'land',       label: 'Land'        },
];

export default function PropertySearchCard({
  onSearch,
  searchCity,
  setSearchCity,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  propertyType,
  setPropertyType,
}: PropertySearchCardProps) {
  const [focused, setFocused] = useState<string | null>(null);
  const [transactionType] = useState<'buy' | 'rent' | 'new-homes'>('buy');

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600&display=swap');

        /* ── Tokens ── */
        /* Main: #231e1b  |  Accent light: rgba(35,30,27,0.08) */

        .psc-wrap {
          font-family: 'Outfit', sans-serif;
          background: #231e1b;
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-radius: 1.5rem;
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow:
            0 2px 4px rgba(0,0,0,.2),
            0 8px 24px rgba(0,0,0,.3),
            0 32px 64px rgba(0,0,0,.25);
          overflow: hidden;
          max-width: 920px;
          margin: 0 auto;
        }

        /* ── Tab bar ── */
        .psc-tabs {
          display: flex;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.04);
        }
        .psc-tab {
          flex: 1; padding: .85rem 1rem;
          font-size: .78rem; font-weight: 600;
          letter-spacing: .1em; text-transform: uppercase;
          color: rgba(255,255,255,.35); background: transparent;
          border: none; cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: color .2s, border-color .2s, background .2s;
          display: flex; align-items: center; justify-content: center; gap: .4rem;
        }
        .psc-tab:hover { color: rgba(255,255,255,.7); background: rgba(255,255,255,.04); }
        .psc-tab.active { color: #fff; border-bottom-color: #fff; background: transparent; }
        .psc-tab-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: currentColor; opacity: .7;
        }

        /* ── Body ── */
        .psc-body { padding: 2rem 2rem 1.75rem; }

        /* ── Transaction mode label ── */
        .psc-mode { margin-bottom: 1rem; display: flex; align-items: center; gap: .5rem; }
        .psc-mode-label { font-size: .7rem; text-transform: uppercase; color: rgba(255,255,255,.45); letter-spacing: .14em; }
        .psc-mode-value { font-size: .85rem; font-weight: 700; color: #fff; }

        /* ── Fields row ── */
        .psc-fields {
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr 1.1fr;
          gap: 0;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 1rem;
          overflow: hidden;
          background: rgba(255,255,255,0.05);
        }
        @media(max-width:720px){
          .psc-fields { grid-template-columns: 1fr 1fr; }
          .psc-field:nth-child(odd) { border-right: 1px solid rgba(255,255,255,0.08); }
          .psc-field:nth-child(1),.psc-field:nth-child(2) { border-bottom: 1px solid rgba(255,255,255,0.08); }
        }
        @media(max-width:460px){
          .psc-fields { grid-template-columns: 1fr; }
          .psc-field { border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.08) !important; }
          .psc-field:last-child { border-bottom: none !important; }
        }

        .psc-field {
          position: relative;
          padding: 1.1rem 1.25rem .9rem;
          border-right: 1px solid rgba(255,255,255,0.08);
          transition: background .2s;
        }
        .psc-field:last-child { border-right: none; }
        .psc-field.is-focused { background: rgba(255,255,255,.07); }

        .psc-field-header {
          display: flex; align-items: center; gap: .35rem;
          margin-bottom: .5rem;
        }
        .psc-field-icon { color: rgba(255,255,255,.45); flex-shrink: 0; }
        .psc-label {
          font-size: .67rem; font-weight: 700;
          letter-spacing: .14em; text-transform: uppercase;
          color: rgba(255,255,255,.45);
        }

        /* Override Input styles */
        .psc-field .psc-input {
          width: 100%;
          border: none !important;
          outline: none !important;
          box-shadow: none !important;
          background: transparent !important;
          padding: 0 !important;
          height: auto !important;
          font-size: .97rem;
          font-family: 'Outfit', sans-serif;
          font-weight: 500;
          color: #fff;
          caret-color: rgba(255,255,255,.8);
        }
        .psc-field .psc-input::placeholder { color: rgba(255,255,255,.22); font-weight: 400; }
        .psc-field .psc-input:focus { ring: none; }

        /* Override Select styles */
        .psc-field .psc-select-trigger {
          border: none !important;
          box-shadow: none !important;
          background: transparent !important;
          padding: 0 !important;
          height: auto !important;
          font-size: .97rem;
          font-family: 'Outfit', sans-serif;
          font-weight: 500;
          color: #fff;
        }
        .psc-field .psc-select-trigger:focus { ring: none; outline: none; }
        .psc-field [data-radix-select-trigger] { padding: 0; border: none; background: transparent; }

        /* ── Search button ── */
        .psc-action { margin-top: 1.25rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; }

        .psc-hints { display: flex; gap: .5rem; flex-wrap: wrap; }
        .psc-hint-tag {
          display: inline-flex; align-items: center; gap: .3rem;
          padding: .3rem .8rem;
          background: rgba(255,255,255,.06);
          border: 1px solid rgba(255,255,255,.12);
          border-radius: 2rem;
          font-size: .75rem; font-weight: 500;
          color: rgba(255,255,255,.55); cursor: pointer;
          transition: background .2s, border-color .2s, color .2s;
        }
        .psc-hint-tag:hover { background: rgba(255,255,255,.12); border-color: rgba(255,255,255,.25); color: #fff; }

        .psc-search-btn {
          display: inline-flex; align-items: center; gap: .6rem;
          padding: .8rem 2rem;
          background: #fff;
          color: #231e1b;
          font-family: 'Outfit', sans-serif;
          font-size: .92rem; font-weight: 700;
          border-radius: 3rem;
          border: none; cursor: pointer;
          transition: transform .2s, box-shadow .2s, background .2s, color .2s;
          white-space: nowrap;
        }
        .psc-search-btn:hover {
          transform: translateY(-2px);
          background: rgba(255,255,255,.88);
          box-shadow: 0 8px 28px rgba(0,0,0,.35);
        }
        .psc-search-btn:active { transform: translateY(0); }
        .psc-search-icon-wrap {
          width: 26px; height: 26px;
          background: rgba(35,30,27,.12);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
        }

        /* ── Divider with "or" ── */
        .psc-divider {
          display: flex; align-items: center; gap: .75rem;
          font-size: .72rem; color: rgba(255,255,255,.2); margin-top: .1rem;
        }
        .psc-divider::before,.psc-divider::after {
          content: ''; flex: 1; height: 1px; background: rgba(255,255,255,.08);
        }
      `}</style>

      <div className="psc-wrap">
        <div className="psc-body">
          <div className="psc-mode">
            <span className="psc-mode-label">Mode:</span>
            <span className="psc-mode-value">{transactionType === 'buy' ? 'Buy' : transactionType === 'rent' ? 'Rent' : 'New Homes'}</span>
          </div>

          {/* Fields */}
          <div className="psc-fields">

            {/* Location */}
            <div
              className={`psc-field${focused === 'city' ? ' is-focused' : ''}`}
            >
              <div className="psc-field-header">
                <MapPin size={12} className="psc-field-icon" />
                <span className="psc-label">Location</span>
              </div>
              <Input
                placeholder="City, neighbourhood…"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                onFocus={() => setFocused('city')}
                onBlur={() => setFocused(null)}
                className="psc-input"
              />
            </div>

            {/* Min Price */}
            <div
              className={`psc-field${focused === 'min' ? ' is-focused' : ''}`}
            >
              <div className="psc-field-header">
                <DollarSign size={12} className="psc-field-icon" />
                <span className="psc-label">Min Price</span>
              </div>
              <Input
                type="number"
                placeholder="No minimum"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                onFocus={() => setFocused('min')}
                onBlur={() => setFocused(null)}
                className="psc-input"
              />
            </div>

            {/* Max Price */}
            <div
              className={`psc-field${focused === 'max' ? ' is-focused' : ''}`}
            >
              <div className="psc-field-header">
                <DollarSign size={12} className="psc-field-icon" />
                <span className="psc-label">Max Price</span>
              </div>
              <Input
                type="number"
                placeholder="No maximum"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                onFocus={() => setFocused('max')}
                onBlur={() => setFocused(null)}
                className="psc-input"
              />
            </div>

            {/* Property Type */}
            <div
              className={`psc-field${focused === 'type' ? ' is-focused' : ''}`}
            >
              <div className="psc-field-header">
                <Home size={12} className="psc-field-icon" />
                <span className="psc-label">Property Type</span>
              </div>
              <Select
                value={propertyType === '' ? 'all' : propertyType}
                onValueChange={(val) => setPropertyType(val === 'all' ? '' : val)}
              >
                <SelectTrigger 
                  className="psc-select-trigger psc-input"
                  onFocus={() => setFocused('type')}
                  onBlur={() => setFocused(null)}
                >
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  {PROPERTY_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

          </div>

          {/* Quick hints + Search button */}
          <div className="psc-action">
            <div className="psc-hints">
              {['cairo', 'Downtown', 'Rehab', 'New cairo',"Nasr City"].map((city) => (
                <button
                  key={city}
                  className="psc-hint-tag"
                  onClick={() => {
                    setSearchCity(city);
                    onSearch();
                  }}
                >
                  <MapPin size={10} /> {city}
                </button>
              ))}
            </div>

            <button className="psc-search-btn" onClick={onSearch}>
              <span className="psc-search-icon-wrap">
                <Search size={13} />
              </span>
              Search Properties
            </button>
          </div>

        </div>
      </div>
    </>
  );
}