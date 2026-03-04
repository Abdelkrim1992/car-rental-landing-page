import { Router, Request, Response } from "express";
import { supabaseAdmin } from "../config/supabase.js";
import { broadcastEvent } from "../wsServer.js";
import { authMiddleware, AuthRequest } from "../middleware/auth.js";

const router = Router();

// GET /api/messages — Get all messages (Admin Protected)
router.get("/", authMiddleware, async (_req: AuthRequest, res: Response) => {
    try {
        const { data, error } = await supabaseAdmin
            .from("messages")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;
        res.json(data || []);
    } catch (err) {
        console.error("Error fetching messages:", err);
        res.status(500).json({ error: "Failed to fetch messages" });
    }
});

// POST /api/messages — Submit a contact message (public)
router.post("/", async (req: Request, res: Response) => {
    try {
        const { name, email, phone, message } = req.body;

        if (!name || !email || !message) {
            res.status(400).json({ error: "Name, email, and message are required" });
            return;
        }

        const { data, error } = await supabaseAdmin
            .from("messages")
            .insert({
                name,
                email,
                phone: phone || "",
                message,
                status: "unread",
            })
            .select("*")
            .single();

        if (error) throw error;

        // Broadcast to all connected WebSocket clients (dashboard)
        broadcastEvent("NEW_MESSAGE", data);

        res.status(201).json(data);
    } catch (err) {
        console.error("Error creating message:", err);
        res.status(500).json({ error: "Failed to send message" });
    }
});

// PATCH /api/messages/:id/read — Mark message as read (Admin Protected)
router.patch("/:id/read", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { error } = await supabaseAdmin
            .from("messages")
            .update({ status: "read" })
            .eq("id", req.params.id);

        if (error) throw error;
        res.json({ success: true, id: req.params.id });
    } catch (err) {
        console.error("Error marking message read:", err);
        res.status(500).json({ error: "Failed to update message" });
    }
});

// DELETE /api/messages/:id — Delete message (Admin Protected)
router.delete("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { error } = await supabaseAdmin
            .from("messages")
            .delete()
            .eq("id", req.params.id);

        if (error) throw error;
        res.json({ success: true, id: req.params.id });
    } catch (err) {
        console.error("Error deleting message:", err);
        res.status(500).json({ error: "Failed to delete message" });
    }
});

export default router;
