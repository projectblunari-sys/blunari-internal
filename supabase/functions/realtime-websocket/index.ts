import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const { headers } = req;
  const upgradeHeader = headers.get("upgrade") || "";

  if (upgradeHeader.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket connection", { 
      status: 400,
      headers: corsHeaders 
    });
  }

  try {
    const { socket, response } = Deno.upgradeWebSocket(req);
    
    // Store connected clients for broadcasting
    const clients = new Set();
    clients.add(socket);

    socket.onopen = () => {
      console.log("WebSocket connection established");
      
      // Send initial connection message
      socket.send(JSON.stringify({
        type: "connected",
        timestamp: new Date().toISOString(),
        message: "Real-time updates enabled"
      }));

      // Send periodic heartbeat
      const heartbeat = setInterval(() => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({
            type: "heartbeat",
            timestamp: new Date().toISOString()
          }));
        } else {
          clearInterval(heartbeat);
          clients.delete(socket);
        }
      }, 30000);
    };

    socket.onmessage = async (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log("Received message:", message);

        // Handle different message types
        switch (message.type) {
          case "subscribe":
            // Subscribe to specific data updates
            socket.send(JSON.stringify({
              type: "subscribed",
              channel: message.channel,
              timestamp: new Date().toISOString()
            }));
            break;

          case "dashboard_update":
            // Broadcast dashboard updates to all connected clients
            const updateMessage = JSON.stringify({
              type: "dashboard_data",
              data: message.data,
              timestamp: new Date().toISOString()
            });
            
            clients.forEach(client => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(updateMessage);
              }
            });
            break;

          case "notification":
            // Handle real-time notifications
            socket.send(JSON.stringify({
              type: "notification_received",
              notification: {
                id: crypto.randomUUID(),
                title: message.title || "New Notification",
                message: message.message,
                severity: message.severity || "info",
                timestamp: new Date().toISOString()
              }
            }));
            break;

          case "analytics_event":
            // Track analytics events in real-time
            console.log("Analytics event:", message.event);
            
            // Send acknowledgment
            socket.send(JSON.stringify({
              type: "event_tracked",
              eventId: message.eventId,
              timestamp: new Date().toISOString()
            }));
            break;

          default:
            socket.send(JSON.stringify({
              type: "error",
              message: "Unknown message type",
              timestamp: new Date().toISOString()
            }));
        }
      } catch (error) {
        console.error("Error processing message:", error);
        socket.send(JSON.stringify({
          type: "error",
          message: "Failed to process message",
          timestamp: new Date().toISOString()
        }));
      }
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
      clients.delete(socket);
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      clients.delete(socket);
    };

    return response;
  } catch (error) {
    console.error("WebSocket setup error:", error);
    return new Response("Internal Server Error", { 
      status: 500,
      headers: corsHeaders 
    });
  }
});