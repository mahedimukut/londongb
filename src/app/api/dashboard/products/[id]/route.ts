// app/api/dashboard/products/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET single product - PUBLIC
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { slug: id },
      include: {
        category: {
          select: { name: true, slug: true }
        },
        brand: {
          select: { name: true, slug: true }
        },
        images: true,
        colors: true,
        specifications: true,
        reviews: {
          include: {
            user: {
              select: {
                name: true,
                image: true
              }
            }
          },
          where: {
            isVerified: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// PUT update product - PROTECTED
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
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

    // Find the product by slug to get the actual ID
    const existingProduct = await prisma.product.findUnique({
      where: { slug: id },
      include: {
        images: true,
        colors: true,
        specifications: true
      }
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if another product already has the same name or slug
    const duplicateProduct = await prisma.product.findFirst({
      where: {
        AND: [
          { id: { not: existingProduct.id } },
          {
            OR: [
              { name },
              { slug },
              ...(sku ? [{ sku }] : [])
            ]
          }
        ]
      }
    });

    if (duplicateProduct) {
      return NextResponse.json(
        { error: 'Another product with this name, slug, or SKU already exists' },
        { status: 409 }
      );
    }

    // Update product in database using the actual ID
    const updatedProduct = await prisma.product.update({
      where: { id: existingProduct.id },
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
          deleteMany: {},
          create: images?.map((img: string) => ({ url: img })) || []
        },
        colors: {
          deleteMany: {},
          create: colors?.map((color: any) => ({
            name: color.name,
            hexCode: color.hexCode
          })) || []
        },
        specifications: specifications ? {
          upsert: {
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
            },
            update: {
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
          }
        } : {
          delete: existingProduct.specifications ? true : undefined
        }
      },
      include: {
        category: true,
        brand: true,
        images: true,
        colors: true,
        specifications: true
      }
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE product - PROTECTED
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const session = await auth();
    
    if (!session || session.user?.email !== 'britcartbd@gmail.com') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find the product by slug to get the actual ID
    const product = await prisma.product.findUnique({
      where: { slug: id },
      include: {
        images: true,
        reviews: true,
        wishlistItems: true,
        cartItems: true,
        orderItems: true
      }
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Delete images from Cloudinary
    if (product.images.length > 0) {
      try {
        for (const image of product.images) {
          const urlParts = image.url.split('/');
          const publicIdWithExtension = urlParts[urlParts.length - 1];
          const publicId = publicIdWithExtension.split('.')[0];
          
          const folderIndex = urlParts.indexOf('britcartbd');
          if (folderIndex !== -1) {
            const folderPath = urlParts.slice(folderIndex, urlParts.length - 1).join('/');
            const fullPublicId = `${folderPath}/${publicId}`;
            
            await cloudinary.uploader.destroy(fullPublicId);
          }
        }
      } catch (deleteError) {
        console.error('Error deleting images from Cloudinary:', deleteError);
      }
    }

    // Delete product from database using the actual ID
    await prisma.product.delete({
      where: { id: product.id }
    });

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}