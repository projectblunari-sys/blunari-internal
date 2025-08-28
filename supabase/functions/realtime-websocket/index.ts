import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE, PUT',
};

interface ConnectedClient {
  id: string;
  socket: WebSocket;
  subscriptions: Set<string>;
  lastSeen: number;
}

class WebSocketManager {
  private clients = new Map<string, ConnectedClient>();
  private channels = new Map<string, Set<string>>();

  addClient(id: string, socket: WebSocket): void {
    const client: ConnectedClient = {
      id,
      socket,
      subscriptions: new Set(),
      lastSeen: Date.now()
    };
    
    this.clients.set(id, client);
    console.log(`Client ${id} connected. Total clients: ${this.clients.size}`);
  }

  removeClient(id: string): void {
    const client = this.clients.get(id);
    if (client) {
      // Remove from all channels
      for (const channel of client.subscriptions) {
        this.unsubscribeFromChannel(id, channel);
      }
      this.clients.delete(id);
      console.log(`Client ${id} disconnected. Total clients: ${this.clients.size}`);
    }
  }

  subscribeToChannel(clientId: string, channel: string): void {
    const client = this.clients.get(clientId);
    if (!client) return;

    client.subscriptions.add(channel);
    
    if (!this.channels.has(channel)) {
      this.channels.set(channel, new Set());
    }
    this.channels.get(channel)!.add(clientId);
    
    console.log(`Client ${clientId} subscribed to ${channel}`);
  }

  unsubscribeFromChannel(clientId: string, channel: string): void {
    const client = this.clients.get(clientId);
    if (client) {
      client.subscriptions.delete(channel);
    }

    const channelClients = this.channels.get(channel);
    if (channelClients) {
      channelClients.delete(clientId);
      if (channelClients.size === 0) {
        this.channels.delete(channel);
      }
    }
  }

  broadcastToChannel(channel: string, message: any): number {
    const channelClients = this.channels.get(channel);
    if (!channelClients) return 0;

    let sentCount = 0;
    const messageStr = JSON.stringify(message);

    for (const clientId of channelClients) {
      const client = this.clients.get(clientId);
      if (client && client.socket.readyState === WebSocket.OPEN) {
        try {
          client.socket.send(messageStr);
          client.lastSeen = Date.now();
          sentCount++;
        } catch (error) {
          console.error(`Failed to send to client ${clientId}:`, error);
          this.removeClient(clientId);
        }
      }
    }

    return sentCount;
  }

  broadcastToAll(message: any): number {
    let sentCount = 0;
    const messageStr = JSON.stringify(message);

    for (const [clientId, client] of this.clients) {
      if (client.socket.readyState === WebSocket.OPEN) {
        try {
          client.socket.send(messageStr);
          client.lastSeen = Date.now();
          sentCount++;
        } catch (error) {
          console.error(`Failed to send to client ${clientId}:`, error);
          this.removeClient(clientId);
        }
      }
    }

    return sentCount;
  }

  getStats() {
    return {
      totalClients: this.clients.size,
      totalChannels: this.channels.size,
      channelStats: Array.from(this.channels.entries()).map(([channel, clients]) => ({
        channel,
        subscriberCount: clients.size
      }))
    };
  }

  // Cleanup stale connections
  cleanup(): void {
    const now = Date.now();
    const staleThreshold = 5 * 60 * 1000; // 5 minutes

    for (const [clientId, client] of this.clients) {
      if (now - client.lastSeen > staleThreshold || client.socket.readyState !== WebSocket.OPEN) {
        this.removeClient(clientId);
      }
    }
  }
}

const wsManager = new WebSocketManager();

// Cleanup stale connections every 2 minutes
setInterval(() => {
  wsManager.cleanup();
}, 2 * 60 * 1000);

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
    const clientId = crypto.randomUUID();

    socket.onopen = () => {
      wsManager.addClient(clientId, socket);
      
      // Send welcome message with connection info
      socket.send(JSON.stringify({
        type: "connected",
        clientId,
        timestamp: new Date().toISOString(),
        message: "Real-time connection established"
      }));

      // Send periodic heartbeat and stats
      const heartbeatInterval = setInterval(() => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({
            type: "heartbeat",
            timestamp: new Date().toISOString(),
            stats: wsManager.getStats()
          }));
        } else {
          clearInterval(heartbeatInterval);
        }
      }, 30000);
    };

    socket.onmessage = async (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log(`Received from ${clientId}:`, message.type);

        switch (message.type) {
          case "subscribe":
            wsManager.subscribeToChannel(clientId, message.channel);
            socket.send(JSON.stringify({
              type: "subscribed",
              channel: message.channel,
              timestamp: new Date().toISOString()
            }));
            break;

          case "unsubscribe":
            wsManager.unsubscribeFromChannel(clientId, message.channel);
            socket.send(JSON.stringify({
              type: "unsubscribed",
              channel: message.channel,
              timestamp: new Date().toISOString()
            }));
            break;

          case "dashboard_update":
            const updateCount = wsManager.broadcastToChannel("dashboard", {
              type: "dashboard_data",
              data: message.data,
              timestamp: new Date().toISOString(),
              source: clientId
            });
            
            socket.send(JSON.stringify({
              type: "broadcast_complete",
              recipients: updateCount,
              timestamp: new Date().toISOString()
            }));
            break;

          case "notification":
            const notificationCount = wsManager.broadcastToAll({
              type: "notification_received",
              notification: {
                id: crypto.randomUUID(),
                title: message.title || "New Notification",
                message: message.message,
                severity: message.severity || "info",
                timestamp: new Date().toISOString(),
                source: clientId
              }
            });

            socket.send(JSON.stringify({
              type: "notification_sent",
              recipients: notificationCount,
              timestamp: new Date().toISOString()
            }));
            break;

          case "analytics_event":
            console.log("Analytics event:", {
              event: message.event,
              data: message.data,
              clientId
            });
            
            // Broadcast to analytics channel
            wsManager.broadcastToChannel("analytics", {
              type: "analytics_data",
              event: message.event,
              data: message.data,
              timestamp: new Date().toISOString()
            });

            socket.send(JSON.stringify({
              type: "event_tracked",
              eventId: message.eventId,
              timestamp: new Date().toISOString()
            }));
            break;

          case "ping":
            socket.send(JSON.stringify({
              type: "pong",
              timestamp: new Date().toISOString()
            }));
            break;

          case "get_stats":
            socket.send(JSON.stringify({
              type: "stats",
              data: wsManager.getStats(),
              timestamp: new Date().toISOString()
            }));
            break;

          default:
            socket.send(JSON.stringify({
              type: "error",
              message: `Unknown message type: ${message.type}`,
              timestamp: new Date().toISOString()
            }));
        }
      } catch (error) {
        console.error("Error processing message:", error);
        socket.send(JSON.stringify({
          type: "error",
          message: "Failed to process message",
          error: error.message,
          timestamp: new Date().toISOString()
        }));
      }
    };

    socket.onclose = () => {
      wsManager.removeClient(clientId);
    };

    socket.onerror = (error) => {
      console.error("WebSocket error for client", clientId, ":", error);
      wsManager.removeClient(clientId);
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