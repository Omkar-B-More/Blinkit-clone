'use client';

import React, { useState } from 'react';
import {
  X,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  User,
  Sparkles,
  Database,
  LogOut,
  MapPin,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AuthModal() {
  const {
    user,
    isAuthenticated,
    isAuthModalOpen,
    closeAuthModal,
    loginWithPhone,
    logout,
  } = useAuth();

  const [step, setStep] = useState<'phone' | 'otp' | 'profile'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [userName, setUserName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length < 10) {
      setErrorMsg('Please enter a valid 10-digit Indian mobile number');
      return;
    }
    setErrorMsg('');
    setStep('otp');
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val.slice(-1);
    const updated = [...otp];
    updated[index] = val;
    setOtp(updated);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    if (enteredOtp.length < 6) {
      setErrorMsg('Please enter all 6 digits of the OTP');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const fullPhone = `+91 ${phoneNumber}`;
      const success = await loginWithPhone(fullPhone, userName);
      if (success) {
        closeAuthModal();
      } else {
        setErrorMsg('Authentication failed with Redis backend');
      }
    } catch {
      setErrorMsg('Failed to connect to authentication server');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoFill = () => {
    setPhoneNumber('9876543210');
    setUserName('Omkar More');
    setOtp(['4', '8', '2', '9', '1', '0']);
    setStep('otp');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#F8CB46] p-5 text-black relative">
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 bg-black/10 hover:bg-black/20 text-black p-1.5 rounded-full transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="font-black text-2xl tracking-tight">blinkit</span>
            <span className="bg-black text-white text-[10px] font-black uppercase px-2 py-0.5 rounded">
              Clerk Auth
            </span>
          </div>
          <p className="text-xs text-black/80 font-semibold">
            India's Last Minute App • Phone Authentication & Redis Profile
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {isAuthenticated && user ? (
            /* Logged in state view */
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-2xl border border-zinc-200">
                <div className="w-12 h-12 rounded-full bg-[#0C831F] text-white flex items-center justify-center font-black text-lg">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-black text-base text-zinc-900">{user.name}</h3>
                  <p className="text-xs text-zinc-500 font-medium">{user.phone}</p>
                </div>
              </div>

              {/* Redis Stored Info Card */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                  <Database className="w-4 h-4 text-emerald-700" />
                  <span>Profile Stored in Redis (Hash key `user:{user.id}`)</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-zinc-700 pt-1">
                  <div className="bg-white p-2 rounded-lg border border-emerald-100">
                    <span className="text-[10px] text-zinc-400 block font-bold">TOTAL ORDERS</span>
                    <span className="text-base font-black text-zinc-900">{user.orderCount}</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-emerald-100">
                    <span className="text-[10px] text-zinc-400 block font-bold">TOTAL SPENT</span>
                    <span className="text-base font-black text-zinc-900">₹{user.totalSpent}</span>
                  </div>
                </div>
                <div className="text-[11px] text-emerald-800 flex items-center gap-1 pt-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                  <span>
                    Default: {user.addresses[0]?.flat}, {user.addresses[0]?.area}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    logout();
                    setStep('phone');
                  }}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-zinc-300 text-xs font-bold text-zinc-700 hover:bg-zinc-50 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Switch Phone / Logout</span>
                </button>
                <button
                  onClick={closeAuthModal}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[#0C831F] text-xs font-bold text-white hover:bg-[#0A6B1A] transition cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          ) : step === 'phone' ? (
            /* Step 1: Phone input */
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-800 block mb-1.5">
                  Enter your Indian Mobile Number
                </label>
                <div className="flex rounded-xl border border-zinc-300 overflow-hidden focus-within:ring-2 focus-within:ring-[#0C831F] focus-within:border-transparent">
                  <span className="bg-zinc-100 px-3 py-2.5 text-xs font-bold text-zinc-700 border-r border-zinc-200 flex items-center gap-1">
                    <span>🇮🇳</span>
                    <span>+91</span>
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="98765 43210"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    className="flex-1 px-3 py-2.5 text-sm font-semibold tracking-wider text-zinc-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-800 block mb-1.5">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter your name (e.g. Omkar More)"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0C831F]"
                />
              </div>

              {errorMsg && (
                <div className="text-xs text-rose-600 bg-rose-50 p-2 rounded-lg">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-[#0C831F] hover:bg-[#0A6B1A] text-white py-3 rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continue with Phone OTP</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Demo 1-Click Button */}
              <div className="pt-2 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={handleDemoFill}
                  className="w-full py-2 bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 rounded-xl text-xs font-bold text-amber-900 flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>1-Click Quick Demo Login (+91 98765 43210)</span>
                </button>
              </div>

              <div className="text-[10px] text-zinc-400 text-center flex items-center justify-center gap-1">
                <Lock className="w-3 h-3" />
                <span>Secured via Clerk Phone Auth & Redis Session</span>
              </div>
            </form>
          ) : (
            /* Step 2: OTP Verification */
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center">
                <h4 className="text-sm font-black text-zinc-900">
                  Verification Code Sent
                </h4>
                <p className="text-xs text-zinc-500 mt-0.5">
                  We've sent a 6-digit OTP to <strong>+91 {phoneNumber}</strong>
                </p>
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="text-xs text-[#0C831F] font-bold mt-1 hover:underline cursor-pointer"
                >
                  Change phone number
                </button>
              </div>

              {/* 6 Digit Inputs */}
              <div className="flex justify-center gap-2 py-2">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    className="w-10 h-12 text-center text-lg font-black bg-zinc-50 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0C831F]"
                  />
                ))}
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 text-center text-xs text-amber-800">
                <span>Demo Clerk OTP: <strong>482910</strong> (Ready to verify)</span>
              </div>

              {errorMsg && (
                <div className="text-xs text-rose-600 bg-rose-50 p-2 rounded-lg">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#0C831F] hover:bg-[#0A6B1A] disabled:bg-zinc-400 text-white py-3 rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{isSubmitting ? 'Verifying with Redis...' : 'Verify & Login'}</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
