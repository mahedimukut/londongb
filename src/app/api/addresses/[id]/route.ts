import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// PUT update address
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // ✅ await context.params
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      firstName,
      lastName,
      street,
      city,
      state,
      postalCode,
      country,
      phone,
      isDefault,
    } = body;

    if (
      !firstName ||
      !lastName ||
      !street ||
      !city ||
      !state ||
      !postalCode ||
      !phone
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const existingAddress = await prisma.address.findFirst({
      where: { id, userId: user.id },
    });

    if (!existingAddress) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    if (isDefault) {
      await prisma.address.updateMany({
        where: {
          userId: user.id,
          isDefault: true,
          id: { not: id },
        },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.update({
      where: { id },
      data: {
        firstName,
        lastName,
        street,
        city,
        state,
        postalCode,
        country: country || "Bangladesh",
        phone,
        isDefault: isDefault || false,
      },
    });

    return NextResponse.json({ address });
  } catch (error) {
    console.error("Error updating address:", error);
    return NextResponse.json(
      { error: "Failed to update address" },
      { status: 500 }
    );
  }
}

// DELETE address
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // ✅ await context.params
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const address = await prisma.address.findFirst({
      where: { id, userId: user.id },
      include: { orders: true },
    });

    if (!address) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    if (address.orders && address.orders.length > 0) {
      return NextResponse.json(
        {
          error: "Cannot delete address that is associated with orders",
          orderCount: address.orders.length,
        },
        { status: 400 }
      );
    }

    await prisma.address.delete({ where: { id } });

    return NextResponse.json({ message: "Address deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting address:", error);

    if (error.code === "P2003") {
      return NextResponse.json(
        {
          error: "Cannot delete address that is associated with existing orders",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to delete address" },
      { status: 500 }
    );
  }
}
