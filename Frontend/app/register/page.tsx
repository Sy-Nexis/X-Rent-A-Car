"use client";

import React from "react";
import { useRouter } from "next/navigation";
import RegisterView from "@/components/Auth/RegisterView";


export default function RegisterPage() {
  const router = useRouter();

  return (
    <main>
      <RegisterView
        onRegisterSuccess={() => router.push("/login")}
        onGoToLogin={() => router.push("/login")}
      />
    </main>
  );
}
