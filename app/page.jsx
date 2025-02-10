"use client";

import { useState } from "react";
import { Button } from "../components/ui/button";
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/nextjs";
import EventDialog from "../components/EventDialog";
import Link from "next/link";
import UserMenu from "../components/user-menu"

export default function Home() {
  const [open, setOpen] = useState(false);
  const { user, isSignedIn } = useUser(); // Fetch user details from Clerk
  //console.log("user", user);


  const people = [
    {
      name: isSignedIn ? user.fullName : "Unknown User",
      image: isSignedIn ? user?.imageUrl : "https://via.placeholder.com/80",
      username: isSignedIn ? user?.username || "unknown-user" : "unknown-user",
    },
    { name: "Michael Smith", image: "https://randomuser.me/api/portraits/men/2.jpg" },
    { name: "Sophia Brown", image: "https://randomuser.me/api/portraits/women/3.jpg" },
  ];

  return (
    <div className="py-2 gap-4">
      <div className="flex items-center justify-center gap-4">
        <EventDialog open={open} setOpen={setOpen} />

        <SignedOut>
          <SignInButton>
            <Button variant="outline">Login</Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserMenu />
        </SignedIn>
      </div>

      {/* Attendees Section */}
      <div className="mt-4 border-t pt-4">
        <div className="flex items-center justify-center gap-4">
          {people.map((person, index) => (
            <Link href={`/Harsh-KumarM7Zn`} key={index}>
              <div className="flex flex-col items-center">
                <img
                  src={person.image}
                  alt={person.name}
                  className="w-20 h-20 rounded-full border border-gray-300"
                />
                <p className="text-sm text-gray-800 mt-1">{person.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
