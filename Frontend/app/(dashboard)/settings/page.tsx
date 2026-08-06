"use client";

import React from "react";
import { useRouter } from "next/navigation";
import SettingsView from "@/components/Settings/SettingsView";

export default function SettingsPage() {
  const router = useRouter();

  return <SettingsView onLogout={() => router.push("/")} />;
}
