import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { createClient } from "@/lib/supabase/client";

export interface Message {
    id: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    status: "unread" | "read";
    created_at: string;
}

interface MessagesState {
    messages: Message[];
    loading: boolean;
    error: string | null;
}

const initialState: MessagesState = {
    messages: [],
    loading: false,
    error: null,
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Admin: fetch ALL messages via API
export const fetchMessages = createAsyncThunk("messages/fetchMessages", async (_, { rejectWithValue }) => {
    try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token || "";

        const response = await fetch(`${API_URL}/messages`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) throw new Error("Failed to fetch messages");
        const data = await response.json();
        return data as Message[];
    } catch (err) {
        return rejectWithValue(err instanceof Error ? err.message : "Failed to fetch messages");
    }
});

// Guest: send message via Contact Us
export const sendMessage = createAsyncThunk(
    "messages/sendMessage",
    async (messageData: Omit<Message, "id" | "status" | "created_at">, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_URL}/messages`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(messageData),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || "Failed to send message");
            }

            const data = await response.json();
            return data as Message;
        } catch (err) {
            return rejectWithValue(err instanceof Error ? err.message : "Failed to send message");
        }
    }
);

// Admin: mark message as read via API
export const markMessageRead = createAsyncThunk(
    "messages/markMessageRead",
    async (id: string, { rejectWithValue }) => {
        try {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token || "";

            const response = await fetch(`${API_URL}/messages/${id}/read`, {
                method: "PATCH",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (!response.ok) throw new Error("Failed to mark read");
            return id;
        } catch (err) {
            console.warn("Failed to mark message as read.", err);
            return id; // Optimistic return
        }
    }
);

// Admin: delete message via API
export const deleteMessage = createAsyncThunk(
    "messages/deleteMessage",
    async (id: string, { rejectWithValue }) => {
        try {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token || "";

            const response = await fetch(`${API_URL}/messages/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (!response.ok) throw new Error("Failed to delete");
            return id;
        } catch (err) {
            return rejectWithValue(err instanceof Error ? err.message : "Failed to delete message");
        }
    }
);

const messagesSlice = createSlice({
    name: "messages",
    initialState,
    reducers: {
        addMessage: (state, action: PayloadAction<Message>) => {
            // Check if message already exists
            if (!state.messages.find(m => m.id === action.payload.id)) {
                state.messages.unshift(action.payload);
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMessages.pending, (state) => { state.loading = true; })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.loading = false;
                state.messages = action.payload;
            })
            .addCase(fetchMessages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                // If the message wasn't already added by a WebSocket event, add it
                if (!state.messages.find(m => m.id === action.payload.id)) {
                    state.messages.unshift(action.payload);
                }
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.error = action.payload as string;
            })
            .addCase(markMessageRead.fulfilled, (state, action) => {
                const msg = state.messages.find(m => m.id === action.payload);
                if (msg) msg.status = "read";
            })
            .addCase(deleteMessage.fulfilled, (state, action) => {
                state.messages = state.messages.filter(m => m.id !== action.payload);
            });
    },
});

export const { addMessage } = messagesSlice.actions;
export default messagesSlice.reducer;

