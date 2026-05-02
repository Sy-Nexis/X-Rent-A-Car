"use client";

import { motion } from "framer-motion";

/**
 * EmptyRegistryMotion: A client-side wrapper that handles high-performance 
 * entrance animations while allowing the content to be pre-rendered on the server.
 */
export default function EmptyRegistryMotion({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1], // Apple-inspired smooth ease-out
      }}
      className="flex flex-col items-center"
    >
      {children}
    </motion.div>
  );
}
