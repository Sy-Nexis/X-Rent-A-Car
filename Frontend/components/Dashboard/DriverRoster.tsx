import React from "react";
import { drivers } from "./mockData";

export default function DriverRoster() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-blue-apple/10 text-blue-apple border-blue-apple/20";
      case "Idle": return "bg-orange-apple/10 text-orange-apple border-orange-apple/20";
      case "Alert": return "bg-red-apple/10 text-red-apple border-red-apple/20";
      default: return "bg-bg-base text-text-secondary border-border-subtle";
    }
  };

  return (
    <div className="bg-bg-surface rounded-card border border-border-subtle p-5 shadow-sm">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-semibold text-text-primary">Driver Roster</h2>
        <div className="px-2.5 py-1 bg-bg-base text-xs font-medium rounded-full text-text-secondary border border-border-subtle">
          42 on duty
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-text-secondary border-b border-border-subtle">
            <tr>
              <th className="pb-3 font-medium px-2">Driver</th>
              <th className="pb-3 font-medium px-2">Vehicle / Loc</th>
              <th className="pb-3 font-medium px-2">Speed</th>
              <th className="pb-3 font-medium px-2 text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((driver, i) => (
              <tr key={i} className="group border-b border-border-subtle/50 last:border-0 hover:bg-bg-base/50 transition-colors">
                <td className="py-3 px-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-apple/80 to-purple-apple/80 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {driver.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <span className="font-medium text-text-primary whitespace-nowrap">{driver.name}</span>
                  </div>
                </td>
                <td className="py-3 px-2">
                  <div className="flex flex-col">
                    <span className="text-text-primary font-medium">{driver.id}</span>
                    <span className="text-text-secondary text-xs">{driver.location}</span>
                  </div>
                </td>
                <td className="py-3 px-2">
                  <div className="text-text-primary font-medium">
                    {driver.speed} <span className="text-text-secondary text-xs font-normal">km/h</span>
                  </div>
                </td>
                <td className="py-3 px-2 text-right">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${getStatusColor(driver.status)}`}>
                    {driver.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
