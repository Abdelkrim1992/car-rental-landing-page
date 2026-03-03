"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
    { label: "HOME", href: "/" },
    { label: "ABOUT", href: "/#why-us" },
    { label: "OUR FLEET", href: "/cars" },
    { label: "MY BOOKINGS", href: "/bookings" },
    { label: "CONTACT", href: "/#contact" },
];

interface NavbarProps {
    variant?: "transparent" | "solid";
}

export function Navbar({ variant = "solid" }: NavbarProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    const isTransparent = variant === "transparent";
    const textColor = isTransparent ? "text-white" : "text-[#111827]";
    const textMuted = isTransparent ? "text-white/70" : "text-gray-500";
    const mobileBg = isTransparent ? "bg-black/90" : "bg-white";

    const isActive = (href: string) => {
        if (href === "/") return pathname === "/";
        return pathname.startsWith(href.replace("/#", "/"));
    };

    return (
        <nav className={`${isTransparent ? "absolute top-0 left-0 right-0 z-50" : "sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100"}`}>
            <div className="flex items-center justify-between px-6 md:px-12 lg:px-16 py-5">
                {/* Left Links */}
                <div className="hidden md:flex items-center gap-8 lg:gap-10">
                    {navLinks.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className={`text-[11px] tracking-[1.5px] transition-colors ${isActive(link.href)
                                ? `${textColor} font-medium`
                                : `${textMuted} hover:${textColor}`
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Center Logo */}
                <Link href="/" className={`absolute left-1/2 -translate-x-1/2 ${textColor} text-[26px] tracking-[0.75px] font-normal font-['Inter']`}>
                    Renture
                </Link>

                {/* Right — Contact Us CTA */}
                <div className="flex items-center gap-4 ml-auto">
                    <Link
                        href="/#contact"
                        className={`hidden md:block backdrop-blur-[5px] ${isTransparent ? "bg-white/15 border-white/25 text-white hover:bg-white/25" : "bg-black text-white hover:bg-gray-800 border-transparent"} border rounded-full px-6 py-2 text-[11px] tracking-[0.5px] uppercase transition-colors`}
                    >
                        Contact Us
                    </Link>
                    <button
                        className={`md:hidden ${textColor}`}
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`md:hidden ${mobileBg} backdrop-blur-xl px-6 py-4 flex flex-col gap-3 overflow-hidden`}
                    >
                        {navLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`text-[13px] tracking-[1.2px] py-2 ${isActive(link.href) ? textColor : textMuted}`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
