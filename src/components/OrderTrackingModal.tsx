'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Zap,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  ChevronRight,
  Package,
  Bike,
  Navigation,
  Sparkles,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Order, OrderStatus } from '@/types';

export default function OrderTrackingModal() {
  const { currentOrder, isTrackingOpen, closeTracking, setCurrentOrder } = useCart();
  const [remainingSeconds, setRemainingSeconds] = useState<number>(540); // 9 minutes default
  const [simulatedDistance, setSimulatedDistance] = useState<string>('1.4 km');
  const [riderCalled, setRiderCalled] = useState(false);

  // Poll order status from API / Redis
  useEffect(() => {
    if (!currentOrder || !isTrackingOpen) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/orders/${currentOrder.id}`);
        const data = await res.json();
        if (data.order) {
          setCurrentOrder(data.order);
          setRemainingSeconds(data.remainingSeconds);

          // Update simulated distance
          const secs = data.remainingSeconds;
          if (secs > 400) setSimulatedDistance('1.4 km');
          else if (secs > 250) setSimulatedDistance('0.9 km');
          else if (secs > 100) setSimulatedDistance('0.4 km');
          else if (secs > 20) setSimulatedDistance('120 m (turning corner)');
          else setSimulatedDistance('At your doorstep!');
        }
      } catch (e) {
        console.error('Error polling order status', e);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [currentOrder?.id, isTrackingOpen]);

  // Local second-by-second countdown ticker
  useEffect(() => {
    if (!isTrackingOpen || remainingSeconds <= 0) return;
    const timer = setInterval(() => {
      setRemainingSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [isTrackingOpen, remainingSeconds]);

  if (!isTrackingOpen || !currentOrder) return null;

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;

  const stages: { status: OrderStatus; title: string; desc: string }[] = [
    {
      status: 'placed',
      title: 'Order Placed & Confirmed',
      desc: 'Transmitted to Bellandur Dark Store #042 via Redis',
    },
    {
      status: 'packing',
      title: 'Items Being Picked & Packed',
      desc: 'Dark store picker bagging items with tamper-evident seal',
    },
    {
      status: 'rider_assigned',
      title: `Rider Assigned: ${currentOrder.rider.name}`,
      desc: `${currentOrder.rider.vehicleModel} • ${currentOrder.rider.vehicleNumber}`,
    },
    {
      status: 'out_for_delivery',
      title: 'Rider Out for Delivery ⚡',
      desc: `On the way to ${currentOrder.deliveryAddress.flat}, ${currentOrder.deliveryAddress.area}`,
    },
    {
      status: 'delivered',
      title: 'Arrived at Doorstep!',
      desc: 'Verify items and share OTP with rider',
    },
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'placed':
        return 0;
      case 'packing':
        return 1;
      case 'rider_assigned':
        return 2;
      case 'out_for_delivery':
        return 3;
      case 'delivered':
        return 4;
    }
  };

  const currentStepIdx = getStepIndex(currentOrder.status);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl relative my-6 animate-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="bg-[#0C831F] text-white p-5 relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-emerald-700/40 rounded-full blur-xl pointer-events-none" />
          <button
            onClick={closeTracking}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-1.5 rounded-full transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-1.5 text-yellow-300 font-black text-xs uppercase tracking-wider mb-1">
            <Zap className="w-4 h-4 fill-current" />
            <span>Instant Quick-Commerce Tracking</span>
          </div>

          <div className="flex items-baseline justify-between mt-2">
            <div>
              <h2 className="text-2xl font-black tracking-tight">
                {currentOrder.status === 'delivered'
                  ? 'Order Delivered!'
                  : `Arriving in ${formattedTime} mins`}
              </h2>
              <p className="text-xs text-emerald-100 font-medium mt-0.5">
                Dark Store distance: {simulatedDistance}
              </p>
            </div>
            {/* Live pulsing timer badge */}
            <div className="bg-yellow-400 text-black px-3.5 py-1.5 rounded-xl font-mono font-black text-lg tracking-wider shadow-md flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-black animate-spin" />
              <span>{formattedTime}</span>
            </div>
          </div>
        </div>

        {/* Map & Live Delivery Simulation */}
        <div className="bg-zinc-100 p-4 border-b border-zinc-200 relative">
          <div className="h-44 bg-zinc-200 rounded-2xl relative overflow-hidden border border-zinc-300 flex items-center justify-center">
            {/* Background road grid pattern */}
            <div
              className="absolute inset-0 opacity-40 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"
            />

            {/* Simulated Road Line */}
            <div className="absolute w-3/4 h-2 bg-zinc-400 rounded-full top-1/2 -translate-y-1/2 left-12">
              {/* Progress active road */}
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min(100, (currentStepIdx + 1) * 25)}%` }}
              />
            </div>

            {/* Dark Store Node */}
            <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="w-9 h-9 bg-yellow-400 border-2 border-black rounded-full flex items-center justify-center shadow-md">
                <Package className="w-4 h-4 text-black" />
              </div>
              <span className="text-[10px] font-bold text-zinc-700 bg-white/90 px-1.5 rounded mt-1 shadow-2xs">
                DarkStore #042
              </span>
            </div>

            {/* Moving Rider Scooter */}
            <div
              className="absolute top-1/2 -translate-y-1/2 transition-all duration-1000 flex flex-col items-center"
              style={{
                left: `${Math.min(76, 20 + currentStepIdx * 15)}%`,
              }}
            >
              <div className="w-10 h-10 bg-[#0C831F] border-2 border-white rounded-full flex items-center justify-center shadow-lg text-white animate-bounce">
                <Bike className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-black text-white bg-emerald-900 px-1.5 py-0.5 rounded shadow-xs mt-1">
                {currentOrder.rider.name.split(' ')[0]} ⚡
              </span>
            </div>

            {/* Destination House Node */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="w-9 h-9 bg-rose-600 border-2 border-white rounded-full flex items-center justify-center shadow-md text-white">
                <MapPin className="w-5 h-5 fill-current" />
              </div>
              <span className="text-[10px] font-bold text-zinc-700 bg-white/90 px-1.5 rounded mt-1 shadow-2xs">
                Your Doorstep
              </span>
            </div>
          </div>

          {/* Delivery Handover OTP Pill (Crucial Blinkit safety innovation!) */}
          <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0" />
              <div>
                <span className="text-xs font-bold text-amber-900 block">
                  Delivery Handover OTP
                </span>
                <span className="text-[10px] text-amber-700">
                  Share with rider only after physical handover
                </span>
              </div>
            </div>
            <div className="bg-amber-400 text-black font-mono font-black text-base px-3 py-1 rounded-lg tracking-widest border border-amber-500 shadow-2xs">
              {currentOrder.deliveryOtp}
            </div>
          </div>
        </div>

        {/* Rider Profile Card */}
        <div className="p-4 bg-white border-b border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={currentOrder.rider.photo}
              alt={currentOrder.rider.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-[#0C831F]"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-black text-zinc-900">
                  {currentOrder.rider.name}
                </h4>
                <span className="text-[10px] bg-emerald-100 text-[#0C831F] font-black px-1.5 py-0.5 rounded">
                  ★ {currentOrder.rider.rating}
                </span>
              </div>
              <p className="text-xs text-zinc-500 font-medium">
                {currentOrder.rider.vehicleModel} • {currentOrder.rider.vehicleNumber}
              </p>
              <p className="text-[10px] text-zinc-400">
                Delivered {currentOrder.rider.totalDeliveries}+ orders on Blinkit
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setRiderCalled(true);
              setTimeout(() => setRiderCalled(false), 4000);
            }}
            className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#0C831F] border border-emerald-300 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>{riderCalled ? 'Calling...' : 'Call Rider'}</span>
          </button>
        </div>

        {/* Step-by-Step Delivery Progress */}
        <div className="p-4 space-y-3 bg-zinc-50 max-h-60 overflow-y-auto">
          <div className="text-xs font-black text-zinc-900 uppercase tracking-wider mb-2">
            Order Status & Dark Store Dispatch
          </div>
          {stages.map((st, idx) => {
            const isDone = idx < currentStepIdx;
            const isCurrent = idx === currentStepIdx;

            return (
              <div key={st.status} className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0">
                  {isDone ? (
                    <div className="w-5 h-5 rounded-full bg-[#0C831F] text-white flex items-center justify-center">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                  ) : isCurrent ? (
                    <div className="w-5 h-5 rounded-full bg-yellow-400 border-2 border-black flex items-center justify-center animate-pulse">
                      <div className="w-2 h-2 rounded-full bg-black" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-zinc-200 border border-zinc-300" />
                  )}
                </div>
                <div>
                  <h5
                    className={`text-xs font-bold ${
                      isCurrent
                        ? 'text-zinc-900 font-black'
                        : isDone
                        ? 'text-zinc-700'
                        : 'text-zinc-400'
                    }`}
                  >
                    {st.title}
                  </h5>
                  <p className="text-[11px] text-zinc-500">{st.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Details Accordion Footer */}
        <div className="p-4 bg-white border-t border-zinc-200 flex items-center justify-between text-xs">
          <div>
            <span className="text-zinc-400 block text-[10px]">Order ID: {currentOrder.id}</span>
            <span className="font-bold text-zinc-800">
              {currentOrder.items.length} items • ₹{currentOrder.totalAmount}
            </span>
          </div>
          <button
            onClick={closeTracking}
            className="bg-[#0C831F] text-white px-5 py-2 rounded-xl font-bold hover:bg-[#0A6B1A] transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
