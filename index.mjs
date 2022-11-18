process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

import createServer from "@tomphttp/bare-server-node";
import http from "http";
import nodeStatic from "node-static";

const bare = createServer("/bare/");
const serve = new nodeStatic.Server("static/");

const server = http.createServer();

server.on("request", (req, res) => {
  if (bare.shouldRoute(req)) {
    bare.routeRequest(req, res);
  } else if (req.url.startsWith("/check")) {
    const body = "OK";
    res.writeHead(200, {
      "Content-Length": Buffer.byteLength(body),
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*",
    });
    res.end(body);
  } else {
    serve.serve(req, res);
  }
});

server.on("upgrade", (req, socket, head) => {
  if (bare.shouldRoute(req, socket, head)) {
    bare.routeUpgrade(req, socket, head);
  } else {
    socket.end();
  }
});

server.listen({
  port: process.env.PORT || 8081,
});

const rserve = new nodeStatic.Server("new/");

const rserver = http.createServer();

rserver.on("request", (req, res) => {
  rserve.serve(req, res);
});

rserver.listen({
  port: 8080,
});
