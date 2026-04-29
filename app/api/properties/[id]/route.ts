import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

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

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const property = await prisma.property.findUnique({ where: { id: Number(id) } });

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    // Normalize imageUrls from JSON string to array
    const normalizedProperty = {
      ...property,
      imageUrls: parseImageUrls(property.imageUrls),
    };

    return NextResponse.json(normalizedProperty);
  } catch (error) {
    console.error('Error fetching property:', error);
    return NextResponse.json({ error: 'Failed to fetch property' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const property = await prisma.property.update({
      where: { id: Number(id) },
      data: {
        ...body,
        price: body.price ? Number(body.price) : undefined,
        bedrooms: body.bedrooms ? Number(body.bedrooms) : undefined,
        bathrooms: body.bathrooms ? Number(body.bathrooms) : undefined,
        squareFeet: body.squareFeet ? Number(body.squareFeet) : undefined,
        zipCode: body.zipCode ? String(body.zipCode) : undefined,
      },
    });

    return NextResponse.json(property);
  } catch (error: any) {
    console.error('Error updating property:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }
    return NextResponse.json({ error: error.message || 'Failed to update property' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await prisma.property.delete({ where: { id: Number(id) } });

    return NextResponse.json({ message: 'Property deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting property:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete property' }, { status: 500 });
  }
}
