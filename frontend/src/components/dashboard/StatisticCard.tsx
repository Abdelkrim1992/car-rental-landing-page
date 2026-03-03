"use client";

import { Users, ShoppingBag, DollarSign, CreditCard, ChevronDown, Calendar, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/store/hooks";
import { useState, useMemo, useRef, useEffect } from "react";
import { Booking } from "@/store/slices/bookingSlice";

interface StatProps {
    label: string;
    value: string;
    change: string;
    changeLabel: string;
    icon: React.ReactNode;
    iconBgColor: string;
    actionLabel?: string;
}

function StatItem({ label, value, change, changeLabel, icon, iconBgColor, actionLabel = "See Detail >" }: StatProps) {
    const isPositive = change.includes("↗");

    return (
        <div className="flex items-start justify-between">
            <div className="space-y-1">
                <p className="text-sm text-gray-600">{label}</p>
                <p className="text-2xl font-normal text-gray-900">{value}</p>
                <div className="flex items-center gap-2 text-xs">
                    <span className={isPositive ? "text-green-600" : "text-red-500"}>{change}</span>
                    <span className="text-gray-400">{changeLabel}</span>
                </div>
            </div>
            <div className="flex flex-col items-end gap-2">
                <div className={cn("p-2.5 border border-gray-200 rounded-full", iconBgColor)}>
                    {icon}
                </div>
                <button className="text-xs text-gray-300 hover:text-gray-500 transition-colors">
                    {actionLabel}
                </button>
            </div>
        </div>
    );
}

export function StatisticCard() {
    const { bookings } = useAppSelector((s) => s.booking);
    const [timeRange, setTimeRange] = useState<"7_days" | "30_days" | "all_time">("30_days");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredStats = useMemo(() => {
        const now = new Date().getTime();
        const daysInMs = (days: number) => days * 24 * 60 * 60 * 1000;

        let activeBookings = bookings;
        if (timeRange === "7_days") {
            activeBookings = bookings.filter(b => now - new Date(b.created_at).getTime() <= daysInMs(7));
        } else if (timeRange === "30_days") {
            activeBookings = bookings.filter(b => now - new Date(b.created_at).getTime() <= daysInMs(30));
        }

        const totalCustomers = new Set(activeBookings.map(b => b.guest_email || b.guest_name)).size;
        const totalIncome = activeBookings.reduce((sum, b) => sum + (Number(b.total_price) || 0), 0);
        const totalExpenses = totalIncome * 0.4; // Using 40% overhead model

        return {
            totalCustomers,
            totalOrders: activeBookings.length,
            totalIncome,
            totalExpenses
        };
    }, [bookings, timeRange]);

    const stats: StatProps[] = [
        {
            label: "Customer",
            value: String(filteredStats.totalCustomers),
            change: "↗ 12%",
            changeLabel: "vs previous",
            icon: <Users className="w-4 h-4 text-gray-600" />,
            iconBgColor: "bg-white",
        },
        {
            label: "Order",
            value: String(filteredStats.totalOrders),
            change: "↗ 8%",
            changeLabel: "vs previous",
            icon: <ShoppingBag className="w-4 h-4 text-gray-600" />,
            iconBgColor: "bg-white",
        },
        {
            label: "Income",
            value: `$${filteredStats.totalIncome.toFixed(0)}`,
            change: "↗ 15%",
            changeLabel: "vs previous",
            icon: <DollarSign className="w-4 h-4 text-gray-600" />,
            iconBgColor: "bg-white",
        },
        {
            label: "Expenses",
            value: `$${filteredStats.totalExpenses.toFixed(0)}`,
            change: "↘ 5%",
            changeLabel: "vs previous",
            icon: <CreditCard className="w-4 h-4 text-gray-600" />,
            iconBgColor: "bg-white",
        },
    ];

    const getRangeLabel = () => {
        if (timeRange === "7_days") return "Past 7 days";
        if (timeRange === "30_days") return "Past 30 days";
        return "All time";
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            {/* Header */}
            <div className="p-6 flex items-center justify-between border-b border-gray-100 relative">
                <h2 className="text-lg font-normal text-gray-900">Statistic</h2>

                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-md text-xs text-gray-600 hover:bg-gray-200 transition-colors"
                    >
                        <Calendar className="w-3 h-3" />
                        <span>{getRangeLabel()}</span>
                        <ChevronDown className="w-3 h-3" />
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-100 rounded-lg shadow-lg z-50 py-1 flex flex-col">
                            <button
                                onClick={() => { setTimeRange("7_days"); setIsDropdownOpen(false); }}
                                className="px-4 py-2 text-xs text-left hover:bg-gray-50 flex items-center justify-between"
                            >
                                Past 7 days
                                {timeRange === "7_days" && <Check className="w-3 h-3 text-green-600" />}
                            </button>
                            <button
                                onClick={() => { setTimeRange("30_days"); setIsDropdownOpen(false); }}
                                className="px-4 py-2 text-xs text-left hover:bg-gray-50 flex items-center justify-between"
                            >
                                Past 30 days
                                {timeRange === "30_days" && <Check className="w-3 h-3 text-green-600" />}
                            </button>
                            <button
                                onClick={() => { setTimeRange("all_time"); setIsDropdownOpen(false); }}
                                className="px-4 py-2 text-xs text-left hover:bg-gray-50 flex items-center justify-between"
                            >
                                All time
                                {timeRange === "all_time" && <Check className="w-3 h-3 text-green-600" />}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Stats */}
            <div className="divide-y divide-gray-100">
                {stats.map((stat, idx) => (
                    <div key={idx} className="p-6">
                        <StatItem {...stat} />
                    </div>
                ))}
            </div>
        </div>
    );
}
