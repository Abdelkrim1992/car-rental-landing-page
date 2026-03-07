"use client";

import { useEffect, useRef } from "react";
import { useAppDispatch } from "@/store/hooks";
import { toast } from "sonner";
import { addBooking } from "@/store/slices/bookingSlice";
import { addMessage } from "@/store/slices/messagesSlice";

export function RealtimeNotifications(): React.ReactNode {
    const dispatch = useAppDispatch();
    const ws = useRef<WebSocket | null>(null);
    const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const connectWs = () => {
            let WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://atlasrentalcar-backend.netlify.app";

            // Automatically upgrade to wss:// if we are running over https://
            if (typeof window !== "undefined" && window.location.protocol === "https:") {
                WS_URL = WS_URL.replace(/^ws:/i, "wss:");
            }

            ws.current = new WebSocket(WS_URL);

            ws.current.onopen = () => {
                console.log("🟢 Connected to WebSocket for real-time notifications");
            };

            ws.current.onmessage = (event) => {
                try {
                    const parsed = JSON.parse(event.data);
                    const { type, data } = parsed;

                    console.log("📡 WebSocket Message Received:", type, data);

                    if (type === "NEW_BOOKING") {
                        toast.success("New Booking Received!", {
                            description: `${data.guest_name || "A user"} just booked the ${data.car_name} for ${new Date(data.pickup_date).toLocaleDateString()}.`,
                            duration: 8000,
                        });
                        dispatch(addBooking(data));
                    }

                    if (type === "NEW_MESSAGE") {
                        toast.info("New Inquiry Received", {
                            description: `From: ${data.name} - "${data.message?.slice(0, 50)}..."`,
                            duration: 8000,
                        });
                        dispatch(addMessage(data));
                    }

                    if (type === "CONNECTED") {
                        console.log("📡 WebSocket Handshake Successful:", data.message);
                    }

                } catch (err) {
                    console.error("Error processing WebSocket message:", err);
                }
            };

            ws.current.onclose = () => {
                console.log("🔴 WebSocket disconnected. Attempting to reconnect in 5s...");
                reconnectTimeout.current = setTimeout(connectWs, 5000); // Reconnect attempt
            };

            ws.current.onerror = (error) => {
                console.error("WebSocket error:", error);
                ws.current?.close();
            };
        };

        connectWs();

        return () => {
            if (reconnectTimeout.current) {
                clearTimeout(reconnectTimeout.current);
            }
            if (ws.current) {
                // Ensure we don't trigger reconnect on intentional unmount
                ws.current.onclose = null;
                ws.current.close();
            }
        };
    }, [dispatch]);

    return (
        <></>
    );
}
