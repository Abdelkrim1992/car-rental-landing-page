"use client";

import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { fetchBookings, updateBooking, deleteBooking } from "@/store/slices/bookingSlice";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User, Phone, MapPin, Plus, MoreHorizontal, Check, X, Eye, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function BookingsPage() {
    const dispatch = useAppDispatch();
    const { bookings, loading } = useAppSelector((state) => state.booking);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState("10");

    useEffect(() => {
        dispatch(fetchBookings());
    }, [dispatch]);

    const rows = parseInt(rowsPerPage);
    const totalPages = Math.ceil(bookings.length / rows);
    const startIndex = (currentPage - 1) * rows;
    const paginatedBookings = bookings.slice(startIndex, startIndex + rows);

    const handleStatusChange = (id: string, status: "confirmed" | "cancelled") => {
        dispatch(updateBooking({ id, updates: { status } }));
    };

    const handleDeleteBooking = (id: string) => {
        if (window.confirm("Are you sure you want to permanently remove this booking?")) {
            dispatch(deleteBooking(id));
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "confirmed": return <Badge className="bg-green-500 hover:bg-green-600 font-bold uppercase text-[10px]">Confirmed</Badge>;
            case "pending": return <Badge variant="secondary" className="font-bold uppercase text-[10px]">Pending</Badge>;
            case "completed": return <Badge variant="outline" className="font-bold uppercase text-[10px] border-blue-200 text-blue-600 bg-blue-50">Completed</Badge>;
            default: return <Badge variant="destructive" className="font-bold uppercase text-[10px]">Cancelled</Badge>;
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Reservations</h1>
                    <p className="text-muted-foreground font-medium">Manage and track all customer booking cycles.</p>
                </div>
                <Button className="h-11 px-6 shadow-lg shadow-primary/20 gap-2" asChild>
                    <Link href="/dashboard/bookings/add">
                        <Plus className="w-4 h-4" /> Create New Booking
                    </Link>
                </Button>
            </div>

            <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-4">
                    <CardTitle className="text-2xl font-bold">Booking Directory</CardTitle>
                    <CardDescription className="text-sm font-medium">
                        Showing data from {bookings.length} reservations.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-xl border bg-background/50 overflow-hidden">
                        {loading ? (
                            <div className="py-32 flex flex-col items-center justify-center gap-4">
                                <span className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></span>
                                <span className="text-sm font-bold text-muted-foreground animate-pulse uppercase tracking-widest">Loading database...</span>
                            </div>
                        ) : bookings.length === 0 ? (
                            <div className="py-32 flex flex-col items-center justify-center text-muted-foreground gap-2">
                                <Calendar className="h-12 w-12 opacity-20" />
                                <span className="text-sm font-bold uppercase tracking-widest opacity-50">No active bookings</span>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader className="bg-muted/50">
                                    <TableRow>
                                        <TableHead className="w-[120px] font-bold uppercase text-[10px] tracking-widest">Status</TableHead>
                                        <TableHead className="font-bold uppercase text-[10px] tracking-widest">Customer</TableHead>
                                        <TableHead className="font-bold uppercase text-[10px] tracking-widest">Vehicle & Location</TableHead>
                                        <TableHead className="font-bold uppercase text-[10px] tracking-widest">Dates</TableHead>
                                        <TableHead className="text-right font-bold uppercase text-[10px] tracking-widest">Amount</TableHead>
                                        <TableHead className="text-right font-bold uppercase text-[10px] tracking-widest">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedBookings.map((b) => (
                                        <TableRow key={b.id} className="hover:bg-muted/30 transition-colors">
                                            <TableCell>
                                                {getStatusBadge(b.status || "pending")}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1.5">
                                                    <div className="font-bold text-sm tracking-tight flex items-center gap-2 group cursor-pointer">
                                                        <Avatar className="h-6 w-6 border">
                                                            <AvatarFallback className="text-[10px] font-bold bg-muted">{b.guest_name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                                        </Avatar>
                                                        <span className="group-hover:text-primary transition-colors">{b.guest_name}</span>
                                                    </div>
                                                    <div className="text-[10px] text-muted-foreground font-medium flex items-center gap-2 pl-8">
                                                        <Phone className="w-3 h-3" /> {b.guest_phone || "—"}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <span className="font-bold text-sm block tracking-tight">{b.car_name}</span>
                                                    <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1.5">
                                                        <MapPin className="w-3 h-3 text-primary/50" /> {b.pickup_location}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-[11px] font-bold space-y-0.5">
                                                    <span className="text-foreground block">{new Date(b.pickup_date).toLocaleDateString()}</span>
                                                    <span className="text-muted-foreground block text-[9px] font-medium uppercase tracking-tighter">to {new Date(b.return_date).toLocaleDateString()}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <span className="font-black text-sm tracking-tighter">
                                                    ${Number(b.total_price || 0).toLocaleString()}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48">
                                                        <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Options</DropdownMenuLabel>
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/dashboard/bookings/${b.id}`} className="flex items-center gap-2">
                                                                <Eye className="h-4 w-4" /> View Full Details
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        {b.status === "pending" && (
                                                            <>
                                                                <DropdownMenuItem className="text-green-600 focus:text-green-600 focus:bg-green-50" onClick={() => handleStatusChange(b.id, "confirmed")}>
                                                                    <Check className="h-4 w-4 mr-2" /> Confirm Booking
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10" onClick={() => handleDeleteBooking(b.id)}>
                                                                    <X className="h-4 w-4 mr-2" /> Refuse / Cancel
                                                                </DropdownMenuItem>
                                                            </>
                                                        )}
                                                        {b.status !== "pending" && (
                                                            <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10" onClick={() => handleDeleteBooking(b.id)}>
                                                                <X className="h-4 w-4 mr-2" /> Permanently Delete
                                                            </DropdownMenuItem>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                        {!loading && bookings.length > 0 && (
                            <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-6 border-t bg-muted/20 gap-4">
                                <div className="flex items-center gap-3">
                                    <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Rows per page:</span>
                                    <Select value={rowsPerPage} onValueChange={(val) => { setRowsPerPage(val); setCurrentPage(1); }}>
                                        <SelectTrigger className="w-[80px] h-8 text-xs font-bold">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="5">5</SelectItem>
                                            <SelectItem value="10">10</SelectItem>
                                            <SelectItem value="20">20</SelectItem>
                                            <SelectItem value="50">50</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-center gap-6">
                                    <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                                        {startIndex + 1}-{Math.min(startIndex + rows, bookings.length)} OF {bookings.length}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="w-10 h-10 shadow-sm"
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="w-10 h-10 shadow-sm"
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
