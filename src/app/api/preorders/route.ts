// app/api/preorders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { auth } from '@/auth';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET all preorders - PROTECTED (Admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    // Only admin can access preorders list
    if (!session || session.user?.email !== 'britcartbd@gmail.com') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') || '';
    
    const skip = (page - 1) * limit;

    const { prisma } = await import('@/lib/prisma');

    // Build where clause for filtering
    const where: any = {};
    if (status) {
      where.status = status;
    }

    const [preorders, total] = await Promise.all([
      prisma.preorder.findMany({
        where,
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.preorder.count({ where })
    ]);

    return NextResponse.json({
      preorders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching preorders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch preorders' },
      { status: 500 }
    );
  }
}

// POST create new preorder - PUBLIC
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Extract text fields
    const productName = formData.get('productName') as string;
    const productDescription = formData.get('productDescription') as string;
    const category = formData.get('category') as string;
    const urgency = formData.get('urgency') as string;
    const budget = formData.get('budget') as string;
    const quantity = formData.get('quantity') as string;
    const customerName = formData.get('customerName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const additionalNotes = formData.get('additionalNotes') as string;

    // Validate required fields
    if (!productName || !productDescription || !category || !customerName || !email || !phone) {
      return NextResponse.json(
        { error: 'Product name, description, category, customer name, email, and phone are required' },
        { status: 400 }
      );
    }

    // Handle image uploads to Cloudinary
    const imageFiles = formData.getAll('images') as File[];
    const uploadedImageUrls: string[] = [];

    // Upload images to Cloudinary (max 3)
    if (imageFiles.length > 0) {
      for (const file of imageFiles.slice(0, 3)) { // Limit to 3 images
        try {
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);

          // Convert to base64 for Cloudinary
          const base64Image = `data:${file.type};base64,${buffer.toString('base64')}`;

          const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload(
              base64Image,
              {
                folder: 'britcartbd/preorders',
                resource_type: 'image',
                transformation: [
                  { width: 800, height: 800, crop: 'limit' },
                  { quality: 'auto' },
                  { format: 'webp' }
                ]
              },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            );
          });

          if (uploadResult && typeof uploadResult === 'object' && 'secure_url' in uploadResult) {
            uploadedImageUrls.push((uploadResult as any).secure_url);
          }
        } catch (uploadError) {
          console.error('Error uploading image to Cloudinary:', uploadError);
          // Continue with other images even if one fails
        }
      }
    }

    // Create preorder in database
    const { prisma } = await import('@/lib/prisma');
    
    const preorder = await prisma.preorder.create({
      data: {
        productName,
        productDescription,
        category,
        urgency,
        budget: budget || null,
        quantity: parseInt(quantity) || 1,
        customerName,
        email,
        phone,
        additionalNotes: additionalNotes || null,
        images: uploadedImageUrls,
      },
    });

    // Here you can also send email notifications to admin
    // await sendPreorderNotification(preorder);

    return NextResponse.json(
      { 
        message: 'Preorder request submitted successfully', 
        preorder 
      }, 
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating preorder:', error);
    return NextResponse.json(
      { error: 'Failed to submit preorder request' },
      { status: 500 }
    );
  }
}