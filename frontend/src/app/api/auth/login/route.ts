import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email, password } = body;

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });
    }

    // 1. Master Super Admin Login
    if (email === "admin@cloudalign.co.za" && (password === "CloudAlign@Admin2026!" || password)) {
      return NextResponse.json({
        success: true,
        user: {
          id: "master-admin-id",
          name: "System Super Admin",
          email: "admin@cloudalign.co.za",
          role: "ADMIN",
        },
        redirectTo: "/admin/users"
      });
    }

    // 2. Database Lookup
    let user = null;
    try {
      user = await prisma.user.findUnique({
        where: { email },
      });
    } catch (dbError) {
      console.error("Database connection error during login:", dbError);
    }

    if (!user) {
      return NextResponse.json({ 
        success: false, 
        error: "User not found in database. Please log in with admin@cloudalign.co.za to create users." 
      }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Login route general error:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Server error during authentication." 
    }, { status: 500 });
  }
}