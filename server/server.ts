import http from "http";
import { DataBase } from "./src/database/db";
const db = new DataBase();

const server = http.createServer((req, res) => {
  console.log((new Date()) + ' Received request for ' + req.url);
  // /register?name=JohnDoe&age=42
  const reqData = req.url?.split("?");
  if (!reqData) {
    throw new Error("Empty request data");
  }
  const endpoint = reqData[0];
  if (reqData.length > 1) {
    const queryParams = reqData[1].split("&").map((el) => {
      const [key, val] = el.split("=");
      return { key, val };
    });

    queryParams[0].val = queryParams[0].val.replace('%40', '@');
    console.log(endpoint, queryParams);
    if (db.checkUser(queryParams[0].val)) {
      db.getNewUser(queryParams[0].val, queryParams[1].val);
      console.log(db.getDatabase());
    } else console.log('You are already registered');
  }
  res.end("recieved");
});

server.listen(3000, () => {
  console.log((new Date()) + ' Server is listening port 3000');
});
