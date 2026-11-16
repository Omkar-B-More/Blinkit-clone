'use client';

import React, { useState } from 'react';
import {
  Search,
  ShoppingCart,
  User as UserIcon,
  MapPin,
  Zap,
  Database,
  Sparkles,
  ChevronDown,
  Printer,
  X,
  Phone,
  Package,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { Address } from '@/types';

interface HeaderProps {
  onSearchChange: (query: string) => void;
  searchQuery: string;
  onOpenInnovations: () => void;
  onOpenRedisInspector: () => void;
  onOpenPrintStore: () => void;
}

export default function Header({
  onSearchChange,
  searchQuery,
  onOpenInnovations,
  onOpenRedisInspector,
  onOpenPrintStore,
}: HeaderProps) {
  const { user, openAuthModal, updateAddress } = useAuth();
  const { itemCount, itemTotal, openCartDrawer, currentOrder, openTracking } = useCart();
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [newStreet, setNewStreet] = useState('');
  const [newFlat, setNewFlat] = useState('');
  const [newArea, setNewArea] = useState('Bellandur');

  const activeAddress = user?.addresses[0] || {
    id: 'default',
    label: 'Home',
    flat: 'Flat 402, Green Glen Apartments',
    street: 'Outer Ring Road',
    area: 'Bellandur',
    city: 'Bengaluru',
    pincode: '560103',
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFlat || !newStreet) return;
    const newAddr: Address = {
      id: `addr_${Date.now()}`,
      label: 'Home',
      flat: newFlat,
      street: newStreet,
      area: newArea,
      city: 'Bengaluru',
      pincode: '560103',
    };
    updateAddress(newAddr);
    setIsAddressModalOpen(false);
    setNewFlat('');
    setNewStreet('');
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#F8CB46] border-b border-yellow-400 shadow-sm transition-all">
        {/* Top Announcement Bar */}
        <div className="bg-[#1C1C1C] text-white text-xs py-1.5 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-yellow-400">Blinkit Dark Store #042 Live</span>
              <span className="text-zinc-400 hidden sm:inline">|</span>
              <span className="text-zinc-300 hidden sm:inline">Over 2,00,000 instant orders dispatched daily across India</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onOpenInnovations}
                className="flex items-center gap-1 text-yellow-300 hover:text-white transition font-medium cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>What's New in Blinkit 2026</span>
              </button>
              <button
                onClick={onOpenRedisInspector}
                className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition font-mono text-[11px] bg-zinc-800 px-2 py-0.5 rounded cursor-pointer"
                title="View Redis Database in real-time"
              >
                <Database className="w-3 h-3" />
                <span>Redis DB</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Logo & Delivery Time */}
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <a href="#" className="flex items-baseline font-black tracking-tight text-3xl">
                <span className="text-black">blink</span>
                <span className="text-[#0C831F]">it</span>
              </a>
              <span className="text-[10px] uppercase font-bold tracking-wider text-black/70 -mt-1">
                India's 10-Min Delivery
              </span>
            </div>

            {/* Delivery SLA Badge & Address Trigger */}
            <div
              onClick={() => setIsAddressModalOpen(true)}
              className="hidden md:flex flex-col cursor-pointer bg-white/70 hover:bg-white px-3 py-1.5 rounded-xl border border-yellow-400/50 transition shadow-xs max-w-[220px]"
            >
              <div className="flex items-center gap-1 text-[#0C831F] font-black text-xs uppercase tracking-wide">
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Delivery in 10 mins</span>
                <ChevronDown className="w-3 h-3 text-black/50 ml-auto" />
              </div>
              <div className="text-xs text-black/80 font-medium truncate flex items-center gap-1">
                <MapPin className="w-3 h-3 text-black/60 shrink-0" />
                <span className="truncate">{activeAddress.flat}, {activeAddress.area}</span>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl relative">
            <div className="relative">
              <Search className="w-4 h-4 text-black/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder='Search "milk", "lays", "paneer", "atta", "crocin", "charger"...'
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-white text-black pl-10 pr-9 py-2.5 rounded-xl border-none shadow-inner text-sm font-medium placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-[#0C831F]"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 hover:text-black"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Blinkit Print Store Button */}
            <button
              onClick={onOpenPrintStore}
              className="hidden lg:flex items-center gap-1.5 bg-purple-700 hover:bg-purple-800 text-white px-3 py-2 rounded-xl text-xs font-bold shadow-sm transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Store</span>
              <span className="bg-yellow-400 text-black text-[9px] px-1 py-0.5 rounded font-black">10m</span>
            </button>

            {/* Active Live Order Tracker Pill (if an order is placed) */}
            {currentOrder && currentOrder.status !== 'delivered' && (
              <button
                onClick={() => openTracking()}
                className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-2 rounded-xl text-xs font-bold shadow-sm animate-bounce cursor-pointer"
              >
                <Package className="w-4 h-4" />
                <span>Track Order (⚡ {currentOrder.estimatedDeliveryTimeMinutes}m)</span>
              </button>
            )}

            {/* User Account / Clerk Phone Auth */}
            <button
              onClick={openAuthModal}
              className="flex items-center gap-2 bg-white/80 hover:bg-white text-black px-3.5 py-2 rounded-xl text-xs font-bold border border-black/10 shadow-xs transition cursor-pointer"
            >
              <UserIcon className="w-4 h-4 text-black/70" />
              <div className="text-left hidden sm:block">
                <div className="text-black leading-tight">
                  {user ? user.name.split(' ')[0] : 'Login'}
                </div>
                {user && (
                  <div className="text-[10px] text-[#0C831F] font-semibold">
                    {user.orderCount} Orders
                  </div>
                )}
              </div>
            </button>

            {/* Cart Button */}
            <button
              onClick={openCartDrawer}
              className="flex items-center gap-2.5 bg-[#0C831F] hover:bg-[#0A6B1A] text-white px-4 py-2 rounded-xl font-bold shadow-md transition cursor-pointer"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </div>
              <div className="text-left">
                {itemCount > 0 ? (
                  <div className="text-xs">
                    <span className="block font-black">₹{itemTotal}</span>
                    <span className="text-[10px] text-emerald-200">View Cart</span>
                  </div>
                ) : (
                  <span className="text-xs font-bold">My Cart</span>
                )}
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Address Selection Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button
              onClick={() => setIsAddressModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-emerald-700 font-bold mb-1">
              <MapPin className="w-5 h-5" />
              <span>Change Delivery Address</span>
            </div>
            <p className="text-xs text-zinc-500 mb-4">
              Enter your address to connect with the nearest micro Dark Store (within 1.5 km for 10-minute delivery).
            </p>

            <form onSubmit={handleSaveAddress} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-zinc-700 block mb-1">
                  Flat / House / Floor No.
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flat 402, 4th Floor"
                  value={newFlat}
                  onChange={(e) => setNewFlat(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-700 block mb-1">
                  Apartment / Street / Landmark
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Green Glen Layout, Outer Ring Road"
                  value={newStreet}
                  onChange={(e) => setNewStreet(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-700 block mb-1">
                  Area / Locality
                </label>
                <select
                  value={newArea}
                  onChange={(e) => setNewArea(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:border-emerald-600"
                >
                  <option value="Bellandur">Bellandur, Bengaluru (Hub #042 - 1.2km)</option>
                  <option value="Koramangala">Koramangala 4th Block, Bengaluru (Hub #018 - 0.9km)</option>
                  <option value="Indiranagar">100 Feet Road, Indiranagar (Hub #031 - 1.4km)</option>
                  <option value="HSR Layout">HSR Layout Sector 2, Bengaluru (Hub #055 - 1.1km)</option>
                  <option value="Whitefield">Whitefield Main Road (Hub #089 - 1.6km)</option>
                  <option value="Connaught Place">Connaught Place, New Delhi (Hub #004 - 0.8km)</option>
                </select>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="flex-1 py-2 rounded-xl text-sm font-semibold border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl text-sm font-bold bg-[#0C831F] text-white hover:bg-[#0A6B1A] transition"
                >
                  Save & Update Dark Store
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
