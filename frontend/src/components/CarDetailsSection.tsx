"use client";

import { useState, useEffect } from "react";
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
  Star,
  User, 
  Mail, 
  Phone, 
  MessageSquare, 
  Check,
  ChevronLeft,
  ChevronRight 
} from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { createBooking } from "@/store/slices/bookingSlice";

interface CarDetailsSectionProps {
  car: any;
}

const featureIcons = [
  { icon: <Bluetooth size={18} />, label: "Bluetooth" },
  { icon: <MapPin size={18} />, label: "Built-in GPS" },
  { icon: <Wifi size={18} />, label: "Wireless Qi" },
  { icon: <Camera size={18} />, label: "360° Camera" },
  { icon: <Speaker size={18} />, label: "Sound System" },
  { icon: <ShieldCheck size={18} />, label: "Security" },
];

const iconMap: Record<string, React.ReactNode> = {
  "Bluetooth": <Bluetooth size={18} />,
  "Built-in GPS": <MapPin size={18} />,
  "Wireless Qi": <Wifi size={18} />,
  "360° Camera": <Camera size={18} />,
  "Sound System": <Speaker size={18} />,
  "Security": <ShieldCheck size={18} />,
  "GPS": <MapPin size={18} />,
  "Wifi": <Wifi size={18} />,
  "Camera": <Camera size={18} />,
  "Speaker": <Speaker size={18} />,
  "Fuel": <Fuel size={18} />,
  "Users": <Users size={18} />,
  "Gauge": <Gauge size={18} />,
  "Zap": <Zap size={18} />,
};

export const CarDetailsSection = ({ car }: CarDetailsSectionProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  
  const [selectedThumb, setSelectedThumb] = useState(0);
  const [pickUpDate, setPickUpDate] = useState("");
  const [dropOffDate, setDropOffDate] = useState("");
  const [address, setAddress] = useState(car.location || "");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestMessage, setGuestMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [featuresOpen, setFeaturesOpen] = useState(true);
  const [specsOpen, setSpecsOpen] = useState(false);
  const [policyOpen, setPolicyOpen] = useState(false);

  const handleBooking = async () => {
    const newErrors: Record<string, string> = {};
    if (!pickUpDate) newErrors.pickUpDate = "Pick up date is required";
    if (!dropOffDate) newErrors.dropOffDate = "Drop off date is required";
    if (!address) newErrors.address = "Pickup address is required";
    if (!guestName) newErrors.guestName = "Full name is required";
    if (!guestEmail) {
      newErrors.guestEmail = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(guestEmail)) {
      newErrors.guestEmail = "Email is invalid";
    }
    if (!guestPhone) newErrors.guestPhone = "Phone number is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    
    const priceNum = parseFloat(car.price.replace(/[^0-9.]/g, "")) || 0;
    const days = Math.max(1, Math.ceil((new Date(dropOffDate).getTime() - new Date(pickUpDate).getTime()) / 86400000)) || 1;
    const total = days * priceNum;

    try {
      await dispatch(createBooking({
        car_id: car.id,
        car_name: car.name,
        pickup_date: pickUpDate,
        return_date: dropOffDate,
        pickup_location: address,
        total_price: total,
        guest_name: guestName,
        guest_email: guestEmail,
        guest_phone: guestPhone,
        guest_message: guestMessage,
      })).unwrap();
      
      router.push("/booking/success");
    } catch (err: any) {
      console.error("Booking error:", err);
      alert(err.message || "Failed to create booking");
    } finally {
      setIsSubmitting(false);
    }
  };

  const allImages = Array.isArray(car.images) && car.images.length > 1 
    ? (car.images.includes(car.img) ? car.images : [car.img, ...car.images])
    : [car.img];

  const thumbnails = allImages.map((img: string, i: number) => ({ src: img, alt: `View ${i + 1}` }));

  const currentImage = thumbnails[selectedThumb]?.src || car.img;

  const nextImage = () => setSelectedThumb((prev) => (prev + 1) % thumbnails.length);
  const prevImage = () => setSelectedThumb((prev) => (prev - 1 + thumbnails.length) % thumbnails.length);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (thumbnails.length <= 1) return;
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [thumbnails.length]);

  const carFeatures = Array.isArray(car.features) ? car.features : [];
  const carSpecs = car.specifications || {};

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
                src={currentImage} 
                alt={car.name} 
                className="w-full h-full object-cover transition-all duration-500"
              />

              {/* Navigation Arrows */}
              {thumbnails.length > 1 && (
                <>
                  <button 
                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                    className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-black/40"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                    className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-black/40"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}

              <div className="absolute bottom-6 left-6">
                <div className="flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10 select-none">
                  <span className="text-white text-[11px] font-bold">{selectedThumb + 1} / {thumbnails.length}</span>
                </div>
              </div>

              <div className="absolute bottom-6 right-6">
                <div className="flex items-center gap-2 px-5 py-2.5 bg-black/40 backdrop-blur-md rounded-full border border-white/20 select-none">
                  <Camera size={14} className="text-white" />
                  <span className="text-white text-[11px] font-medium tracking-wider uppercase">360° View</span>
                </div>
              </div>
            </motion.div>

            {/* Thumbnails */}
            {thumbnails.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {thumbnails.map((thumb: any, index: number) => (
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
            )}

            {/* Overview */}
            <div className="space-y-6 pt-4">
              <div className="border-b border-gray-100 pb-4">
                <h2 className="text-[#1a1a1a] text-[20px] font-semibold">Overview</h2>
              </div>
              <div className="space-y-4">
                <p className="text-gray-600 text-[15px] leading-relaxed">
                  {car.description || `The ${car.name} is a perfect blend of power, luxury, and precision engineering. Designed to deliver an unmatched driving experience, it combines high-performance capabilities with a sophisticated interior tailored for comfort.`}
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
                {car.year && <div className="flex items-center gap-1.5"><Calendar size={14} /> {car.year}</div>}
                {car.year && <div className="w-1 h-1 bg-gray-300 rounded-full" />}
                <div className="flex items-center gap-1.5"><Fuel size={14} /> {car.fuel}</div>
                <div className="w-1 h-1 bg-gray-300 rounded-full" />
                <div className="flex items-center gap-1.5"><Users size={14} /> {car.seats || 4} Person</div>
                {car.top_speed && (
                  <>
                    <div className="w-1 h-1 bg-gray-300 rounded-full" />
                    <div className="flex items-center gap-1.5"><Gauge size={14} /> {car.top_speed}</div>
                  </>
                )}
                {car.acceleration && (
                  <>
                    <div className="w-1 h-1 bg-gray-300 rounded-full" />
                    <div className="flex items-center gap-1.5"><Zap size={14} /> {car.acceleration}</div>
                  </>
                )}
              </div>

              <div className="pt-4 flex items-baseline gap-2">
                <span className="text-[#1a1a1a] text-[32px] font-bold">{car.price.includes('$') ? car.price : `$${car.price}`}</span>
                <span className="text-gray-400 text-[16px]">/day</span>
              </div>
            </div>

            {/* Booking Actions */}
            <div className="space-y-6">
              <span className="text-gray-400 text-[10px] uppercase font-bold tracking-[2px]">Rental Info:</span>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="relative space-y-2 border-b border-gray-200 pb-2">
                  <label className="text-gray-500 text-[13px]">Pick Up Date</label>
                  <input 
                    type="date" 
                    value={pickUpDate}
                    onChange={(e) => {
                      setPickUpDate(e.target.value);
                      if (errors.pickUpDate) setErrors(prev => ({ ...prev, pickUpDate: "" }));
                    }}
                    className={`w-full bg-white text-[14px] font-medium outline-none cursor-pointer ${errors.pickUpDate ? "text-red-500 font-bold" : ""}`} 
                  />
                  {errors.pickUpDate && <p className="text-red-500 text-[10px] absolute -bottom-4">{errors.pickUpDate}</p>}
                </div>
                <div className="relative space-y-2 border-b border-gray-200 pb-2">
                  <label className="text-gray-500 text-[13px]">Drop Off Date</label>
                  <input 
                    type="date" 
                    value={dropOffDate}
                    onChange={(e) => {
                      setDropOffDate(e.target.value);
                      if (errors.dropOffDate) setErrors(prev => ({ ...prev, dropOffDate: "" }));
                    }}
                    className={`w-full bg-white text-[14px] font-medium outline-none cursor-pointer ${errors.dropOffDate ? "text-red-500 font-bold" : ""}`} 
                  />
                  {errors.dropOffDate && <p className="text-red-500 text-[10px] absolute -bottom-4">{errors.dropOffDate}</p>}
                </div>
              </div>

              <div className="space-y-6">
                <div className="relative space-y-2 border-b border-gray-200 pb-2">
                  <label className="text-gray-500 text-[13px] flex items-center gap-2"><MapPin size={14} /> Pick Up Address</label>
                  <input 
                    type="text" 
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      if (errors.address) setErrors(prev => ({ ...prev, address: "" }));
                    }}
                    placeholder="Enter pickup location"
                    className={`w-full bg-white text-[14px] font-medium outline-none ${errors.address ? "placeholder:text-red-300" : ""}`} 
                  />
                  {errors.address && <p className="text-red-500 text-[10px] absolute -bottom-4">{errors.address}</p>}
                </div>

                <div className="space-y-4">
                  <span className="text-gray-400 text-[10px] uppercase font-bold tracking-[2px]">Guest Details:</span>
                  
                  <div className="relative space-y-2 border-b border-gray-200 pb-2">
                    <label className="text-gray-500 text-[13px] flex items-center gap-2"><User size={14} /> Full Name</label>
                    <input 
                      type="text" 
                      value={guestName}
                      onChange={(e) => {
                        setGuestName(e.target.value);
                        if (errors.guestName) setErrors(prev => ({ ...prev, guestName: "" }));
                      }}
                      placeholder="John Doe"
                      className={`w-full bg-white text-[14px] font-medium outline-none ${errors.guestName ? "placeholder:text-red-300" : ""}`} 
                    />
                    {errors.guestName && <p className="text-red-500 text-[10px] absolute -bottom-4">{errors.guestName}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="relative space-y-2 border-b border-gray-200 pb-2">
                      <label className="text-gray-500 text-[13px] flex items-center gap-2"><Mail size={14} /> Email</label>
                      <input 
                        type="email" 
                        value={guestEmail}
                        onChange={(e) => {
                          setGuestEmail(e.target.value);
                          if (errors.guestEmail) setErrors(prev => ({ ...prev, guestEmail: "" }));
                        }}
                        placeholder="john@example.com"
                        className={`w-full bg-white text-[14px] font-medium outline-none ${errors.guestEmail ? "placeholder:text-red-300" : ""}`} 
                      />
                      {errors.guestEmail && <p className="text-red-500 text-[10px] absolute -bottom-4">{errors.guestEmail}</p>}
                    </div>
                    <div className="relative space-y-2 border-b border-gray-200 pb-2">
                      <label className="text-gray-500 text-[13px] flex items-center gap-2"><Phone size={14} /> Phone</label>
                      <input 
                        type="tel" 
                        value={guestPhone}
                        onChange={(e) => {
                          setGuestPhone(e.target.value);
                          if (errors.guestPhone) setErrors(prev => ({ ...prev, guestPhone: "" }));
                        }}
                        placeholder="+1 (555) 000-0000"
                        className={`w-full bg-white text-[14px] font-medium outline-none ${errors.guestPhone ? "placeholder:text-red-300" : ""}`} 
                      />
                      {errors.guestPhone && <p className="text-red-500 text-[10px] absolute -bottom-4">{errors.guestPhone}</p>}
                    </div>
                  </div>

                  <div className="space-y-2 border-b border-gray-200 pb-2">
                    <label className="text-gray-500 text-[13px] flex items-center gap-2"><MessageSquare size={14} /> Message (Optional)</label>
                    <textarea 
                      value={guestMessage}
                      onChange={(e) => setGuestMessage(e.target.value)}
                      placeholder="Any special requests or details..."
                      className="w-full bg-white text-[14px] font-medium outline-none resize-none h-12" 
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button 
                  onClick={handleBooking}
                  disabled={isSubmitting}
                  className="w-full bg-[#111827] text-white rounded-full py-3 text-[13px] font-bold tracking-[1.5px] uppercase hover:bg-black transition-all shadow-md cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Processing..." : "Rent Now"}
                </button>
              </div>
            </div>

            {/* Accordions */}
            <div className="pt-6 border-t border-gray-100">
              {carFeatures.length > 0 && (
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
                      {carFeatures.map((feature: string, i: number) => {
                        const iconData = featureIcons.find(fi => fi.label.toLowerCase().includes(feature.toLowerCase())) || 
                                       featureIcons.find(fi => feature.toLowerCase().includes(fi.label.toLowerCase())) ||
                                       { icon: <Check size={18} />, label: feature };
                        
                        return (
                          <div key={i} className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-[20px] space-y-2">
                             <div className="text-gray-500">{iconMap[feature] || iconData.icon}</div>
                             <span className="text-gray-500 text-[10px] font-medium uppercase tracking-wider">{feature}</span>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                </div>
              )}

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
                  <div className="py-4 space-y-3">
                    {Object.entries(carSpecs).length > 0 ? (
                      Object.entries(carSpecs).map(([key, value]: [string, any]) => (
                        <div key={key} className="flex justify-between items-center text-[13px] border-b border-gray-50 pb-2 last:border-0">
                          <span className="text-gray-400 font-medium capitalize">{key.replace(/_/g, ' ')}</span>
                          <span className="text-[#1a1a1a] font-semibold">{value}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-400 text-[13px] italic">No detailed specifications available.</div>
                    )}
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
                    {car.policy || "Flexible cancellation up to 48 hours before the trip starts. Full refund policy applies if the car is not as described."}
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
