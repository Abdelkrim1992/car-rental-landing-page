"use client";
import { useRef } from "react";
import { footerLocations, footerSiteMapLinks, footerContactInfo } from "@/data/carsData";
import { motion, useInView } from "motion/react";
import Link from "next/link";
import { useAppSelector } from "@/store/hooks";

export function FooterSection() {
    const footerRef = useRef<HTMLElement>(null);
    const isInView = useInView(footerRef, { once: true, margin: "-50px" });
    const settings = useAppSelector((state) => state.settings.data);

    return (
        <footer id="contact" ref={footerRef} className="w-full bg-white">
            <div className="px-6 md:px-12 lg:px-24 pt-16 md:pt-20 pb-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7 }}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 mb-10 md:mb-12"
                >
                    {footerLocations.map((loc) => (
                        <div key={loc.country} className="flex items-start gap-4">
                            <div className="w-8 h-5 rounded bg-gray-200 overflow-hidden shrink-0">
                                <img src={loc.flag} alt={loc.country} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                            </div>
                            <div>
                                <h4 className="text-black text-[12px] tracking-[0.6px] uppercase mb-1 font-normal font-['Inter']">{loc.country}</h4>
                                <p className="text-gray-500 text-[10px] leading-[13.75px]">{loc.address}</p>
                            </div>
                        </div>
                    ))}
                </motion.div>

                <div className="w-full h-px bg-gray-100 mb-10 md:mb-12" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7, delay: 0.15 }}
                    className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10 md:mb-12"
                >
                    <div>
                        <p className="text-black text-[12px] font-normal font-['Inter']">@2025 {settings?.business_name || "Renture Auto"}</p>
                    </div>

                    <div>
                        <h5 className="text-black text-[10px] tracking-[0.5px] uppercase mb-4 font-normal font-['Inter']">HEADQUARTER</h5>
                        <div className="flex flex-col gap-1">
                            <p className="text-gray-500 text-[10px]">{settings?.address ? settings.address.split(',')[0] : "1450 Fifth Avenue, Suite 2300,"}</p>
                            <p className="text-gray-500 text-[10px]">{settings?.address ? settings.address.split(',')[1]?.trim() || "Downtown Financial District" : "Downtown Financial District,"}</p>
                            <p className="text-gray-500 text-[10px]">{settings?.address || "San Francisco, CA"}</p>
                            <p className="text-gray-500 text-[10px]">United States Of America</p>
                        </div>
                    </div>

                    <div>
                        <h5 className="text-black text-[10px] tracking-[0.5px] uppercase mb-4 font-normal font-['Inter']">SITE MAP</h5>
                        <div className="flex flex-col gap-2">
                            {footerSiteMapLinks.map((link) => (
                                <Link key={link} href="#" className="text-gray-500 text-[10px] hover:text-black transition-colors">{link}</Link>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h5 className="text-black text-[10px] tracking-[0.5px] uppercase mb-4 font-normal font-['Inter']">GET IN TOUCH</h5>
                        <div className="flex flex-col gap-2">
                            <p className="text-gray-500 text-[10px]">{settings?.phone || footerContactInfo.phone}</p>
                            <a href={`mailto:${settings?.email || footerContactInfo.email}`} className="text-gray-500 text-[10px] hover:text-black transition-colors">{settings?.email || footerContactInfo.email}</a>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="overflow-hidden mb-10 md:mb-12"
                >
                    <div className="animate-marquee flex whitespace-nowrap">
                        {[1, 2, 3, 4].map((n) => (
                            <h2 key={n} className="text-[#111827] text-[80px] sm:text-[140px] md:text-[200px] lg:text-[275px] tracking-[-0.05em] uppercase leading-[0.8] font-normal font-['Inter'] select-none px-8" style={{ transform: "scaleY(0.91)" }}>
                                {settings?.business_name || "Renture"}
                            </h2>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="flex flex-col sm:flex-row items-center justify-between gap-4"
                >
                    <div className="flex items-center gap-3">
                        <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-black text-[12px] hover:bg-black hover:text-white hover:border-black transition-colors">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                        </button>
                        <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-black text-[12px] hover:bg-black hover:text-white hover:border-black transition-colors">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988H0V6.3h6.918v11.688zm.023-17.274a3.383 3.383 0 01-3.443 3.286h-.038A3.283 3.283 0 010 2.714a3.384 3.384 0 013.506-3.286h.038c1.86 0 3.383 1.43 3.422 3.286z" /></svg>
                        </button>
                        <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-black text-[12px] hover:bg-black hover:text-white hover:border-black transition-colors">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" /></svg>
                        </button>
                    </div>

                    <div className="flex items-center gap-6">
                        <Link href="#" className="text-gray-500 text-[10px] hover:text-black transition-colors">Terms Of Use</Link>
                        <Link href="#" className="text-gray-500 text-[10px] hover:text-black transition-colors">Privacy Policy</Link>
                        <Link href="#" className="text-gray-500 text-[10px] hover:text-black transition-colors">Cookie Policy</Link>
                    </div>
                </motion.div>
            </div>
        </footer>
    );
}
