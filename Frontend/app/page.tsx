"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Map as MapIcon,
  Car,
  Bell,
  Activity,
  Users,
  Route,
  ShieldAlert,
  MapPin,
  Navigation,
  Signal,
  RefreshCcw,
  Plus,
  Minus,
  Star,
  Clock,
  GaugeCircle
} from "lucide-react";
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

// --- Mock Data ---

const statsData = [
  {
    title: "Active Vehicles",
    value: "48",
    trend: "▲ 3 since yesterday",
    trendColor: "text-green-apple",
    icon: Car,
    iconColor: "text-blue-apple",
    bg: "bg-blue-apple/10",
  },
  {
    title: "Drivers On Duty",
    value: "42",
    trend: "▲ 5 online now",
    trendColor: "text-green-apple",
    icon: Users,
    iconColor: "text-green-apple",
    bg: "bg-green-apple/10",
  },
  {
    title: "km Driven Today",
    value: "1,240",
    trend: "↔ Avg 28.6 km/trip",
    trendColor: "text-text-secondary",
    icon: Route,
    iconColor: "text-orange-apple",
    bg: "bg-orange-apple/10",
  },
  {
    title: "Active Alerts",
    value: "3",
    trend: "▼ 2 critical",
    trendColor: "text-red-apple",
    icon: ShieldAlert,
    iconColor: "text-red-apple",
    bg: "bg-red-apple/10",
  },
];

const drivers = [
  { name: "Amal Kumar", id: "XNR-1042", location: "Colombo 03", speed: 72, status: "Active" },
  { name: "Ravi Seneviratne", id: "XNR-8831", location: "Kandy Road", speed: 45, status: "Active" },
  { name: "Sunil Perera", id: "XNR-5521", location: "Galle Face", speed: 0, status: "Idle" },
  { name: "Pradeep M.", id: "XNR-9902", location: "Matara", speed: 88, status: "Alert" },
  { name: "Nuwan J.", id: "XNR-1120", location: "Negombo", speed: 0, status: "Offline" },
];

const activityLog = [
  { time: "14:32", text: "Amal Kumar started trip to Hemas Ltd.", type: "start" },
  { time: "14:28", text: "Pradeep M. exceeded speed limit (88km/h).", type: "alert" },
  { time: "14:15", text: "Vehicle XNR-5521 entered Idle state.", type: "idle" },
  { time: "13:50", text: "Ravi S. completed delivery at Kandy Road.", type: "stop" },
  { time: "13:45", text: "Engine warning on XNR-9902.", type: "alert" },
];

const tripsData = [
  { day: "Mon", trips: 120 },
  { day: "Tue", trips: 132 },
  { day: "Wed", trips: 180 }, // highlight
  { day: "Thu", trips: 145 },
  { day: "Fri", trips: 160 },
  { day: "Sat", trips: 210 }, // highlight
  { day: "Sun", trips: 110 }, // today
];

const pieData = [
  { name: "Active", value: 48, color: "#0071e3" },
  { name: "Idle", value: 4, color: "#ff9f0a" },
  { name: "Offline", value: 2, color: "#6e6e73" },
];

const alertsData = [
  { title: "Engine warning", detail: "Sunil K., Matara region", severity: "🔴" },
  { title: "Speed limit exceeded", detail: "Amal K., 88 in 80 zone", severity: "🟠" },
  { title: "Fuel low", detail: "Pradeep M.", severity: "🟡" },
];

// --- Components ---

function TopNav() {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-bg-base/80 border-b border-border-subtle">
      <div className="flex h-16 items-center justify-between px-6 max-w-[1600px] mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-apple to-blue-400 flex items-center justify-center text-white shadow-lg shadow-blue-apple/20">
            <Car size={20} />
          </div>
          <h1 className="font-bold text-xl tracking-tight text-text-primary">
            XNRENT <span className="text-blue-apple">CAR</span>
          </h1>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-apple/10 border border-green-apple/20">
            <motion.div
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-2 h-2 rounded-full bg-green-apple"
            />
            <span className="text-xs font-semibold text-green-apple tracking-wide uppercase">
              Live
            </span>
          </div>
          
          <div className="flex items-center gap-6 text-sm font-medium">
            <span className="text-blue-apple border-b-2 border-blue-apple pb-0.5 cursor-pointer">Dashboard</span>
            <Link href="/admin" className="text-text-secondary hover:text-text-primary transition-colors cursor-pointer">Admin Portal</Link>
          </div>

          <div className="h-6 w-px bg-border-subtle hidden sm:block"></div>

          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-apple to-purple-apple flex items-center justify-center text-white font-semibold text-sm shadow-md transition-transform group-hover:scale-105">
              AK
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function StatsRow() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statsData.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-bg-surface p-5 rounded-card border border-border-subtle shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-10 h-10 rounded-element flex items-center justify-center ${stat.bg} ${stat.iconColor}`}>
              <stat.icon size={20} />
            </div>
          </div>
          <h3 className="text-text-secondary text-sm font-medium mb-1">{stat.title}</h3>
          <div className="text-3xl font-bold text-text-primary mb-2">{stat.value}</div>
          <div className={`text-xs font-medium ${stat.trendColor}`}>{stat.trend}</div>
        </motion.div>
      ))}
    </div>
  );
}

function LiveFleetMap() {
  return (
    <div className="bg-bg-surface rounded-card border border-border-subtle overflow-hidden flex flex-col h-[500px] shadow-sm">
      <div className="p-5 border-b border-border-subtle flex items-center justify-between bg-bg-surface z-10 relative">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">Live Fleet Map</h2>
          <p className="text-xs text-text-secondary mt-1">Real-time GPS · 48 vehicles tracked</p>
        </div>
        <div className="flex gap-2">
          <button className="p-2 rounded-element hover:bg-bg-base transition-colors text-text-secondary hover:text-text-primary">
            <Plus size={18} />
          </button>
          <button className="p-2 rounded-element hover:bg-bg-base transition-colors text-text-secondary hover:text-text-primary">
            <Minus size={18} />
          </button>
          <button className="p-2 rounded-element hover:bg-bg-base transition-colors text-text-secondary hover:text-text-primary">
            <RefreshCcw size={18} />
          </button>
        </div>
      </div>
      
      <div className="flex-1 relative bg-[#eef2f5] dark:bg-[#1a1f24] overflow-hidden">
        {/* Mock Map Background - SVG Pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-30 dark:opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" className="text-blue-apple/30"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          {/* Mock routes */}
          <path d="M100,100 C150,200 300,150 400,300" fill="none" stroke="#0071e3" strokeWidth="3" strokeDasharray="5,5" className="opacity-50" />
          <path d="M500,50 C450,150 600,250 550,400" fill="none" stroke="#0071e3" strokeWidth="3" strokeDasharray="5,5" className="opacity-50" />
        </svg>

        {/* Map Markers */}
        <div className="absolute top-[30%] left-[40%] flex flex-col items-center">
          <div className="bg-blue-apple text-white p-2 rounded-full shadow-lg shadow-blue-apple/30 animate-bounce">
            <Car size={16} />
          </div>
          <div className="mt-1 bg-bg-surface px-2 py-1 rounded shadow text-[10px] font-bold text-text-primary">
            Amal K.
          </div>
        </div>
        
        <div className="absolute top-[60%] left-[20%] flex flex-col items-center">
          <div className="bg-orange-apple text-white p-2 rounded-full shadow-lg">
            <Car size={16} />
          </div>
        </div>

        <div className="absolute top-[20%] left-[70%] flex flex-col items-center">
          <div className="bg-red-apple text-white p-2 rounded-full shadow-lg">
            <ShieldAlert size={16} />
          </div>
          <div className="mt-1 bg-bg-surface px-2 py-1 rounded shadow text-[10px] font-bold text-red-apple">
            Speeding
          </div>
        </div>

        <div className="absolute top-[70%] left-[60%] flex flex-col items-center">
          <div className="bg-green-apple text-white p-2 rounded-full shadow-lg">
            <Car size={16} />
          </div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-bg-surface/90 backdrop-blur rounded-element p-3 shadow-md border border-border-subtle text-xs flex flex-col gap-2">
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-apple"></span> Active</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-orange-apple"></span> Idle</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-apple"></span> Alert</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-border-subtle"></span> Offline</div>
        </div>
      </div>
    </div>
  );
}

function DriverRoster() {
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

function DriverDetailHero() {
  return (
    <div className="bg-bg-surface rounded-card border border-border-subtle overflow-hidden shadow-sm relative">
      <div className="absolute inset-0 h-24 bg-gradient-to-r from-blue-apple to-purple-apple opacity-90"></div>
      
      <div className="relative pt-12 px-6 pb-6">
        <div className="flex justify-between items-end mb-4">
          <div className="w-20 h-20 rounded-full border-4 border-bg-surface bg-gradient-to-br from-gray-200 to-gray-400 flex items-center justify-center text-2xl shadow-md overflow-hidden bg-white">
            {/* Mock Avatar Image */}
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Amal&backgroundColor=b6e3f4`} alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <div className="mb-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-apple/10 text-green-apple border border-green-apple/20 shadow-sm backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-green-apple mr-1.5"></span>
              On Trip
            </span>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-text-primary">Amal Kumar</h2>
          <p className="text-text-secondary text-sm font-medium">Senior Driver</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-bg-base p-3 rounded-element">
            <div className="text-text-secondary text-xs mb-1 flex items-center gap-1"><Car size={12}/> Vehicle</div>
            <div className="font-semibold text-text-primary text-sm">XNR-1042</div>
          </div>
          <div className="bg-bg-base p-3 rounded-element">
            <div className="text-text-secondary text-xs mb-1 flex items-center gap-1"><Users size={12}/> Client</div>
            <div className="font-semibold text-text-primary text-sm">Hemas Ltd</div>
          </div>
          <div className="bg-bg-base p-3 rounded-element">
            <div className="text-text-secondary text-xs mb-1 flex items-center gap-1"><GaugeCircle size={12}/> Speed</div>
            <div className="font-semibold text-blue-apple text-sm">72 km/h</div>
          </div>
          <div className="bg-bg-base p-3 rounded-element">
            <div className="text-text-secondary text-xs mb-1 flex items-center gap-1"><Clock size={12}/> ETA</div>
            <div className="font-semibold text-text-primary text-sm">14:35</div>
          </div>
          <div className="bg-bg-base p-3 rounded-element">
            <div className="text-text-secondary text-xs mb-1 flex items-center gap-1"><Star size={12}/> Rating</div>
            <div className="font-semibold text-text-primary text-sm">⭐ 4.9</div>
          </div>
          <div className="bg-bg-base p-3 rounded-element">
            <div className="text-text-secondary text-xs mb-1 flex items-center gap-1"><Route size={12}/> Trips Today</div>
            <div className="font-semibold text-text-primary text-sm">4</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GPSTracker() {
  return (
    <div className="bg-bg-surface rounded-card border border-border-subtle p-5 shadow-sm flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-semibold text-text-primary flex items-center gap-2">
          GPS Tracker
        </h3>
        <div className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-apple opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-apple"></span>
        </div>
      </div>

      <div className="flex flex-col gap-3 mb-4 flex-1">
        <div className="flex justify-between items-center py-2 border-b border-border-subtle/50">
          <span className="text-sm text-text-secondary flex items-center gap-2"><Navigation size={14}/> Heading</span>
          <span className="text-sm font-medium text-text-primary">North-East · 048°</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-border-subtle/50">
          <span className="text-sm text-text-secondary flex items-center gap-2"><Activity size={14}/> Altitude</span>
          <span className="text-sm font-medium text-text-primary">186 m</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-border-subtle/50">
          <span className="text-sm text-text-secondary flex items-center gap-2"><Route size={14}/> Route</span>
          <span className="text-sm font-medium text-text-primary">A2 Highway</span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-sm text-text-secondary flex items-center gap-2"><Signal size={14}/> Signal</span>
          <span className="text-sm font-medium text-blue-apple">Strong 4G</span>
        </div>
      </div>

      <div className="mt-auto bg-bg-base rounded-element p-3 font-mono text-xs text-text-secondary flex items-center justify-center gap-2 border border-border-subtle">
        <MapPin size={12} />
        <span>6.9271° N, 79.8612° E</span>
      </div>
    </div>
  );
}

function ActivityLog() {
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

function TripsBarChart() {
  return (
    <div className="bg-bg-surface rounded-card border border-border-subtle p-5 shadow-sm col-span-1">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-text-primary">Trips - Last 7 Days</h3>
        <p className="text-xs text-text-secondary">Total 1,057 trips</p>
      </div>
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={tripsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
            <Tooltip 
              cursor={{ fill: 'var(--color-border-subtle)', opacity: 0.5 }}
              contentStyle={{ borderRadius: '10px', border: '1px solid var(--color-border-subtle)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}
            />
            <Bar dataKey="trips" radius={[4, 4, 0, 0]}>
              {tripsData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.day === 'Wed' || entry.day === 'Sat' ? 'var(--color-purple-apple)' : entry.day === 'Sun' ? 'var(--color-blue-apple)' : 'var(--color-border-subtle)'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function FleetStatusDonut() {
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
                contentStyle={{ borderRadius: '10px', border: '1px solid var(--color-border-subtle)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}
                itemStyle={{ color: 'var(--text-primary)' }}
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

function ActiveAlerts() {
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
          <div key={i} className="bg-bg-base p-4 rounded-element border border-border-subtle flex items-start gap-3 hover:border-red-apple/30 transition-colors group cursor-pointer">
            <div className="text-lg mt-0.5">{alert.severity}</div>
            <div>
              <div className="text-sm font-semibold text-text-primary mb-1 group-hover:text-red-apple transition-colors">{alert.title}</div>
              <div className="text-xs text-text-secondary">{alert.detail}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Main Page Layout ---

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-bg-base">
      <TopNav />
      
      <main className="max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8">
        <StatsRow />
        
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-6">
          {/* Left Column */}
          <div className="xl:col-span-8 flex flex-col gap-6">
            <LiveFleetMap />
            <DriverRoster />
          </div>
          
          {/* Right Column */}
          <div className="xl:col-span-4 flex flex-col gap-6">
            <DriverDetailHero />
            <GPSTracker />
            <ActivityLog />
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 pb-12">
          <TripsBarChart />
          <FleetStatusDonut />
          <ActiveAlerts />
        </div>
      </main>
    </div>
  );
}
