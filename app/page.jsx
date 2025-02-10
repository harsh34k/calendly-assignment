"use client";

import { useState } from "react";
import { Button } from "../components/ui/button";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import EventDialog from "../components/EventDialog";
import Link from "next/link";

const people = [
  { name: "Harsh Kumar", image: "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18yc25XeHpMNURja1dETXJKOFlvTjZqS2NyVmMifQ?width=80", username: "Harsh-KumarAxRP" },
  { name: "Michael Smith", image: "https://randomuser.me/api/portraits/men/2.jpg" },
  { name: "Sophia Brown", image: "https://randomuser.me/api/portraits/women/3.jpg" },
];


export default function Home() {
  const [open, setOpen] = useState(false);

  return (
    <div className="py-2 gap-4">
      <div className="flex items-center justify-center gap-4">
        {/* Event Dialog Component */}
        <EventDialog open={open} setOpen={setOpen} />

        {/* Auth Buttons */}
        <SignedOut>
          <SignInButton>
            <Button variant="outline">Login</Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>

      </div>
      {/* Attendees Section (Horizontal Layout) */}
      <div className="mt-4 border-t pt-4">

        <div className="flex items-center justify-center gap-4">
          {people.map((person, index) => (
            <Link href={`/${person.username}`} key={index}>
              <div key={index} className="flex flex-col items-center">
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
