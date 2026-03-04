import { useState, useEffect, useRef } from "react";
import { imgHeroBg } from "@/data/carsData";
import { motion, useInView } from "motion/react";
import Link from "next/link";
import { useAppSelector } from "@/store/hooks";

function AnimatedCounter({ target }: { target: number }) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    useEffect(() => {
        if (!isInView) return;
        let start = 0;
        const duration = 2000;
        const step = target / (duration / 16);
        const timer = setInterval(() => {
            start += step;
            if (start >= target) {
                setCount(target);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 16);
        return () => clearInterval(timer);
    }, [isInView, target]);

    return <span ref={ref}>{count}+</span>;
}

export function HeroSection() {
    const settings = useAppSelector((state) => state.settings.data);

    return (
        <section id="hero" className="relative w-full min-h-[600px] md:min-h-[800px] overflow-hidden -mt-[72px] pt-[72px]">
            {/* Background Image */}
            <div className="absolute inset-0">
                <img
                    src={imgHeroBg}
                    alt="Hero Background"
                    className="w-full h-full object-cover"
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30" />
            </div>

            {/* Hero Content */}
            <div className="relative z-10 flex flex-col justify-end h-full px-6 md:px-12 lg:px-16 pb-16 md:pb-20">
                <div className="max-w-[1920px]">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="pt-16 md:pt-24 lg:pt-32 pb-8 md:pb-12"
                    >
                        <h1 className="text-white font-normal font-['Inter'] text-[48px] md:text-[72px] lg:text-[96px] leading-[1] mb-4 md:mb-6 whitespace-pre-line">
                            {settings?.hero_title || "Drive Your Dream\nCar Today."}
                        </h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                            className="text-gray-200 text-[14px] md:text-[16px] leading-[24px] max-w-[512px] mb-6 whitespace-pre-line"
                        >
                            {settings?.hero_subtitle || "Discover The Thrill Of Driving Luxury With Our Exclusive Collection Of Well-Maintained Hypercars And Sports Cars Available For Rent."}
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                        >
                            <Link
                                href="#browse"
                                className="inline-block bg-white rounded-full px-8 py-3 text-black text-[12px] tracking-[0.6px] uppercase hover:bg-gray-100 transition-colors"
                            >
                                Explore Fleet
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Animated Stats */}
                    <div className="flex gap-10 md:gap-16 md:pt-20">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.7 }}
                            className="flex flex-col gap-1"
                        >
                            <span className="text-white text-[28px] md:text-[36px] leading-[40px] font-normal font-['Inter']">
                                <AnimatedCounter target={settings?.stats_cars || 200} />
                            </span>
                            <p className="text-gray-300 text-[12px]">
                                Luxury Sports Cars<br />Ready To Rent.
                            </p>
                        </motion.div>
                        <div className="w-px h-12 bg-white/30" />
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.9 }}
                            className="flex flex-col gap-1"
                        >
                            <span className="text-white text-[28px] md:text-[36px] leading-[40px] font-normal font-['Inter']">
                                <AnimatedCounter target={settings?.stats_rentals || 5000} />
                            </span>
                            <p className="text-gray-300 text-[12px] leading-[15px]">
                                Successful Rentals<br />Completed<br />Worldwide.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Right Side Pagination */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1.0 }}
                className="hidden lg:flex flex-col items-center gap-2 absolute bottom-16 right-16 z-10"
            >
                <div className="pb-2">
                    <span className="text-white text-[24px] font-normal font-['Inter']">01</span>
                </div>
                <div className="w-[2px] h-[128px] bg-white/30 relative">
                    <div className="absolute top-0 left-0 right-0 h-1/2 bg-white" />
                </div>
                <div className="pt-2">
                    <span className="text-white text-[24px] font-normal font-['Inter']">02</span>
                </div>
            </motion.div>
        </section>
    );
}
