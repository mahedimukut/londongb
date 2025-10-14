// app/api/cart/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// GET user's cart
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        cart: {
          include: {
            product: {
              include: {
                images: { take: 1 },
                category: { select: { name: true } },
                brand: { select: { name: true } }
              }
            }
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const cartItems = user.cart.map(item => ({
      id: item.id,
      productId: item.productId,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      color: item.color,
      size: item.size,
      image: item.product.images[0]?.url || '/placeholder-product.jpg',
      slug: item.product.slug,
      stock: item.product.stock,
      maxQuantity: Math.min(item.product.stock) // Limit to stock or 10
    }));

    return NextResponse.json({ cart: cartItems });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

// POST add item to cart
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { productId, quantity = 1, color, size } = body;

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if product exists and is in stock
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { stock: true, price: true, name: true }
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    if (product.stock < quantity) {
      return NextResponse.json(
        { error: 'Insufficient stock' },
        { status: 400 }
      );
    }

    // Check if item already exists in cart
    const existingCartItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId_color_size: {
          userId: user.id,
          productId,
          color: color || '',
          size: size || ''
        }
      }
    });

    let cartItem;
    if (existingCartItem) {
      // Update quantity
      cartItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { 
          quantity: Math.min(existingCartItem.quantity + quantity, product.stock)
        },
        include: {
          product: {
            include: {
              images: { take: 1 }
            }
          }
        }
      });
    } else {
      // Create new cart item
      cartItem = await prisma.cartItem.create({
        data: {
          userId: user.id,
          productId,
          quantity: Math.min(quantity, product.stock),
          color: color || '',
          size: size || ''
        },
        include: {
          product: {
            include: {
              images: { take: 1 }
            }
          }
        }
      });
    }

    const responseItem = {
      id: cartItem.id,
      productId: cartItem.productId,
      name: cartItem.product.name,
      price: cartItem.product.price,
      quantity: cartItem.quantity,
      color: cartItem.color,
      size: cartItem.size,
      image: cartItem.product.images[0]?.url || '/placeholder-product.jpg',
      slug: cartItem.product.slug,
      stock: cartItem.product.stock,
      maxQuantity: Math.min(cartItem.product.stock)
    };

    return NextResponse.json(responseItem, { status: 201 });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { error: 'Failed to add item to cart' },
      { status: 500 }
    );
  }
}

// DELETE clear entire cart
export async function DELETE(request: NextRequest) {
  try {
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

    await prisma.cartItem.deleteMany({
      where: { userId: user.id }
    });

    return NextResponse.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    return NextResponse.json(
      { error: 'Failed to clear cart' },
      { status: 500 }
    );
  }
}