"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { BrowseCar, browseCars } from "@/data/carsData";

interface FeaturedCarsSectionProps {
  currentCar?: BrowseCar;
  title?: string;
}

export const FeaturedCarsSection = ({ currentCar, title }: FeaturedCarsSectionProps) => {
  const [displayCars, setDisplayCars] = useState<BrowseCar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSimilarCars = async () => {
      setLoading(true);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://atlasrentalcar-backend.netlify.app/api';
        
        let url = `${apiUrl}/cars`;
        if (currentCar?.type) {
          url += `?type=${encodeURIComponent(currentCar.type)}`;
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch cars");
        
        let data: BrowseCar[] = await res.json();
        
        // Filter out current car and limit to 3
        let filtered = data.filter(car => car.id !== currentCar?.id).slice(0, 3);
        
        // If we don't have enough cars from API, fallback to static data
        if (filtered.length < 3) {
          const staticSimilar = browseCars.filter(car => 
            car.id !== currentCar?.id && 
            (currentCar?.type ? car.type === currentCar.type : true)
          );
          
          // Combine and remove duplicates by ID
          const combined = [...filtered];
          staticSimilar.forEach(sCar => {
            if (combined.length < 3 && !combined.find(c => c.id === sCar.id)) {
              combined.push(sCar);
            }
          });
          filtered = combined;
        }

        // If still empty or not enough (e.g. no cars of same type), just get any 3 cars
        if (filtered.length === 0) {
          filtered = browseCars.filter(car => car.id !== currentCar?.id).slice(0, 3);
        }

        setDisplayCars(filtered);
      } catch (err) {
        console.error("Error fetching similar cars:", err);
        // Fallback to static data on error
        const fallback = browseCars
          .filter(car => car.id !== currentCar?.id && (currentCar?.type ? car.type === currentCar.type : true))
          .slice(0, 3);
        setDisplayCars(fallback.length > 0 ? fallback : browseCars.filter(c => c.id !== currentCar?.id).slice(0, 3));
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarCars();
  }, [currentCar?.id, currentCar?.type]);

  if (loading) {
    return (
      <section className="w-full bg-[#F9FAFB] py-24">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-24">
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-500">Loading similar cars...</p>
          </div>
        </div>
      </section>
    );
  }

  if (displayCars.length === 0) return null;

  return (
    <section className="w-full bg-[#F9FAFB] py-24">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-24">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div className="space-y-2">
            <h2 className="text-[#1a1a1a] text-[32px] font-bold tracking-tight">
              {title || (currentCar ? "Similar Cars" : "Featured Cars")}
            </h2>
            <div className="w-12 h-1 bg-black rounded-full" />
          </div>
          
          <Link 
            href="/cars" 
            className="group inline-flex items-center gap-2 py-2 text-[#222222] font-semibold text-[14px]"
          >
            <span>View All</span>
            <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
              <ArrowUpRight size={16} />
            </div>
          </Link>
        </div>

        {/* Cars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayCars.map((car, idx) => (
            <Link key={car.id} href={`/cars/${car.id}`} className="flex flex-col group cursor-pointer">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                {/* Image Container */}
                <div className="relative aspect-[4/3] rounded-[24px] overflow-hidden bg-gray-200 mb-6">
                  <div className="absolute inset-0 bg-gray-200 group-hover:scale-105 transition-transform duration-700" />
                  <img 
                    src={car.img} 
                    alt={car.name} 
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Info */}
                <div className="space-y-4 px-2">
                  <h3 className="text-[#1a1a1a] text-[22px] font-bold tracking-tight">{car.name}</h3>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 font-medium text-[14px]">{car.price}</span>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 text-[12px]">{car.fuel}</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-gray-500 text-[12px]">Mileage: {car.mileage}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

