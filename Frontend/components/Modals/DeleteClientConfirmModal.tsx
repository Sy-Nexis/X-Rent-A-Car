"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  AlertTriangle, 
  Trash2, 
  Loader2, 
  X,
  ShieldAlert
} from "lucide-react";
import { useRouter } from "next/navigation";

// --- TYPES ---
interface Client {
  first_name: string;
  last_name: string;
  email: string;
  government_id: string;
}

interface DeleteClientConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client | null;
  onConfirm: () => void;
}

// --- MAIN COMPONENT ---
export default function DeleteClientConfirmModal({ 
  isOpen, 
  onClose, 
  client, 
  onConfirm 
}: DeleteClientConfirmModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async () => {
    if (!client) return;
    
    setIsDeleting(true);
    setError(null);

    try {
      // Endpoint mapping: DELETE http://localhost:5000/api/clients/del/del?nic={id}
      const response = await fetch(`http://localhost:5000/api/clients/del/del?nic=${client.government_id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Failed to terminate client record");
      }

      // Success logic
      onConfirm();
      onClose();
      router.refresh();

    } catch (err: any) {
      setError(err.message);
      setIsDeleting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && client && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6">
          {/* BACKDROP */}
          <motion.div
            key="delete-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* MODAL CARD */}
          <motion.div
            key="delete-modal"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-md bg-[#1c1c1e] rounded-[32px] border border-white/10 shadow-[0_0_40px_rgba(255,69,58,0.15)] overflow-hidden"
          >
            {/* HEADER DECORATION */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#ff453a] to-transparent opacity-50" />

            <div className="p-10 space-y-8">
              {/* ICON & TITLE */}
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center text-[#ff453a]">
                  <AlertTriangle size={40} />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-white tracking-tight">Delete Client Account?</h2>
                  <p className="text-[#86868b] text-sm font-medium leading-relaxed">
                    This action is permanent and will immediately terminate the client's access to the XNRENT network.
                  </p>
                </div>
              </div>

              {/* CLIENT IDENTITY CARD */}
              <div className="p-6 bg-black/40 rounded-2xl border border-white/5 space-y-3">
                 <div className="flex items-center gap-3 text-[10px] font-black text-[#6e6e73] uppercase tracking-widest">
                    <ShieldAlert size={12} className="text-[#ff453a]" />
                    Target Identity
                 </div>
                 <div className="space-y-1">
                    <p className="text-sm font-bold text-white uppercase tracking-tight">
                      {client.first_name} {client.last_name}
                    </p>
                    <p className="text-[11px] font-mono text-[#86868b] truncate">
                      {client.email}
                    </p>
                 </div>
              </div>

              {/* ERROR FEEDBACK */}
              {error && (
                <motion.p 
                  initial={{ opacity: 0, y: -5 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="text-[10px] font-black text-[#ff453a] uppercase tracking-widest text-center"
                >
                  {error}
                </motion.p>
              )}

              {/* ACTIONS */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className={`
                    w-full py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3
                    ${isDeleting 
                      ? 'bg-white/5 text-[#424245] cursor-not-allowed' 
                      : 'bg-[#ff453a] text-white hover:bg-red-600 shadow-xl shadow-red-500/20 active:scale-95'}
                  `}
                >
                  {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                  {isDeleting ? "Terminating..." : "Confirm Termination"}
                </button>

                <button
                  onClick={onClose}
                  disabled={isDeleting}
                  className="w-full py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] text-[#86868b] hover:text-white transition-colors"
                >
                  Cancel Action
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
