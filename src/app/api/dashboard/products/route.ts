// app/api/dashboard/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// GET all products with pagination, search, filtering, and sorting - PUBLIC
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const brand = searchParams.get('brand') || '';
    const sort = searchParams.get('sort') || 'newest'; // Default to newest
    
    const isFeatured = searchParams.get('featured') === 'true';
    const isBestSeller = searchParams.get('bestSeller') === 'true';
    const isNew = searchParams.get('new') === 'true';
    
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    const skip = (page - 1) * limit;

    // Build where clause for filtering
    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Handle category filtering - support both ID and slug
    if (category && category !== 'all') {
      // Check if it's a valid UUID (ID) or a slug
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(category);
      
      if (isUUID) {
        // It's an ID - use directly
        where.categoryId = category;
      } else {
        // It's a slug - find category by slug first
        const categoryRecord = await prisma.category.findUnique({
          where: { slug: category }
        });
        
        if (categoryRecord) {
          where.categoryId = categoryRecord.id;
        } else {
          // If category not found by slug, return empty results
          return NextResponse.json({
            products: [],
            pagination: {
              page,
              limit,
              total: 0,
              pages: 0
            }
          });
        }
      }
    }

    // Handle brand filtering - support both ID and slug
    if (brand && brand !== 'all') {
      // Check if it's a valid UUID (ID) or a slug
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(brand);
      
      if (isUUID) {
        // It's an ID - use directly
        where.brandId = brand;
      } else {
        // It's a slug - find brand by slug first
        const brandRecord = await prisma.brand.findUnique({
          where: { slug: brand }
        });
        
        if (brandRecord) {
          where.brandId = brandRecord.id;
        } else {
          // If brand not found by slug, return empty results
          return NextResponse.json({
            products: [],
            pagination: {
              page,
              limit,
              total: 0,
              pages: 0
            }
          });
        }
      }
    }

    if (isFeatured) {
      where.isFeatured = true;
    }

    if (isBestSeller) {
      where.isBestSeller = true;
    }

    if (isNew) {
      where.isNew = true;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) {
        where.price.gte = parseFloat(minPrice);
      }
      if (maxPrice) {
        where.price.lte = parseFloat(maxPrice);
      }
    }

    // Handle sorting
    let orderBy: any = { createdAt: 'desc' }; // Default sorting
    
    switch (sort) {
      case 'featured':
        orderBy = [{ isFeatured: 'desc' }, { createdAt: 'desc' }];
        break;
      case 'bestseller':
        orderBy = [{ isBestSeller: 'desc' }, { createdAt: 'desc' }];
        break;
      case 'newest':
        orderBy = [{ isNew: 'desc' }, { createdAt: 'desc' }];
        break;
      case 'price-low-high':
        orderBy = { price: 'asc' };
        break;
      case 'price-high-low':
        orderBy = { price: 'desc' };
        break;
      case 'name-asc':
        orderBy = { name: 'asc' };
        break;
      case 'name-desc':
        orderBy = { name: 'desc' };
        break;
      case 'rating':
        orderBy = { rating: 'desc' };
        break;
      default:
        orderBy = { createdAt: 'desc' };
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: {
            select: { name: true, slug: true }
          },
          brand: {
            select: { name: true, slug: true }
          },
          images: {
            take: 1
          },
          colors: true
        },
        orderBy,
        skip,
        take: limit
      }),
      prisma.product.count({ where })
    ]);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST create new product - PROTECTED
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || session.user?.email !== 'britcartbd@gmail.com') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      slug,
      description,
      price,
      originalPrice,
      stock,
      sku,
      categoryId,
      brandId,
      isFeatured,
      isBestSeller,
      isNew,
      ageRange,
      images,
      colors,
      specifications
    } = body;

    // Validate required fields
    if (!name || !slug || !price || !stock || !categoryId) {
      return NextResponse.json(
        { error: 'Name, slug, price, stock, and category are required' },
        { status: 400 }
      );
    }

    // Check if product already exists
    const existingProduct = await prisma.product.findFirst({
      where: {
        OR: [
          { name },
          { slug },
          ...(sku ? [{ sku }] : [])
        ]
      }
    });

    if (existingProduct) {
      return NextResponse.json(
        { error: 'Product with this name, slug, or SKU already exists' },
        { status: 409 }
      );
    }

    // Create product in database
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description: description || null,
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        stock: parseInt(stock),
        sku: sku || null,
        categoryId,
        brandId: brandId || null,
        isFeatured: isFeatured || false,
        isBestSeller: isBestSeller || false,
        isNew: isNew || false,
        ageRange: ageRange || null,
        images: {
          create: images?.map((img: string) => ({ url: img })) || []
        },
        colors: {
          create: colors?.map((color: any) => ({
            name: color.name,
            hexCode: color.hexCode
          })) || []
        },
        specifications: specifications ? {
          create: {
            brand: specifications.brand || null,
            countryOfOrigin: specifications.countryOfOrigin || null,
            productType: specifications.productType || null,
            materials: specifications.materials || null,
            packContains: specifications.packContains || null,
            weight: specifications.weight || null,
            dimensions: specifications.dimensions || null,
            careInstructions: specifications.careInstructions || null,
            safetyFeatures: specifications.safetyFeatures || null
          }
        } : undefined
      },
      include: {
        category: true,
        brand: true,
        images: true,
        colors: true,
        specifications: true
      }
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}