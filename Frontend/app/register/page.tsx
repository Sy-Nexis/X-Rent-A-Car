import React from "react";
import RegisterForm from "@/components/Auth/RegisterForm";

export const metadata = {
  title: "Personnel Onboarding | XNRENT CAR",
  description: "Secure registration terminal for new XNRENT administrative staff.",
};

export default function RegisterPage() {
  return (
    <main>
      <RegisterForm />
    </main>
  );
}
