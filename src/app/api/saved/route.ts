import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/user";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get user from database (creates if not synced yet)
  const user = await getOrCreateUser(userId);

  const savedDesigns = await prisma.savedDesign.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      design: {
        select: {
          id: true,
          name: true,
          description: true,
          imageUrl: true,
          category: true,
          tags: true,
        },
      },
    },
  });

  return NextResponse.json({ savedDesigns });
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { designId } = body;

  if (!designId) {
    return NextResponse.json(
      { error: "Design ID is required" },
      { status: 400 }
    );
  }

  // Get user from database (creates if not synced yet)
  const user = await getOrCreateUser(userId);

  // Check if design exists
  const design = await prisma.tattooDesign.findUnique({
    where: { id: designId },
  });

  if (!design) {
    return NextResponse.json({ error: "Design not found" }, { status: 404 });
  }

  // Check if already saved
  const existing = await prisma.savedDesign.findUnique({
    where: {
      userId_designId: {
        userId: user.id,
        designId,
      },
    },
  });

  if (existing) {
    return NextResponse.json(
      { error: "Design already saved" },
      { status: 400 }
    );
  }

  const savedDesign = await prisma.savedDesign.create({
    data: {
      userId: user.id,
      designId,
    },
    include: {
      design: true,
    },
  });

  return NextResponse.json({ savedDesign }, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { designId } = body;

  if (!designId) {
    return NextResponse.json(
      { error: "Design ID is required" },
      { status: 400 }
    );
  }

  // Get user from database (creates if not synced yet)
  const user = await getOrCreateUser(userId);

  await prisma.savedDesign.delete({
    where: {
      userId_designId: {
        userId: user.id,
        designId,
      },
    },
  });

  return NextResponse.json({ success: true });
}
