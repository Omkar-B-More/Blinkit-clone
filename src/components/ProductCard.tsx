'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Plus, Minus, Zap, Eye, Bell, Check, Clock } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { items, addToCart, removeFromCart, openProductDetail } = useCart();
  const [isNotified, setIsNotified] = useState(false);

  const cartItem = items.find((i) => i.product.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleNotifyMe = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsNotified(true);
    setTimeout(() => setIsNotified(false), 3000);
  };

  return (
    <div className="group relative bg-white border border-zinc-200/90 rounded-2xl p-3 flex flex-col justify-between hover:shadow-lg transition-all duration-200 hover:border-yellow-400">
      {/* Top Media Section */}
      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-zinc-50 flex items-center justify-center mb-3">
        {/* Out of Stock Overlay / Badge */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/45 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center p-2 text-center">
            <span className="bg-rose-600 text-white text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm mb-1">
              Out of Stock
            </span>
            <span className="text-[10px] text-zinc-100 font-medium">
              Refilling in Dark Store soon
            </span>
          </div>
        )}

        {/* Product Image */}
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
            !product.inStock ? 'grayscale opacity-75' : ''
          }`}
          loading="lazy"
        />

        {/* 10 Min Delivery Tag */}
        <div className="absolute top-2 left-2 z-10 bg-white/95 backdrop-blur-xs text-zinc-800 text-[10px] font-extrabold px-1.5 py-0.5 rounded-md flex items-center gap-0.5 shadow-xs border border-zinc-200">
          <Clock className="w-2.5 h-2.5 text-[#0C831F]" />
          <span>10 MINS</span>
        </div>

        {/* Discount Badge */}
        {product.discountPercentage > 0 && product.inStock && (
          <div className="absolute top-2 right-2 z-10 bg-blue-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md shadow-xs">
            {product.discountPercentage}% OFF
          </div>
        )}

        {/* Quick Explore Hover Button */}
        <button
          onClick={() => openProductDetail(product)}
          className="absolute bottom-2 right-2 z-10 bg-white/90 hover:bg-white text-zinc-700 p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer hover:text-black"
          title="Explore product specifications"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>

      {/* Product Details */}
      <div className="flex-1 flex flex-col">
        {/* Weight / Unit Badge */}
        <div className="flex items-center justify-between gap-1 mb-1">
          <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wide bg-zinc-100 px-2 py-0.5 rounded">
            {product.weight}
          </span>
          <span className="text-[10px] text-zinc-400 font-medium">
            {product.brand}
          </span>
        </div>

        {/* Product Name */}
        <h3
          onClick={() => openProductDetail(product)}
          className="text-xs font-bold text-zinc-900 line-clamp-2 min-h-[32px] hover:text-[#0C831F] cursor-pointer mb-2 transition-colors"
        >
          {product.name}
        </h3>

        {/* Price & Action Row */}
        <div className="mt-auto pt-2 border-t border-zinc-100 flex items-center justify-between gap-2">
          {/* Rate & MRP */}
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-black text-zinc-900">
                ₹{product.price}
              </span>
              {product.mrp > product.price && (
                <span className="text-[11px] text-zinc-400 line-through">
                  ₹{product.mrp}
                </span>
              )}
            </div>
          </div>

          {/* Action: Out of stock vs ADD vs Quantity Selector */}
          {!product.inStock ? (
            <button
              onClick={handleNotifyMe}
              className={`text-[11px] font-bold px-2 py-1.5 rounded-lg border transition flex items-center gap-1 cursor-pointer ${
                isNotified
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-600 border-zinc-300'
              }`}
            >
              {isNotified ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span>Notified</span>
                </>
              ) : (
                <>
                  <Bell className="w-3 h-3 text-zinc-500" />
                  <span>Notify</span>
                </>
              )}
            </button>
          ) : quantity > 0 ? (
            <div className="flex items-center bg-[#0C831F] text-white rounded-lg px-1.5 py-1 shadow-xs">
              <button
                onClick={() => removeFromCart(product.id)}
                className="p-0.5 hover:bg-emerald-800 rounded transition cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-black px-2 min-w-[20px] text-center">
                {quantity}
              </span>
              <button
                onClick={() => addToCart(product)}
                className="p-0.5 hover:bg-emerald-800 rounded transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => addToCart(product)}
              className="bg-emerald-50 hover:bg-[#0C831F] text-[#0C831F] hover:text-white border border-[#0C831F] text-xs font-black px-3.5 py-1.5 rounded-lg transition-all shadow-2xs active:scale-95 cursor-pointer uppercase tracking-wider"
            >
              ADD
            </button>
          )}
        </div>

        {/* Explicit Distinct Explore Button (As requested by user: "for each diffrent product we have to create a diffrent button to expore that with proper rate and weight of product") */}
        <button
          onClick={() => openProductDetail(product)}
          className="mt-2.5 w-full py-1 text-[11px] font-bold text-zinc-600 hover:text-zinc-900 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-lg flex items-center justify-center gap-1 transition cursor-pointer"
        >
          <Eye className="w-3 h-3 text-zinc-500" />
          <span>Explore Details ({product.weight})</span>
        </button>
      </div>
    </div>
  );
}
