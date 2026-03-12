"use client";
import { useParams } from "next/navigation";
import { browseCars } from "@/data/carsData";
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fuel, MapPin, Gauge, CalendarDays } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { FooterSection } from "@/components/FooterSection";
import { CarDetailsSection } from "@/components/CarDetailsSection";
import { ReviewsSection } from "@/components/ReviewsSection";
import { FeaturedCarsSection } from "@/components/FeaturedCarsSection";
import { useAppDispatch } from "@/store/hooks";
import { setBookingForm } from "@/store/slices/bookingSlice";
import { useEffect, useState } from "react";
import { initAuth } from "@/store/slices/authSlice";

export default function CarDetailPage() {
    const params = useParams();
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [car, setCar] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { dispatch(initAuth()); }, [dispatch]);

    useEffect(() => {
        const fetchCar = async () => {
            const staticCar = browseCars.find((c) => c.id === params.id);
            if (staticCar) {
                setCar(staticCar);
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://atlasrentalcar-backend.netlify.app/api'}/cars/${params.id}`);
                if (!res.ok) throw new Error("Car not found");
                const data = await res.json();
                setCar(data);
            } catch (err) {
                console.error(err);
                setCar(null);
            } finally {
                setLoading(false);
            }
        };

        fetchCar();
    }, [params.id]);

    const handleBookNow = () => {
        if (car) {
            dispatch(setBookingForm({ carId: car.id, pickupLocation: car.location }));
            router.push(`/booking?carId=${car.id}`);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <Navbar variant="transparent" />
                <div className="flex items-center justify-center py-32">
                    <p className="text-gray-500">Loading...</p>
                </div>
            </div>
        );
    }

    if (!car) {
        return (
            <div className="min-h-screen bg-white">
                <Navbar />
                <div className="flex items-center justify-center py-32">
                    <div className="text-center">
                        <h1 className="text-[48px] font-bold text-[#111827] mb-4">404</h1>
                        <p className="text-gray-500 mb-6">Car not found</p>
                        <Link href="/cars" className="bg-[#111827] text-white rounded-full px-8 py-3.5 text-[13px] font-medium tracking-wide hover:bg-[#1f2937] active:scale-[0.97] transition-all duration-200 shadow-md">Browse Fleet</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white font-['Inter',sans-serif]">
            <Navbar />
            
            <CarDetailsSection car={car} />
            <ReviewsSection />
            <FeaturedCarsSection />

            <FooterSection />
        </div>
    );
}
