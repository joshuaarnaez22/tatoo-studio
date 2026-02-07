import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/user";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  const where = {
    isPublic: true,
    ...(category && category !== "all" ? { category } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { description: { contains: search, mode: "insensitive" as const } },
            { tags: { has: search.toLowerCase() } },
          ],
        }
      : {}),
  };

  const [designs, total] = await Promise.all([
    prisma.tattooDesign.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        name: true,
        description: true,
        imageUrl: true,
        category: true,
        tags: true,
        createdAt: true,
        _count: {
          select: { savedBy: true },
        },
      },
    }),
    prisma.tattooDesign.count({ where }),
  ]);

  return NextResponse.json({
    designs,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, description, imageUrl, category, tags, isPublic = true } = body;

  if (!name || !imageUrl || !category) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  // Get user from database (creates if not synced yet)
  const user = await getOrCreateUser(userId);

  const design = await prisma.tattooDesign.create({
    data: {
      userId: user.id,
      name,
      description,
      imageUrl,
      category,
      tags: tags || [],
      isPublic,
    },
  });

  return NextResponse.json({ design }, { status: 201 });
}
