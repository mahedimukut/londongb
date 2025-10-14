import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// GET user profile data
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        addresses: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            street: true,
            city: true,
            state: true,
            postalCode: true,
            country: true,
            phone: true,
            isDefault: true,
          },
          orderBy: { isDefault: 'desc' }
        },
        orders: {
          select: {
            id: true,
            orderNumber: true,
            status: true,
            total: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 5
        },
        wishlist: {
          select: {
            id: true,
            createdAt: true,
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                images: {
                  select: {
                    url: true
                  },
                  take: 1
                }
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        cart: {
          select: {
            id: true,
            quantity: true,
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                images: {
                  select: {
                    url: true
                  },
                  take: 1
                }
              }
            }
          }
        },
        reviews: {
          select: {
            id: true,
            rating: true,
            title: true,
            comment: true,
            createdAt: true,
            product: {
              select: {
                id: true,
                name: true,
                slug: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Calculate statistics
    const stats = {
      totalOrders: user.orders.length,
      wishlistCount: user.wishlist.length,
      cartCount: user.cart.reduce((sum, item) => sum + item.quantity, 0),
      reviewsCount: user.reviews.length,
    };

    return NextResponse.json({ 
      user: {
        ...user,
        stats
      }
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 }
    );
  }
}

// PUT update user profile
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, phone } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if email is being changed and if it's already taken
    if (email !== session.user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser && existingUser.id !== user.id) {
        return NextResponse.json(
          { error: 'Email already taken' },
          { status: 400 }
        );
      }
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name,
        email,
        // Note: You might want to store phone in a separate field or in addresses
        // For now, we'll assume phone is stored in the default address
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    // If phone is provided, update the default address phone
    if (phone) {
      const defaultAddress = await prisma.address.findFirst({
        where: { 
          userId: user.id,
          isDefault: true 
        }
      });

      if (defaultAddress) {
        await prisma.address.update({
          where: { id: defaultAddress.id },
          data: { phone }
        });
      }
    }

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error('Error updating user data:', error);
    return NextResponse.json(
      { error: 'Failed to update user data' },
      { status: 500 }
    );
  }
}