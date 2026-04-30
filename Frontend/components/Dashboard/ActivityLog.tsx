import React from "react";
import { activityLog } from "./mockData";

export default function ActivityLog() {
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
    <div className="bg-bg-surface rounded-card border border-border-subtle p-5 shadow-sm">
      <h3 className="text-base font-semibold text-text-primary mb-5">Activity Log</h3>
      <div className="relative pl-3 border-l-2 border-border-subtle space-y-6">
        {activityLog.map((log, i) => (
          <div key={i} className="relative">
            <div className={`absolute -left-[17px] top-1 w-2.5 h-2.5 rounded-full ring-4 ${getColor(log.type)}`}></div>
            <div className="text-xs text-text-secondary mb-0.5 font-medium">{log.time}</div>
            <div className="text-sm text-text-primary leading-snug">{log.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
