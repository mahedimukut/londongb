// app/api/orders/[id]/payment-status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    
    // Check if user is authenticated
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { paymentStatus } = body;

    if (!paymentStatus || !['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REFUNDED'].includes(paymentStatus)) {
      return NextResponse.json(
        { error: 'Invalid payment status' },
        { status: 400 }
      );
    }

    // Update payment status
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { paymentStatus },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { take: 1 }
              }
            }
          }
        },
        shippingAddress: true
      }
    });

    return NextResponse.json({ 
      order: updatedOrder,
      message: 'Payment status updated successfully' 
    });
  } catch (error) {
    console.error('Error updating payment status:', error);
    return NextResponse.json(
      { error: 'Failed to update payment status' },
      { status: 500 }
    );
  }
}