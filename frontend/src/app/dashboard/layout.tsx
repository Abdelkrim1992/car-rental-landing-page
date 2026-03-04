"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { initAuth } from "@/store/slices/authSlice";
import { fetchBookings } from "@/store/slices/bookingSlice";
import { fetchMessages } from "@/store/slices/messagesSlice";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { RealtimeNotifications } from "@/components/dashboard/RealtimeNotifications";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { user, initialized } = useAppSelector((s) => s.auth);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Initialize auth
    useEffect(() => {
        dispatch(initAuth());
    }, [dispatch]);

    // Redirect if not authenticated
    useEffect(() => {
        if (initialized && !user) {
            router.push("/auth/login");
        }
    }, [initialized, user, router]);

    // Fetch bookings when user is available
    useEffect(() => {
        if (user) {
            dispatch(fetchBookings());
            dispatch(fetchMessages());
        }
    }, [user, dispatch]);

    // Loading state
    if (!initialized || !user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-green-700 border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-400 text-sm">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <RealtimeNotifications />

            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

            {/* Main Content */}
            <div className="lg:pl-64 flex flex-col min-h-screen">
                {/* Header */}
                <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

                {/* Page Content */}
                <main className="flex-1 p-4 lg:p-6">
                    <div className="max-w-[1920px] mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
