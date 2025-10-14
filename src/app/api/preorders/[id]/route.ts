// app/api/preorders/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET single preorder - PROTECTED (Admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Change to Promise
) {
  try {
    const { id } = await params; // Await params and destructure
    const session = await auth();
    
    if (!session || session.user?.email !== 'britcartbd@gmail.com') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { prisma } = await import('@/lib/prisma');

    const preorder = await prisma.preorder.findUnique({
      where: { id } // Use the destructured id
    });

    if (!preorder) {
      return NextResponse.json(
        { error: 'Preorder not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(preorder);
  } catch (error) {
    console.error('Error fetching preorder:', error);
    return NextResponse.json(
      { error: 'Failed to fetch preorder' },
      { status: 500 }
    );
  }
}

// PUT update preorder - PROTECTED (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Change to Promise
) {
  try {
    const { id } = await params; // Await params and destructure
    const session = await auth();
    
    if (!session || session.user?.email !== 'britcartbd@gmail.com') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      status,
      adminNotes,
      estimatedPrice,
      estimatedTime
    } = body;

    const { prisma } = await import('@/lib/prisma');

    // Check if preorder exists
    const existingPreorder = await prisma.preorder.findUnique({
      where: { id } // Use the destructured id
    });

    if (!existingPreorder) {
      return NextResponse.json(
        { error: 'Preorder not found' },
        { status: 404 }
      );
    }

    // Update preorder in database
    const updatedPreorder = await prisma.preorder.update({
      where: { id }, // Use the destructured id
      data: {
        status: status || existingPreorder.status,
        adminNotes: adminNotes || existingPreorder.adminNotes,
        estimatedPrice: estimatedPrice ? parseFloat(estimatedPrice) : existingPreorder.estimatedPrice,
        estimatedTime: estimatedTime || existingPreorder.estimatedTime,
      }
    });

    return NextResponse.json(updatedPreorder);
  } catch (error) {
    console.error('Error updating preorder:', error);
    return NextResponse.json(
      { error: 'Failed to update preorder' },
      { status: 500 }
    );
  }
}

// DELETE preorder - PROTECTED (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Change to Promise
) {
  try {
    const { id } = await params; // Await params and destructure
    const session = await auth();
    
    if (!session || session.user?.email !== 'britcartbd@gmail.com') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { prisma } = await import('@/lib/prisma');

    // Check if preorder exists
    const preorder = await prisma.preorder.findUnique({
      where: { id } // Use the destructured id
    });

    if (!preorder) {
      return NextResponse.json(
        { error: 'Preorder not found' },
        { status: 404 }
      );
    }

    // Delete images from Cloudinary if they exist
    if (preorder.images.length > 0) {
      try {
        for (const imageUrl of preorder.images) {
          const urlParts = imageUrl.split('/');
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
        // Continue with deletion even if image deletion fails
      }
    }

    // Delete preorder from database
    await prisma.preorder.delete({
      where: { id } // Use the destructured id
    });

    return NextResponse.json({ message: 'Preorder deleted successfully' });
  } catch (error) {
    console.error('Error deleting preorder:', error);
    return NextResponse.json(
      { error: 'Failed to delete preorder' },
      { status: 500 }
    );
  }
}