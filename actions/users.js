"use server";

import { db } from "../lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function updateUsername(username) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Find the user in the database
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Check if the new username is already taken by another user
  const existingUser = await db.user.findUnique({
    where: { username },
  });

  if (existingUser) {
    throw new Error("Username is already taken");
  }

  // Update username in the database
  await db.user.update({
    where: { id: user.id },
    data: { username },
  });

  // Update username in Clerk
  await clerkClient.users.updateUser(userId, {
    username,
  });

  return { success: true };
}

export async function getUserByUsername(username) {
  return await db.user.findUnique({
    where: { username: username },
    select: {
      id: true,
      name: true,
      email: true,
      imageUrl: true,
      events: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          description: true,
          duration: true,
          price: true, // Included price field
          _count: { select: { bookings: true } },
        },
      },
    },
  });
}
// export async function getUserByUsername(username) {
//   console.log("hello", username);
//   // console.log("hello",username);

// }

