"use client";

import { useRef, useState } from 'react';
import { addVehicle } from '@/actions/vehicleActions';

interface AddVehicleModalProps {
  onClose: () => void;
}

export default function AddVehicleModal({ onClose }: AddVehicleModalProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);

    const response = await addVehicle(formData);

    setLoading(false);

    if (response.success) {
      formRef.current?.reset();
      onClose();
    } else {
      alert(response.error);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20">
      <div className="bg-white dark:bg-[#2c2c2e] p-6 rounded-2xl w-full max-w-md shadow-xl border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-[#1d1d1f] dark:text-[#f5f5f7]">Register New Vehicle</h2>

        {/* The action attribute natively ties the form to our submit handler */}
        <form ref={formRef} action={handleSubmit} className="space-y-4">

          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider font-bold">Make</label>
            <input
              name="make"
              required
              className="w-full mt-1 p-2 bg-gray-50 dark:bg-[#1c1c1e] text-[#1d1d1f] dark:text-[#f5f5f7] rounded-lg border border-transparent focus:border-blue-500 outline-none"
              placeholder="e.g. Toyota"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider font-bold">Model</label>
            <input
              name="model"
              required
              className="w-full mt-1 p-2 bg-gray-50 dark:bg-[#1c1c1e] text-[#1d1d1f] dark:text-[#f5f5f7] rounded-lg border border-transparent focus:border-blue-500 outline-none"
              placeholder="e.g. Prius"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider font-bold">License Plate</label>
            <input
              name="licensePlate"
              required
              className="w-full mt-1 p-2 bg-gray-50 dark:bg-[#1c1c1e] text-[#1d1d1f] dark:text-[#f5f5f7] rounded-lg border border-transparent focus:border-blue-500 outline-none"
              placeholder="e.g. CBA-9921"
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[#0071e3] text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Vehicle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}