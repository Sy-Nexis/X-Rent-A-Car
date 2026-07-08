import React from "react";
import RegisterForm from "@/components/Auth/RegisterForm";

export const metadata = {
  title: "Personnel Onboarding | xrent CAR",
  description: "Secure registration terminal for new xrent administrative staff.",
};

export default function RegisterPage() {
  return (
    <main>
      <RegisterForm />
    </main>
  );
}
