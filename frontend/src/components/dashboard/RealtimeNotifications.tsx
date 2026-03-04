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
            const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:5000";
            ws.current = new WebSocket(WS_URL);

            ws.current.onopen = () => {
                console.log("🟢 Connected to WebSocket for real-time notifications");
            };

            ws.current.onmessage = (event) => {
                try {
                    const { type, data } = JSON.parse(event.data);

                    if (type === "NEW_BOOKING") {
                        toast.success("New Booking Received!", {
                            description: `${data.guest_name || "A user"} just booked ${data.car_name} for ${data.pickup_date}.`
                        });
                        dispatch(addBooking(data));
                    }

                    if (type === "NEW_MESSAGE") {
                        toast.info("New Message from Contact Form", {
                            description: `From: ${data.name} - "${data.message?.slice(0, 30)}..."`
                        });
                        dispatch(addMessage(data));
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
