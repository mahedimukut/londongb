// app/api/hot-deals/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: {
        stock: { gt: 0 },
        originalPrice: { not: null },
      },
      include: {
        category: { select: { name: true, slug: true } },
        brand: { select: { name: true, slug: true } },
        images: { take: 1 },
        colors: true
      },
      take: 20
    });

    // Convert Decimal to numbers and calculate discount
    const productsWithDiscount = products
      .map(product => {
        // Convert Decimal to numbers
        const price = Number(product.price);
        const originalPrice = product.originalPrice ? Number(product.originalPrice) : null;
        
        const discountPercentage = originalPrice && originalPrice > price
          ? Math.round(((originalPrice - price) / originalPrice) * 100)
          : 0;

        return {
          ...product,
          price, // Converted to number
          originalPrice, // Converted to number or null
          discountPercentage
        };
      })
      .filter(product => product.discountPercentage >= 10) // Minimum 10% discount
      .sort((a, b) => b.discountPercentage - a.discountPercentage);

    return NextResponse.json(productsWithDiscount);
  } catch (error) {
    console.error('Error fetching hot deals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hot deals' },
      { status: 500 }
    );
  }
}