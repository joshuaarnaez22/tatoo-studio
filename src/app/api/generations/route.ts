import { NextResponse } from "next/server";
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

  const generations = await prisma.generation.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      prompt: true,
      imageUrl: true,
      model: true,
      cost: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ generations });
}
