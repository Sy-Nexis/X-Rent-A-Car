import { cookies } from "next/headers";
import ClientRegistryView from "@/components/Clients/ClientRegistryView";

async function getClientsData() {
  const cookieStore = await cookies();
  const token = cookieStore.get("xrent_token")?.value;

  try {
    const res = await fetch("http://localhost:8801/api/clients", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
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

  return <ClientRegistryView totalCount={totalCount} />;
}
