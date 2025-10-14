// app/api/wishlist/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// GET user's wishlist
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        wishlist: {
          include: {
            product: {
              include: {
                images: { take: 1 },
                category: { select: { name: true } },
                brand: { select: { name: true } },
                reviews: {
                  select: {
                    rating: true
                  }
                }
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const wishlistItems = user.wishlist.map(item => ({
      id: item.id,
      productId: item.productId,
      name: item.product.name,
      price: item.product.price,
      originalPrice: item.product.originalPrice,
      image: item.product.images[0]?.url || '/placeholder-product.jpg',
      slug: item.product.slug,
      rating: item.product.reviews.length > 0 
        ? item.product.reviews.reduce((sum, review) => sum + review.rating, 0) / item.product.reviews.length
        : 0,
      reviewCount: item.product.reviews.length,
      stock: item.product.stock,
      isInStock: item.product.stock > 0,
      addedAt: item.createdAt
    }));

    return NextResponse.json({ wishlist: wishlistItems });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wishlist' },
      { status: 500 }
    );
  }
}

// POST add item to wishlist
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        images: { take: 1 },
        reviews: {
          select: { rating: true }
        }
      }
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Check if already in wishlist
    const existingWishlistItem = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId
        }
      }
    });

    if (existingWishlistItem) {
      return NextResponse.json(
        { error: 'Product already in wishlist' },
        { status: 409 }
      );
    }

    const wishlistItem = await prisma.wishlistItem.create({
      data: {
        userId: user.id,
        productId
      },
      include: {
        product: {
          include: {
            images: { take: 1 },
            reviews: {
              select: { rating: true }
            }
          }
        }
      }
    });

    const responseItem = {
      id: wishlistItem.id,
      productId: wishlistItem.productId,
      name: wishlistItem.product.name,
      price: wishlistItem.product.price,
      originalPrice: wishlistItem.product.originalPrice,
      image: wishlistItem.product.images[0]?.url || '/placeholder-product.jpg',
      slug: wishlistItem.product.slug,
      rating: wishlistItem.product.reviews.length > 0 
        ? wishlistItem.product.reviews.reduce((sum, review) => sum + review.rating, 0) / wishlistItem.product.reviews.length
        : 0,
      reviewCount: wishlistItem.product.reviews.length,
      stock: wishlistItem.product.stock,
      isInStock: wishlistItem.product.stock > 0,
      addedAt: wishlistItem.createdAt
    };

    return NextResponse.json(responseItem, { status: 201 });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return NextResponse.json(
      { error: 'Failed to add item to wishlist' },
      { status: 500 }
    );
  }
}