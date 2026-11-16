'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Database,
  RefreshCw,
  Server,
  Layers,
  Key,
  CheckCircle2,
  Terminal,
  Activity,
} from 'lucide-react';

interface RedisInspectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RedisInspector({ isOpen, onClose }: RedisInspectorProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/redis-status');
      const json = await res.json();
      setData(json);
      if (json.keys?.length > 0 && !selectedKey) {
        setSelectedKey(json.keys[0]);
      }
    } catch (e) {
      console.error('Failed to inspect Redis', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#121212] text-zinc-100 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl relative my-6 border border-zinc-800 animate-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="bg-zinc-900/80 p-5 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-950 border border-red-800 flex items-center justify-center text-red-500">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-mono font-bold text-base text-white">
                  Redis Database Inspector
                </h3>
                <span className="bg-emerald-950 text-emerald-400 text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-800 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  ACTIVE
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Storing User phone numbers, order count, cart states & dark store inventory
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchStatus}
              disabled={loading}
              className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition cursor-pointer"
              title="Refresh Redis Keys"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Engine Status Banner */}
        <div className="bg-zinc-950 px-5 py-3 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-emerald-400" />
            <span className="text-zinc-400">Engine:</span>
            <span className="text-white font-bold">{data?.engine || 'Redis Local Engine'}</span>
          </div>
          <div className="flex items-center gap-4 text-zinc-400">
            <div>
              Total Keys: <span className="text-yellow-400 font-bold">{data?.totalKeys || 0}</span>
            </div>
            <div>
              Users: <span className="text-cyan-400 font-bold">{data?.counts?.users || 0}</span>
            </div>
            <div>
              Orders: <span className="text-emerald-400 font-bold">{data?.counts?.orders || 0}</span>
            </div>
          </div>
        </div>

        {/* Two Column Key-Value Explorer */}
        <div className="grid grid-cols-1 md:grid-cols-3 h-96">
          {/* Key list */}
          <div className="border-r border-zinc-800 p-3 overflow-y-auto bg-zinc-950/50 space-y-1">
            <div className="text-[11px] font-mono font-bold text-zinc-500 uppercase px-2 mb-2">
              Keys in Redis ({data?.keys?.length || 0})
            </div>
            {data?.keys?.length === 0 ? (
              <div className="text-xs text-zinc-600 p-3 font-mono">No keys yet</div>
            ) : (
              data?.keys?.map((k: string) => {
                const isSelected = selectedKey === k;
                return (
                  <button
                    key={k}
                    onClick={() => setSelectedKey(k)}
                    className={`w-full text-left font-mono text-xs px-2.5 py-1.5 rounded-lg truncate transition block cursor-pointer ${
                      isSelected
                        ? 'bg-red-950/80 text-red-300 border border-red-800/60'
                        : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                    }`}
                  >
                    {k}
                  </button>
                );
              })
            )}
          </div>

          {/* Value Inspector */}
          <div className="md:col-span-2 p-4 overflow-y-auto bg-[#0a0a0a] font-mono text-xs">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-zinc-800">
              <span className="text-zinc-500 text-[11px]">Selected Key:</span>
              <span className="text-yellow-400 font-bold">{selectedKey || 'None'}</span>
            </div>

            {selectedKey && data?.samples?.[selectedKey] ? (
              <pre className="text-emerald-400 whitespace-pre-wrap break-all leading-relaxed bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                {JSON.stringify(data.samples[selectedKey], null, 2)}
              </pre>
            ) : (
              <div className="text-zinc-600 p-4 text-center">
                Select a key from the left list to view data structure stored in Redis
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-zinc-900/60 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400 font-mono">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-zinc-500" />
            <span>Optional Docker command: <code>docker run -d -p 6379:6379 redis:alpine</code></span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
