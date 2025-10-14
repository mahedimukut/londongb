// app/api/wishlist/admin/route.ts
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

    // Build where clause for search
    const where: any = {};
    if (search) {
      where.user = {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ]
      };
    }

    // Get all wishlist items grouped by user
    const wishlistItems = await prisma.wishlistItem.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          }
        },
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            images: { take: 1 },
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Group wishlist items by user
    const wishlistsByUser = wishlistItems.reduce((acc, item) => {
      const userId = item.userId;
      if (!acc[userId]) {
        acc[userId] = {
          userId,
          customer: item.user.name || item.user.email,
          email: item.user.email,
          image: item.user.image,
          items: [],
          totalValue: 0,
          createdAt: item.createdAt,
          lastUpdated: item.createdAt
        };
      }
      
      acc[userId].items.push({
        id: item.id,
        productId: item.productId,
        productName: item.product.name,
        price: item.product.price,
        image: item.product.images[0]?.url
      });
      
      acc[userId].totalValue += parseFloat(item.product.price.toString());
      
      // Update lastUpdated if this item is newer
      if (new Date(item.createdAt) > new Date(acc[userId].lastUpdated)) {
        acc[userId].lastUpdated = item.createdAt;
      }
      
      return acc;
    }, {} as any);

    // Convert to array and format for frontend
    const formattedWishlists = Object.values(wishlistsByUser).map((wishlist: any) => ({
      id: wishlist.userId,
      customer: wishlist.customer,
      email: wishlist.email,
      image: wishlist.image,
      items: wishlist.items.length,
      totalValue: wishlist.totalValue,
      created: wishlist.createdAt,
      lastUpdated: wishlist.lastUpdated,
      products: wishlist.items
    }));

    // Calculate stats
    const totalWishlists = formattedWishlists.length;
    const totalItems = formattedWishlists.reduce((sum, w) => sum + w.items, 0);
    const totalValue = formattedWishlists.reduce((sum, w) => sum + w.totalValue, 0);
    const avgItems = totalWishlists > 0 ? totalItems / totalWishlists : 0;

    return NextResponse.json({ 
      wishlists: formattedWishlists,
      stats: {
        totalWishlists,
        totalItems,
        totalValue,
        avgItems: parseFloat(avgItems.toFixed(1)),
        activeUsers: totalWishlists // Each wishlist represents an active user
      }
    });
  } catch (error) {
    console.error('Error fetching wishlists:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wishlists' },
      { status: 500 }
    );
  }
}