import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const filter = url.searchParams.get('filter') || '*';
    const keys = await redis.keys(filter);
    const userKeys = keys.filter((k) => k.startsWith('user:'));
    const orderKeys = keys.filter((k) => k.startsWith('order:'));
    const phoneKeys = keys.filter((k) => k.startsWith('phone:'));

    const status = redis.getConnectionStatus();

    // Sample data inspection
    const sampleKeys = keys.slice(0, 20);
    const sampleData: Record<string, any> = {};

    for (const key of sampleKeys) {
      if (key.startsWith('user:') && !key.endsWith(':orders')) {
        sampleData[key] = await redis.hgetall(key);
      } else if (key.startsWith('order:')) {
        const raw = await redis.get(key);
        sampleData[key] = raw ? JSON.parse(raw) : null;
      } else if (key.endsWith(':orders') || key.startsWith('store:')) {
        sampleData[key] = await redis.lrange(key, 0, 10);
      } else {
        sampleData[key] = await redis.get(key);
      }
    }

    return NextResponse.json({
      engine: status.type,
      info: status.info,
      isRealRedis: redis.isRealRedis,
      totalKeys: keys.length,
      counts: {
        users: userKeys.filter((k) => !k.endsWith(':orders')).length,
        orders: orderKeys.length,
        phoneIndex: phoneKeys.length,
      },
      keys: keys,
      samples: sampleData,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to inspect Redis' },
      { status: 500 }
    );
  }
}
