import { Writable, Readable } from "node:stream";
import { mouse, left, right, up, down } from "@nut-tree/nut-js";

const readableStream = new Readable({
  read: () => {
    /*empty!*/
  },
  objectMode: true,
});

let parentStream: Writable;

const connect = (parent: Writable) => {
  parentStream = parent;
  return readableStream;
};

export default connect;

readableStream.on("data", async (data) => {
  console.log("nav", "readableStream.on", data);
  let ret = "";
  if (data.cmd === "mouse_up") {
    await mouse.move(up(+data.arg));
  } else if (data.cmd === "mouse_down") {
    await mouse.move(down(+data.arg));
  } else if (data.cmd === "mouse_left") {
    await mouse.move(left(+data.arg));
  } else if (data.cmd === "mouse_right") {
    await mouse.move(right(+data.arg));
  } else if (data.cmd === "mouse_position") {
    const p = await mouse.getPosition();
    ret = `mouse_position ${p.x},${p.y}`;
  }

  if (ret) {
    console.log("nav", "parentStream.write", ret);
    parentStream.write({ msg: ret });
  }
});
