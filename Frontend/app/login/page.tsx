"use client";

import React from "react";
import { useRouter } from "next/navigation";
import LoginView from "@/components/Auth/LoginView";

export default function LoginPage() {
  const router = useRouter();

  return (
    <main>
      <LoginView
        onLoginSuccess={() => router.push("/dashboard")}
        onGoToRegister={() => router.push("/register")}
      />
    </main>
  );
}
