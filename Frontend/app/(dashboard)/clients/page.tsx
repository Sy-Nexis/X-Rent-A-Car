import { cookies } from "next/headers";
import ClientRegistryView from "@/components/Clients/ClientRegistryView";

async function getClientsData() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value || cookieStore.get("xrent_token")?.value;

  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch("http://localhost:8801/api/clients/view", {
      cache: "no-store",
      headers,
    });
    const result = await res.json();
    return result.data || [];
  } catch (error) {
    return [];
  }
}

export default async function ClientsPage() {
  const clients = await getClientsData();
  const totalCount = clients.length;

  return <ClientRegistryView totalCount={totalCount} initialClients={clients} />;
}
