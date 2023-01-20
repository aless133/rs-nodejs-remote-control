import { Writable } from "node:stream";
import { WebSocket, WebSocketServer } from "ws";
import connectNav from "./nav";
import connectDraw from "./draw";

export const backend = (port: number) => {
  console.log("Hello! I'm backend on", port);

  const wss = new WebSocketServer({ port });

  wss.on("connection", (ws: WebSocket) => {
    console.log("Back got connect!");

    const answers = new Writable({
      objectMode: true,
      write(data, encoding, callback) {
        console.log("answers.Writeable Received data goes to ws.send", data);
        ws.send(data.msg);
        callback();
      },
    });

    const nav = connectNav(answers);
    const draw = connectDraw(answers);

    ws.on("message", (message: Buffer) => {
      console.log("\nws.Received message", message.toString());
      const cmd = message.toString().split(" ");
      if (["mouse_up", "mouse_down", "mouse_left", "mouse_right", "mouse_position"].includes(cmd[0])) {
        nav.push({ cmd: cmd[0], arg: cmd[1] });
      } else if (["draw_square", "draw_rectangle", "draw_circle"].includes(cmd[0])) {
        draw.push({ cmd: cmd[0], arg1: cmd[1], arg2: cmd[2] });
      }
    });
  });
};
