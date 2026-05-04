import React from "react";
import LoginForm from "@/components/Auth/LoginForm";

export const metadata = {
  title: "Authorized Access | xrent CAR",
  description: "Secure login terminal for xrent fleet management system.",
};

export default function LoginPage() {
  return (
    <main>
      <LoginForm />
    </main>
  );
}
