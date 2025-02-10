import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { db } from "../lib/prisma";

export const checkUser = async () => {
    const user = await currentUser();

    if (!user) {
        console.log("No user found");
        return null;
    }

    try {
        const loggedInUser = await db?.user.findUnique({
            where: {
                clerkUserId: user.id,
            },
        });

        if (loggedInUser) {
            console.log("Logged in user found:", loggedInUser);
            return loggedInUser;
        }

        const name = `${user.firstName} ${user.lastName}`;

        await clerkClient.user?.updateUser(user.id, {
            username: name.split(" ").join("-") + user.id.slice(-4),
        });

        const newUser = await db.user.create({
            data: {
                clerkUserId: user.id,
                name,
                imageUrl: user.imageUrl,
                email: user.emailAddresses[0].emailAddress,
                username: name.split(" ").join("-") + user.id.slice(-4),

            },
        });

        console.log("New user created:", newUser);
        return newUser;
    } catch (error) {
        console.log(error);
    }
};