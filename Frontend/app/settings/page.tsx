"use client";

import React from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/Layout/AppShell";
import SettingsView from "@/components/Settings/SettingsView";

export default function SettingsPage() {
  const router = useRouter();

  return (
    <AppShell>
      <SettingsView onLogout={() => router.push("/")} />
    </AppShell>
  );
}
