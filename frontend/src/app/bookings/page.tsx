"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchBookings } from "@/store/slices/bookingSlice";
import { Navbar } from "@/components/Navbar";
import { FooterSection as Footer } from "@/components/FooterSection";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, CarIcon, Clock } from "lucide-react";
import Image from "next/image";

export default function MyBookingsPage() {
    const dispatch = useAppDispatch();
    const { bookings, loading } = useAppSelector((state) => state.booking);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        dispatch(fetchBookings());
    }, [dispatch]);

    // Only show confirmed bookings publicly
    const confirmedBookings = bookings.filter((b) => b.status === "confirmed");

    const totalPages = Math.ceil(confirmedBookings.length / itemsPerPage);
    const paginatedBookings = confirmedBookings.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <main className="min-h-screen bg-slate-50 font-['Inter'] flex flex-col">
            <Navbar variant="solid" />

            <div className="flex-1 py-16 px-6 md:px-12 lg:px-16 max-w-7xl mx-auto w-full space-y-8 mt-10">
                <div className="space-y-2 text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-slate-900">Confirmed Bookings</h1>
                    <p className="text-slate-500 max-w-2xl mx-auto">
                        Track upcoming public fleet reservations. If your booking was accepted by an administrator, it will appear here.
                    </p>
                </div>

                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center gap-4">
                        <div className="w-8 h-8 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
                        <span className="text-sm text-slate-500">Syncing live reservations...</span>
                    </div>
                ) : confirmedBookings.length === 0 ? (
                    <div className="py-20 text-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Clock className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900">No Reservations Yet</h3>
                        <p className="text-slate-500 mt-1">There are currently no confirmed bookings in the system.</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {paginatedBookings.map((b) => (
                                <Card key={b.id} className="overflow-hidden hover:shadow-lg transition-all duration-300">
                                    <div className="h-48 bg-slate-100 relative w-full flex items-center justify-center">
                                        {b.car_img ? (
                                            <Image src={b.car_img} alt={b.car_name} fill className="object-cover" />
                                        ) : (
                                            <CarIcon className="w-12 h-12 text-slate-300" />
                                        )}
                                        <div className="absolute top-4 right-4 z-10">
                                            <Badge className="bg-green-500 uppercase tracking-wider text-[10px] py-1 shadow-md">
                                                Accepted
                                            </Badge>
                                        </div>
                                    </div>
                                    <CardHeader className="pb-4">
                                        <CardTitle className="text-xl flex items-center justify-between">
                                            <span>{b.car_name}</span>
                                        </CardTitle>
                                        <CardDescription className="text-xs">
                                            Reserved by: <span className="font-medium text-slate-700">{b.guest_name.split(' ')[0]}***</span>
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center gap-3 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                            <Calendar className="w-4 h-4 text-slate-400" />
                                            <div className="flex flex-col">
                                                <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Duration</span>
                                                <span className="font-medium text-slate-800">{b.pickup_date} <span className="text-slate-400 mx-1">to</span> {b.return_date}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                            <MapPin className="w-4 h-4 text-slate-400" />
                                            <div className="flex flex-col">
                                                <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Location</span>
                                                <span className="font-medium text-slate-800">{b.pickup_location}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 pt-8 border-t border-slate-200">
                                <Button
                                    variant="outline"
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                >
                                    Previous
                                </Button>
                                <span className="text-sm font-medium text-slate-600 px-4 py-2 bg-slate-100 rounded-md">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
}
