import { NextResponse } from 'next/server';
import { PRODUCTS, CATEGORIES } from '@/data/products';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const search = searchParams.get('q')?.toLowerCase();

  let filtered = [...PRODUCTS];

  if (category && category !== 'all') {
    filtered = filtered.filter((p) => p.category === category);
  }

  if (search) {
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(search) ||
        p.category.toLowerCase().includes(search) ||
        p.brand.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search)
    );
  }

  return NextResponse.json({
    products: filtered,
    categories: CATEGORIES,
    total: filtered.length,
  });
}
