import { readFile, unlink } from "node:fs/promises";
import { Writable, Readable } from "node:stream";
import { mouse, screen, Region } from "@nut-tree/nut-js";

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
  console.log("ps", "readableStream.on", data);
  let ret = "";
  if (data.cmd === "prnt_scrn") {
    ret = await printScreen();
  }

  if (ret) {
    console.log("ps", "parentStream.write", ret);
    parentStream.write({ msg: ret });
  }
});

const printScreen = async () => {
  const w = 200;
  const center = await mouse.getPosition();
  const filename = "prnt_scrn.png";
  let ret = "";
  try {
    const r = new Region(Math.max(0, center.x - w / 2), Math.max(0, center.y - w / 2), w, w);
    const fullname = await screen.captureRegion(filename, r);
    const imageData = await readFile(fullname, "base64");
    unlink(fullname); //await
    ret = "prnt_scrn " + imageData;
  } catch (err) {
    console.error("error with printScreen", err);
  }

  return ret;
};
