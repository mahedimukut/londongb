// app/api/admin/customers/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    // Admin check
    if (!session?.user?.email || session.user.email !== 'britcartbd@gmail.com') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Build where clause for search
    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [customers, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          emailVerified: true,
          createdAt: true,
          addresses: {
            take: 1,
            orderBy: { isDefault: 'desc' },
            select: { 
              phone: true,
              firstName: true,
              lastName: true 
            }
          },
          orders: {
            select: {
              id: true,
              total: true,
              createdAt: true,
              status: true,
            }
          },
          reviews: {
            select: { id: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.user.count({ where })
    ]);

    // Transform data for frontend
    const formattedCustomers = customers.map(customer => {
      const totalSpent = customer.orders.reduce((sum, order) => 
        sum + parseFloat(order.total.toString()), 0
      );
      
      const lastOrder = customer.orders
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

      return {
        id: customer.id,
        name: customer.name || `${customer.addresses[0]?.firstName || ''} ${customer.addresses[0]?.lastName || ''}`.trim() || 'Unknown',
        email: customer.email,
        image: customer.image,
        phone: customer.addresses[0]?.phone || 'Not provided',
        totalOrders: customer.orders.length,
        totalSpent,
        averageOrderValue: customer.orders.length > 0 ? totalSpent / customer.orders.length : 0,
        joined: customer.createdAt,
        lastOrder: lastOrder?.createdAt || null,
        emailVerified: customer.emailVerified !== null,
        reviews: customer.reviews.length,
        status: customer.orders.length > 0 ? 'ACTIVE' : 'INACTIVE' as 'ACTIVE' | 'INACTIVE'
      };
    });

    const activeCustomers = formattedCustomers.filter(c => c.status === 'ACTIVE').length;
    const totalRevenue = formattedCustomers.reduce((sum, c) => sum + c.totalSpent, 0);

    return NextResponse.json({ 
      customers: formattedCustomers,
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
        search,
        activeCustomers,
        totalRevenue
      }
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}