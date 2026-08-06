"use client";

import React from "react";
import { useRouter } from "next/navigation";
import FleetListView from "@/components/Vehicles/FleetListView";

export default function VehiclesPage() {
  const router = useRouter();

  return <FleetListView onAddVehicle={() => router.push("/vehicles/new")} />;
}
