"use client";

import React from "react";
import { useRouter } from "next/navigation";
import LandingView from "@/components/Landing/LandingView";

export default function Home() {
  const router = useRouter();
  return <LandingView onEnter={() => router.push("/login")} />;
}
