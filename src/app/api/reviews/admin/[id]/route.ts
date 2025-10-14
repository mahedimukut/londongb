// app/api/reviews/admin/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

interface Params {
  params: {
    id: string;
  };
}

// PATCH update review status
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const session = await auth();
    
    // Admin check
    if (!session?.user?.email || session.user.email !== 'britcartbd@gmail.com') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params; // AWAIT the params
    const body = await request.json();
    const { status } = body;

    if (!status || !['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json(
        { error: 'Valid status is required' },
        { status: 400 }
      );
    }

    // Update review status - use the status directly
    const updatedReview = await prisma.review.update({
      where: { id },
      data: { 
        status: status, // This should work with your enum
        isVerified: status === 'APPROVED'
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
          }
        },
        product: {
          select: {
            name: true,
            images: true
          }
        }
      }
    });

    // If approved or rejected, update product rating
    if (status === 'APPROVED' || status === 'REJECTED') {
      await updateProductRating(updatedReview.productId);
    }

    return NextResponse.json({ review: updatedReview });
  } catch (error: any) {
    console.error('Error updating review:', error);
    
    // More detailed error response
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }
    
    return NextResponse.json(
      { error: 'Failed to update review', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE review
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const session = await auth();
    
    // Admin check
    if (!session?.user?.email || session.user.email !== 'britcartbd@gmail.com') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params; // AWAIT the params

    const review = await prisma.review.findUnique({
      where: { id },
      select: { productId: true }
    });

    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    await prisma.review.delete({
      where: { id }
    });

    // Update product rating after deletion
    await updateProductRating(review.productId);

    return NextResponse.json({ message: 'Review deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting review:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }
    
    return NextResponse.json(
      { error: 'Failed to delete review', details: error.message },
      { status: 500 }
    );
  }
}

async function updateProductRating(productId: string) {
  try {
    const productReviews = await prisma.review.findMany({
      where: { 
        productId,
        status: 'APPROVED'
      }
    });

    const totalRating = productReviews.reduce((sum, rev) => sum + rev.rating, 0);
    const averageRating = productReviews.length > 0 ? totalRating / productReviews.length : 0;

    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: averageRating,
        reviewCount: productReviews.length
      }
    });
  } catch (error) {
    console.error('Error updating product rating:', error);
  }
}