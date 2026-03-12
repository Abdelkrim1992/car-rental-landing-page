"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

// Mock data as provided by user
const featuredCars = [
  {
    id: 1,
    name: "Porsche Taycan 4S",
    price: "$10.99/Day",
    fuelType: "Petrol",
    mileage: "18031",
    image: "/red-porsche-taycan-4s-parked-on-a-paved-driveway.png",
  },
  {
    id: 2,
    name: "Mustang GT 350",
    price: "$10.99/Day",
    fuelType: "Petrol",
    mileage: "18031",
    image: "/blue-mustang-GT-350-parked-on-an-asphalt-road-with-trees-in-the-background.png",
  },
  {
    id: 3,
    name: "Ferrari 812 Superfast",
    price: "$10.99/Day",
    fuelType: "Petrol",
    mileage: "18031",
    image: "/yellow-ferrari-812-superfast-parked-next-to-a-red-brick-building.png",
  },
];

export const FeaturedCarsSection = () => {
  return (
    <section className="w-full bg-[#F9FAFB] py-24">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-24">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div className="space-y-2">
            <h2 className="text-[#1a1a1a] text-[32px] font-bold tracking-tight">Featured Cars</h2>
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
          {featuredCars.map((car, idx) => (
            <motion.div 
              key={car.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col group cursor-pointer"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] rounded-[24px] overflow-hidden bg-gray-200 mb-6">
                 {/* Fallback color if image fails */}
                <div className="absolute inset-0 bg-gray-200 group-hover:scale-105 transition-transform duration-700" />
                <img 
                  src={car.image} 
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
                    <span className="text-gray-500 text-[12px]">{car.fuelType}</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-gray-500 text-[12px]">Mileage: {car.mileage}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
