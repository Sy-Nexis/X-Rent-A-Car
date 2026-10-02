"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Activity,
  User,
  Clock,
  Search,
  RefreshCw,
  Trash2,
  Download,
  Filter,
  Layers,
  Car,
  Users,
  ShieldCheck,
  LogIn,
  CheckCircle2,
  FileSpreadsheet,
  AlertCircle
} from "lucide-react";
import { fetchLogs, clearAllLogs } from "@/lib/api";

export default function ActivityLogsView() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedUser, setSelectedUser] = useState<string>("All");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadLogs = async (force = false) => {
    setIsLoading(true);
    try {
      const data = await fetchLogs(force);
      if (Array.isArray(data)) {
        setLogs(data);
      }
    } catch (err) {
      console.error("Failed to load logs:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const [currentLoggedInUser, setCurrentLoggedInUser] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user");
      if (stored) {
        try {
          const u = JSON.parse(stored);
          const name = u.name || u.fullName || u.userName || u.user_name || u.email;
          const role = u.role || u.user_role || "Staff";
          if (name) setCurrentLoggedInUser({ name, role });
        } catch {}
      }
    }
  }, []);

  const resolveUserName = (rawName?: string) => {
    if (!rawName || rawName === "Staff User" || rawName === "Alex Rivera") {
      if (currentLoggedInUser?.name) return currentLoggedInUser.name;
      return "Staff User";
    }
    return rawName;
  };

  const resolveUserRole = (rawRole?: string, rawName?: string) => {
    if (!rawRole || rawName === "Staff User" || rawName === "Alex Rivera") {
      if (currentLoggedInUser?.role) return currentLoggedInUser.role;
      return "STAFF";
    }
    return rawRole;
  };

  // Unique list of users for dropdown filter
  const uniqueUsers = useMemo(() => {
    const set = new Set<string>();
    logs.forEach((l) => {
      const name = resolveUserName(l.user_name || l.userName);
      if (name) set.add(name);
    });
    if (currentLoggedInUser?.name) set.add(currentLoggedInUser.name);
    return Array.from(set);
  }, [logs, currentLoggedInUser]);

  // Filtered logs
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const resolvedName = resolveUserName(log.user_name || log.userName);
      const userName = resolvedName.toLowerCase();
      const action = (log.action || "").toLowerCase();
      const details = (log.details || "").toLowerCase();
      const entityType = (log.entity_type || log.entityType || "").toLowerCase();
      const q = searchQuery.toLowerCase();

      // Category filter
      if (selectedCategory !== "All") {
        if (selectedCategory.toLowerCase() !== entityType) {
          return false;
        }
      }

      // User filter
      if (selectedUser !== "All") {
        if (resolvedName !== selectedUser) {
          return false;
        }
      }

      // Search match
      if (q) {
        const matches =
          userName.includes(q) ||
          action.includes(q) ||
          details.includes(q) ||
          entityType.includes(q);
        if (!matches) return false;
      }

      return true;
    });
  }, [logs, searchQuery, selectedCategory, selectedUser, currentLoggedInUser]);

  // Relative time helper
  const formatTimeAgo = (dateStr: string) => {
    if (!dateStr) return "Just now";
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    return `${diffDays}d ago`;
  };

  // Exact time formatter
  const formatExactTime = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      return d.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
    } catch {
      return dateStr;
    }
  };

  // Action Badge styling helper
  const getActionBadge = (action: string) => {
    const act = (action || "").toLowerCase();
    if (act.includes("assigned")) {
      return {
        bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
        icon: <Layers size={13} className="text-emerald-400" />,
      };
    }
    if (act.includes("registered vehicle") || act.includes("created vehicle")) {
      return {
        bg: "bg-blue-500/10 text-brand-cyan border-blue-500/30",
        icon: <Car size={13} className="text-brand-cyan" />,
      };
    }
    if (act.includes("client")) {
      return {
        bg: "bg-teal-500/10 text-brand-green border-teal-500/30",
        icon: <Users size={13} className="text-brand-green" />,
      };
    }
    if (act.includes("returned") || act.includes("updated")) {
      return {
        bg: "bg-amber-500/10 text-amber-400 border-amber-500/30",
        icon: <Clock size={13} className="text-amber-400" />,
      };
    }
    if (act.includes("terminated") || act.includes("deleted")) {
      return {
        bg: "bg-rose-500/10 text-rose-400 border-rose-500/30",
        icon: <Trash2 size={13} className="text-rose-400" />,
      };
    }
    if (act.includes("login") || act.includes("auth")) {
      return {
        bg: "bg-purple-500/10 text-purple-400 border-purple-500/30",
        icon: <LogIn size={13} className="text-purple-400" />,
      };
    }
    return {
      bg: "bg-gray-500/10 text-gray-300 border-white/10",
      icon: <Activity size={13} className="text-gray-400" />,
    };
  };

  // Initials generator
  const getInitials = (name: string) => {
    const parts = (name || "").trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return (name || "AR").slice(0, 2).toUpperCase();
  };

  // Clear all logs
  const handleClearLogs = async () => {
    if (!confirm("Are you sure you want to clear all recorded audit activity logs?")) return;
    try {
      await clearAllLogs();
      setLogs([]);
      setSuccessMessage("Activity logs cleared successfully.");
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      alert("Failed to clear logs: " + (err.message || "Unknown error"));
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    if (logs.length === 0) {
      alert("No logs available to export.");
      return;
    }
    const headers = ["ID", "User Name", "User Role", "Action", "Category", "Details", "Timestamp"];
    const rows = logs.map((l) => [
      l.id,
      `"${(resolveUserName(l.user_name || l.userName) || "").replace(/"/g, '""')}"`,
      `"${(resolveUserRole(l.user_role || l.userRole, l.user_name || l.userName) || "").replace(/"/g, '""')}"`,
      `"${(l.action || "").replace(/"/g, '""')}"`,
      `"${(l.entity_type || l.entityType || "").replace(/"/g, '""')}"`,
      `"${(l.details || "").replace(/"/g, '""')}"`,
      `"${l.created_at || l.createdAt || ""}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `nexus_fleet_audit_logs_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Metrics summary
  const todayStr = new Date().toISOString().split("T")[0];
  const logsToday = logs.filter((l) => (l.created_at || l.createdAt || "").startsWith(todayStr)).length;
  const assignmentActions = logs.filter((l) => (l.entity_type || l.entityType || "").toLowerCase() === "assignment").length;

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar bg-[#0e0e11] min-h-screen flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-widest text-brand-cyan mb-1">
            <Activity size={14} />
            <span>Audit & Compliance Ledger</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Activity Logs</h1>
          <p className="text-sm text-gray-400 font-medium mt-0.5">
            Real-time audit records of actions performed by logged-in users with timestamps and full details.
          </p>
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => loadLogs(true)}
            disabled={isLoading}
            className="flex items-center gap-2 px-3.5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-gray-300 hover:text-white transition-all cursor-pointer"
          >
            <RefreshCw size={13} className={isLoading ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2 bg-brand-cyan/10 hover:bg-brand-cyan/20 border border-brand-cyan/30 rounded-xl text-xs font-bold text-brand-cyan transition-all cursor-pointer"
          >
            <Download size={13} />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleClearLogs}
            className="flex items-center gap-2 px-3.5 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl text-xs font-bold text-rose-400 transition-all cursor-pointer"
          >
            <Trash2 size={13} />
            <span>Clear Ledger</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#1e1e1e] rounded-2xl border border-white/5 p-5 shadow-md flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider block mb-1">
              Total Logged Events
            </span>
            <span className="text-3xl font-black text-white">{logs.length}</span>
            <span className="text-[11px] font-bold text-brand-cyan block mt-1">Recorded audit trail</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-brand-cyan flex items-center justify-center">
            <Activity size={24} />
          </div>
        </div>

        <div className="bg-[#1e1e1e] rounded-2xl border border-white/5 p-5 shadow-md flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider block mb-1">
              Actions Today
            </span>
            <span className="text-3xl font-black text-emerald-400">{logsToday}</span>
            <span className="text-[11px] font-bold text-emerald-400 block mt-1">Active operations</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Clock size={24} />
          </div>
        </div>

        <div className="bg-[#1e1e1e] rounded-2xl border border-white/5 p-5 shadow-md flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider block mb-1">
              Active Operators
            </span>
            <span className="text-3xl font-black text-purple-400">{uniqueUsers.length || 1}</span>
            <span className="text-[11px] font-bold text-purple-400 block mt-1">Logged personnel</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <User size={24} />
          </div>
        </div>

        <div className="bg-[#1e1e1e] rounded-2xl border border-white/5 p-5 shadow-md flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider block mb-1">
              Assignment Operations
            </span>
            <span className="text-3xl font-black text-brand-green">{assignmentActions}</span>
            <span className="text-[11px] font-bold text-brand-green block mt-1">Vehicle allocations</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-green-500/10 text-brand-green flex items-center justify-center">
            <Layers size={24} />
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-3">
          <CheckCircle2 size={18} className="flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Controls & Filter Bar */}
      <div className="bg-[#1e1e1e] rounded-2xl border border-white/5 p-5 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#121214] rounded-xl border border-white/5">
          {["All", "Assignment", "Vehicle", "Client", "Auth"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-brand-gradient text-white shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {cat === "All" ? "All Categories" : cat}
            </button>
          ))}
        </div>

        {/* User filter & Search */}
        <div className="flex flex-wrap items-center gap-3">
          {/* User selector */}
          <div className="relative">
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              aria-label="Filter logs by user"
              className="bg-[#121214] text-white text-xs font-semibold rounded-xl px-3 py-2 border border-white/5 focus:border-brand-cyan outline-none cursor-pointer"
            >
              <option value="All">All Operators ({uniqueUsers.length})</option>
              {uniqueUsers.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>

          {/* Search box */}
          <div className="relative flex-1 sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search user, action, details..."
              className="w-full bg-[#121214] text-white text-xs rounded-xl pl-9 pr-3 py-2 border border-white/5 focus:border-brand-cyan outline-none placeholder:text-gray-600"
            />
          </div>
        </div>
      </div>

      {/* Main Audit Log Table */}
      <div className="bg-[#1e1e1e] rounded-2xl border border-white/5 shadow-md overflow-hidden flex flex-col">
        <div className="p-4 md:p-6 border-b border-white/5 flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-white tracking-wide">
              Historical Activity Ledger ({filteredLogs.length})
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Comprehensive chronologically indexed event log of all personnel actions.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-gray-400 font-bold uppercase text-[9px] tracking-wider">
                <th className="p-4 pl-6">Logged User</th>
                <th className="p-4">Action</th>
                <th className="p-4">Category</th>
                <th className="p-4">Action Details</th>
                <th className="p-4 pr-6 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-300">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-gray-500 font-medium">
                    {isLoading ? "Retrieving activity audit trail..." : "No matching activity log records found."}
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const badge = getActionBadge(log.action);
                  const userName = resolveUserName(log.user_name || log.userName);
                  const userRole = resolveUserRole(log.user_role || log.userRole, log.user_name || log.userName);
                  const timestamp = log.created_at || log.createdAt;

                  return (
                    <tr key={log.id} className="hover:bg-white/5 transition-colors">
                      {/* User Column */}
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-brand-gradient flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                            {getInitials(userName)}
                          </div>
                          <div>
                            <p className="font-bold text-white leading-tight">{userName}</p>
                            <span className="text-[9px] font-extrabold uppercase text-brand-cyan tracking-wider">
                              {userRole}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Action Column */}
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${badge.bg}`}
                        >
                          {badge.icon}
                          <span>{log.action}</span>
                        </span>
                      </td>

                      {/* Category */}
                      <td className="p-4">
                        <span className="px-2.5 py-0.5 rounded-md text-[9px] font-extrabold uppercase bg-white/5 text-gray-400 border border-white/5">
                          {log.entity_type || log.entityType || "General"}
                        </span>
                      </td>

                      {/* Details Column */}
                      <td className="p-4 max-w-md">
                        <p className="text-gray-300 font-medium leading-relaxed">{log.details}</p>
                        {log.entity_id && (
                          <span className="text-[10px] text-gray-500 font-mono mt-0.5 block">
                            Target ID: #{log.entity_id}
                          </span>
                        )}
                      </td>

                      {/* Timestamp Column */}
                      <td className="p-4 pr-6 text-right">
                        <div className="flex flex-col items-end">
                          <span className="font-bold text-white text-xs">{formatTimeAgo(timestamp)}</span>
                          <span className="text-[10px] text-gray-400 font-mono mt-0.5">
                            {formatExactTime(timestamp)}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
