"use client";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { Eye, EyeOff } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginUser, clearAuthError, initAuth } from "@/store/slices/authSlice";

function LoginContent() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showPassword, setShowPassword] = useState(false);
    const { loading, error, user } = useAppSelector((s) => s.auth);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get("redirect") || "/dashboard";

    useEffect(() => { dispatch(initAuth()); }, [dispatch]);
    useEffect(() => { if (user) router.push(redirect); }, [user, router, redirect]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const newErrors: Record<string, string> = {};
        if (!email) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email format";
        if (!password) newErrors.password = "Password is required";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        dispatch(loginUser({ email, password }));
    };

    return (
        <div className="flex items-center justify-center pt-28 pb-16 px-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[440px]">
                <div className="text-center mb-8">
                    <h1 className="text-[28px] font-bold text-[#111827] mb-2">Welcome Back</h1>
                    <p className="text-gray-500 text-[14px]">Sign in to manage your bookings</p>
                </div>
                {error && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-6">
                        <p className="text-red-600 text-[13px]">{error}</p>
                        <button onClick={() => dispatch(clearAuthError())} className="text-red-400 text-[11px] mt-1 underline">Dismiss</button>
                    </motion.div>
                )}
                <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
                    <div className="mb-5">
                        <label className="text-gray-500 text-[10px] tracking-[1px] uppercase block mb-2">Email</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (errors.email) setErrors(prev => ({ ...prev, email: "" }));
                            }} 
                            className={`w-full bg-gray-50 border ${errors.email ? 'border-red-500' : 'border-gray-200'} rounded-xl px-4 py-3 text-[14px] outline-none focus:border-black/30 transition-colors`} 
                            placeholder="you@example.com" 
                        />
                        {errors.email && <p className="text-red-500 text-[11px] mt-1 ml-1">{errors.email}</p>}
                    </div>
                    <div className="mb-6">
                        <label className="text-gray-500 text-[10px] tracking-[1px] uppercase block mb-2">Password</label>
                        <div className="relative">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                value={password} 
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (errors.password) setErrors(prev => ({ ...prev, password: "" }));
                                }} 
                                className={`w-full bg-gray-50 border ${errors.password ? 'border-red-500' : 'border-gray-200'} rounded-xl px-4 py-3 text-[14px] outline-none focus:border-black/30 transition-colors pr-10`} 
                                placeholder="••••••••" 
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                        {errors.password && <p className="text-red-500 text-[11px] mt-1 ml-1">{errors.password}</p>}
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading} 
                        className="w-full bg-[#111827] text-white rounded-full py-3.5 text-[13px] font-medium tracking-wide hover:bg-[#1f2937] active:scale-[0.98] transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>
                <p className="text-center text-gray-500 text-[13px] mt-6">
                    Don&apos;t have an account?{" "}
                    <Link href="/auth/register" className="text-black font-medium hover:underline">Sign Up</Link>
                </p>
            </motion.div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-[#fafafa] font-['Inter',sans-serif]">
            <Navbar variant="transparent" />
            <Suspense fallback={<div className="flex items-center justify-center py-24"><p className="text-gray-400">Loading...</p></div>}>
                <LoginContent />
            </Suspense>
        </div>
    );
}

