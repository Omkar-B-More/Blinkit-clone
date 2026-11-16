import { NextResponse } from 'next/server';
import {
  saveRedisOrder,
  getUserOrders,
  incrementUserOrders,
  getRedisUser,
} from '@/lib/redis';
import { Order, CartItem, Address, RiderInfo } from '@/types';

const SAMPLE_RIDERS: RiderInfo[] = [
  {
    name: 'Rajesh Kumar',
    phone: '+91 98234 11203',
    rating: 4.9,
    totalDeliveries: 4210,
    vehicleNumber: 'KA 03 HM 4812',
    vehicleModel: 'Hero Electric Nyx Super',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    currentLat: 12.9352,
    currentLng: 77.6245,
  },
  {
    name: 'Suresh Verma',
    phone: '+91 97120 44589',
    rating: 4.8,
    totalDeliveries: 3150,
    vehicleNumber: 'DL 4S BN 9012',
    vehicleModel: 'Ather 450X Quick Hub',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    currentLat: 12.937,
    currentLng: 77.627,
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 });
  }

  const orders = await getUserOrders(userId);
  return NextResponse.json({ orders });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      userId,
      items,
      deliveryAddress,
      tipAmount = 0,
      rainSurgeFee = 0,
    }: {
      userId: string;
      items: CartItem[];
      deliveryAddress: Address;
      tipAmount?: number;
      rainSurgeFee?: number;
    } = body;

    if (!userId || !items || items.length === 0 || !deliveryAddress) {
      return NextResponse.json(
        { error: 'Missing required order details' },
        { status: 400 }
      );
    }

    // Verify user in Redis
    const user = await getRedisUser(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found in Redis database' }, { status: 404 });
    }

    // Compute bill breakdown
    const itemTotal = items.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );
    const deliveryFee = itemTotal >= 99 ? 0 : 25; // Free delivery over ₹99
    const handlingFee = 5; // Standard Blinkit dark store packing fee
    const totalAmount = itemTotal + deliveryFee + handlingFee + rainSurgeFee + tipAmount;

    // Generate random 4-digit OTP for delivery handover
    const deliveryOtp = Math.floor(1000 + Math.random() * 9000).toString();

    // Select rider
    const randomRider =
      SAMPLE_RIDERS[Math.floor(Math.random() * SAMPLE_RIDERS.length)];

    const orderId = `blk_${Date.now().toString().slice(-6)}_${Math.floor(
      100 + Math.random() * 900
    )}`;

    const newOrder: Order = {
      id: orderId,
      userId,
      items,
      itemTotal,
      deliveryFee,
      handlingFee,
      rainSurgeFee,
      tipAmount,
      totalAmount,
      status: 'placed',
      deliveryAddress,
      deliveryOtp,
      darkStoreName: 'Blinkit Dark Store #042 (Bellandur Hub - 1.2 km)',
      rider: randomRider,
      createdAt: new Date().toISOString(),
      estimatedDeliveryTimeMinutes: 10,
      elapsedSeconds: 0,
    };

    // Save order and update user order count in Redis
    await saveRedisOrder(newOrder);
    const updatedCount = await incrementUserOrders(userId, totalAmount);

    return NextResponse.json({
      success: true,
      order: newOrder,
      userOrderCount: updatedCount,
      message: 'Order placed in 10-minute dispatch queue & stored in Redis',
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Order creation failed' },
      { status: 500 }
    );
  }
}
