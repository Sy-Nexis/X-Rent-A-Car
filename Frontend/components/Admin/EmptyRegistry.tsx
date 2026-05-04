import React from "react";
import { Database, UserPlus } from "lucide-react";
import EmptyRegistryMotion from "./EmptyRegistryMotion";
import EmptyRegistryCTA from "./EmptyRegistryCTA";

/**
 * EmptyRegistry (Server Component)
 * 
 * Orchestrates the "Empty State" for dashboard registries.
 * Adheres to strict Next.js App Router boundaries to ensure 
 * maximum rendering speed and zero-JS initial payload for content.
 * 
 * @author Lead Frontend Architect, Sy Nexis
 */

interface EmptyRegistryProps {
  heading?: string;
  subtext?: string;
  buttonText?: string;
  href?: string;
  icon?: React.ReactNode;
  secondaryIcon?: React.ReactNode;
}

export default function EmptyRegistry({
  heading = "Empty Registry",
  subtext = "There are currently no clients registered in the xrent system. Start by onboarding your first customer to build your fleet network.",
  buttonText = "ONBOARD FIRST CLIENT",
  href = "/Admin/Client",
  icon = <Database size={44} className="text-white" strokeWidth={1.5} />,
  secondaryIcon = <UserPlus size={20} className="text-blue-400" strokeWidth={2} />,
}: EmptyRegistryProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 min-h-[500px] bg-transparent">
      <EmptyRegistryMotion>
        {/* ICON ARCHITECTURE */}
        <div className="relative mb-10">
          {/* Main Storage Icon in Deep Blue Container */}
          <div className="w-24 h-24 bg-blue-900/30 dark:bg-blue-900/20 rounded-[32px] flex items-center justify-center border border-blue-500/20 shadow-2xl backdrop-blur-sm">
            {icon}
          </div>
          
          {/* Secondary Floating "Add" Icon */}
          <div className="absolute -right-4 -top-4 w-12 h-12 bg-[#1c1c1e] dark:bg-[#2c2c2e] rounded-2xl flex items-center justify-center border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            {secondaryIcon}
          </div>
        </div>

        {/* TYPOGRAPHY: Server-Rendered for Zero-Latency Indexing */}
        <div className="text-center space-y-4 max-w-[340px] mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-none">
            {heading}
          </h2>
          <p className="text-slate-400 text-[15px] leading-[1.6] font-medium tracking-normal">
            {subtext}
          </p>
        </div>

        {/* INTERACTIVE COMPONENT: Client-Side Isolated */}
        <EmptyRegistryCTA text={buttonText} href={href} />
      </EmptyRegistryMotion>

      {/* METADATA: Server-Rendered */}
      <div className="mt-16 opacity-10">
        <p className="text-[9px] font-black text-white uppercase tracking-[0.6em]">
          xrent // REGISTRY_CORE_NULL
        </p>
      </div>
    </div>
  );
}
