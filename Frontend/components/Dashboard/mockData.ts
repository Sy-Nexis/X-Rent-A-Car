import { 
  Car, 
  Users, 
  Route, 
  ShieldAlert 
} from "lucide-react";

export const statsData = [
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

export const drivers = [
  { name: "Amal Kumar", id: "XNR-1042", location: "Colombo 03", speed: 72, status: "Active" },
  { name: "Ravi Seneviratne", id: "XNR-8831", location: "Kandy Road", speed: 45, status: "Active" },
  { name: "Sunil Perera", id: "XNR-5521", location: "Galle Face", speed: 0, status: "Idle" },
  { name: "Pradeep M.", id: "XNR-9902", location: "Matara", speed: 88, status: "Alert" },
  { name: "Nuwan J.", id: "XNR-1120", location: "Negombo", speed: 0, status: "Offline" },
];

export const activityLog = [
  { time: "14:32", text: "Amal Kumar started trip to Hemas Ltd.", type: "start" },
  { time: "14:28", text: "Pradeep M. exceeded speed limit (88km/h).", type: "alert" },
  { time: "14:15", text: "Vehicle XNR-5521 entered Idle state.", type: "idle" },
  { time: "13:50", text: "Ravi S. completed delivery at Kandy Road.", type: "stop" },
  { time: "13:45", text: "Engine warning on XNR-9902.", type: "alert" },
];

export const tripsData = [
  { day: "Mon", trips: 120 },
  { day: "Tue", trips: 132 },
  { day: "Wed", trips: 180 },
  { day: "Thu", trips: 145 },
  { day: "Fri", trips: 160 },
  { day: "Sat", trips: 210 },
  { day: "Sun", trips: 110 },
];

export const pieData = [
  { name: "Active", value: 48, color: "#0071e3" },
  { name: "Idle", value: 4, color: "#ff9f0a" },
  { name: "Offline", value: 2, color: "#6e6e73" },
];

export const alertsData = [
  { title: "Engine warning", detail: "Sunil K., Matara region", severity: "🔴" },
  { title: "Speed limit exceeded", detail: "Amal K., 88 in 80 zone", severity: "🟠" },
  { title: "Fuel low", detail: "Pradeep M.", severity: "🟡" },
];
