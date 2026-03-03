import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type { BrowseCar } from "@/data/carsData";
import { createClient } from "@/lib/supabase/client";

interface CarsState {
    cars: BrowseCar[];
    selectedCar: BrowseCar | null;
    filters: {
        type: string;
        brand: string;
        location: string;
    };
    loading: boolean;
    error: string | null;
}

const initialState: CarsState = {
    cars: [],
    selectedCar: null,
    filters: {
        type: "All Types",
        brand: "All Brands",
        location: "All Locations",
    },
    loading: false,
    error: null,
};

export const fetchCars = createAsyncThunk("cars/fetchCars", async (_, { rejectWithValue }) => {
    try {
        const supabase = createClient();
        const { data, error } = await supabase.from("cars").select("*").order("created_at", { ascending: false });
        // Map Supabase rows to match BrowseCar keys if necessary, or assume DB matches BrowseCar
        if (error) throw new Error(error.message);

        // Supabase schema maps image_url -> img, type_name -> type, etc. based on previous DB usage
        const mappedCars = data.map((c: any) => ({
            id: c.id,
            name: c.name,
            price: `$${c.price_per_day}/Day`,
            fuel: c.fuel || "Petrol",
            mileage: c.mileage || "0",
            img: c.image_url || "/images/dashboard/placeholder.png",
            type: c.type || "Car",
            brand: c.brand || "Brand",
            location: c.location || "Location",
            description: c.description || "",
            status: c.status || "Available",
        }));

        return mappedCars as BrowseCar[];
    } catch (err) {
        return rejectWithValue(err instanceof Error ? err.message : "Failed to fetch cars");
    }
});

export const fetchCarById = createAsyncThunk("cars/fetchCarById", async (id: string, { rejectWithValue }) => {
    try {
        const supabase = createClient();
        const { data, error } = await supabase.from("cars").select("*").eq("id", id).single();
        if (error) throw new Error(error.message);

        return {
            id: data.id,
            name: data.name,
            price: `$${data.price_per_day}/Day`,
            fuel: data.fuel || "Petrol",
            mileage: data.mileage || "0",
            img: data.image_url || "",
            type: data.type || "",
            brand: data.brand || "",
            location: data.location || "",
            description: data.description || "",
            status: data.status || "Available",
        } as BrowseCar;
    } catch (err) {
        return rejectWithValue(err instanceof Error ? err.message : "Car not found");
    }
});

// Admin: Create Car
export const createCar = createAsyncThunk("cars/createCar", async (carData: Partial<BrowseCar>, { rejectWithValue }) => {
    try {
        const supabase = createClient();
        const { data, error } = await supabase.from("cars").insert({
            name: carData.name,
            price_per_day: parseInt(carData.price?.replace(/[^0-9]/g, '') || "0"),
            fuel: carData.fuel,
            image_url: carData.img,
            type: carData.type,
            brand: carData.brand,
            location: carData.location,
            description: carData.description,
            status: carData.status || "Available",
        }).select().single();

        if (error) throw new Error(error.message);
        return {
            id: data.id,
            name: data.name,
            price: `$${data.price_per_day}/Day`,
            fuel: data.fuel,
            mileage: data.mileage || "0",
            img: data.image_url,
            type: data.type,
            brand: data.brand,
            location: data.location,
            description: data.description,
            status: data.status,
        } as BrowseCar;
    } catch (err) {
        return rejectWithValue(err instanceof Error ? err.message : "Failed to create car");
    }
});

// Admin: Update Car
export const updateCar = createAsyncThunk("cars/updateCar", async ({ id, updates }: { id: string, updates: Partial<BrowseCar> }, { rejectWithValue }) => {
    try {
        const supabase = createClient();
        const dbUpdates: any = {};
        if (updates.name) dbUpdates.name = updates.name;
        if (updates.price) dbUpdates.price_per_day = parseInt(updates.price.replace(/[^0-9]/g, '') || "0");
        if (updates.fuel) dbUpdates.fuel = updates.fuel;
        if (updates.img) dbUpdates.image_url = updates.img;
        if (updates.type) dbUpdates.type = updates.type;
        if (updates.brand) dbUpdates.brand = updates.brand;
        if (updates.location) dbUpdates.location = updates.location;
        if (updates.description) dbUpdates.description = updates.description;
        if (updates.status) dbUpdates.status = updates.status;

        const { data, error } = await supabase.from("cars").update(dbUpdates).eq("id", id).select();

        if (error) throw new Error(error.message);
        if (!data || data.length === 0) throw new Error("Car not found or you don't have permission to update it. Make sure RLS is configured.");

        const carData = data[0];

        return {
            id: carData.id,
            name: carData.name,
            price: `$${carData.price_per_day}/Day`,
            fuel: carData.fuel,
            mileage: carData.mileage || "0",
            img: carData.image_url,
            type: carData.type,
            brand: carData.brand,
            location: carData.location,
            description: carData.description,
            status: carData.status,
        } as BrowseCar;
    } catch (err) {
        return rejectWithValue(err instanceof Error ? err.message : "Failed to update car");
    }
});

// Admin: Delete Car
export const deleteCar = createAsyncThunk("cars/deleteCar", async (id: string, { rejectWithValue }) => {
    try {
        const supabase = createClient();
        const { error } = await supabase.from("cars").delete().eq("id", id);
        if (error) throw new Error(error.message);
        return id;
    } catch (err) {
        return rejectWithValue(err instanceof Error ? err.message : "Failed to delete car");
    }
});

const carsSlice = createSlice({
    name: "cars",
    initialState,
    reducers: {
        setFilter(state, action: PayloadAction<{ key: keyof CarsState["filters"]; value: string }>) {
            state.filters[action.payload.key] = action.payload.value;
        },
        clearFilters(state) {
            state.filters = { type: "All Types", brand: "All Brands", location: "All Locations" };
        },
        setSelectedCar(state, action: PayloadAction<BrowseCar | null>) {
            state.selectedCar = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCars.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchCars.fulfilled, (state, action) => { state.loading = false; state.cars = action.payload; })
            .addCase(fetchCars.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

            .addCase(fetchCarById.pending, (state) => { state.loading = true; })
            .addCase(fetchCarById.fulfilled, (state, action) => { state.loading = false; state.selectedCar = action.payload; })
            .addCase(fetchCarById.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

            .addCase(createCar.fulfilled, (state, action) => {
                state.cars.unshift(action.payload);
            })
            .addCase(updateCar.fulfilled, (state, action) => {
                const index = state.cars.findIndex(c => c.id === action.payload.id);
                if (index !== -1) state.cars[index] = action.payload;
            })
            .addCase(deleteCar.fulfilled, (state, action) => {
                state.cars = state.cars.filter(c => c.id !== action.payload);
            });
    },
});

export const { setFilter, clearFilters, setSelectedCar } = carsSlice.actions;
export default carsSlice.reducer;
