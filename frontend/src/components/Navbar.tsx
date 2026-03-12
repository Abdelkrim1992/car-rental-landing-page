"use client";
import { useState, useEffect } from "react";
import { Menu, X, Car } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/store/hooks";

const navLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/#why-us" },
    { label: "Our Fleet", href: "/cars" },
    { label: "Steps", href: "/#steps" },
    { label: "Contact", href: "/#contact" },
];

interface NavbarProps {
    variant?: "transparent" | "solid";
}

export function Navbar({ variant = "solid" }: NavbarProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();
    const settings = useAppSelector((state) => state.settings.data);

    // Track scroll for glassmorphism intensity
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const isActive = (href: string) => {
        if (href === "/") return pathname === "/";
        return pathname.startsWith(href.replace("/#", "/"));
    };

    return (
        <nav
            className={`fixed top-4 md:top-6 left-1/2 -translate-x-1/2 w-[94%] max-w-5xl z-50 rounded-full px-4 md:px-6 py-3 transition-all duration-500 ${
                scrolled
                    ? "bg-white/100 backdrop-blur-xl border border-gray-60 shadow-lg shadow-black/[0.04]"
                    : "bg-white/100 backdrop-blur-md border border-gray-50 shadow-sm"
            }`}
        >
            <div className="flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2.5 group">
                    <div className="w-8 h-8 bg-[#111827] rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                        <Car className="w-[18px] h-[18px] text-white" />
                    </div>
                    <span className="text-[18px] md:text-[20px] font-bold text-[#111827] tracking-tight font-['Inter']">
                        {settings?.business_name || "Renture"}
                    </span>
                </Link>

                {/* Desktop Nav Links */}
                <div className="hidden md:flex items-center gap-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className={`relative text-[13px] font-medium px-4 py-2 rounded-full transition-all duration-200 ${
                                isActive(link.href)
                                    ? "text-[#111827] bg-gray-200"
                                    : "text-black hover:text-[#111827]"
                            }`}
                        >
                            {link.label}
                            {isActive(link.href) && (
                                <motion.span
                                    layoutId="nav-dot"
                                    className="absolute rounded-full"
                                    // transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                />
                            )}
                        </Link>
                    ))}
                </div>

                {/* Right — CTA + Mobile Toggle */}
                <div className="flex items-center gap-3">
                    <Link
                        href="/#contact"
                        className="hidden md:inline-flex items-center bg-[#111827] text-white rounded-full px-5 py-2 text-[12px] font-medium tracking-wide hover:bg-[#1f2937] active:scale-[0.97] transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                        Contact Us
                    </Link>

                    <button
                        className="md:hidden flex items-center justify-center w-9 h-9 rounded-full text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            {mobileMenuOpen ? (
                                <motion.span
                                    key="close"
                                    initial={{ rotate: -90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: 90, opacity: 0 }}
                                    transition={{ duration: 0.15 }}
                                >
                                    <X className="w-5 h-5" />
                                </motion.span>
                            ) : (
                                <motion.span
                                    key="menu"
                                    initial={{ rotate: 90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: -90, opacity: 0 }}
                                    transition={{ duration: 0.15 }}
                                >
                                    <Menu className="w-5 h-5" />
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.98 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute top-full left-0 w-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 p-3 flex flex-col gap-1 md:hidden"
                    >
                        {navLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`text-[14px] font-medium p-3 rounded-xl transition-colors ${
                                    isActive(link.href)
                                        ? "text-[#111827] bg-gray-50"
                                        : "text-gray-500 hover:text-[#111827] hover:bg-gray-50"
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="pt-2 mt-1 border-t border-gray-100">
                            <Link
                                href="/#contact"
                                onClick={() => setMobileMenuOpen(false)}
                                className="block w-full bg-[#111827] text-white text-center rounded-xl px-6 py-3 text-[13px] font-medium tracking-wide hover:bg-[#1f2937] transition-colors"
                            >
                                Contact Us
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
