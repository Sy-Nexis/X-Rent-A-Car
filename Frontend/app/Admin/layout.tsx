import React from "react";
import AdminNavbar from "@/components/Navigation/AdminNavbar";
import MobileNavWrapper from "@/components/Navigation/MobileNavWrapper";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const cookieStore = await cookies();
  const token = cookieStore.get("xrent_token");

  if (!token) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#000000] flex flex-col lg:flex-row">
      {/* MOBILE HEADER/NAVIGATION WRAPPER */}
      <MobileNavWrapper />

      {/* PERSISTENT SIDEBAR NAVIGATION (Desktop) */}
      <AdminNavbar />

      {/* MAIN CONTENT WORKSPACE */}
      <main className="flex-1 lg:ml-72 min-h-screen relative overflow-y-auto pb-16 lg:pb-0 flex flex-col">
        {/* PAGE CONTENT */}
        <div className="relative z-10 flex-1 flex flex-col">
          {children}
        </div>

        {/* GLOBAL BACKGROUND ELEMENTS */}
        <div className="fixed inset-0 bg-[#0a0a0a] -z-20 pointer-events-none" />
        <div className="fixed top-0 right-0 w-[1000px] h-[1000px] bg-blue-600/[0.03] blur-[150px] rounded-full -z-10 pointer-events-none" />
      </main>
    </div>
  );
}

