import React, { Suspense } from "react";
import LoginView from "@/components/Auth/LoginView";

export const metadata = {
  title: "Authorized Access | xrent CAR",
  description: "Secure login terminal for xrent fleet management system.",
};

export default function LoginPage() {
  return (
    <main>
      <Suspense fallback={
        <div className="min-h-screen bg-[#0e0e11] flex flex-col items-center justify-center p-6 text-gray-500 font-bold uppercase tracking-widest text-[10px]">
          Loading Terminal...
        </div>
      }>
        <LoginView />
      </Suspense>
    </main>
  );
}

