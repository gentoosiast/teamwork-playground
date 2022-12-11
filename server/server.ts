import http from "http";
import { IMessage } from "../interface/IMessage";
import { IOurField, IEnemyField, Cell } from '../interface/IField';
import { emptyState } from '../interface/fieldGenerator'
import { IVector } from '../interface/IVector';
import * as WebSocket from "websocket";
import { DataBase } from "./src/database/db";
import { json } from "body-parser";
const db = new DataBase();

const server = http.createServer((req, res) => {

  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'X-PINGOTHER, Content-Type')
  res.setHeader('Content-Type', 'text/plain')
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


const websocket = new WebSocket.server({ httpServer: server })
const messages: Array<string> = []
const field: Array<Array<Cell>> = emptyState()

const clients: Array<WebSocket.connection> = []
websocket.on('request', (e) => {
  const client = e.accept()
  clients.push(client)
  console.log('connect');

  client.on('message', (msg) => {
    console.log(msg)
    if (msg.type != 'utf8') return;
    const parsedMsg: IMessage = JSON.parse(msg.utf8Data)
    switch (parsedMsg.type) {
      case 'chat_message': {
        messages.push(parsedMsg.data)
        const chatObj: IMessage = {
          type: "chat_message",
          data: parsedMsg.data,
          id: 0
        }
        clients.forEach(c => {
          c.sendUTF(JSON.stringify(chatObj))
        })
        break;
      }
      case 'chat_history': {
        const chatObj: IMessage = {
          type: "chat_history",
          data: JSON.stringify(messages),
          id: 0
        }
        client.sendUTF(JSON.stringify(chatObj))
        break;
      }
      case 'attack': {
        const position: IVector = JSON.parse(parsedMsg.data);
        field[position.y][position.x] = Cell.Unavailable
        const responseObj: IMessage = {
          type: "attack",
          data: JSON.stringify(position),
          id: 0
        }
        clients.forEach((c) => c.sendUTF(JSON.stringify(responseObj)));
        break;
      }
      case 'get_field': {
        // const field: IVector = JSON.parse(parsedMsg.data);
        const responseObj: IMessage = {
          type: "get_field",
          data: JSON.stringify(field),
          id: 0
        }
        clients.forEach((c) => c.sendUTF(JSON.stringify(responseObj)));
        break;
      }
      default:
        break;
    }

  })
  client.on('close', () => {
    clients.splice(clients.indexOf(client), 1)
  })
})

