"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { 
  Calendar, 
  Fuel, 
  Users, 
  Gauge, 
  Zap, 
  Bluetooth, 
  MapPin, 
  Wifi, 
  Camera, 
  Speaker, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp,
  Star
} from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { setBookingForm } from "@/store/slices/bookingSlice";
import { useRouter } from "next/navigation";

interface CarDetailsSectionProps {
  car: any;
}

const features = [
  { icon: <Bluetooth size={18} />, label: "Bluetooth" },
  { icon: <MapPin size={18} />, label: "Built-in GPS" },
  { icon: <Wifi size={18} />, label: "Wireless Qi" },
  { icon: <Camera size={18} />, label: "360° Camera" },
  { icon: <Speaker size={18} />, label: "Sound System" },
  { icon: <ShieldCheck size={18} />, label: "Security" },
];

export const CarDetailsSection = ({ car }: CarDetailsSectionProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  
  const [selectedThumb, setSelectedThumb] = useState(0);
  const [pickUpDate, setPickUpDate] = useState("");
  const [dropOffDate, setDropOffDate] = useState("");
  const [address, setAddress] = useState("");
  const [featuresOpen, setFeaturesOpen] = useState(true);
  const [specsOpen, setSpecsOpen] = useState(false);
  const [policyOpen, setPolicyOpen] = useState(false);

  const handleContinue = () => {
    dispatch(setBookingForm({ 
      carId: car.id, 
      pickupLocation: car.location,
      pickupDate: pickUpDate,
      returnDate: dropOffDate
    }));
    router.push(`/booking?carId=${car.id}`);
  };

  // Mock thumbnails based on the main image for now
  const thumbnails = [
    { src: car.img, alt: "View 1" },
    { src: car.img, alt: "View 2" },
    { src: car.img, alt: "View 3" },
    { src: car.img, alt: "View 4" },
    { src: car.img, alt: "View 5" },
  ];

  return (
    <section className="w-full bg-white pt-40 pb-12">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-24">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Left Column - Gallery & Overview */}
          <div className="w-full lg:w-3/5 space-y-8">
            {/* Main Image */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative aspect-[16/9] rounded-[32px] overflow-hidden shadow-lg bg-gray-100"
            >
              <img 
                src={car.img} 
                alt={car.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-6 right-6">
                <div className="flex items-center gap-2 px-5 py-2.5 bg-black/40 backdrop-blur-md rounded-full border border-white/20 select-none">
                  <Camera size={14} className="text-white" />
                  <span className="text-white text-[11px] font-medium tracking-wider uppercase">360° View</span>
                </div>
              </div>
            </motion.div>

            {/* Thumbnails */}
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {thumbnails.map((thumb, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedThumb(index)}
                  className={`relative flex-shrink-0 w-24 h-16 rounded-2xl overflow-hidden border-2 transition-all duration-200 ${
                    selectedThumb === index ? "border-black scale-95" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={thumb.src} alt={thumb.alt} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Overview */}
            <div className="space-y-6 pt-4">
              <div className="border-b border-gray-100 pb-4">
                <h2 className="text-[#1a1a1a] text-[20px] font-semibold">Overview</h2>
              </div>
              <div className="space-y-4">
                <p className="text-gray-600 text-[15px] leading-relaxed">
                  {car.description || `The ${car.name} is a perfect blend of power, luxury, and precision engineering. Designed to deliver an unmatched driving experience, it combines high-performance capabilities with a sophisticated interior tailored for comfort.`}
                </p>
                <p className="text-gray-600 text-[15px] leading-relaxed">
                  It combines luxury, power, and precision, making it perfect for an unforgettable drive. With flexible rental options, you can experience its thrilling performance and iconic design without compromise.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Title, Pricing, Booking Info */}
          <div className="w-full lg:w-2/5 space-y-10">
            {/* Header Info */}
            <div className="space-y-4">
              <h1 className="text-[#1a1a1a] text-[36px] md:text-[44px] font-bold tracking-tight leading-tight">
                {car.name}
              </h1>
              
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-gray-400 text-[13px] font-medium uppercase tracking-wider">
                <div className="flex items-center gap-1.5"><Calendar size={14} /> 2023</div>
                <div className="w-1 h-1 bg-gray-300 rounded-full" />
                <div className="flex items-center gap-1.5"><Fuel size={14} /> {car.fuel}</div>
                <div className="w-1 h-1 bg-gray-300 rounded-full" />
                <div className="flex items-center gap-1.5"><Users size={14} /> 4 Person</div>
                <div className="w-1 h-1 bg-gray-300 rounded-full" />
                <div className="flex items-center gap-1.5"><Gauge size={14} /> 330 kmph</div>
                <div className="w-1 h-1 bg-gray-300 rounded-full" />
                <div className="flex items-center gap-1.5"><Zap size={14} /> 6 kmpl</div>
              </div>

              <div className="pt-4 flex items-baseline gap-2">
                <span className="text-[#1a1a1a] text-[32px] font-bold">{car.price}</span>
                <span className="text-gray-400 text-[16px]">/day</span>
              </div>
            </div>

            {/* Host Info */}
            {/* <div className="space-y-4">
              <span className="text-gray-400 text-[10px] uppercase font-bold tracking-[2px]">Hosted By:</span>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-3xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500">AB</div>
                  <div>
                    <h4 className="text-[#1a1a1a] text-[15px] font-semibold">Arthur Brown</h4>
                    <p className="text-gray-500 text-[12px]">{car.location}, USA</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-[14px]">
                    <Star size={14} className="text-orange-400 fill-orange-400" />
                    <span className="font-bold text-[#1a1a1a]">4.2</span>
                    <span className="text-gray-400 text-[13px] ml-1">(26 Reviews)</span>
                  </div>
                  <p className="text-gray-400 text-[11px] mt-1">15 Trips • Joined July 2024</p>
                </div>
              </div>
            </div> */}

            {/* Booking Actions */}
            <div className="space-y-6">
              <span className="text-gray-400 text-[10px] uppercase font-bold tracking-[2px]">Rental Info:</span>
              
              {/* <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 border-b border-gray-200 pb-2">
                  <label className="text-gray-500 text-[13px]">Pick Up Date</label>
                  <input 
                    type="date" 
                    value={pickUpDate}
                    onChange={(e) => setPickUpDate(e.target.value)}
                    className="w-full bg-white text-[14px] font-medium outline-none cursor-pointer" 
                  />
                </div>
                <div className="space-y-2 border-b border-gray-200 pb-2">
                  <label className="text-gray-500 text-[13px]">Drop Off Date</label>
                  <input 
                    type="date" 
                    value={dropOffDate}
                    onChange={(e) => setDropOffDate(e.target.value)}
                    className="w-full bg-white text-[14px] font-medium outline-none cursor-pointer" 
                  />
                </div>
              </div> */}

              {/* <div className="space-y-2 border-b border-gray-200 pb-2">
                <label className="text-gray-500 text-[13px]">Pick Up & Return Address</label>
                <div className="flex items-center gap-2">
                   <input 
                    type="text" 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter location address..."
                    className="w-full bg-white text-[14px] font-medium outline-none" 
                  />
                  <MapPin size={16} className="text-gray-300" />
                </div>
              </div> */}

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button 
                  onClick={handleContinue}
                  className="flex-2 bg-[#111827] text-white rounded-full py-3 text-[12px] font-semibold tracking-[1.5px] uppercase hover:bg-black transition-all shadow-md cursor-pointer"
                >
                  Rent Now
                </button>
                {/* <button className="flex-1 bg-white text-[#111827] border border-gray-200 rounded-full py-4 text-[12px] font-bold tracking-[1.5px] uppercase hover:bg-gray-50 transition-all active:scale-95">
                  Add to Wishlist
                </button> */}
              </div>
            </div>

            {/* Accordions */}
            <div className="pt-6 border-t border-gray-100">
              {/* Features Accordion */}
              <div className="border-b border-gray-100 last:border-0 overflow-hidden">
                <button 
                  onClick={() => setFeaturesOpen(!featuresOpen)}
                  className="w-full py-5 flex items-center justify-between group"
                >
                  <span className="text-[#1a1a1a] font-medium">Features</span>
                  {featuresOpen ? <ChevronUp size={18} className="text-gray-400 group-hover:text-black transition-colors" /> : <ChevronDown size={18} className="text-gray-400 group-hover:text-black transition-colors" />}
                </button>
                <motion.div 
                  initial={false}
                  animate={{ height: featuresOpen ? "auto" : 0, opacity: featuresOpen ? 1 : 0 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 py-4">
                    {features.map((feature, i) => (
                      <div key={i} className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-[20px] space-y-2">
                        <div className="text-gray-500">{feature.icon}</div>
                        <span className="text-gray-500 text-[10px] font-medium uppercase tracking-wider">{feature.label}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Specifications Accordion */}
              <div className="border-b border-gray-100 last:border-0 overflow-hidden">
                <button 
                  onClick={() => setSpecsOpen(!specsOpen)}
                  className="w-full py-5 flex items-center justify-between group"
                >
                  <span className="text-[#1a1a1a] font-medium">Specifications</span>
                  {specsOpen ? <ChevronUp size={18} className="text-gray-400 group-hover:text-black transition-colors" /> : <ChevronDown size={18} className="text-gray-400 group-hover:text-black transition-colors" />}
                </button>
                <motion.div 
                  initial={false}
                  animate={{ height: specsOpen ? "auto" : 0, opacity: specsOpen ? 1 : 0 }}
                  className="overflow-hidden"
                >
                  <div className="py-4 text-gray-400 text-[13px] leading-relaxed">
                     Detailed technical specs will be displayed here, including engine volume, torque, and custom modifications.
                  </div>
                </motion.div>
              </div>

              {/* Policy Accordion */}
              <div className="border-b border-gray-100 last:border-0 overflow-hidden">
                <button 
                  onClick={() => setPolicyOpen(!policyOpen)}
                  className="w-full py-5 flex items-center justify-between group"
                >
                  <span className="text-[#1a1a1a] font-medium">Return & Cancellation Policy</span>
                  {policyOpen ? <ChevronUp size={18} className="text-gray-400 group-hover:text-black transition-colors" /> : <ChevronDown size={18} className="text-gray-400 group-hover:text-black transition-colors" />}
                </button>
                <motion.div 
                  initial={false}
                  animate={{ height: policyOpen ? "auto" : 0, opacity: policyOpen ? 1 : 0 }}
                  className="overflow-hidden"
                >
                  <div className="py-4 text-gray-400 text-[13px] leading-relaxed">
                    Flexible cancellation up to 48 hours before the trip starts. Full refund policy applies if the car is not as described.
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
