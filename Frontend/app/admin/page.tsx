import { getVehicles } from '@/actions/vehicleActions';
import VehicleTable from '@/components/VehicleTable';

export default async function AdminPage() {
  const response = await getVehicles();
  const vehicles = response.success ? response.data : [];

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-[#1c1c1e]">
      <main className="p-6 max-w-7xl mx-auto">
        {/* Pass the server-fetched data down to the client component */}
        <VehicleTable initialData={vehicles} />
      </main>
    </div>
  );
}