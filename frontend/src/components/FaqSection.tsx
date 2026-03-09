"use client";
import { useState, useRef } from "react";
import { faqItems, imgFaqImage } from "@/data/carsData";
import svgPaths from "@/lib/svgPaths";
import { motion, AnimatePresence, useInView } from "motion/react";

export function FaqSection() {
    const [activeIndex, setActiveIndex] = useState(2);
    const sectionRef = useRef<HTMLElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

    return (
        <section id="faq" ref={sectionRef} className="w-full bg-[#f9f9f9] px-6 md:px-12 lg:px-24 py-12">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7 }}
                className="flex flex-col-reverse md:flex-row items-start justify-between gap-4 mb-10 md:mb-12"
            >
                <span className="text-gray-500 text-[12px] tracking-[1.2px] uppercase">07.FAQs</span>
                <h2 className="text-[#111827] text-[32px] md:text-[40px] lg:text-[48px] leading-[1] font-normal font-['Inter']">
                    Your Go-To Guide For<br />Hassle-Free Car Rentals
                </h2>
            </motion.div>

            <div className="w-full h-px bg-gray-200 mb-10 md:mb-12" />

            <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex flex-col gap-4 flex-1">
                    {faqItems.map((faq, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.5, delay: i * 0.08 }}
                        >
                            <motion.div
                                whileHover={{ scale: 1.01 }}
                                className={`bg-white rounded-xl p-5 flex items-center justify-between cursor-pointer transition-shadow ${i === activeIndex ? "shadow-md" : "hover:shadow-sm"
                                    }`}
                                onClick={() => setActiveIndex(i)}
                            >
                                <span className={`text-[14px] md:text-[16px] leading-[24px] font-normal font-['Inter'] ${i === activeIndex ? "text-[#111827]" : "text-gray-500"
                                    }`}>
                                    {faq.q}
                                </span>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0 ml-4">
                                    <path d={svgPaths.pace200} stroke={i === activeIndex ? "#111827" : "#D1D5DB"} strokeWidth="1.5" />
                                    {i === activeIndex ? (
                                        <path d={svgPaths.p26749ae8} stroke="#111827" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                                    ) : (
                                        <path d="M10 8L14 12L10 16" stroke="#D1D5DB" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                                    )}
                                </svg>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>

                <div className="flex flex-col gap-6 flex-1">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeIndex}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white rounded-xl shadow-sm p-6 md:p-8 min-h-[200px]"
                        >
                            <h3 className="text-[#1f2937] text-[18px] leading-[28px] font-normal font-['Inter'] pb-4">
                                {faqItems[activeIndex].q}
                            </h3>
                            <p className="text-[#4b5563] text-[14px] leading-[22.75px]">
                                {faqItems[activeIndex].a}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                    {/* <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.7, delay: 0.3 }}
                        className="rounded-xl overflow-hidden h-[150px]"
                    >
                        <img loading="lazy" decoding="async" src={imgFaqImage} alt="FAQ illustration" className="w-full h-full object-cover" />
                    </motion.div> */}
                </div>
            </div>
        </section>
    );
}
