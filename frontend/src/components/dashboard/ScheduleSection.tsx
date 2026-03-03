"use client";

import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useAppSelector } from "@/store/hooks";
import { useState, useMemo } from "react";
import { Booking } from "@/store/slices/bookingSlice";

export function ScheduleSection() {
    const { bookings, loading } = useAppSelector((state) => state.booking);
    const [searchQuery, setSearchQuery] = useState("");
    const [range, setRange] = useState<"Day" | "Week" | "Month">("Week");

    // Filter to confirmed/completed bookings mapped visually.
    const activeBookings = useMemo(() => {
        let filtered = bookings.filter(b => b.status === "confirmed" || b.status === "completed");

        if (searchQuery.trim()) {
            const lowerQuery = searchQuery.toLowerCase();
            filtered = filtered.filter(b =>
                b.car_name.toLowerCase().includes(lowerQuery) ||
                b.guest_name.toLowerCase().includes(lowerQuery)
            );
        }

        // Just sorting them by date for nice display
        return filtered.sort((a, b) => new Date(a.pickup_date).getTime() - new Date(b.pickup_date).getTime());
    }, [bookings, searchQuery]);

    // Simple pseudo-random color mapping based on index or car name length for UI variety
    const getColors = (name: string) => {
        const hash = name.length % 3;
        if (hash === 0) return { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-900", date: "text-blue-500" };
        if (hash === 1) return { bg: "bg-green-50", border: "border-green-200", text: "text-green-900", date: "text-green-500" };
        return { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-900", date: "text-purple-500" };
    };

    const getTimelineStyle = (booking: Booking, index: number) => {
        // Mock timeline math: roughly maps to visual boxes spreading across the grid depending on index.
        const left = index % 3 === 0 ? "5%" : index % 3 === 1 ? "15%" : "35%";
        const width = index % 2 === 0 ? "40%" : "30%";
        return { left, width };
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 overflow-hidden flex flex-col h-full min-h-[400px]">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-lg font-normal text-gray-900">Schedule Car</h2>

                {/* Tab Navigation */}
                <div className="flex items-center gap-4">
                    <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                        {["Day", "Week", "Month"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setRange(tab as any)}
                                className={cn(
                                    "px-4 py-1.5 text-sm rounded-md transition-all",
                                    range === tab ? "bg-white shadow-sm text-gray-900" : "text-gray-600 hover:bg-white hover:shadow-sm"
                                )}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="flex gap-2">
                        <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                            <ChevronLeft className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                            <ChevronRight className="w-4 h-4 text-gray-600" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Desktop View - Timeline */}
            <div className="hidden md:flex flex-col flex-1">
                {/* Search & Week Headers */}
                <div className="flex items-center border-b border-gray-100 pb-3 mb-2 shrink-0">
                    <div className="w-56 pr-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search by car or guest..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-3 pr-8 py-2 border border-gray-200 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                        </div>
                    </div>
                    <div className="flex-1 flex">
                        {["Week 01", "Week 02", "Week 03", "Week 04"].map((week, idx) => (
                            <div key={idx} className="flex-1 text-center relative border-l border-gray-50 first:border-0">
                                <span className="text-xs text-gray-600">{week}</span>
                                {idx === 2 && (
                                    <div className="absolute top-6 left-1/2 -translate-x-1/2 w-px h-[600px] border-l border-dashed border-red-400 z-10 pointer-events-none">
                                        <div className="absolute -top-6 -left-3.5 bg-red-500 text-white text-[10px] px-1.5 py-1 rounded leading-tight text-center">
                                            Today
                                        </div>
                                        <div className="absolute -top-2 -left-1 w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Schedule Rows */}
                <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2 pb-4">
                    {loading ? (
                        <div className="flex justify-center py-10"><span className="text-sm text-gray-400">Loading schedule...</span></div>
                    ) : activeBookings.length === 0 ? (
                        <div className="flex justify-center py-10"><span className="text-sm text-gray-400">No active bookings match your search.</span></div>
                    ) : (
                        activeBookings.map((b, idx) => {
                            const colors = getColors(b.guest_name);
                            const style = getTimelineStyle(b, idx);

                            return (
                                <div key={b.id} className="flex items-center py-2 h-[52px]">
                                    <div className="w-56 pr-4 shrink-0 flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden relative shrink-0">
                                            {b.car_img ? (
                                                <Image src={b.car_img} alt={b.car_name} fill className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-slate-200 rounded"></div>
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate" title={b.car_name}>{b.car_name}</p>
                                            <p className="text-xs text-gray-400 truncate">Booked</p>
                                        </div>
                                    </div>
                                    <div className="flex-1 relative h-full">
                                        {/* Grid lines */}
                                        <div className="absolute inset-0 flex">
                                            <div className="flex-1 border-l border-gray-50/50"></div>
                                            <div className="flex-1 border-l border-gray-50/50"></div>
                                            <div className="flex-1 border-l border-gray-50/50"></div>
                                            <div className="flex-1 border-l border-gray-50/50"></div>
                                        </div>

                                        <div
                                            className={cn(
                                                "absolute h-[42px] top-[5px] rounded border flex items-center gap-2 px-2 hover:shadow-md transition-shadow cursor-default z-20",
                                                colors.bg,
                                                colors.border
                                            )}
                                            style={style}
                                        >
                                            <div className="w-6 h-6 rounded-full bg-black/10 flex shrink-0 items-center justify-center text-[10px] font-bold text-black/60 uppercase">
                                                {b.guest_name.substring(0, 2)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={cn("text-[10px] font-medium truncate leading-tight", colors.text)}>
                                                    {b.guest_name}
                                                </p>
                                                <p className={cn("text-[10px] truncate leading-tight", colors.date)}>
                                                    {new Date(b.pickup_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - {new Date(b.return_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Mobile View - List */}
            <div className="md:hidden space-y-3 mt-4 overflow-y-auto">
                <div className="mb-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search by car or guest..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-3 pr-8 py-2 border border-gray-200 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-10 text-sm text-gray-400">Loading...</div>
                ) : activeBookings.length === 0 ? (
                    <div className="text-center py-10 text-sm text-gray-400">No active bookings.</div>
                ) : (
                    activeBookings.map((b) => {
                        const colors = getColors(b.guest_name);
                        return (
                            <div
                                key={b.id}
                                className={cn(
                                    "p-3 rounded-lg border flex gap-3 items-center",
                                    colors.bg,
                                    colors.border
                                )}
                            >
                                <div className="w-12 h-12 rounded overflow-hidden relative shrink-0 bg-white">
                                    {b.car_img ? (
                                        <Image src={b.car_img} alt={b.car_name} fill className="object-cover" />
                                    ) : null}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate mb-0.5">{b.car_name}</p>
                                    <p className={cn("text-xs font-medium truncate", colors.text)}>
                                        {b.guest_name}
                                    </p>
                                    <p className={cn("text-[10px] my-0.5", colors.date)}>
                                        {new Date(b.pickup_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - {new Date(b.return_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    );
}
