"use client";
import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { browseCars, carTypes, carBrands, carLocations } from "@/data/carsData";
import svgPaths from "@/lib/svgPaths";
import { motion, AnimatePresence, useInView } from "motion/react";
import Link from "next/link";

const CARS_PER_PAGE = 3;

export function BrowseCarsSection() {
    const [cars, setCars] = useState<any[]>([]);
    const [selectedType, setSelectedType] = useState("All Types");
    const [selectedBrand, setSelectedBrand] = useState("All Brands");
    const [selectedLocation, setSelectedLocation] = useState("All Locations");
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [pickupDate, setPickupDate] = useState("");
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(0);
    const sectionRef = useRef<HTMLElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

    useEffect(() => {
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
    }, []);

    const filteredCars = useMemo(() => {
        return cars.filter((car) => {
            const typeMatch = selectedType === "All Types" || car.type === selectedType;
            const brandMatch = selectedBrand === "All Brands" || car.brand === selectedBrand;
            const locationMatch = selectedLocation === "All Locations" || car.location === selectedLocation;
            return typeMatch && brandMatch && locationMatch;
        });
    }, [cars, selectedType, selectedBrand, selectedLocation]);

    const totalPages = Math.ceil(filteredCars.length / CARS_PER_PAGE);
    const paginatedCars = filteredCars.slice(
        currentPage * CARS_PER_PAGE,
        currentPage * CARS_PER_PAGE + CARS_PER_PAGE
    );

    const handleFilterChange = (type: string, value: string) => {
        if (type === "type") setSelectedType(value);
        if (type === "brand") setSelectedBrand(value);
        if (type === "location") setSelectedLocation(value);
        setOpenDropdown(null);
        setCurrentPage(0);
    };

    const handlePrev = () => setCurrentPage((p) => Math.max(0, p - 1));
    const handleNext = () => setCurrentPage((p) => Math.min(totalPages - 1, p + 1));

    return (
        <section id="browse" ref={sectionRef} className="w-full bg-white px-6 md:px-12 lg:px-24 py-12 md:py-16">
            {/* Top Header */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7 }}
                className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 md:mb-10"
            >
                <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-8 flex-1">
                    <span className="text-gray-400 text-[10px] tracking-[0.25px] uppercase shrink-0">03/Browse Cars</span>
                    <h2 className="text-[#111827] text-[24px] md:text-[30px] leading-[36px] font-bold font-['Inter']">
                        Browse Exclusive Sports Cars<br />For Every Occasion
                    </h2>
                </div>
                <div className="flex items-center gap-2 text-[#1f2937] text-[12px] cursor-pointer hover:opacity-70 transition-opacity">
                    <Link
                        href="/cars"
                        className="hidden md:inline-flex items-center bg-[#111827] text-white rounded-full px-6 py-2.5 text-[12px] font-medium tracking-wide hover:bg-[#1f2937] active:scale-[0.97] transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                        View All
                    </Link>
                </div>
            </motion.div>

            {/* Filter Bar */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-0 border-b border-gray-100 pb-4 mb-8 md:mb-10"
            >
                {/* Car Type Dropdown */}
                <div className="flex-1 relative">
                    <button
                        onClick={() => setOpenDropdown(openDropdown === "type" ? null : "type")}
                        className="w-full flex items-center justify-between sm:border-r sm:border-gray-100 sm:pr-4 h-10 bg-gray-100 transition-colors px-4 rounded"
                    >
                        <span className="text-gray-500 text-[12px]">{selectedType === "All Types" ? "Car Type" : selectedType}</span>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M9.5 4.5L6 8L2.5 4.5" stroke="#9CA3AF" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    <AnimatePresence>
                        {openDropdown === "type" && (
                            <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                className="absolute top-12 left-0 bg-white border border-gray-200 rounded-xl shadow-lg z-20 w-full py-2"
                            >
                                {carTypes.map((t) => (
                                    <button key={t} onClick={() => handleFilterChange("type", t)} className={`block w-full text-left px-4 py-2 text-[12px] transition-colors ${selectedType === t ? "text-black font-medium" : "text-gray-500"}`}>
                                        {t}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Brand Dropdown */}
                <div className="flex-1 relative sm:px-3">
                    <button
                        onClick={() => setOpenDropdown(openDropdown === "brand" ? null : "brand")}
                        className="w-full flex items-center justify-between sm:px-4 sm:border-r sm:border-gray-100 h-10 bg-gray-100 transition-colors px-2 rounded"
                    >
                        <span className="text-gray-500 text-[12px]">{selectedBrand === "All Brands" ? "Brand" : selectedBrand}</span>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M9.5 4.5L6 8L2.5 4.5" stroke="#9CA3AF" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    <AnimatePresence>
                        {openDropdown === "brand" && (
                            <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                className="absolute top-12 left-0 bg-white border border-gray-200 rounded-xl shadow-lg z-20 w-full py-2"
                            >
                                {carBrands.map((b) => (
                                    <button key={b} onClick={() => handleFilterChange("brand", b)} className={`block w-full text-left px-4 py-2 text-[12px] transition-colors ${selectedBrand === b ? "text-black font-medium" : "text-gray-500"}`}>
                                        {b}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Location Dropdown */}
                <div className="flex-1 relative">
                    <button
                        onClick={() => setOpenDropdown(openDropdown === "location" ? null : "location")}
                        className="w-full flex items-center justify-between sm:px-4 sm:border-r sm:border-gray-100 h-10 bg-gray-100 transition-colors px-2 rounded"
                    >
                        <span className="text-gray-500 text-[12px]">{selectedLocation === "All Locations" ? "Pick Up Location" : selectedLocation}</span>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M9.5 4.5L6 8L2.5 4.5" stroke="#9CA3AF" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    <AnimatePresence>
                        {openDropdown === "location" && (
                            <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                className="absolute top-12 left-0 bg-white border border-gray-200 rounded-xl shadow-lg z-20 w-full py-2"
                            >
                                {carLocations.map((l) => (
                                    <button key={l} onClick={() => handleFilterChange("location", l)} className={`block w-full text-left px-4 py-2 text-[12px] transition-colors ${selectedLocation === l ? "text-black font-medium" : "text-gray-500"}`}>
                                        {l}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Pickup Date */}
                <div className="flex-1 relative sm:px-4">
                    <input
                        type="date"
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                        className="w-full h-10 bg-gray-100 rounded px-4 text-gray-500 text-[12px] outline-none border-none cursor-pointer"
                        placeholder="Pick Up Date"
                    />
                </div>

                <div className="sm:pl-4">
                    <motion.button
                        whileHover={{ scale: 1 }}
                        whileTap={{ scale: 1}}
                        onClick={() => { setCurrentPage(0); setOpenDropdown(null); }}
                        className="bg-[#111827] cursor-pointer text-white rounded-full px-10 py-3 text-[13px] font-medium tracking-wide hover:bg-[#1f2937] transition-all duration-200 shadow-md hover:shadow-lg w-full sm:w-auto"
                    >
                        Search Car
                    </motion.button>
                </div>
            </motion.div>

            {/* Car Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 min-h-[370px]">
                <AnimatePresence mode="wait">
                    {paginatedCars.map((car, i) => (
                        <motion.div
                            key={`${car.name}-${currentPage}`}
                            initial={{ opacity: 0, y: 0 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 0 }}
                            transition={{ duration: 0, delay: i * 0 }}
                        >
                            <Link href={`/cars/${car.id}`}>
                                <motion.div
                                    whileHover={{ y: 0 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                    className="cursor-pointer group"
                                >
                                    <div className="bg-gray-100 rounded-2xl overflow-hidden mb-4 relative">
                                        <img loading="lazy" decoding="async" src={car.img} alt={car.name} className="w-full h-[250px] md:h-[300px] object-cover transition-transform duration-500 group-hover:scale-105" />
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                            <div className="bg-white text-[#111827] rounded-full px-6 py-2.5 text-[12px] font-medium tracking-wide shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                                View Details
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-[#111827] text-[14px] leading-[20px] font-bold font-['Inter']">{car.name}</h3>
                                        <span className="text-[#111827] text-[14px] font-semibold">{car.price}</span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-gray-500 text-[10px]">{car.fuel}</span>
                                        <span className="text-gray-300">•</span>
                                        <span className="text-gray-500 text-[10px]">Mileage: {car.mileage}</span>
                                    </div>
                                </motion.div>
                            </Link>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {paginatedCars.length === 0 && (
                    <div className="col-span-full flex items-center justify-center py-16">
                        <p className="text-gray-400 text-[14px]">No cars match your filters. Try adjusting your criteria.</p>
                    </div>
                )}
            </div>

            {/* Navigation Arrows */}
            <div className="flex items-center justify-center gap-4">
                <motion.button
                    whileHover={{ scale: 1 }}
                    whileTap={{ scale: 1 }}
                    onClick={handlePrev}
                    disabled={currentPage === 0}
                    className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors ${currentPage === 0 ? "border-gray-200 opacity-50 cursor-not-allowed" : "border-gray-300 hover:border-black"
                        }`}
                >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d={svgPaths.p3f953000} stroke={currentPage === 0 ? "#9ca3afff" : "#9ca3afff"} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </motion.button>
                <span className="text-gray-400 text-[12px]">{currentPage + 1} / {Math.max(totalPages, 1)}</span>
                <motion.button
                    whileHover={{ scale: 1 }}
                    whileTap={{ scale: 1 }}
                    onClick={handleNext}
                    disabled={currentPage >= totalPages - 1}
                    className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors ${currentPage >= totalPages - 1 ? "border-gray-200 opacity-50 cursor-not-allowed" : "border-black cursor-pointer hover:text-white"
                        }`}
                >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d={svgPaths.p43eff00} stroke={currentPage >= totalPages - 1 ? "#9CA3AF" : "#9ca3afff"} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </motion.button>
            </div>
        </section>
    );
}
