"use client";

import React from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/Layout/AppShell";
import ClientRegistryView from "@/components/Clients/ClientRegistryView";

export default function ClientsPage() {
  const router = useRouter();

  return (
    <AppShell>
      <ClientRegistryView onEnterClient={() => router.push("/clients/register")} />
    </AppShell>
  );
}
