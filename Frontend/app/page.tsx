import React from "react";
import DashboardClient from "@/components/Dashboard/DashboardClient";

export const metadata = {
  title: "Fleet Operations Dashboard | XNRENT CAR",
  description: "Real-time fleet monitoring and management terminal.",
};

export default function DashboardPage() {
  return (
    <DashboardClient />
  );
}
