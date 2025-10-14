// app/api/cart/check-stock/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { items } = body;

    if (!items || !Array.isArray(items)) {
      return NextResponse.json(
        { error: 'Items array is required' },
        { status: 400 }
      );
    }

    const stockResults = [];
    const outOfStockItems = [];

    // Check stock for each item
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: {
          id: true,
          name: true,
          stock: true,
          price: true
        }
      });

      if (!product) {
        outOfStockItems.push({
          productId: item.productId,
          name: item.name,
          reason: 'Product not found'
        });
        continue;
      }

      if (product.stock < item.quantity) {
        outOfStockItems.push({
          productId: item.productId,
          name: product.name,
          available: product.stock,
          requested: item.quantity,
          reason: 'Insufficient stock'
        });
      }

      stockResults.push({
        productId: item.productId,
        name: product.name,
        available: product.stock,
        requested: item.quantity,
        sufficient: product.stock >= item.quantity
      });
    }

    return NextResponse.json({
      available: outOfStockItems.length === 0,
      stockResults,
      outOfStockItems
    });

  } catch (error) {
    console.error('Error checking stock:', error);
    return NextResponse.json(
      { error: 'Failed to check stock availability' },
      { status: 500 }
    );
  }
}