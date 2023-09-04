#!/usr/bin/env -S node

import fs from "node:fs";
import nodecrypto from "node:crypto";
import { quit, sh } from "./index.mjs";

const { webcrypto } = nodecrypto;

const sha256 = async (bytes) => {
  return new Uint8Array(await webcrypto.subtle.digest("SHA-256", bytes));
};

const toHex = (uint8Array) => {
  let result = "";
  for (const n of uint8Array) {
    result += n.toString(16).padStart(2, "0");
  }
  return result;
};

let [viteOut, viteErr] = await sh("vite build");

if (viteErr) {
  quit(viteErr);
}

let indexFileName = viteOut.match(/dist\/assets\/index-[^.]+.js/)?.[0]

console.log(indexFileName)

const data = fs.readFileSync(indexFileName);

const checksum = toHex(await sha256(data));


sh(`cp ${indexFileName} dist/assets/index-${checksum}.js`)
