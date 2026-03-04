"use client";

import { useState, useMemo, useEffect } from "react";
import { Menu, Bell, MessageSquare, Car, X, CheckSquare } from "lucide-react";
import Image from "next/image";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { fetchMessages, markMessageRead } from "@/store/slices/messagesSlice";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface HeaderProps {
    onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((s) => s.auth);
    const { bookings } = useAppSelector((s) => s.booking);
    const { messages } = useAppSelector((s) => s.messages);
    const [showNotifications, setShowNotifications] = useState(false);

    // Combine and sort notifications
    const { unreadNotifications, allNotifications } = useMemo(() => {
        const mappedBookings = bookings.map(b => ({
            id: b.id,
            type: "booking" as const,
            isNew: b.status === "pending",
            title: b.status === "pending" ? "New Booking Request" : "Booking Updated",
            description: `${b.guest_name} booked ${b.car_name}`,
            time: b.created_at,
            link: `/dashboard/bookings/${b.id}`,
            status: b.status
        }));

        const mappedMessages = messages.map(m => ({
            id: m.id,
            type: "message" as const,
            isNew: m.status === "unread",
            title: m.status === "unread" ? "New Message Received" : "Message",
            description: `From ${m.name}: ${m.message.slice(0, 40)}...`,
            time: m.created_at,
            link: `/dashboard/messages`,
            status: m.status
        }));

        const combined = [...mappedBookings, ...mappedMessages].sort(
            (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
        );

        return {
            unreadNotifications: combined.filter(n => n.isNew),
            allNotifications: combined.slice(0, 8)
        };
    }, [bookings, messages]);

    const displayList = unreadNotifications.length > 0 ? unreadNotifications : allNotifications;

    const handleMarkAllRead = () => {
        unreadNotifications.forEach(n => {
            if (n.type === "message") {
                dispatch(markMessageRead(n.id));
            }
        });
        // Note: For bookings, "read" isn't a status, only confirmed/pending. 
        // We'll leave them as is or add a separate read state if needed.
    };

    return (
        <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-30">
            <div className="h-full px-4 lg:px-6 flex items-center justify-between">
                {/* Mobile menu button & Breadcrumb */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-slate-100 rounded-lg p-1"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="hover:text-slate-900 cursor-pointer transition-colors">Dashboard</span>
                        <span className="text-gray-300">/</span>
                        <span className="font-medium text-slate-900">Overview</span>
                    </div>
                </div>

                {/* Right side - Notifications & User */}
                <div className="flex items-center gap-4">
                    {/* Notification Bell */}
                    <div className="relative">
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className={cn(
                                "relative p-2.5 text-gray-500 hover:text-slate-900 hover:bg-slate-50 transition-all rounded-full",
                                showNotifications && "bg-slate-100 text-slate-900"
                            )}
                            id="notification-bell-btn"
                        >
                            <Bell className="w-5 h-5" />
                            {unreadNotifications.length > 0 && (
                                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-600 rounded-full border-2 border-white shadow-sm animate-pulse"></span>
                            )}
                        </button>

                        {/* Notification Dropdown */}
                        {showNotifications && (
                            <div className="absolute right-0 mt-3 w-[22rem] bg-white border border-gray-100 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] z-50 overflow-hidden ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                                <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-slate-50/50">
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
                                        <p className="text-[10px] text-slate-500 mt-0.5">
                                            {unreadNotifications.length > 0
                                                ? `You have ${unreadNotifications.length} unread alerts`
                                                : "No new notifications"}
                                        </p>
                                    </div>
                                    {unreadNotifications.length > 0 && (
                                        <button
                                            onClick={handleMarkAllRead}
                                            className="text-[10px] font-bold text-green-600 hover:text-green-700 bg-white border border-green-100 px-2 py-1 rounded-md shadow-sm transition-all"
                                        >
                                            Mark all as read
                                        </button>
                                    )}
                                </div>
                                <div className="max-h-[30rem] overflow-y-auto custom-scrollbar">
                                    {displayList.length === 0 ? (
                                        <div className="p-10 text-center">
                                            <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Bell className="w-7 h-7 text-slate-200" />
                                            </div>
                                            <p className="text-sm text-slate-900 font-semibold italic">Nothing yet!</p>
                                            <p className="text-xs text-slate-400 mt-2">Any updates will appear here.</p>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-slate-50">
                                            {displayList.map((n) => (
                                                <Link
                                                    key={`${n.type}-${n.id}`}
                                                    href={n.link}
                                                    onClick={() => setShowNotifications(false)}
                                                    className={cn(
                                                        "block p-4 hover:bg-slate-50 transition-all group relative",
                                                        n.isNew && "bg-blue-50/30"
                                                    )}
                                                >
                                                    {n.isNew && (
                                                        <div className="absolute top-4 right-4 w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                                                    )}
                                                    <div className="flex gap-4">
                                                        <div className={cn(
                                                            "mt-0.5 w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                                                            n.type === 'booking' ? 'bg-indigo-600 text-white' : 'bg-amber-500 text-white'
                                                        )}>
                                                            {n.type === 'booking' ? <Car size={16} /> : <MessageSquare size={16} />}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex justify-between items-start mb-0.5">
                                                                <p className="text-xs font-bold text-slate-900 group-hover:text-slate-900">{n.title}</p>
                                                                <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap ml-2">
                                                                    {new Date(n.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                </span>
                                                            </div>
                                                            <p className="text-[11px] text-slate-500 leading-relaxed truncate group-hover:whitespace-normal">
                                                                {n.description}
                                                            </p>
                                                            <p className="text-[9px] text-slate-400 mt-1 uppercase font-bold tracking-tighter shrink-0">
                                                                {new Date(n.time).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="p-3 border-t border-slate-50 text-center bg-white">
                                    <Link
                                        href="/dashboard/messages"
                                        onClick={() => setShowNotifications(false)}
                                        className="text-[11px] font-bold text-slate-900 hover:text-green-700 transition-colors uppercase tracking-widest block py-1"
                                    >
                                        View Activity Log
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* User Profile */}
                    <div className="flex items-center gap-3 pl-2 border-l border-slate-100 ml-1">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs font-bold text-slate-900">
                                {user?.full_name || "Admin"}
                            </p>
                            <p className="text-[10px] text-slate-400 uppercase tracking-tighter font-bold">Administrator</p>
                        </div>
                        <div className="relative group cursor-pointer">
                            <Image
                                src="/images/dashboard/admin-avatar.png"
                                alt="User Avatar"
                                width={36}
                                height={36}
                                className="w-9 h-9 rounded-full object-cover shadow-sm ring-2 ring-slate-100 group-hover:ring-slate-200 transition-all"
                            />
                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Backdrop click to close */}
            {showNotifications && (
                <div
                    className="fixed inset-0 z-40 bg-transparent cursor-default"
                    onClick={() => setShowNotifications(false)}
                />
            )}
        </header>
    );
}
