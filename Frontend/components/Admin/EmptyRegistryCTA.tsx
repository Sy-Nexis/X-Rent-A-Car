"use client";

import React from "react";
import { motion } from "framer-motion";
import { UserPlus } from "lucide-react";
import Link from "next/link";

/**
 * EmptyRegistryCTA: An isolated client component for the interactive call-to-action.
 * This ensures the heavy button micro-interactions don't block the initial server render.
 */
interface CTAProps {
  text: string;
  href: string;
}

export default function EmptyRegistryCTA({ text, href }: CTAProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
      className="pt-4"
    >
      <Link
        href={href}
        className="group relative inline-flex items-center gap-3 px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] uppercase tracking-[0.2em] rounded-xl transition-all shadow-[0_10px_20px_-5px_rgba(37,99,235,0.3)] shadow-[0_0_15px_rgba(37,99,235,0.3)]"
      >
        <UserPlus size={16} strokeWidth={2.5} className="text-blue-100/90" />
        <span className="relative z-10">{text}</span>
        
        {/* Subtle Shine Overlay */}
        <div className="absolute inset-0 rounded-xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        
        {/* Animated Background Pulse */}
        <div className="absolute inset-0 bg-blue-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
      </Link>
    </motion.div>
  );
}
