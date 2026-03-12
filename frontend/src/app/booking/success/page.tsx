"use client";

import { motion } from "motion/react";
import { Check, ArrowRight, Home, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { FooterSection } from "@/components/FooterSection";

export default function BookingSuccessPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white font-['Inter',sans-serif]">
      <Navbar />
      
      <main className="max-w-[1280px] mx-auto pt-50 md:pt-50 lg:pt-50 px-6 py-32 flex flex-col items-center text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20 
          }}
          className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-8 border border-green-100"
        >
          <Check size={48} className="text-green-500" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4 max-w-2xl"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-[#111827] tracking-tight">
            Booking Request Received!
          </h1>
          <p className="text-gray-500 text-lg md:text-xl leading-relaxed">
            Thank you for choosing Atlas. We've received your inquiry and our team is already reviewing the details.
          </p>
          <p className="text-gray-400 text-base">
            We will contact you within the next 2 hours to confirm availability and finalize your reservation.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12 w-full max-w-md"
        >
          <button 
            onClick={() => router.push("/")}
            className="bg-[#111827] cursor-pointer text-white rounded-full px-10 py-3 text-[13px] font-medium tracking-wide hover:bg-[#1f2937] transition-all duration-200 shadow-md hover:shadow-lg w-full sm:w-auto"
          >
            Back to Home
          </button>
          
          <button 
            onClick={() => router.push("/cars")}
            className="bg-white cursor-pointer text-black rounded-full px-10 py-3 text-[13px] font-medium tracking-wide hover:bg-gray-40 transition-all duration-200 shadow-md hover:shadow-lg w-full sm:w-auto"
          >
            Browse More Cars
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-16 p-6 bg-gray-50 rounded-[32px] border border-gray-100 flex items-center gap-4 max-w-sm"
        >
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
            <Calendar size={20} className="text-primary" />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-[#111827]">Need to make changes?</p>
            <p className="text-xs text-gray-500">Contact us at support@atlas.com</p>
          </div>
        </motion.div>
      </main>

      <FooterSection />
    </div>
  );
}
