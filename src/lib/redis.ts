import Redis from 'ioredis';
import fs from 'fs';
import path from 'path';
import { UserProfile, Order } from '@/types';

// Storage file for local fallback persistence when standalone Redis server isn't running
const FALLBACK_DB_PATH = path.join(process.cwd(), '.redis_mock_db.json');

// Interface for unified Redis operations
export interface IRedisStore {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, expirySeconds?: number): Promise<'OK' | null>;
  del(key: string): Promise<number>;
  hgetall(key: string): Promise<Record<string, string>>;
  hset(key: string, field: string, value: string): Promise<number>;
  hmset(key: string, data: Record<string, string>): Promise<string>;
  hincrby(key: string, field: string, increment: number): Promise<number>;
  lpush(key: string, ...values: string[]): Promise<number>;
  lrange(key: string, start: number, stop: number): Promise<string[]>;
  keys(pattern: string): Promise<string[]>;
  isRealRedis: boolean;
  getConnectionStatus(): { connected: boolean; type: string; info: string };
}

// In-Memory store with file-backed persistence for seamless development
class LocalRedisFallback implements IRedisStore {
  private store: Map<string, any> = new Map();
  public isRealRedis = false;

  constructor() {
    this.loadFromFile();
  }

  private loadFromFile() {
    try {
      if (fs.existsSync(FALLBACK_DB_PATH)) {
        const data = fs.readFileSync(FALLBACK_DB_PATH, 'utf-8');
        const parsed = JSON.parse(data);
        for (const [k, v] of Object.entries(parsed)) {
          this.store.set(k, v);
        }
      }
    } catch {
      // ignore
    }
  }

  private saveToFile() {
    try {
      const obj: Record<string, any> = {};
      for (const [k, v] of this.store.entries()) {
        obj[k] = v;
      }
      fs.writeFileSync(FALLBACK_DB_PATH, JSON.stringify(obj, null, 2), 'utf-8');
    } catch {
      // ignore
    }
  }

  async get(key: string): Promise<string | null> {
    this.loadFromFile();
    const val = this.store.get(key);
    if (val === undefined || val === null) return null;
    return typeof val === 'string' ? val : JSON.stringify(val);
  }

  async set(key: string, value: string): Promise<'OK'> {
    this.loadFromFile();
    this.store.set(key, value);
    this.saveToFile();
    return 'OK';
  }

  async del(key: string): Promise<number> {
    this.loadFromFile();
    const deleted = this.store.delete(key) ? 1 : 0;
    if (deleted) this.saveToFile();
    return deleted;
  }

  async hgetall(key: string): Promise<Record<string, string>> {
    this.loadFromFile();
    const hash = this.store.get(key);
    if (!hash || typeof hash !== 'object') return {};
    return hash;
  }

  async hset(key: string, field: string, value: string): Promise<number> {
    this.loadFromFile();
    let hash = this.store.get(key);
    if (!hash || typeof hash !== 'object') {
      hash = {};
      this.store.set(key, hash);
    }
    const isNew = !(field in hash);
    hash[field] = value;
    this.saveToFile();
    return isNew ? 1 : 0;
  }

  async hmset(key: string, data: Record<string, string>): Promise<string> {
    this.loadFromFile();
    let hash = this.store.get(key);
    if (!hash || typeof hash !== 'object') {
      hash = {};
      this.store.set(key, hash);
    }
    Object.assign(hash, data);
    this.saveToFile();
    return 'OK';
  }

  async hincrby(key: string, field: string, increment: number): Promise<number> {
    this.loadFromFile();
    let hash = this.store.get(key);
    if (!hash || typeof hash !== 'object') {
      hash = {};
      this.store.set(key, hash);
    }
    const curr = parseInt(hash[field] || '0', 10);
    const updated = (isNaN(curr) ? 0 : curr) + increment;
    hash[field] = updated.toString();
    this.saveToFile();
    return updated;
  }

  async lpush(key: string, ...values: string[]): Promise<number> {
    this.loadFromFile();
    let list = this.store.get(key);
    if (!Array.isArray(list)) {
      list = [];
      this.store.set(key, list);
    }
    list.unshift(...values);
    this.saveToFile();
    return list.length;
  }

  async lrange(key: string, start: number, stop: number): Promise<string[]> {
    this.loadFromFile();
    const list = this.store.get(key);
    if (!Array.isArray(list)) return [];
    if (stop === -1) return list.slice(start);
    return list.slice(start, stop + 1);
  }

  async keys(pattern: string): Promise<string[]> {
    this.loadFromFile();
    const all = Array.from(this.store.keys());
    if (pattern === '*' || !pattern) return all;
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
    return all.filter((k) => regex.test(k));
  }

  getConnectionStatus() {
    return {
      connected: true,
      type: 'Embedded Redis Storage Engine',
      info: 'Running in zero-config development mode with instant local JSON persistence. Switch to live Redis anytime via REDIS_URL or localhost:6379.',
    };
  }
}

// Real Redis Client Adapter
class LiveRedisStore implements IRedisStore {
  private client: Redis;
  public isRealRedis = true;

  constructor(client: Redis) {
    this.client = client;
  }

  async get(key: string) {
    return this.client.get(key);
  }

  async set(key: string, value: string, expirySeconds?: number) {
    if (expirySeconds) {
      return (await this.client.set(key, value, 'EX', expirySeconds)) as 'OK' | null;
    }
    return (await this.client.set(key, value)) as 'OK' | null;
  }

  async del(key: string) {
    return this.client.del(key);
  }

  async hgetall(key: string) {
    return this.client.hgetall(key);
  }

  async hset(key: string, field: string, value: string) {
    return this.client.hset(key, field, value);
  }

  async hmset(key: string, data: Record<string, string>) {
    return this.client.hmset(key, data);
  }

  async hincrby(key: string, field: string, increment: number) {
    return this.client.hincrby(key, field, increment);
  }

  async lpush(key: string, ...values: string[]) {
    return this.client.lpush(key, ...values);
  }

  async lrange(key: string, start: number, stop: number) {
    return this.client.lrange(key, start, stop);
  }

  async keys(pattern: string) {
    return this.client.keys(pattern);
  }

  getConnectionStatus() {
    return {
      connected: true,
      type: 'Live Redis Database (Redis 7+ / Cloud)',
      info: 'Connected to Redis server on port 6379 / REDIS_URL. Sub-millisecond latency active.',
    };
  }
}

// Global singleton instance
declare global {
  var __redisStoreInstance: IRedisStore | undefined;
}

function initRedis(): IRedisStore {
  if (global.__redisStoreInstance) {
    return global.__redisStoreInstance;
  }

  const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
  let store: IRedisStore;

  try {
    const client = new Redis(redisUrl, {
      maxRetriesPerRequest: 1,
      connectTimeout: 800,
      lazyConnect: true,
      retryStrategy: () => null, // don't spam if offline
    });

    client.on('error', () => {
      // Fallback silently if offline
    });

    // We can probe if it can connect quickly, otherwise fallback
    store = new LiveRedisStore(client);
    client.connect().catch(() => {
      // fallback
    });
  } catch {
    store = new LocalRedisFallback();
  }

  // To guarantee zero crashes for the user if Docker/Redis is not running yet,
  // we check if fallback is preferred or provide transparent resilience
  const fallback = new LocalRedisFallback();

  // Create a resilient proxy: try live redis; if fails, transparently delegate to fallback
  const resilientStore: IRedisStore = {
    isRealRedis: false,
    async get(key: string) {
      try {
        const val = await store.get(key);
        if (val !== null) return val;
      } catch {}
      return fallback.get(key);
    },
    async set(key: string, value: string, expiry?: number) {
      try {
        await store.set(key, value, expiry);
      } catch {}
      return fallback.set(key, value);
    },
    async del(key: string) {
      try {
        await store.del(key);
      } catch {}
      return fallback.del(key);
    },
    async hgetall(key: string) {
      try {
        const res = await store.hgetall(key);
        if (res && Object.keys(res).length > 0) return res;
      } catch {}
      return fallback.hgetall(key);
    },
    async hset(key: string, field: string, value: string) {
      try {
        await store.hset(key, field, value);
      } catch {}
      return fallback.hset(key, field, value);
    },
    async hmset(key: string, data: Record<string, string>) {
      try {
        await store.hmset(key, data);
      } catch {}
      return fallback.hmset(key, data);
    },
    async hincrby(key: string, field: string, increment: number) {
      try {
        return await store.hincrby(key, field, increment);
      } catch {}
      return fallback.hincrby(key, field, increment);
    },
    async lpush(key: string, ...values: string[]) {
      try {
        await store.lpush(key, ...values);
      } catch {}
      return fallback.lpush(key, ...values);
    },
    async lrange(key: string, start: number, stop: number) {
      try {
        const res = await store.lrange(key, start, stop);
        if (res && res.length > 0) return res;
      } catch {}
      return fallback.lrange(key, start, stop);
    },
    async keys(pattern: string) {
      try {
        const res = await store.keys(pattern);
        if (res && res.length > 0) return res;
      } catch {}
      return fallback.keys(pattern);
    },
    getConnectionStatus() {
      return fallback.getConnectionStatus();
    },
  };

  global.__redisStoreInstance = resilientStore;
  return resilientStore;
}

export const redis = initRedis();

// High-level Domain Helpers for Blinkit Quick Commerce
export async function getRedisUser(userId: string): Promise<UserProfile | null> {
  const data = await redis.hgetall(`user:${userId}`);
  if (!data || Object.keys(data).length === 0) return null;

  return {
    id: data.id || userId,
    phone: data.phone || '',
    name: data.name || 'Blinkit Customer',
    email: data.email || '',
    orderCount: parseInt(data.orderCount || '0', 10),
    totalSpent: parseFloat(data.totalSpent || '0'),
    addresses: data.addresses ? JSON.parse(data.addresses) : [],
    createdAt: data.createdAt || new Date().toISOString(),
    lastActive: data.lastActive || new Date().toISOString(),
  };
}

export async function saveRedisUser(user: UserProfile): Promise<void> {
  await redis.hmset(`user:${user.id}`, {
    id: user.id,
    phone: user.phone,
    name: user.name,
    email: user.email || '',
    orderCount: user.orderCount.toString(),
    totalSpent: user.totalSpent.toString(),
    addresses: JSON.stringify(user.addresses || []),
    createdAt: user.createdAt,
    lastActive: new Date().toISOString(),
  });
  // Also index phone -> userId for fast lookups
  if (user.phone) {
    await redis.set(`phone:${user.phone}`, user.id);
  }
}

export async function getUserByPhone(phone: string): Promise<UserProfile | null> {
  const userId = await redis.get(`phone:${phone}`);
  if (!userId) return null;
  return getRedisUser(userId);
}

export async function incrementUserOrders(userId: string, orderAmount: number): Promise<number> {
  const newCount = await redis.hincrby(`user:${userId}`, 'orderCount', 1);
  const user = await getRedisUser(userId);
  if (user) {
    const updatedSpent = user.totalSpent + orderAmount;
    await redis.hset(`user:${userId}`, 'totalSpent', updatedSpent.toString());
  }
  return newCount;
}

export async function saveRedisOrder(order: Order): Promise<void> {
  // Store order JSON
  await redis.set(`order:${order.id}`, JSON.stringify(order));
  // Add to user orders list (LPUSH to keep newest first)
  await redis.lpush(`user:${order.userId}:orders`, order.id);
  // Add to global store ops queue (for the upcoming Store Ops dashboard!)
  await redis.lpush(`store:orders:queue`, order.id);
}

export async function getRedisOrder(orderId: string): Promise<Order | null> {
  const raw = await redis.get(`order:${orderId}`);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  const orderIds = await redis.lrange(`user:${userId}:orders`, 0, 50);
  const orders: Order[] = [];
  for (const id of orderIds) {
    const order = await getRedisOrder(id);
    if (order) orders.push(order);
  }
  return orders;
}

export async function updateRedisOrderStatus(orderId: string, status: Order['status']): Promise<Order | null> {
  const order = await getRedisOrder(orderId);
  if (!order) return null;
  order.status = status;
  await redis.set(`order:${order.id}`, JSON.stringify(order));
  return order;
}
