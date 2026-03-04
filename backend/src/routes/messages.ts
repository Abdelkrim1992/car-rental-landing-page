import { Router, Request, Response } from "express";
import { supabaseAdmin } from "../config/supabase.js";
import { broadcastEvent } from "../wsServer.js";
import { authMiddleware, AuthRequest } from "../middleware/auth.js";
import { sendEmail } from "../config/email.js";

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

// POST /api/messages/:id/reply — Send a reply to the user (Admin Protected)
router.post("/:id/reply", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { replyMessage } = req.body;
        const { id } = req.params;

        if (!replyMessage) {
            res.status(400).json({ error: "Reply message is required" });
            return;
        }

        // 1. Get the original message to find the sender's email
        const { data: message, error: fetchError } = await supabaseAdmin
            .from("messages")
            .select("*")
            .eq("id", id)
            .single();

        if (fetchError || !message) {
            res.status(404).json({ error: "Original message not found" });
            return;
        }

        // 2. Send the email
        await sendEmail(
            message.email,
            `Reply to your inquiry at Renture: ${message.message.substring(0, 20)}...`,
            replyMessage,
            `
                <div style="font-family: sans-serif; padding: 20px; color: #333;">
                    <h2>Hello ${message.name},</h2>
                    <p>Thank you for contacting Renture. Here is a reply to your inquiry:</p>
                    <div style="background: #f4f4f4; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #1a1a1a;">
                        <p style="font-style: italic; color: #666;">"${message.message}"</p>
                    </div>
                    <div style="margin-top: 20px;">
                        <p>${replyMessage.replace(/\n/g, '<br>')}</p>
                    </div>
                    <p style="margin-top: 40px; border-top: 1px solid #eee; padding-top: 10px; font-size: 12px; color: #999;">
                        Best regards,<br>
                        <strong>Renture Team</strong>
                    </p>
                </div>
            `
        );

        // 3. Mark the message as read if it wasn't already
        await supabaseAdmin
            .from("messages")
            .update({ status: "read" })
            .eq("id", id);

        res.json({ success: true, message: "Reply sent successfully" });
    } catch (err) {
        console.error("Error sending reply:", err);
        res.status(500).json({ error: "Failed to send reply" });
    }
});

export default router;
