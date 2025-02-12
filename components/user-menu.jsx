"use client";

import { UserButton } from "@clerk/nextjs";
import { ChartNoAxesGantt } from "lucide-react";

const UserMenu = () => {
  return (
    <UserButton
      appearance={{
        elements: {
          avatarBox: "w-10 h-10",
        },
      }}
    >
      <UserButton.MenuItems>
        <UserButton.Link
          label="Your Availability"
          labelIcon={<ChartNoAxesGantt size={15} />}
          href="/availability"
        />
        <UserButton.Action label="manageAccount" />
      </UserButton.MenuItems>
    </UserButton>
  );
};

export default UserMenu;
