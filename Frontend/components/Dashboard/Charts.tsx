"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { tripsData, pieData, alertsData } from "./mockData";

export function TripsBarChart() {
  return (
    <div className="bg-bg-surface rounded-card border border-border-subtle p-5 shadow-sm col-span-1">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-text-primary">Trips - Last 7 Days</h3>
        <p className="text-xs text-text-secondary">Total 1,057 trips</p>
      </div>
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={tripsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6e6e73' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6e6e73' }} />
            <Tooltip 
              cursor={{ fill: 'rgba(0,0,0,0.05)', opacity: 0.5 }}
              contentStyle={{ borderRadius: '10px', border: '1px solid #e5e7eb', backgroundColor: '#fff', color: '#1d1d1f' }}
            />
            <Bar dataKey="trips" radius={[4, 4, 0, 0]}>
              {tripsData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.day === 'Wed' || entry.day === 'Sat' ? '#bf5af2' : entry.day === 'Sun' ? '#0071e3' : '#e5e7eb'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function FleetStatusDonut() {
  return (
    <div className="bg-bg-surface rounded-card border border-border-subtle p-5 shadow-sm col-span-1">
      <div className="mb-2">
        <h3 className="text-base font-semibold text-text-primary">Fleet Status</h3>
        <p className="text-xs text-text-secondary">Current distribution</p>
      </div>
      <div className="flex items-center justify-between h-[200px]">
        <div className="w-[140px] h-[140px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                innerRadius={50}
                outerRadius={70}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '10px', border: '1px solid #e5e7eb', backgroundColor: '#fff', color: '#1d1d1f' }}
                itemStyle={{ color: '#1d1d1f' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold text-text-primary">54</span>
            <span className="text-[10px] text-text-secondary uppercase tracking-wider font-semibold">Total</span>
          </div>
        </div>
        
        <div className="flex flex-col gap-3 pr-4">
          {pieData.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
              <div>
                <div className="text-sm font-medium text-text-primary">{item.name}</div>
                <div className="text-xs text-text-secondary">{item.value} Vehicles</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ActiveAlerts() {
  return (
    <div className="bg-bg-surface rounded-card border border-border-subtle p-5 shadow-sm col-span-1 lg:col-span-2">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-base font-semibold text-text-primary">Active Alerts</h3>
          <p className="text-xs text-text-secondary">Action required</p>
        </div>
        <button className="text-blue-apple text-sm font-medium hover:underline">View All</button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {alertsData.map((alert, i) => (
          <div key={i} className="bg-bg-base p-4 rounded-element border border-border-subtle flex items-start gap-3 hover:border-red-500/30 transition-colors group cursor-pointer">
            <div className="text-lg mt-0.5">{alert.severity}</div>
            <div>
              <div className="text-sm font-semibold text-text-primary mb-1 group-hover:text-red-500 transition-colors">{alert.title}</div>
              <div className="text-xs text-text-secondary">{alert.detail}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
