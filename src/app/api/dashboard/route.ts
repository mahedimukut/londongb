// app/api/dashboard/route.ts
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

    // Get current date and previous month for calculations
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    // Fetch all data in parallel for better performance
    const [
      totalProducts,
      totalOrders,
      totalCustomers,
      currentMonthRevenue,
      lastMonthRevenue,
      recentOrders,
      monthlyRevenueData,
      topProducts
    ] = await Promise.all([
      // Total Products
      prisma.product.count(),

      // Total Orders
      prisma.order.count(),

      // Total Customers
      prisma.user.count(),

      // Current Month Revenue
      prisma.order.aggregate({
        where: {
          createdAt: {
            gte: currentMonthStart
          },
          paymentStatus: 'COMPLETED'
        },
        _sum: {
          total: true
        }
      }),

      // Last Month Revenue
      prisma.order.aggregate({
        where: {
          createdAt: {
            gte: lastMonthStart,
            lte: lastMonthEnd
          },
          paymentStatus: 'COMPLETED'
        },
        _sum: {
          total: true
        }
      }),

      // Recent Orders
      prisma.order.findMany({
        take: 5,
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          },
          shippingAddress: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),

      // Last 6 months revenue data for chart
      prisma.order.groupBy({
        by: ['createdAt'],
        where: {
          createdAt: {
            gte: new Date(now.getFullYear(), now.getMonth() - 5, 1)
          },
          paymentStatus: 'COMPLETED'
        },
        _sum: {
          total: true
        }
      }),

      // Top selling products
      prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: {
          quantity: true
        },
        orderBy: {
          _sum: {
            quantity: 'desc'
          }
        },
        take: 5
      })
    ]);

    // Convert Decimal values to numbers and calculate percentage changes
    const currentRevenue = Number(currentMonthRevenue._sum.total || 0);
    const lastRevenue = Number(lastMonthRevenue._sum.total || 0);
    const revenueChange = lastRevenue > 0 ? ((currentRevenue - lastRevenue) / lastRevenue * 100) : 0;

    // Format monthly revenue data for chart
    const monthlyRevenue = Array.from({ length: 6 }, (_, i) => {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${month.getFullYear()}-${month.getMonth() + 1}`;
      
      const monthData = monthlyRevenueData.filter(item => {
        const itemMonth = new Date(item.createdAt);
        return `${itemMonth.getFullYear()}-${itemMonth.getMonth() + 1}` === monthKey;
      });

      const total = monthData.reduce((sum, item) => sum + Number(item._sum.total || 0), 0);
      
      return {
        month: month.toLocaleDateString('en-US', { month: 'short' }),
        revenue: total
      };
    }).reverse();

    // Get product details for top products
    const topProductsWithDetails = await Promise.all(
      topProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: {
            name: true,
            price: true,
            images: { take: 1 }
          }
        });

        const productPrice = Number(product?.price || 0);
        const quantity = Number(item._sum.quantity || 0);

        return {
          name: product?.name || 'Unknown Product',
          quantity: quantity,
          revenue: productPrice * quantity
        };
      })
    );

    // Format recent orders
    const formattedRecentOrders = recentOrders.map(order => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customer: order.shippingAddress ? 
        `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}` : 
        order.user?.name || 'Unknown Customer',
      date: order.createdAt,
      amount: Number(order.total),
      status: order.status
    }));

    return NextResponse.json({
      stats: {
        totalProducts,
        totalOrders,
        totalCustomers,
        totalRevenue: currentRevenue,
        revenueChange: parseFloat(revenueChange.toFixed(1)),
        revenueChangeType: revenueChange >= 0 ? 'positive' : 'negative'
      },
      chartData: {
        monthlyRevenue,
        topProducts: topProductsWithDetails
      },
      recentOrders: formattedRecentOrders
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}