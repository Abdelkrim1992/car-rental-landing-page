"use client";

import { MapTracking } from "@/components/dashboard/MapTracking";
import { StatisticCard } from "@/components/dashboard/StatisticCard";
import { ScheduleSection } from "@/components/dashboard/ScheduleSection";
import { OrderList } from "@/components/dashboard/OrderList";
import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { fetchBookings } from "@/store/slices/bookingSlice";
import { fetchMessages } from "@/store/slices/messagesSlice";

export default function DashboardPage() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchBookings());
        dispatch(fetchMessages());
    }, [dispatch]);

    return (
        <>
            {/* Top Section - Map & Stats */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
                {/* Map - Takes 2 columns on xl screens */}
                <div className="xl:col-span-2">
                    <MapTracking />
                </div>

                {/* Statistics - Takes 1 column on xl screens */}
                <div className="xl:col-span-1">
                    <StatisticCard />
                </div>
            </div>

            {/* Bottom Section - Schedule & Orders */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Schedule - Takes 2 columns on xl screens */}
                <div className="xl:col-span-2">
                    <ScheduleSection />
                </div>

                {/* Orders - Takes 1 column on xl screens */}
                <div className="xl:col-span-1">
                    <OrderList />
                </div>
            </div>
        </>
    );
}
