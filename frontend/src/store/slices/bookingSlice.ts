import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { createClient } from "@/lib/supabase/client";

export interface Booking {
    id: string;
    car_id: string;
    car_name: string;
    car_img: string;
    guest_name: string;
    guest_email: string;
    guest_phone: string;
    guest_message: string;
    pickup_date: string;
    return_date: string;
    pickup_location: string;
    total_price: number;
    status: "pending" | "confirmed" | "completed" | "cancelled";
    created_at: string;
}

interface BookingFormState {
    carId: string;
    pickupDate: string;
    returnDate: string;
    pickupLocation: string;
    guestName: string;
    guestEmail: string;
    guestPhone: string;
    guestMessage: string;
}

interface BookingState {
    bookings: Booking[];
    form: BookingFormState;
    loading: boolean;
    error: string | null;
}

const initialState: BookingState = {
    bookings: [],
    form: {
        carId: "",
        pickupDate: "",
        returnDate: "",
        pickupLocation: "",
        guestName: "",
        guestEmail: "",
        guestPhone: "",
        guestMessage: "",
    },
    loading: false,
    error: null,
};

// Admin: fetch ALL bookings
export const fetchBookings = createAsyncThunk("booking/fetchBookings", async (_, { rejectWithValue }) => {
    try {
        const supabase = createClient();
        const { data, error } = await supabase
            .from("bookings")
            .select("*, cars(name, image_url)")
            .order("created_at", { ascending: false });

        if (error) throw new Error(error.message);
        return (data || []).map((b: Record<string, unknown>) => ({
            id: b.id,
            car_id: b.car_id,
            car_name: (b.cars as Record<string, string>)?.name || "Unknown Car",
            car_img: (b.cars as Record<string, string>)?.image_url || "",
            guest_name: b.guest_name || "",
            guest_email: b.guest_email || "",
            guest_phone: b.guest_phone || "",
            guest_message: b.guest_message || "",
            pickup_date: b.pickup_date,
            return_date: b.return_date,
            pickup_location: b.pickup_location,
            total_price: b.total_price,
            status: b.status,
            created_at: b.created_at,
        })) as Booking[];
    } catch (err) {
        return rejectWithValue(err instanceof Error ? err.message : "Failed to fetch bookings");
    }
});

// Guest booking — no auth required
export const createBooking = createAsyncThunk(
    "booking/createBooking",
    async (
        bookingData: {
            car_name: string;
            pickup_date: string;
            return_date: string;
            pickup_location: string;
            total_price: number;
            guest_name: string;
            guest_email: string;
            guest_phone: string;
            guest_message: string;
        },
        { rejectWithValue }
    ) => {
        try {
            const supabase = createClient();

            // Look up the Supabase car UUID by name
            const { data: carRow, error: carError } = await supabase
                .from("cars")
                .select("id")
                .eq("name", bookingData.car_name)
                .limit(1)
                .single();

            if (carError || !carRow) throw new Error("Car not found in database");

            const { data, error } = await supabase
                .from("bookings")
                .insert({
                    user_id: null,
                    car_id: carRow.id,
                    pickup_date: bookingData.pickup_date,
                    return_date: bookingData.return_date,
                    pickup_location: bookingData.pickup_location,
                    total_price: bookingData.total_price,
                    guest_name: bookingData.guest_name,
                    guest_email: bookingData.guest_email,
                    guest_phone: bookingData.guest_phone,
                    guest_message: bookingData.guest_message,
                    status: "pending",
                })
                .select("*, cars(name, image_url)")
                .single();

            if (error) throw new Error(error.message);
            return {
                id: data.id,
                car_id: data.car_id,
                car_name: data.cars?.name || "Car",
                car_img: data.cars?.image_url || "",
                guest_name: data.guest_name || "",
                guest_email: data.guest_email || "",
                guest_phone: data.guest_phone || "",
                guest_message: data.guest_message || "",
                pickup_date: data.pickup_date,
                return_date: data.return_date,
                pickup_location: data.pickup_location,
                total_price: data.total_price,
                status: data.status,
                created_at: data.created_at,
            } as Booking;
        } catch (err) {
            return rejectWithValue(err instanceof Error ? err.message : "Failed to create booking");
        }
    }
);

export const updateBooking = createAsyncThunk(
    "booking/updateBooking",
    async ({ id, updates }: { id: string; updates: Partial<Booking> }, { rejectWithValue }) => {
        try {
            const supabase = createClient();
            const { data, error } = await supabase
                .from("bookings")
                .update(updates)
                .eq("id", id)
                .select("*, cars(name, image_url)")
                .single();

            if (error) throw new Error(error.message);

            return {
                id: data.id,
                car_id: data.car_id,
                car_name: data.cars?.name || "Unknown Car",
                car_img: data.cars?.image_url || "",
                guest_name: data.guest_name || "",
                guest_email: data.guest_email || "",
                guest_phone: data.guest_phone || "",
                guest_message: data.guest_message || "",
                pickup_date: data.pickup_date,
                return_date: data.return_date,
                pickup_location: data.pickup_location,
                total_price: data.total_price,
                status: data.status,
                created_at: data.created_at,
            } as Booking;
        } catch (err) {
            return rejectWithValue(err instanceof Error ? err.message : "Failed to update booking");
        }
    }
);

export const deleteBooking = createAsyncThunk(
    "booking/deleteBooking",
    async (id: string, { rejectWithValue }) => {
        try {
            const supabase = createClient();
            const { error, count } = await supabase.from("bookings").delete({ count: "exact" }).eq("id", id);

            if (error) throw new Error(error.message);
            if (count === 0) throw new Error("Booking not found or RLS policy prevented deletion.");

            return id;
        } catch (err) {
            return rejectWithValue(err instanceof Error ? err.message : "Failed to delete booking");
        }
    }
);

const bookingSlice = createSlice({
    name: "booking",
    initialState,
    reducers: {
        setBookingForm(state, action: PayloadAction<Partial<BookingFormState>>) {
            state.form = { ...state.form, ...action.payload };
        },
        clearBookingForm(state) {
            state.form = initialState.form;
        },
        clearBookingError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBookings.pending, (state) => { state.loading = true; })
            .addCase(fetchBookings.fulfilled, (state, action) => { state.loading = false; state.bookings = action.payload; })
            .addCase(fetchBookings.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
            .addCase(createBooking.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(createBooking.fulfilled, (state, action) => {
                state.loading = false;
                state.bookings.unshift(action.payload);
            })
            .addCase(createBooking.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
            .addCase(updateBooking.fulfilled, (state, action) => {
                const index = state.bookings.findIndex((b) => b.id === action.payload.id);
                if (index !== -1) {
                    state.bookings[index] = action.payload;
                }
            })
            .addCase(updateBooking.rejected, (state, action) => {
                state.error = action.payload as string;
                alert("Failed to update booking: " + String(action.payload));
            })
            .addCase(deleteBooking.fulfilled, (state, action) => {
                state.bookings = state.bookings.filter((b) => b.id !== action.payload);
            })
            .addCase(deleteBooking.rejected, (state, action) => {
                state.error = action.payload as string;
                alert("Failed to delete booking: " + String(action.payload));
            });
    },
});

export const { setBookingForm, clearBookingForm, clearBookingError } = bookingSlice.actions;
export default bookingSlice.reducer;
