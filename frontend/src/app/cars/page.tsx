"use client";
import { useState, useMemo, useEffect } from "react";
import { browseCars, carTypes, carBrands, carLocations } from "@/data/carsData";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { FooterSection } from "@/components/FooterSection";
import { useAppDispatch } from "@/store/hooks";
import { initAuth } from "@/store/slices/authSlice";

export default function CarsPage() {
    const [cars, setCars] = useState<any[]>([]);
    const [selectedType, setSelectedType] = useState("All Types");
    const [selectedBrand, setSelectedBrand] = useState("All Brands");
    const [selectedLocation, setSelectedLocation] = useState("All Locations");
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(initAuth());

        // Fetch cars from API
        const fetchCars = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://atlasrentalcar-backend.netlify.app/api'}/cars`);
                if (!res.ok) throw new Error("Failed to fetch cars");
                const data = await res.json();
                setCars(data);
            } catch (error) {
                console.error("Error fetching cars:", error);
                setCars(browseCars); // fallback to static data
            }
        };

        fetchCars();
    }, [dispatch]);

    const filteredCars = useMemo(() => {
        return cars.filter((car) => {
            const typeMatch = selectedType === "All Types" || car.type === selectedType;
            const brandMatch = selectedBrand === "All Brands" || car.brand === selectedBrand;
            const locationMatch = selectedLocation === "All Locations" || car.location === selectedLocation;
            return typeMatch && brandMatch && locationMatch;
        });
    }, [cars, selectedType, selectedBrand, selectedLocation]);

    return (
        <div className="min-h-screen bg-white font-['Inter',sans-serif]">
            <Navbar variant="transparent" />
            {/* Page Header */}
            <div className="bg-[#18181b] text-white px-6 md:px-12 lg:px-24 py-12 md:py-16">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[36px] md:text-[48px] font-bold leading-tight"
                >
                    Our Fleet
                </motion.h1>
                <p className="text-gray-400 text-[14px] mt-2 max-w-[500px]">
                    Browse our exclusive collection of luxury and sports cars, each meticulously maintained for the ultimate driving experience.
                </p>
            </div>

            {/* Filters */}
            <div className="px-6 md:px-12 lg:px-24 py-6 border-b border-gray-100">
                <div className="flex flex-wrap gap-4">
                    <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="bg-gray-100 rounded-lg px-4 py-2.5 text-[12px] text-gray-600 border-none outline-none cursor-pointer">
                        {carTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)} className="bg-gray-100 rounded-lg px-4 py-2.5 text-[12px] text-gray-600 border-none outline-none cursor-pointer">
                        {carBrands.map((b) => <option key={b} value={b}>{b}</option>)}
                    </select>
                    <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)} className="bg-gray-100 rounded-lg px-4 py-2.5 text-[12px] text-gray-600 border-none outline-none cursor-pointer">
                        {carLocations.map((l) => <option key={l} value={l}>{l}</option>)}
                    </select>
                    <button onClick={() => { setSelectedType("All Types"); setSelectedBrand("All Brands"); setSelectedLocation("All Locations"); }} className="text-[12px] text-gray-400 hover:text-black transition-colors underline">
                        Clear Filters
                    </button>
                </div>
            </div>

            {/* Cars Grid */}
            <div className="px-6 md:px-12 lg:px-24 py-10">
                <p className="text-gray-400 text-[12px] mb-6">{filteredCars.length} vehicles found</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence mode="wait">
                        {filteredCars.map((car, i) => (
                            <motion.div key={car.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3, delay: i * 0.05 }}>
                                <Link href={`/cars/${car.id}`}>
                                    <motion.div whileHover={{ y: 0 }} className="group cursor-pointer">
                                        <div className="bg-gray-100 rounded-2xl overflow-hidden mb-4 relative">
                                            <img loading="lazy" decoding="async" src={car.img} alt={car.name} className="w-full h-[280px] object-cover transition-transform duration-500 group-hover:scale-105" />
                                            <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1">
                                                <span className="text-white text-[10px] tracking-[0.5px] uppercase">{car.type}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-[#111827] text-[16px] font-bold">{car.name}</h3>
                                            <span className="text-[#111827] text-[14px] font-semibold">{car.price}</span>
                                        </div>
                                        <div className="flex items-center gap-3 mt-2">
                                            <span className="text-gray-400 text-[11px] bg-gray-100 px-2 py-0.5 rounded">{car.fuel}</span>
                                            <span className="text-gray-400 text-[11px] bg-gray-100 px-2 py-0.5 rounded">{car.brand}</span>
                                            <span className="text-gray-400 text-[11px] bg-gray-100 px-2 py-0.5 rounded">{car.location}</span>
                                        </div>
                                    </motion.div>
                                </Link>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
                {filteredCars.length === 0 && (
                    <div className="text-center py-20"><p className="text-gray-400 text-[16px]">No cars match your filters.</p></div>
                )}
            </div>
            <FooterSection />
        </div>
    );
}
