"use server";

import { db } from "../lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function createEvent(data) {
    const { userId } = auth();

    console.log("userId", userId);
    console.log("data", data);

    const user2 = await currentUser()
    console.log("user2", user2);
    const user = await db.user.findUnique({
        where: { clerkUserId: user2.id },
    });
    console.log("user", user);

    if (!user) {
        throw new Error("User not found");
    }

    const event = await db.event.create({
        data: {
            ...data,
            userId: user.id,
        },
    });
    console.log("event", event);

    return event;
}

export async function getUserEvents() {

    const user2 = await currentUser()
    const user = await db.user.findUnique({
        where: { clerkUserId: user2.id },
    });

    if (!user) {
        throw new Error("User not found");
    }

    const events = await db.event.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        include: {
            _count: {
                select: { bookings: true },
            },
        },
    });
    console.log("events", events);


    return { events, username: user.username };
}

export async function deleteEvent(eventId) {
    const user2 = await currentUser()
    const user = await db.user.findUnique({
        where: { clerkUserId: user2.id },
    });
    if (!user) {
        throw new Error("User not found");
    }

    const event = await db.event.findUnique({
        where: { id: eventId },
    });

    if (!event || event.userId !== user.id) {
        throw new Error("Event not found or unauthorized");
    }

    await db.event.delete({
        where: { id: eventId },
    });

    return { success: true };
}

export async function getEventDetails(username, eventId) {
    const event = await db.event.findFirst({
        where: {
            id: eventId,
            user: {
                username: username,
            },
        },
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                    imageUrl: true,
                },
            },
        },
    });

    return event;
}
