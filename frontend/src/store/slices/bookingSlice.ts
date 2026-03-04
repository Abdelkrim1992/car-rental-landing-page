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
    booking_lat?: number;
    booking_lng?: number;
    total_price: number;
    status: "pending" | "confirmed" | "completed" | "cancelled";
    created_at: string;
}

export const geocodeLocation = async (address: string): Promise<{ lat: number; lng: number } | null> => {
    try {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
        if (!apiKey) {
            console.error("Google Maps API key is missing");
            return null;
        }
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`);
        const data = await response.json();
        if (data.status === "OK" && data.results.length > 0) {
            const { lat, lng } = data.results[0].geometry.location;
            return { lat, lng };
        }
        return null;
    } catch (err) {
        console.error("Geocoding error:", err);
        return null;
    }
};

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

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const fetchWithTimeout = (url: string, options?: RequestInit, timeoutMs = 15000) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    return fetch(url, { ...options, signal: controller.signal })
        .finally(() => clearTimeout(timeoutId));
};

// Admin: fetch ALL bookings via API
export const fetchBookings = createAsyncThunk("booking/fetchBookings", async (_, { rejectWithValue }) => {
    try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token || "";

        const response = await fetchWithTimeout(`${API_URL}/bookings/admin`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) throw new Error("Failed to fetch bookings");
        const data = await response.json();
        return data as Booking[];
    } catch (err) {
        const message = err instanceof Error
            ? (err.name === 'AbortError' ? 'Request timed out — please check your backend is running' : err.message)
            : "Failed to fetch bookings";
        return rejectWithValue(message);
    }
});

// Guest booking — no auth required
export const createBooking = createAsyncThunk(
    "booking/createBooking",
    async (
        bookingData: {
            car_id: string;
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
            const coords = await geocodeLocation(bookingData.pickup_location);
            const enrichedData = {
                ...bookingData,
                booking_lat: coords?.lat || null,
                booking_lng: coords?.lng || null,
            };

            const response = await fetchWithTimeout(`${API_URL}/bookings/guest`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(enrichedData),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || "Failed to create booking");
            }

            const data = await response.json();
            return data as Booking;
        } catch (err) {
            const message = err instanceof Error
                ? (err.name === 'AbortError' ? 'Request timed out — the server may be unreachable' : err.message)
                : "Failed to create booking";
            return rejectWithValue(message);
        }
    }
);

// Admin: update booking via API
export const updateBooking = createAsyncThunk(
    "booking/updateBooking",
    async ({ id, updates }: { id: string; updates: Partial<Booking> }, { rejectWithValue }) => {
        try {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token || "";

            const response = await fetchWithTimeout(`${API_URL}/bookings/admin/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(updates),
            });

            if (!response.ok) throw new Error("Failed to update booking");
            const data = await response.json();
            return data as Booking;
        } catch (err) {
            return rejectWithValue(err instanceof Error ? err.message : "Failed to update booking");
        }
    }
);

// Admin: delete booking via API
export const deleteBooking = createAsyncThunk(
    "booking/deleteBooking",
    async (id: string, { rejectWithValue }) => {
        try {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token || "";

            const response = await fetchWithTimeout(`${API_URL}/bookings/admin/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (!response.ok) throw new Error("Failed to delete booking");
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
        addBooking(state, action: PayloadAction<Booking>) {
            // Unshift only if it doesn't already exist to prevent duplicates
            if (!state.bookings.find(b => b.id === action.payload.id)) {
                state.bookings.unshift(action.payload);
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBookings.pending, (state) => { state.loading = true; })
            .addCase(fetchBookings.fulfilled, (state, action) => { state.loading = false; state.bookings = action.payload; })
            .addCase(fetchBookings.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
            .addCase(createBooking.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(createBooking.fulfilled, (state, action) => {
                state.loading = false;
                if (!state.bookings.find(b => b.id === action.payload.id)) {
                    state.bookings.unshift(action.payload);
                }
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

export const { setBookingForm, clearBookingForm, clearBookingError, addBooking } = bookingSlice.actions;
export default bookingSlice.reducer;
