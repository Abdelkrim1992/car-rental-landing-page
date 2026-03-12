"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { CalendarDays, MapPin, Check, User, Mail, Phone, MessageSquare } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { FooterSection } from "@/components/FooterSection";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setBookingForm, createBooking, clearBookingError } from "@/store/slices/bookingSlice";
import { browseCars } from "@/data/carsData";

function BookingContent() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { form, loading, error } = useAppSelector((s) => s.booking);
    const [confirmed, setConfirmed] = useState(false);

    const carId = searchParams.get("carId") || form.carId;
    const [car, setCar] = useState<any>(null);
    const [carLoading, setCarLoading] = useState(true);

    useEffect(() => {
        const fetchCar = async () => {
            if (!carId) {
                setCarLoading(false);
                return;
            }

            const staticCar = browseCars.find((c) => c.id === carId);
            if (staticCar) {
                setCar(staticCar);
                setCarLoading(false);
                return;
            }

            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://atlasrentalcar-backend.netlify.app/api'}/cars/${carId}`);
                if (!res.ok) throw new Error("Car not found");
                const data = await res.json();
                setCar(data);
            } catch (err) {
                console.error(err);
                setCar(null);
            } finally {
                setCarLoading(false);
            }
        };

        fetchCar();
    }, [carId]);

    useEffect(() => {
        if (carId && carId !== form.carId) {
            dispatch(setBookingForm({ carId }));
        }
    }, [carId, form.carId, dispatch]);

    // Pre-fill location from car data
    useEffect(() => {
        if (car && !form.pickupLocation) {
            dispatch(setBookingForm({ pickupLocation: car.location }));
        }
    }, [car, form.pickupLocation, dispatch]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!car) return;

        const pickup = new Date(form.pickupDate);
        const ret = new Date(form.returnDate);
        const days = Math.max(1, Math.ceil((ret.getTime() - pickup.getTime()) / 86400000));
        const priceNum = parseFloat(car.price.replace(/[^0-9.]/g, ""));
        const total = days * priceNum;

        try {
            await dispatch(createBooking({
                car_id: car.id,
                car_name: car.name,
                pickup_date: form.pickupDate,
                return_date: form.returnDate,
                pickup_location: form.pickupLocation,
                total_price: total,
                guest_name: form.guestName,
                guest_email: form.guestEmail,
                guest_phone: form.guestPhone,
                guest_message: form.guestMessage,
            })).unwrap();
            setConfirmed(true);
        } catch {
            // error handled by redux
        }
    };

    if (confirmed) {
        return (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-24 px-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-5">
                    <Check size={30} className="text-green-500" />
                </div>
                <h2 className="text-[24px] font-bold text-[#111827] mb-2">Booking Request Sent!</h2>
                <p className="text-gray-500 text-[14px] mb-2 text-center max-w-[400px]">
                    Thank you, <strong>{form.guestName}</strong>! We&apos;ve received your booking request for the <strong>{car?.name}</strong>.
                </p>
                <p className="text-gray-400 text-[13px] mb-8">We&apos;ll contact you at {form.guestEmail} to confirm.</p>
                <div className="flex gap-4">
                    <button onClick={() => router.push("/")} className="bg-[#111827] text-white rounded-full px-8 py-3.5 text-[13px] font-medium tracking-wide hover:bg-[#1f2937] active:scale-[0.98] transition-all duration-200 shadow-md">Back Home</button>
                    <button onClick={() => router.push("/cars")} className="border border-gray-200 text-[#111827] rounded-full px-8 py-3.5 text-[13px] font-medium tracking-wide hover:border-[#111827] hover:bg-gray-50 active:scale-[0.98] transition-all duration-200">Browse More</button>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="px-6 md:px-12 lg:px-24 pt-24 md:pt-35 pb-10">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-[28px] md:text-[36px] font-bold text-[#111827] mb-2">
                Book Your Ride
            </motion.h1>
            <p className="text-gray-400 text-[14px] mb-8">Fill in your details and we&apos;ll get back to you within 24 hours.</p>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-6">
                    <p className="text-red-600 text-[13px]">{error}</p>
                    <button onClick={() => dispatch(clearBookingError())} className="text-red-400 text-[11px] underline">Dismiss</button>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <form onSubmit={handleSubmit} className="lg:col-span-2">
                    <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
                        {/* Guest Contact Info */}
                        <h3 className="text-[16px] font-semibold text-[#111827] mb-6">Your Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                            <div>
                                <label className="text-gray-500 text-[10px] tracking-[1px] uppercase mb-2 flex items-center gap-1"><User size={12} /> Full Name</label>
                                <input type="text" value={form.guestName} onChange={(e) => dispatch(setBookingForm({ guestName: e.target.value }))} required
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-black/30 transition-colors mt-1" placeholder="John Doe" />
                            </div>
                            <div>
                                <label className="text-gray-500 text-[10px] tracking-[1px] uppercase mb-2 flex items-center gap-1"><Mail size={12} /> Email</label>
                                <input type="email" value={form.guestEmail} onChange={(e) => dispatch(setBookingForm({ guestEmail: e.target.value }))} required
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-black/30 transition-colors mt-1" placeholder="you@example.com" />
                            </div>
                            <div>
                                <label className="text-gray-500 text-[10px] tracking-[1px] uppercase mb-2 flex items-center gap-1"><Phone size={12} /> Phone</label>
                                <input type="tel" value={form.guestPhone} onChange={(e) => dispatch(setBookingForm({ guestPhone: e.target.value }))} required
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-black/30 transition-colors mt-1" placeholder="+1 (555) 000-0000" />
                            </div>
                            <div>
                                <label className="text-gray-500 text-[10px] tracking-[1px] uppercase mb-2 flex items-center gap-1"><MapPin size={12} /> Pickup Location</label>
                                <input type="text" value={form.pickupLocation} onChange={(e) => dispatch(setBookingForm({ pickupLocation: e.target.value }))} required
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-black/30 transition-colors mt-1" placeholder="New York" />
                            </div>
                        </div>

                        {/* Booking Details */}
                        <h3 className="text-[16px] font-semibold text-[#111827] mb-6 pt-4 border-t border-gray-100">Rental Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                            <div>
                                <label className="text-gray-500 text-[10px] tracking-[1px] uppercase mb-2 flex items-center gap-1"><CalendarDays size={12} /> Pickup Date</label>
                                <input type="date" value={form.pickupDate} onChange={(e) => dispatch(setBookingForm({ pickupDate: e.target.value }))} required
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-black/30 mt-1" />
                            </div>
                            <div>
                                <label className="text-gray-500 text-[10px] tracking-[1px] uppercase mb-2 flex items-center gap-1"><CalendarDays size={12} /> Return Date</label>
                                <input type="date" value={form.returnDate} onChange={(e) => dispatch(setBookingForm({ returnDate: e.target.value }))} required min={form.pickupDate}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-black/30 mt-1" />
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="text-gray-500 text-[10px] tracking-[1px] uppercase mb-2 flex items-center gap-1"><MessageSquare size={12} /> Message (Optional)</label>
                            <textarea value={form.guestMessage} onChange={(e) => dispatch(setBookingForm({ guestMessage: e.target.value }))} rows={3}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-black/30 resize-none transition-colors mt-1" placeholder="Any special requests..." />
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading || !car}
                            className="w-full bg-[#111827] text-white rounded-full py-4 text-[13px] font-medium tracking-wide hover:bg-[#1f2937] active:scale-[0.98] transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50"
                        >
                            {loading ? "Processing..." : "Submit Booking Request"}
                        </button>
                    </div>
                </form>

                {/* Car Summary */}
                <div>
                    {carLoading ? (
                        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex items-center justify-center min-h-[300px]">
                            <p className="text-gray-400 text-[14px]">Loading car details...</p>
                        </div>
                    ) : car ? (
                        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm sticky top-24">
                            <img loading="lazy" decoding="async" src={car.img} alt={car.name} className="w-full h-[180px] object-cover rounded-xl mb-4" />
                            <h3 className="text-[18px] font-bold text-[#111827]">{car.name}</h3>
                            <p className="text-gray-400 text-[12px] mt-1">{car.type} • {car.brand}</p>
                            <div className="border-t border-gray-100 mt-4 pt-4">
                                <div className="flex justify-between text-[13px]">
                                    <span className="text-gray-500">Daily Rate</span>
                                    <span className="text-[#111827] font-semibold">{car.price}</span>
                                </div>
                                {form.pickupDate && form.returnDate && (
                                    <>
                                        <div className="flex justify-between text-[13px] mt-2">
                                            <span className="text-gray-500">Duration</span>
                                            <span className="text-[#111827] font-semibold">
                                                {Math.max(1, Math.ceil((new Date(form.returnDate).getTime() - new Date(form.pickupDate).getTime()) / 86400000))} days
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-[14px] mt-3 pt-3 border-t border-gray-100">
                                            <span className="text-gray-700 font-medium">Total</span>
                                            <span className="text-[#111827] font-bold">
                                                ${(Math.max(1, Math.ceil((new Date(form.returnDate).getTime() - new Date(form.pickupDate).getTime()) / 86400000)) * parseFloat(car.price.replace(/[^0-9.]/g, ""))).toFixed(2)}
                                            </span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center">
                            <p className="text-gray-400 text-[14px] mb-3">No car selected</p>
                            <button onClick={() => router.push("/cars")} className="bg-[#111827] text-white rounded-full px-6 py-2.5 text-[12px] font-medium tracking-wide hover:bg-[#1f2937] active:scale-[0.97] transition-all duration-200 shadow-sm">Browse Fleet</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function BookingPage() {
    return (
        <div className="min-h-screen bg-white font-['Inter',sans-serif]">
            <Navbar />
            <Suspense fallback={<div className="flex items-center justify-center py-24"><p className="text-gray-400">Loading...</p></div>}>
                <BookingContent />
            </Suspense>
            <FooterSection />
        </div>
    );
}
