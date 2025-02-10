import React from "react";
import AvailabilityForm from "./_components/availability-form";
import { getUserAvailability } from "@/actions/availability";
import { defaultAvailability } from "./data";

export default async function AvailabilityPage() {
  const availability = await getUserAvailability();
  //console.log("availability1", availability);


  return <AvailabilityForm initialData={availability ? availability : defaultAvailability} />;
}
// availability || defaultAvailability