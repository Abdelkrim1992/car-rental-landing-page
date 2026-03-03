"use client";

import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { updateBooking, deleteBooking } from "@/store/slices/bookingSlice";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User, Phone, MapPin, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function BookingsPage() {
    const dispatch = useAppDispatch();
    const { bookings, loading } = useAppSelector((state) => state.booking);

    const handleStatusChange = (id: string, status: "confirmed" | "cancelled") => {
        dispatch(updateBooking({ id, updates: { status } }));
    };

    const handleDeleteBooking = (id: string) => {
        if (window.confirm("Are you sure you want to permanently remove this booking?")) {
            dispatch(deleteBooking(id));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Reservations</h1>
                    <p className="text-sm text-slate-500">Live feed of all customer bookings.</p>
                </div>
                <Button className="bg-slate-900 text-white gap-2" asChild>
                    <Link href="/dashboard/bookings/add">
                        <Plus className="w-4 h-4" /> Create New Booking
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Bookings</CardTitle>
                    <CardDescription>
                        {bookings.length} reservations found in the database.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        {loading ? (
                            <div className="py-20 flex justify-center items-center">
                                <span className="text-sm text-slate-500">Loading bookings...</span>
                            </div>
                        ) : bookings.length === 0 ? (
                            <div className="py-20 flex justify-center items-center text-slate-400">
                                <span className="text-sm">No bookings exist yet.</span>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">Status</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Dates</TableHead>
                                        <TableHead>Vehicle</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {bookings.map((b) => (
                                        <TableRow key={b.id}>
                                            <TableCell>
                                                {b.status === "confirmed" ? (
                                                    <Badge className="bg-green-500 hover:bg-green-600">Confirmed</Badge>
                                                ) : b.status === "pending" ? (
                                                    <Badge variant="outline" className="border-orange-200 text-orange-600 bg-orange-50">Pending</Badge>
                                                ) : b.status === "completed" ? (
                                                    <Badge className="bg-blue-500 hover:bg-blue-600">Completed</Badge>
                                                ) : (
                                                    <Badge variant="secondary">Cancelled</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1">
                                                    <div className="font-medium text-slate-900 flex items-center gap-1.5 hover:underline cursor-pointer">
                                                        <User className="w-3 h-3 text-slate-400" /> {b.guest_name}
                                                    </div>
                                                    <div className="text-xs text-slate-500 flex items-center gap-1.5">
                                                        <Phone className="w-3 h-3 text-slate-400" /> {b.guest_phone || "No phone"}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm">
                                                    <span className="text-slate-900 block">{b.pickup_date}</span>
                                                    <span className="text-slate-400 text-xs text-muted-foreground block">→ {b.return_date}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="font-medium block">{b.car_name}</span>
                                                <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                                    <MapPin className="w-3 h-3" /> {b.pickup_location}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right font-medium text-slate-900 text-base">
                                                ${b.total_price?.toLocaleString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    {b.status === "pending" && (
                                                        <>
                                                            <Button size="sm" variant="outline" className="text-green-600 border-green-200 bg-green-50 hover:bg-green-100" onClick={() => handleStatusChange(b.id, "confirmed")}>Accept</Button>
                                                            <Button size="sm" variant="outline" className="text-red-600 border-red-200 bg-red-50 hover:bg-red-100" onClick={() => handleDeleteBooking(b.id)}>Refuse</Button>
                                                        </>
                                                    )}
                                                    <Button size="sm" variant="secondary" asChild>
                                                        <Link href={`/dashboard/bookings/${b.id}`}>Details</Link>
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
