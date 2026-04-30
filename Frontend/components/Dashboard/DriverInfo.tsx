import React from "react";
import { Car, Users, GaugeCircle, Clock, Star, Route } from "lucide-react";

export function DriverDetailHero() {
  return (
    <div className="bg-bg-surface rounded-card border border-border-subtle overflow-hidden shadow-sm relative">
      <div className="absolute inset-0 h-24 bg-gradient-to-r from-blue-apple to-purple-apple opacity-90"></div>
      
      <div className="relative pt-12 px-6 pb-6">
        <div className="flex justify-between items-end mb-4">
          <div className="w-20 h-20 rounded-full border-4 border-bg-surface bg-gradient-to-br from-gray-200 to-gray-400 flex items-center justify-center text-2xl shadow-md overflow-hidden bg-white">
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

export function GPSTracker() {
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
        <div className="flex justify-between items-center py-2 border-b border-border-subtle/50 text-xs sm:text-sm">
          <span className="text-text-secondary flex items-center gap-2">Heading</span>
          <span className="font-medium text-text-primary">North-East · 048°</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-border-subtle/50 text-xs sm:text-sm">
          <span className="text-text-secondary flex items-center gap-2">Altitude</span>
          <span className="font-medium text-text-primary">186 m</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-border-subtle/50 text-xs sm:text-sm">
          <span className="text-text-secondary flex items-center gap-2">Route</span>
          <span className="font-medium text-text-primary">A2 Highway</span>
        </div>
        <div className="flex justify-between items-center py-2 text-xs sm:text-sm">
          <span className="text-text-secondary flex items-center gap-2">Signal</span>
          <span className="font-medium text-blue-apple">Strong 4G</span>
        </div>
      </div>

      <div className="mt-auto bg-bg-base rounded-element p-3 font-mono text-[10px] sm:text-xs text-text-secondary flex items-center justify-center gap-2 border border-border-subtle">
        <span>6.9271° N, 79.8612° E</span>
      </div>
    </div>
  );
}
