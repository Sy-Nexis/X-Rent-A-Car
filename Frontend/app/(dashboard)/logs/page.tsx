import ActivityLogsView from "@/components/Logs/ActivityLogsView";

export const metadata = {
  title: "Activity & Audit Logs | neXus Fleet",
  description: "Real-time activity ledger showing what logged-in users have done with names, roles, actions, and exact timestamps.",
};

export default function LogsPage() {
  return <ActivityLogsView />;
}
