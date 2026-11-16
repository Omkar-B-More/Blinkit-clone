'use client';

import React, { useState } from 'react';
import {
  X,
  Printer,
  Upload,
  FileText,
  CheckCircle2,
  Lock,
  Zap,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types';

interface PrintStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrintStoreModal({ isOpen, onClose }: PrintStoreModalProps) {
  const { addToCart, openCartDrawer } = useCart();
  const [fileName, setFileName] = useState('Urgent_Resume_Contract.pdf');
  const [pages, setPages] = useState(4);
  const [isColor, setIsColor] = useState(false);
  const [isDoubleSided, setIsDoubleSided] = useState(true);
  const [spiralBinding, setSpiralBinding] = useState(false);
  const [copies, setCopies] = useState(1);

  if (!isOpen) return null;

  // Rate calculation:
  // B&W: ₹3 per page
  // Color: ₹10 per page
  // Spiral binding: ₹40
  const ratePerPage = isColor ? 10 : 3;
  const printTotal = (pages * ratePerPage + (spiralBinding ? 40 : 0)) * copies;

  const handleAddPrintToCart = () => {
    const printProduct: Product = {
      id: `print_${Date.now()}`,
      name: `Blinkit Print: ${fileName} (${pages} pgs, ${isColor ? 'Color' : 'B&W'})`,
      category: 'print',
      weight: `${pages} Printed Sheets in Tamper-Proof Envelope`,
      price: printTotal,
      mrp: printTotal + 20,
      discountPercentage: 15,
      inStock: true,
      stockCount: 999,
      image: isColor
        ? 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=500&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=500&auto=format&fit=crop&q=80',
      description: `Custom 10-minute document printout. ${pages} pages (${isColor ? 'Vibrant Color 100 GSM' : 'Laser Sharp B&W 75 GSM'}). ${spiralBinding ? 'Includes Spiral Wire Binding.' : 'Unbound.'} Delivered in confidential sealed security envelope.`,
      brand: 'Blinkit Print Hub',
      shelfLife: 'Delivered in 10 mins',
      isVeg: true,
      rating: 4.9,
      reviewsCount: 1500,
      keyFeatures: [
        'Tamper-evident sealed security packaging',
        'Automatic secure digital file shredding post-print',
        'Laser 1200 DPI crisp output',
      ],
      unitType: 'Document Folder',
      isPrintItem: true,
    };

    addToCart(printProduct);
    onClose();
    openCartDrawer();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative my-6 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-800 to-indigo-900 text-white p-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-1.5 rounded-full transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <Printer className="w-6 h-6 text-yellow-300" />
            <h2 className="font-black text-xl">Blinkit Print Store</h2>
            <span className="bg-yellow-400 text-black text-[10px] font-black px-2 py-0.5 rounded-md">
              10 MINS ⚡
            </span>
          </div>
          <p className="text-xs text-purple-200">
            Real Blinkit innovation: Urgent document printouts delivered to your doorstep in confidential tamper-proof packaging.
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          {/* Simulated File Upload Box */}
          <div className="border-2 border-dashed border-purple-200 rounded-2xl p-4 bg-purple-50/50 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-zinc-900 truncate">{fileName}</div>
              <div className="text-[11px] text-zinc-500">
                PDF Ready • Encrypted transfer to Dark Store Printer
              </div>
            </div>
            <label className="text-xs font-bold text-purple-700 hover:text-purple-800 bg-white px-2.5 py-1.5 rounded-lg border border-purple-200 cursor-pointer shadow-2xs">
              Change
              <input
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.jpg,.png"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setFileName(e.target.files[0].name);
                  }
                }}
              />
            </label>
          </div>

          {/* Number of Pages */}
          <div className="flex items-center justify-between bg-zinc-50 p-3 rounded-xl border border-zinc-200">
            <div>
              <span className="text-xs font-bold text-zinc-800 block">Number of Pages</span>
              <span className="text-[10px] text-zinc-400">Total sheet count in PDF</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPages((p) => Math.max(1, p - 1))}
                className="w-7 h-7 rounded-lg bg-white border border-zinc-300 font-black text-sm text-zinc-700 hover:bg-zinc-100 cursor-pointer"
              >
                -
              </button>
              <span className="text-sm font-black w-6 text-center">{pages}</span>
              <button
                type="button"
                onClick={() => setPages((p) => p + 1)}
                className="w-7 h-7 rounded-lg bg-white border border-zinc-300 font-black text-sm text-zinc-700 hover:bg-zinc-100 cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {/* Print Quality (B&W vs Color) */}
          <div>
            <label className="text-xs font-bold text-zinc-800 block mb-1.5">
              Print Mode
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsColor(false)}
                className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                  !isColor
                    ? 'border-purple-600 bg-purple-50 text-purple-900 ring-2 ring-purple-600'
                    : 'border-zinc-200 bg-zinc-50 text-zinc-600'
                }`}
              >
                <div className="text-xs font-bold">Black & White</div>
                <div className="text-[11px] text-zinc-500">₹3 / page • 75 GSM</div>
              </button>

              <button
                type="button"
                onClick={() => setIsColor(true)}
                className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                  isColor
                    ? 'border-purple-600 bg-purple-50 text-purple-900 ring-2 ring-purple-600'
                    : 'border-zinc-200 bg-zinc-50 text-zinc-600'
                }`}
              >
                <div className="text-xs font-bold text-purple-900">HD Color</div>
                <div className="text-[11px] text-zinc-500">₹10 / page • 100 GSM</div>
              </button>
            </div>
          </div>

          {/* Binding Option */}
          <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-xl border border-zinc-200">
            <div>
              <span className="text-xs font-bold text-zinc-800 block">
                Add Spiral Binding (+₹40)
              </span>
              <span className="text-[10px] text-zinc-400">
                Includes clear front sheet and dark backing board
              </span>
            </div>
            <input
              type="checkbox"
              checked={spiralBinding}
              onChange={(e) => setSpiralBinding(e.target.checked)}
              className="w-4 h-4 text-purple-600 rounded cursor-pointer"
            />
          </div>

          {/* Privacy & Confidential Guarantee */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 text-[11px] text-emerald-800 flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              <strong>100% Confidential:</strong> Files are auto-deleted from dark store servers immediately upon printing. Handed over in tamper-evident sealed envelopes.
            </span>
          </div>

          {/* Pricing & Add to Cart */}
          <div className="pt-2 flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold text-zinc-400 uppercase block">
                Print Total
              </span>
              <span className="text-xl font-black text-zinc-900">₹{printTotal}</span>
            </div>

            <button
              onClick={handleAddPrintToCart}
              className="bg-purple-700 hover:bg-purple-800 text-white font-bold px-6 py-2.5 rounded-xl text-sm shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <Zap className="w-4 h-4 text-yellow-300 fill-current" />
              <span>Add to Cart (10m Delivery)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
