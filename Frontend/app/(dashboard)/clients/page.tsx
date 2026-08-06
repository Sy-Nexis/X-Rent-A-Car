"use client";

import React from "react";
import { useRouter } from "next/navigation";
import ClientRegistryView from "@/components/Clients/ClientRegistryView";

export default function ClientsPage() {
  const router = useRouter();

  return <ClientRegistryView onEnterClient={() => router.push("/clients/register")} />;
}
