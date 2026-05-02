"use client";

import React from "react";
import { motion } from "framer-motion";
import { Plus, Database, SearchX } from "lucide-react";

/**
 * EmptyRegistry Component
 * 
 * A premium, Apple-inspired empty state component for the XNRENT CAR dashboard.
 * Designed for maximum performance with strict client-side boundary isolation.
 * 
 * @author Lead Frontend Architect, Sy Nexis
 */

interface EmptyRegistryProps {
  /** The main prominent heading (Default: "Empty Registry") */
  heading?: string;
  /** Explanatory subtext providing context (Default: Specific XNRENT client copy) */
  subtext?: string;
  /** Label for the primary action button (Default: "ONBOARD FIRST VEHICLE") */
  ctaText?: string;
  /** Click handler for the primary action button */
  onCtaClick?: () => void;
  /** Optional override for the icon */
  icon?: React.ReactNode;
}

const EmptyRegistry: React.FC<EmptyRegistryProps> = ({
  heading = "Empty Registry",
  subtext = "There are currently no clients registered in the XNRENT system. Start by onboarding your first customer to build your fleet network.",
  ctaText = "ONBOARD FIRST VEHICLE",
  onCtaClick,
  icon
}) => {
  // Staggered animation variants for a high-end orchestrated entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1], // Premium Apple-esque ease-out
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex flex-col items-center justify-center min-h-[500px] w-full px-6 py-12"
    >
      {/* GLASSMORPHISM CARD CONTAINER */}
      <div className="relative w-full max-w-xl group">
        {/* Subtle Ambient Glow Backdrop */}
        <div className="absolute -inset-4 bg-gradient-to-r from-blue-apple/10 to-purple-apple/10 rounded-[48px] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
        
        <div className="relative overflow-hidden bg-bg-surface/40 dark:bg-[#2c2c2e]/40 backdrop-blur-3xl border border-border-subtle rounded-[40px] p-12 md:p-16 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] dark:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] flex flex-col items-center text-center">
          
          {/* TOP DECORATIVE ACCENT */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-apple/30 to-transparent" />

          {/* ICON: Precision-engineered container */}
          <motion.div 
            variants={itemVariants}
            className="mb-12 relative"
          >
            <div className="w-28 h-28 rounded-[30px] bg-bg-base/80 dark:bg-white/[0.03] flex items-center justify-center shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)] border border-border-subtle group-hover:border-blue-apple/40 transition-all duration-700 group-hover:scale-105">
              {icon || (
                <div className="relative flex items-center justify-center">
                  <Database className="w-12 h-12 text-text-secondary opacity-10" />
                  <SearchX className="w-14 h-14 text-blue-apple absolute transition-transform duration-700 group-hover:rotate-6" strokeWidth={1.5} />
                </div>
              )}
            </div>
            {/* Interactive Pulse Ring */}
            <div className="absolute -inset-4 rounded-full border border-blue-apple/5 animate-pulse pointer-events-none" />
          </motion.div>

          {/* CONTENT HIERARCHY */}
          <div className="space-y-4 max-w-sm">
            <motion.h2 
              variants={itemVariants}
              className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary"
            >
              {heading}
            </motion.h2>
            <motion.p 
              variants={itemVariants}
              className="text-[16px] font-medium leading-relaxed text-text-secondary/90"
            >
              {subtext}
            </motion.p>
          </div>

          {/* CTA: High-Visibility Action */}
          <motion.div 
            variants={itemVariants}
            className="mt-14 w-full flex justify-center"
          >
            <motion.button
              onClick={onCtaClick}
              whileHover={{ 
                scale: 1.02, 
                y: -3,
                boxShadow: "0 25px 50px -12px rgba(0, 113, 227, 0.4)" 
              }}
              whileTap={{ scale: 0.98 }}
              className="group relative flex items-center justify-center gap-4 px-12 py-6 bg-blue-apple text-white rounded-[22px] font-bold text-[12px] uppercase tracking-[0.25em] transition-all overflow-hidden"
            >
              <Plus size={20} strokeWidth={3} className="transition-transform group-hover:rotate-90 duration-700" />
              <span className="relative z-10">{ctaText}</span>
              
              {/* Dynamic Light Sweep Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
              
              {/* Premium Glow Overlay */}
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* SYSTEM METADATA FOOTER */}
      <motion.div 
        variants={itemVariants}
        className="mt-12 flex flex-col items-center space-y-4 opacity-40 group-hover:opacity-60 transition-opacity"
      >
        <div className="h-8 w-px bg-gradient-to-b from-transparent via-border-subtle to-transparent" />
        <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.5em]">
          XNRENT CORE // REGISTRY_NULL_EXCEPTION
        </p>
      </motion.div>
    </motion.div>
  );
};

export default EmptyRegistry;
