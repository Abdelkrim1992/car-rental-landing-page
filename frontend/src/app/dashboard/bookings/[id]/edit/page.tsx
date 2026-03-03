"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateBooking, deleteBooking } from "@/store/slices/bookingSlice";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2, Save } from "lucide-react";

export default function EditBookingPage() {
    const params = useParams();
    const router = useRouter();
    const dispatch = useAppDispatch();

    const bookingId = params?.id as string;
    const { bookings } = useAppSelector((state) => state.booking);
    const booking = bookings.find((b) => b.id === bookingId);

    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [form, setForm] = useState({
        guest_name: "",
        guest_phone: "",
        guest_email: "",
        pickup_date: "",
        return_date: "",
        pickup_location: "",
        total_price: 0,
        status: "pending" as "pending" | "confirmed" | "completed" | "cancelled",
    });

    useEffect(() => {
        if (booking) {
            setForm({
                guest_name: booking.guest_name,
                guest_phone: booking.guest_phone,
                guest_email: booking.guest_email,
                pickup_date: booking.pickup_date,
                return_date: booking.return_date,
                pickup_location: booking.pickup_location,
                total_price: booking.total_price,
                status: booking.status,
            });
        }
    }, [booking]);

    if (!booking) {
        return (
            <div className="p-10 text-center space-y-4">
                <p className="text-slate-500">Booking not found.</p>
                <Button variant="outline" onClick={() => router.push("/dashboard/bookings")}>Go Back</Button>
            </div>
        );
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const updates = {
                ...form,
                total_price: Number(form.total_price)
            };
            await dispatch(updateBooking({ id: bookingId, updates })).unwrap();
            router.push(`/dashboard/bookings`);
        } catch (error) {
            console.error("Failed to update booking", error);
            alert("Failed to update booking: " + error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to permanently delete this booking?")) return;
        setDeleting(true);
        try {
            await dispatch(deleteBooking(bookingId)).unwrap();
            router.push("/dashboard/bookings");
        } catch (error) {
            console.error("Failed to delete", error);
            alert("Failed to delete booking.");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Edit Booking</h1>
                        <p className="text-sm text-slate-500">#{bookingId.slice(0, 5)} - {booking.car_name}</p>
                    </div>
                </div>
                <Button variant="destructive" className="gap-2 shrink-0" onClick={handleDelete} disabled={deleting}>
                    <Trash2 className="w-4 h-4" /> {deleting ? "Deleting..." : "Delete"}
                </Button>
            </div>

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Update Details</CardTitle>
                        <CardDescription>Modify customer info, dates, and status override.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Status</Label>
                                <select
                                    name="status"
                                    value={form.status}
                                    onChange={handleChange}
                                    className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="total_price">Total Price ($)</Label>
                                <Input id="total_price" name="total_price" type="number" required value={form.total_price} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="guest_name">Customer Name</Label>
                                <Input id="guest_name" name="guest_name" required value={form.guest_name} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="guest_phone">Phone</Label>
                                <Input id="guest_phone" name="guest_phone" value={form.guest_phone || ""} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="guest_email">Email</Label>
                            <Input id="guest_email" name="guest_email" type="email" value={form.guest_email || ""} onChange={handleChange} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="pickup_date">Pickup Date</Label>
                                <Input id="pickup_date" name="pickup_date" type="date" required value={form.pickup_date} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="return_date">Return Date</Label>
                                <Input id="return_date" name="return_date" type="date" required value={form.return_date} onChange={handleChange} />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="bg-slate-50 border-t py-4 flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                        <Button type="submit" className="bg-slate-900 text-white gap-2" disabled={loading}>
                            {loading ? "Saving..." : <><Save className="w-4 h-4" /> Save Changes</>}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
}
