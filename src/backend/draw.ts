import { Writable, Readable } from "node:stream";
import { mouse, left, right, up, down, straightTo, Button, Point } from "@nut-tree/nut-js";

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
  console.log("draw", "readableStream.on", data);
  if (data.cmd === "draw_square") {
    await drawRect(+data.arg1, +data.arg1);
  } else if (data.cmd === "draw_rectangle") {
    await drawRect(+data.arg1, +data.arg2);
  } else if (data.cmd === "draw_circle") {
    await drawCircle(+data.arg1);
  }
});

const drawRect = async (a: number, b: number) => {
  await mouse.pressButton(Button.LEFT);

  await mouse.move(right(a));
  await mouse.move(down(b));
  await mouse.move(left(a));
  await mouse.move(up(b));

  await mouse.releaseButton(Button.LEFT);
};

const drawCircle = async (r: number) => {
  const start = await mouse.getPosition();
  const center = new Point(start.x, start.y + r);
  const step = 1 / r;

  await mouse.pressButton(Button.LEFT);

  for (let rad = 0; rad <= Math.PI * 2; rad += step) {
    const y = r * Math.cos(rad);
    const x = r * Math.sin(rad);
    await mouse.move(straightTo(new Point(center.x + x, center.y - y)));
  }

  await mouse.releaseButton(Button.LEFT);
};
