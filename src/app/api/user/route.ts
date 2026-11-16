import { NextResponse } from 'next/server';
import { getRedisUser, getUserByPhone, saveRedisUser } from '@/lib/redis';
import { UserProfile } from '@/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const phone = searchParams.get('phone');

  if (userId) {
    const user = await getRedisUser(userId);
    return NextResponse.json({ user });
  }

  if (phone) {
    const user = await getUserByPhone(phone);
    return NextResponse.json({ user });
  }

  return NextResponse.json({ error: 'Provide userId or phone' }, { status: 400 });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, name, email, address } = body;

    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    // Check if user already exists with this phone in Redis
    let user = await getUserByPhone(phone);

    if (!user) {
      // Create new user in Redis
      const newUserId = `usr_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      user = {
        id: newUserId,
        phone,
        name: name || 'Blinkit Shopper',
        email: email || '',
        orderCount: 0,
        totalSpent: 0,
        addresses: address
          ? [address]
          : [
              {
                id: 'addr_default',
                label: 'Home',
                flat: 'Flat 402, Green Glen Apartments',
                street: 'Outer Ring Road, Bellandur',
                area: 'Bellandur',
                city: 'Bengaluru',
                pincode: '560103',
                landmark: 'Near Central Mall',
              },
            ],
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
      };
      await saveRedisUser(user);
    } else {
      // Update existing user last active or details if provided
      if (name && name !== user.name) user.name = name;
      if (address) {
        const existingIdx = user.addresses.findIndex((a) => a.id === address.id);
        if (existingIdx >= 0) {
          user.addresses[existingIdx] = address;
        } else {
          user.addresses.push(address);
        }
      }
      user.lastActive = new Date().toISOString();
      await saveRedisUser(user);
    }

    return NextResponse.json({
      success: true,
      user,
      message: 'User authenticated and synchronized with Redis database',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}
