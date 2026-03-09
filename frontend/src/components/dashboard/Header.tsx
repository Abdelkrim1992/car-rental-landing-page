"use client";

import { useState, useMemo } from "react";
import { Bell, MessageSquare, Car, Menu, Settings, LogOut, ChevronRight } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { markMessageRead } from "@/store/slices/messagesSlice";
import { fetchNotifications, markNotificationRead, markAllRead } from "@/store/slices/notificationsSlice";
import { logoutUser } from "@/store/slices/authSlice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    DropdownSection,
    Avatar,
    Button,
    Badge,
    Breadcrumbs,
    BreadcrumbItem,
    Divider,
    ScrollShadow
} from "@heroui/react";

interface HeaderProps {
    onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { user } = useAppSelector((s) => s.auth);
    const { bookings } = useAppSelector((s) => s.booking);
    const { notifications } = useAppSelector((s) => s.notifications);

    const handleLogout = async () => {
        await dispatch(logoutUser());
        router.push("/auth/login");
    };

    // Combine and sort notifications
    const { unreadNotifications, allNotifications } = useMemo(() => {
        // We now primarily use the database-backed notifications
        // but can still include local ones if needed, or just map them directly
        const mappedFromDb = notifications.map(n => ({
            id: n.id,
            type: n.type,
            isNew: n.status === "unread",
            title: n.title,
            description: n.description,
            time: n.created_at,
            link: n.type === 'booking' ? `/dashboard/bookings/${n.resource_id}` : `/dashboard/messages`,
            status: n.status
        }));

        const combined = [...mappedFromDb].sort(
            (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
        );

        return {
            unreadNotifications: combined.filter(n => n.isNew),
            allNotifications: combined.slice(0, 20)
        };
    }, [notifications]);

    const displayList = unreadNotifications.length > 0 ? unreadNotifications : allNotifications;

    const handleMarkAllRead = () => {
        dispatch(markAllRead());
    };

    const handleOpenChange = (isOpen: boolean) => {
        if (isOpen) {
            dispatch(fetchNotifications());
        }
    };

    return (
        <header className="h-16 bg-background border-b sticky top-0 z-30 w-full px-4 md:px-6 flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-6">
                <Button
                    isIconOnly
                    variant="light"
                    onPress={onMenuClick}
                    className="md:hidden"
                >
                    <Menu className="size-5" />
                </Button>

                <div className="hidden sm:block">
                    <Breadcrumbs variant="light">
                        <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
                        <BreadcrumbItem href="/dashboard">Overview</BreadcrumbItem>
                    </Breadcrumbs>
                </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
                {/* Notifications */}
                <Dropdown placement="bottom-end" onOpenChange={handleOpenChange}>
                    <DropdownTrigger>
                        <Button
                            isIconOnly
                            variant="light"
                            radius="full"
                            className="text-foreground-500 hover:text-foreground"
                        >
                            <Badge
                                content={unreadNotifications.length}
                                color="danger"
                                shape="circle"
                                size="sm"
                                isInvisible={unreadNotifications.length === 0}
                            >
                                <Bell className="size-5" />
                            </Badge>
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                        aria-label="Notifications"
                        className="p-0 min-w-[320px]"
                        variant="flat"
                        closeOnSelect={false}
                    >
                        <DropdownSection
                            title="Notifications"
                        >
                            {displayList.length === 0 ? (
                                <DropdownItem key="empty" className="h-24 text-center pointer-events-none">
                                    <p className="text-foreground-400">No notifications</p>
                                </DropdownItem>
                            ) : (
                                <DropdownItem key="scroll-wrapper" className="p-0">
                                    <ScrollShadow className="max-h-[350px] overflow-y-auto">
                                        {displayList.map((n) => (
                                            <Link
                                                key={`${n.type}-${n.id}`}
                                                href={n.link}
                                                onClick={() => dispatch(markNotificationRead(n.id))}
                                                className={`flex gap-4 p-4 border-b last:border-0 hover:bg-default-100 transition-colors w-full cursor-pointer ${n.isNew ? "bg-primary-50" : ""}`}
                                            >
                                                <div className="p-2 rounded-lg bg-default-100 h-fit">
                                                    {n.type === 'booking' ? <Car className="size-4" /> : <MessageSquare className="size-4" />}
                                                </div>
                                                <div className="flex flex-col flex-1">
                                                    <div className="flex justify-between items-center gap-2">
                                                        <span className="text-xs font-semibold">{n.title}</span>
                                                        <span className="text-[10px] text-foreground-400">
                                                            {new Date(n.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                    <p className="text-[11px] text-foreground-500 line-clamp-2">
                                                        {n.description}
                                                    </p>
                                                </div>
                                            </Link>
                                        ))}
                                    </ScrollShadow>
                                </DropdownItem>
                            )}
                        </DropdownSection>
                        <DropdownSection className="p-2 border-t border-default-100">
                            <DropdownItem key="actions" className="p-0">
                                <div className="flex items-center justify-between gap-2">
                                    <Button
                                        size="sm"
                                        variant="light"
                                        className="text-primary font-semibold flex-1"
                                        onPress={handleMarkAllRead}
                                    >
                                        Mark all as read
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="flat"
                                        className="text-default-500 font-semibold flex-1"
                                        as={Link}
                                        href="/dashboard/notifications"
                                    >
                                        See all
                                    </Button>
                                </div>
                            </DropdownItem>
                        </DropdownSection>
                    </DropdownMenu>
                </Dropdown>

                <Divider orientation="vertical" className="h-6" />

                {/* User Profile */}
                <Dropdown placement="bottom-end">
                    <DropdownTrigger>
                        <Button
                            variant="light"
                            className="flex items-center gap-3 px-2 py-4 rounded-xl"
                        >
                            <div className="flex flex-col items-end text-right">
                                <span className="text-sm font-semibold text-foreground leading-none">
                                    {user?.full_name || "Admin"}
                                </span>
                                <span className="text-[10px] text-foreground-400 font-bold uppercase">
                                    Administrator
                                </span>
                            </div>
                            <Avatar
                                name={user?.full_name || "Admin"}
                                size="sm"
                                color="primary"
                            />
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Profile Menu">
                        <DropdownItem key="profile" showDivider className="h-14 gap-2">
                            <p className="font-semibold">Signed in as</p>
                            <p className="font-semibold text-primary">{user?.email || "admin@renture.com"}</p>
                        </DropdownItem>
                        <DropdownItem key="settings" as={Link} href="/dashboard/settings">
                            Settings
                        </DropdownItem>
                        <DropdownItem key="logout" color="danger" className="text-danger" onPress={handleLogout}>
                            Log Out
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
        </header>
    );
}
