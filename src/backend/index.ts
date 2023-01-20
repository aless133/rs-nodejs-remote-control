import { WebSocket, WebSocketServer } from "ws";

export const backend = (port: number) => {
  console.log("Hello! I'm backend on", port);

  const wss = new WebSocketServer({ port });

  wss.on("connection", (ws: WebSocket) => {
    console.log("Back got connect!");

    ws.on("message", (message: Buffer) => {
      console.log("\nws.Received message", message.toString());
    });
  });
};
