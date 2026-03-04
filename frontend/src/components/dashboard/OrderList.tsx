import Image from "next/image";
import { useState } from "react";
import { Calendar, Phone, User, ChevronRight, ChevronLeft } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

interface OrderEntry {
    id: string;
    vehicle: string;
    plate: string;
    customer: string;
    phone: string;
    startDate: string;
    endDate: string;
    status: string;
    avatar: string | null;
    carImage: string | null;
}

export function OrderList() {
    const { bookings, loading: bookingsLoading } = useAppSelector((s) => s.booking);
    const { cars } = useAppSelector((s) => s.cars);

    const realOrders: OrderEntry[] = bookings.map((booking, idx) => {
        const matchedCar = cars.find(c => c.name === booking.car_name || c.id === booking.car_id);

        return {
            id: booking.id?.slice(0, 8).toUpperCase() || `ORD-${idx + 1}`,
            realId: booking.id,
            vehicle: booking.car_name || "Unknown Car",
            plate: "—",
            customer: booking.guest_name || "Guest",
            phone: booking.guest_phone || "—",
            startDate: booking.pickup_date || "—",
            endDate: booking.return_date || "—",
            status: booking.status || "pending",
            avatar: null,
            carImage: matchedCar?.img || null,
        };
    });

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;
    const totalPages = Math.ceil(realOrders.length / itemsPerPage);
    const paginatedOrders = realOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const getStatusVariant = (status: string) => {
        switch (status) {
            case "confirmed": return "default";
            case "pending": return "secondary";
            case "completed": return "outline";
            default: return "outline";
        }
    };

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-lg font-semibold">Orders</CardTitle>
                <Button variant="ghost" size="sm" className="text-xs h-8 gap-1">
                    View All <ChevronRight className="h-3 w-3" />
                </Button>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-hidden">
                {bookingsLoading ? (
                    <div className="p-12 text-center text-muted-foreground text-sm">Loading orders...</div>
                ) : realOrders.length === 0 ? (
                    <div className="p-12 text-center text-muted-foreground text-sm">No recent orders found.</div>
                ) : (
                    <div className="flex flex-col h-full">
                        <div className="divide-y">
                            {paginatedOrders.map((order) => (
                                <div key={order.id} className="p-4 hover:bg-accent/50 transition-colors">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="relative h-10 w-12 rounded bg-muted overflow-hidden border">
                                            {order.carImage ? (
                                                <Image src={order.carImage} alt={order.vehicle} fill className="object-cover" />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-[10px] text-muted-foreground">No Img</div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className="text-xs font-bold font-mono text-muted-foreground">{order.id}</span>
                                                <Badge variant={getStatusVariant(order.status) as any} className="text-[10px] h-4 px-1.5 uppercase font-bold">
                                                    {order.status}
                                                </Badge>
                                            </div>
                                            <p className="text-sm font-semibold truncate">{order.vehicle}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 mb-3 p-2 rounded-md bg-muted/30 border border-transparent">
                                        <Avatar className="h-8 w-8 border">
                                            <AvatarFallback className="text-xs bg-background text-muted-foreground">
                                                <User className="h-4 w-4" />
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <Link href={`/dashboard/bookings/${order.realId}`} className="text-xs font-bold truncate hover:text-primary transition-colors cursor-pointer">
                                                {order.customer}
                                            </Link>
                                            <p className="text-[10px] text-muted-foreground truncate">{order.phone}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                                                <Calendar className="h-3 w-3" />
                                                Start
                                            </div>
                                            <p className="text-xs font-semibold">{new Date(order.startDate).toLocaleDateString()}</p>
                                        </div>
                                        <div className="space-y-1 text-right">
                                            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium uppercase tracking-wider justify-end">
                                                <Calendar className="h-3 w-3" />
                                                End
                                            </div>
                                            <p className="text-xs font-semibold">{new Date(order.endDate).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex flex-col p-0 border-t mt-auto">
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 w-full bg-muted/20">
                        <span className="text-[10px] text-muted-foreground font-medium">Page {currentPage} of {totalPages}</span>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                            >
                                <ChevronRight className="h-3.5 w-3.5" />
                            </Button>
                        </div>
                    </div>
                )}
                {/* Ongoing/Next 5 Days Footer */}
                <div className="p-4 w-full bg-muted/10">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Ongoing</h3>
                        <span className="text-[10px] text-muted-foreground">Next 5 Days</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground text-center py-2 italic font-medium">No upcoming orders</p>
                </div>
            </CardFooter>
        </Card>
    );
}
