"use client";

import React from "react";
import { useRouter } from "next/navigation";
import LoginView from "@/components/Auth/LoginView";

export default function Home() {
  const router = useRouter();

  return (
    <main>
      <LoginView
        onLoginSuccess={() => router.push("/dashboard")}
      />
    </main>
  );
}
