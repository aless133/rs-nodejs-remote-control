import { httpServer } from "./http_server/index";
import { backend } from "./backend/index";

const HTTP_PORT = 8181;
console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const WEBSOCKET_PORT = 8080;
console.log(`Start backend websocket on the ${WEBSOCKET_PORT} port!`);
const back = backend(WEBSOCKET_PORT);

process.on("SIGINT", () => {
  console.log("Stopping...");
  httpServer.close();
  back.close();
  process.exit();
});
