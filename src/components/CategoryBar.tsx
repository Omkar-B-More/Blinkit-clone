'use client';

import React from 'react';
import { CATEGORIES } from '@/data/products';

interface CategoryBarProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export default function CategoryBar({
  selectedCategory,
  onSelectCategory,
}: CategoryBarProps) {
  return (
    <div className="bg-white border-b border-zinc-200 sticky top-[98px] z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 py-2.5 overflow-x-auto scrollbar-none flex items-center gap-2">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-[#0C831F] text-white shadow-xs'
                  : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
              }`}
            >
              <span className="text-sm">{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
