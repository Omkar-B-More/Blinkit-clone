import { NextResponse } from 'next/server';
import { getRedisOrder, updateRedisOrderStatus } from '@/lib/redis';
import { OrderStatus } from '@/types';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const order = await getRedisOrder(id);

  if (!order) {
    return NextResponse.json({ error: 'Order not found in Redis' }, { status: 404 });
  }

  // Calculate live progression based on creation time
  const createdMs = new Date(order.createdAt).getTime();
  const nowMs = Date.now();
  const diffSeconds = Math.max(0, Math.floor((nowMs - createdMs) / 1000));

  // 10-minute (600s) timeline simulation
  // 0s - 25s: 'placed'
  // 26s - 80s: 'packing'
  // 81s - 180s: 'rider_assigned'
  // 181s - 580s: 'out_for_delivery'
  // > 580s: 'delivered'
  let simulatedStatus: OrderStatus = order.status;

  if (order.status !== 'delivered') {
    if (diffSeconds >= 580) {
      simulatedStatus = 'delivered';
    } else if (diffSeconds >= 180) {
      simulatedStatus = 'out_for_delivery';
    } else if (diffSeconds >= 75) {
      simulatedStatus = 'rider_assigned';
    } else if (diffSeconds >= 20) {
      simulatedStatus = 'packing';
    } else {
      simulatedStatus = 'placed';
    }
  }

  // Compute remaining delivery ETA (starts at 10 minutes and counts down)
  const remainingSeconds = Math.max(0, 600 - diffSeconds);
  const remainingEtaMinutes = Math.ceil(remainingSeconds / 60);

  order.status = simulatedStatus;
  order.elapsedSeconds = diffSeconds;
  order.estimatedDeliveryTimeMinutes = remainingEtaMinutes;

  return NextResponse.json({
    order,
    remainingSeconds,
    remainingEtaMinutes,
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { status } = body;

  if (!status) {
    return NextResponse.json({ error: 'Status is required' }, { status: 400 });
  }

  const updated = await updateRedisOrderStatus(id, status as OrderStatus);
  if (!updated) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, order: updated });
}
