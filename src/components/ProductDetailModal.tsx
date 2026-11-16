'use client';

import React from 'react';
import {
  X,
  Zap,
  ShieldCheck,
  RotateCcw,
  Star,
  CheckCircle2,
  Clock,
  Package,
  Plus,
  Minus,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function ProductDetailModal() {
  const {
    selectedProductForDetail: product,
    closeProductDetail,
    items,
    addToCart,
    removeFromCart,
  } = useCart();

  if (!product) return null;

  const cartItem = items.find((i) => i.product.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;
  const savings = product.mrp - product.price;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={closeProductDetail}
          className="absolute top-4 right-4 z-20 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 p-2 rounded-full transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Product Image & Badges */}
          <div className="p-6 bg-zinc-50 flex flex-col items-center justify-center relative border-b md:border-b-0 md:border-r border-zinc-100">
            {/* Delivery Tag */}
            <div className="absolute top-4 left-4 bg-yellow-400 text-black text-xs font-black px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-xs">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>10 MIN DELIVERY</span>
            </div>

            {/* Out of Stock Overlay */}
            {!product.inStock && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-xs z-10 flex flex-col items-center justify-center p-4 text-center">
                <span className="bg-rose-600 text-white text-xs font-black uppercase px-3 py-1.5 rounded-md shadow-md mb-2">
                  Currently Out of Stock
                </span>
                <span className="text-xs text-white">
                  Restocking at Sector 29 Dark Store in 45 mins
                </span>
              </div>
            )}

            <img
              src={product.image}
              alt={product.name}
              className="w-full max-h-72 object-contain rounded-2xl drop-shadow-md"
            />

            <div className="mt-4 flex items-center gap-2">
              <div className="flex items-center gap-1 text-xs font-bold bg-white border border-zinc-200 px-2.5 py-1 rounded-full text-zinc-700 shadow-2xs">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>{product.rating}</span>
                <span className="text-zinc-400">({product.reviewsCount} reviews)</span>
              </div>
              {product.isVeg && (
                <div className="flex items-center gap-1 text-xs font-bold bg-emerald-50 border border-emerald-300 text-emerald-800 px-2 py-1 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  <span>100% Veg</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Specifications & Rate / Weight */}
          <div className="p-6 flex flex-col justify-between">
            <div>
              {/* Brand & Category */}
              <div className="flex items-center justify-between text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">
                <span>{product.brand}</span>
                <span className="bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded">
                  {product.category}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-lg font-black text-zinc-900 leading-snug mb-2">
                {product.name}
              </h2>

              {/* Weight Highlight */}
              <div className="inline-flex items-center gap-1.5 bg-yellow-50 border border-yellow-200 text-yellow-900 text-xs font-black px-2.5 py-1 rounded-md mb-3">
                <Package className="w-3.5 h-3.5" />
                <span>Net Weight / Volume: {product.weight}</span>
              </div>

              {/* Rate / Pricing Block */}
              <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-3 mb-4">
                <div className="text-[11px] font-bold text-zinc-500 uppercase">
                  Current Rate & Offer
                </div>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl font-black text-zinc-900">
                    ₹{product.price}
                  </span>
                  {product.mrp > product.price && (
                    <span className="text-sm font-semibold text-zinc-400 line-through">
                      MRP ₹{product.mrp}
                    </span>
                  )}
                  {savings > 0 && (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      Save ₹{savings} ({product.discountPercentage}% OFF)
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-zinc-500 mt-1">
                  (Inclusive of all taxes) • Best market price guaranteed
                </p>
              </div>

              {/* Description */}
              <p className="text-xs text-zinc-600 leading-relaxed mb-4">
                {product.description}
              </p>

              {/* Key Highlights */}
              <div className="space-y-2 mb-4">
                <div className="text-xs font-bold text-zinc-800">Key Highlights:</div>
                <ul className="text-xs text-zinc-600 space-y-1">
                  {product.keyFeatures?.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                  <li className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Shelf Life: {product.shelfLife}</span>
                  </li>
                </ul>
              </div>

              {/* Dark Store Inventory info */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 mb-4 text-xs text-emerald-900 flex items-center justify-between">
                <div>
                  <span className="font-bold">Sector 29 Dark Store Inventory:</span>
                  <p className="text-[11px] text-emerald-700">
                    {product.inStock
                      ? `🟢 In Stock (${product.stockCount} units available for instant dispatch)`
                      : '🔴 Out of Stock in this dark store cluster'}
                  </p>
                </div>
                <RotateCcw className="w-4 h-4 text-emerald-700" />
              </div>

              {/* Blinkit Doorstep Exchange Guarantee (Real Blinkit 2024-2026 Innovation!) */}
              <div className="text-[11px] text-zinc-500 flex items-center gap-1.5 mb-4">
                <ShieldCheck className="w-4 h-4 text-[#0C831F]" />
                <span>10-Minute Doorstep Return / Exchange Available</span>
              </div>
            </div>

            {/* Bottom Add to Cart Bar */}
            <div className="pt-3 border-t border-zinc-200 flex items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold text-zinc-400 block">Total Price</span>
                <span className="text-xl font-black text-zinc-900">
                  ₹{product.price * (quantity > 0 ? quantity : 1)}
                </span>
              </div>

              {!product.inStock ? (
                <button
                  disabled
                  className="bg-zinc-200 text-zinc-500 font-bold px-6 py-2.5 rounded-xl text-sm cursor-not-allowed"
                >
                  Unavailable at Dark Store
                </button>
              ) : quantity > 0 ? (
                <div className="flex items-center bg-[#0C831F] text-white rounded-xl px-3 py-2 shadow-md">
                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="p-1 hover:bg-emerald-800 rounded-lg cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-black px-4">{quantity}</span>
                  <button
                    onClick={() => addToCart(product)}
                    className="p-1 hover:bg-emerald-800 rounded-lg cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => addToCart(product)}
                  className="bg-[#0C831F] hover:bg-[#0A6B1A] text-white font-black px-8 py-2.5 rounded-xl text-sm shadow-md transition active:scale-95 cursor-pointer uppercase tracking-wider"
                >
                  Add to Cart
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
