import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/* =========================
   SAFE IMAGE URL PARSER
========================= */
function parseImageUrls(input: any): string[] {
  if (!input) return [];

  // already array
  if (Array.isArray(input)) return input;

  // string case (old DB or wrong input)
  if (typeof input === 'string') {
    try {
      const parsed = JSON.parse(input);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  return [];
}

/* =========================
   GET PROPERTIES
========================= */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const city = searchParams.get('city');
    const status = searchParams.get('status') || 'available';
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const propertyType = searchParams.get('propertyType');
    const limit = parseInt(searchParams.get('_limit') || '0', 10);

    const where: any = { status };

    if (city) {
      const trimmedCity = city.trim();
      if (trimmedCity) {
        where.city = {
          contains: trimmedCity,
          mode: 'insensitive',
        };
      }
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = Number(minPrice);
      if (maxPrice) where.price.lte = Number(maxPrice);
    }

    if (propertyType) {
      where.propertyType = propertyType;
    }

    const properties = await prisma.property.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit > 0 ? limit : undefined,
    });

    console.log('🔍 [GET] Properties count:', properties.length);

    const normalized = properties.map((p, i) => {
      const imageUrls = parseImageUrls(p.imageUrls);

      console.log(`🖼️ [GET] Property ${i} imageUrls:`, imageUrls);

      return {
        ...p,
        imageUrls,
      };
    });

    return NextResponse.json(normalized);
  } catch (error) {
    console.error('❌ Error fetching properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}

/* =========================
   CREATE PROPERTY
========================= */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log('📥 [POST] Incoming imageUrls:', body.imageUrls);

    const requiredFields = [
      'title',
      'description',
      'price',
      'address',
      'city',
      'state',
      'zipCode',
      'bedrooms',
      'bathrooms',
      'squareFeet',
      'propertyType',
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const property = await prisma.property.create({
      data: {
        title: body.title,
        description: body.description,
        price: Number(body.price),
        address: body.address,
        city: body.city,
        state: body.state,
        zipCode: String(body.zipCode),
        bedrooms: Number(body.bedrooms),
        bathrooms: Number(body.bathrooms),
        squareFeet: Number(body.squareFeet),
        propertyType: body.propertyType,
        status: body.status || 'available',

        imageUrls: parseImageUrls(body.imageUrls),
      },
    });

    console.log('💾 [POST] Saved imageUrls:', property.imageUrls);

    return NextResponse.json(
      {
        ...property,
        imageUrls: parseImageUrls(property.imageUrls),
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('❌ Error creating property:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create property' },
      { status: 500 }
    );
  }
}