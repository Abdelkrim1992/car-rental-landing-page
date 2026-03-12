"use client";
import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { Send, Phone, Mail, MapPin } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { sendMessage } from "@/store/slices/messagesSlice";

export function ContactSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
    const [submitted, setSubmitted] = useState(false);
    const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
    const settings = useAppSelector(state => state.settings.data);

    const dispatch = useAppDispatch();
    const [formError, setFormError] = useState<string | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        
        const newErrors: Record<string, string> = {};
        if (!form.name) newErrors.name = "Name is required";
        if (!form.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(form.email)) {
            newErrors.email = "Email is invalid";
        }
        if (!form.message) newErrors.message = "Message is required";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        try {
            await dispatch(sendMessage(form)).unwrap();
            setSubmitted(true);
            setTimeout(() => setSubmitted(false), 4000);
            setForm({ name: "", email: "", phone: "", message: "" });
        } catch (err) {
            setFormError(typeof err === 'string' ? err : "Failed to send message. Please try again.");
        }
    };

    return (
        <section id="contact" ref={sectionRef} className="w-full bg-[#0f0f0f] px-6 md:px-12 lg:px-24 py-16 md:py-24">
            <div className="max-w-[1280px] mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7 }}
                    className="flex flex-col lg:flex-row gap-16 lg:gap-24"
                >
                    {/* Left — Info */}
                    <div className="flex-1">
                        <span className="text-gray-500 text-[10px] tracking-[2px] uppercase block mb-4">08 / Get In Touch</span>
                        <h2 className="text-white text-[32px] md:text-[44px] leading-[1.1] font-normal font-['Inter'] mb-6">
                            Let&apos;s Start Your<br />Luxury Experience
                        </h2>
                        <p className="text-gray-400 text-[14px] leading-[24px] max-w-[400px] mb-10">
                            Have a question about our fleet, pricing, or availability?
                            Get in touch and our team will respond within 24 hours.
                        </p>

                        <div className="flex flex-col gap-5">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                    <Phone size={16} className="text-white/60" />
                                </div>
                                <div>
                                    <p className="text-white text-[13px]">{settings?.phone || "+1 (555) 123-4567"}</p>
                                    <p className="text-gray-500 text-[10px] uppercase tracking-[1px]">{settings?.working_hours || "Mon — Fri, 9am — 6pm"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                    <Mail size={16} className="text-white/60" />
                                </div>
                                <div>
                                    <p className="text-white text-[13px]">{settings?.email || "hello@renture.com"}</p>
                                    <p className="text-gray-500 text-[10px] uppercase tracking-[1px]">Response in 24h</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                    <MapPin size={16} className="text-white/60" />
                                </div>
                                <div>
                                    <p className="text-white text-[13px]">{settings?.address || "San Francisco, CA"}</p>
                                    <p className="text-gray-500 text-[10px] uppercase tracking-[1px]">Headquarters</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right — Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="flex-1"
                    >
                        {submitted ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center h-full min-h-[400px]"
                            >
                                <div className="w-14 h-14 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                                    <Send size={22} className="text-green-400" />
                                </div>
                                <h3 className="text-white text-[20px] font-medium mb-2">Message Sent!</h3>
                                <p className="text-gray-400 text-[13px]">We&apos;ll get back to you soon.</p>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                                {formError && (
                                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                                        <p className="text-red-400 text-[13px]">{formError}</p>
                                    </div>
                                )}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="relative">
                                        <label className="text-gray-500 text-[10px] tracking-[1px] uppercase block mb-2">Name</label>
                                        <input
                                            type="text"
                                            value={form.name}
                                            onChange={(e) => {
                                                setForm({ ...form, name: e.target.value });
                                                if (errors.name) setErrors(prev => ({ ...prev, name: "" }));
                                            }}
                                            placeholder="John Doe"
                                            className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white text-[13px] placeholder-gray-600 outline-none transition-colors ${errors.name ? "border-red-500/50" : "border-white/10 focus:border-white/30"}`}
                                        />
                                        {errors.name && <p className="text-red-500 text-[10px] absolute -bottom-4 left-1">{errors.name}</p>}
                                    </div>
                                    <div className="relative">
                                        <label className="text-gray-500 text-[10px] tracking-[1px] uppercase block mb-2">Email</label>
                                        <input
                                            type="email"
                                            value={form.email}
                                            onChange={(e) => {
                                                setForm({ ...form, email: e.target.value });
                                                if (errors.email) setErrors(prev => ({ ...prev, email: "" }));
                                            }}
                                            placeholder="you@example.com"
                                            className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white text-[13px] placeholder-gray-600 outline-none transition-colors ${errors.email ? "border-red-500/50" : "border-white/10 focus:border-white/30"}`}
                                        />
                                        {errors.email && <p className="text-red-500 text-[10px] absolute -bottom-4 left-1">{errors.email}</p>}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-gray-500 text-[10px] tracking-[1px] uppercase block mb-2">Phone</label>
                                    <input
                                        type="tel"
                                        value={form.phone}
                                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                        placeholder="+1 (555) 000-0000"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-[13px] placeholder-gray-600 outline-none focus:border-white/30 transition-colors"
                                    />
                                </div>
                                <div className="relative">
                                    <label className="text-gray-500 text-[10px] tracking-[1px] uppercase block mb-2">Message</label>
                                    <textarea
                                        value={form.message}
                                        onChange={(e) => {
                                            setForm({ ...form, message: e.target.value });
                                            if (errors.message) setErrors(prev => ({ ...prev, message: "" }));
                                        }}
                                        placeholder="Tell us about your rental needs..."
                                        rows={4}
                                        className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white text-[13px] placeholder-gray-600 outline-none transition-colors resize-none ${errors.message ? "border-red-500/50" : "border-white/10 focus:border-white/30"}`}
                                    />
                                    {errors.message && <p className="text-red-500 text-[10px] absolute -bottom-4 left-1">{errors.message}</p>}
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.00 }}
                                    whileTap={{ scale: 1.00 }}
                                    type="submit"
                                    className="bg-white text-black rounded-full py-3.5 text-[13px] font-medium tracking-wide cursor-pointer hover:bg-white transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 w-full"
                                >
                                    <Send size={15} />
                                    Send Message
                                </motion.button>
                            </form>
                        )}
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
