// app/api/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// POST create new order - allow guest checkout
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    // Allow both authenticated and guest users
    let userId = null;
    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email }
      });
      userId = user?.id || null;
    }

    const body = await request.json();
    const { 
      shippingAddressId, 
      paymentMethod, 
      items, 
      subtotal, 
      tax, 
      shipping, 
      discount, 
      total,
      // Guest checkout data
      guestEmail,
      guestShippingAddress,
      // bKash payment data
      bkashNumber,
      bkashReference,
      bkashTransaction
    } = body;

    // Validate required fields
    if ((!shippingAddressId && !guestShippingAddress) || !paymentMethod || !items || !total) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // For guest checkout, validate guest data
    if (!userId && (!guestEmail || !guestShippingAddress)) {
      return NextResponse.json(
        { error: 'Guest email and shipping address are required for guest checkout' },
        { status: 400 }
      );
    }

    // Validate bKash data if payment method is BKASH
    if (paymentMethod === 'BKASH') {
      if (!bkashNumber) {
        return NextResponse.json(
          { error: 'bKash number is required for bKash payments' },
          { status: 400 }
        );
      }
      if (!bkashReference) {
        return NextResponse.json(
          { error: 'bKash reference number is required for bKash payments' },
          { status: 400 }
        );
      }
    }

    // Generate unique order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Create order with transaction
    const order = await prisma.$transaction(async (tx) => {
      // 1. Validate stock availability
      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          select: { stock: true, name: true }
        });

        if (!product) {
          throw new Error(`Product not found: ${item.productId}`);
        }

        if (product.stock < item.quantity) {
          throw new Error(
            `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`
          );
        }
      }

      // 2. Reduce stock
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { 
            stock: { 
              decrement: item.quantity 
            } 
          }
        });
      }

      // 3. Create order data with conditional guest shipping address
      const orderData: any = {
        userId: userId, // null for guest users
        orderNumber,
        paymentMethod,
        subtotal,
        tax: tax || 0,
        shipping: shipping || 0,
        discount: discount || 0,
        total,
        status: paymentMethod === 'CASH_ON_DELIVERY' ? 'PENDING' : 'CONFIRMED',
        paymentStatus: paymentMethod === 'CASH_ON_DELIVERY' ? 'PENDING' : 'PROCESSING',
        // Add bKash data if payment method is BKASH
        ...(paymentMethod === 'BKASH' && {
          bkashNumber,
          bkashReference,
          bkashTransaction: bkashTransaction || null
        }),
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            color: item.color || '',
            size: item.size || '',
          }))
        }
      };

      // Add shipping address based on user type
      if (userId && shippingAddressId) {
        // Logged-in user with existing address
        orderData.shippingAddressId = shippingAddressId;
      } else if (!userId && guestShippingAddress) {
        // Guest user - create guest shipping address
        const newGuestAddress = await tx.guestShippingAddress.create({
          data: {
            firstName: guestShippingAddress.firstName,
            lastName: guestShippingAddress.lastName,
            street: guestShippingAddress.street,
            city: guestShippingAddress.city,
            state: guestShippingAddress.state,
            postalCode: guestShippingAddress.postalCode,
            country: guestShippingAddress.country || 'Bangladesh',
            phone: guestShippingAddress.phone,
            email: guestEmail,
          }
        });

        // Link the guest shipping address to the order
        orderData.guestShippingAddressId = newGuestAddress.id;
        orderData.guestEmail = guestEmail;
      }

      // 4. Create the order
      const newOrder = await tx.order.create({
        data: orderData,
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: { take: 1 }
                }
              }
            }
          },
          shippingAddress: true,
          guestShippingAddress: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });

      // 5. Clear user's cart if logged in
      if (userId) {
        await tx.cartItem.deleteMany({
          where: { userId }
        });
      }

      return newOrder;
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    
    if (error instanceof Error && error.message.includes('Insufficient stock')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

// GET user's orders with search functionality (or all orders for admin)
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const isAdmin = session.user.email === 'britcartbd@gmail.com';

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get search parameters from URL
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const paymentMethod = searchParams.get('paymentMethod') || '';
    
    // Parse pagination parameters with proper error handling
    const pageParam = searchParams.get('page');
    const limitParam = searchParams.get('limit');
    
    const page = pageParam ? Math.max(1, parseInt(pageParam, 10)) : 1;
    const limit = limitParam ? Math.max(1, parseInt(limitParam, 10)) : 10;
    const skip = (page - 1) * limit;

    // Validate pagination parameters
    if (isNaN(page) || isNaN(limit)) {
      return NextResponse.json(
        { error: 'Invalid pagination parameters' },
        { status: 400 }
      );
    }

    // Build where clause - different for admin vs regular user
    const where: any = isAdmin ? {} : { 
      OR: [
        { userId: user.id }, // User's orders
        { guestEmail: session.user.email } // Guest orders with matching email
      ]
    };

    // Add search filter
    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        // Search bKash reference numbers (admin only)
        ...(isAdmin ? [
          { bkashReference: { contains: search, mode: 'insensitive' } },
          { bkashNumber: { contains: search, mode: 'insensitive' } },
          { bkashTransaction: { contains: search, mode: 'insensitive' } }
        ] : []),
        // Search in user addresses
        {
          shippingAddress: {
            OR: [
              { city: { contains: search, mode: 'insensitive' } },
              { state: { contains: search, mode: 'insensitive' } },
              { street: { contains: search, mode: 'insensitive' } },
              { firstName: { contains: search, mode: 'insensitive' } },
              { lastName: { contains: search, mode: 'insensitive' } },
            ]
          }
        },
        // Search in guest addresses
        {
          guestShippingAddress: {
            OR: [
              { city: { contains: search, mode: 'insensitive' } },
              { state: { contains: search, mode: 'insensitive' } },
              { street: { contains: search, mode: 'insensitive' } },
              { firstName: { contains: search, mode: 'insensitive' } },
              { lastName: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
            ]
          }
        },
        // Search in products
        {
          items: {
            some: {
              product: {
                name: { contains: search, mode: 'insensitive' }
              }
            }
          }
        },
        // For admin: also search by user email and guest email
        ...(isAdmin ? [
          {
            user: {
              email: { contains: search, mode: 'insensitive' }
            }
          },
          {
            guestEmail: { contains: search, mode: 'insensitive' }
          }
        ] : [])
      ];
    }

    // Add status filter
    if (status && status !== 'ALL') {
      where.status = status;
    }

    // Add payment method filter
    if (paymentMethod && paymentMethod !== 'ALL') {
      where.paymentMethod = paymentMethod;
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: { take: 1 }
                }
              }
            }
          },
          shippingAddress: true,
          guestShippingAddress: true,
          // Include user info for admin
          ...(isAdmin ? { user: { select: { id: true, name: true, email: true } } } : {})
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.order.count({ where })
    ]);

    const pages = Math.ceil(total / limit);

    return NextResponse.json({ 
      orders,
      meta: {
        total,
        page,
        limit,
        pages,
        search,
        status,
        paymentMethod,
        isAdmin
      }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// PATCH update order (for admin to update payment status, add transaction ID, etc.)
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const isAdmin = session.user.email === 'britcartbd@gmail.com';
    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { 
      orderId, 
      status, 
      paymentStatus, 
      bkashTransaction,
      bkashReference 
    } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    const updateData: any = {};
    
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (bkashTransaction) updateData.bkashTransaction = bkashTransaction;
    if (bkashReference) updateData.bkashReference = bkashReference;

    const order = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { take: 1 }
              }
            }
          }
        },
        shippingAddress: true,
        guestShippingAddress: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}