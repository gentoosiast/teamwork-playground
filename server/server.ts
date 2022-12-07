import http from "http";

const server = http.createServer((req, res) => {
  console.log(req.url);
  // /register?name=JohnDoe&age=42
  const reqData = req.url?.split("?");
  if (!reqData) {
    throw new Error("Empty request data");
  }
  const endpoint = reqData[0];
  const queryParams = reqData[1].split("&").map((el) => {
    const [key, val] = el.split("=");
    return { key, val };
  });
  console.log(endpoint, queryParams);
  res.end("dasdsada");
});

server.listen(3000);
