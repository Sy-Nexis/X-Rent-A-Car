import React, { useState, useEffect } from "react";

function AnimatedNumber({ value, duration = 2000 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(0);
    let animationFrameId: number;
    let startTime: number | null = null;

    const updateCount = (now: number) => {
      if (startTime === null) startTime = now;
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (easeOutQuad)
      const easeOutQuad = (t: number) => t * (2 - t);
      const currentCount = Math.floor(easeOutQuad(progress) * value);

      setCount(currentCount);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(updateCount);
      } else {
        setCount(value);
      }
    };

    animationFrameId = requestAnimationFrame(updateCount);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [value, duration]);

  return <>{count.toLocaleString()}</>;
}

function AnimatedBar({
  targetPercent,
  duration = 2000,
}: {
  targetPercent: number;
  duration?: number;
}) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    setWidth(0);
    let animationFrameId: number;
    let startTime: number | null = null;

    const update = (now: number) => {
      if (startTime === null) startTime = now;
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutQuad = (t: number) => t * (2 - t);
      setWidth(easeOutQuad(progress) * targetPercent);
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(update);
      } else {
        setWidth(targetPercent);
      }
    };

    animationFrameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrameId);
  }, [targetPercent, duration]);

  return (
    <div
      className="bg-brand-gradient h-full rounded-full"
      style={{ width: `${width}%` }}
    />
  );
}

function AnimatedPercent({
  value,
  decimals = 0,
  duration = 2000,
}: {
  value: number;
  decimals?: number;
  duration?: number;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(0);
    let animationFrameId: number;
    let startTime: number | null = null;

    const update = (now: number) => {
      if (startTime === null) startTime = now;
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutQuad = (t: number) => t * (2 - t);
      setCount(easeOutQuad(progress) * value);
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(update);
      } else {
        setCount(value);
      }
    };

    animationFrameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrameId);
  }, [value, duration]);

  return <>{decimals > 0 ? count.toFixed(decimals) : Math.floor(count)}%</>;
}

export default function DashboardView() {
  const [viewType, setViewType] = useState<"map" | "list">("map");

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar relative flex flex-col gap-6 bg-[#0e0e11]">
      {/* Title section */}
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight mb-1">Fleet Dashboard</h1>
        <p className="text-sm text-gray-400 font-medium">
          Real-time oversight for global logistics operations.
        </p>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="bg-[#1e1e1e] rounded-2xl border border-white/5 p-5 flex items-center justify-between shadow-md">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">
              Active Vehicles
            </span>
            <span className="text-3xl font-black text-white leading-none">
              <AnimatedNumber value={1284} />
            </span>
            <div className="flex items-center gap-1 mt-1 text-[11px] font-bold text-brand-green">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span>+12.5% vs yesterday</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-white/5 text-brand-cyan flex items-center justify-center shadow-xs">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17h10" />
            </svg>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-[#1e1e1e] rounded-2xl border border-white/5 p-5 flex items-center justify-between shadow-md">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">
              Kms Driven Today
            </span>
            <span className="text-3xl font-black text-white leading-none">
              <AnimatedNumber value={42890} />
            </span>
            <div className="flex items-center gap-1 mt-1 text-[11px] font-bold text-gray-550 text-gray-500">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Last updated 2m ago</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-white/5 text-brand-cyan flex items-center justify-center shadow-xs">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-[#1e1e1e] rounded-2xl border border-white/5 p-5 flex items-center justify-between shadow-md">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">
              Active Alerts
            </span>
            <span className="text-3xl font-black text-brand-red leading-none">
              <AnimatedNumber value={14} />
            </span>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] font-bold text-brand-red">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse" />
              <span>3 Critical Priority</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-brand-red/10 text-brand-red flex items-center justify-center shadow-xs">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
      </div>

      {/* LIVE FLEET MAP SECTION */}
      <div className="bg-[#1e1e1e] rounded-2xl border border-white/5 p-6 shadow-md flex flex-col">
        {/* Title Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-extrabold uppercase text-white tracking-wider flex items-center gap-2">
            <span className="w-1.5 h-3 bg-brand-cyan rounded-full" />
            Live Fleet
          </h2>

          {/* Toggle button */}
          <div className="flex bg-[#0e0e11] p-0.5 rounded-lg border border-white/5">
            <button
              onClick={() => setViewType("map")}
              className={`text-[10px] font-extrabold px-3 py-1.5 rounded-md transition-all ${
                viewType === "map" ? "bg-[#1e1e1e] text-white shadow-xs" : "text-gray-400 hover:text-white"
              }`}
            >
              Map View
            </button>
            <button
              onClick={() => setViewType("list")}
              className={`text-[10px] font-extrabold px-3 py-1.5 rounded-md transition-all ${
                viewType === "list" ? "bg-[#1e1e1e] text-white shadow-xs" : "text-gray-400 hover:text-white"
              }`}
            >
              List View
            </button>
          </div>
        </div>

        {/* Map view display */}
        {viewType === "map" ? (
          <div className="relative h-96 rounded-xl border border-white/5 overflow-hidden bg-[#121214]">
            {/* Styled Mock SVG Map of Berlin Grid - Night Mode */}
            <svg className="w-full h-full object-cover" viewBox="0 0 800 400" fill="none">
              {/* Landmass base */}
              <rect width="800" height="400" fill="#121214" />
              
              {/* Rivers / Lakes (Spree) */}
              <path d="M-50 250 C 150 230, 250 240, 350 210 C 450 180, 520 180, 850 130" stroke="#1d2d44" strokeWidth="24" strokeLinecap="round" fill="none" />
              <path d="M120 238 L 110 320" stroke="#1d2d44" strokeWidth="12" strokeLinecap="round" />
              
              {/* Forest / Parks */}
              <rect x="250" y="40" width="120" height="70" rx="15" fill="#1b2a22" /> {/* Schillerpark style */}
              <rect x="620" y="60" width="140" height="80" rx="20" fill="#1b2a22" /> {/* Zeiss-Großplanetarium */}
              <circle cx="500" cy="320" r="45" fill="#1b2a22" /> {/* Viktoriapark */}
              <path d="M 330 180 C 310 220, 280 230, 290 280 Z" fill="#1b2a22" />

              {/* Major Roads Grid */}
              <g stroke="#1a1a22" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="-20" y1="100" x2="820" y2="100" />
                <line x1="-20" y1="300" x2="820" y2="300" />
                <line x1="200" y1="-20" x2="200" y2="420" />
                <line x1="600" y1="-20" x2="600" y2="420" />
                
                {/* Secondary diagonal streets */}
                <line x1="50" y1="50" x2="750" y2="350" />
                <line x1="750" y1="50" x2="50" y2="350" />
                <line x1="400" y1="-20" x2="400" y2="420" strokeWidth="8" stroke="#1c1c24" /> {/* Main highway */}
              </g>

              {/* Street Outline detailing for premium UI contrast */}
              <g stroke="#262630" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <line x1="-20" y1="100" x2="820" y2="100" />
                <line x1="-20" y1="300" x2="820" y2="300" />
                <line x1="200" y1="-20" x2="200" y2="420" />
                <line x1="600" y1="-20" x2="600" y2="420" />
                <line x1="50" y1="50" x2="750" y2="350" />
                <line x1="750" y1="50" x2="50" y2="350" />
              </g>

              {/* Street Names / Labels */}
              <text x="310" y="105" fill="#4a5568" fontSize="8" fontWeight="bold" fontFamily="sans-serif">Schillerpark</text>
              <text x="630" y="105" fill="#4a5568" fontSize="8" fontWeight="bold" fontFamily="sans-serif">WEISSENSEE</text>
              <text x="660" y="115" fill="#4a5568" fontSize="7" fontFamily="sans-serif">Zeiss-Großplanetarium</text>
              <text x="590" y="250" fill="#4a5568" fontSize="8" fontWeight="bold" fontFamily="sans-serif">East Side Gallery</text>
              <text x="440" y="325" fill="#4a5568" fontSize="8" fontWeight="bold" fontFamily="sans-serif">Viktoriapark</text>
              <text x="290" y="285" fill="#4a5568" fontSize="8" fontWeight="bold" fontFamily="sans-serif">Brandenburger Tor</text>
              <text x="510" y="170" fill="#ffffff" fontSize="20" fontWeight="black" opacity="0.05" fontFamily="sans-serif">Berlin</text>
            </svg>

            {/* MAP LEGEND OVERLAY (Top-Left) */}
            <div className="absolute top-4 left-4 bg-[#1e1e1e]/90 backdrop-blur-md rounded-xl border border-white/5 p-4 shadow-md z-10 w-44">
              <span className="text-[8px] font-black uppercase text-gray-500 tracking-wider block mb-3">
                Status Legend
              </span>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand-green" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Active</span>
                  </div>
                  <span className="text-[10px] font-black text-white">1,142</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand-orange" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Alert</span>
                  </div>
                  <span className="text-[10px] font-black text-white">14</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-gray-600" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Offline</span>
                  </div>
                  <span className="text-[10px] font-black text-white">128</span>
                </div>
              </div>
            </div>

            {/* MOCK MAP PIN 1: V-902-TR (Green active marker) */}
            <div className="absolute top-[160px] left-[380px] z-10 flex flex-col items-center">
              <div className="flex items-center gap-1.5 bg-brand-green text-white text-[9px] font-black px-2.5 py-1 rounded-md shadow-md border border-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                V-902-TR
              </div>
              {/* Pointing arrow */}
              <div className="w-2 h-2 bg-brand-green rotate-45 -mt-1 shadow-sm" />
            </div>

            {/* MOCK MAP PIN 2: V-441-SM (Green active marker) */}
            <div className="absolute top-[280px] left-[480px] z-10 flex flex-col items-center">
              <div className="flex items-center gap-1.5 bg-brand-green text-white text-[9px] font-black px-2.5 py-1 rounded-md shadow-md border border-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                V-441-SM
              </div>
              <div className="w-2 h-2 bg-brand-green rotate-45 -mt-1 shadow-sm" />
            </div>

            {/* MOCK MAP PIN 3: ALERT: BRAKE (Yellow alert marker) */}
            <div className="absolute top-[210px] left-[560px] z-10 flex flex-col items-center">
              <div className="bg-brand-orange text-white text-[8px] font-black px-2 py-0.5 rounded-t-md shadow-md border-t border-x border-brand-orange leading-none">
                ⚠
              </div>
              <div className="bg-[#1e1e1e] text-brand-orange text-[8px] font-extrabold uppercase px-2.5 py-1 rounded-b-md shadow-md border-b border-x border-white/5 leading-none tracking-wider -mt-[1px]">
                Alert: Brake
              </div>
              <div className="w-2 h-2 bg-[#1e1e1e] rotate-45 -mt-1 shadow-sm border-r border-b border-white/5" />
            </div>

            {/* Zoom & Location Controls (Bottom-Right) */}
            <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
              <div className="flex flex-col bg-[#1e1e1e] rounded-lg border border-white/5 overflow-hidden shadow-xs">
                <button className="w-8 h-8 flex items-center justify-center text-gray-300 hover:bg-white/5 text-base font-bold border-b border-white/5">
                  +
                </button>
                <button className="w-8 h-8 flex items-center justify-center text-gray-300 hover:bg-white/5 text-base font-bold">
                  −
                </button>
              </div>

              <button className="w-8 h-8 bg-brand-gradient rounded-lg flex items-center justify-center text-white shadow-md active:scale-95 transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>

          </div>
        ) : (
          <div className="h-96 rounded-xl border border-white/5 flex items-center justify-center bg-[#121214] text-gray-400 font-medium">
            List view format details...
          </div>
        )}
      </div>

      {/* BOTTOM SECTION: FLEET PERFORMANCE VS RECENT ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
        
        {/* FLEET PERFORMANCE (span 2) */}
        <div className="lg:col-span-2 bg-[#1e1e1e] rounded-2xl border border-white/5 p-6 shadow-md flex flex-col justify-between">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-extrabold uppercase text-white tracking-wider">
                Fleet Performance
              </h3>
              <button className="text-gray-500 hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
              </button>
            </div>

            <div className="space-y-5">
              {[
                { label: "Vehicle Utilization", value: 94,   decimals: 0 },
                { label: "Fuel Efficiency",      value: 78,   decimals: 0 },
                { label: "On-Time Deliveries",   value: 99.2, decimals: 1 },
              ].map((bar) => (
                <div key={bar.label}>
                  <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">
                    <span>{bar.label}</span>
                    <span className="text-white font-black">
                      <AnimatedPercent value={bar.value} decimals={bar.decimals} />
                    </span>
                  </div>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                    <AnimatedBar targetPercent={bar.value} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RECENT ACTIVITY (span 3) */}
        <div className="lg:col-span-3 bg-[#1e1e1e] rounded-2xl border border-white/5 p-6 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-extrabold uppercase text-white tracking-wider">
                Recent Activity
              </h3>
              <span className="bg-brand-gradient text-white text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded animate-pulse">
                Live Feed
              </span>
            </div>

            <div className="divide-y divide-white/5">
              {[
                {
                  title: "V-102 Delivery Complete",
                  detail: "Route B-42 • Berlin Hub • 2m ago",
                  icon: (
                    <div className="w-8 h-8 rounded-lg bg-white/5 text-brand-green flex items-center justify-center flex-shrink-0 font-bold">
                      ✓
                    </div>
                  ),
                },
                {
                  title: "Unscheduled Stop Detected",
                  detail: "V-902-TR • A1 Autobahn • 5m ago",
                  icon: (
                    <div className="w-8 h-8 rounded-lg bg-white/5 text-brand-orange flex items-center justify-center flex-shrink-0">
                      ⚠
                    </div>
                  ),
                },
                {
                  title: "Refueling Initiated",
                  detail: "V-441-SM • Shell Station 04 • 12m ago",
                  icon: (
                    <div className="w-8 h-8 rounded-lg bg-white/5 text-brand-cyan flex items-center justify-center flex-shrink-0">
                      ⛽
                    </div>
                  ),
                },
              ].map((act, index) => (
                <div key={index} className="flex items-start gap-4 py-3 first:pt-0 last:pb-0">
                  {act.icon}
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-white truncate">{act.title}</span>
                    <span className="text-[10px] text-gray-500 font-semibold">{act.detail}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Floating Action Button "+" in mint-to-cyan gradient bottom-right */}
      <button className="absolute bottom-24 right-4 md:bottom-8 md:right-8 w-12 h-12 rounded-full bg-brand-gradient hover:opacity-90 active:scale-95 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 transition-all z-20 cursor-pointer">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
}
