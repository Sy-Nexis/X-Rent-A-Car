import React, { Suspense } from "react";
import LoginForm from "@/components/Auth/LoginForm";

export const metadata = {
  title: "Authorized Access | xrent CAR",
  description: "Secure login terminal for xrent fleet management system.",
};

export default function LoginPage() {
  return (
    <main>
      <Suspense fallback={
        <div className="min-h-screen bg-[#1c1c1e] flex flex-col items-center justify-center p-6 text-gray-500 font-bold uppercase tracking-widest text-[10px]">
          Loading Terminal...
        </div>
      }>
        <LoginForm />
      </Suspense>
    </main>
  );
}

