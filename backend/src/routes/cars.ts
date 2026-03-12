import { Router, Request, Response } from "express";
import { supabaseAdmin } from "../config/supabase.js";

const router = Router();

// GET /api/cars — List all cars with optional filters
router.get("/", async (req: Request, res: Response) => {
    try {
        let query = supabaseAdmin.from("cars").select("*").eq("available", true);

        if (req.query.type && req.query.type !== "All Types") {
            query = query.eq("type", req.query.type);
        }
        if (req.query.brand && req.query.brand !== "All Brands") {
            query = query.eq("brand", req.query.brand);
        }
        if (req.query.location && req.query.location !== "All Locations") {
            query = query.eq("location", req.query.location);
        }

        const { data, error } = await query;

        if (error) throw error;

        // Map to frontend-compatible format
        const cars = (data || []).map((car) => ({
            id: car.id,
            name: car.name,
            price: `$${car.price_per_day}`,
            fuel: car.fuel,
            mileage: car.mileage,
            img: car.image_url,
            type: car.type,
            brand: car.brand,
            location: car.location,
            description: car.description,
            year: car.year,
            transmission: car.transmission,
            seats: car.seats,
            acceleration: car.acceleration,
            top_speed: car.top_speed,
            engine: car.engine,
            features: car.features || [],
            specifications: car.specifications || {},
            images: car.images || [],
            host_name: car.host_name,
            host_avatar: car.host_avatar,
            host_location: car.host_location,
            availability_days: car.availability_days || ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        }));

        res.json(cars);
    } catch (err) {
        console.error("Error fetching cars:", err);
        res.status(500).json({ error: "Failed to fetch cars" });
    }
});

// GET /api/cars/:id — Get single car
router.get("/:id", async (req: Request, res: Response) => {
    try {
        const { data, error } = await supabaseAdmin
            .from("cars")
            .select("*")
            .eq("id", req.params.id)
            .single();

        if (error || !data) {
            res.status(404).json({ error: "Car not found" });
            return;
        }

        res.json({
            id: data.id,
            name: data.name,
            price: `$${data.price_per_day}`,
            fuel: data.fuel,
            mileage: data.mileage,
            img: data.image_url,
            type: data.type,
            brand: data.brand,
            location: data.location,
            description: data.description,
            year: data.year,
            transmission: data.transmission,
            seats: data.seats,
            acceleration: data.acceleration,
            top_speed: data.top_speed,
            engine: data.engine,
            features: data.features || [],
            specifications: data.specifications || {},
            images: data.images || [],
            host_name: data.host_name,
            host_avatar: data.host_avatar,
            host_location: data.host_location,
            availability_days: data.availability_days || ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        });
    } catch (err) {
        console.error("Error fetching car:", err);
        res.status(500).json({ error: "Failed to fetch car" });
    }
});

export default router;
