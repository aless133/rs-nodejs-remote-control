import { Writable } from "node:stream";
import { WebSocket, WebSocketServer } from "ws";
import connectNav from "./nav";
import connectDraw from "./draw";
import connectPS from "./ps";

export const backend = (port: number) => {
  console.log("Hello! I'm backend on http://localhost:" + port);

  const wss = new WebSocketServer({ port });
  let socket: WebSocket;

  wss.on("connection", (ws: WebSocket) => {
    socket = ws;
    console.log("Backend got connect!");

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
    const ps = connectPS(answers);

    ws.on("message", (message: Buffer) => {
      console.log("\nws.Received message", message.toString());
      const cmd = message.toString().split(" ");
      if (["mouse_up", "mouse_down", "mouse_left", "mouse_right", "mouse_position"].includes(cmd[0])) {
        nav.push({ cmd: cmd[0], arg: cmd[1] });
      } else if (["draw_square", "draw_rectangle", "draw_circle"].includes(cmd[0])) {
        draw.push({ cmd: cmd[0], arg1: cmd[1], arg2: cmd[2] });
      } else if (["prnt_scrn"].includes(cmd[0])) {
        ps.push({ cmd: cmd[0] });
      }
    });
  });

  return {
    close: () => {
      socket.close();
      wss.close();
    },
  };
};
