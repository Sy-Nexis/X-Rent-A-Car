"use client";

import React from "react";
import AppShell from "@/components/Layout/AppShell";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <AppShell onAddUnit={() => router.push("/vehicles/new")}>
      {children}
    </AppShell>
  );
}
