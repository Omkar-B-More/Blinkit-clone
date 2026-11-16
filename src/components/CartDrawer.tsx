'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  Plus,
  Minus,
  Trash2,
  Zap,
  ShieldCheck,
  CloudRain,
  Heart,
  MapPin,
  ArrowRight,
  Clock,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function CartDrawer() {
  const {
    items,
    addToCart,
    removeFromCart,
    clearCart,
    itemCount,
    itemTotal,
    deliveryFee,
    handlingFee,
    rainSurgeFee,
    tipAmount,
    setTipAmount,
    toggleRainSurge,
    totalAmount,
    isCartDrawerOpen,
    closeCartDrawer,
    placeOrder,
  } = useCart();

  const { user, openAuthModal } = useAuth();
  const [isPlacing, setIsPlacing] = useState(false);

  if (!isCartDrawerOpen) return null;

  const currentAddress = user?.addresses[0] || {
    id: 'addr_default',
    label: 'Home',
    flat: 'Flat 402, Green Glen Apartments',
    street: 'Outer Ring Road',
    area: 'Bellandur',
    city: 'Bengaluru',
    pincode: '560103',
  };

  const handleCheckout = async () => {
    if (!user) {
      openAuthModal();
      return;
    }

    setIsPlacing(true);
    try {
      const order = await placeOrder(currentAddress);
      if (order) {
        // Trigger celebratory confetti
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F8CB46', '#0C831F', '#ffffff'],
        });
      }
    } finally {
      setIsPlacing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="bg-zinc-50 w-full max-w-md h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="bg-white p-4 border-b border-zinc-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#0C831F]" />
            <h2 className="font-black text-base text-zinc-900">
              My Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})
            </h2>
          </div>
          <button
            onClick={closeCartDrawer}
            className="p-1.5 text-zinc-400 hover:text-black rounded-full hover:bg-zinc-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 10-Minute SLA Banner */}
        <div className="bg-yellow-400/20 border-b border-yellow-400/40 px-4 py-2 flex items-center justify-between text-xs font-bold text-zinc-900">
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-emerald-700 fill-current" />
            <span>Delivery in 10 minutes from Dark Store #042</span>
          </div>
          <span className="text-[10px] bg-white px-2 py-0.5 rounded-full font-black text-emerald-800 border border-emerald-200">
            1.2 km away
          </span>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6">
              <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center mb-3">
                <ShoppingBag className="w-8 h-8 text-zinc-300" />
              </div>
              <h3 className="font-bold text-zinc-800 text-sm">Your cart is empty</h3>
              <p className="text-xs text-zinc-500 mt-1 max-w-xs">
                Explore milk, fresh vegetables, snacks, electronics, and documents delivered to your doorstep in 10 minutes.
              </p>
              <button
                onClick={closeCartDrawer}
                className="mt-4 bg-[#0C831F] text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-[#0A6B1A] transition"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <>
              {/* Cart Items List */}
              <div className="bg-white rounded-2xl p-3 border border-zinc-200 divide-y divide-zinc-100">
                {items.map((item) => (
                  <div key={item.product.id} className="py-3 first:pt-0 last:pb-0 flex items-center gap-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-14 h-14 object-cover rounded-xl bg-zinc-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-zinc-900 truncate">
                        {item.product.name}
                      </h4>
                      <span className="text-[11px] text-zinc-400 block">
                        {item.product.weight}
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-black text-zinc-900">
                          ₹{item.product.price * item.quantity}
                        </span>
                        {item.product.mrp > item.product.price && (
                          <span className="text-[10px] text-zinc-400 line-through">
                            ₹{item.product.mrp * item.quantity}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity modifier */}
                    <div className="flex items-center bg-[#0C831F] text-white rounded-lg px-1.5 py-1 shadow-2xs">
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-0.5 hover:bg-emerald-800 rounded transition cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-black px-2 min-w-[20px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => addToCart(item.product)}
                        className="p-0.5 hover:bg-emerald-800 rounded transition cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Real-time Surge / Monsoon Weather Feature (Blinkit Encountered Trend) */}
              <div className="bg-sky-50 border border-sky-200 rounded-2xl p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CloudRain className="w-4 h-4 text-sky-600" />
                    <div>
                      <div className="text-xs font-bold text-sky-900">
                        Monsoon Protection Packaging
                      </div>
                      <div className="text-[10px] text-sky-700">
                        Sealed waterproof bags for rainy weather delivery (+₹15)
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={toggleRainSurge}
                    className={`text-xs font-black px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                      rainSurgeFee > 0
                        ? 'bg-sky-600 text-white border-sky-600'
                        : 'bg-white text-sky-700 border-sky-300 hover:bg-sky-100'
                    }`}
                  >
                    {rainSurgeFee > 0 ? 'Applied' : 'Add'}
                  </button>
                </div>
              </div>

              {/* Delivery Partner Tip */}
              <div className="bg-white rounded-2xl p-3 border border-zinc-200">
                <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-900 mb-2">
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                  <span>Tip your 10-minute delivery rider</span>
                </div>
                <div className="flex gap-2">
                  {[0, 10, 20, 30, 50].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setTipAmount(amount)}
                      className={`flex-1 py-1 text-xs font-black rounded-lg border transition cursor-pointer ${
                        tipAmount === amount
                          ? 'bg-[#0C831F] text-white border-[#0C831F]'
                          : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border-zinc-200'
                      }`}
                    >
                      {amount === 0 ? 'No tip' : `₹${amount}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bill Details Breakdown */}
              <div className="bg-white rounded-2xl p-3.5 border border-zinc-200 space-y-2 text-xs">
                <div className="font-black text-zinc-900 text-sm pb-1 border-b border-zinc-100">
                  Bill Summary
                </div>

                <div className="flex justify-between text-zinc-600">
                  <span>Item Total</span>
                  <span className="font-bold text-zinc-900">₹{itemTotal}</span>
                </div>

                <div className="flex justify-between text-zinc-600">
                  <div className="flex items-center gap-1">
                    <span>Delivery Partner Fee</span>
                    {deliveryFee === 0 && (
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1 rounded font-bold">
                        FREE
                      </span>
                    )}
                  </div>
                  <span className="font-bold text-zinc-900">
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                  </span>
                </div>

                <div className="flex justify-between text-zinc-600">
                  <div className="flex items-center gap-1">
                    <span>Dark Store Handling Fee</span>
                    <span className="text-[10px] text-zinc-400">Packaging & Ice pack</span>
                  </div>
                  <span className="font-bold text-zinc-900">₹{handlingFee}</span>
                </div>

                {rainSurgeFee > 0 && (
                  <div className="flex justify-between text-sky-700">
                    <span>Monsoon Weather Surge</span>
                    <span className="font-bold">₹{rainSurgeFee}</span>
                  </div>
                )}

                {tipAmount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Rider Tip</span>
                    <span className="font-bold">₹{tipAmount}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-zinc-200 flex justify-between font-black text-sm text-zinc-900">
                  <span>Grand Total</span>
                  <span>₹{totalAmount}</span>
                </div>

                {itemTotal < 99 && (
                  <div className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg font-medium">
                    ⚡ Add ₹{99 - itemTotal} more items for <strong>FREE Delivery</strong>!
                  </div>
                )}
              </div>

              {/* Delivery Address Review */}
              <div className="bg-white rounded-2xl p-3 border border-zinc-200 flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#0C831F] shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-zinc-900">
                    Delivering to {currentAddress.label}
                  </div>
                  <div className="text-[11px] text-zinc-500 truncate">
                    {currentAddress.flat}, {currentAddress.street}, {currentAddress.area}
                  </div>
                </div>
              </div>

              {/* Doorstep Return Policy */}
              <div className="text-[11px] text-zinc-500 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#0C831F]" />
                <span>Blinkit 10-Minute Return & Replacement Guaranteed</span>
              </div>
            </>
          )}
        </div>

        {/* Checkout Footer */}
        {items.length > 0 && (
          <div className="bg-white p-4 border-t border-zinc-200">
            <button
              onClick={handleCheckout}
              disabled={isPlacing}
              className="w-full bg-[#0C831F] hover:bg-[#0A6B1A] disabled:bg-zinc-400 text-white py-3.5 px-4 rounded-2xl font-black text-sm flex items-center justify-between shadow-lg transition active:scale-[0.98] cursor-pointer"
            >
              <div className="text-left">
                <span className="block text-xs uppercase tracking-wider text-emerald-200">
                  Pay with UPI / Cash / Card
                </span>
                <span className="text-base font-black">₹{totalAmount}</span>
              </div>
              <div className="flex items-center gap-1 font-black text-yellow-300">
                <span>{isPlacing ? 'Placing Order...' : 'Place Order (10 Mins ⚡)'}</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
