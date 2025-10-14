// app/api/cart/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// PUT update cart item quantity
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { quantity } = body;

    if (!quantity || quantity < 1) {
      return NextResponse.json(
        { error: 'Valid quantity is required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if cart item exists and belongs to user
    const cartItem = await prisma.cartItem.findFirst({
      where: { 
        id,
        userId: user.id 
      },
      include: {
        product: {
          select: { stock: true }
        }
      }
    });

    if (!cartItem) {
      return NextResponse.json({ error: 'Cart item not found' }, { status: 404 });
    }

    // Validate quantity against stock
    const newQuantity = Math.min(quantity, cartItem.product.stock);

    const updatedCartItem = await prisma.cartItem.update({
      where: { id },
      data: { quantity: newQuantity },
      include: {
        product: {
          include: {
            images: { take: 1 }
          }
        }
      }
    });

    const responseItem = {
      id: updatedCartItem.id,
      productId: updatedCartItem.productId,
      name: updatedCartItem.product.name,
      price: updatedCartItem.product.price,
      quantity: updatedCartItem.quantity,
      color: updatedCartItem.color,
      size: updatedCartItem.size,
      image: updatedCartItem.product.images[0]?.url || '/placeholder-product.jpg',
      slug: updatedCartItem.product.slug,
      stock: updatedCartItem.product.stock,
      maxQuantity: Math.min(updatedCartItem.product.stock)
    };

    return NextResponse.json(responseItem);
  } catch (error) {
    console.error('Error updating cart item:', error);
    return NextResponse.json(
      { error: 'Failed to update cart item' },
      { status: 500 }
    );
  }
}

// DELETE remove item from cart
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

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if cart item exists and belongs to user
    const cartItem = await prisma.cartItem.findFirst({
      where: { 
        id,
        userId: user.id 
      }
    });

    if (!cartItem) {
      return NextResponse.json({ error: 'Cart item not found' }, { status: 404 });
    }

    await prisma.cartItem.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Error removing cart item:', error);
    return NextResponse.json(
      { error: 'Failed to remove item from cart' },
      { status: 500 }
    );
  }
}