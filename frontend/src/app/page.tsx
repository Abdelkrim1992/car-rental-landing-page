"use client";
import { useEffect } from "react";
import { motion } from "motion/react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { BrowseCarsSection } from "@/components/BrowseCarsSection";
import { WhyUsSection } from "@/components/WhyUsSection";
import { RentalStepsSection } from "@/components/RentalStepsSection";
import { FeaturedRideSection } from "@/components/FeaturedRideSection";
import { ReviewsSection } from "@/components/ReviewsSection";
import { FaqSection } from "@/components/FaqSection";
import { ContactSection } from "@/components/ContactSection";
import { FooterSection } from "@/components/FooterSection";
import { useAppDispatch } from "@/store/hooks";
import { fetchSettings } from "@/store/slices/settingsSlice";

export default function Home() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full min-h-full bg-white font-['Inter',sans-serif] overflow-x-hidden"
    >
      <Navbar variant="transparent" />
      <HeroSection />
      <BrowseCarsSection />
      <WhyUsSection />
      <RentalStepsSection />
      <FeaturedRideSection />
      <ReviewsSection />
      <FaqSection />
      <ContactSection />
      <FooterSection />
    </motion.div>
  );
}
