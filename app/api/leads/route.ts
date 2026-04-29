import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // require admin session for retrieving leads
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const leads = await prisma.lead.findMany({ include: { property: true } });
    return NextResponse.json(leads);
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { propertyId, name, phone, email, notes } = body;
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    // if propertyId is provided, ensure property exists
    if (propertyId) {
      const property = await prisma.property.findUnique({ where: { id: Number(propertyId) } });
      if (!property) {
        return NextResponse.json({ error: 'Property not found' }, { status: 404 });
      }
    }

    const lead = await prisma.lead.create({
      data: {
        propertyId: propertyId ? Number(propertyId) : null,
        name,
        phone: phone || null,
        email: email || null,
        notes,
      },
      include: { property: true },
    });

    return NextResponse.json(lead, { status: 201 });
  } catch (error: any) {
    console.error('Error creating lead:', error);
    return NextResponse.json({ error: error.message || 'Failed to create lead' }, { status: 500 });
  }
}
