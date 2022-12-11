import http from "http";
import { IMessage } from "../interface/IMessage";
import { IOurField, IEnemyField, Cell } from '../interface/IField';
import { emptyState } from '../interface/fieldGenerator'
import { IVector } from '../interface/IVector';
import * as WebSocket from "websocket";
import { DataBase } from "./src/database/db";
import { json } from "body-parser";
const db = new DataBase();

interface IPlayer {
  connection: WebSocket.connection;
  index: number;
}

const ships = [
  {
    position: {x: 0, y: 0},
    direction: 1,
    length: 3
  },
  {
    position: {x: 4, y: 4},
    direction: 1,
    length: 2
  },
  {
    position: {x: 7, y: 7},
    direction: 0,
    length: 1
  }
];

const server = http.createServer((req, res) => {

  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'X-PINGOTHER, Content-Type')
  res.setHeader('Content-Type', 'text/plain')
  console.log((new Date()) + ' Received request for ' + req.url);
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
const messages: Array<string> = [];
const field: Array<Array<Cell>> = emptyState();
const field2: Array<Array<Cell>> = emptyState();
const fields = [field, field2];
let currentPlayer = 0;

const clients: Array<WebSocket.connection> = [];
const players: Array<IPlayer> = [];

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
        const player = players.find((player) => player.connection === client);
        console.log("DEBUG: currentPlayer, player.index", currentPlayer, player?.index);
        if (player?.index !== currentPlayer) {
          return;
        }
        fields[currentPlayer][position.y][position.x] = Cell.Unavailable
        players.forEach((player) => {
          const responseObj: IMessage = {
            type: "attack",
            data: JSON.stringify({position, currentPlayer}),
            id: 0
          }
          player.connection.sendUTF(JSON.stringify(responseObj))
        });
        currentPlayer = (currentPlayer + 1) % 2;
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
      case 'join': {
        players.push({connection: client, index: players.length});
        const responseObj: IMessage = {
          type: "join",
          data: JSON.stringify({ ships, idx: players.length - 1}),
          id: 0
        } 
        client.sendUTF(JSON.stringify(responseObj));
        break;
      }
      default:
        break;
    }
  })
  client.on('close', () => {
    clients.splice(clients.indexOf(client), 1);
    const playerIdx = players.findIndex(player => client === player.connection);
    if (playerIdx !== -1) {
      players.splice(playerIdx, 1);
    }
  })
})

