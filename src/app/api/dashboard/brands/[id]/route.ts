// app/api/dashboard/brands/[id]/route.ts
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

// GET single brand - PUBLIC
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const brand = await prisma.brand.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    if (!brand) {
      return NextResponse.json(
        { error: 'Brand not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(brand);
  } catch (error) {
    console.error('Error fetching brand:', error);
    return NextResponse.json(
      { error: 'Failed to fetch brand' },
      { status: 500 }
    );
  }
}

// PUT update brand - PROTECTED
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if brand exists
    const existingBrand = await prisma.brand.findUnique({
      where: { id: params.id }
    });

    if (!existingBrand) {
      return NextResponse.json(
        { error: 'Brand not found' },
        { status: 404 }
      );
    }

    // Check if another brand already has the same name or slug
    const duplicateBrand = await prisma.brand.findFirst({
      where: {
        AND: [
          { id: { not: params.id } },
          {
            OR: [
              { name },
              { slug }
            ]
          }
        ]
      }
    });

    if (duplicateBrand) {
      return NextResponse.json(
        { error: 'Another brand with this name or slug already exists' },
        { status: 409 }
      );
    }

    // Update brand in database
    const updatedBrand = await prisma.brand.update({
      where: { id: params.id },
      data: {
        name,
        slug,
        description: description || null,
        logo: logo || existingBrand.logo,
        isFeatured: isFeatured || false
      }
    });

    return NextResponse.json(updatedBrand);
  } catch (error) {
    console.error('Error updating brand:', error);
    return NextResponse.json(
      { error: 'Failed to update brand' },
      { status: 500 }
    );
  }
}

// DELETE brand - PROTECTED
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session || session.user?.email !== 'britcartbd@gmail.com') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if brand exists
    const brand = await prisma.brand.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    if (!brand) {
      return NextResponse.json(
        { error: 'Brand not found' },
        { status: 404 }
      );
    }

    // Prevent deletion if brand has products
    if (brand._count.products > 0) {
      return NextResponse.json(
        { error: 'Cannot delete brand with associated products' },
        { status: 400 }
      );
    }

    // Delete logo from Cloudinary if it exists
    if (brand.logo) {
      try {
        // Extract public ID from Cloudinary URL
        const urlParts = brand.logo.split('/');
        const publicIdWithExtension = urlParts[urlParts.length - 1];
        const publicId = publicIdWithExtension.split('.')[0];
        
        // Get the folder path from the URL
        const folderIndex = urlParts.indexOf('britcartbd');
        if (folderIndex !== -1) {
          const folderPath = urlParts.slice(folderIndex, urlParts.length - 1).join('/');
          const fullPublicId = `${folderPath}/${publicId}`;
          
          // Delete from Cloudinary
          await cloudinary.uploader.destroy(fullPublicId);
        }
      } catch (deleteError) {
        console.error('Error deleting logo from Cloudinary:', deleteError);
        // Continue with deletion even if logo deletion fails
      }
    }

    // Delete brand from database
    await prisma.brand.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: 'Brand deleted successfully' });
  } catch (error) {
    console.error('Error deleting brand:', error);
    return NextResponse.json(
      { error: 'Failed to delete brand' },
      { status: 500 }
    );
  }
}