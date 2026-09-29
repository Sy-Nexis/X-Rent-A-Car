"use client";

import React, { useEffect, useState } from "react";
import AppShell from "@/components/Layout/AppShell";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (!token) {
          setIsAuthenticated(false);
          router.replace("/");
        } else {
          setIsAuthenticated(true);
        }
      }
    };

    checkAuth();
  }, [router]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0e0e11] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-brand-cyan border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-bold text-gray-400">Verifying session...</span>
        </div>
      </div>
    );
  }

  return (
    <AppShell onAddUnit={() => router.push("/vehicles/new")}>
      {children}
    </AppShell>
  );
}
