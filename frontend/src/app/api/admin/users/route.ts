import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ success: true, users });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { name, email, role } = body;

    if (!email || !name) {
      return NextResponse.json(
        { success: false, error: "Name and email are required" },
        { status: 400 }
      );
    }

    const newUser = await prisma.user.create({
      data: {
        id: `user-${Date.now()}`,
        name,
        email: email.toLowerCase().trim(),
        role: role ? role.toUpperCase() : "ENGINEER",
      },
    });

    return NextResponse.json({ success: true, user: newUser }, { status: 200 });
  } catch (error: any) {
    console.error("POST user error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Database write failed" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { id, role } = body;

    if (!id || !role) {
      return NextResponse.json(
        { success: false, error: "ID and role are required" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role: role.toUpperCase() },
    });

    return NextResponse.json({ success: true, user: updatedUser }, { status: 200 });
  } catch (error: any) {
    console.error("PATCH user error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Update failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const email = searchParams.get("email");

    if (!id && !email) {
      return NextResponse.json({ success: false, error: "User ID or email is required" }, { status: 400 });
    }

    // Try deleting by ID first, fallback to email if needed
    try {
      if (id) {
        await prisma.user.delete({ where: { id } });
      } else if (email) {
        await prisma.user.delete({ where: { email } });
      }
    } catch (dbErr) {
      // If record wasn't found by ID, try deleting by their email address as a fallback
      if (email) {
        await prisma.user.delete({ where: { email } });
      } else {
        throw dbErr;
      }
    }

    return NextResponse.json({ success: true, message: "User deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("DELETE user error:", error);
    return NextResponse.json({ success: false, error: error.message || "Delete failed" }, { status: 500 });
  }
}