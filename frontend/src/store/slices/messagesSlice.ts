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

// Admin: fetch ALL messages
export const fetchMessages = createAsyncThunk("messages/fetchMessages", async (_, { rejectWithValue }) => {
    try {
        const supabase = createClient();
        const { data, error } = await supabase
            .from("messages")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            throw new Error(error.message);
        }

        return (data || []) as Message[];
    } catch (err) {
        return rejectWithValue(err instanceof Error ? err.message : "Failed to fetch messages");
    }
});

// Guest: send message via Contact Us
export const sendMessage = createAsyncThunk(
    "messages/sendMessage",
    async (messageData: Omit<Message, "id" | "status" | "created_at">, { rejectWithValue }) => {
        try {
            const supabase = createClient();
            const { data, error } = await supabase
                .from("messages")
                .insert({
                    ...messageData,
                    status: "unread",
                })
                .select("*")
                .single();

            if (error) {
                throw new Error(error.message);
            }
            return data as Message;
        } catch (err) {
            return rejectWithValue(err instanceof Error ? err.message : "Failed to send message");
        }
    }
);

// Admin: mark message as read
export const markMessageRead = createAsyncThunk(
    "messages/markMessageRead",
    async (id: string, { rejectWithValue }) => {
        try {
            const supabase = createClient();
            const { error } = await supabase
                .from("messages")
                .update({ status: "read" })
                .eq("id", id);
            if (error) throw new Error(error.message);
            return id;
        } catch (err) {
            console.warn("Failed to mark message as read.", err);
            return id; // Optimistic return
        }
    }
);

// Admin: delete message
export const deleteMessage = createAsyncThunk(
    "messages/deleteMessage",
    async (id: string, { rejectWithValue }) => {
        try {
            const supabase = createClient();
            const { error } = await supabase.from("messages").delete().eq("id", id);
            if (error) throw new Error(error.message);
            return id;
        } catch (err) {
            return rejectWithValue(err instanceof Error ? err.message : "Failed to delete message");
        }
    }
);

const messagesSlice = createSlice({
    name: "messages",
    initialState,
    reducers: {},
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
                state.messages.unshift(action.payload);
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

export default messagesSlice.reducer;
