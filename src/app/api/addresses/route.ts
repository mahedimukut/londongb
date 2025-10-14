// app/api/addresses/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// Updated GET method - handles both regular users and admin
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin (britcartbd@gmail.com)
    const isAdmin = session.user.email === 'britcartbd@gmail.com';

    // If admin, return ALL addresses
    // If regular user, return only their addresses
    const addresses = await prisma.address.findMany({
      where: isAdmin ? {} : { 
        user: { email: session.user.email } 
      },
      include: {
        user: {
          select: {
            email: true,
            name: true,
          },
        },
      },
      orderBy: { 
        isDefault: 'desc'
        // Remove createdAt since it doesn't exist in Address model
      }
    });

    return NextResponse.json({ 
      addresses,
      isAdmin // Optional: send admin status to frontend if needed
    });
  } catch (error) {
    console.error('Error fetching addresses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch addresses' },
      { status: 500 }
    );
  }
}

// POST create new address (unchanged)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      firstName, 
      lastName, 
      street, 
      city, 
      state, 
      postalCode, 
      country, 
      phone, 
      isDefault 
    } = body;

    // Validate required fields
    if (!firstName || !lastName || !street || !city || !state || !postalCode || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // If setting as default, remove default from other addresses
    if (isDefault) {
      await prisma.address.updateMany({
        where: { 
          userId: user.id,
          isDefault: true 
        },
        data: { isDefault: false }
      });
    }

    const address = await prisma.address.create({
      data: {
        userId: user.id,
        firstName,
        lastName,
        street,
        city,
        state,
        postalCode,
        country: country || 'Bangladesh',
        phone,
        isDefault: isDefault || false
      }
    });

    return NextResponse.json({ address }, { status: 201 });
  } catch (error) {
    console.error('Error creating address:', error);
    return NextResponse.json(
      { error: 'Failed to create address' },
      { status: 500 }
    );
  }
}