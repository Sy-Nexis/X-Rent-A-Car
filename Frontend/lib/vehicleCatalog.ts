export interface VehicleCatalogItem {
  brand: string;
  model: string;
  category: "Sedan" | "Hatchback" | "SUV / Crossover" | "Van / MPV" | "Luxury" | "Commercial / Pickup";
  transmission: "AUTO" | "MAN";
  fuelType: "Petrol" | "Diesel" | "Hybrid" | "Electric";
  engineCapacity: string;
  dailyRate: number;
  color?: string;
}

export const VEHICLE_CATALOG: VehicleCatalogItem[] = [
  // --- TOYOTA ---
  { brand: "Toyota", model: "Prius", category: "Sedan", transmission: "AUTO", fuelType: "Hybrid", engineCapacity: "1800 cc", dailyRate: 15000, color: "Pearl White" },
  { brand: "Toyota", model: "Axio", category: "Sedan", transmission: "AUTO", fuelType: "Hybrid", engineCapacity: "1500 cc", dailyRate: 13000, color: "Pearl White" },
  { brand: "Toyota", model: "Premio", category: "Sedan", transmission: "AUTO", fuelType: "Petrol", engineCapacity: "1500 cc", dailyRate: 16000, color: "Wine Red" },
  { brand: "Toyota", model: "Allion", category: "Sedan", transmission: "AUTO", fuelType: "Petrol", engineCapacity: "1500 cc", dailyRate: 15500, color: "Silver Metallic" },
  { brand: "Toyota", model: "Aqua", category: "Hatchback", transmission: "AUTO", fuelType: "Hybrid", engineCapacity: "1500 cc", dailyRate: 11000, color: "Metallic Blue" },
  { brand: "Toyota", model: "Vitz", category: "Hatchback", transmission: "AUTO", fuelType: "Petrol", engineCapacity: "1000 cc", dailyRate: 9500, color: "Pearl White" },
  { brand: "Toyota", model: "Yaris", category: "Hatchback", transmission: "AUTO", fuelType: "Petrol", engineCapacity: "1300 cc", dailyRate: 10500, color: "Silver" },
  { brand: "Toyota", model: "Raize", category: "SUV / Crossover", transmission: "AUTO", fuelType: "Petrol", engineCapacity: "1000 cc Turbo", dailyRate: 14500, color: "Turquoise" },
  { brand: "Toyota", model: "C-HR", category: "SUV / Crossover", transmission: "AUTO", fuelType: "Hybrid", engineCapacity: "1800 cc", dailyRate: 17500, color: "Pearl White" },
  { brand: "Toyota", model: "Corolla Cross", category: "SUV / Crossover", transmission: "AUTO", fuelType: "Hybrid", engineCapacity: "1800 cc", dailyRate: 22000, color: "Attitude Black" },
  { brand: "Toyota", model: "RAV4", category: "SUV / Crossover", transmission: "AUTO", fuelType: "Hybrid", engineCapacity: "2500 cc", dailyRate: 28000, color: "Silver Metallic" },
  { brand: "Toyota", model: "Land Cruiser Prado", category: "SUV / Crossover", transmission: "AUTO", fuelType: "Diesel", engineCapacity: "2800 cc", dailyRate: 45000, color: "Black" },
  { brand: "Toyota", model: "Land Cruiser 300 / V8", category: "Luxury", transmission: "AUTO", fuelType: "Diesel", engineCapacity: "3300 cc Twin-Turbo", dailyRate: 65000, color: "Pearl White" },
  { brand: "Toyota", model: "HiAce KDH 201 / 206", category: "Van / MPV", transmission: "AUTO", fuelType: "Diesel", engineCapacity: "3000 cc", dailyRate: 20000, color: "White" },
  { brand: "Toyota", model: "Hilux Revo / Rocco", category: "Commercial / Pickup", transmission: "AUTO", fuelType: "Diesel", engineCapacity: "2800 cc", dailyRate: 25000, color: "Crimson Red" },

  // --- HONDA ---
  { brand: "Honda", model: "Vezel", category: "SUV / Crossover", transmission: "AUTO", fuelType: "Hybrid", engineCapacity: "1500 cc", dailyRate: 15000, color: "Pearl White" },
  { brand: "Honda", model: "Grace", category: "Sedan", transmission: "AUTO", fuelType: "Hybrid", engineCapacity: "1500 cc", dailyRate: 13500, color: "Modern Steel Metallic" },
  { brand: "Honda", model: "Fit / Jazz", category: "Hatchback", transmission: "AUTO", fuelType: "Hybrid", engineCapacity: "1500 cc", dailyRate: 11500, color: "Crystal Black" },
  { brand: "Honda", model: "Civic", category: "Sedan", transmission: "AUTO", fuelType: "Petrol", engineCapacity: "1500 cc Turbo", dailyRate: 20000, color: "Sonic Gray Pearl" },
  { brand: "Honda", model: "CR-V", category: "SUV / Crossover", transmission: "AUTO", fuelType: "Petrol", engineCapacity: "1500 cc Turbo", dailyRate: 28000, color: "Platinum White" },
  { brand: "Honda", model: "Insight", category: "Sedan", transmission: "AUTO", fuelType: "Hybrid", engineCapacity: "1500 cc", dailyRate: 12500, color: "Silver" },
  { brand: "Honda", model: "Shuttle", category: "Van / MPV", transmission: "AUTO", fuelType: "Hybrid", engineCapacity: "1500 cc", dailyRate: 13000, color: "Pearl White" },

  // --- SUZUKI / MARUTI ---
  { brand: "Suzuki", model: "Wagon R FX / FZ / Stingray", category: "Hatchback", transmission: "AUTO", fuelType: "Hybrid", engineCapacity: "660 cc", dailyRate: 7500, color: "Silver Metallic" },
  { brand: "Suzuki", model: "Swift", category: "Hatchback", transmission: "AUTO", fuelType: "Petrol", engineCapacity: "1200 cc", dailyRate: 10000, color: "Burning Red" },
  { brand: "Suzuki", model: "Alto", category: "Hatchback", transmission: "MAN", fuelType: "Petrol", engineCapacity: "800 cc", dailyRate: 6000, color: "Silky Silver" },
  { brand: "Suzuki", model: "Spacia / Spacia Custom", category: "Hatchback", transmission: "AUTO", fuelType: "Hybrid", engineCapacity: "660 cc", dailyRate: 8500, color: "Brisk Blue" },
  { brand: "Suzuki", model: "Hustler", category: "SUV / Crossover", transmission: "AUTO", fuelType: "Hybrid", engineCapacity: "660 cc Turbo", dailyRate: 8500, color: "Phoenix Red" },
  { brand: "Suzuki", model: "Jimny", category: "SUV / Crossover", transmission: "AUTO", fuelType: "Petrol", engineCapacity: "1500 cc", dailyRate: 20000, color: "Kinetic Yellow" },
  { brand: "Suzuki", model: "Baleno", category: "Hatchback", transmission: "AUTO", fuelType: "Petrol", engineCapacity: "1200 cc", dailyRate: 10500, color: "Midnight Black" },
  { brand: "Suzuki", model: "Celerio", category: "Hatchback", transmission: "AUTO", fuelType: "Petrol", engineCapacity: "1000 cc", dailyRate: 7500, color: "Arctic White" },
  { brand: "Suzuki", model: "Every DA17V", category: "Van / MPV", transmission: "AUTO", fuelType: "Petrol", engineCapacity: "660 cc", dailyRate: 8000, color: "White" },

  // --- NISSAN ---
  { brand: "Nissan", model: "Leaf", category: "Hatchback", transmission: "AUTO", fuelType: "Electric", engineCapacity: "40 kWh", dailyRate: 12000, color: "Pearl White" },
  { brand: "Nissan", model: "X-Trail", category: "SUV / Crossover", transmission: "AUTO", fuelType: "Hybrid", engineCapacity: "2000 cc", dailyRate: 22000, color: "Gun Metallic" },
  { brand: "Nissan", model: "Dayz", category: "Hatchback", transmission: "AUTO", fuelType: "Hybrid", engineCapacity: "660 cc", dailyRate: 7500, color: "Pearl White" },
  { brand: "Nissan", model: "Caravan NV350", category: "Van / MPV", transmission: "MAN", fuelType: "Diesel", engineCapacity: "2500 cc", dailyRate: 18000, color: "White" },
  { brand: "Nissan", model: "Navara", category: "Commercial / Pickup", transmission: "AUTO", fuelType: "Diesel", engineCapacity: "2500 cc", dailyRate: 24000, color: "Twilight Gray" },
  { brand: "Nissan", model: "Sunny", category: "Sedan", transmission: "AUTO", fuelType: "Petrol", engineCapacity: "1500 cc", dailyRate: 9000, color: "Silver" },
  { brand: "Nissan", model: "Patrol", category: "Luxury", transmission: "AUTO", fuelType: "Petrol", engineCapacity: "5600 cc V8", dailyRate: 55000, color: "Black" },

  // --- MITSUBISHI ---
  { brand: "Mitsubishi", model: "Outlander PHEV", category: "SUV / Crossover", transmission: "AUTO", fuelType: "Hybrid", engineCapacity: "2400 cc", dailyRate: 24000, color: "Ruby Black Pearl" },
  { brand: "Mitsubishi", model: "Montero / Pajero", category: "SUV / Crossover", transmission: "AUTO", fuelType: "Diesel", engineCapacity: "3200 cc", dailyRate: 35000, color: "Pearl White" },
  { brand: "Mitsubishi", model: "Montero Sport", category: "SUV / Crossover", transmission: "AUTO", fuelType: "Diesel", engineCapacity: "2400 cc", dailyRate: 28000, color: "Titanium Gray" },
  { brand: "Mitsubishi", model: "L200 / Triton", category: "Commercial / Pickup", transmission: "AUTO", fuelType: "Diesel", engineCapacity: "2400 cc", dailyRate: 22000, color: "Diamond Black" },
  { brand: "Mitsubishi", model: "eK Space / eK Custom", category: "Hatchback", transmission: "AUTO", fuelType: "Hybrid", engineCapacity: "660 cc", dailyRate: 7500, color: "White Pearl" },

  // --- MERCEDES-BENZ ---
  { brand: "Mercedes-Benz", model: "C-Class (C200 / C300)", category: "Luxury", transmission: "AUTO", fuelType: "Petrol", engineCapacity: "1500 cc Turbo", dailyRate: 35000, color: "Obsidian Black" },
  { brand: "Mercedes-Benz", model: "E-Class (E200 / E300)", category: "Luxury", transmission: "AUTO", fuelType: "Petrol", engineCapacity: "2000 cc", dailyRate: 50000, color: "Selenite Grey" },
  { brand: "Mercedes-Benz", model: "S-Class (S450 / S500)", category: "Luxury", transmission: "AUTO", fuelType: "Hybrid", engineCapacity: "3000 cc", dailyRate: 95000, color: "Obsidian Black" },
  { brand: "Mercedes-Benz", model: "CLA 200", category: "Luxury", transmission: "AUTO", fuelType: "Petrol", engineCapacity: "1300 cc Turbo", dailyRate: 32000, color: "Polar White" },
  { brand: "Mercedes-Benz", model: "GLC 300", category: "SUV / Crossover", transmission: "AUTO", fuelType: "Petrol", engineCapacity: "2000 cc", dailyRate: 42000, color: "Graphite Grey" },

  // --- BMW ---
  { brand: "BMW", model: "3 Series (318i / 320i / 330e)", category: "Luxury", transmission: "AUTO", fuelType: "Hybrid", engineCapacity: "2000 cc", dailyRate: 35000, color: "Mineral White" },
  { brand: "BMW", model: "5 Series (520d / 530e)", category: "Luxury", transmission: "AUTO", fuelType: "Hybrid", engineCapacity: "2000 cc", dailyRate: 50000, color: "Black Sapphire" },
  { brand: "BMW", model: "7 Series (740Li / 745e)", category: "Luxury", transmission: "AUTO", fuelType: "Hybrid", engineCapacity: "3000 cc", dailyRate: 95000, color: "Imperial Blue" },
  { brand: "BMW", model: "X1 / X3", category: "SUV / Crossover", transmission: "AUTO", fuelType: "Petrol", engineCapacity: "2000 cc", dailyRate: 40000, color: "Phytonic Blue" },
  { brand: "BMW", model: "i4 / iX3", category: "Luxury", transmission: "AUTO", fuelType: "Electric", engineCapacity: "80 kWh", dailyRate: 55000, color: "Brooklyn Grey" },

  // --- AUDI ---
  { brand: "Audi", model: "A4 / A6", category: "Luxury", transmission: "AUTO", fuelType: "Petrol", engineCapacity: "2000 cc TFSI", dailyRate: 38000, color: "Mythos Black" },
  { brand: "Audi", model: "Q3 / Q5", category: "SUV / Crossover", transmission: "AUTO", fuelType: "Petrol", engineCapacity: "2000 cc TFSI", dailyRate: 42000, color: "Glacier White" },
  { brand: "Audi", model: "e-tron", category: "Luxury", transmission: "AUTO", fuelType: "Electric", engineCapacity: "95 kWh", dailyRate: 65000, color: "Navarra Blue" },

  // --- HYUNDAI ---
  { brand: "Hyundai", model: "Tucson", category: "SUV / Crossover", transmission: "AUTO", fuelType: "Diesel", engineCapacity: "2000 cc CRDi", dailyRate: 22000, color: "Phantom Black" },
  { brand: "Hyundai", model: "Santa Fe", category: "SUV / Crossover", transmission: "AUTO", fuelType: "Diesel", engineCapacity: "2200 cc CRDi", dailyRate: 28000, color: "Creamy White" },
  { brand: "Hyundai", model: "Grand i10", category: "Hatchback", transmission: "AUTO", fuelType: "Petrol", engineCapacity: "1200 cc", dailyRate: 8500, color: "Typhoon Silver" },
  { brand: "Hyundai", model: "Ioniq 5", category: "SUV / Crossover", transmission: "AUTO", fuelType: "Electric", engineCapacity: "72.6 kWh", dailyRate: 36000, color: "Gravity Gold" },

  // --- KIA ---
  { brand: "KIA", model: "Sportage", category: "SUV / Crossover", transmission: "AUTO", fuelType: "Diesel", engineCapacity: "2000 cc CRDi", dailyRate: 22000, color: "Clear White" },
  { brand: "KIA", model: "Sorento", category: "SUV / Crossover", transmission: "AUTO", fuelType: "Diesel", engineCapacity: "2200 cc CRDi", dailyRate: 30000, color: "Aurora Black" },
  { brand: "KIA", model: "Picanto", category: "Hatchback", transmission: "AUTO", fuelType: "Petrol", engineCapacity: "1000 cc", dailyRate: 7500, color: "Honey Bee Yellow" },
  { brand: "KIA", model: "Carnival", category: "Van / MPV", transmission: "AUTO", fuelType: "Diesel", engineCapacity: "2200 cc", dailyRate: 38000, color: "Silky Silver" },

  // --- TESLA ---
  { brand: "Tesla", model: "Model 3", category: "Luxury", transmission: "AUTO", fuelType: "Electric", engineCapacity: "60 kWh", dailyRate: 40000, color: "Pearl White Multi-Coat" },
  { brand: "Tesla", model: "Model Y", category: "SUV / Crossover", transmission: "AUTO", fuelType: "Electric", engineCapacity: "75 kWh", dailyRate: 48000, color: "Solid Black" },

  // --- DFSK ---
  { brand: "DFSK", model: "Glory 580", category: "SUV / Crossover", transmission: "AUTO", fuelType: "Petrol", engineCapacity: "1500 cc Turbo", dailyRate: 16000, color: "Silver" },
  { brand: "DFSK", model: "Glory i-Auto", category: "SUV / Crossover", transmission: "AUTO", fuelType: "Petrol", engineCapacity: "1500 cc Turbo", dailyRate: 18000, color: "Black" },

  // --- MAHINDRA ---
  { brand: "Mahindra", model: "Scorpio", category: "SUV / Crossover", transmission: "MAN", fuelType: "Diesel", engineCapacity: "2200 cc mHawk", dailyRate: 16000, color: "Diamond White" },
  { brand: "Mahindra", model: "Bolero Maxi Truck", category: "Commercial / Pickup", transmission: "MAN", fuelType: "Diesel", engineCapacity: "2500 cc", dailyRate: 12000, color: "White" },
  { brand: "Mahindra", model: "KUV100", category: "SUV / Crossover", transmission: "MAN", fuelType: "Petrol", engineCapacity: "1200 cc", dailyRate: 8500, color: "Flamboyant Red" },

  // --- MG ---
  { brand: "MG", model: "ZS EV", category: "SUV / Crossover", transmission: "AUTO", fuelType: "Electric", engineCapacity: "51 kWh", dailyRate: 18000, color: "Dynamic Red" },
  { brand: "MG", model: "HS Turbo", category: "SUV / Crossover", transmission: "AUTO", fuelType: "Petrol", engineCapacity: "1500 cc Turbo", dailyRate: 20000, color: "Pearl White" },
];

export const POPULAR_BRANDS = Array.from(new Set(VEHICLE_CATALOG.map((v) => v.brand)));

/**
 * Filter brands by partial query string
 */
export function searchBrands(query: string): string[] {
  const clean = query.trim().toLowerCase();
  if (!clean) return POPULAR_BRANDS;
  return POPULAR_BRANDS.filter((b) => b.toLowerCase().includes(clean));
}

/**
 * Search vehicles matching brand and/or model query
 */
export function searchVehicles(query: string, currentBrand?: string): VehicleCatalogItem[] {
  const clean = query.trim().toLowerCase();
  const cleanBrand = (currentBrand || "").trim().toLowerCase();

  return VEHICLE_CATALOG.filter((item) => {
    const matchesBrandFilter = !cleanBrand || item.brand.toLowerCase() === cleanBrand || item.brand.toLowerCase().includes(cleanBrand);
    if (!clean) return matchesBrandFilter;

    const brandMatch = item.brand.toLowerCase().includes(clean);
    const modelMatch = item.model.toLowerCase().includes(clean);
    const fullMatch = `${item.brand} ${item.model}`.toLowerCase().includes(clean);

    return (matchesBrandFilter && modelMatch) || fullMatch || brandMatch;
  });
}
