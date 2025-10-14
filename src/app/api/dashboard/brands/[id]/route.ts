// app/api/dashboard/brands/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper to extract dynamic ID param from URL
function getIdFromRequest(req: NextRequest) {
  const url = new URL(req.url);
  const parts = url.pathname.split("/");
  return parts[parts.length - 1]; // 'id' from /api/dashboard/brands/[id]
}

// GET single brand
export async function GET(request: NextRequest) {
  try {
    const id = getIdFromRequest(request);

    const brand = await prisma.brand.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    });

    if (!brand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    return NextResponse.json(brand);
  } catch (error) {
    console.error("Error fetching brand:", error);
    return NextResponse.json({ error: "Failed to fetch brand" }, { status: 500 });
  }
}

// PUT update brand
export async function PUT(request: NextRequest) {
  try {
    const id = getIdFromRequest(request);
    const session = await auth();

    if (!session || session.user?.email !== "britcartbd@gmail.com") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, slug, description, logo, isFeatured } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: "Name and slug are required" }, { status: 400 });
    }

    const existingBrand = await prisma.brand.findUnique({ where: { id } });
    if (!existingBrand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    const duplicateBrand = await prisma.brand.findFirst({
      where: {
        AND: [
          { id: { not: id } },
          { OR: [{ name }, { slug }] },
        ],
      },
    });

    if (duplicateBrand) {
      return NextResponse.json(
        { error: "Another brand with this name or slug already exists" },
        { status: 409 }
      );
    }

    const updatedBrand = await prisma.brand.update({
      where: { id },
      data: {
        name,
        slug,
        description: description || null,
        logo: logo || existingBrand.logo,
        isFeatured: isFeatured || false,
      },
    });

    return NextResponse.json(updatedBrand);
  } catch (error) {
    console.error("Error updating brand:", error);
    return NextResponse.json({ error: "Failed to update brand" }, { status: 500 });
  }
}

// DELETE brand
export async function DELETE(request: NextRequest) {
  try {
    const id = getIdFromRequest(request);
    const session = await auth();

    if (!session || session.user?.email !== "britcartbd@gmail.com") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const brand = await prisma.brand.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    });

    if (!brand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    if (brand._count.products > 0) {
      return NextResponse.json(
        { error: "Cannot delete brand with associated products" },
        { status: 400 }
      );
    }

    if (brand.logo) {
      try {
        const urlParts = brand.logo.split("/");
        const publicIdWithExtension = urlParts[urlParts.length - 1];
        const publicId = publicIdWithExtension.split(".")[0];
        const folderIndex = urlParts.indexOf("britcartbd");
        if (folderIndex !== -1) {
          const folderPath = urlParts.slice(folderIndex, urlParts.length - 1).join("/");
          const fullPublicId = `${folderPath}/${publicId}`;
          await cloudinary.uploader.destroy(fullPublicId);
        }
      } catch (deleteError) {
        console.error("Error deleting logo from Cloudinary:", deleteError);
      }
    }

    await prisma.brand.delete({ where: { id } });

    return NextResponse.json({ message: "Brand deleted successfully" });
  } catch (error) {
    console.error("Error deleting brand:", error);
    return NextResponse.json({ error: "Failed to delete brand" }, { status: 500 });
  }
}
