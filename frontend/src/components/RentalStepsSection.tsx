"use client";
import { useState, useRef } from "react";
import { rentalSteps } from "@/data/carsData";
import { motion, useInView, AnimatePresence } from "motion/react";

export function RentalStepsSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <section id="steps" ref={sectionRef} className="w-full max-w-[1280px] mx-auto px-6 md:px-12 lg:px-0 py-12 md:py-16">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7 }}
                className="flex flex-col md:flex-row items-start justify-between gap-6 mb-10 md:mb-12"
            >
                <h2 className="text-[#111827] text-[32px] md:text-[40px] lg:text-[40px] leading-[1.2] font-bold font-['Inter']">
                    Effortless Rentals:<br />Your Dream Car In Just 3 Steps
                </h2>
                <div className="flex flex-col items-end gap-2 max-w-[320px]">
                    <span className="text-gray-400 text-[12px] tracking-[0.3px] uppercase text-right">04 Rental Process</span>
                    <p className="text-gray-500 text-[11px] leading-[17.88px] text-right">
                        Our streamlined rental process makes it easy to get behind
                        the wheel of your dream car.
                    </p>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {rentalSteps.map((step, i) => (
                    <motion.div
                        key={step.num}
                        initial={{ opacity: 0, y: 40 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                    >
                        <motion.div
                            whileHover={{ y: 0, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                            transition={{ type: "spring", stiffness: 300 }}
                            onHoverStart={() => setActiveIndex(i)}
                            onHoverEnd={() => setActiveIndex(0)}
                            onClick={() => setActiveIndex(i)}
                            className={`relative rounded-2xl min-h-[320px] md:min-h-[360px] overflow-hidden cursor-pointer ${activeIndex === i ? "bg-[#18181b]" : "bg-[#f9fafb]"
                                }`}
                            style={{ transition: "background-color 0.4s ease" }}
                        >
                            <AnimatePresence>
                                {activeIndex === i && (
                                    <motion.div
                                        className="absolute inset-0"
                                        initial={{ opacity: 0, scale: 1.1 }}
                                        animate={{ opacity: 0.6, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.05 }}
                                        transition={{ duration: 0.5, ease: "easeOut" }}
                                    >
                                        <img
                                            src={step.img}
                                            alt=""
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                            decoding="async"
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="relative flex flex-col justify-between h-full p-6 md:p-8 min-h-[320px] md:min-h-[360px]">
                                <div className="flex items-start justify-between">
                                    <motion.span
                                        className="text-[14px] tracking-[0.35px]"
                                        animate={{
                                            color: activeIndex === i ? "#ffffff" : "#111827",
                                        }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {step.title}
                                    </motion.span>
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] transition-colors duration-300 ${activeIndex === i
                                            ? "bg-white text-black"
                                            : "bg-black text-white"
                                            }`}
                                    >
                                        {step.num}
                                    </div>
                                </div>
                                <motion.p
                                    className="text-[11px] leading-[17.88px] max-w-[340px]"
                                    animate={{
                                        color: activeIndex === i ? "#d1d5db" : "#6b7280",
                                    }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {step.description}
                                </motion.p>
                            </div>
                        </motion.div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
