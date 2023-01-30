import { Writable, Readable } from "node:stream";
import { mouse, screen, Region } from "@nut-tree/nut-js";
import Jimp from "jimp";

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
  let ret = "";
  try {
    const r = new Region(Math.max(0, center.x - w / 2), Math.max(0, center.y - w / 2), w, w);
    const sw = await screen.width();
    const sh = await screen.height();
    if (r.left + r.width > sw) {
      r.left = sw - r.width;
    }
    if (r.top + r.height > sh) {
      r.top = sh - r.width;
    }
    const image = await screen.grabRegion(r);
    const imageRGB = await image.toRGB();
    const oImg = new Jimp({ data: imageRGB.data, width: image.width, height: image.height });
    const imageBuffer = await oImg.getBufferAsync(Jimp.MIME_PNG);
    ret = "prnt_scrn " + imageBuffer.toString("base64");
  } catch (err) {
    console.error("error with printScreen", err);
  }

  // const image = await screen.grabRegion(new Region(center.x - w / 2, center.y - w / 2, w, w));

  // fs.writeFile("screenshot.png", image.data, (error) => {
  //   if (error) {
  //     console.error(error);
  //     return;
  //   }

  //   console.log("Image saved to file.");
  // });

  // console.log(image.data.toString());
  // return image.data.toString("base64");
  return ret;
};
