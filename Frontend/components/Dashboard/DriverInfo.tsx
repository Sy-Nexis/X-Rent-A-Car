"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin, Navigation, Info, Car, Users, Calendar, Hash, Edit3 } from "lucide-react";
import Link from "next/link";

interface DriverInfoProps {
  vehicle?: any;
}

export function DriverDetailHero({ vehicle }: DriverInfoProps) {
  if (!vehicle) return (
    <div className="bg-bg-surface rounded-card border border-border-subtle p-8 flex flex-col items-center justify-center text-center min-h-[300px]">
      <Info className="text-text-secondary mb-4 opacity-20" size={48} />
      <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.3em]">Select a unit to view intelligence</p>
    </div>
  );

  return (
    <div className="bg-bg-surface rounded-card border border-border-subtle p-8 shadow-sm relative overflow-hidden group">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
        <Car size={180} className="-rotate-12 translate-x-12 -translate-y-12" />
      </div>

      <div className="relative z-10 space-y-8">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-text-primary tracking-tighter uppercase">{vehicle.make} {vehicle.model}</h2>
            <div className="flex items-center gap-2 text-blue-apple font-black text-[10px] uppercase tracking-widest">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-apple animate-pulse" />
              Operational Intelligence
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/Admin/Vehicle`}
              className="p-3 bg-white/5 border border-white/10 rounded-2xl text-text-primary hover:bg-blue-apple hover:text-white transition-all shadow-xl"
            >
              <Edit3 size={18} />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <DetailItem icon={<Hash size={14} />} label="Unit ID" value={vehicle.id?.toString() || '---'} />
          <DetailItem icon={<Calendar size={14} />} label="Year" value={vehicle.year?.toString() || '2024'} />
          <DetailItem icon={<Car size={14} />} label="Plate" value={vehicle.license_plate || vehicle.licensePlate || '---'} />
          <DetailItem icon={<Navigation size={14} />} label="Status" value={vehicle.status || 'Active'} />
        </div>

        <div className="pt-6 border-t border-border-subtle flex gap-4">
          <Link
            href="/Admin/Vehicle"
            className="flex-1 px-4 py-3 bg-white/[0.03] border border-white/5 rounded-2xl text-[9px] font-black uppercase tracking-widest text-text-primary hover:bg-white/10 transition-all text-center"
          >
            View Specs
          </Link>
          <Link
            href="/Admin/Client"
            className="flex-1 px-4 py-3 bg-blue-apple border border-blue-apple/20 rounded-2xl text-[9px] font-black uppercase tracking-widest text-white hover:bg-blue-600 transition-all text-center shadow-lg shadow-blue-apple/20"
          >
            Edit Registry
          </Link>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ icon, label, value }: any) {
  return (
    <div className="p-4 bg-bg-base/50 rounded-2xl border border-border-subtle/30 space-y-2 group/item hover:border-blue-apple/30 transition-colors">
      <div className="flex items-center gap-2 text-text-secondary">
        {icon}
        <span className="text-[8px] font-black uppercase tracking-[0.2em]">{label}</span>
      </div>
      <p className="text-sm font-black text-text-primary uppercase tracking-tight group-hover/item:text-blue-apple transition-colors">{value}</p>
    </div>
  );
}

export function GPSTracker({ vehicle }: DriverInfoProps) {
  return (
    <div className="bg-bg-surface rounded-card border border-border-subtle p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xs font-black text-text-primary uppercase tracking-widest">Real-time GPS</h3>
          <p className="text-[8px] font-bold text-text-secondary uppercase tracking-[0.3em]">Satellite Telemetry</p>
        </div>
        <div className="w-8 h-8 rounded-xl bg-blue-apple/10 flex items-center justify-center text-blue-apple">
          <Navigation size={16} />
        </div>
      </div>

      <div className="aspect-[16/9] bg-bg-base rounded-2xl relative overflow-hidden border border-border-subtle flex items-center justify-center group">
        {/* Static Map Decorator */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#0071e3_1px,transparent_1px)] [background-size:20px_20px]" />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ repeat: Infinity, duration: 4 }}
          className="w-32 h-32 rounded-full bg-blue-apple/10 flex items-center justify-center"
        >
          <div className="w-16 h-16 rounded-full bg-blue-apple/20 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-blue-apple shadow-[0_0_15px_rgba(0,113,227,0.8)]" />
          </div>
        </motion.div>

        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center p-3 bg-bg-surface/80 backdrop-blur-md rounded-xl border border-white/10">
          <div className="flex items-center gap-3">
            <MapPin size={14} className="text-red-apple" />
            <span className="text-[9px] font-black uppercase text-text-primary">Current Sector: X-42 / 99</span>
          </div>
          <span className="text-[9px] font-bold text-text-secondary uppercase">Last Ping: 12ms</span>
        </div>
      </div>
    </div>
  );
}
