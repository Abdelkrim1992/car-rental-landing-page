import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export interface AgencySettings {
    id: string;
    business_name: string;
    tagline: string;
    hero_title: string;
    hero_subtitle: string;
    phone: string;
    email: string;
    address: string;
    working_hours: string;
    stats_cars: number;
    stats_rentals: number;
}

interface SettingsState {
    data: AgencySettings | null;
    loading: boolean;
    error: string | null;
}

const initialState: SettingsState = {
    data: null,
    loading: false,
    error: null,
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const fetchSettings = createAsyncThunk("settings/fetchSettings", async (_, { rejectWithValue }) => {
    try {
        const response = await fetch(`${API_URL}/settings`);
        if (!response.ok) throw new Error("Failed to fetch settings");
        const data = await response.json();
        return data as AgencySettings;
    } catch (err) {
        return rejectWithValue(err instanceof Error ? err.message : "Failed to fetch settings");
    }
});

export const updateSettings = createAsyncThunk(
    "settings/updateSettings",
    async (settingsData: Partial<AgencySettings>, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token") || "";
            const response = await fetch(`${API_URL}/settings`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(settingsData),
            });

            if (!response.ok) throw new Error("Failed to update settings");
            const data = await response.json();
            return data as AgencySettings;
        } catch (err) {
            return rejectWithValue(err instanceof Error ? err.message : "Failed to update settings");
        }
    }
);

const settingsSlice = createSlice({
    name: "settings",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSettings.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchSettings.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchSettings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(updateSettings.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(updateSettings.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(updateSettings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default settingsSlice.reducer;
