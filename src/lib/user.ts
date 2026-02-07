import { clerkClient } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

/**
 * Get user from database, creating them if they don't exist.
 * This handles cases where the Clerk webhook hasn't synced the user yet.
 */
export async function getOrCreateUser(clerkId: string) {
  // Try to find existing user
  let user = await prisma.user.findUnique({
    where: { clerkId },
  });

  if (user) {
    return user;
  }

  // User not in database - fetch from Clerk and create
  const client = await clerkClient();
  const clerkUser = await client.users.getUser(clerkId);

  const email = clerkUser.emailAddresses[0]?.emailAddress;
  if (!email) {
    throw new Error("User has no email address");
  }

  const name =
    [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || null;

  user = await prisma.user.create({
    data: {
      clerkId,
      email,
      name,
      avatarUrl: clerkUser.imageUrl,
    },
  });

  return user;
}
