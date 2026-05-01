"use client";

import React from "react";
import { activityLog as mockLogs } from "./mockData";

interface ActivityLogProps {
  vehicle?: any;
}

export default function ActivityLog({ vehicle }: ActivityLogProps) {
  // If a vehicle is selected, we could filter or show specific logs. 
  // For now, we'll show the stream but with the updated aesthetics.
  const displayLogs = mockLogs;

  const getColor = (type: string) => {
    switch(type) {
      case 'start': return 'bg-green-apple ring-green-apple/20';
      case 'stop': return 'bg-blue-apple ring-blue-apple/20';
      case 'alert': return 'bg-red-apple ring-red-apple/20';
      case 'idle': return 'bg-orange-apple ring-orange-apple/20';
      default: return 'bg-border-subtle ring-border-subtle/20';
    }
  };

  return (
    <div className="bg-bg-surface rounded-card border border-border-subtle p-6 shadow-sm">
      <div className="mb-6">
         <h3 className="text-xs font-black text-text-primary uppercase tracking-widest">Activity Stream</h3>
         <p className="text-[8px] font-bold text-text-secondary uppercase tracking-[0.3em]">Operational Chronology</p>
      </div>

      <div className="relative pl-4 border-l border-border-subtle/50 space-y-8">
        {displayLogs.map((log, i) => (
          <div key={i} className="relative">
            <div className={`absolute -left-[20.5px] top-1 w-2.5 h-2.5 rounded-full ring-4 ${getColor(log.type)} shadow-sm`}></div>
            <div className="text-[10px] font-black text-text-secondary mb-1 uppercase tabular-nums tracking-widest">{log.time}</div>
            <div className="text-xs font-bold text-text-primary leading-relaxed uppercase tracking-tight">{log.text}</div>
          </div>
        ))}
        {vehicle && (
           <div className="pt-4 border-t border-border-subtle/30">
              <p className="text-[9px] font-black text-blue-apple uppercase tracking-widest">Monitoring: {vehicle.make} {vehicle.model}</p>
           </div>
        )}
      </div>
    </div>
  );
}
