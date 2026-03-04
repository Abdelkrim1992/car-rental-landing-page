import { WebSocketServer, WebSocket } from "ws";
import type { Server as HttpServer } from "http";

let wss: WebSocketServer;

export function initWebSocketServer(server: HttpServer) {
    wss = new WebSocketServer({ server });

    wss.on("connection", (ws) => {
        console.log("📡 Dashboard WebSocket client connected");

        ws.on("close", () => {
            console.log("📡 Dashboard WebSocket client disconnected");
        });

        // Send a welcome message
        ws.send(JSON.stringify({ type: "CONNECTED", data: { message: "WebSocket connected" } }));
    });

    console.log("📡 WebSocket server attached to HTTP server");
}

export function broadcastEvent(type: string, data: unknown) {
    if (!wss) return;

    const payload = JSON.stringify({ type, data });

    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(payload);
        }
    });
}
