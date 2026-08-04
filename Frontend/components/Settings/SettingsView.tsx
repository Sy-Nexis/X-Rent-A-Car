import React, { useState } from "react";

interface SettingsViewProps {
  onLogout: () => void;
}

export default function SettingsView({ onLogout }: SettingsViewProps) {
  const [fullName, setFullName] = useState("Alex Rivera");
  const [email, setEmail] = useState("alex.rivera@fleetcontrol.io");
  const [phone, setPhone] = useState("+1 (555) 012-3456");
  const [department, setDepartment] = useState("Logistics Operations");
  const [bio, setBio] = useState(
    "Lead Manager for the North American region. Focused on route optimization and fuel efficiency."
  );

  const [appearance, setAppearance] = useState<"Light" | "Dark" | "System">("Light");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushNotes, setPushNotes] = useState(true);
  const [smsUpdates, setSmsUpdates] = useState(false);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar space-y-6 bg-[#0e0e11]">
      
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight mb-1">Settings</h1>
        <p className="text-sm text-gray-400 font-medium">
          Manage your account preferences and application configuration.
        </p>
      </div>

      {/* Row 1: Account Details + (Appearance & Security) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Account Details Form (span 2) */}
        <div className="lg:col-span-2 bg-[#1e1e1e] rounded-2xl border border-white/5 p-6 shadow-md">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-sm font-extrabold uppercase text-white tracking-wider">
                Account Details
              </h2>
              <p className="text-[11px] text-gray-400 font-medium">
                Update your personal information and contact details.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onLogout}
                className="bg-brand-red hover:opacity-90 text-white text-[10px] font-black uppercase tracking-wider px-4 py-2.5 rounded-lg shadow-md transition-all cursor-pointer"
              >
                Log Out
              </button>
              <button className="bg-brand-gradient hover:opacity-90 text-white text-[10px] font-black uppercase tracking-wider px-4 py-2.5 rounded-lg shadow-md transition-all cursor-pointer">
                Save Changes
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#0e0e11] border border-white/5 rounded-lg px-3.5 py-2 text-xs font-semibold text-white focus:bg-[#0e0e11] focus:border-brand-cyan focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0e0e11] border border-white/5 rounded-lg px-3.5 py-2 text-xs font-semibold text-white focus:bg-[#0e0e11] focus:border-brand-cyan focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#0e0e11] border border-white/5 rounded-lg px-3.5 py-2 text-xs font-semibold text-white focus:bg-[#0e0e11] focus:border-brand-cyan focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">
                  Department
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-[#0e0e11] border border-white/5 rounded-lg px-3.5 py-2 text-xs font-semibold text-white focus:bg-[#0e0e11] focus:border-brand-cyan focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">
                Bio / Notes
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full bg-[#0e0e11] border border-white/5 rounded-lg px-3.5 py-2 text-xs font-semibold text-white focus:bg-[#0e0e11] focus:border-brand-cyan focus:outline-none transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* Right side options: Appearance & Security (span 1) */}
        <div className="space-y-6">
          {/* Appearance Card */}
          <div className="bg-[#1e1e1e] rounded-2xl border border-white/5 p-6 shadow-md">
            <h2 className="text-sm font-extrabold uppercase text-white tracking-wider mb-1">
              Appearance
            </h2>
            <p className="text-[10px] text-gray-400 font-medium mb-4">
              Customize the interface look and feel.
            </p>

            <div className="space-y-3">
              {([
                { id: "Light", label: "Light Mode", icon: "☀️" },
                { id: "Dark", label: "Dark Mode", icon: "🌙" },
                { id: "System", label: "System Sync", icon: "📺" },
              ] as const).map((opt) => {
                const isActive = appearance === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setAppearance(opt.id)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-lg border transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#0e0e11] border-brand-cyan text-brand-cyan"
                        : "bg-white/5 border-white/5 text-gray-400 hover:border-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span>{opt.icon}</span>
                      <span className="text-xs font-extrabold tracking-wide">{opt.label}</span>
                    </div>
                    <span className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center ${
                      isActive ? "border-brand-cyan bg-brand-cyan text-white text-[10px]" : "border-gray-500 bg-[#0e0e11]"
                    }`}>
                      {isActive && "✓"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Security Card */}
          <div className="bg-[#1e1e1e] text-white rounded-2xl border border-white/5 p-6 shadow-md relative overflow-hidden flex flex-col justify-between min-h-[175px]">
            {/* Shield Icon Overlay on background */}
            <div className="absolute right-2 bottom-2 text-white/5 text-8xl font-black pointer-events-none select-none">
              🛡️
            </div>
            
            <div className="relative z-10">
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-white mb-1">
                Security
              </h2>
              <div className="flex items-center gap-1.5 text-[9px] font-black text-brand-green uppercase tracking-widest mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
                Encryption Active
              </div>
            </div>

            <div className="relative z-10 flex flex-col gap-2.5">
              <button className="w-full bg-brand-gradient hover:opacity-90 text-white text-[10px] font-black uppercase tracking-wider py-2.5 rounded-lg transition-all shadow-md cursor-pointer">
                Change Password
              </button>
              <button className="w-full bg-transparent hover:bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-wider py-2.5 rounded-lg transition-all cursor-pointer">
                2FA Settings
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Row 2: Notifications */}
      <div className="bg-[#1e1e1e] rounded-2xl border border-white/5 p-6 shadow-md">
        <h2 className="text-sm font-extrabold uppercase text-white tracking-wider mb-1">
          Notifications
        </h2>
        <p className="text-[10px] text-gray-400 font-medium mb-5">
          Control how and when you receive fleet alerts.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              title: "Email Alerts",
              desc: "Weekly summaries and critical maintenance reports.",
              val: emailAlerts,
              setVal: setEmailAlerts,
              icon: "✉️",
            },
            {
              title: "Push Notifications",
              desc: "Real-time alerts for vehicle breakdowns or delays.",
              val: pushNotes,
              setVal: setPushNotes,
              icon: "🔔",
            },
            {
              title: "SMS Updates",
              desc: "Direct messages for emergency route changes.",
              val: smsUpdates,
              setVal: setSmsUpdates,
              icon: "💬",
            },
          ].map((item) => (
            <div key={item.title} className="bg-[#0e0e11]/70 border border-white/5 rounded-xl p-5 flex flex-col justify-between h-40">
              <div className="flex flex-col gap-2">
                <span className="text-xl">{item.icon}</span>
                <span className="text-xs font-black text-white uppercase tracking-wide">
                  {item.title}
                </span>
                <p className="text-[10px] text-gray-400 font-medium leading-relaxed">
                  {item.desc}
                </p>
              </div>

              {/* Toggle switch */}
              <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-2">
                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">
                  {item.val ? "Enabled" : "Disabled"}
                </span>
                <button
                  type="button"
                  onClick={() => item.setVal(!item.val)}
                  className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-all cursor-pointer ${
                    item.val ? "bg-brand-gradient justify-end" : "bg-white/10 justify-start"
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-white shadow-sm" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 3: Active Sessions */}
      <div className="bg-[#1e1e1e] rounded-2xl border border-white/5 p-6 shadow-md flex flex-col lg:flex-row gap-6 justify-between items-stretch">
        
        {/* Left explanation */}
        <div className="lg:w-1/3 flex flex-col justify-between py-2">
          <div>
            <h2 className="text-sm font-extrabold uppercase text-white tracking-wider mb-1">
              Active Sessions
            </h2>
            <p className="text-[10px] text-gray-400 font-medium leading-relaxed">
              Currently logged-in devices and locations.
            </p>
          </div>

          <button className="flex items-center gap-2 text-brand-red hover:opacity-85 text-[10px] font-black uppercase tracking-wider self-start cursor-pointer mt-6">
            <span>⚠</span> Log out from all other devices
          </button>
        </div>

        {/* Right sessions list */}
        <div className="flex-1 space-y-3">
          {/* Session 1 */}
          <div className="flex items-center justify-between p-4 bg-[#0e0e11]/70 border border-white/5 rounded-xl">
            <div className="flex items-center gap-4">
              <span className="text-xl">💻</span>
              <div className="flex flex-col">
                <span className="text-xs font-black text-white">
                  MacBook Pro 16&quot; • San Francisco, US
                </span>
                <span className="text-[10px] text-gray-500 font-bold">
                  Current Session • Chrome 118.0
                </span>
              </div>
            </div>
            <span className="bg-brand-green/10 border border-brand-green/20 text-brand-green text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded">
              Active
            </span>
          </div>

          {/* Session 2 */}
          <div className="flex items-center justify-between p-4 bg-[#0e0e11]/70 border border-white/5 rounded-xl">
            <div className="flex items-center gap-4">
              <span className="text-xl">📱</span>
              <div className="flex flex-col">
                <span className="text-xs font-black text-white">
                  iPhone 15 Pro • Austin, US
                </span>
                <span className="text-[10px] text-gray-500 font-bold">
                  3 days ago • FleetControl App
                </span>
              </div>
            </div>
            <button className="text-[9px] font-black text-gray-450 hover:text-brand-red uppercase tracking-widest cursor-pointer">
              Terminate
            </button>
          </div>
        </div>

      </div>

      {/* Row 4: Delete Workspace */}
      <div className="bg-brand-red/10 rounded-2xl border border-brand-red/20 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-sm font-extrabold uppercase text-brand-red tracking-wider mb-1">
            Delete Workspace
          </h2>
          <p className="text-[10px] text-brand-red font-semibold">
            Permanently remove all fleet data, client registries, and history. This action cannot be undone.
          </p>
        </div>
        
        <button className="bg-brand-red hover:opacity-90 active:scale-95 text-white text-[10px] font-black uppercase tracking-wider px-5 py-3 rounded-lg shadow-sm transition-all cursor-pointer">
          Delete Account
        </button>
      </div>

    </div>
  );
}
