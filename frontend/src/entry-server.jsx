import React from "react";
import { PassThrough } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import App from "./App";

export function render(pathname) {
  return new Promise((resolve, reject) => {
    const output = new PassThrough();
    const chunks = [];
    let failed = false;
    output.on("data", (chunk) => chunks.push(chunk));
    output.on("end", () => {
      clearTimeout(timeout);
      if (!failed) resolve(Buffer.concat(chunks).toString("utf8"));
    });
    output.on("error", reject);
    const { pipe, abort } = renderToPipeableStream(
      <StaticRouter location={pathname}><App /></StaticRouter>,
      {
        // Wait for every lazy route before emitting static HTML.
        onAllReady() { pipe(output); },
        onError(error) {
          failed = true;
          clearTimeout(timeout);
          reject(error);
        },
      },
    );
    const timeout = setTimeout(() => {
      failed = true;
      abort();
      reject(new Error(`Static rendering timed out: ${pathname}`));
    }, 15000);
  });
}
