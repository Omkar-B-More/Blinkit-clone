'use client';

import React from 'react';
import {
  X,
  Sparkles,
  Printer,
  RotateCcw,
  Zap,
  CloudRain,
  Coins,
  Warehouse,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface BlinkitInnovationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPrintStore: () => void;
}

export default function BlinkitInnovationsModal({
  isOpen,
  onClose,
  onOpenPrintStore,
}: BlinkitInnovationsModalProps) {
  if (!isOpen) return null;

  const innovations = [
    {
      icon: <Printer className="w-6 h-6 text-purple-600" />,
      tag: 'NEW 2024-2026',
      title: 'Blinkit Print Store in 10 Minutes',
      description:
        'Blinkit pioneered printing and delivering urgent documents, resumes, boarding passes, and college spiral booklets within 10 minutes in sealed, tamper-proof confidential envelopes.',
      action: {
        text: 'Try Print Store Now',
        onClick: () => {
          onClose();
          onOpenPrintStore();
        },
      },
    },
    {
      icon: <RotateCcw className="w-6 h-6 text-emerald-600" />,
      tag: 'INDUSTRY FIRST',
      title: '10-Minute Doorstep Return & Exchange',
      description:
        'Instead of waiting 3-5 days for traditional e-commerce returns, Blinkit riders now bring replacement sizes (shoes, apparel, electronics) and process doorstep exchanges within 10 minutes.',
    },
    {
      icon: <Coins className="w-6 h-6 text-amber-600" />,
      tag: 'HIGH-VALUE VAULT',
      title: '24K Gold & High-End Tech in 10 Mins',
      description:
        'Delivering MMTC-PAMP 24K pure 999.9 gold coins, Apple iPhones, and gaming consoles on festive days (Dhanteras, Diwali) with mandatory tamper-proof seals and 4-digit OTP handover.',
    },
    {
      icon: <Warehouse className="w-6 h-6 text-blue-600" />,
      tag: 'OPERATIONS',
      title: '1.5-km Micro Dark-Store Network',
      description:
        'Blinkit operates 600+ micro-fulfillment dark stores across Indian metros. Pickers complete bagging in under 120 seconds, leaving 8 minutes for the rider to reach the doorstep.',
    },
    {
      icon: <CloudRain className="w-6 h-6 text-sky-600" />,
      tag: 'DYNAMIC PRICING',
      title: 'Monsoon Surge & Weather Defense',
      description:
        'Dynamic handling fees (₹15) and waterproof protective bags automatically activate during heavy rain and waterlogging to prioritize rider safety while maintaining delivery SLAs.',
    },
    {
      icon: <Sparkles className="w-6 h-6 text-yellow-600" />,
      tag: 'AI QUICK BUNDLES',
      title: 'Recipe-to-Cart & Midnight Cravings',
      description:
        '1-click smart bundling for Indian favorites like Chai & Parle-G, Midnight Maggi Craving Kit, and Amul Pav Bhaji essentials.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative my-6 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#1C1C1C] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 p-1.5 rounded-full transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1 text-yellow-400 font-black text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4 fill-current" />
            <span>Market Intelligence & Innovation Spotlight</span>
          </div>

          <h2 className="text-2xl font-black tracking-tight text-white">
            What Blinkit is Currently Encountering & Pioneering
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            How quick commerce in India is evolving beyond groceries into instant universal commerce.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto max-h-[60vh] space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {innovations.map((item, idx) => (
              <div
                key={idx}
                className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 flex flex-col justify-between hover:border-yellow-400 transition shadow-2xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-xl bg-white border border-zinc-200 shadow-2xs">
                      {item.icon}
                    </div>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-zinc-200 text-zinc-800">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="font-black text-sm text-zinc-900 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {item.action && (
                  <button
                    onClick={item.action.onClick}
                    className="mt-3 w-full py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                  >
                    {item.action.text}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-zinc-100 border-t border-zinc-200 flex items-center justify-between text-xs text-zinc-600">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#0C831F]" />
            <span>Ready for upcoming Store Ops Dashboard Integration</span>
          </div>
          <button
            onClick={onClose}
            className="bg-[#0C831F] hover:bg-[#0A6B1A] text-white px-5 py-2 rounded-xl font-bold transition cursor-pointer"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}
