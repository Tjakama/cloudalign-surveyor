import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';
const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const where = category ? { category: category as any } : {};
    const items = await prisma.inventoryItem.findMany({
      where,
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ success: true, items });
  } catch (error) {
    console.error('Failed to fetch inventory:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch inventory' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newItem = await prisma.inventoryItem.create({
      data: {
        category: body.category,
        name: body.name,
        description: body.description,
        unit: body.unit || 'Units',
        technicalSpecs: body.technicalSpecs,
        unitCost: parseFloat(body.unitCost || 0),
        stockQuantity: parseInt(body.stockQuantity || 0),
      },
    });

    return NextResponse.json({ success: true, item: newItem });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create inventory item' }, { status: 500 });
  }
}