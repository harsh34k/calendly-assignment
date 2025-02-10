import { getUserByUsername } from "../../actions/users"; // Import the function
import { getUserEvents } from "../../actions/events"; // Import the function
import EventCard from "../../components/event-card";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { notFound } from "next/navigation";
import { log } from "console";

export async function generateMetadata({ params }) {
    const { username } = await params;

    const user = await getUserByUsername(username);

    if (!user) {
        return {
            title: "User Not Found",
        };
    }

    return {
        title: `${user.name}'s Profile | Your App Name`,
        description: `Book an event with ${user.name}`,
    };
}

export default async function UserProfilePage({ params }) {
    const { username } = await params;
    console.log("username", typeof (username));


    const user = await getUserByUsername(username);
    console.log("yha tk to aagya");
    console.log("user y hai", user);

    // console.log("yha tk to aagya");


    if (!user) {
        notFound();
    }

    // Fetch the creator's events
    const { events } = await getUserEvents();

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col items-center mb-8">
                <Avatar className="w-24 h-24 mb-4">
                    <AvatarImage src={user.imageUrl} alt={user.name} />
                    <AvatarFallback>{user.name}</AvatarFallback>
                </Avatar>
                <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
                <p className="text-gray-600 text-center">
                    Welcome to my scheduling page. Please select an event below to book a call with me.
                </p>
            </div>

            {events.length === 0 ? (
                <p className="text-center text-gray-600">No events available.</p>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {events.map((event) => (
                        <EventCard
                            key={event.id}
                            event={event}
                            username={username}
                        />

                    ))}
                </div>
            )}
        </div>
    );
}