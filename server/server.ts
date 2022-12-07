import http from "http";

const server = http.createServer((req, res) => {
  res.end("dasdsada");
});

server.listen(3000);
