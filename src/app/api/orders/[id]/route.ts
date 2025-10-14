// app/api/orders/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// In app/api/orders/[id]/route.ts - Update the PATCH method:

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isAdmin = session.user.email === 'britcartbd@gmail.com';
    const body = await request.json();
    const { action, status: newStatus, paymentStatus, adminNotes } = body;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if order exists
    const existingOrder = await prisma.order.findFirst({
      where: { 
        id,
        // For non-admin, check if order belongs to user
        ...(isAdmin ? {} : { userId: user.id })
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                stock: true
              }
            }
          }
        }
      }
    });

    if (!existingOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Handle different update scenarios
    if (action === 'cancel') {
      // Cancellation logic - restore stock
      if (!['PENDING', 'CONFIRMED'].includes(existingOrder.status)) {
        return NextResponse.json(
          { 
            error: 'Order cannot be cancelled',
            message: 'Only orders with PENDING or CONFIRMED status can be cancelled.'
          },
          { status: 400 }
        );
      }

      const updatedOrder = await prisma.$transaction(async (tx) => {
        // 1. FIRST: Increase stock for all order items
        for (const item of existingOrder.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { 
              stock: { 
                increment: item.quantity 
              } 
            }
          });
        }

        // 2. SECOND: Update order status
        const updated = await tx.order.update({
          where: { id },
          data: {
            status: 'CANCELLED',
            paymentStatus: existingOrder.paymentStatus === 'COMPLETED' ? 'REFUNDED' : 'FAILED'
          },
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
            shippingAddress: true,
            user: isAdmin ? { select: { id: true, name: true, email: true } } : undefined
          }
        });

        return updated;
      });

      return NextResponse.json({ 
        order: updatedOrder,
        message: 'Order cancelled successfully. Stock has been restored.' 
      });
    } else if (isAdmin && (newStatus || paymentStatus || adminNotes)) {
      // Admin update for status, payment status, or notes
      const updateData: any = {};
      
      if (newStatus) updateData.status = newStatus;
      if (paymentStatus) updateData.paymentStatus = paymentStatus;
      if (adminNotes !== undefined) updateData.adminNotes = adminNotes;

      // Handle stock management for status changes
      if (newStatus && existingOrder.status !== newStatus) {
        return await prisma.$transaction(async (tx) => {
          // If changing from CANCELLED to active status, reduce stock
          if (existingOrder.status === 'CANCELLED' && newStatus !== 'CANCELLED') {
            for (const item of existingOrder.items) {
              await tx.product.update({
                where: { id: item.productId },
                data: { 
                  stock: { 
                    decrement: item.quantity 
                  } 
                }
              });
            }
          }
          // If changing from active status to CANCELLED, restore stock
          else if (existingOrder.status !== 'CANCELLED' && newStatus === 'CANCELLED') {
            for (const item of existingOrder.items) {
              await tx.product.update({
                where: { id: item.productId },
                data: { 
                  stock: { 
                    increment: item.quantity 
                  } 
                }
              });
            }
          }

          const updatedOrder = await tx.order.update({
            where: { id },
            data: updateData,
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
              shippingAddress: true,
              user: { select: { id: true, name: true, email: true } }
            }
          });

          return NextResponse.json({ 
            order: updatedOrder,
            message: 'Order updated successfully.' + 
              (newStatus === 'CANCELLED' ? ' Stock has been restored.' : 
               existingOrder.status === 'CANCELLED' ? ' Stock has been reduced.' : '')
          });
        });
      } else {
        // No status change, just update normally
        const updatedOrder = await prisma.order.update({
          where: { id },
          data: updateData,
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
            shippingAddress: true,
            user: { select: { id: true, name: true, email: true } }
          }
        });

        return NextResponse.json({ 
          order: updatedOrder,
          message: 'Order updated successfully.' 
        });
      }
    } else {
      return NextResponse.json(
        { error: 'Invalid action or insufficient permissions' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}

// DELETE order (admin can delete any order, users only their pending orders)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isAdmin = session.user.email === 'britcartbd@gmail.com';

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if order exists
    const existingOrder = await prisma.order.findFirst({
      where: { 
        id,
        // For non-admin, check if order belongs to user
        ...(isAdmin ? {} : { userId: user.id })
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                stock: true
              }
            }
          }
        }
      }
    });

    if (!existingOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Check permissions for deletion
    if (!isAdmin && existingOrder.status !== 'PENDING') {
      return NextResponse.json(
        { 
          error: 'Order cannot be deleted',
          message: 'Only orders with PENDING status can be deleted. Please cancel the order instead.'
        },
        { status: 400 }
      );
    }

    // Delete order and increase stock using transaction
    await prisma.$transaction(async (tx) => {
      // Increase stock for all order items (unless admin wants to keep stock reduced)
      for (const item of existingOrder.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { 
            stock: { 
              increment: item.quantity 
            } 
          }
        });
      }

      // Delete the order
      await tx.order.delete({
        where: { id }
      });
    });

    return NextResponse.json({ 
      message: 'Order deleted successfully. Stock has been restored.' 
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json(
      { error: 'Failed to delete order' },
      { status: 500 }
    );
  }
}