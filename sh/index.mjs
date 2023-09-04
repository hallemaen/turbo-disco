#!/usr/bin/env -S node

import { promisify } from "util";
import { exec } from "child_process";

import rl from "readline";

if (parseInt(process.versions.node.split(".")[0]) < 14) {
  console.log("old node");
  process.exit();
}

export const paint = (s, ...args) =>  `\x1b[${args.join(";")}m${s}\x1b[0m`;
export const color = (c) => (s = "%s", ...args) => paint(s, c, ...args);

export const red = color(31);
export const green = color(32);
export const yellow = color(33);
export const blue = color(34);
export const purple = color(35);
export const gray = color(90);

export const args = process.argv.slice(2);

export const echo = (...args) => console.log(...args);

export const print = async (text) => {
  process.stdout.write(text);
}

export const clear = () => {
  process.stdout.cursorTo(0, 0);
  process.stdout.clearScreenDown();
};

export const exit = (code = 1) => {
  process.exit(code);
}

export const quit = (message = undefined, statusCode = undefined) => {
  if (statusCode === undefined) {
    if (message === undefined) {
      statusCode = 0;
    } else {
      statusCode = 1;
    }
  }
  if (message === undefined) {
    if (statusCode === 0) {
      message = "Good Bye!"; 
    } else {
      message = "Forced quit"; 
    }
  }
  if (statusCode === 0) {
    console.log(green(message));
  } else {
    console.error(red(message));
  }
  process.stdout.write('\x1B[?25h'); // Show cursor
  process.exit();
}

let rlif = null;

export const rlifStop = () => {
  if (rlif) {
    rlif.close();
    rlif = null;
  }
}

export const rlifStart = () => {
  let _rlif = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rlif = _rlif;
  rlif.on('pause', () => {
    if (_rlif === rlif) {
      process.exit(1);
    }
  });
}

export const ask = async (text = "") => {
  rlifStart();
  let set,
    get = new Promise((resolve) => (set = resolve));
  rlif.question(text, set);
  const answer = await get;
  rlifStop();
  return answer;
};

export const pause = async () =>
  await ask(gray("\nPress enter to continue, or ctrl+d to force quit."));

//const [stdout] = await sh`${'docker logs `docker ps -qf name=node`'}`;
//export const sh = async ([str, ...strs], ...args) => {
//  const cmd = str + strs.map((str, i) => args[i] + str).join("");
//  return await promisify(exec)(cmd).then(({ stdout, stderr }) => [ stdout, stderr ]);
//}

export const sh = async (cmd) => {
  return await promisify(exec)(cmd).then(({ stdout, stderr }) => [ stdout, stderr ]);
}
