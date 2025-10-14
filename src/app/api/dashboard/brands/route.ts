// app/api/dashboard/brands/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// GET all brands - PUBLIC
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    const isFeatured = searchParams.get('featured') === 'true';

    // Build the query options
    const queryOptions: any = {
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: {
        name: 'asc'
      }
    };

    // Add where clause for featured brands if requested
    if (isFeatured) {
      queryOptions.where = {
        isFeatured: true
      };
    }

    // Add limit if provided
    if (limit) {
      queryOptions.take = parseInt(limit);
    }

    const brands = await prisma.brand.findMany(queryOptions);

    return NextResponse.json(brands);
  } catch (error) {
    console.error('Error fetching brands:', error);
    return NextResponse.json(
      { error: 'Failed to fetch brands' },
      { status: 500 }
    );
  }
}

// POST create new brand - PROTECTED
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || session.user?.email !== 'britcartbd@gmail.com') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, slug, description, logo, isFeatured } = body;

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      );
    }

    // Check if brand already exists
    const existingBrand = await prisma.brand.findFirst({
      where: {
        OR: [
          { name },
          { slug }
        ]
      }
    });

    if (existingBrand) {
      return NextResponse.json(
        { error: 'Brand with this name or slug already exists' },
        { status: 409 }
      );
    }

    // Create brand in database
    const brand = await prisma.brand.create({
      data: {
        name,
        slug,
        description: description || null,
        logo: logo || null,
        isFeatured: isFeatured || false
      }
    });

    return NextResponse.json(brand, { status: 201 });
  } catch (error) {
    console.error('Error creating brand:', error);
    return NextResponse.json(
      { error: 'Failed to create brand' },
      { status: 500 }
    );
  }
}