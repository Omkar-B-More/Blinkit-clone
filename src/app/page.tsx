'use client';

import React, { useState, useMemo } from 'react';
import Header from '@/components/Header';
import CategoryBar from '@/components/CategoryBar';
import ProductCard from '@/components/ProductCard';
import ProductDetailModal from '@/components/ProductDetailModal';
import CartDrawer from '@/components/CartDrawer';
import OrderTrackingModal from '@/components/OrderTrackingModal';
import AuthModal from '@/components/AuthModal';
import RedisInspector from '@/components/RedisInspector';
import PrintStoreModal from '@/components/PrintStoreModal';
import BlinkitInnovationsModal from '@/components/BlinkitInnovationsModal';
import { PRODUCTS } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import {
  Zap,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  Printer,
  ShieldCheck,
  RotateCcw,
  Clock,
  Flame,
  CheckCircle2,
} from 'lucide-react';

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isInnovationsOpen, setIsInnovationsOpen] = useState(false);
  const [isRedisInspectorOpen, setIsRedisInspectorOpen] = useState(false);
  const [isPrintStoreOpen, setIsPrintStoreOpen] = useState(false);

  const { itemCount, itemTotal, openCartDrawer, addToCart } = useCart();
  const { user } = useAuth();

  // Filter products by search query and category
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchesCategory =
        selectedCategory === 'all' || product.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.brand.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Quick 1-Click Recipe Combos
  const handleAddChaiCombo = () => {
    const milk = PRODUCTS.find((p) => p.id === 'prod-milk-amul-taaza');
    const kurkure = PRODUCTS.find((p) => p.id === 'prod-snack-kurkure');
    const bhujia = PRODUCTS.find((p) => p.id === 'prod-snack-haldiram-bhujia');
    if (milk) addToCart(milk);
    if (kurkure) addToCart(kurkure);
    if (bhujia) addToCart(bhujia);
    openCartDrawer();
  };

  const handleAddMidnightMunchies = () => {
    const lays = PRODUCTS.find((p) => p.id === 'prod-snack-lays-magic');
    const doritos = PRODUCTS.find((p) => p.id === 'prod-snack-doritos');
    const popcorn = PRODUCTS.find((p) => p.id === 'prod-snack-popcorn');
    if (lays) addToCart(lays);
    if (doritos) addToCart(doritos);
    if (popcorn) addToCart(popcorn);
    openCartDrawer();
  };

  return (
    <div className="min-h-screen flex flex-col pb-24 md:pb-12">
      {/* Header */}
      <Header
        onSearchChange={setSearchQuery}
        searchQuery={searchQuery}
        onOpenInnovations={() => setIsInnovationsOpen(true)}
        onOpenRedisInspector={() => setIsRedisInspectorOpen(true)}
        onOpenPrintStore={() => setIsPrintStoreOpen(true)}
      />

      {/* Sticky Category Nav */}
      <CategoryBar
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 py-5 flex-1 w-full space-y-6">
        {/* Blinkit Mission & Instant Delivery Hero Banner */}
        <div className="bg-gradient-to-br from-yellow-300 via-[#F8CB46] to-amber-400 rounded-3xl p-6 sm:p-8 shadow-sm border border-yellow-400/80 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 bg-black text-white text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full mb-3 shadow-xs">
              <Zap className="w-3.5 h-3.5 text-yellow-400 fill-current" />
              <span>India's Pioneer in 10-Minute Delivery</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-zinc-950 tracking-tight leading-tight">
              Everything in 10 minutes.
            </h1>

            <p className="text-xs sm:text-sm text-zinc-800 font-medium mt-2 leading-relaxed">
              &quot;Blinkit is a 10-minute grocery and e-commerce platform. We pioneered the instant delivery model in India with over 10 million Indians shopping on Blinkit, for everything from grocery staples and vegetables to emergency supplies and electronics, and much more. We currently deliver over 2,00,000 orders every day and we are in a hurry to bring the future of commerce to everyone in India.&quot;
            </p>

            {/* Quick Action Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-4">
              <button
                onClick={() => setIsPrintStoreOpen(true)}
                className="bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-yellow-300" />
                <span>Urgent Document Printouts (10m)</span>
              </button>

              <button
                onClick={() => setIsInnovationsOpen(true)}
                className="bg-white/90 hover:bg-white text-zinc-900 text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>See What&apos;s New in Blinkit</span>
              </button>

              <button
                onClick={() => setIsRedisInspectorOpen(true)}
                className="bg-black/80 hover:bg-black text-white text-xs font-mono font-bold px-3.5 py-2 rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>Redis User State: {user?.phone || '+91 98765 43210'}</span>
              </button>
            </div>
          </div>

          {/* Decorative Background Badges */}
          <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 text-right">
            <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl shadow-lg border border-yellow-200/80 max-w-xs text-left space-y-2">
              <div className="flex items-center gap-2 text-xs font-black text-emerald-800">
                <ShieldCheck className="w-4 h-4 text-[#0C831F]" />
                <span>Dark Store #042 Telemetry</span>
              </div>
              <div className="text-xs text-zinc-700 space-y-1">
                <div>⚡ Average Packing Time: <strong>1m 45s</strong></div>
                <div>🛵 Active Riders Nearby: <strong>14 Riders</strong></div>
                <div>📦 Delivery SLA: <strong>99.4% On Time</strong></div>
              </div>
            </div>
          </div>
        </div>

        {/* 1-Click Recipe & Instant Bundles Section (Real Blinkit Feature) */}
        {selectedCategory === 'all' && !searchQuery && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Chai & Munchies Kit */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between shadow-2xs">
              <div>
                <div className="flex items-center gap-1 text-[11px] font-black text-amber-700 uppercase tracking-wide mb-0.5">
                  <Flame className="w-3.5 h-3.5 fill-current" />
                  <span>1-Click Quick Bundle</span>
                </div>
                <h3 className="text-sm font-black text-zinc-900">
                  Desi Chai & Snacks Break Kit
                </h3>
                <p className="text-xs text-zinc-600 mt-0.5">
                  Amul Taaza Milk (500ml) + Kurkure + Haldiram Bhujia
                </p>
                <div className="mt-2 text-xs font-black text-zinc-900">
                  Combo: ₹105 <span className="text-emerald-700 font-bold ml-1">Save ₹10</span>
                </div>
              </div>
              <button
                onClick={handleAddChaiCombo}
                className="bg-[#0C831F] hover:bg-[#0A6B1A] text-white text-xs font-black px-4 py-2.5 rounded-xl transition shadow-xs cursor-pointer shrink-0 ml-3"
              >
                + Add Combo
              </button>
            </div>

            {/* Midnight Cravings Kit */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-4 flex items-center justify-between shadow-2xs">
              <div>
                <div className="flex items-center gap-1 text-[11px] font-black text-indigo-700 uppercase tracking-wide mb-0.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Midnight Craving Bundle</span>
                </div>
                <h3 className="text-sm font-black text-zinc-900">
                  Late Night Chips & Popcorn Pack
                </h3>
                <p className="text-xs text-zinc-600 mt-0.5">
                  Lay&apos;s Magic Masala + Doritos Cheese + Act II Popcorn
                </p>
                <div className="mt-2 text-xs font-black text-zinc-900">
                  Combo: ₹90 <span className="text-emerald-700 font-bold ml-1">Delivered in 10m</span>
                </div>
              </div>
              <button
                onClick={handleAddMidnightMunchies}
                className="bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-black px-4 py-2.5 rounded-xl transition shadow-xs cursor-pointer shrink-0 ml-3"
              >
                + Add Combo
              </button>
            </div>
          </div>
        )}

        {/* Section Heading & Category Count */}
        <div className="flex items-center justify-between pt-2">
          <div>
            <h2 className="text-lg font-black text-zinc-900 tracking-tight flex items-center gap-2">
              <span>
                {selectedCategory === 'all'
                  ? 'Popular Quick-Commerce Items'
                  : PRODUCTS.find((p) => p.category === selectedCategory)?.category ||
                    'Category Products'}
              </span>
              <span className="text-xs font-bold text-zinc-400">
                ({filteredProducts.length} items)
              </span>
            </h2>
            <p className="text-xs text-zinc-500">
              Fresh stock reserved in nearby micro Dark Store • Dispatched on Hero Electric bikes
            </p>
          </div>

          {/* Out of Stock toggle preview info */}
          <div className="text-xs text-zinc-500 hidden sm:flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Ready for 10-Min Dispatch</span>
          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-zinc-200">
            <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <ShoppingBag className="w-8 h-8 text-zinc-400" />
            </div>
            <h3 className="font-bold text-zinc-900 text-base">No products found</h3>
            <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
              We couldn&apos;t find any items matching &quot;{searchQuery}&quot;. Try searching for &quot;milk&quot;, &quot;chips&quot;, &quot;atta&quot;, &quot;tomatoes&quot;, or &quot;crocin&quot;.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-4 bg-[#0C831F] text-white text-xs font-bold px-4 py-2 rounded-xl"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Informational Footer: About Blinkit Quick Commerce */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 mt-12 space-y-4">
          <div className="flex items-center gap-2">
            <span className="font-black text-2xl tracking-tight text-black">
              blink<span className="text-[#0C831F]">it</span>
            </span>
            <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">
              | India&apos;s Last Minute App
            </span>
          </div>
          <p className="text-xs text-zinc-600 leading-relaxed">
            Blinkit pioneers the instant 10-minute delivery ecosystem across India. Powered by a hyper-dense network of micro-fulfillment centers (Dark Stores) located within 1.5 km of residential clusters, Blinkit achieves sub-120-second order picking and sub-8-minute rider dispatch.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs text-zinc-700">
            <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
              <span className="font-black block text-zinc-900">⚡ 10-Minute SLA</span>
              Every product is stocked locally in your neighborhood dark store.
            </div>
            <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
              <span className="font-black block text-zinc-900">📦 Sealed Security</span>
              Tamper-evident packaging and 4-digit handover OTP verification.
            </div>
            <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
              <span className="font-black block text-zinc-900">🔄 10-Min Doorstep Returns</span>
              Instant replacement sizes and hassle-free returns right at your door.
            </div>
          </div>
        </div>
      </main>

      {/* Floating Mobile Cart Pill */}
      {itemCount > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-30 md:hidden">
          <button
            onClick={openCartDrawer}
            className="w-full bg-[#0C831F] text-white p-3.5 rounded-2xl font-black text-sm flex items-center justify-between shadow-2xl animate-in slide-in-from-bottom duration-200"
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-yellow-300" />
              <span>{itemCount} {itemCount === 1 ? 'item' : 'items'} • ₹{itemTotal}</span>
            </div>
            <div className="flex items-center gap-1 text-yellow-300 text-xs uppercase tracking-wider">
              <span>View Cart (10m ⚡)</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}

      {/* Modals & Drawers */}
      <ProductDetailModal />
      <CartDrawer />
      <OrderTrackingModal />
      <AuthModal />
      <RedisInspector
        isOpen={isRedisInspectorOpen}
        onClose={() => setIsRedisInspectorOpen(false)}
      />
      <PrintStoreModal
        isOpen={isPrintStoreOpen}
        onClose={() => setIsPrintStoreOpen(false)}
      />
      <BlinkitInnovationsModal
        isOpen={isInnovationsOpen}
        onClose={() => setIsInnovationsOpen(false)}
        onOpenPrintStore={() => setIsPrintStoreOpen(true)}
      />
    </div>
  );
}
