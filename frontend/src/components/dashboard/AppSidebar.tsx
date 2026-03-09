"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
    LayoutGrid,
    Car,
    Calendar,
    CreditCard,
    BarChart2,
    Link as LinkIcon,
    Settings,
    LogOut,
    Leaf,
    MessageSquare,
    ChevronRight,
    DollarSign,
    Bell,
} from "lucide-react"
import {
    Listbox,
    ListboxItem,
    Accordion,
    AccordionItem,
    Avatar,
    Divider,
    Button,
    Card,
    CardBody
} from "@heroui/react"

import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { logoutUser } from "@/store/slices/authSlice"

import { motion, AnimatePresence } from "framer-motion"

interface AppSidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export function AppSidebar({ isOpen = false, onClose }: AppSidebarProps) {
    const pathname = usePathname()
    const dispatch = useAppDispatch()
    const router = useRouter()
    const { user } = useAppSelector((s) => s.auth)
    const [isCollapsed, setIsCollapsed] = React.useState(false)

    // Sync collapse state with mobile view
    React.useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsCollapsed(false);
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleLogout = async () => {
        await dispatch(logoutUser())
        router.push("/")
    }

    const isActive = (path: string) => {
        if (path === "/dashboard" && pathname === "/dashboard") return true
        if (path !== "/dashboard" && pathname.startsWith(path)) return true
        return false
    }

    const navMain = [
        {
            title: "Home",
            items: [
                {
                    title: "Overview",
                    url: "/dashboard",
                    icon: LayoutGrid,
                    isActive: isActive("/dashboard"),
                },
            ],
        },
        {
            title: "Management",
            items: [
                {
                    title: "Vehicles",
                    url: "/dashboard/vehicles/all",
                    icon: Car,
                    isActive: pathname.includes("/vehicles"),
                    subItems: [
                        {
                            title: "All Vehicles",
                            url: "/dashboard/vehicles/all",
                        },
                        {
                            title: "Maintenance",
                            url: "/dashboard/vehicles/maintenance",
                        },
                        {
                            title: "Add Vehicle",
                            url: "/dashboard/vehicles/add",
                        },
                    ],
                },
                {
                    title: "Bookings",
                    url: "/dashboard/bookings",
                    icon: Calendar,
                    isActive: isActive("/dashboard/bookings"),
                },
                {
                    title: "Payments",
                    url: "/dashboard/payments",
                    icon: CreditCard,
                    isActive: pathname.includes("/payments"),
                    subItems: [
                        {
                            title: "Payment History",
                            url: "/dashboard/payments",
                        }
                    ]
                },
                {
                    title: "Finance",
                    url: "/dashboard/finance",
                    icon: DollarSign,
                    isActive: isActive("/dashboard/finance"),
                }
            ],
        },
        {
            title: "Other",
            items: [
                {
                    title: "Messages",
                    url: "/dashboard/messages",
                    icon: MessageSquare,
                    isActive: isActive("/dashboard/messages"),
                },
                {
                    title: "Notifications",
                    url: "/dashboard/notifications",
                    icon: Bell,
                    isActive: isActive("/dashboard/notifications"),
                },
                {
                    title: "Reports",
                    url: "/dashboard/reports",
                    icon: BarChart2,
                    isActive: isActive("/dashboard/reports"),
                },
                {
                    title: "Integrations",
                    url: "/dashboard/integrations",
                    icon: LinkIcon,
                    isActive: isActive("/dashboard/integrations"),
                },
                {
                    title: "Settings",
                    url: "/dashboard/settings",
                    icon: Settings,
                    isActive: isActive("/dashboard/settings"),
                },
            ],
        },
    ]

    const sidebarContent = (
        <aside className={`h-full bg-background border-r flex flex-col transition-all duration-300 ${isCollapsed ? "w-[80px]" : "w-64"}`}>
            {/* Header */}
            <div className={`p-4 flex items-center relative gap-3 ${isCollapsed ? "justify-center" : ""}`}>
                <Leaf className="text-primary size-6 shrink-0" />
                {!isCollapsed && <span className="font-bold text-xl whitespace-nowrap overflow-hidden">Renture</span>}

                {/* Desktop Collapse Toggle */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-5 hidden md:flex items-center justify-center bg-white border shadow-sm rounded-full size-6 text-foreground-500 hover:text-foreground transition-all z-50"
                >
                    <ChevronRight className={`size-4 transition-transform ${isCollapsed ? "" : "rotate-180"}`} />
                </button>

                {/* Mobile Close Button */}
                {onClose && (
                    <button
                        onClick={onClose}
                        className="md:hidden absolute right-2 top-4 p-2 text-foreground-400 hover:text-foreground"
                    >
                        <ChevronRight className="size-5 rotate-180" />
                    </button>
                )}
            </div>

            <Divider />

            {/* Content */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden py-2 px-2 scrollbar-hide">
                {navMain.map((group) => (
                    <div key={group.title} className="mb-4">
                        {!isCollapsed && (
                            <p className="px-3 mb-1 text-xs font-semibold text-foreground-400 uppercase whitespace-nowrap">
                                {group.title}
                            </p>
                        )}
                        <div className="space-y-1">
                            {group.items.map((item) => (
                                <div key={item.title} className="relative group/navitem">
                                    {item.subItems && !isCollapsed ? (
                                        <Accordion
                                            showDivider={false}
                                            className="px-0"
                                            itemClasses={{
                                                base: "py-0",
                                                trigger: "py-2 px-3 flex items-center gap-3",
                                                content: "pb-2 pl-10 space-y-1",
                                            }}
                                        >
                                            <AccordionItem
                                                key={item.title}
                                                aria-label={item.title}
                                                startContent={item.icon && <item.icon className="size-5 shrink-0" />}
                                                title={<span className="whitespace-nowrap">{item.title}</span>}
                                            >
                                                {item.subItems.map((subItem) => (
                                                    <Link
                                                        key={subItem.title}
                                                        href={subItem.url}
                                                        onClick={() => onClose?.()}
                                                        className={`block py-1 px-2 text-sm rounded whitespace-nowrap ${pathname === subItem.url ? "text-primary font-medium bg-primary-50" : "text-foreground-500 hover:bg-default-100"}`}
                                                    >
                                                        {subItem.title}
                                                    </Link>
                                                ))}
                                            </AccordionItem>
                                        </Accordion>
                                    ) : (
                                        <Link
                                            href={item.url}
                                            onClick={() => onClose?.()}
                                            className={`flex items-center gap-3 py-2 px-3 rounded-lg transition-colors ${isCollapsed ? "justify-center" : ""} ${item.isActive ? "bg-primary text-primary-foreground" : "text-foreground-600 hover:bg-default-100"}`}
                                            title={isCollapsed ? item.title : undefined}
                                        >
                                            {item.icon && <item.icon className="size-5 shrink-0" />}
                                            {!isCollapsed && <span className="text-sm whitespace-nowrap">{item.title}</span>}
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <Divider />

            {/* Footer */}
            <div className={`p-4 ${isCollapsed ? "flex flex-col items-center gap-3" : "space-y-3"}`}>
                <div className={`flex items-center gap-3 ${isCollapsed ? "justify-center" : ""}`}>
                    <Avatar
                        src={(user as any)?.avatar_url}
                        name={(user as any)?.full_name || "Admin"}
                        color="primary"
                        className="shrink-0"
                    />
                    {!isCollapsed && (
                        <div className="flex flex-col min-w-0">
                            <span className="text-sm font-semibold truncate">{(user as any)?.full_name || "Admin User"}</span>
                            <span className="text-xs text-foreground-400 truncate">{user?.email || "admin@renture.com"}</span>
                        </div>
                    )}
                </div>
                <Button
                    fullWidth={!isCollapsed}
                    isIconOnly={isCollapsed}
                    variant="light"
                    color="danger"
                    onPress={handleLogout}
                    className={!isCollapsed ? "justify-start" : ""}
                    title={isCollapsed ? "Logout" : undefined}
                >
                    <LogOut className="size-4 shrink-0" />
                    {!isCollapsed && <span>Logout</span>}
                </Button>
            </div>
        </aside>
    )

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden md:flex sticky top-0 h-screen z-40">
                {sidebarContent}
            </div>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] md:hidden"
                        />
                        {/* Drawer */}
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 z-[70] md:hidden shadow-2xl"
                        >
                            {sidebarContent}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}
