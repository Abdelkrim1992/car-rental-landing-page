"use client";
import { useState, useRef } from "react";
import { whyUsItems, imgRacing } from "@/data/carsData";
import svgPaths from "@/lib/svgPaths";
import { motion, AnimatePresence, useInView } from "motion/react";

function ArrowIcon({ active }: { active: boolean }) {
    return (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d={svgPaths.p2c97f480} stroke={active ? "black" : "#D1D5DB"} strokeWidth={active ? "2" : "1.33333"} opacity={active ? 1 : 0.5} />
            <path d={active ? svgPaths.p3dc74780 : svgPaths.p283641c0} stroke={active ? "black" : "#D1D5DB"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export function WhyUsSection() {
    const [activeIndex, setActiveIndex] = useState(0);
    const sectionRef = useRef<HTMLElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

    return (
        <section id="why-us" ref={sectionRef} className="w-full bg-[#f9f9f9] px-6 md:px-12 lg:px-24 py-12">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7 }}
                className="flex flex-col md:flex-row items-start justify-between gap-4 mb-12 md:mb-16"
            >
                <h2 className="text-[#111827] text-[24px] md:text-[30px] leading-[36px] font-bold font-['Inter'] max-w-[512px]">
                    Setting The Standard For Luxury<br />Car Rentals Every Day
                </h2>
                <span className="text-gray-500 text-[10px] tracking-[0.25px] uppercase">02/Why Us</span>
            </motion.div>

            <div className="flex flex-col w-full">
                {whyUsItems.map((item, i) => (
                    <motion.div
                        key={item.num}
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                    >
                        <AnimatePresence mode="wait">
                            {i === activeIndex ? (
                                <motion.div
                                    key={`active-${i}`}
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.4, ease: "easeInOut" }}
                                    className="flex flex-col lg:flex-row items-start py-8 md:py-10 border-b border-gray-200 cursor-pointer overflow-hidden"
                                    onClick={() => setActiveIndex(i)}
                                >
                                    <div className="flex flex-col lg:flex-row items-start lg:gap-0 w-full">
                                        <div className="flex flex-col justify-between lg:w-[200px] shrink-0 mb-4 lg:mb-0">
                                            <div className="pb-8 md:pb-12">
                                                <span className="text-black text-[20px] leading-[28px] font-bold font-['Inter']">{item.num}</span>
                                            </div>
                                            <motion.p
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.4, delay: 0.2 }}
                                                className="text-[#4b5563] text-[12px] leading-[19.5px] max-w-[200px]"
                                            >
                                                {item.description}
                                            </motion.p>
                                        </div>
                                        <div className="flex-1 w-full px-4">
                                            <div className="flex items-start justify-between mb-6">
                                                <span className="text-black text-[24px] md:text-[30px] leading-[36px] font-bold font-['Inter']">{item.title}</span>
                                                <div className="shrink-0 ml-4">
                                                    <ArrowIcon active={true} />
                                                </div>
                                            </div>
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.98 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ duration: 0.5, delay: 0.1 }}
                                                className="bg-gray-200 rounded-2xl overflow-hidden h-[200px] md:h-[320px] w-full"
                                            >
                                                <img loading="lazy" decoding="async" src={imgRacing} alt="Racing cars" className="w-full h-full object-cover" />
                                            </motion.div>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key={`inactive-${i}`}
                                    className="flex items-center py-6 md:py-8 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
                                    onClick={() => setActiveIndex(i)}
                                    whileHover={{ x: 5 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <div className="w-[80px] md:w-[200px] shrink-0">
                                        <span className="text-gray-400 text-[20px] leading-[28px] font-bold font-['Inter']">{item.num}</span>
                                    </div>
                                    <div className="flex-1">
                                        <span className="text-gray-300 text-[20px] md:text-[30px] leading-[36px] font-bold font-['Inter']">{item.title}</span>
                                    </div>
                                    <div className="shrink-0 ml-4">
                                        <ArrowIcon active={false} />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
