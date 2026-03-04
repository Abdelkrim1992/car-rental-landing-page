import { Router, Request, Response } from "express";
import { supabaseAdmin } from "../config/supabase.js";
import { authMiddleware, AuthRequest } from "../middleware/auth.js";
import { broadcastEvent } from "../wsServer.js";

const router = Router();

// GET /api/bookings — Get user's bookings (protected)
router.get("/", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { data, error } = await supabaseAdmin
            .from("bookings")
            .select("*, cars(name, image_url)")
            .eq("user_id", req.userId!)
            .order("created_at", { ascending: false });

        if (error) throw error;

        const bookings = (data || []).map((b: Record<string, unknown>) => ({
            id: b.id,
            car_id: b.car_id,
            car_name: (b.cars as Record<string, unknown>)?.name || "Unknown",
            car_img: (b.cars as Record<string, unknown>)?.image_url || "",
            pickup_date: b.pickup_date,
            return_date: b.return_date,
            pickup_location: b.pickup_location,
            total_price: b.total_price,
            status: b.status,
            created_at: b.created_at,
        }));

        res.json(bookings);
    } catch (err) {
        console.error("Error fetching bookings:", err);
        res.status(500).json({ error: "Failed to fetch bookings" });
    }
});

// POST /api/bookings — Create a booking (protected)
router.post("/", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { car_id, pickup_date, return_date, pickup_location, total_price } = req.body;

        if (!car_id || !pickup_date || !return_date || !pickup_location) {
            res.status(400).json({ error: "Missing required booking fields" });
            return;
        }

        const { data, error } = await supabaseAdmin
            .from("bookings")
            .insert({
                user_id: req.userId!,
                car_id,
                pickup_date,
                return_date,
                pickup_location,
                total_price: total_price || 0,
                status: "pending",
            })
            .select("*, cars(name, image_url)")
            .single();

        if (error) throw error;

        const bookingResult = {
            id: data.id,
            car_id: data.car_id,
            car_name: (data.cars as Record<string, unknown>)?.name || "Unknown",
            car_img: (data.cars as Record<string, unknown>)?.image_url || "",
            pickup_date: data.pickup_date,
            return_date: data.return_date,
            pickup_location: data.pickup_location,
            total_price: data.total_price,
            status: data.status,
            created_at: data.created_at,
        };

        // Broadcast to dashboard WebSocket clients
        broadcastEvent("NEW_BOOKING", bookingResult);

        res.status(201).json(bookingResult);
    } catch (err) {
        console.error("Error creating booking:", err);
        res.status(500).json({ error: "Failed to create booking" });
    }
});

// PATCH /api/bookings/:id — Update booking status (protected)
router.patch("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { status } = req.body;
        const validStatuses = ["pending", "confirmed", "completed", "cancelled"];

        if (!status || !validStatuses.includes(status)) {
            res.status(400).json({ error: "Invalid status" });
            return;
        }

        const { data, error } = await supabaseAdmin
            .from("bookings")
            .update({ status })
            .eq("id", req.params.id)
            .eq("user_id", req.userId!)
            .select()
            .single();

        if (error || !data) {
            res.status(404).json({ error: "Booking not found" });
            return;
        }

        res.json(data);
    } catch (err) {
        console.error("Error updating booking:", err);
        res.status(500).json({ error: "Failed to update booking" });
    }
});

// POST /api/bookings/guest — Create a guest booking (public, no auth)
router.post("/guest", async (req: Request, res: Response) => {
    try {
        const {
            car_name,
            pickup_date,
            return_date,
            pickup_location,
            booking_lat,
            booking_lng,
            total_price,
            guest_name,
            guest_email,
            guest_phone,
            guest_message,
        } = req.body;

        if (!car_name || !pickup_date || !return_date || !pickup_location) {
            res.status(400).json({ error: "Missing required booking fields" });
            return;
        }

        // Look up the car by name
        const { data: carRow, error: carError } = await supabaseAdmin
            .from("cars")
            .select("id")
            .eq("name", car_name)
            .limit(1)
            .single();

        if (carError || !carRow) {
            res.status(404).json({ error: "Car not found in database" });
            return;
        }

        const { data, error } = await supabaseAdmin
            .from("bookings")
            .insert({
                user_id: null,
                car_id: carRow.id,
                pickup_date,
                return_date,
                pickup_location,
                booking_lat,
                booking_lng,
                total_price: total_price || 0,
                guest_name: guest_name || "",
                guest_email: guest_email || "",
                guest_phone: guest_phone || "",
                guest_message: guest_message || "",
                status: "pending",
            })
            .select("*, cars(name, image_url)")
            .single();

        if (error) throw error;

        const bookingResult = {
            id: data.id,
            car_id: data.car_id,
            car_name: (data.cars as Record<string, unknown>)?.name || "Car",
            car_img: (data.cars as Record<string, unknown>)?.image_url || "",
            guest_name: data.guest_name || "",
            guest_email: data.guest_email || "",
            guest_phone: data.guest_phone || "",
            guest_message: data.guest_message || "",
            pickup_date: data.pickup_date,
            return_date: data.return_date,
            pickup_location: data.pickup_location,
            booking_lat: data.booking_lat,
            booking_lng: data.booking_lng,
            total_price: data.total_price,
            status: data.status,
            created_at: data.created_at,
        };

        // Broadcast to dashboard WebSocket clients
        broadcastEvent("NEW_BOOKING", bookingResult);

        res.status(201).json(bookingResult);
    } catch (err) {
        console.error("Error creating guest booking:", err);
        res.status(500).json({ error: "Failed to create booking" });
    }
});

// Admin: GET /api/bookings/admin — Get ALL bookings (protected)
router.get("/admin", authMiddleware, async (_req: AuthRequest, res: Response) => {
    try {
        const { data, error } = await supabaseAdmin
            .from("bookings")
            .select("*, cars(name, image_url)")
            .order("created_at", { ascending: false });

        if (error) throw error;

        const bookings = (data || []).map((b: any) => ({
            id: b.id,
            car_id: b.car_id,
            car_name: b.cars?.name || "Unknown Car",
            car_img: b.cars?.image_url || "",
            guest_name: b.guest_name || "",
            guest_email: b.guest_email || "",
            guest_phone: b.guest_phone || "",
            guest_message: b.guest_message || "",
            pickup_date: b.pickup_date,
            return_date: b.return_date,
            pickup_location: b.pickup_location,
            booking_lat: b.booking_lat,
            booking_lng: b.booking_lng,
            total_price: b.total_price,
            status: b.status,
            created_at: b.created_at,
        }));

        res.json(bookings);
    } catch (err) {
        console.error("Error fetching admin bookings:", err);
        res.status(500).json({ error: "Failed to fetch bookings" });
    }
});

// Admin: PATCH /api/bookings/admin/:id — Update ANY booking (protected)
router.patch("/admin/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { status } = req.body;
        const { data, error } = await supabaseAdmin
            .from("bookings")
            .update({ status })
            .eq("id", req.params.id)
            .select("*, cars(name, image_url)")
            .single();

        if (error || !data) {
            res.status(404).json({ error: "Booking not found" });
            return;
        }

        const result = {
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
        };

        res.json(result);
    } catch (err) {
        console.error("Error updating admin booking:", err);
        res.status(500).json({ error: "Failed to update booking" });
    }
});

// Admin: DELETE /api/bookings/admin/:id — Delete ANY booking (protected)
router.delete("/admin/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { error } = await supabaseAdmin
            .from("bookings")
            .delete()
            .eq("id", req.params.id);

        if (error) throw error;
        res.json({ success: true, id: req.params.id });
    } catch (err) {
        console.error("Error deleting admin booking:", err);
        res.status(500).json({ error: "Failed to delete booking" });
    }
});

export default router;
